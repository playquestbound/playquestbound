import { useNavigate } from 'react-router-dom';
import { useFriends, useFriendRequests, useRespondFriendRequest, useRemoveFriend } from '@/hooks/useFriends';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { getRaceEmoji } from '@/lib/races';
import { ArrowLeft, UserPlus, UserMinus, Check, X, Users } from 'lucide-react';

export default function Friends() {
  const navigate = useNavigate();
  const { data: friends, isLoading: friendsLoading } = useFriends();
  const { data: requests, isLoading: requestsLoading } = useFriendRequests();
  const respondMutation = useRespondFriendRequest();
  const removeMutation = useRemoveFriend();

  if (friendsLoading || requestsLoading) return <LoadingScreen />;

  const pendingRequests = requests || [];
  const friendsList = friends || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">Companions</h1>
            <p className="text-xs text-muted-foreground">Your trusted allies</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="parchment-card p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                    {getRaceEmoji(req.sender?.race || 'human')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate">
                      {req.sender?.character_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Level {req.sender?.level || 1} • {req.sender?.class || 'Adventurer'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      onClick={() => respondMutation.mutate({ requestId: req.id, accept: true })}
                      disabled={respondMutation.isPending}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-destructive hover:bg-destructive/10"
                      onClick={() => respondMutation.mutate({ requestId: req.id, accept: false })}
                      disabled={respondMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div>
          <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Friends ({friendsList.length})
          </h2>
          {friendsList.length > 0 ? (
            <div className="space-y-2">
              {friendsList.map((friend) => (
                <button
                  key={friend.id}
                  className="w-full parchment-card p-3 flex items-center gap-3 transition-all active:scale-[0.98]"
                  onClick={() => friend.id && navigate(`/player/${friend.id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                    {getRaceEmoji(friend.race || 'human')}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-display font-semibold truncate">
                      {friend.character_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Level {friend.level || 1} • {friend.class || 'Adventurer'}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (friend.friendshipId) removeMutation.mutate(friend.friendshipId);
                    }}
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </button>
              ))}
            </div>
          ) : (
            <div className="parchment-card p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <h3 className="font-display font-semibold mb-2">No Companions Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Search for adventurers in the leaderboard and send them friend requests!
              </p>
              <Button variant="outline" onClick={() => navigate('/leaderboard')}>
                Find Adventurers
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
