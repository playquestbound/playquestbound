import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { useUpdateStats } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
}

interface RunState {
  isRunning: boolean;
  isPaused: boolean;
  distance: number;
  duration: number;
  positions: Position[];
  currentPosition: Position | null;
  locationError: string | null;
}

interface RunContextType extends RunState {
  startTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => Promise<void>;
}

const RunContext = createContext<RunContextType | null>(null);

const XP_PER_KM = 100;

export function RunProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const updateStats = useUpdateStats();

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [totalXpAwarded, setTotalXpAwarded] = useState(0);

  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const lastPositionRef = useRef<Position | null>(null);
  const lastXpDistanceRef = useRef(0);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const R = 6371e3;
    const phi1 = (pos1.lat * Math.PI) / 180;
    const phi2 = (pos2.lat * Math.PI) / 180;
    const deltaPhi = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const deltaLambda = ((pos2.lng - pos1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handlePositionUpdate = useCallback((location: Location.LocationObject) => {
    const newPos: Position = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      timestamp: location.timestamp,
    };

    setCurrentPosition(newPos);
    setLocationError(null);

    if (isRunningRef.current && !isPausedRef.current) {
      const lastPos = lastPositionRef.current;
      if (lastPos) {
        const dist = calculateDistance(lastPos, newPos);
        if (dist > 3) {
          setDistance((d) => {
            const newDistance = d + dist;

            const lastXpDistance = lastXpDistanceRef.current;
            const xpThresholdsCrossed = Math.floor(newDistance / 100) - Math.floor(lastXpDistance / 100);

            if (xpThresholdsCrossed > 0) {
              const xpToAward = xpThresholdsCrossed * 10;
              lastXpDistanceRef.current = newDistance;
              updateStats.mutateAsync({ xpGain: xpToAward, goldGain: 0 }).catch(console.error);
              setTotalXpAwarded((prev) => prev + xpToAward);
            }

            return newDistance;
          });
          setPositions((prev) => [...prev, newPos]);
          lastPositionRef.current = newPos;
        }
      } else {
        lastPositionRef.current = newPos;
        setPositions([newPos]);
      }
    }
  }, [updateStats]);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to track your adventures.');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setPositions([]);
    setDistance(0);
    setDuration(0);
    setTotalXpAwarded(0);
    lastPositionRef.current = null;
    lastXpDistanceRef.current = 0;

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 3,
      },
      handlePositionUpdate
    );

    locationSubRef.current = sub;

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    Alert.alert('Exploration Started', 'GPS tracking active. Start moving!');
  };

  const pauseTracking = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resumeTracking = () => {
    setIsPaused(false);
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  };

  const stopTracking = async () => {
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const distanceKm = distance / 1000;
    const pace = duration > 0 && distanceKm > 0 ? duration / 60 / distanceKm : 0;

    const remainingDistance = distance - lastXpDistanceRef.current;
    const remainingXp = Math.floor((remainingDistance / 1000) * XP_PER_KM);
    const finalTotalXp = totalXpAwarded + remainingXp;

    if (remainingXp > 0) {
      try {
        await updateStats.mutateAsync({ xpGain: remainingXp, goldGain: 0 });
      } catch (error) {
        console.error('Failed to award remaining XP:', error);
      }
    }

    if (user) {
      try {
        const { error: journalError } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            entry_type: 'run',
            title: `${distanceKm.toFixed(2)} km Exploration`,
            description: `Completed a ${distanceKm.toFixed(2)} km exploration in ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
            distance_km: distanceKm,
            duration_seconds: duration,
            avg_pace: pace > 0 ? pace : null,
            xp_earned: finalTotalXp,
            gold_earned: 0,
            route_data: positions.length > 0 ? { positions } : null,
          } as any);

        if (journalError) {
          console.error('Failed to save journal entry:', journalError);
        }
      } catch (err) {
        console.error('Journal save error:', err);
      }
    }

    Alert.alert(
      'Exploration Complete!',
      `You explored ${distanceKm.toFixed(2)} km and earned ${finalTotalXp} XP! Saved to journal.`
    );

    setIsRunning(false);
    setIsPaused(false);
    setDistance(0);
    setDuration(0);
    setPositions([]);
  };

  useEffect(() => {
    return () => {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <RunContext.Provider
      value={{
        isRunning,
        isPaused,
        distance,
        duration,
        positions,
        currentPosition,
        locationError,
        startTracking,
        pauseTracking,
        resumeTracking,
        stopTracking,
      }}
    >
      {children}
    </RunContext.Provider>
  );
}

export function useRunTracker() {
  const context = useContext(RunContext);
  if (!context) {
    throw new Error('useRunTracker must be used within a RunProvider');
  }
  return context;
}
