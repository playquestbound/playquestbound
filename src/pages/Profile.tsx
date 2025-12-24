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
  User,
  Sword,
  Shield,
  Crown,
  Shirt,
  CircleDot,
  Footprints,
  Gem,
  Backpack,
  Settings,
  ChevronDown,
  BookOpen,
  Pencil,
  ShieldCheck
} from 'lucide-react';
import { useIsAdmin } from '@/hooks/useAdminQuests';

interface Customization {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyeColor?: string;
}

// Equipment slot component
function EquipmentSlot({ icon: Icon, label, item, position }: { 
  icon: typeof Sword; 
  label: string; 
  item?: string;
  position: 'left' | 'right';
}) {
  return (
    <div 
      className={`flex items-center gap-2 ${position === 'right' ? 'flex-row-reverse' : ''}`}
    >
      <div 
        className="w-12 h-12 rounded border-2 flex items-center justify-center transition-all hover:border-amber-500/70 cursor-pointer"
        style={{
          background: 'linear-gradient(180deg, #2a2318 0%, #1a1510 100%)',
          borderColor: item ? '#6b5a3c' : '#3d3428',
          boxShadow: item ? 'inset 0 0 8px rgba(212,168,87,0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        <Icon className={`w-5 h-5 ${item ? 'text-amber-500' : 'text-white/30'}`} />
      </div>
      <span className={`text-[10px] ${item ? 'text-parchment-light' : 'text-white/40'}`}>
        {item || label}
      </span>
    </div>
  );
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
  const customization = profile?.customization as Customization | null;

  return (
    <div 
      className="min-h-screen pb-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1a1510 50%, #0d0d0d 100%)',
      }}
    >
      {/* Header */}
      <div className="relative px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button 
                size="icon" 
                variant="ghost"
                className="w-10 h-10 rounded-full"
                onClick={() => navigate('/admin/quests')}
              >
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </Button>
            )}
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full"
              onClick={() => navigate('/journal')}
            >
              <BookOpen className="w-5 h-5 text-white/70" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5 text-white/70" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full"
              onClick={() => navigate('/create-character')}
            >
              <Pencil className="w-5 h-5 text-white/70" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="w-10 h-10 rounded-full"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-white/70" />
            </Button>
          </div>
        </div>
      </div>

      {profile && (
        <div className="px-4 space-y-4">
          {/* Character Name Header */}
          <div className="text-center">
            {/* Avatar circle */}
            <div 
              className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center mb-2"
              style={{
                background: 'linear-gradient(180deg, #2a2318 0%, #1a1510 100%)',
                borderColor: '#6b5a3c',
              }}
            >
              <User className="w-8 h-8 text-amber-500/70" />
            </div>
            
            <h1 
              className="font-display text-xl font-bold text-parchment-light"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
            >
              {profile.character_name || 'Adventurer'}
            </h1>
            
            <p 
              className="text-sm text-amber-500"
              style={{ textShadow: '0 0 8px rgba(212,168,87,0.3)' }}
            >
              Level {profile.level} {getRaceName(profile.race || 'human')} {profile.class ? profile.class.charAt(0).toUpperCase() + profile.class.slice(1) : ''}
            </p>

            {/* Title selector */}
            <button 
              className="mt-2 flex items-center gap-1 mx-auto text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              <ChevronDown className="w-3 h-3" />
              <span>Select a Title</span>
            </button>
          </div>

          {/* Main Character Display with Equipment Slots */}
          <div className="relative py-4">
            {/* Left Equipment Slots */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-3 z-10">
              <EquipmentSlot icon={Crown} label="Head" position="left" />
              <EquipmentSlot icon={Gem} label="Neck" position="left" />
              <EquipmentSlot icon={Shirt} label="Chest" position="left" />
              <EquipmentSlot icon={CircleDot} label="Hands" position="left" />
              <EquipmentSlot icon={Footprints} label="Feet" position="left" />
            </div>

            {/* Right Equipment Slots */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-3 z-10">
              <EquipmentSlot icon={Sword} label="Main Hand" position="right" />
              <EquipmentSlot icon={Shield} label="Off Hand" position="right" />
              <EquipmentSlot icon={Gem} label="Ring 1" position="right" />
              <EquipmentSlot icon={Gem} label="Ring 2" position="right" />
              <EquipmentSlot icon={Gem} label="Trinket" position="right" />
            </div>

            {/* Center Character - 3D Model */}
            <div className="flex items-center justify-center py-4">
              <div 
                className="w-48 h-72 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(212,168,87,0.1) 0%, transparent 70%)',
                }}
              >
                <CharacterProfile3D 
                  raceId={profile.race || 'human'} 
                  gender={(customization as any)?.gender as Gender || 'male'}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div 
            className="rounded-lg p-4"
            style={{
              background: 'linear-gradient(180deg, #2a2318 0%, #1a1510 100%)',
              border: '2px solid #3d3428',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex justify-between">
                <span className="text-amber-600 text-sm">Quests Done</span>
                <span className="text-parchment-light text-sm font-bold">{questsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600 text-sm">Total XP</span>
                <span className="text-parchment-light text-sm font-bold">{formatNumber(profile.xp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600 text-sm">Kms Run</span>
                <span className="text-parchment-light text-sm font-bold">{totalKmsRun}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600 text-sm">Gold</span>
                <span className="text-amber-400 text-sm font-bold">{formatNumber(profile.gold)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600 text-sm">Level</span>
                <span className="text-parchment-light text-sm font-bold">{profile.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600 text-sm">Gear Score</span>
                <span className="text-parchment-light text-sm font-bold">0</span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Level {profile.level} Progress</span>
                <span className="text-amber-500">{Math.round(xpProgress.percentage)}%</span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{
                  background: '#1a1510',
                  border: '1px solid #3d3428',
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${xpProgress.percentage}%`,
                    background: 'linear-gradient(180deg, #d4a857 0%, #b8903d 100%)',
                    boxShadow: '0 0 8px rgba(212,168,87,0.5)',
                  }}
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1 text-center">
                {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP to level {profile.level + 1}
              </p>
            </div>
          </div>

          {/* Equipment Bag Button */}
          <EquipmentDrawer>
            <Button 
              className="w-full"
              style={{
                background: 'linear-gradient(180deg, #4a3d2a 0%, #2a2318 100%)',
                border: '2px solid #6b5a3c',
              }}
            >
              <Backpack className="w-4 h-4 mr-2" />
              View Equipment Bag
            </Button>
          </EquipmentDrawer>
        </div>
      )}
    </div>
  );
}
