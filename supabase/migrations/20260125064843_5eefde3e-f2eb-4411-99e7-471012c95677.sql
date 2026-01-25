-- Create waitlist_emails table
CREATE TABLE public.waitlist_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist_emails
FOR INSERT
WITH CHECK (true);

-- Only admins can view waitlist
CREATE POLICY "Admins can view waitlist"
ON public.waitlist_emails
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));