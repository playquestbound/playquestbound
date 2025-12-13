-- Create app_role enum for admin system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add new columns to quests table
ALTER TABLE public.quests 
ADD COLUMN niche text,
ADD COLUMN tier text DEFAULT 'side',
ADD COLUMN status text DEFAULT 'draft',
ADD COLUMN is_funded_eligible boolean DEFAULT false,
ADD COLUMN requires_manual_review boolean DEFAULT false,
ADD COLUMN location_type text[],
ADD COLUMN verification_config jsonb,
ADD COLUMN published_at timestamp with time zone,
ADD COLUMN scheduled_for timestamp with time zone,
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Migrate existing data: is_active = true becomes status = 'live'
UPDATE public.quests SET status = 'live' WHERE is_active = true;
UPDATE public.quests SET status = 'draft' WHERE is_active = false;

-- Migrate quest_type to niche
UPDATE public.quests SET niche = quest_type;

-- Migrate quest_category to tier
UPDATE public.quests SET tier = quest_category;

-- Create quest_completions table
CREATE TABLE public.quest_completions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quest_id uuid REFERENCES public.quests(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'pending',
    video_url text,
    journey_data jsonb,
    total_distance integer,
    total_duration integer,
    elevation_gain integer,
    avg_speed float,
    fraud_flags text[],
    fraud_score integer DEFAULT 0,
    auto_approved boolean DEFAULT false,
    manual_review_required boolean DEFAULT false,
    reviewed_by text,
    reviewed_at timestamp with time zone,
    rejection_reason text,
    xp_awarded integer,
    gold_awarded integer,
    completion_lat double precision,
    completion_lng double precision,
    submitted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on quest_completions
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;

-- RLS policies for quest_completions
CREATE POLICY "Users can view own completions" ON public.quest_completions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.quest_completions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending completions" ON public.quest_completions
FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all completions" ON public.quest_completions
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update quests RLS: users only see live quests, admins see all
DROP POLICY IF EXISTS "Anyone can view active quests" ON public.quests;

CREATE POLICY "Users can view live quests" ON public.quests
FOR SELECT USING (status = 'live' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all quests" ON public.quests
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on quests
CREATE TRIGGER update_quests_updated_at
BEFORE UPDATE ON public.quests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();