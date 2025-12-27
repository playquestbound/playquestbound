import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import qbLogo from '@/assets/qb-logo.png';

interface CampSceneProps {
  characterRace: string;
}

export function CampScene({ characterRace }: CampSceneProps) {
  const [useAltScene, setUseAltScene] = useState(false);
  const navigate = useNavigate();

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
      {/* Explore Button */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
        <Button
          onClick={() => navigate('/run')}
          className="px-6 py-3 text-sm font-display tracking-widest bg-black text-white border-2 border-white/30 rounded-full hover:bg-black/90 transition-all duration-300"
          style={{
            boxShadow: '0 0 20px 8px rgba(255,255,255,0.3), 0 0 40px 16px rgba(255,255,255,0.15), inset 0 0 20px rgba(255,255,255,0.1)',
            textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)',
          }}
        >
          <Compass className="w-5 h-5 mr-2" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }} />
          EXPLORE
        </Button>
      </div>

    </div>
  );
}
