import { getRaceEmoji, getRaceName } from '@/lib/races';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { Coins, Sparkles } from 'lucide-react';

interface CharacterHeaderProps {
  characterName: string;
  race: string;
  level: number;
  xp: number;
  gold: number;
}

export function CharacterHeader({ characterName, race, level, xp, gold }: CharacterHeaderProps) {
  const xpProgress = getXpProgress(xp, level);

  return (
    <div className="parchment-card p-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="avatar-frame">
          <div className="avatar-inner w-16 h-16 flex items-center justify-center text-3xl">
            {getRaceEmoji(race)}
          </div>
          <div className="level-badge">{level}</div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-lg truncate">{characterName}</h2>
          <p className="text-sm text-muted-foreground">{getRaceName(race)}</p>

          {/* XP Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 text-xp font-semibold">
                <Sparkles className="w-3 h-3" />
                {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
              </span>
              <span className="text-muted-foreground">Level {level + 1}</span>
            </div>
            <div className="xp-bar">
              <div 
                className="xp-bar-fill" 
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-1.5 bg-secondary/20 px-3 py-1.5 rounded-full">
          <Coins className="w-4 h-4 text-secondary" />
          <span className="font-display font-bold text-secondary">{formatNumber(gold)}</span>
        </div>
      </div>
    </div>
  );
}
