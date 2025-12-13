import { Coins, Sparkles, MapPin, TreePine, Building, Crown, Sword, Scroll, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  title: string;
  description: string;
  questType: string;
  xpReward: number;
  goldReward: number;
  difficulty: string;
  questCategory?: 'side' | 'main' | 'grand';
  niche?: string | null;
  classAffinity?: string | null;
  compact?: boolean;
  onAccept?: () => void;
  onClick?: () => void;
  onComplete?: () => void;
  onAbandon?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  isRecommended?: boolean;
}

const questTypeIcons: Record<string, React.ReactNode> = {
  nature: <TreePine className="w-4 h-4" />,
  urban: <Building className="w-4 h-4" />,
  exploration: <MapPin className="w-4 h-4" />,
  running: <MapPin className="w-4 h-4" />,
  hiking: <TreePine className="w-4 h-4" />,
  beach: <MapPin className="w-4 h-4" />,
  snow: <MapPin className="w-4 h-4" />,
  surf: <MapPin className="w-4 h-4" />,
  hyrox: <MapPin className="w-4 h-4" />,
  walk: <MapPin className="w-4 h-4" />,
  exploring: <MapPin className="w-4 h-4" />,
  general: <MapPin className="w-4 h-4" />,
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
    label: 'Legendary Challenge',
    icon: <Crown className="w-3 h-3" />,
    className: 'grand-quest-badge',
  },
};

const nicheColors: Record<string, string> = {
  running: "bg-red-600/20 text-red-400 border-red-600/30",
  hiking: "bg-green-600/20 text-green-400 border-green-600/30",
  beach: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  snow: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  surf: "bg-teal-600/20 text-teal-400 border-teal-600/30",
  hyrox: "bg-orange-600/20 text-orange-400 border-orange-600/30",
  walk: "bg-lime-600/20 text-lime-400 border-lime-600/30",
  exploring: "bg-violet-600/20 text-violet-400 border-violet-600/30",
  general: "bg-slate-600/20 text-slate-400 border-slate-600/30",
};

const difficultyConfig: Record<string, { stars: number; className: string }> = {
  easy: { stars: 1, className: "text-green-400" },
  medium: { stars: 2, className: "text-yellow-400" },
  hard: { stars: 3, className: "text-orange-400" },
  legendary: { stars: 4, className: "text-purple-400" },
};

export function QuestCard({
  title,
  description,
  questType,
  xpReward,
  goldReward,
  difficulty,
  questCategory = 'side',
  niche,
  classAffinity,
  compact = false,
  onAccept,
  onClick,
  onComplete,
  onAbandon,
  isActive = false,
  isLoading = false,
  isRecommended = false,
}: QuestCardProps) {
  const category = categoryConfig[questCategory] || categoryConfig.side;
  const diffConfig = difficultyConfig[difficulty.toLowerCase()] || difficultyConfig.easy;

  const cardContent = (
    <div className={cn(
      "quest-scroll p-4 transition-all duration-200",
      isActive && "ring-2 ring-secondary animate-pulse-gold",
      questCategory === 'grand' && "ring-2 ring-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]",
      onClick && "cursor-pointer hover:scale-[1.02] hover:shadow-lg",
      compact && "p-3"
    )}>
      <div className="relative z-10 pt-2 pb-2">
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="mb-2">
            <Badge className="bg-primary/20 text-primary border-primary/50 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Recommended for you
            </Badge>
          </div>
        )}

        {/* Category & Difficulty Row */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border",
            category.className
          )}>
            {category.icon}
            {category.label}
          </span>
          
          {/* Difficulty Stars */}
          <div className={cn("flex items-center gap-0.5", diffConfig.className)}>
            {Array.from({ length: diffConfig.stars }).map((_, i) => (
              <span key={i} className="text-xs">★</span>
            ))}
            <span className="text-xs ml-1 opacity-80">{difficulty}</span>
          </div>
        </div>

        {/* Niche Badge */}
        {niche && (
          <div className="mb-2">
            <Badge variant="outline" className={cn("capitalize text-xs", nicheColors[niche] || nicheColors.general)}>
              {niche}
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-muted-foreground shrink-0">
            {questTypeIcons[niche || questType] || <MapPin className="w-4 h-4" />}
          </span>
          <h3 className={cn(
            "font-display font-semibold leading-tight",
            compact ? "text-sm" : "text-base"
          )}>{title}</h3>
        </div>

        {/* Description */}
        <p className={cn(
          "text-muted-foreground mb-3 line-clamp-2",
          compact ? "text-xs" : "text-sm"
        )}>{description}</p>

        {/* Rewards */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className={cn("text-xp", compact ? "w-3 h-3" : "w-4 h-4")} />
            <span className={cn("font-display font-semibold text-xp", compact ? "text-xs" : "text-sm")}>
              +{xpReward} XP
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className={cn("text-secondary", compact ? "w-3 h-3" : "w-4 h-4")} />
            <span className={cn("font-display font-semibold text-secondary", compact ? "text-xs" : "text-sm")}>
              +{goldReward}
            </span>
          </div>
        </div>

        {/* Class Affinity (subtle) */}
        {classAffinity && !isRecommended && (
          <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Best for {classAffinity}</span>
          </div>
        )}

        {/* Actions */}
        {onAccept && !onClick && (
          <Button 
            variant="fantasy" 
            className={cn("w-full", compact && "h-8 text-sm")}
            onClick={onAccept}
            disabled={isLoading}
          >
            {isLoading ? 'Accepting...' : 'Accept Quest'}
          </Button>
        )}
        {(onComplete || onAbandon) && (
          <div className="flex gap-2">
            {onComplete && (
              <Button 
                variant="gold" 
                className="flex-1" 
                onClick={onComplete}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Complete Quest'}
              </Button>
            )}
            {onAbandon && (
              <Button 
                variant="outline" 
                className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50" 
                onClick={onAbandon}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-1" />
                Abandon
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return cardContent;
}
