import { useState, useEffect } from 'react';

interface IntroVideoProps {
  onComplete: () => void;
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsPlaying(false);
    onComplete();
  };

  if (!isPlaying) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
      
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-4 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
