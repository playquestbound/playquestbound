import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useState, useEffect } from 'react';

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
  min_level: number | null;
  visibility_lat: number | null;
  visibility_lng: number | null;
  visibility_radius_km: number | null;
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

// Haversine distance in km
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useAvailableQuests(filters?: QuestFilters) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // silently fail
    );
  }, []);

  return useQuery({
    queryKey: ['available-quests', user?.id, filters, profile?.level, userLocation?.lat, userLocation?.lng],
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

      // Apply level and geo visibility gates client-side
      const userLevel = profile?.level ?? 1;
      let filteredQuests = (quests || []) as Quest[];

      filteredQuests = filteredQuests.filter(q => {
        // Level gate
        if (q.min_level && userLevel < q.min_level) return false;

        // Geo gate
        if (q.visibility_lat != null && q.visibility_lng != null && q.visibility_radius_km != null) {
          if (!userLocation) return false; // hide geo-gated quests if location unknown
          const dist = getDistanceKm(userLocation.lat, userLocation.lng, q.visibility_lat, q.visibility_lng);
          if (dist > q.visibility_radius_km) return false;
        }

        return true;
      });

      if (!user) return sortQuests(filteredQuests);

      // Get user's quest history to filter out active/completed ones
      const { data: userQuests, error: userQuestsError } = await supabase
        .from('user_quests')
        .select('quest_id, status')
        .eq('user_id', user.id);

      if (userQuestsError) throw userQuestsError;

      const activeOrCompletedQuestIds = new Set(
        userQuests?.map(uq => uq.quest_id) || []
      );

      const availableQuests = filteredQuests.filter(
        q => !activeOrCompletedQuestIds.has(q.id)
      );

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

// Quest limits by subscription tier
const QUEST_LIMITS: Record<string, number> = {
  free: 1,
  adventurer: 5,
  legend: Infinity,
};

export function useQuestLimit() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['quest-limit', user?.id],
    queryFn: async () => {
      if (!user) return { limit: 1, activeCount: 0, tier: 'free' };

      // Get user's subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const tier = profile?.subscription_tier || 'free';
      const limit = QUEST_LIMITS[tier] || 1;

      // Get count of active quests
      const { count, error: countError } = await supabase
        .from('user_quests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (countError) throw countError;

      return { limit, activeCount: count || 0, tier };
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

      // Check quest limit before accepting
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      const tier = profile?.subscription_tier || 'free';
      const limit = QUEST_LIMITS[tier] || 1;

      // Get current active quest count
      const { count } = await supabase
        .from('user_quests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if ((count || 0) >= limit) {
        throw new Error(`Quest limit reached. ${tier === 'free' ? 'Upgrade to accept more quests!' : 'You have reached your quest limit.'}`);
      }

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
      queryClient.invalidateQueries({ queryKey: ['quest-limit'] });
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
      queryClient.invalidateQueries({ queryKey: ['quest-limit'] });
    },
  });
}
