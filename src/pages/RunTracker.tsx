import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUpdateStats } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Heart, 
  Flame,
  Timer,
  TrendingUp,
  Link2
} from 'lucide-react';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
}

export default function RunTracker() {
  const navigate = useNavigate();
  const updateStats = useUpdateStats();
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distance, setDistance] = useState(0); // in meters
  const [duration, setDuration] = useState(0); // in seconds
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use refs to track current state for GPS callback (avoids stale closure)
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const lastPositionRef = useRef<Position | null>(null);
  
  // Keep refs in sync with state
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const XP_PER_KM = 10;

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const R = 6371e3; // Earth's radius in meters
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

    // Use refs to get current state (avoids stale closure issue)
    if (isRunningRef.current && !isPausedRef.current) {
      const lastPos = lastPositionRef.current;
      if (lastPos) {
        const dist = calculateDistance(lastPos, newPos);
        // Only add if moved more than 3 meters (to filter GPS noise)
        if (dist > 3) {
          setDistance((d) => d + dist);
          setPositions((prev) => [...prev, newPos]);
          lastPositionRef.current = newPos;
        }
      } else {
        // First position after starting
        lastPositionRef.current = newPos;
        setPositions([newPos]);
      }
    }
  }, []);

  const handlePositionError = (error: GeolocationPositionError) => {
    setLocationError(error.message);
    toast({
      title: 'Location Error',
      description: error.message,
      variant: 'destructive',
    });
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
    lastPositionRef.current = null; // Reset last position

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
      title: 'Run Started',
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
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRunning(false);
    setIsPaused(false);

    const distanceKm = distance / 1000;
    const earnedXp = Math.floor(distanceKm * XP_PER_KM);

    if (earnedXp > 0) {
      try {
        await updateStats.mutateAsync({ xpGain: earnedXp, goldGain: 0 });
        toast({
          title: 'Run Complete!',
          description: `You ran ${distanceKm.toFixed(2)} km and earned ${earnedXp} XP!`,
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
        title: 'Run Complete',
        description: 'Keep going to earn XP! (10 XP per km)',
      });
    }
  };

  // Get initial position on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp,
          });
        },
        handlePositionError
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const distanceKm = distance / 1000;
  const pace = duration > 0 && distanceKm > 0 
    ? duration / 60 / distanceKm 
    : 0;
  const earnedXp = Math.floor(distanceKm * XP_PER_KM);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            disabled={isRunning}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Explore</h1>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Main Stats */}
        <div className="parchment-card p-6 text-center">
          <div className="text-5xl font-display font-bold text-primary mb-2">
            {distanceKm.toFixed(2)}
          </div>
          <div className="text-muted-foreground text-sm">kilometers</div>
          
          <div className="mt-4 flex justify-center gap-2 items-center">
            <TrendingUp className="w-4 h-4 text-xp" />
            <span className="text-xp font-semibold">+{earnedXp} XP</span>
            <span className="text-muted-foreground text-sm">(10 XP/km)</span>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="parchment-card p-4 text-center">
            <Timer className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-display font-bold">{formatTime(duration)}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          
          <div className="parchment-card p-4 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-display font-bold">
              {pace > 0 ? pace.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-muted-foreground">min/km pace</div>
          </div>
        </div>

        {/* Integration Stats (Placeholder) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="parchment-card p-4 text-center opacity-60">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-display font-bold">--</div>
            <div className="text-xs text-muted-foreground">BPM</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-xs h-7"
              onClick={() => navigate('/settings')}
            >
              <Link2 className="w-3 h-3 mr-1" />
              Connect
            </Button>
          </div>
          
          <div className="parchment-card p-4 text-center opacity-60">
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-display font-bold">--</div>
            <div className="text-xs text-muted-foreground">Calories</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-xs h-7"
              onClick={() => navigate('/settings')}
            >
              <Link2 className="w-3 h-3 mr-1" />
              Connect
            </Button>
          </div>
        </div>

        {/* Location Status */}
        {locationError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {locationError}
          </div>
        )}

        {currentPosition && !isRunning && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            GPS ready
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          {!isRunning ? (
            <Button 
              size="lg" 
              className="w-32 h-32 rounded-full bg-green-600 hover:bg-green-700"
              onClick={startTracking}
            >
              <Play className="w-12 h-12" />
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="w-20 h-20 rounded-full"
                variant={isPaused ? "default" : "secondary"}
                onClick={isPaused ? resumeTracking : pauseTracking}
              >
                {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
              </Button>
              <Button 
                size="lg" 
                className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700"
                onClick={stopTracking}
              >
                <Square className="w-8 h-8" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
