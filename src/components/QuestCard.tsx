import { Coins, Sparkles, MapPin, TreePine, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  title: string;
  description: string;
  questType: string;
  xpReward: number;
  goldReward: number;
  difficulty: string;
  onAccept?: () => void;
  onComplete?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}

const questTypeIcons: Record<string, React.ReactNode> = {
  nature: <TreePine className="w-4 h-4" />,
  urban: <Building className="w-4 h-4" />,
  exploration: <MapPin className="w-4 h-4" />,
};

export function QuestCard({
  title,
  description,
  questType,
  xpReward,
  goldReward,
  difficulty,
  onAccept,
  onComplete,
  isActive = false,
  isLoading = false,
}: QuestCardProps) {
  return (
    <div className={cn(
      "quest-scroll p-4",
      isActive && "ring-2 ring-secondary animate-pulse-gold"
    )}>
      <div className="relative z-10 pt-2 pb-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {questTypeIcons[questType] || <MapPin className="w-4 h-4" />}
            </span>
            <h3 className="font-display font-semibold text-base leading-tight">{title}</h3>
          </div>
          <span className={cn(
            "difficulty-badge shrink-0",
            difficulty === 'Easy' && "difficulty-easy",
            difficulty === 'Medium' && "difficulty-medium",
            difficulty === 'Hard' && "difficulty-hard",
          )}>
            {difficulty}
          </span>
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
      </div>
    </div>
  );
}
