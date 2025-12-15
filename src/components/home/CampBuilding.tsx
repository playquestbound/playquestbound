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
      className="group cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-95 hover:opacity-80"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <span className="text-xl">{icon}</span>
      </div>
      <span className="font-tech text-[11px] font-medium uppercase tracking-widest text-white/80">
        {name}
      </span>
    </Link>
  );
}
