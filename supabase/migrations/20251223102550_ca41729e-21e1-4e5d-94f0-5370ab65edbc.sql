-- Create race_models table to store 3D model URLs for each race/gender
CREATE TABLE public.race_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  model_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(race_id, gender)
);

-- Enable RLS
ALTER TABLE public.race_models ENABLE ROW LEVEL SECURITY;

-- Anyone can view race models (needed for character creation)
CREATE POLICY "Anyone can view race models"
ON public.race_models
FOR SELECT
USING (true);

-- Only admins can manage race models
CREATE POLICY "Admins can manage race models"
ON public.race_models
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_race_models_updated_at
BEFORE UPDATE ON public.race_models
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();