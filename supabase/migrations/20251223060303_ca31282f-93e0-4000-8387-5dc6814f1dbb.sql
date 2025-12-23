-- Fix 1: Make videos bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'videos';

-- Fix 2: Drop overly permissive storage policy and create proper ones
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;

-- Users can view their own videos
CREATE POLICY "Users can view own videos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can view all videos (for review)
CREATE POLICY "Admins can view all videos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'videos' AND 
    public.has_role(auth.uid(), 'admin')
  );

-- Fix 3: Create public_profiles view with limited data for social features
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  character_name,
  race,
  class,
  level,
  created_at
FROM public.profiles
WHERE has_created_character = true;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;

-- Fix 4: Update profiles RLS - replace overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Users can view their own full profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix 5: Create rate limiting table and function for quest completions
CREATE TABLE IF NOT EXISTS public.user_rate_limits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_completion_at TIMESTAMPTZ,
  completions_last_hour INTEGER DEFAULT 0,
  completions_last_day INTEGER DEFAULT 0,
  last_upload_at TIMESTAMPTZ,
  uploads_last_hour INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own rate limits
CREATE POLICY "Users can view own rate limits" ON public.user_rate_limits
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own rate limits
CREATE POLICY "Users can insert own rate limits" ON public.user_rate_limits
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own rate limits
CREATE POLICY "Users can update own rate limits" ON public.user_rate_limits
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Function to check completion rate limit
CREATE OR REPLACE FUNCTION public.check_completion_rate_limit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count_hour INTEGER;
  v_count_day INTEGER;
  v_last_completion TIMESTAMPTZ;
BEGIN
  -- Get current counts and last completion time
  SELECT 
    COALESCE(completions_last_hour, 0),
    COALESCE(completions_last_day, 0),
    last_completion_at
  INTO v_count_hour, v_count_day, v_last_completion
  FROM user_rate_limits
  WHERE user_id = _user_id;
  
  -- If no record exists, create one and allow
  IF NOT FOUND THEN
    INSERT INTO user_rate_limits (user_id, last_completion_at, completions_last_hour, completions_last_day)
    VALUES (_user_id, NOW(), 1, 1);
    RETURN TRUE;
  END IF;
  
  -- Reset hourly counter if > 1 hour since last completion
  IF v_last_completion IS NULL OR v_last_completion < NOW() - INTERVAL '1 hour' THEN
    v_count_hour := 0;
  END IF;
  
  -- Reset daily counter if > 1 day since last completion
  IF v_last_completion IS NULL OR v_last_completion < NOW() - INTERVAL '1 day' THEN
    v_count_day := 0;
  END IF;
  
  -- Check limits: 10 per hour, 50 per day
  IF v_count_hour >= 10 OR v_count_day >= 50 THEN
    RETURN FALSE;
  END IF;
  
  -- Update counters
  UPDATE user_rate_limits 
  SET 
    last_completion_at = NOW(),
    completions_last_hour = v_count_hour + 1,
    completions_last_day = v_count_day + 1
  WHERE user_id = _user_id;
  
  RETURN TRUE;
END;
$$;

-- Update quest_completions RLS to include rate limiting
DROP POLICY IF EXISTS "Users can insert own completions" ON public.quest_completions;

CREATE POLICY "Users can insert own completions with rate limit" ON public.quest_completions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND 
    public.check_completion_rate_limit(auth.uid())
  );