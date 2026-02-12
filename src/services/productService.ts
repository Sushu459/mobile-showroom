import { supabase } from './supabase';
import type { Product, ProductInput } from '../types/product';
import { storageService } from './storageService';

export const productService = {
  
  // 1. FOR ADMIN: Get ALL products (Active & Out of Stock) for specific Tenant
  async getAllProducts(tenantId: string) {
    if (!tenantId) throw new Error("Tenant ID is required");

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId) // Filter by Tenant
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  // 2. FOR PUBLIC HOME PAGE: Get ONLY In-Stock products for specific Tenant
  async getAvailableProducts(tenantId: string) {
    if (!tenantId) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId) // Filter by Tenant
      .eq('in_stock', true)      // Filter out hidden items
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  },

  // Fetches top 5 active products for the slider/featured section
  async getFeaturedProducts(tenantId: string) {
    if (!tenantId) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId) // Filter by Tenant
      .eq('in_stock', true)      // Only show active featured items
      .in('category', ['Trending', 'New Arrival']) 
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data as Product[];
  },

  // UPDATED: Handles multiple images upload AND Tenant ID
  async addProduct(product: ProductInput & { in_stock?: boolean }, tenantId: string) {
    if (!tenantId) throw new Error("Cannot add product: Tenant ID missing");

    let uploadedUrls: string[] = [];

    // 1. Check if 'images' array exists and has files (Support for multiple)
    if (product.images && product.images.length > 0) {
       const uploadPromises = product.images.map(file => storageService.uploadImage(file));
       uploadedUrls = await Promise.all(uploadPromises);
    } 
    // 2. Fallback for legacy single image support
    else if (product.image) {
       const url = await storageService.uploadImage(product.image);
       uploadedUrls = [url];
    }
    
    // 3. Fallback default
    if (uploadedUrls.length === 0) {
       uploadedUrls = ['https://placehold.co/400x300?text=No+Image'];
    }

    // Prepare the insert object
    const insertData = {
        name: product.name,
        brand: product.brand,
        price: product.price,
        discount: product.discount || 0,
        category: product.category,
        description: product.description || '',
        image_urls: uploadedUrls, // Save as Array
        // REMOVED: image_url field (caused error because column was deleted)
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        tenant_id: tenantId // <--- CRITICAL: Save which shop owns this
    };

    const { data, error } = await supabase
      .from('products')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // UPDATED: Handles multiple images update
  async updateProduct(
    id: string,
    product: ProductInput & { in_stock?: boolean },
  ) {
    // Start with existing images (from the edit form state)
    let finalImageUrls = product.existingImages || [];

    // 1. Upload ALL NEW images
    if (product.images && product.images.length > 0) {
      const uploadPromises = product.images.map(file => storageService.uploadImage(file));
      const newUrls = await Promise.all(uploadPromises);
      // Append new URLs to the existing ones
      finalImageUrls = [...finalImageUrls, ...newUrls];
    }
    // 2. Fallback for legacy single image update
    else if (product.image) {
       const url = await storageService.uploadImage(product.image);
       finalImageUrls = [url];
    }

    // 3. Ensure we don't save an empty array
    if (finalImageUrls.length === 0) {
      finalImageUrls = ['https://placehold.co/400x300?text=No+Image'];
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        brand: product.brand,
        price: product.price,
        discount: product.discount || 0,
        category: product.category,
        description: product.description || '',
        image_urls: finalImageUrls, // Update the array
        // REMOVED: image_url field (caused error because column was deleted)
        in_stock: product.in_stock
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  // DELETE: Extra safety to ensure we only delete our own products
  async deleteProduct(id: string, tenantId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId); // <--- Safety check
      
    if (error) throw error;
  }
};