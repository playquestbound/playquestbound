-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS class text,
ADD COLUMN IF NOT EXISTS customization jsonb;

-- Add class_affinity column to quests table
ALTER TABLE public.quests 
ADD COLUMN IF NOT EXISTS class_affinity text;

-- Create items table
CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  slot text NOT NULL,
  rarity text NOT NULL DEFAULT 'common',
  class_restriction text,
  race_restriction text,
  image_url text,
  is_purchasable boolean NOT NULL DEFAULT false,
  gold_price integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Items are viewable by everyone
CREATE POLICY "Anyone can view items" 
ON public.items 
FOR SELECT 
USING (true);

-- Create user_equipment table
CREATE TABLE public.user_equipment (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  equipped boolean NOT NULL DEFAULT false,
  obtained_via text NOT NULL DEFAULT 'starter',
  obtained_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_equipment
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;

-- Users can view their own equipment
CREATE POLICY "Users can view own equipment" 
ON public.user_equipment 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own equipment
CREATE POLICY "Users can insert own equipment" 
ON public.user_equipment 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own equipment (for equipping/unequipping)
CREATE POLICY "Users can update own equipment" 
ON public.user_equipment 
FOR UPDATE 
USING (auth.uid() = user_id);