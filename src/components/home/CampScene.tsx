import { CampBuilding } from './CampBuilding';
import qbLogo from '@/assets/qb-logo.png';

interface CampSceneProps {
  characterRace: string;
}

const BUILDINGS = [
  {
    name: 'Quests',
    icon: '📜',
    to: '/quests',
    color: '#6b5a3c',
  },
  {
    name: 'Journal',
    icon: '📖',
    to: '/journal',
    color: '#5a4a35',
  },
  {
    name: 'Arena',
    icon: '🏆',
    to: '/leaderboard',
    color: '#4a5a40',
  },
  {
    name: 'Profile',
    icon: '⚔️',
    to: '/profile',
    color: '#5a4535',
  },
];

export function CampScene({ characterRace }: CampSceneProps) {
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/camp-bg.mp4" type="video/mp4" />
      </video>


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

      {/* Bottom navigation bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div 
          className="flex justify-around items-center py-3 px-2"
          style={{
            background: 'linear-gradient(to top, hsl(0 65% 25% / 0.98) 0%, hsl(0 65% 25% / 0.9) 70%, transparent 100%)',
          }}
        >
          {BUILDINGS.map((building) => (
            <CampBuilding key={building.name} {...building} />
          ))}
        </div>
      </div>
    </div>
  );
}
