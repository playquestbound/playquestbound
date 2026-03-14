import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function useFriends() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      if (error) throw error;

      // Get friend profile IDs
      const friendIds = data.map(f => f.sender_id === user.id ? f.receiver_id : f.sender_id);
      if (friendIds.length === 0) return [];

      const { data: profiles, error: profileError } = await supabase
        .from('public_profiles')
        .select('*')
        .in('id', friendIds);
      if (profileError) throw profileError;

      return profiles?.map(p => ({
        ...p,
        friendshipId: data.find(f => f.sender_id === p.id || f.receiver_id === p.id)?.id,
      })) || [];
    },
    enabled: !!user,
  });
}

export function useFriendRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['friend-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
      if (error) throw error;

      if (!data || data.length === 0) return [];
      const senderIds = data.map(f => f.sender_id);

      const { data: profiles, error: profileError } = await supabase
        .from('public_profiles')
        .select('*')
        .in('id', senderIds);
      if (profileError) throw profileError;

      return data.map(req => ({
        ...req,
        sender: profiles?.find(p => p.id === req.sender_id),
      }));
    },
    enabled: !!user,
  });
}

export function useFriendshipStatus(targetUserId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['friendship-status', user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId || user.id === targetUserId) return null;
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!targetUserId && user.id !== targetUserId,
  });
}

export function useSendFriendRequest() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('friendships')
        .insert({ sender_id: user.id, receiver_id: receiverId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({ title: 'Friend request sent!', description: 'Awaiting their response...' });
    },
    onError: () => {
      toast({ title: 'Failed to send request', description: 'Try again later.', variant: 'destructive' });
    },
  });
}

export function useRespondFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
      if (accept) {
        const { error } = await supabase
          .from('friendships')
          .update({ status: 'accepted', updated_at: new Date().toISOString() })
          .eq('id', requestId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('id', requestId);
        if (error) throw error;
      }
    },
    onSuccess: (_, { accept }) => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      toast({
        title: accept ? 'Friend added!' : 'Request declined',
        description: accept ? 'You are now allies.' : 'The request has been removed.',
      });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      toast({ title: 'Friend removed' });
    },
  });
}
