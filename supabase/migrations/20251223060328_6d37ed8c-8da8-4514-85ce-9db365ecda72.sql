-- Fix the view to use SECURITY INVOKER instead of SECURITY DEFINER (default)
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate view with explicit SECURITY INVOKER 
CREATE VIEW public.public_profiles 
WITH (security_invoker = on) AS
SELECT 
  id,
  character_name,
  race,
  class,
  level,
  created_at
FROM public.profiles
WHERE has_created_character = true;

-- Grant access to view
GRANT SELECT ON public.public_profiles TO authenticated;