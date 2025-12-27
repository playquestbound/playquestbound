import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import {
  useIsAdmin,
  useAdminQuests,
  useQuestStats,
  usePublishQuest,
  useScheduleQuest,
  useArchiveQuest,
  useBulkPublishQuests,
  useBulkArchiveQuests,
  useCreateQuest,
  type AdminQuest,
  type QuestFilters,
  type CreateQuestData,
} from "@/hooks/useAdminQuests";
import { useCancelSchedule } from "@/hooks/useScheduledQuests";
import { QuestFilters as QuestFiltersComponent } from "@/components/admin/QuestFilters";
import { QuestTable, QuestCards } from "@/components/admin/QuestTable";
import { QuestPreviewModal } from "@/components/admin/QuestPreviewModal";
import { ConfirmPublishModal } from "@/components/admin/ConfirmPublishModal";
import { ScheduleQuestModal } from "@/components/admin/ScheduleQuestModal";
import { QuickPublishPanel } from "@/components/admin/QuickPublishPanel";
import { CreateQuestModal } from "@/components/admin/CreateQuestModal";
import { ArrowLeft, Play, Archive, Loader2, RefreshCw, Box, Plus, ClipboardCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

export default function QuestManagement() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filters state
  const [filters, setFilters] = useState<QuestFilters>({
    status: "all",
    tier: "all",
    niche: "all",
    search: "",
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCheckingScheduled, setIsCheckingScheduled] = useState(false);

  // Modal states
  const [previewQuest, setPreviewQuest] = useState<AdminQuest | null>(null);
  const [publishQuest, setPublishQuest] = useState<AdminQuest | null>(null);
  const [scheduleQuest, setScheduleQuest] = useState<AdminQuest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Queries
  const { data: quests = [], isLoading: questsLoading, refetch: refetchQuests } = useAdminQuests(filters);
  const { data: stats, refetch: refetchStats } = useQuestStats();

  // Mutations
  const publishMutation = usePublishQuest();
  const scheduleMutation = useScheduleQuest();
  const archiveMutation = useArchiveQuest();
  const cancelScheduleMutation = useCancelSchedule();
  const bulkPublishMutation = useBulkPublishQuests();
  const bulkArchiveMutation = useBulkArchiveQuests();
  const createMutation = useCreateQuest();

  // Check for scheduled quests on load
  useEffect(() => {
    checkScheduledQuests();
  }, []);

  const checkScheduledQuests = async () => {
    setIsCheckingScheduled(true);
    try {
      const { data, error } = await supabase.functions.invoke('publish-scheduled-quests');
      
      if (error) {
        console.error('Error checking scheduled quests:', error);
        return;
      }

      if (data?.publishedCount > 0) {
        toast({
          title: "Scheduled Quests Published",
          description: `${data.publishedCount} scheduled quest(s) are now live!`,
        });
        refetchQuests();
        refetchStats();
      }
    } catch (error) {
      console.error('Error invoking scheduled quests function:', error);
    } finally {
      setIsCheckingScheduled(false);
    }
  };

  // Loading state
  if (authLoading || adminLoading) {
    return <LoadingScreen />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handlePublishConfirm = async () => {
    if (!publishQuest) return;

    try {
      await publishMutation.mutateAsync(publishQuest.id);
      toast({
        title: "Quest Published",
        description: `"${publishQuest.title}" is now live!`,
      });
      setPublishQuest(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish quest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickPublish = async (quest: AdminQuest) => {
    try {
      await publishMutation.mutateAsync(quest.id);
      toast({
        title: "Quest Published",
        description: `"${quest.title}" is now live!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish quest. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleQuickArchive = async (quest: AdminQuest) => {
    try {
      await archiveMutation.mutateAsync(quest.id);
      toast({
        title: "Quest Archived",
        description: `"${quest.title}" has been archived.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive quest. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleQuickBatchPublish = async (questIds: string[]) => {
    try {
      await bulkPublishMutation.mutateAsync(questIds);
      toast({
        title: "Quests Published",
        description: `${questIds.length} quests are now live!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish quests. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleScheduleConfirm = async (scheduledFor: string) => {
    if (!scheduleQuest) return;

    try {
      await scheduleMutation.mutateAsync({
        questId: scheduleQuest.id,
        scheduledFor,
      });
      toast({
        title: "Quest Scheduled",
        description: `"${scheduleQuest.title}" scheduled for ${new Date(scheduledFor).toLocaleString()}`,
      });
      setScheduleQuest(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule quest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (quest: AdminQuest) => {
    try {
      await archiveMutation.mutateAsync(quest.id);
      toast({
        title: "Quest Archived",
        description: `"${quest.title}" has been archived.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive quest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelSchedule = async (quest: AdminQuest) => {
    try {
      await cancelScheduleMutation.mutateAsync(quest.id);
      toast({
        title: "Schedule Cancelled",
        description: `"${quest.title}" has been returned to draft status.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;

    try {
      await bulkPublishMutation.mutateAsync(selectedIds);
      toast({
        title: "Quests Published",
        description: `${selectedIds.length} quests are now live!`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish quests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;

    try {
      await bulkArchiveMutation.mutateAsync(selectedIds);
      toast({
        title: "Quests Archived",
        description: `${selectedIds.length} quests have been archived.`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive quests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateQuest = async (questData: CreateQuestData) => {
    try {
      await createMutation.mutateAsync(questData);
      toast({
        title: "Quest Created",
        description: `"${questData.title}" has been created as a draft.`,
      });
      setShowCreateModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quest. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Quest Management
              </h1>
              <p className="text-muted-foreground mt-1">
                {stats?.total || 0} quests total • {stats?.live || 0} live • {stats?.scheduled || 0} scheduled • {stats?.draft || 0} draft
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/submissions')}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Submissions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/models')}
              >
                <Box className="mr-2 h-4 w-4" />
                3D Models
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={checkScheduledQuests}
                disabled={isCheckingScheduled}
              >
                {isCheckingScheduled ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Check Scheduled
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Quest
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Publish Panel */}
        <QuickPublishPanel
          quests={quests}
          onPublish={handleQuickPublish}
          onArchive={handleQuickArchive}
          onBatchPublish={handleQuickBatchPublish}
          isPublishing={publishMutation.isPending}
          isArchiving={archiveMutation.isPending}
        />

        {/* Filters */}
        <div className="mb-4">
          <QuestFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <Button
              size="sm"
              onClick={handleBulkPublish}
              disabled={bulkPublishMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {bulkPublishMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Publish Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkArchive}
              disabled={bulkArchiveMutation.isPending}
              className="border-red-600/50 text-red-400 hover:bg-red-600/10"
            >
              {bulkArchiveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Archive className="mr-2 h-4 w-4" />
              )}
              Archive Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Quest List */}
        {questsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isMobile ? (
          <QuestCards
            quests={quests}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onPublish={setPublishQuest}
            onSchedule={setScheduleQuest}
            onArchive={handleArchive}
            onPreview={setPreviewQuest}
            onCancelSchedule={handleCancelSchedule}
          />
        ) : (
          <QuestTable
            quests={quests}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onPublish={setPublishQuest}
            onSchedule={setScheduleQuest}
            onArchive={handleArchive}
            onPreview={setPreviewQuest}
            onCancelSchedule={handleCancelSchedule}
          />
        )}

        {/* Modals */}
        <QuestPreviewModal
          quest={previewQuest}
          open={!!previewQuest}
          onOpenChange={(open) => !open && setPreviewQuest(null)}
        />

        <ConfirmPublishModal
          questTitle={publishQuest?.title || ""}
          open={!!publishQuest}
          onOpenChange={(open) => !open && setPublishQuest(null)}
          onConfirm={handlePublishConfirm}
          isLoading={publishMutation.isPending}
        />

        <ScheduleQuestModal
          questTitle={scheduleQuest?.title || ""}
          open={!!scheduleQuest}
          onOpenChange={(open) => !open && setScheduleQuest(null)}
          onConfirm={handleScheduleConfirm}
          isLoading={scheduleMutation.isPending}
        />

        <CreateQuestModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={handleCreateQuest}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}
