import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCompletedQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { EquipmentDrawer } from '@/components/profile/EquipmentDrawer';
import { CharacterProfile3D } from '@/components/3d/CharacterProfile3D';
import { getRaceName } from '@/lib/races';
import { Gender } from '@/lib/races';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { toast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Backpack,
  Settings,
  BookOpen,
  Pencil,
  ShieldCheck,
  Sparkles,
  Swords,
  Footprints,
  Shield
} from 'lucide-react';
import { useIsAdmin } from '@/hooks/useAdminQuests';

interface Customization {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyeColor?: string;
  gender?: string;
}

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: completedQuests, isLoading: questsLoading } = useCompletedQuests();
  const { data: isAdmin } = useIsAdmin();
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
  const questsCompleted = completedQuests?.length || 0;
  const totalKmsRun = 0; // TODO: Calculate from run data
  const gearScore = 0; // TODO: Calculate from equipped items
  const customization = profile?.customization as Customization | null;

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="relative px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button 
                size="icon" 
                variant="ghost"
                className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/admin/quests')}
              >
                <ShieldCheck className="w-5 h-5" />
              </Button>
            )}
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/journal')}
            >
              <BookOpen className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/create-character')}
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {profile && (
        <div className="px-4 pt-6">
          {/* Player Card */}
          <div className="relative mx-auto max-w-sm">
            {/* Card Container */}
            <div 
              className="relative rounded-2xl overflow-hidden border border-border/50"
              style={{
                background: 'linear-gradient(180deg, hsl(0 0% 12%) 0%, hsl(0 0% 8%) 100%)',
                boxShadow: '0 8px 32px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 20% / 0.3)',
              }}
            >
              {/* Top Section - Level & XP */}
              <div className="relative px-4 pt-4 pb-3">
                {/* Level Badge - Top Left */}
                <div 
                  className="absolute top-3 left-3 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(150 60% 40%) 0%, hsl(150 50% 25%) 100%)',
                    boxShadow: '0 4px 12px hsl(150 60% 30% / 0.4), inset 0 1px 0 hsl(150 60% 60% / 0.3)',
                  }}
                >
                  <span className="text-xs font-bold text-white/70">LVL</span>
                  <span className="text-lg font-display font-bold text-white">{profile.level}</span>
                </div>

                {/* XP Progress - Center */}
                <div className="mx-auto max-w-[180px] pt-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-xs font-medium text-purple-400">
                      {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{
                      background: 'hsl(0 0% 15%)',
                      boxShadow: 'inset 0 1px 2px hsl(0 0% 0% / 0.5)',
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${xpProgress.percentage}%`,
                        background: 'linear-gradient(90deg, hsl(270 60% 50%) 0%, hsl(280 70% 60%) 100%)',
                        boxShadow: '0 0 8px hsl(270 60% 50% / 0.6)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Character Title Banner */}
              <div 
                className="relative py-2 text-center"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, hsl(270 40% 25% / 0.5) 20%, hsl(270 40% 25% / 0.5) 80%, transparent 100%)',
                }}
              >
                <span className="text-xs font-display font-semibold tracking-wider uppercase text-purple-300/80">
                  {profile.class ? `${profile.class.charAt(0).toUpperCase() + profile.class.slice(1)}` : 'Adventurer'}
                </span>
              </div>

              {/* Character Display Area */}
              <div 
                className="relative h-72 flex items-center justify-center overflow-hidden"
                style={{
                  background: 'radial-gradient(ellipse at center bottom, hsl(270 30% 15% / 0.4) 0%, transparent 70%)',
                }}
              >
                {/* Decorative Frame */}
                <div 
                  className="absolute inset-4 rounded-xl border border-border/30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, hsl(0 0% 10% / 0.3) 0%, transparent 70%)',
                  }}
                />
                
                {/* 3D Character */}
                <div className="relative w-48 h-full">
                  <CharacterProfile3D 
                    raceId={profile.race || 'human'} 
                    gender={(customization?.gender as Gender) || 'male'}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Character Name Plate */}
              <div 
                className="relative py-3 text-center"
                style={{
                  background: 'linear-gradient(180deg, hsl(0 0% 6%) 0%, hsl(0 0% 10%) 100%)',
                  borderTop: '1px solid hsl(0 0% 15%)',
                  borderBottom: '1px solid hsl(0 0% 15%)',
                }}
              >
                <h1 
                  className="font-display text-xl font-bold tracking-wide text-foreground"
                  style={{ textShadow: '0 2px 8px hsl(0 0% 0% / 0.5)' }}
                >
                  {profile.character_name || 'Adventurer'}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getRaceName(profile.race || 'human')}
                </p>
              </div>

              {/* Stats Row */}
              <div 
                className="grid grid-cols-3 divide-x divide-border/30"
                style={{
                  background: 'linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)',
                }}
              >
                {/* Quests Done */}
                <div className="py-4 text-center">
                  <div 
                    className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, hsl(35 70% 45%) 0%, hsl(25 60% 30%) 100%)',
                      boxShadow: '0 4px 12px hsl(35 70% 30% / 0.4), inset 0 1px 0 hsl(45 80% 60% / 0.3)',
                    }}
                  >
                    <Swords className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xl font-display font-bold text-foreground">{questsCompleted}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Quests</p>
                </div>

                {/* Kms Run */}
                <div className="py-4 text-center">
                  <div 
                    className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, hsl(200 70% 45%) 0%, hsl(210 60% 30%) 100%)',
                      boxShadow: '0 4px 12px hsl(200 70% 30% / 0.4), inset 0 1px 0 hsl(200 80% 60% / 0.3)',
                    }}
                  >
                    <Footprints className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xl font-display font-bold text-foreground">{totalKmsRun}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Kms Run</p>
                </div>

                {/* Gear Score */}
                <div className="py-4 text-center">
                  <div 
                    className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, hsl(280 60% 50%) 0%, hsl(290 50% 35%) 100%)',
                      boxShadow: '0 4px 12px hsl(280 60% 35% / 0.4), inset 0 1px 0 hsl(280 70% 65% / 0.3)',
                    }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xl font-display font-bold text-foreground">{gearScore}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gear Score</p>
                </div>
              </div>
            </div>

            {/* Equipment Bag Button */}
            <div className="mt-6">
              <EquipmentDrawer>
                <Button 
                  variant="outline"
                  className="w-full border-border/50 bg-card/50 hover:bg-card text-foreground"
                >
                  <Backpack className="w-4 h-4 mr-2" />
                  View Equipment Bag
                </Button>
              </EquipmentDrawer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
