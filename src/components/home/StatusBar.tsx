import { getXpProgress, formatNumber, getClassTier } from '@/lib/levelSystem';
import { Coins } from 'lucide-react';

interface StatusBarProps {
  characterName: string;
  level: number;
  xp: number;
  gold: number;
}

export function StatusBar({ characterName, level, xp, gold }: StatusBarProps) {
  const xpProgress = getXpProgress(xp, level);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 pb-6"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
      }}
    >
      <div className="max-w-lg mx-auto space-y-2">
        {/* Top row: Name, Level, Gold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="font-display font-bold text-parchment-light text-sm truncate max-w-[120px]"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {characterName}
            </span>
            <div 
              className="px-2 py-0.5 rounded text-xs font-display font-bold"
              style={{
                background: 'linear-gradient(180deg, #6b5a3c 0%, #4a3d2a 100%)',
                border: '1px solid #8b7355',
                color: '#d4a857',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              Lv.{level} · {getClassTier(level)}
            </div>
          </div>

          {/* Gold */}
          <div 
            className="flex items-center gap-1.5 px-2 py-1 rounded"
            style={{
              background: 'linear-gradient(180deg, rgba(212,168,87,0.2) 0%, rgba(184,144,61,0.1) 100%)',
              border: '1px solid rgba(212,168,87,0.3)',
            }}
          >
            <Coins className="w-3.5 h-3.5 text-secondary" />
            <span 
              className="font-display font-bold text-secondary text-sm"
              style={{ textShadow: '0 0 8px rgba(212,168,87,0.3)' }}
            >
              {formatNumber(gold)}
            </span>
          </div>
        </div>

        {/* Ornate XP Bar */}
        <div className="relative w-full">
          {/* Main bar container with ornate frame */}
          <div 
            className="relative h-5 w-full"
            style={{
              background: 'linear-gradient(180deg, #1a1208 0%, #2a1f12 50%, #1a1208 100%)',
              border: '2px solid #3d2f1a',
              borderRadius: '2px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Inner border effect */}
            <div 
              className="absolute inset-[2px]"
              style={{
                border: '1px solid #4a3a22',
                borderRadius: '1px',
              }}
            />
            
            {/* XP fill with gradient */}
            <div 
              className="absolute top-[3px] left-[3px] bottom-[3px] rounded-sm transition-all duration-700 ease-out"
              style={{
                width: `calc(${xpProgress.percentage}% - 6px)`,
                background: 'linear-gradient(180deg, #e85a3c 0%, #c94428 30%, #a83520 60%, #8a2a18 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,200,150,0.4), inset 0 -1px 0 rgba(0,0,0,0.3), 0 0 12px rgba(232,90,60,0.5)',
              }}
            >
              {/* Inner glow line */}
              <div 
                className="absolute top-1 left-1 right-1 h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,200,150,0.6) 20%, rgba(255,200,150,0.6) 80%, transparent)',
                }}
              />
            </div>

            {/* Center decorative line */}
            <div 
              className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)',
              }}
            />
          </div>

          {/* Left diamond decoration */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
            style={{
              background: 'linear-gradient(135deg, #5a4a32 0%, #3d2f1a 50%, #2a1f12 100%)',
              border: '1px solid #6b5a3c',
              boxShadow: '0 0 4px rgba(0,0,0,0.5)',
            }}
          >
            <div 
              className="absolute inset-[2px]"
              style={{
                background: 'linear-gradient(135deg, #3d2f1a 0%, #2a1f12 100%)',
              }}
            />
          </div>

          {/* Right diamond decoration */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rotate-45"
            style={{
              background: 'linear-gradient(135deg, #5a4a32 0%, #3d2f1a 50%, #2a1f12 100%)',
              border: '1px solid #6b5a3c',
              boxShadow: '0 0 4px rgba(0,0,0,0.5)',
            }}
          >
            <div 
              className="absolute inset-[2px]"
              style={{
                background: 'linear-gradient(135deg, #3d2f1a 0%, #2a1f12 100%)',
              }}
            />
          </div>

          {/* XP text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-[10px] font-display font-bold text-parchment-light/90 tracking-wide"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
