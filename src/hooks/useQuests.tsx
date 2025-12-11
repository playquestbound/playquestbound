import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Quest {
  id: string;
  title: string;
  description: string;
  quest_type: string;
  quest_category: string;
  xp_reward: number;
  gold_reward: number;
  difficulty: string;
  is_active: boolean;
  created_at: string;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  status: string;
  video_url: string | null;
  completed_at: string | null;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
  quest?: Quest;
}

export function useAvailableQuests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-quests', user?.id],
    queryFn: async (): Promise<Quest[]> => {
      // Get all active quests
      const { data: quests, error: questsError } = await supabase
        .from('quests')
        .select('*')
        .eq('is_active', true);

      if (questsError) throw questsError;

      if (!user) return quests || [];

      // Get user's quest history to filter out completed ones
      const { data: userQuests, error: userQuestsError } = await supabase
        .from('user_quests')
        .select('quest_id, status')
        .eq('user_id', user.id);

      if (userQuestsError) throw userQuestsError;

      // Filter out quests that user has active or completed
      const activeOrCompletedQuestIds = new Set(
        userQuests?.map(uq => uq.quest_id) || []
      );

      return (quests || []).filter(q => !activeOrCompletedQuestIds.has(q.id));
    },
    enabled: true,
  });
}

export function useActiveQuests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-quests', user?.id],
    queryFn: async (): Promise<UserQuest[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_quests')
        .select(`
          *,
          quest:quests(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        quest: item.quest as Quest,
      }));
    },
    enabled: !!user,
  });
}

export function useCompletedQuests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['completed-quests', user?.id],
    queryFn: async (): Promise<UserQuest[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_quests')
        .select(`
          *,
          quest:quests(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        quest: item.quest as Quest,
      }));
    },
    enabled: !!user,
  });
}

export function useAcceptQuest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (questId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_quests')
        .insert({
          user_id: user.id,
          quest_id: questId,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-quests'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
    },
  });
}

export function useAbandonQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userQuestId: string) => {
      const { error } = await supabase
        .from('user_quests')
        .delete()
        .eq('id', userQuestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-quests'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
    },
  });
}

export function useCompleteQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userQuestId, 
      videoUrl, 
      locationLat, 
      locationLng 
    }: { 
      userQuestId: string; 
      videoUrl: string; 
      locationLat: number; 
      locationLng: number;
    }) => {
      const { data, error } = await supabase
        .from('user_quests')
        .update({
          status: 'completed',
          video_url: videoUrl,
          location_lat: locationLat,
          location_lng: locationLng,
          completed_at: new Date().toISOString(),
        })
        .eq('id', userQuestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-quests'] });
      queryClient.invalidateQueries({ queryKey: ['completed-quests'] });
      queryClient.invalidateQueries({ queryKey: ['available-quests'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
