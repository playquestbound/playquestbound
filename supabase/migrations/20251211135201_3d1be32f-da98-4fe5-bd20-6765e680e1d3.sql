-- Allow users to delete (abandon) their own quests
CREATE POLICY "Users can delete own quests" 
ON public.user_quests 
FOR DELETE 
USING (auth.uid() = user_id);