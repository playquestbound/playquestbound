import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Gender } from '@/lib/races';

export interface RaceModel {
  id: string;
  race_id: string;
  gender: Gender;
  model_url: string;
  created_at: string;
  updated_at: string;
}

export function useRaceModels() {
  return useQuery({
    queryKey: ['race-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('race_models')
        .select('*')
        .order('race_id');
      
      if (error) throw error;
      return data as RaceModel[];
    },
  });
}

export function useRaceModelUrl(raceId: string | null, gender: Gender) {
  const { data: models } = useRaceModels();
  
  if (!raceId || !models) return null;
  
  const model = models.find(m => m.race_id === raceId && m.gender === gender);
  return model?.model_url || null;
}

export function useUploadRaceModel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      raceId, 
      gender, 
      file 
    }: { 
      raceId: string; 
      gender: Gender; 
      file: File;
    }) => {
      // Upload file to storage
      const fileName = `races/${raceId}-${gender}-${Date.now()}.glb`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('models')
        .upload(fileName, file, {
          contentType: 'model/gltf-binary',
          upsert: true,
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('models')
        .getPublicUrl(uploadData.path);
      
      const modelUrl = urlData.publicUrl;
      
      // Upsert race model record
      const { data, error } = await supabase
        .from('race_models')
        .upsert({
          race_id: raceId,
          gender: gender,
          model_url: modelUrl,
        }, {
          onConflict: 'race_id,gender',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['race-models'] });
    },
  });
}

export function useDeleteRaceModel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('race_models')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['race-models'] });
    },
  });
}
