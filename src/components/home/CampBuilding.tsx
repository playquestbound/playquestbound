import { Link } from 'react-router-dom';

interface CampBuildingProps {
  name: string;
  icon: string;
  to: string;
  color: string;
}

export function CampBuilding({ name, icon, to, color }: CampBuildingProps) {
  return (
    <Link
      to={to}
      className="group cursor-pointer"
    >
      <div 
        className="w-32 h-24 rounded-lg flex flex-col items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
        style={{
          backgroundColor: color,
          boxShadow: `inset -4px -4px 0 rgba(0,0,0,0.3), inset 4px 4px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Icon */}
        <span className="text-3xl">{icon}</span>
        
        {/* Label */}
        <span 
          className="font-display text-sm font-bold uppercase tracking-wider text-parchment-light"
          style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {name}
        </span>
      </div>
    </Link>
  );
}
