import { useEffect, useState } from 'react';
import ProductCard from '../../components/products/ProductCard';
import CategoryFilter from '../../components/products/CategoryFilter';
import type { Product } from '../../types/product';
import { productService } from '../../services/productService';
import Loader from '../../components/common/Loader';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Mobile</h1>
        <p className="text-gray-500">Explore the best deals in your city</p>
      </div>

      <CategoryFilter selectedCategory={filter} onSelect={setFilter} />

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}