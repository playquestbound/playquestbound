import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaderboard } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRaceEmoji } from '@/lib/races';
import { formatNumber } from '@/lib/levelSystem';
import { Trophy, Crown, Medal, Award, ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <LoadingScreen />;
  }

  const filteredLeaderboard = leaderboard?.filter(entry => 
    entry.character_name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  ) || [];

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

  const handlePlayerClick = (playerId: string) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">Hall of Champions</h1>
            <p className="text-xs text-muted-foreground">Top adventurers worldwide</p>
          </div>
        </div>

        {/* Trophy Banner */}
        <div className="text-center py-2">
          <Trophy className="w-10 h-10 mx-auto mb-2 text-secondary" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search adventurers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={50}
            className="pl-10"
          />
        </div>

        {/* Leaderboard List */}
        {filteredLeaderboard.length > 0 ? (
          <div className="space-y-2">
            {filteredLeaderboard.map((entry, index) => {
              // Find original rank from full leaderboard
              const originalRank = leaderboard?.findIndex(e => e.id === entry.id) ?? index;
              const rank = originalRank + 1;
              const isCurrentUser = user?.id === entry.id;
              
              return (
                <button
                  key={entry.id}
                  onClick={() => entry.id && handlePlayerClick(entry.id)}
                  className={cn(
                    "w-full parchment-card p-3 flex items-center gap-3 transition-all active:scale-[0.98]",
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
                    {getRaceEmoji(entry.race || 'human')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
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
                      {formatNumber(entry.xp ?? 0)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="parchment-card p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-display font-semibold mb-2">
              {searchQuery ? 'No Adventurers Found' : 'No Champions Yet'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'Be the first to complete quests and claim glory!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
