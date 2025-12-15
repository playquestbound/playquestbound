import { Link, useLocation } from 'react-router-dom';
import { Home, ScrollText, BarChart3, User } from 'lucide-react';

interface CampBuildingProps {
  name: string;
  icon: string;
  to: string;
  color: string;
}

const iconMap: Record<string, React.ElementType> = {
  'Quests': ScrollText,
  'Journal': BarChart3,
  'Arena': BarChart3,
  'Profile': User,
  'Home': Home,
};

export function CampBuilding({ name, to }: CampBuildingProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const IconComponent = iconMap[name] || Home;

  return (
    <Link
      to={to}
      className="relative flex items-center justify-center w-12 h-12 transition-all duration-200"
    >
      {isActive && (
        <div className="absolute inset-0 bg-white rounded-full" />
      )}
      <IconComponent 
        className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
          isActive ? 'text-black' : 'text-white/70'
        }`}
        strokeWidth={isActive ? 2.5 : 2}
      />
    </Link>
  );
}
