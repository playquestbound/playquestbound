import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CampBuildingProps {
  name: string;
  icon: string;
  to: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color: string;
  description?: string;
}

export function CampBuilding({ name, icon, to, position, color, description }: CampBuildingProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <Link
      to={to}
      className={cn(
        'absolute group cursor-pointer',
        positionClasses[position]
      )}
    >
      <div className="relative">
        {/* Building structure */}
        <div 
          className="w-20 h-20 relative transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
          style={{
            imageRendering: 'pixelated',
          }}
        >
          {/* Roof */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '44px solid transparent',
              borderRight: '44px solid transparent',
              borderBottom: `28px solid ${color}`,
              filter: 'brightness(1.2)',
            }}
          />
          
          {/* Building body */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-12 flex items-center justify-center"
            style={{
              backgroundColor: color,
              boxShadow: `inset -4px -4px 0 rgba(0,0,0,0.3), inset 4px 4px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {/* Door */}
            <div 
              className="w-6 h-8 rounded-t-full"
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)',
              }}
            />
          </div>
          
          {/* Icon floating above */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-float">
            {icon}
          </div>
        </div>

        {/* Label */}
        <div className="mt-2 text-center">
          <span 
            className="font-display text-xs font-bold uppercase tracking-wider text-parchment-light"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {name}
          </span>
        </div>

        {/* Hover tooltip */}
        {description && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="bg-background/95 border border-gold/30 rounded px-2 py-1 whitespace-nowrap">
              <span className="text-xs text-parchment">{description}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
