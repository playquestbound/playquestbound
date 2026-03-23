import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateStats } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  navigateToRun: () => void;
}

const RunContext = createContext<RunContextType | null>(null);

const XP_PER_KM = 100;

export function RunProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
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

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const lastPositionRef = useRef<Position | null>(null);
  const lastXpDistanceRef = useRef(0); // Track distance at which XP was last awarded

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const R = 6371e3;
    const φ1 = (pos1.lat * Math.PI) / 180;
    const φ2 = (pos2.lat * Math.PI) / 180;
    const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const newPos: Position = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: position.timestamp,
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
            
            // Check if we've crossed a 100m threshold
            const lastXpDistance = lastXpDistanceRef.current;
            const xpThresholdsCrossed = Math.floor(newDistance / 100) - Math.floor(lastXpDistance / 100);
            
            if (xpThresholdsCrossed > 0) {
              // Award XP for each 100m crossed (100 XP per km = 10 XP per 100m)
              const xpToAward = xpThresholdsCrossed * 10;
              lastXpDistanceRef.current = newDistance;
              
              // Update stats in background
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

  const handlePositionError = (error: GeolocationPositionError) => {
    setLocationError(error.message);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Not Supported',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
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

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    toast({
      title: 'Exploration Started',
      description: 'GPS tracking active. Start moving!',
    });
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
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const distanceKm = distance / 1000;
    const pace = duration > 0 && distanceKm > 0 ? duration / 60 / distanceKm : 0;
    
    // Calculate any remaining XP not yet awarded (for partial 100m segments)
    const remainingDistance = distance - lastXpDistanceRef.current;
    const remainingXp = Math.floor((remainingDistance / 1000) * XP_PER_KM);
    const finalTotalXp = totalXpAwarded + remainingXp;
    
    // Award remaining XP if any
    if (remainingXp > 0) {
      try {
        await updateStats.mutateAsync({ xpGain: remainingXp, goldGain: 0 });
      } catch (error) {
        console.error('Failed to award remaining XP:', error);
      }
    }

    // Save to journal with total XP earned
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

    toast({
      title: 'Exploration Complete!',
      description: `You explored ${distanceKm.toFixed(2)} km and earned ${finalTotalXp} XP! Saved to journal.`,
    });

    setIsRunning(false);
    setIsPaused(false);
    setDistance(0);
    setDuration(0);
    setPositions([]);
  };

  const navigateToRun = () => {
    navigate('/run');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
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
        navigateToRun,
      }}
    >
      {children}
    </RunContext.Provider>
  );
}

export function useRunTracker() {
  const context = useContext(RunContext);
  if (!context) {
    // Return safe defaults if provider hasn't mounted yet (e.g. during error recovery)
    return {
      isRunning: false,
      isPaused: false,
      distance: 0,
      duration: 0,
      positions: [],
      currentPosition: null,
      locationError: null,
      startTracking: () => {},
      pauseTracking: () => {},
      resumeTracking: () => {},
      stopTracking: async () => {},
      navigateToRun: () => {},
    } as RunContextType;
  }
  return context;
}
