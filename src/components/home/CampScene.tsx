import { CampBuilding } from './CampBuilding';
import qbLogo from '@/assets/qb-logo.png';
import forestBg from '@/assets/forest-bg.jpg';

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
      {/* Background image */}
      <img
        src={forestBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />


      {/* Logo at top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <img 
          src={qbLogo} 
          alt="Questbound" 
          className="h-48 w-auto drop-shadow-lg"
        />
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-32 pb-16 z-10">
        {/* Navigation buttons stacked vertically */}
        <div className="flex flex-col gap-4 px-8">
          {BUILDINGS.map((building) => (
            <CampBuilding key={building.name} {...building} />
          ))}
        </div>
      </div>
    </div>
  );
}
