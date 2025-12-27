-- Add full_name and birthday columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN full_name text,
ADD COLUMN birthday date;

-- Update the handle_new_user function to capture metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, birthday)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    (NEW.raw_user_meta_data ->> 'birthday')::date
  );
  RETURN NEW;
END;
$$;