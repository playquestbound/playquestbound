import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Title {
  id: string;
  name: string;
  description: string | null;
  quest_id: string | null;
  created_at: string;
}

interface UserTitle {
  id: string;
  title_id: string;
  earned_at: string;
  is_active: boolean;
  title: Title;
}

export function useUserTitles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-titles', user?.id],
    queryFn: async (): Promise<UserTitle[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_titles')
        .select(`
          id,
          title_id,
          earned_at,
          is_active,
          title:titles(id, name, description, quest_id, created_at)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        title: Array.isArray(item.title) ? item.title[0] : item.title
      })) as UserTitle[];
    },
    enabled: !!user,
  });
}

export function useActiveTitle() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-title', user?.id],
    queryFn: async (): Promise<string | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          active_title_id,
          title:titles(name)
        `)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      const titleData = data?.title as { name: string } | null;
      return titleData?.name || null;
    },
    enabled: !!user,
  });
}

export function useSetActiveTitle() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (titleId: string | null) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ active_title_id: titleId })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['active-title'] });
    },
  });
}

export function useAwardTitle() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (titleId: string) => {
      if (!user) throw new Error('Not authenticated');

      // Check if already has this title
      const { data: existing } = await supabase
        .from('user_titles')
        .select('id')
        .eq('user_id', user.id)
        .eq('title_id', titleId)
        .maybeSingle();

      if (existing) {
        return existing;
      }

      const { data, error } = await supabase
        .from('user_titles')
        .insert({
          user_id: user.id,
          title_id: titleId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-titles'] });
    },
  });
}

// Check if user is in Tokyo and award title
export function useCheckTokyoLocation() {
  const { user } = useAuth();
  const awardTitle = useAwardTitle();
  const setActiveTitle = useSetActiveTitle();

  const checkAndAward = async (lat: number, lng: number) => {
    if (!user) return false;

    // Tokyo coordinates check (roughly within 50km radius)
    const tokyoLat = 35.6762;
    const tokyoLng = 139.6503;
    const radiusKm = 50;

    // Haversine formula to calculate distance
    const R = 6371; // Earth's radius in km
    const dLat = (lat - tokyoLat) * Math.PI / 180;
    const dLon = (lng - tokyoLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(tokyoLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    if (distance <= radiusKm) {
      // User is in Tokyo! Get the Kanpai title
      const { data: kanpaiTitle } = await supabase
        .from('titles')
        .select('id')
        .eq('name', 'Kanpai')
        .single();

      if (kanpaiTitle) {
        await awardTitle.mutateAsync(kanpaiTitle.id);
        await setActiveTitle.mutateAsync(kanpaiTitle.id);
        return true;
      }
    }
    return false;
  };

  return { checkAndAward };
}
