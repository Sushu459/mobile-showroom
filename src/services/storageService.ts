import { supabase } from './supabase';

export const storageService = {
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`; // Removed 'products/' prefix since we are already in the bucket

    // UPDATED: Changed bucket name from 'product-images' to 'products'
    const { error: uploadError } = await supabase.storage
      .from('products') 
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // UPDATED: Changed bucket name here as well
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};