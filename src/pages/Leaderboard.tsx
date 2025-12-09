import { useLeaderboard } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { getRaceEmoji } from '@/lib/races';
import { formatNumber } from '@/lib/levelSystem';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-secondary" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="font-display font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <Trophy className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Hall of Champions</h1>
          <p className="text-sm text-muted-foreground">Top adventurers by XP</p>
        </div>

        {/* Leaderboard List */}
        {leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = user?.id === entry.id;
              
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "parchment-card p-3 flex items-center gap-3",
                    rank <= 3 && "border-secondary/50",
                    isCurrentUser && "ring-2 ring-secondary"
                  )}
                >
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                    {getRaceEmoji(entry.race || 'wanderer')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold truncate">
                        {entry.character_name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <span className="font-display font-bold text-xp">
                      {formatNumber(entry.xp)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="parchment-card p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-display font-semibold mb-2">No Champions Yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to complete quests and claim glory!
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
