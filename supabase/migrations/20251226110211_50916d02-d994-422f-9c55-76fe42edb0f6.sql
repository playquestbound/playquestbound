-- Add subscription_tier column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free';

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.subscription_tier IS 'User subscription tier: free, adventurer, or legend';