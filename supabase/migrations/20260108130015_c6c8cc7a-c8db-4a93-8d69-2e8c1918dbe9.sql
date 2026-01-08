-- Update public_profiles view to include active title
DROP VIEW IF EXISTS public_profiles;

CREATE VIEW public_profiles AS
SELECT 
  p.id,
  p.character_name,
  p.race,
  p.class,
  p.xp,
  p.level,
  p.created_at,
  t.name as active_title
FROM public.profiles p
LEFT JOIN public.titles t ON p.active_title_id = t.id;