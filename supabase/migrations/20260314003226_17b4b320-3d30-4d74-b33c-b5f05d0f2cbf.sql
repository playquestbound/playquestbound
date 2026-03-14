
-- Friendships table
CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Users can view friendships they're part of
CREATE POLICY "Users can view own friendships" ON public.friendships
  FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send friend requests
CREATE POLICY "Users can send friend requests" ON public.friendships
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id AND sender_id != receiver_id);

-- Receiver can update (accept/decline)
CREATE POLICY "Users can respond to friend requests" ON public.friendships
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

-- Either party can delete (unfriend)
CREATE POLICY "Users can unfriend" ON public.friendships
  FOR DELETE TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Guilds table
CREATE TABLE public.guilds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  max_members integer NOT NULL DEFAULT 10,
  gold_cost integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view guilds
CREATE POLICY "Authenticated can view guilds" ON public.guilds
  FOR SELECT TO authenticated
  USING (true);

-- Users can create guilds
CREATE POLICY "Users can create guilds" ON public.guilds
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Only owner can update
CREATE POLICY "Owner can update guild" ON public.guilds
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id);

-- Only owner can delete
CREATE POLICY "Owner can delete guild" ON public.guilds
  FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

-- Guild members table
CREATE TABLE public.guild_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(guild_id, user_id)
);

ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;

-- Members can view their guild members
CREATE POLICY "Members can view guild members" ON public.guild_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_members gm WHERE gm.guild_id = guild_members.guild_id AND gm.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.guilds g WHERE g.id = guild_members.guild_id AND g.owner_id = auth.uid()
    )
  );

-- Guild owner can add members
CREATE POLICY "Owner can add guild members" ON public.guild_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guilds g WHERE g.id = guild_id AND g.owner_id = auth.uid()
    )
  );

-- Owner can remove members
CREATE POLICY "Owner can remove guild members" ON public.guild_members
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.guilds g WHERE g.id = guild_id AND g.owner_id = auth.uid()
    )
  );

-- Guild invites table
CREATE TABLE public.guild_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(guild_id, invitee_id)
);

ALTER TABLE public.guild_invites ENABLE ROW LEVEL SECURITY;

-- Users can view invites they sent or received
CREATE POLICY "Users can view own guild invites" ON public.guild_invites
  FOR SELECT TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- Guild owner can send invites
CREATE POLICY "Guild owner can send invites" ON public.guild_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = inviter_id
    AND EXISTS (
      SELECT 1 FROM public.guilds g WHERE g.id = guild_id AND g.owner_id = auth.uid()
    )
  );

-- Invitee can update (accept/decline)
CREATE POLICY "Invitee can respond to guild invite" ON public.guild_invites
  FOR UPDATE TO authenticated
  USING (auth.uid() = invitee_id);

-- Either party can delete
CREATE POLICY "Users can delete guild invites" ON public.guild_invites
  FOR DELETE TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);
