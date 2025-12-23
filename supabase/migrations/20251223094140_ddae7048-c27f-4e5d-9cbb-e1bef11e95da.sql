-- Add model_url column to items table for 3D asset paths
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS model_url text;

-- Add comment for clarity
COMMENT ON COLUMN public.items.model_url IS 'URL/path to the 3D GLTF/GLB model file';

-- Create storage bucket for 3D models
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'models', 
  'models', 
  true,  -- Public so models can be loaded by Three.js
  52428800,  -- 50MB limit for 3D models
  ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for models bucket
CREATE POLICY "Anyone can view models"
ON storage.objects FOR SELECT
USING (bucket_id = 'models');

CREATE POLICY "Admins can upload models"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'models' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update models"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'models' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete models"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'models' 
  AND has_role(auth.uid(), 'admin')
);