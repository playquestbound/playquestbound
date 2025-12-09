import { useState } from 'react';
import { useProfile, useUpdateStats } from '@/hooks/useProfile';
import { useActiveQuest, useAvailableQuests, useAcceptQuest, useCompleteQuest } from '@/hooks/useQuests';
import { CharacterHeader } from '@/components/CharacterHeader';
import { QuestCard } from '@/components/QuestCard';
import { VideoUploader } from '@/components/VideoUploader';
import { CompletionModal } from '@/components/CompletionModal';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from '@/hooks/use-toast';
import { Scroll, Compass } from 'lucide-react';

export default function Home() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: activeQuest, isLoading: activeLoading } = useActiveQuest();
  const { data: availableQuests, isLoading: questsLoading } = useAvailableQuests();
  const acceptQuest = useAcceptQuest();
  const completeQuest = useCompleteQuest();
  const updateStats = useUpdateStats();
  
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedQuestRewards, setCompletedQuestRewards] = useState({ xp: 0, gold: 0, title: '' });

  const isLoading = profileLoading || activeLoading || questsLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleAcceptQuest = async (questId: string) => {
    try {
      await acceptQuest.mutateAsync(questId);
      toast({
        title: 'Quest Accepted!',
        description: 'Your adventure awaits. Go forth and conquer!',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to accept quest.',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteQuest = () => {
    // Get GPS location
    if (!navigator.geolocation) {
      toast({
        title: 'Location Required',
        description: 'GPS is required to verify quest completion.',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setShowVideoUploader(true);
      },
      () => {
        toast({
          title: 'Location Access Denied',
          description: 'Please enable location to complete quests.',
          variant: 'destructive',
        });
      }
    );
  };

  const handleVideoUploadComplete = async (videoUrl: string) => {
    if (!activeQuest?.quest) return;

    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await completeQuest.mutateAsync({
        userQuestId: activeQuest.id,
        videoUrl,
        locationLat: position.coords.latitude,
        locationLng: position.coords.longitude,
      });

      // Update stats
      await updateStats.mutateAsync({
        xpGain: activeQuest.quest.xp_reward,
        goldGain: activeQuest.quest.gold_reward,
      });

      setShowVideoUploader(false);
      setCompletedQuestRewards({
        xp: activeQuest.quest.xp_reward,
        gold: activeQuest.quest.gold_reward,
        title: activeQuest.quest.title,
      });
      setShowCompletion(true);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to complete quest.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Character Header */}
        {profile && (
          <CharacterHeader
            characterName={profile.character_name || 'Adventurer'}
            race={profile.race || 'wanderer'}
            level={profile.level}
            xp={profile.xp}
            gold={profile.gold}
          />
        )}

        {/* Video Uploader Modal */}
        {showVideoUploader && (
          <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <VideoUploader
                onUploadComplete={handleVideoUploadComplete}
                onCancel={() => setShowVideoUploader(false)}
              />
            </div>
          </div>
        )}

        {/* Active Quest */}
        {activeQuest?.quest && !showVideoUploader && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Scroll className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-semibold">Active Quest</h2>
            </div>
            <QuestCard
              title={activeQuest.quest.title}
              description={activeQuest.quest.description}
              questType={activeQuest.quest.quest_type}
              xpReward={activeQuest.quest.xp_reward}
              goldReward={activeQuest.quest.gold_reward}
              difficulty={activeQuest.quest.difficulty}
              isActive
              onComplete={handleCompleteQuest}
              isLoading={completeQuest.isPending}
            />
          </section>
        )}

        {/* Available Quests */}
        {!activeQuest && availableQuests && availableQuests.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-semibold">Available Quests</h2>
            </div>
            <div className="space-y-3">
              {availableQuests.slice(0, 3).map((quest) => (
                <QuestCard
                  key={quest.id}
                  title={quest.title}
                  description={quest.description}
                  questType={quest.quest_type}
                  xpReward={quest.xp_reward}
                  goldReward={quest.gold_reward}
                  difficulty={quest.difficulty}
                  onAccept={() => handleAcceptQuest(quest.id)}
                  isLoading={acceptQuest.isPending}
                />
              ))}
            </div>
          </section>
        )}

        {/* No quests message */}
        {!activeQuest && (!availableQuests || availableQuests.length === 0) && (
          <div className="parchment-card p-8 text-center">
            <Compass className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-display font-semibold mb-2">No Quests Available</h3>
            <p className="text-sm text-muted-foreground">
              You've completed all available quests! Check back later for new adventures.
            </p>
          </div>
        )}
      </div>

      <BottomNav />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        xpReward={completedQuestRewards.xp}
        goldReward={completedQuestRewards.gold}
        questTitle={completedQuestRewards.title}
      />
    </div>
  );
}
