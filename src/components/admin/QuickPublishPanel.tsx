import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Zap, ChevronDown, ChevronUp, Play, Archive, Loader2, Undo2, 
  Crown, Footprints, Swords, X
} from "lucide-react";
import { type AdminQuest } from "@/hooks/useAdminQuests";
import { format, formatDistanceToNow } from "date-fns";
import { GrandQuestConfirmModal } from "./GrandQuestConfirmModal";
import { BatchPublishModal } from "./BatchPublishModal";

interface QuickPublishPanelProps {
  quests: AdminQuest[];
  onPublish: (quest: AdminQuest) => Promise<void>;
  onArchive: (quest: AdminQuest) => Promise<void>;
  onBatchPublish: (questIds: string[]) => Promise<void>;
  isPublishing?: boolean;
  isArchiving?: boolean;
}

const tierConfig = {
  grand: { label: "Grand", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", icon: Crown },
  main: { label: "Main", color: "bg-blue-500/20 text-blue-400 border-blue-500/50", icon: Swords },
  side: { label: "Side", color: "bg-slate-500/20 text-slate-400 border-slate-500/50", icon: Footprints },
};

interface UndoAction {
  quest: AdminQuest;
  expiresAt: number;
}

export function QuickPublishPanel({
  quests,
  onPublish,
  onArchive,
  onBatchPublish,
  isPublishing,
  isArchiving,
}: QuickPublishPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [grandQuestToConfirm, setGrandQuestToConfirm] = useState<AdminQuest | null>(null);
  const [batchPublishConfig, setBatchPublishConfig] = useState<{
    category: string;
    quests: AdminQuest[];
  } | null>(null);
  const [undoActions, setUndoActions] = useState<UndoAction[]>([]);

  // Filter quests
  const draftQuests = quests.filter(q => q.status === "draft");
  const recentlyPublished = quests
    .filter(q => q.status === "live" && q.published_at)
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
    .slice(0, 5);

  // Category counts for batch publish
  const runningDrafts = draftQuests.filter(q => q.niche === "running");
  const sideDrafts = draftQuests.filter(q => q.tier === "side");
  const easyDrafts = draftQuests.filter(q => q.difficulty === "Easy");

  // Cleanup expired undo actions
  useEffect(() => {
    const interval = setInterval(() => {
      setUndoActions(prev => prev.filter(action => action.expiresAt > Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickPublish = async (quest: AdminQuest) => {
    // Grand quests need extra confirmation
    if (quest.tier === "grand") {
      setGrandQuestToConfirm(quest);
      return;
    }

    await performPublish(quest);
  };

  const performPublish = async (quest: AdminQuest) => {
    setPublishingId(quest.id);
    try {
      await onPublish(quest);
      // Add to undo list
      setUndoActions(prev => [
        ...prev,
        { quest, expiresAt: Date.now() + 10000 }
      ]);
    } finally {
      setPublishingId(null);
    }
  };

  const handleQuickArchive = async (quest: AdminQuest) => {
    setArchivingId(quest.id);
    try {
      await onArchive(quest);
    } finally {
      setArchivingId(null);
    }
  };

  const handleBatchPublishClick = (category: string, quests: AdminQuest[]) => {
    // Check if any grand quests in the batch
    const hasGrandQuests = quests.some(q => q.tier === "grand");
    setBatchPublishConfig({ category, quests });
  };

  const handleBatchPublishConfirm = async () => {
    if (!batchPublishConfig) return;
    await onBatchPublish(batchPublishConfig.quests.map(q => q.id));
    setBatchPublishConfig(null);
  };

  const handleUndo = async (action: UndoAction) => {
    // Remove from undo list first
    setUndoActions(prev => prev.filter(a => a.quest.id !== action.quest.id));
    // Archive to undo the publish
    await onArchive(action.quest);
  };

  const TierIcon = ({ tier }: { tier: string }) => {
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.side;
    const Icon = config.icon;
    return <Icon className="h-3 w-3" />;
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-4 hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Quick Publish</span>
                <Badge variant="secondary" className="ml-2">
                  {draftQuests.length} drafts ready
                </Badge>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="px-4 pb-4 space-y-4">
            {/* Undo Notifications */}
            {undoActions.length > 0 && (
              <div className="space-y-2">
                {undoActions.map(action => (
                  <div
                    key={action.quest.id}
                    className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/30 rounded-md"
                  >
                    <span className="text-sm text-green-400">
                      "{action.quest.title}" is now live!
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUndo(action)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                    >
                      <Undo2 className="h-4 w-4 mr-1" />
                      Undo ({Math.ceil((action.expiresAt - Date.now()) / 1000)}s)
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Draft Quests Ready to Publish */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Draft Quests Ready to Publish
              </h3>
              {draftQuests.length === 0 ? (
                <p className="text-sm text-muted-foreground/60 italic">
                  No draft quests available
                </p>
              ) : (
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-3 pb-2">
                    {draftQuests.map(quest => {
                      const tier = tierConfig[quest.tier as keyof typeof tierConfig] || tierConfig.side;
                      return (
                        <div
                          key={quest.id}
                          className="flex-shrink-0 w-56 p-3 bg-card/50 border border-border rounded-lg space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium text-foreground truncate flex-1">
                              {quest.title}
                            </h4>
                            <Badge variant="outline" className={`${tier.color} text-xs flex-shrink-0`}>
                              <TierIcon tier={quest.tier || "side"} />
                              <span className="ml-1">{tier.label}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{quest.xp_reward} XP</span>
                            <span>•</span>
                            <span>{quest.gold_reward} Gold</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleQuickPublish(quest)}
                            disabled={publishingId === quest.id || isPublishing}
                            className="w-full bg-green-600 hover:bg-green-700 text-sm"
                          >
                            {publishingId === quest.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            Publish
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </div>

            {/* Batch Publish by Category */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Batch Publish by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchPublishClick("Running Quests", runningDrafts)}
                  disabled={runningDrafts.length === 0}
                  className="text-xs"
                >
                  <Footprints className="h-3 w-3 mr-1" />
                  Publish All Running Quests ({runningDrafts.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchPublishClick("Side Quests", sideDrafts)}
                  disabled={sideDrafts.length === 0}
                  className="text-xs"
                >
                  <Swords className="h-3 w-3 mr-1" />
                  Publish All Side Quests ({sideDrafts.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchPublishClick("Easy Quests", easyDrafts)}
                  disabled={easyDrafts.length === 0}
                  className="text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Publish All Easy Quests ({easyDrafts.length})
                </Button>
              </div>
            </div>

            {/* Recently Published */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Recently Published
              </h3>
              {recentlyPublished.length === 0 ? (
                <p className="text-sm text-muted-foreground/60 italic">
                  No recently published quests
                </p>
              ) : (
                <div className="space-y-2">
                  {recentlyPublished.map(quest => (
                    <div
                      key={quest.id}
                      className="flex items-center justify-between p-2 bg-card/30 border border-border/50 rounded-md"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm font-medium text-foreground truncate">
                          {quest.title}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {quest.published_at && formatDistanceToNow(new Date(quest.published_at), { addSuffix: true })}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleQuickArchive(quest)}
                        disabled={archivingId === quest.id || isArchiving}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                      >
                        {archivingId === quest.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Archive className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Grand Quest Confirmation Modal */}
      <GrandQuestConfirmModal
        quest={grandQuestToConfirm}
        open={!!grandQuestToConfirm}
        onOpenChange={(open) => !open && setGrandQuestToConfirm(null)}
        onConfirm={() => {
          if (grandQuestToConfirm) {
            performPublish(grandQuestToConfirm);
            setGrandQuestToConfirm(null);
          }
        }}
        isLoading={publishingId === grandQuestToConfirm?.id}
      />

      {/* Batch Publish Confirmation Modal */}
      <BatchPublishModal
        category={batchPublishConfig?.category || ""}
        quests={batchPublishConfig?.quests || []}
        open={!!batchPublishConfig}
        onOpenChange={(open) => !open && setBatchPublishConfig(null)}
        onConfirm={handleBatchPublishConfirm}
        isLoading={isPublishing}
      />
    </>
  );
}
