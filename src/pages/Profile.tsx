import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCompletedQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { useActiveTitle } from '@/hooks/useTitles';
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
  Users,
  Pencil,
  ShieldCheck,
  Trophy
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
  const { data: activeTitle } = useActiveTitle();
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
  const totalKmsRun = 0;
  const gearScore = 0;
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
        <div className="px-4 pt-4">
          {/* Fantasy Player Card */}
          <div className="relative mx-auto max-w-[320px]">
            {/* Outer ornate frame - Dark blue/grey */}
            <div 
              className="relative rounded-2xl p-[3px]"
              style={{
                background: 'linear-gradient(180deg, hsl(220 30% 25%) 0%, hsl(215 25% 15%) 50%, hsl(220 30% 20%) 100%)',
                boxShadow: '0 0 20px hsl(220 40% 20% / 0.5), 0 8px 32px hsl(0 0% 0% / 0.7)',
              }}
            >
              {/* Inner card */}
              <div 
                className="relative rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, hsl(220 20% 10%) 0%, hsl(215 15% 6%) 100%)',
                }}
              >
                {/* Top decorative bar - Dark blue accent */}
                <div 
                  className="h-2"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsl(220 40% 30%) 20%, hsl(210 50% 40%) 50%, hsl(220 40% 30%) 80%, transparent 100%)',
                  }}
                />

                {/* Level gem - Top left - Blue tint */}
                <div className="absolute top-4 left-4 z-20">
                  <div 
                    className="relative w-14 h-14"
                    style={{
                      filter: 'drop-shadow(0 4px 8px hsl(210 60% 15% / 0.8))',
                    }}
                  >
                    {/* Diamond shape */}
                    <svg viewBox="0 0 56 56" className="w-full h-full">
                      <defs>
                        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(200 50% 45%)" />
                          <stop offset="50%" stopColor="hsl(210 45% 35%)" />
                          <stop offset="100%" stopColor="hsl(220 40% 25%)" />
                        </linearGradient>
                        <linearGradient id="gemShine" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(200 60% 70%)" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M28 4 L52 28 L28 52 L4 28 Z" 
                        fill="url(#gemGradient)"
                        stroke="hsl(220 35% 35%)"
                        strokeWidth="2"
                      />
                      <path 
                        d="M28 6 L50 28 L28 16 L6 28 Z" 
                        fill="url(#gemShine)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-display font-bold text-white" style={{ textShadow: '0 2px 4px hsl(0 0% 0% / 0.5)' }}>
                        {profile.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class badge - Top right - Muted blue/grey */}
                <div className="absolute top-5 right-4 z-20">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-display font-semibold tracking-wider uppercase"
                    style={{
                      background: 'linear-gradient(135deg, hsl(220 30% 25%) 0%, hsl(215 25% 18%) 100%)',
                      border: '1px solid hsl(220 35% 35%)',
                      color: 'hsl(210 40% 75%)',
                      boxShadow: '0 2px 8px hsl(220 40% 15% / 0.6)',
                    }}
                  >
                    {profile.class ? profile.class.charAt(0).toUpperCase() + profile.class.slice(1) : 'Adventurer'}
                  </div>
                </div>

                {/* Character portrait area */}
                <div className="relative pt-8 pb-4 px-4">
                  {/* Portrait frame */}
                  <div 
                    className="relative mx-auto w-52 h-64 rounded-xl overflow-hidden"
                    style={{
                      border: '3px solid hsl(220 30% 25%)',
                      background: 'radial-gradient(ellipse at center bottom, hsl(220 20% 12%) 0%, hsl(0 0% 5%) 100%)',
                      boxShadow: 'inset 0 0 30px hsl(0 0% 0% / 0.8), 0 4px 16px hsl(0 0% 0% / 0.5)',
                    }}
                  >
                    {/* Corner ornaments - Blue/grey */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-slate-500/60 rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-slate-500/60 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-slate-500/60 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-slate-500/60 rounded-br" />
                    
                    {/* 3D Character */}
                    <CharacterProfile3D 
                      raceId={profile.race || 'human'} 
                      gender={(customization?.gender as Gender) || 'male'}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Name ribbon/banner - Dark blue */}
                <div className="relative -mt-2 mb-2">
                  <svg viewBox="0 0 320 50" className="w-full h-12" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(220 35% 28%)" />
                        <stop offset="50%" stopColor="hsl(220 30% 20%)" />
                        <stop offset="100%" stopColor="hsl(220 35% 15%)" />
                      </linearGradient>
                      <linearGradient id="ribbonEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(220 25% 12%)" />
                        <stop offset="100%" stopColor="hsl(220 30% 8%)" />
                      </linearGradient>
                    </defs>
                    {/* Left ribbon tail */}
                    <path d="M0 20 L30 15 L30 35 L0 30 L10 25 Z" fill="url(#ribbonEdge)" />
                    {/* Right ribbon tail */}
                    <path d="M320 20 L290 15 L290 35 L320 30 L310 25 Z" fill="url(#ribbonEdge)" />
                    {/* Main ribbon */}
                    <path d="M20 10 L300 10 L290 25 L300 40 L20 40 L30 25 Z" fill="url(#ribbonGradient)" stroke="hsl(220 35% 35%)" strokeWidth="1" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h1 
                      className="font-display text-lg font-bold tracking-wide text-foreground"
                      style={{ textShadow: '0 2px 4px hsl(0 0% 0% / 0.8)' }}
                    >
                      {profile.character_name || 'Adventurer'}
                    </h1>
                  </div>
                </div>

                {/* Race & Title subtitle */}
                <div className="text-center mb-3">
                  <p className="text-xs text-muted-foreground font-display tracking-widest uppercase">
                    {getRaceName(profile.race || 'human')}
                  </p>
                  {activeTitle && (
                    <p 
                      className="text-xs font-display font-semibold tracking-wider mt-0.5"
                      style={{ color: 'hsl(45 80% 55%)' }}
                    >
                      "{activeTitle}"
                    </p>
                  )}
                </div>

                {/* XP Progress bar */}
                <div className="px-6 mb-4">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-blue-400 font-medium">XP</span>
                    <span className="text-muted-foreground">
                      {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)}
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{
                      background: 'hsl(220 15% 10%)',
                      border: '1px solid hsl(220 30% 22%)',
                      boxShadow: 'inset 0 1px 3px hsl(0 0% 0% / 0.5)',
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${xpProgress.percentage}%`,
                        background: 'linear-gradient(90deg, hsl(210 60% 40%) 0%, hsl(200 70% 50%) 100%)',
                        boxShadow: '0 0 10px hsl(210 60% 50% / 0.6)',
                      }}
                    />
                  </div>
                </div>

                {/* Stats section */}
                <div 
                  className="mx-4 mb-4 rounded-lg p-3"
                  style={{
                    background: 'linear-gradient(180deg, hsl(220 15% 10%) 0%, hsl(215 10% 6%) 100%)',
                    border: '1px solid hsl(220 30% 18%)',
                    boxShadow: 'inset 0 1px 4px hsl(0 0% 0% / 0.4)',
                  }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {/* Quests stat orb - Teal/cyan */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="relative w-12 h-12 rounded-full flex items-center justify-center mb-1"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, hsl(180 50% 40%) 0%, hsl(190 45% 30%) 60%, hsl(200 40% 20%) 100%)',
                          border: '2px solid hsl(190 40% 35%)',
                          boxShadow: '0 4px 12px hsl(190 50% 15% / 0.6), inset 0 -2px 4px hsl(0 0% 0% / 0.3), inset 0 2px 4px hsl(180 60% 60% / 0.3)',
                        }}
                      >
                        <span className="text-lg font-display font-bold text-white" style={{ textShadow: '0 1px 2px hsl(0 0% 0% / 0.5)' }}>
                          {questsCompleted}
                        </span>
                      </div>
                      <span className="text-[9px] text-cyan-400/80 font-display uppercase tracking-wider">Quests</span>
                    </div>

                    {/* Kms stat orb - Blue */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="relative w-12 h-12 rounded-full flex items-center justify-center mb-1"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, hsl(210 60% 45%) 0%, hsl(220 55% 35%) 60%, hsl(230 50% 25%) 100%)',
                          border: '2px solid hsl(220 45% 40%)',
                          boxShadow: '0 4px 12px hsl(220 50% 20% / 0.6), inset 0 -2px 4px hsl(0 0% 0% / 0.3), inset 0 2px 4px hsl(210 70% 65% / 0.3)',
                        }}
                      >
                        <span className="text-lg font-display font-bold text-white" style={{ textShadow: '0 1px 2px hsl(0 0% 0% / 0.5)' }}>
                          {totalKmsRun}
                        </span>
                      </div>
                      <span className="text-[9px] text-blue-400/80 font-display uppercase tracking-wider">Kms</span>
                    </div>

                    {/* Gear Score stat orb - Slate/grey */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="relative w-12 h-12 rounded-full flex items-center justify-center mb-1"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, hsl(220 20% 45%) 0%, hsl(215 15% 35%) 60%, hsl(210 10% 25%) 100%)',
                          border: '2px solid hsl(220 20% 40%)',
                          boxShadow: '0 4px 12px hsl(220 20% 15% / 0.6), inset 0 -2px 4px hsl(0 0% 0% / 0.3), inset 0 2px 4px hsl(220 30% 60% / 0.3)',
                        }}
                      >
                        <span className="text-lg font-display font-bold text-white" style={{ textShadow: '0 1px 2px hsl(0 0% 0% / 0.5)' }}>
                          {gearScore}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400/80 font-display uppercase tracking-wider">Gear</span>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative bar - Dark blue accent */}
                <div 
                  className="h-2"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsl(220 40% 30%) 20%, hsl(210 50% 40%) 50%, hsl(220 40% 30%) 80%, transparent 100%)',
                  }}
                />
              </div>
            </div>

            {/* Equipment Bag Button */}
            <div className="mt-6 space-y-3">
              <EquipmentDrawer>
                <Button 
                  variant="outline"
                  className="w-full font-display tracking-wider border-border/50 bg-card/80 hover:bg-card text-foreground"
                >
                  <Backpack className="w-4 h-4 mr-2" />
                  Equipment Bag
                </Button>
              </EquipmentDrawer>

              {/* Guilds Button - Coming Soon */}
              <Button 
                variant="outline"
                className="w-full font-display tracking-wider relative border-border/30 bg-muted/30 text-muted-foreground"
                disabled
              >
                <Users className="w-4 h-4 mr-2" />
                Guilds
                <span 
                  className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-muted text-muted-foreground border border-border/50"
                >
                  SOON
                </span>
              </Button>

              {/* Leaderboard Button */}
              <Button 
                variant="outline"
                className="w-full font-display tracking-wider border-secondary/30 bg-secondary/5 text-foreground hover:bg-secondary/10"
                onClick={() => navigate('/leaderboard')}
              >
                <Trophy className="w-4 h-4 mr-2 text-secondary" />
                World Leaderboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
