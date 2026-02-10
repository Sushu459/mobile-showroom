export type Category =
  | "Trending"
  | "New"
  | "Second-hand"
  | "Low price";

export interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: Category;
  image_url: string;
  created_at?: string;
}
