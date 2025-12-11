import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCompletedQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { CharacterDisplay } from '@/components/profile/CharacterDisplay';
import { EquipmentDrawer } from '@/components/profile/EquipmentDrawer';
import { StatOrb } from '@/components/profile/StatOrb';
import { getRaceName } from '@/lib/races';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { toast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Coins, 
  Sparkles, 
  Scroll, 
  Calendar,
  Shield,
  Star,
  Backpack,
  Search,
  Users,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

interface Customization {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyeColor?: string;
}

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
  const customization = profile?.customization as Customization | null;

  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative p-4 space-y-6 max-w-lg mx-auto">
        {/* Header with Action Buttons */}
        <div className="relative flex items-center justify-center pt-4">
          {/* Left buttons - Search & Guild */}
          <div className="absolute left-0 flex gap-2">
            <Button 
              size="icon" 
              variant="outline"
              className="w-11 h-11 rounded-full border-2 border-secondary/50 bg-card/80 backdrop-blur hover:bg-secondary/20 hover:border-secondary"
              onClick={() => navigate('/search-players')}
            >
              <Search className="w-5 h-5 text-secondary" />
            </Button>
            <Button 
              size="icon" 
              variant="outline"
              className="w-11 h-11 rounded-full border-2 border-secondary/50 bg-card/80 backdrop-blur hover:bg-secondary/20 hover:border-secondary"
              onClick={() => toast({
                title: 'Guilds Coming Soon!',
                description: 'Band together with fellow adventurers...',
              })}
            >
              <Users className="w-5 h-5 text-secondary" />
            </Button>
          </div>
          
          <h1 className="font-display text-2xl font-bold">Profile</h1>
          
          {/* Right buttons - Settings & Equipment */}
          <div className="absolute right-0 flex gap-2">
            <Button 
              size="icon" 
              variant="outline"
              className="w-11 h-11 rounded-full border-2 border-secondary/50 bg-card/80 backdrop-blur hover:bg-secondary/20 hover:border-secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5 text-secondary" />
            </Button>
            <EquipmentDrawer>
              <Button 
                size="icon" 
                variant="outline"
                className="w-11 h-11 rounded-full border-2 border-secondary/50 bg-card/80 backdrop-blur hover:bg-secondary/20 hover:border-secondary"
              >
                <Backpack className="w-5 h-5 text-secondary" />
              </Button>
            </EquipmentDrawer>
          </div>
        </div>

        {profile && (
          <>
            {/* Character Name & Class Badge */}
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-1">
                {profile.character_name || 'Adventurer'}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span className="text-sm text-muted-foreground">
                  {getRaceName(profile.race || 'human')} {profile.class ? `• ${profile.class.charAt(0).toUpperCase() + profile.class.slice(1)}` : ''}
                </span>
              </div>
            </div>

            {/* Character Display with Surrounding Stats */}
            <div className="relative py-8">
              {/* Top Stats */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <StatOrb 
                  icon={Star} 
                  value={profile.level} 
                  label="Level" 
                  color="level" 
                />
              </div>

              {/* Left Stat */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                <StatOrb 
                  icon={Sparkles} 
                  value={formatNumber(totalXp)} 
                  label="XP" 
                  color="xp" 
                />
              </div>

              {/* Right Stat */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                <StatOrb 
                  icon={Coins} 
                  value={formatNumber(totalGold)} 
                  label="Gold" 
                  color="gold" 
                />
              </div>

              {/* Bottom Stat */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                <StatOrb 
                  icon={Scroll} 
                  value={questsCompleted} 
                  label="Quests" 
                  color="quest" 
                />
              </div>

              {/* Character Display */}
              <div className="flex items-center justify-center py-8">
                <CharacterDisplay 
                  customization={customization}
                  race={profile.race}
                  characterClass={profile.class}
                />
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="parchment-card p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Level {profile.level} Progress</span>
                <span className="font-display font-semibold text-xp">
                  {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
                </span>
              </div>
              <div className="xp-bar h-3 rounded-full overflow-hidden">
                <div 
                  className="xp-bar-fill h-full transition-all duration-500" 
                  style={{ width: `${xpProgress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {formatNumber(xpProgress.required - xpProgress.current)} XP to level {profile.level + 1}
              </p>
            </div>

            {/* Member Since */}
            <div className="parchment-card p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Member Since</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(profile.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </>
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
