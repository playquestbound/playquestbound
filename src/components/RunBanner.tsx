import { useRunTracker } from '@/hooks/useRunTracker';
import { MapPin, Timer } from 'lucide-react';

export function RunBanner() {
  const { isRunning, isPaused, duration, distance, navigateToRun } = useRunTracker();

  if (!isRunning) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const distanceKm = (distance / 1000).toFixed(2);

  return (
    <button
      onClick={navigateToRun}
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 flex items-center justify-center gap-3 shadow-lg animate-pulse"
      style={{
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
      }}
    >
      <MapPin className="w-4 h-4" />
      <span className="font-display font-semibold text-sm">
        {isPaused ? 'EXPLORATION PAUSED' : 'ONGOING EXPLORATION'}
      </span>
      <span className="text-white/80 text-sm flex items-center gap-1">
        <Timer className="w-3 h-3" />
        {formatTime(duration)}
      </span>
      <span className="text-white/80 text-sm">
        {distanceKm} km
      </span>
    </button>
  );
}
