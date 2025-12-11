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
      {/* Video overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.7 }}
      >
        <source src="/videos/camp-overlay.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for better contrast */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,21,16,0.3) 0%, rgba(26,21,16,0.7) 100%)',
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
    </div>
  );
}
