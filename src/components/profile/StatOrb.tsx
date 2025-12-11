import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatOrbProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: 'xp' | 'gold' | 'quest' | 'level';
  position?: 'top' | 'left' | 'right' | 'bottom';
}

const colorVariants = {
  xp: 'from-purple-500/30 to-purple-600/10 border-purple-500/50 text-purple-400',
  gold: 'from-amber-500/30 to-amber-600/10 border-amber-500/50 text-amber-400',
  quest: 'from-emerald-500/30 to-emerald-600/10 border-emerald-500/50 text-emerald-400',
  level: 'from-blue-500/30 to-blue-600/10 border-blue-500/50 text-blue-400',
};

const iconColors = {
  xp: 'text-purple-400',
  gold: 'text-amber-400',
  quest: 'text-emerald-400',
  level: 'text-blue-400',
};

export function StatOrb({ icon: Icon, value, label, color }: StatOrbProps) {
  return (
    <div className="flex flex-col items-center gap-1 group cursor-default">
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex flex-col items-center justify-center",
          "bg-gradient-to-br border-2 backdrop-blur-sm",
          "transition-all duration-300 hover:scale-110",
          "shadow-lg",
          colorVariants[color]
        )}
      >
        <Icon className={cn("w-4 h-4 mb-0.5", iconColors[color])} />
        <span className="font-display font-bold text-sm text-foreground">{value}</span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
