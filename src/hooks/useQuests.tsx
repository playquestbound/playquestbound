import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Quest {
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
  is_active: boolean;
  created_at: string;
  verification_config: Record<string, unknown> | null;
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

export interface QuestFilters {
  niche: string;
  difficulty: string;
  classFilter: string;
}

// Custom tier order for sorting
const tierOrder: Record<string, number> = {
  grand: 0,
  main: 1,
  side: 2,
};

function sortQuests(quests: Quest[]): Quest[] {
  return [...quests].sort((a, b) => {
    // First sort by tier (grand > main > side)
    const tierA = tierOrder[a.tier || 'side'] ?? 2;
    const tierB = tierOrder[b.tier || 'side'] ?? 2;
    if (tierA !== tierB) return tierA - tierB;
    
    // Then by XP reward descending
    return b.xp_reward - a.xp_reward;
  });
}

export function useAvailableQuests(filters?: QuestFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-quests', user?.id, filters],
    queryFn: async (): Promise<Quest[]> => {
      // Build query - only fetch LIVE quests
      let query = supabase
        .from('quests')
        .select('*')
        .eq('status', 'live')
        .eq('is_active', true);

      // Apply filters
      if (filters?.niche && filters.niche !== 'all') {
        query = query.eq('niche', filters.niche);
      }

      if (filters?.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.classFilter && filters.classFilter !== 'all') {
        query = query.eq('class_affinity', filters.classFilter);
      }

      const { data: quests, error: questsError } = await query;

      if (questsError) throw questsError;

      if (!user) return sortQuests((quests || []) as Quest[]);

      // Get user's quest history to filter out active/completed ones
      const { data: userQuests, error: userQuestsError } = await supabase
        .from('user_quests')
        .select('quest_id, status')
        .eq('user_id', user.id);

      if (userQuestsError) throw userQuestsError;

      // Filter out quests that user has active or completed
      const activeOrCompletedQuestIds = new Set(
        userQuests?.map(uq => uq.quest_id) || []
      );

      const availableQuests = (quests || []).filter(
        q => !activeOrCompletedQuestIds.has(q.id)
      ) as Quest[];

      return sortQuests(availableQuests);
    },
    enabled: true,
  });
}

export function useQuestsGroupedByTier(filters?: QuestFilters, userClass?: string | null) {
  const { data: quests, isLoading, error } = useAvailableQuests(filters);

  const groupedQuests = {
    grand: [] as Quest[],
    main: [] as Quest[],
    side: [] as Quest[],
    forYou: [] as Quest[],
  };

  if (quests) {
    quests.forEach(quest => {
      const tier = quest.tier || 'side';
      if (tier === 'grand') {
        groupedQuests.grand.push(quest);
      } else if (tier === 'main') {
        groupedQuests.main.push(quest);
      } else {
        groupedQuests.side.push(quest);
      }

      // Add to "For You" if matches user's class
      if (userClass && quest.class_affinity === userClass) {
        groupedQuests.forYou.push(quest);
      }
    });
  }

  return { groupedQuests, isLoading, error, allQuests: quests || [] };
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
