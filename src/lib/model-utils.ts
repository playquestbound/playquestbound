import { supabase } from '@/integrations/supabase/client';

/**
 * Get the public URL for a 3D model from Supabase storage
 */
export function getModelUrl(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('models')
    .getPublicUrl(path);
  
  return data?.publicUrl || '';
}

/**
 * Upload a 3D model to Supabase storage
 */
export async function uploadModel(
  file: File, 
  folder: string = 'items'
): Promise<{ path: string; url: string } | null> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  // Validate file extension
  if (!fileExt || !['glb', 'gltf'].includes(fileExt)) {
    throw new Error('Invalid file type. Please upload a GLB or GLTF file.');
  }
  
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('models')
    .upload(fileName, file, {
      contentType: fileExt === 'glb' ? 'model/gltf-binary' : 'model/gltf+json',
      upsert: false
    });
  
  if (error) {
    throw error;
  }
  
  const url = getModelUrl(data.path);
  
  return {
    path: data.path,
    url
  };
}

/**
 * Delete a 3D model from Supabase storage
 */
export async function deleteModel(path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from('models')
    .remove([path]);
  
  if (error) {
    throw error;
  }
  
  return true;
}

/**
 * Get equipment slots from user_equipment with model URLs
 */
export interface EquipmentSlots {
  head?: string;
  body?: string;
  weapon?: string;
  accessory?: string;
}

export async function getUserEquipmentModels(userId: string): Promise<EquipmentSlots> {
  const { data, error } = await supabase
    .from('user_equipment')
    .select(`
      equipped,
      items (
        slot,
        model_url
      )
    `)
    .eq('user_id', userId)
    .eq('equipped', true);
  
  if (error || !data) {
    return {};
  }
  
  const slots: EquipmentSlots = {};
  
  data.forEach((equipment: any) => {
    const item = equipment.items;
    if (item?.model_url && item?.slot) {
      const slotKey = item.slot.toLowerCase() as keyof EquipmentSlots;
      if (slotKey in slots || ['head', 'body', 'weapon', 'accessory'].includes(slotKey)) {
        slots[slotKey] = getModelUrl(item.model_url);
      }
    }
  });
  
  return slots;
}
