import { useProfile } from '@/hooks/useProfile';
import { StatusBar } from '@/components/home/StatusBar';
import { CampScene } from '@/components/home/CampScene';
import { LoadingScreen } from '@/components/LoadingScreen';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { PersonStanding, Dumbbell, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function Home() {
  const { data: profile, isLoading } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const quickActions = [
    { icon: PersonStanding, label: 'Run', color: 'bg-green-600/80 hover:bg-green-600' },
    { icon: Dumbbell, label: 'Lift', color: 'bg-orange-600/80 hover:bg-orange-600' },
    { icon: Compass, label: 'Explore', color: 'bg-blue-600/80 hover:bg-blue-600' },
  ];

  const handleQuickAction = (action: string) => {
    if (action === 'Run') {
      navigate('/run');
    } else {
      toast({
        title: `${action} Coming Soon`,
        description: `${action} tracking will be available soon!`,
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        background: '#1a1510',
      }}
    >
      {/* Status Bar */}
      {profile && (
        <StatusBar
          characterName={profile.character_name || 'Adventurer'}
          level={profile.level}
          xp={profile.xp}
          gold={profile.gold}
        />
      )}

      {/* Quick Action Buttons - Right Side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {quickActions.map(({ icon: Icon, label, color }) => (
          <Button
            key={label}
            size="icon"
            className={`w-14 h-14 rounded-full ${color} shadow-lg border-2 border-white/20 backdrop-blur transition-transform hover:scale-110`}
            onClick={() => handleQuickAction(label)}
          >
            <div className="flex flex-col items-center">
              <Icon className="w-6 h-6 text-white" />
              <span className="text-[10px] text-white font-medium mt-0.5">{label}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Camp Scene */}
      <div className="pt-16 flex-1 flex flex-col">
        <CampScene characterRace={profile?.race || 'human'} />
      </div>

      <BottomNav />
    </div>
  );
}
