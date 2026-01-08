-- Create titles table
CREATE TABLE public.titles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  quest_id UUID REFERENCES public.quests(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_titles junction table
CREATE TABLE public.user_titles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, title_id)
);

-- Add active_title_id to profiles
ALTER TABLE public.profiles ADD COLUMN active_title_id UUID REFERENCES public.titles(id);

-- Enable RLS
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_titles ENABLE ROW LEVEL SECURITY;

-- RLS policies for titles (public read)
CREATE POLICY "Anyone can view titles" ON public.titles FOR SELECT USING (true);

-- RLS policies for user_titles
CREATE POLICY "Users can view own titles" ON public.user_titles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own titles" ON public.user_titles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own titles" ON public.user_titles FOR UPDATE USING (auth.uid() = user_id);

-- Insert the Tokyo quest
INSERT INTO public.quests (title, description, quest_type, quest_category, difficulty, xp_reward, gold_reward, tier, status, is_active, verification_config, niche)
VALUES (
  'Visit Tokyo',
  'Travel to the land of the rising sun and experience the magic of Tokyo. Your presence in the city will be verified by GPS.',
  'Adventure',
  'grand',
  'Legendary',
  500,
  100,
  'grand',
  'live',
  true,
  '{"requires_gps": true, "location": {"lat": 35.6762, "lng": 139.6503, "radius_km": 50, "name": "Tokyo"}}',
  'travel'
);

-- Insert the Kanpai title linked to the quest
INSERT INTO public.titles (name, description, quest_id)
SELECT 'Kanpai', 'Awarded to adventurers who have visited Tokyo', id
FROM public.quests WHERE title = 'Visit Tokyo';