import { supabase } from './supabase';
import type { Product, ProductInput } from '../types/product';
import { storageService } from './storageService';

export const productService = {
  // ... (keep your existing getAllProducts, addProduct, deleteProduct functions) ...

  // ADD THIS NEW FUNCTION:
  async getFeaturedProducts() {
    // Fetches top 5 products that are 'Trending' or 'New Arrival', sorted by newest
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('category', ['Trending', 'New Arrival']) 
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data as Product[];
  },

  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: ProductInput) {
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
        discount: product.discount || 0,
        category: product.category,
        description: product.description || '', // Save description
        image_url: imageUrl
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