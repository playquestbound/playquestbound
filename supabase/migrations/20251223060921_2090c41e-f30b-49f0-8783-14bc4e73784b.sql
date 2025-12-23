-- Update public_profiles view to include xp for leaderboard functionality
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles 
WITH (security_invoker = on) AS
SELECT 
  id,
  character_name,
  race,
  class,
  level,
  xp,  -- Added for leaderboard
  created_at
FROM public.profiles
WHERE has_created_character = true;

-- Grant access to view
GRANT SELECT ON public.public_profiles TO authenticated;