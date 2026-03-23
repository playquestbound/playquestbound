import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AdminQuest {
  id: string;
  title: string;
  description: string;
  quest_type: string;
  quest_category: string;
  niche: string | null;
  class_affinity: string | null;
  xp_reward: number;
  gold_reward: number;
  difficulty: string;
  tier: string | null;
  status: string | null;
  is_active: boolean;
  is_funded_eligible: boolean | null;
  requires_manual_review: boolean | null;
  verification_config: Record<string, unknown> | null;
  published_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestFilters {
  status: string;
  tier: string;
  niche: string;
  search: string;
}

export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data === true;
    },
    enabled: !!user,
  });
}

export function useAdminQuests(filters: QuestFilters) {
  return useQuery({
    queryKey: ['admin-quests', filters],
    queryFn: async (): Promise<AdminQuest[]> => {
      let query = supabase
        .from('quests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.tier && filters.tier !== 'all') {
        query = query.eq('tier', filters.tier);
      }

      if (filters.niche && filters.niche !== 'all') {
        query = query.eq('niche', filters.niche);
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as AdminQuest[];
    },
  });
}

export function useQuestStats() {
  return useQuery({
    queryKey: ['quest-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quests')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        live: data?.filter(q => q.status === 'live').length || 0,
        draft: data?.filter(q => q.status === 'draft').length || 0,
        scheduled: data?.filter(q => q.status === 'scheduled').length || 0,
        archived: data?.filter(q => q.status === 'archived').length || 0,
      };

      return stats;
    },
  });
}

export function usePublishQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questId: string) => {
      const { data, error } = await supabase
        .from('quests')
        .update({
          status: 'live',
          is_active: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', questId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest-stats'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
    },
  });
}

export function useScheduleQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questId, scheduledFor }: { questId: string; scheduledFor: string }) => {
      const { data, error } = await supabase
        .from('quests')
        .update({
          status: 'scheduled',
          scheduled_for: scheduledFor,
        })
        .eq('id', questId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest-stats'] });
    },
  });
}

export function useArchiveQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questId: string) => {
      const { data, error } = await supabase
        .from('quests')
        .update({
          status: 'archived',
          is_active: false,
        })
        .eq('id', questId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest-stats'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
    },
  });
}

export function useBulkPublishQuests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questIds: string[]) => {
      const { data, error } = await supabase
        .from('quests')
        .update({
          status: 'live',
          is_active: true,
          published_at: new Date().toISOString(),
        })
        .in('id', questIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest-stats'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
    },
  });
}

export function useBulkArchiveQuests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questIds: string[]) => {
      const { data, error } = await supabase
        .from('quests')
        .update({
          status: 'archived',
          is_active: false,
        })
        .in('id', questIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest-stats'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
    },
  });
}

export interface CreateQuestData {
  title: string;
  description: string;
  quest_type: string;
  quest_category: string;
  niche: string | null;
  class_affinity: string | null;
  xp_reward: number;
  gold_reward: number;
  difficulty: string;
  tier: string;
  is_funded_eligible: boolean;
  requires_manual_review: boolean;
  verification_config: {
    requires_gps: boolean;
    requires_video: boolean;
    challenges: string[];
  };
  min_level: number | null;
  visibility_lat: number | null;
  visibility_lng: number | null;
  visibility_radius_km: number | null;
}

export function useCreateQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questData: CreateQuestData) => {
      const { data, error } = await supabase
        .from('quests')
        .insert({
          title: questData.title,
          description: questData.description,
          quest_type: questData.quest_type,
          quest_category: questData.quest_category,
          niche: questData.niche || null,
          class_affinity: questData.class_affinity || null,
          xp_reward: questData.xp_reward,
          gold_reward: questData.gold_reward,
          difficulty: questData.difficulty,
          tier: questData.tier,
          is_funded_eligible: questData.is_funded_eligible,
          requires_manual_review: questData.requires_manual_review,
          verification_config: questData.verification_config,
          status: 'draft',
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest-stats'] });
    },
  });
}
