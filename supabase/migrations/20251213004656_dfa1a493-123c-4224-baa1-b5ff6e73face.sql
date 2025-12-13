-- Add challenge_confirmed column to quest_completions for MVP verification
ALTER TABLE public.quest_completions 
ADD COLUMN IF NOT EXISTS challenge_confirmed boolean DEFAULT false;