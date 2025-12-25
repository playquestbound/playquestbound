import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import qbLogo from '@/assets/qb-logo.png';

interface CampSceneProps {
  characterRace: string;
}

export function CampScene({ characterRace }: CampSceneProps) {
  const [useAltScene, setUseAltScene] = useState(false);

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Background video */}
      <video
        key={useAltScene ? 'alt' : 'main'}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source 
          src={useAltScene ? "/videos/camp-alt.mp4" : "/videos/camp-bg.mp4"} 
          type="video/mp4" 
        />
      </video>

      {/* Scene Toggle */}
      <div className="absolute top-2 right-3 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
        <span className="text-xs text-white/70 font-medium">Scene</span>
        <Switch 
          checked={useAltScene} 
          onCheckedChange={setUseAltScene}
          className="data-[state=checked]:bg-amber-600"
        />
      </div>

      {/* Logo at top center */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
        <img 
          src={qbLogo} 
          alt="Questbound" 
          className="w-auto max-w-[320px] object-contain"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
          }}
        />
      </div>

    </div>
  );
}
