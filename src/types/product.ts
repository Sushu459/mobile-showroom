export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  image_url: string;
  created_at: string;
  in_stock: boolean;
  image_urls: string[];

}

export interface ProductInput {
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  images?: File[];
  image?: File;
  in_stock: boolean;
  existingImages?: string[];
}