import { useAvailableQuests, useActiveQuest, useAcceptQuest } from '@/hooks/useQuests';
import { QuestCard } from '@/components/QuestCard';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from '@/hooks/use-toast';
import { Scroll, AlertCircle } from 'lucide-react';

export default function Quests() {
  const { data: availableQuests, isLoading: questsLoading } = useAvailableQuests();
  const { data: activeQuest, isLoading: activeLoading } = useActiveQuest();
  const acceptQuest = useAcceptQuest();

  const isLoading = questsLoading || activeLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleAcceptQuest = async (questId: string) => {
    if (activeQuest) {
      toast({
        title: 'Quest Already Active',
        description: 'Complete your current quest before accepting a new one.',
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <Scroll className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Quest Board</h1>
          <p className="text-sm text-muted-foreground">Choose your next adventure</p>
        </div>

        {/* Active Quest Warning */}
        {activeQuest && (
          <div className="parchment-card p-3 flex items-start gap-3 border-secondary/50">
            <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-semibold text-sm">Quest In Progress</p>
              <p className="text-xs text-muted-foreground">
                Complete "{activeQuest.quest?.title}" before accepting a new quest.
              </p>
            </div>
          </div>
        )}

        {/* Quest List */}
        {availableQuests && availableQuests.length > 0 ? (
          <div className="space-y-3">
            {availableQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                questType={quest.quest_type}
                xpReward={quest.xp_reward}
                goldReward={quest.gold_reward}
                difficulty={quest.difficulty}
                onAccept={!activeQuest ? () => handleAcceptQuest(quest.id) : undefined}
                isLoading={acceptQuest.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="parchment-card p-8 text-center">
            <Scroll className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-display font-semibold mb-2">All Quests Completed!</h3>
            <p className="text-sm text-muted-foreground">
              You've conquered every challenge. New quests will appear soon.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
