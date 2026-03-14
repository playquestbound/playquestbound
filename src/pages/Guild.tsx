import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useFriends } from '@/hooks/useFriends';
import {
  useMyGuild,
  useGuildMembers,
  useCreateGuild,
  useGuildInvites,
  useSendGuildInvite,
  useRespondGuildInvite,
  useLeaveGuild,
  useRemoveGuildMember,
} from '@/hooks/useGuilds';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getRaceEmoji } from '@/lib/races';
import {
  ArrowLeft,
  Shield,
  Crown,
  UserPlus,
  LogOut,
  UserMinus,
  Coins,
  Check,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const GUILD_COST = 100;

export default function Guild() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: guild, isLoading: guildLoading } = useMyGuild();
  const { data: members } = useGuildMembers(guild?.id);
  const { data: invites } = useGuildInvites();
  const { data: friends } = useFriends();
  const createGuild = useCreateGuild();
  const sendInvite = useSendGuildInvite();
  const respondInvite = useRespondGuildInvite();
  const leaveGuild = useLeaveGuild();
  const removeMember = useRemoveGuildMember();

  const [guildName, setGuildName] = useState('');
  const [guildDesc, setGuildDesc] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  if (guildLoading) return <LoadingScreen />;

  const isOwner = guild && (guild as any).isOwner;
  const pendingInvites = invites || [];
  const memberCount = members?.length || 0;

  // Friends not already in the guild
  const invitableFriends = friends?.filter(f => {
    const isMember = members?.some(m => m.user_id === f.id);
    return !isMember && f.id !== user?.id;
  }) || [];

  const handleCreate = () => {
    if (!guildName.trim()) return;
    createGuild.mutate(
      { name: guildName.trim(), description: guildDesc.trim() || undefined },
      { onSuccess: () => { setShowCreate(false); setGuildName(''); setGuildDesc(''); } }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">
              {guild ? guild.name : 'Guilds'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {guild ? `${memberCount}/${guild.max_members} members` : 'Band together with allies'}
            </p>
          </div>
        </div>

        {/* Pending Guild Invites */}
        {!guild && pendingInvites.length > 0 && (
          <div>
            <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Guild Invitations
            </h2>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="parchment-card p-3 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate">
                      {invite.guild?.name || 'Unknown Guild'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invite.guild?.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-green-500 hover:text-green-400"
                      onClick={() => respondInvite.mutate({ inviteId: invite.id, guildId: invite.guild_id, accept: true })}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-destructive"
                      onClick={() => respondInvite.mutate({ inviteId: invite.id, guildId: invite.guild_id, accept: false })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Guild - Create */}
        {!guild && (
          <div className="parchment-card p-6 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-display text-lg font-bold mb-2">No Guild Yet</h2>
            <p className="text-sm text-muted-foreground mb-1">
              Create your own guild and invite friends to join your ranks!
            </p>
            <p className="text-xs text-muted-foreground mb-4 flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-secondary" />
              Costs {GUILD_COST} gold • You have {profile?.gold || 0} gold
            </p>

            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button
                  className="font-display"
                  disabled={(profile?.gold || 0) < GUILD_COST}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Found a Guild ({GUILD_COST}g)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Create Your Guild</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium">Guild Name</label>
                    <Input
                      value={guildName}
                      onChange={(e) => setGuildName(e.target.value)}
                      placeholder="The Iron Wolves"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Textarea
                      value={guildDesc}
                      onChange={(e) => setGuildDesc(e.target.value)}
                      placeholder="A fellowship of brave adventurers..."
                      maxLength={120}
                      rows={2}
                    />
                  </div>
                  <Button
                    className="w-full font-display"
                    onClick={handleCreate}
                    disabled={!guildName.trim() || createGuild.isPending}
                  >
                    {createGuild.isPending ? 'Creating...' : `Create Guild (${GUILD_COST}g)`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Guild Exists - Show Members */}
        {guild && (
          <>
            {guild.description && (
              <p className="text-sm text-muted-foreground italic px-1">"{guild.description}"</p>
            )}

            {/* Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Members
                </h2>
                {isOwner && (
                  <Dialog open={showInvite} onOpenChange={setShowInvite}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="font-display text-xs">
                        <UserPlus className="w-3 h-3 mr-1" />
                        Invite Friend
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-display">Invite a Friend</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 max-h-64 overflow-y-auto pt-2">
                        {invitableFriends.length > 0 ? (
                          invitableFriends.map((friend) => (
                            <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
                                {getRaceEmoji(friend.race || 'human')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-display text-sm font-semibold truncate">
                                  {friend.character_name || 'Unknown'}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  if (friend.id) sendInvite.mutate({ guildId: guild.id, inviteeId: friend.id });
                                }}
                                disabled={sendInvite.isPending}
                              >
                                Invite
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No friends available to invite. Add friends first!
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="space-y-2">
                {/* Owner */}
                <div className="parchment-card p-3 flex items-center gap-3">
                  <Crown className="w-5 h-5 text-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate text-sm">
                      Guild Leader
                    </p>
                  </div>
                </div>

                {members?.map((member) => (
                  <button
                    key={member.id}
                    className="w-full parchment-card p-3 flex items-center gap-3 transition-all active:scale-[0.98]"
                    onClick={() => member.user_id && navigate(`/player/${member.user_id}`)}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                      {getRaceEmoji(member.profile?.race || 'human')}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-display font-semibold truncate text-sm">
                        {member.profile?.character_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                    {isOwner && member.user_id !== user?.id && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMember.mutate({ guildId: guild.id, userId: member.user_id });
                        }}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Leave Guild (non-owner) */}
            {!isOwner && (
              <Button
                variant="outline"
                className="w-full font-display text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => leaveGuild.mutate(guild.id)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Guild
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
