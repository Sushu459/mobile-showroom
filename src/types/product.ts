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
}

export interface ProductInput {
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  image?: File;
}