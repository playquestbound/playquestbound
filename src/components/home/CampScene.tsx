import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
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

      {/* Character placeholder - clickable to profile */}
      <Link 
        to="/profile"
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 group"
      >
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95"
          style={{
            background: 'radial-gradient(circle, rgba(212,168,87,0.3) 0%, rgba(212,168,87,0.1) 50%, transparent 70%)',
            boxShadow: '0 0 40px rgba(212,168,87,0.3), inset 0 0 20px rgba(212,168,87,0.2)',
          }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-amber-500/50"
            style={{
              background: 'linear-gradient(180deg, rgba(45,38,30,0.9) 0%, rgba(26,21,16,0.95) 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <User className="w-10 h-10 text-amber-500/70" />
          </div>
        </div>
        <p 
          className="text-center mt-2 text-xs font-display text-parchment-light/80 group-hover:text-parchment-light transition-colors"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
        >
          View Profile
        </p>
      </Link>
    </div>
  );
}
