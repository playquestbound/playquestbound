-- Add quest_category column to quests table
ALTER TABLE public.quests 
ADD COLUMN quest_category text NOT NULL DEFAULT 'side';

-- Add a comment to document the valid values
COMMENT ON COLUMN public.quests.quest_category IS 'Quest category: side, main, or grand';