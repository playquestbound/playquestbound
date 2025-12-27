import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Submission {
  id: string;
  user_id: string;
  quest_id: string;
  status: string;
  video_url: string | null;
  challenge_confirmed: boolean | null;
  completion_lat: number | null;
  completion_lng: number | null;
  submitted_at: string | null;
  fraud_score: number | null;
  fraud_flags: string[] | null;
  manual_review_required: boolean | null;
  auto_approved: boolean | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  xp_awarded: number | null;
  gold_awarded: number | null;
  total_distance: number | null;
  total_duration: number | null;
  avg_speed: number | null;
  elevation_gain: number | null;
  quest: {
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    gold_reward: number;
    tier: string | null;
    difficulty: string;
  } | null;
  profile: {
    id: string;
    character_name: string | null;
    level: number;
    race: string | null;
    class: string | null;
  } | null;
}

export interface SubmissionFilters {
  status: string;
  search: string;
}

export function useAdminSubmissions(filters: SubmissionFilters) {
  return useQuery({
    queryKey: ['admin-submissions', filters],
    queryFn: async (): Promise<Submission[]> => {
      let query = supabase
        .from('quest_completions')
        .select(`
          *,
          quest:quests(id, title, description, xp_reward, gold_reward, tier, difficulty)
        `)
        .order('submitted_at', { ascending: false });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch profiles for each submission
      const userIds = [...new Set((data || []).map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, character_name, level, race, class')
        .in('id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      // Map submissions with profiles
      let results: Submission[] = (data || []).map(s => ({
        ...s,
        profile: profileMap.get(s.user_id) || null,
      }));
      
      // Filter by search if provided
      if (filters.search) {
        const search = filters.search.toLowerCase();
        results = results.filter(s => 
          s.quest?.title?.toLowerCase().includes(search) ||
          s.profile?.character_name?.toLowerCase().includes(search)
        );
      }
      
      return results;
    },
  });
}

export function useSubmissionStats() {
  return useQuery({
    queryKey: ['submission-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quest_completions')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        pending: data?.filter(s => s.status === 'pending').length || 0,
        approved: data?.filter(s => s.status === 'approved').length || 0,
        rejected: data?.filter(s => s.status === 'rejected').length || 0,
      };

      return stats;
    },
  });
}

export function useApproveSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionId, xpAwarded, goldAwarded }: { 
      submissionId: string; 
      xpAwarded: number;
      goldAwarded: number;
    }) => {
      // Get the submission to find user_id
      const { data: submission, error: fetchError } = await supabase
        .from('quest_completions')
        .select('user_id')
        .eq('id', submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Update the submission status
      const { error: updateError } = await supabase
        .from('quest_completions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          xp_awarded: xpAwarded,
          gold_awarded: goldAwarded,
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Award XP and gold to the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, gold')
        .eq('id', submission.user_id)
        .single();

      if (profileError) throw profileError;

      const { error: rewardError } = await supabase
        .from('profiles')
        .update({
          xp: (profile.xp || 0) + xpAwarded,
          gold: (profile.gold || 0) + goldAwarded,
        })
        .eq('id', submission.user_id);

      if (rewardError) throw rewardError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission-stats'] });
    },
  });
}

export function useRejectSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionId, reason }: { 
      submissionId: string; 
      reason: string;
    }) => {
      const { error } = await supabase
        .from('quest_completions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
          xp_awarded: 0,
          gold_awarded: 0,
        })
        .eq('id', submissionId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission-stats'] });
    },
  });
}