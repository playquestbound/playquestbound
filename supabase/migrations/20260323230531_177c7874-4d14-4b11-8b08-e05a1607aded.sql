ALTER TABLE public.quests
  ADD COLUMN min_level integer DEFAULT NULL,
  ADD COLUMN visibility_lat double precision DEFAULT NULL,
  ADD COLUMN visibility_lng double precision DEFAULT NULL,
  ADD COLUMN visibility_radius_km double precision DEFAULT NULL;