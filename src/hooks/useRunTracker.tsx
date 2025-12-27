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

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const lastPositionRef = useRef<Position | null>(null);

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
          setDistance((d) => d + dist);
          setPositions((prev) => [...prev, newPos]);
          lastPositionRef.current = newPos;
        }
      } else {
        lastPositionRef.current = newPos;
        setPositions([newPos]);
      }
    }
  }, []);

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
    lastPositionRef.current = null;

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
    const earnedXp = Math.floor(distanceKm * XP_PER_KM);
    const pace = duration > 0 && distanceKm > 0 ? duration / 60 / distanceKm : 0;

    // Save to journal
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
            xp_earned: earnedXp,
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

    if (earnedXp > 0) {
      try {
        await updateStats.mutateAsync({ xpGain: earnedXp, goldGain: 0 });
        toast({
          title: 'Exploration Complete!',
          description: `You explored ${distanceKm.toFixed(2)} km and earned ${earnedXp} XP! Saved to journal.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to save your progress',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Exploration Complete',
        description: 'Keep going to earn XP! (10 XP per km)',
      });
    }

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
    throw new Error('useRunTracker must be used within a RunProvider');
  }
  return context;
}
