import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRunTracker } from '@/hooks/useRunTracker';
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

export default function RunTracker() {
  const navigate = useNavigate();
  const {
    isRunning,
    isPaused,
    distance,
    duration,
    currentPosition,
    locationError,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useRunTracker();

  const XP_PER_KM = 10;

  // Get initial position on mount
  useEffect(() => {
    if (navigator.geolocation && !currentPosition) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {}
      );
    }
  }, [currentPosition]);

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
    <div className={`min-h-screen bg-background ${isRunning ? 'pt-10' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
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
              className="w-20 h-20 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={startTracking}
            >
              <Play className="w-8 h-8" />
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
