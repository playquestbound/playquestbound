import { Campfire } from './Campfire';
import { CampBuilding } from './CampBuilding';

interface CampSceneProps {
  characterRace: string;
}

const BUILDINGS = [
  {
    name: 'Quests',
    icon: '📜',
    to: '/quests',
    position: 'top-left' as const,
    color: '#6b5a3c',
    description: 'Accept new adventures',
  },
  {
    name: 'Journal',
    icon: '📖',
    to: '/journal',
    position: 'top-right' as const,
    color: '#5a4a35',
    description: 'View your memories',
  },
  {
    name: 'Arena',
    icon: '🏆',
    to: '/leaderboard',
    position: 'bottom-left' as const,
    color: '#4a5a40',
    description: 'Compare with others',
  },
  {
    name: 'Profile',
    icon: '⚔️',
    to: '/profile',
    position: 'bottom-right' as const,
    color: '#5a4535',
    description: 'Your character',
  },
];

export function CampScene({ characterRace }: CampSceneProps) {
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Ground texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center bottom, rgba(60,50,35,0.8) 0%, transparent 50%),
            repeating-conic-gradient(from 0deg at 50% 50%, #2a2318 0deg 1deg, #1f1a12 1deg 2deg),
            linear-gradient(180deg, #1a1510 0%, #252015 50%, #1a1510 100%)
          `,
        }}
      />
      
      {/* Subtle path lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <defs>
          <pattern id="ground-texture" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#1a1510" />
            <rect width="2" height="2" fill="#252015" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ground-texture)" />
      </svg>

      {/* Fog/atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(26,21,16,0.6) 80%)',
        }}
      />

      {/* Buildings */}
      {BUILDINGS.map((building) => (
        <CampBuilding key={building.name} {...building} />
      ))}

      {/* Campfire in center */}
      <Campfire characterRace={characterRace} />

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p 
          className="text-xs text-parchment/40 font-display tracking-wider"
          style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
        >
          TAP A BUILDING TO EXPLORE
        </p>
      </div>

      {/* Corner decorations - trees/rocks */}
      <div className="absolute top-20 left-28 text-2xl opacity-40" style={{ filter: 'blur(1px)' }}>🌲</div>
      <div className="absolute top-24 right-28 text-xl opacity-30" style={{ filter: 'blur(1px)' }}>🪨</div>
      <div className="absolute bottom-28 left-28 text-xl opacity-35" style={{ filter: 'blur(1px)' }}>🌳</div>
      <div className="absolute bottom-24 right-28 text-lg opacity-25" style={{ filter: 'blur(1px)' }}>🪨</div>
    </div>
  );
}
