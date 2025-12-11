import { Coins, Sparkles, MapPin, TreePine, Building, Crown, Sword, Scroll, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  title: string;
  description: string;
  questType: string;
  xpReward: number;
  goldReward: number;
  difficulty: string;
  questCategory?: 'side' | 'main' | 'grand';
  onAccept?: () => void;
  onComplete?: () => void;
  onAbandon?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}

const questTypeIcons: Record<string, React.ReactNode> = {
  nature: <TreePine className="w-4 h-4" />,
  urban: <Building className="w-4 h-4" />,
  exploration: <MapPin className="w-4 h-4" />,
};

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  side: {
    label: 'Side Quest',
    icon: <Scroll className="w-3 h-3" />,
    className: 'bg-muted text-muted-foreground border-border',
  },
  main: {
    label: 'Main Quest',
    icon: <Sword className="w-3 h-3" />,
    className: 'bg-primary/20 text-primary border-primary/50',
  },
  grand: {
    label: 'Grand Quest',
    icon: <Crown className="w-3 h-3" />,
    className: 'grand-quest-badge',
  },
};

export function QuestCard({
  title,
  description,
  questType,
  xpReward,
  goldReward,
  difficulty,
  questCategory = 'side',
  onAccept,
  onComplete,
  onAbandon,
  isActive = false,
  isLoading = false,
}: QuestCardProps) {
  const category = categoryConfig[questCategory] || categoryConfig.side;

  return (
    <div className={cn(
      "quest-scroll p-4",
      isActive && "ring-2 ring-secondary animate-pulse-gold"
    )}>
      <div className="relative z-10 pt-2 pb-2">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border",
            category.className
          )}>
            {category.icon}
            {category.label}
          </span>
          <span className={cn(
            "difficulty-badge shrink-0",
            difficulty === 'Easy' && "difficulty-easy",
            difficulty === 'Medium' && "difficulty-medium",
            difficulty === 'Hard' && "difficulty-hard",
          )}>
            {difficulty}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-muted-foreground">
            {questTypeIcons[questType] || <MapPin className="w-4 h-4" />}
          </span>
          <h3 className="font-display font-semibold text-base leading-tight">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        {/* Rewards */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-xp" />
            <span className="font-display font-semibold text-sm text-xp">+{xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-secondary" />
            <span className="font-display font-semibold text-sm text-secondary">+{goldReward}</span>
          </div>
        </div>

        {/* Actions */}
        {onAccept && (
          <Button 
            variant="fantasy" 
            className="w-full" 
            onClick={onAccept}
            disabled={isLoading}
          >
            {isLoading ? 'Accepting...' : 'Accept Quest'}
          </Button>
        )}
        {onComplete && (
          <Button 
            variant="gold" 
            className="w-full" 
            onClick={onComplete}
            disabled={isLoading}
          >
            {isLoading ? 'Completing...' : 'Complete Quest'}
          </Button>
        )}
        {onAbandon && (
          <Button 
            variant="outline" 
            className="w-full mt-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50" 
            onClick={onAbandon}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            {isLoading ? 'Abandoning...' : 'Abandon Quest'}
          </Button>
        )}
      </div>
    </div>
  );
}
