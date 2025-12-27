import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestsGroupedByTier, useActiveQuests, useAcceptQuest, useAbandonQuest, UserQuest, Quest, QuestFilters } from '@/hooks/useQuests';
import { QuestCard } from '@/components/QuestCard';
import { QuestDetailModal } from '@/components/QuestDetailModal';
import { QuestFiltersBar } from '@/components/QuestFiltersBar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { QuestCompletionFlow } from '@/components/quest-completion';
import { toast } from '@/hooks/use-toast';
import { Scroll, AlertCircle, Crown, Sword, ChevronRight, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';

const MAX_ACTIVE_QUESTS = 5;

export default function Quests() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const userClass = profile?.class || null;
  
  const [filters, setFilters] = useState<QuestFilters>({
    niche: 'all',
    difficulty: 'all',
    classFilter: 'all',
  });

  // Adjust filters for "For You" option
  const effectiveFilters = {
    ...filters,
    classFilter: filters.classFilter === 'for-you' ? (userClass || 'all') : filters.classFilter,
  };

  const { groupedQuests, isLoading: questsLoading, allQuests } = useQuestsGroupedByTier(effectiveFilters, userClass);
  const { data: activeQuests, isLoading: activeLoading } = useActiveQuests();
  const acceptQuest = useAcceptQuest();
  const abandonQuest = useAbandonQuest();
  
  const [completingQuest, setCompletingQuest] = useState<UserQuest | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showAllGrand, setShowAllGrand] = useState(false);
  const [showAllMain, setShowAllMain] = useState(false);

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
      setSelectedQuest(null);
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

  const displayedGrandQuests = showAllGrand ? groupedQuests.grand : groupedQuests.grand.slice(0, 3);
  const displayedMainQuests = showAllMain ? groupedQuests.main : groupedQuests.main.slice(0, 5);
  const hasNoQuests = allQuests.length === 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <Scroll className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Quest Board</h1>
        </div>

        {/* Explore Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/run')}
            className="px-6 py-3 text-sm font-display tracking-widest bg-black text-white border-2 border-white/30 rounded-full hover:bg-black/90 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px 8px rgba(255,255,255,0.3), 0 0 40px 16px rgba(255,255,255,0.15), inset 0 0 20px rgba(255,255,255,0.1)',
              textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)',
            }}
          >
            EXPLORE
          </Button>
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
                  niche={userQuest.quest?.niche}
                  classAffinity={userQuest.quest?.class_affinity}
                  xpReward={userQuest.quest?.xp_reward || 0}
                  goldReward={userQuest.quest?.gold_reward || 0}
                  difficulty={userQuest.quest?.difficulty || 'Easy'}
                  isActive={true}
                  onComplete={() => setCompletingQuest(userQuest)}
                  onAbandon={() => handleAbandonQuest(userQuest.id, userQuest.quest?.title || 'Quest')}
                  isLoading={abandonQuest.isPending}
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
          <TabsContent value="new" className="mt-4 space-y-6">
            {/* Filters */}
            <QuestFiltersBar 
              filters={filters} 
              onFiltersChange={setFilters}
              userClass={userClass}
            />

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

            {/* No Quests State */}
            {hasNoQuests ? (
              <div className="parchment-card p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-display font-semibold mb-2">New Quests Coming Soon!</h3>
                <p className="text-sm text-muted-foreground">
                  Stay adventurous. More challenges await.
                </p>
              </div>
            ) : (
              <>
                {/* For You Section */}
                {groupedQuests.forYou.length > 0 && filters.classFilter === 'all' && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="font-display font-bold text-lg">Recommended for {userClass}</h2>
                    </div>
                    <div className="space-y-3">
                      {groupedQuests.forYou.slice(0, 3).map((quest) => (
                        <QuestCard
                          key={quest.id}
                          title={quest.title}
                          description={quest.description}
                          questType={quest.quest_type}
                          questCategory={(quest.quest_category as 'side' | 'main' | 'grand') || 'side'}
                          niche={quest.niche}
                          classAffinity={quest.class_affinity}
                          xpReward={quest.xp_reward}
                          goldReward={quest.gold_reward}
                          difficulty={quest.difficulty}
                          isRecommended
                          onClick={() => setSelectedQuest(quest)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Grand Quests Section */}
                {groupedQuests.grand.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-display font-bold text-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">
                          Legendary Quests
                        </h2>
                      </div>
                      {groupedQuests.grand.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllGrand(!showAllGrand)}
                          className="text-xs"
                        >
                          {showAllGrand ? 'Show Less' : 'See All'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {displayedGrandQuests.map((quest) => (
                        <QuestCard
                          key={quest.id}
                          title={quest.title}
                          description={quest.description}
                          questType={quest.quest_type}
                          questCategory="grand"
                          niche={quest.niche}
                          classAffinity={quest.class_affinity}
                          xpReward={quest.xp_reward}
                          goldReward={quest.gold_reward}
                          difficulty={quest.difficulty}
                          onClick={() => setSelectedQuest(quest)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Main Quests Section */}
                {groupedQuests.main.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sword className="w-5 h-5 text-primary" />
                        <h2 className="font-display font-bold text-lg">Main Quests</h2>
                      </div>
                      {groupedQuests.main.length > 5 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllMain(!showAllMain)}
                          className="text-xs"
                        >
                          {showAllMain ? 'Show Less' : 'See All'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {displayedMainQuests.map((quest) => (
                        <QuestCard
                          key={quest.id}
                          title={quest.title}
                          description={quest.description}
                          questType={quest.quest_type}
                          questCategory="main"
                          niche={quest.niche}
                          classAffinity={quest.class_affinity}
                          xpReward={quest.xp_reward}
                          goldReward={quest.gold_reward}
                          difficulty={quest.difficulty}
                          onClick={() => setSelectedQuest(quest)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Side Quests Section */}
                {groupedQuests.side.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Scroll className="w-5 h-5 text-muted-foreground" />
                      <h2 className="font-display font-bold text-lg">Side Quests</h2>
                    </div>
                    <div className="space-y-2">
                      {groupedQuests.side.map((quest) => (
                        <QuestCard
                          key={quest.id}
                          title={quest.title}
                          description={quest.description}
                          questType={quest.quest_type}
                          questCategory="side"
                          niche={quest.niche}
                          classAffinity={quest.class_affinity}
                          xpReward={quest.xp_reward}
                          goldReward={quest.gold_reward}
                          difficulty={quest.difficulty}
                          compact
                          onClick={() => setSelectedQuest(quest)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* No quests in filtered category */}
                {groupedQuests.grand.length === 0 && 
                 groupedQuests.main.length === 0 && 
                 groupedQuests.side.length === 0 && (
                  <div className="parchment-card p-8 text-center">
                    <Scroll className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <h3 className="font-display font-semibold mb-2">No Quests Found</h3>
                    <p className="text-sm text-muted-foreground">
                      No quests match your filters. Try adjusting them!
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quest Detail Modal */}
      <QuestDetailModal
        quest={selectedQuest}
        open={!!selectedQuest}
        onOpenChange={(open) => !open && setSelectedQuest(null)}
        onAccept={selectedQuest ? () => handleAcceptQuest(selectedQuest.id) : undefined}
        isLoading={acceptQuest.isPending}
        canAccept={canAcceptMore}
      />

      {/* Quest Completion Flow */}
      <QuestCompletionFlow
        userQuest={completingQuest}
        open={!!completingQuest}
        onOpenChange={(open) => !open && setCompletingQuest(null)}
      />
    </div>
  );
}
