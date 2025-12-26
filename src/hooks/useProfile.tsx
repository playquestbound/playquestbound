import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { calculateLevel } from '@/lib/levelSystem';

import type { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  character_name: string | null;
  race: string | null;
  class: string | null;
  customization: Json | null;
  xp: number;
  gold: number;
  level: number;
  has_created_character: boolean;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ characterName, race }: { characterName: string; race: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          character_name: characterName,
          race: race,
          has_created_character: true,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ xpGain, goldGain }: { xpGain: number; goldGain: number }) => {
      if (!user) throw new Error('Not authenticated');

      // First get current stats
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('xp, gold')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const newXp = (profile.xp || 0) + xpGain;
      const newGold = (profile.gold || 0) + goldGain;
      const newLevel = calculateLevel(newXp);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          xp: newXp,
          gold: newGold,
          level: newLevel,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // Use public_profiles view for leaderboard (excludes sensitive data)
      const { data, error } = await supabase
        .from('public_profiles')
        .select('id, character_name, race, xp, level')
        .order('xp', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });
}
