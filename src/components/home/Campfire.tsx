import { getRaceEmoji } from '@/lib/races';

interface CampfireProps {
  characterRace: string;
}

export function Campfire({ characterRace }: CampfireProps) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Campfire glow */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,50,0.4) 0%, rgba(255,80,20,0.2) 40%, transparent 70%)',
        }}
      />
      
      {/* Character sitting */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-16">
        <div 
          className="text-4xl"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
            imageRendering: 'pixelated',
          }}
        >
          {getRaceEmoji(characterRace)}
        </div>
      </div>

      {/* Fire stones circle */}
      <div className="relative w-16 h-16 mx-auto">
        {/* Stones */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <div
            key={angle}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: '#4a4035',
              boxShadow: 'inset -1px -1px 0 rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.1)',
              left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 24}px - 6px)`,
              top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 24}px - 6px)`,
            }}
          />
        ))}
        
        {/* Fire flames */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Flame 1 */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-0 h-0 animate-flicker-1"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '20px solid #ff6b1a',
              filter: 'blur(1px)',
            }}
          />
          {/* Flame 2 */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 -translate-x-2 w-0 h-0 animate-flicker-2"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '16px solid #ffaa33',
              filter: 'blur(1px)',
              marginLeft: '-4px',
            }}
          />
          {/* Flame 3 */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-0 h-0 animate-flicker-3"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '14px solid #ffcc66',
              filter: 'blur(0.5px)',
              marginLeft: '3px',
            }}
          />
          {/* Ember glow */}
          <div 
            className="absolute left-1/2 top-2 -translate-x-1/2 w-8 h-4 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,100,30,0.8) 0%, rgba(200,50,10,0.6) 50%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Sparks */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-secondary animate-spark-${i}`}
            style={{
              left: `${8 + i * 4}px`,
              boxShadow: '0 0 4px #ffaa33',
            }}
          />
        ))}
      </div>
    </div>
  );
}
