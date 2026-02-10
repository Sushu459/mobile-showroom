import { supabase } from './supabase';
import type { Product, ProductInput } from '../types/product';
import { storageService } from './storageService';

export const productService = {
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: ProductInput) {
    // Default placeholder if no image is uploaded
    let imageUrl = 'https://placehold.co/400x300?text=No+Image'; 
    
    if (product.image) {
      imageUrl = await storageService.uploadImage(product.image);
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        brand: product.brand,
        price: product.price,
        discount: product.discount || 0, // Ensure default 0 if undefined
        category: product.category,
        image_url: imageUrl // This must strictly be a string, never null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }
};