import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const GUILD_CREATION_COST = 100;

export function useMyGuild() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-guild', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Check if user owns a guild
      const { data: ownedGuild } = await supabase
        .from('guilds')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (ownedGuild) return { ...ownedGuild, isOwner: true };

      // Check if user is a member of a guild
      const { data: membership } = await supabase
        .from('guild_members')
        .select('guild_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (membership) {
        const { data: guild } = await supabase
          .from('guilds')
          .select('*')
          .eq('id', membership.guild_id)
          .single();
        return guild ? { ...guild, isOwner: false } : null;
      }

      return null;
    },
    enabled: !!user,
  });
}

export function useGuildMembers(guildId: string | undefined) {
  return useQuery({
    queryKey: ['guild-members', guildId],
    queryFn: async () => {
      if (!guildId) return [];
      const { data, error } = await supabase
        .from('guild_members')
        .select('*')
        .eq('guild_id', guildId);
      if (error) throw error;

      if (!data || data.length === 0) return [];
      const userIds = data.map(m => m.user_id);

      const { data: profiles } = await supabase
        .from('public_profiles')
        .select('*')
        .in('id', userIds);

      return data.map(member => ({
        ...member,
        profile: profiles?.find(p => p.id === member.user_id),
      }));
    },
    enabled: !!guildId,
  });
}

export function useCreateGuild() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user) throw new Error('Not authenticated');

      // Check gold balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('gold')
        .eq('id', user.id)
        .single();

      if (!profile || profile.gold < GUILD_CREATION_COST) {
        throw new Error(`You need ${GUILD_CREATION_COST} gold to create a guild`);
      }

      // Deduct gold
      const { error: goldError } = await supabase
        .from('profiles')
        .update({ gold: profile.gold - GUILD_CREATION_COST })
        .eq('id', user.id);
      if (goldError) throw goldError;

      // Create guild
      const { data: guild, error } = await supabase
        .from('guilds')
        .insert({ name, description, owner_id: user.id, gold_cost: GUILD_CREATION_COST })
        .select()
        .single();
      if (error) throw error;

      // Add owner as leader member
      await supabase
        .from('guild_members')
        .insert({ guild_id: guild.id, user_id: user.id, role: 'leader' });

      return guild;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-guild'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Guild created!', description: 'Gather your allies!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create guild', description: error.message, variant: 'destructive' });
    },
  });
}

export function useGuildInvites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['guild-invites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('guild_invites')
        .select('*')
        .eq('invitee_id', user.id)
        .eq('status', 'pending');
      if (error) throw error;

      if (!data || data.length === 0) return [];
      const guildIds = data.map(i => i.guild_id);

      const { data: guilds } = await supabase
        .from('guilds')
        .select('*')
        .in('id', guildIds);

      return data.map(invite => ({
        ...invite,
        guild: guilds?.find(g => g.id === invite.guild_id),
      }));
    },
    enabled: !!user,
  });
}

export function useSendGuildInvite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guildId, inviteeId }: { guildId: string; inviteeId: string }) => {
      if (!user) throw new Error('Not authenticated');

      // Check member count
      const { data: members } = await supabase
        .from('guild_members')
        .select('id')
        .eq('guild_id', guildId);

      const { data: guild } = await supabase
        .from('guilds')
        .select('max_members')
        .eq('id', guildId)
        .single();

      if (members && guild && members.length >= guild.max_members) {
        throw new Error('Guild is full!');
      }

      const { error } = await supabase
        .from('guild_invites')
        .insert({ guild_id: guildId, inviter_id: user.id, invitee_id: inviteeId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guild-invites'] });
      toast({ title: 'Guild invite sent!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to send invite', description: error.message, variant: 'destructive' });
    },
  });
}

export function useRespondGuildInvite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inviteId, guildId, accept }: { inviteId: string; guildId: string; accept: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      if (accept) {
        // Add to guild
        const { error: memberError } = await supabase
          .from('guild_members')
          .insert({ guild_id: guildId, user_id: user.id, role: 'member' });
        if (memberError) throw memberError;

        // Update invite status
        const { error } = await supabase
          .from('guild_invites')
          .update({ status: 'accepted' })
          .eq('id', inviteId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guild_invites')
          .update({ status: 'declined' })
          .eq('id', inviteId);
        if (error) throw error;
      }
    },
    onSuccess: (_, { accept }) => {
      queryClient.invalidateQueries({ queryKey: ['guild-invites'] });
      queryClient.invalidateQueries({ queryKey: ['my-guild'] });
      queryClient.invalidateQueries({ queryKey: ['guild-members'] });
      toast({
        title: accept ? 'Joined the guild!' : 'Invite declined',
        description: accept ? 'Welcome to the guild, adventurer!' : undefined,
      });
    },
  });
}

export function useLeaveGuild() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guildId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('guild_members')
        .delete()
        .eq('guild_id', guildId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-guild'] });
      queryClient.invalidateQueries({ queryKey: ['guild-members'] });
      toast({ title: 'Left the guild' });
    },
  });
}

export function useRemoveGuildMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guildId, userId }: { guildId: string; userId: string }) => {
      const { error } = await supabase
        .from('guild_members')
        .delete()
        .eq('guild_id', guildId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guild-members'] });
      toast({ title: 'Member removed from guild' });
    },
  });
}
