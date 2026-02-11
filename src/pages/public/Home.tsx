import { useEffect, useState, useMemo } from 'react';
import ProductCard from '../../components/products/ProductCard';
import FilterSidebar from '../../components/products/FilterSidebar';
import HeroCarousel from '../../components/home/HeroCarousel';
import Loader from '../../components/common/Loader';
import type { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';
import { ShieldCheck, Truck, Star, Phone, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  // Extract unique brands dynamically from products
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  // Advanced Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Filter by Category
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // 2. Filter by Brand
    if (brand !== 'All') {
      result = result.filter(p => p.brand === brand);
    }

    // 3. Filter by Price Range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // 4. Sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
  }, [products, category, brand, priceRange, sortBy]);

  const clearFilters = () => {
    setCategory('All');
    setBrand('All');
    setPriceRange('all');
    setSortBy('newest');
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Hero Section */}
        <HeroCarousel />

        {/* Trust Indicators - Clean Modern Look */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {[
            { icon: ShieldCheck, title: "100% Original", sub: "Official Warranty" },
            { icon: Star, title: "Top Rated", sub: "Best Local Service" },
            { icon: Truck, title: "Fast Delivery", sub: "Same Day Delivery" },
            { icon: Phone, title: "Support", sub: "Call Anytime" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-2 justify-center md:justify-start">
              <div className="p-3 bg-blue-50 rounded-full">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

       <div className="flex flex-col lg:flex-row gap-8 items-start relative"> 
           {/* ^^^ 'items-start' IS THE KEY FIX HERE ^^^ */}
          {/* Sidebar Filters */}
          <FilterSidebar 
            // ... (pass your props here)
            categories={CATEGORIES}
            brands={uniqueBrands}
            selectedCategory={category}
            selectedBrand={brand}
            selectedPriceRange={priceRange}
            onCategoryChange={setCategory}
            onBrandChange={setBrand}
            onPriceChange={setPriceRange}
            onClear={clearFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Main Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <span className="text-gray-500 text-sm hidden sm:block">
                  Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1 mb-6">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}