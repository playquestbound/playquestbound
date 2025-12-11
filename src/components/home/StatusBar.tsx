import { getXpProgress, formatNumber } from '@/lib/levelSystem';
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
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 80%, transparent 100%)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Character name and level */}
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
            Lv.{level}
          </div>
        </div>

        {/* XP Bar */}
        <div className="flex-1 max-w-[140px]">
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a1510 0%, #2d261e 100%)',
              border: '1px solid #3d3428',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${xpProgress.percentage}%`,
                background: 'linear-gradient(180deg, #d4a857 0%, #b8903d 50%, #9a7830 100%)',
                boxShadow: '0 0 8px rgba(212,168,87,0.5)',
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-parchment/60">{formatNumber(xpProgress.current)}</span>
            <span className="text-[10px] text-parchment/60">{formatNumber(xpProgress.required)}</span>
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
    </div>
  );
}
