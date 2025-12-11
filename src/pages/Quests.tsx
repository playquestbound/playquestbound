import { useState } from 'react';
import { useAvailableQuests, useActiveQuests, useAcceptQuest, useAbandonQuest, useCompleteQuest, UserQuest } from '@/hooks/useQuests';
import { QuestCard } from '@/components/QuestCard';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { VideoUploader } from '@/components/VideoUploader';
import { toast } from '@/hooks/use-toast';
import { Scroll, AlertCircle, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useProfile, useUpdateStats } from '@/hooks/useProfile';

const MAX_ACTIVE_QUESTS = 5;

export default function Quests() {
  const { data: availableQuests, isLoading: questsLoading } = useAvailableQuests();
  const { data: activeQuests, isLoading: activeLoading } = useActiveQuests();
  const { refetch: refetchProfile } = useProfile();
  const acceptQuest = useAcceptQuest();
  const abandonQuest = useAbandonQuest();
  const completeQuest = useCompleteQuest();
  const updateStats = useUpdateStats();
  
  const [completingQuest, setCompletingQuest] = useState<UserQuest | null>(null);

  const isLoading = questsLoading || activeLoading;
  const activeQuestCount = activeQuests?.length || 0;
  const canAcceptMore = activeQuestCount < MAX_ACTIVE_QUESTS;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleAcceptQuest = async (questId: string) => {
    if (!canAcceptMore) {
      toast({
        title: 'Quest Limit Reached',
        description: `You can only have ${MAX_ACTIVE_QUESTS} active quests. Abandon one to accept a new quest.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await acceptQuest.mutateAsync(questId);
      toast({
        title: 'Quest Accepted!',
        description: 'Your adventure awaits!',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to accept quest.',
        variant: 'destructive',
      });
    }
  };

  const handleAbandonQuest = async (userQuestId: string, questTitle: string) => {
    try {
      await abandonQuest.mutateAsync(userQuestId);
      toast({
        title: 'Quest Abandoned',
        description: `"${questTitle}" has been returned to the quest board.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to abandon quest.',
        variant: 'destructive',
      });
    }
  };

  const handleVideoUploadComplete = async (videoUrl: string) => {
    if (!completingQuest) return;

    try {
      // Get current location
      let locationLat = 0;
      let locationLng = 0;
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          locationLat = position.coords.latitude;
          locationLng = position.coords.longitude;
        } catch {
          console.log('Location not available, using defaults');
        }
      }

      await completeQuest.mutateAsync({
        userQuestId: completingQuest.id,
        videoUrl,
        locationLat,
        locationLng,
      });

      // Update XP and gold
      const xpReward = completingQuest.quest?.xp_reward || 0;
      const goldReward = completingQuest.quest?.gold_reward || 0;
      await updateStats.mutateAsync({ xpGain: xpReward, goldGain: goldReward });

      await refetchProfile();

      toast({
        title: 'Quest Complete!',
        description: `You earned ${completingQuest.quest?.xp_reward || 0} XP and ${completingQuest.quest?.gold_reward || 0} gold!`,
      });
      
      setCompletingQuest(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to complete quest.',
        variant: 'destructive',
      });
    }
  };

  // Show quest completion screen
  if (completingQuest) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-4 space-y-4 max-w-lg mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-2"
            onClick={() => setCompletingQuest(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quests
          </Button>

          {/* Quest Info */}
          <div className="parchment-card p-4">
            <h2 className="font-display text-xl font-bold mb-2">
              Complete: {completingQuest.quest?.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {completingQuest.quest?.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-xp font-semibold">+{completingQuest.quest?.xp_reward} XP</span>
              <span className="text-secondary font-semibold">+{completingQuest.quest?.gold_reward} Gold</span>
            </div>
          </div>

          {/* Video Uploader */}
          <VideoUploader
            onUploadComplete={handleVideoUploadComplete}
            onCancel={() => setCompletingQuest(null)}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <Scroll className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Quest Board</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeQuestCount > 0 ? "ongoing" : "new"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border">
            <TabsTrigger value="ongoing" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              Ongoing ({activeQuestCount}/{MAX_ACTIVE_QUESTS})
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              New Quests
            </TabsTrigger>
          </TabsList>

          {/* Ongoing Quests Tab */}
          <TabsContent value="ongoing" className="mt-4 space-y-3">
            {activeQuests && activeQuests.length > 0 ? (
              activeQuests.map((userQuest) => (
                <QuestCard
                  key={userQuest.id}
                  title={userQuest.quest?.title || 'Unknown Quest'}
                  description={userQuest.quest?.description || ''}
                  questType={userQuest.quest?.quest_type || 'nature'}
                  questCategory={(userQuest.quest?.quest_category as 'side' | 'main' | 'grand') || 'side'}
                  xpReward={userQuest.quest?.xp_reward || 0}
                  goldReward={userQuest.quest?.gold_reward || 0}
                  difficulty={userQuest.quest?.difficulty || 'Easy'}
                  isActive={true}
                  onComplete={() => setCompletingQuest(userQuest)}
                  onAbandon={() => handleAbandonQuest(userQuest.id, userQuest.quest?.title || 'Quest')}
                  isLoading={abandonQuest.isPending || completeQuest.isPending}
                />
              ))
            ) : (
              <div className="parchment-card p-8 text-center">
                <Scroll className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-display font-semibold mb-2">No Active Quests</h3>
                <p className="text-sm text-muted-foreground">
                  Accept a new quest to begin your adventure!
                </p>
              </div>
            )}
          </TabsContent>

          {/* New Quests Tab */}
          <TabsContent value="new" className="mt-4 space-y-3">
            {/* Quest Limit Warning */}
            {!canAcceptMore && (
              <div className="parchment-card p-3 flex items-start gap-3 border-secondary/50">
                <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-semibold text-sm">Quest Limit Reached</p>
                  <p className="text-xs text-muted-foreground">
                    Abandon or complete a quest to accept a new one.
                  </p>
                </div>
              </div>
            )}

            {/* Quest List */}
            {availableQuests && availableQuests.length > 0 ? (
              availableQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  title={quest.title}
                  description={quest.description}
                  questType={quest.quest_type}
                  questCategory={quest.quest_category as 'side' | 'main' | 'grand'}
                  xpReward={quest.xp_reward}
                  goldReward={quest.gold_reward}
                  difficulty={quest.difficulty}
                  onAccept={canAcceptMore ? () => handleAcceptQuest(quest.id) : undefined}
                  isLoading={acceptQuest.isPending}
                />
              ))
            ) : (
              <div className="parchment-card p-8 text-center">
                <Scroll className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-display font-semibold mb-2">All Quests Completed!</h3>
                <p className="text-sm text-muted-foreground">
                  You've conquered every challenge. New quests will appear soon.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
