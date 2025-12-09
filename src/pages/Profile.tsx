import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCompletedQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { getRaceEmoji, getRaceName } from '@/lib/races';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  LogOut, 
  Coins, 
  Sparkles, 
  Scroll, 
  Calendar,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: completedQuests, isLoading: questsLoading } = useCompletedQuests();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const isLoading = profileLoading || questsLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Farewell, adventurer!',
      description: 'Until we meet again...',
    });
    navigate('/auth');
  };

  const xpProgress = profile ? getXpProgress(profile.xp, profile.level) : { percentage: 0, current: 0, required: 0 };
  const totalXp = profile?.xp || 0;
  const totalGold = profile?.gold || 0;
  const questsCompleted = completedQuests?.length || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <User className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Profile</h1>
        </div>

        {/* Character Card */}
        {profile && (
          <div className="parchment-card p-6">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-6">
              <div className="avatar-frame mb-3">
                <div className="avatar-inner w-20 h-20 flex items-center justify-center text-4xl">
                  {getRaceEmoji(profile.race || 'wanderer')}
                </div>
                <div className="level-badge text-sm">{profile.level}</div>
              </div>
              <h2 className="font-display text-xl font-bold">
                {profile.character_name || 'Adventurer'}
              </h2>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                {getRaceName(profile.race || 'wanderer')}
              </p>
            </div>

            {/* XP Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Level Progress</span>
                <span className="font-display font-semibold text-xp">
                  {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
                </span>
              </div>
              <div className="xp-bar h-4">
                <div 
                  className="xp-bar-fill" 
                  style={{ width: `${xpProgress.percentage}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-xp" />
                <p className="font-display font-bold text-lg">{formatNumber(totalXp)}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Coins className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <p className="font-display font-bold text-lg">{formatNumber(totalGold)}</p>
                <p className="text-xs text-muted-foreground">Gold</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Scroll className="w-5 h-5 mx-auto mb-1 text-accent" />
                <p className="font-display font-bold text-lg">{questsCompleted}</p>
                <p className="text-xs text-muted-foreground">Quests</p>
              </div>
            </div>
          </div>
        )}

        {/* Member Since */}
        {profile && (
          <div className="parchment-card p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Member Since</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(profile.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
