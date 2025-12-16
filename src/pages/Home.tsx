import { useProfile } from '@/hooks/useProfile';
import { StatusBar } from '@/components/home/StatusBar';
import { CampScene } from '@/components/home/CampScene';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function Home() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <LoadingScreen />;
  }

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

      {/* Camp Scene */}
      <div className="pt-16 flex-1 flex flex-col">
        <CampScene characterRace={profile?.race || 'human'} />
      </div>
    </div>
  );
}
