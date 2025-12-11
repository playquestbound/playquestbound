import { Link } from 'react-router-dom';

interface CampBuildingProps {
  name: string;
  icon: string;
  to: string;
  color: string;
}

export function CampBuilding({ name, icon, to }: CampBuildingProps) {
  return (
    <Link
      to={to}
      className="group cursor-pointer flex flex-col items-center gap-1 transition-transform duration-200 active:scale-95"
    >
      <span className="text-2xl">{icon}</span>
      <span 
        className="font-display text-xs font-bold uppercase tracking-wider text-parchment-light"
        style={{
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        {name}
      </span>
    </Link>
  );
}
