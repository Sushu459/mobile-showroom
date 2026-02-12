import { useEffect, useState, useMemo } from 'react';
import ProductCard from '../../components/products/ProductCard';
import FilterSidebar from '../../components/products/FilterSidebar';
import HeroCarousel from '../../components/home/HeroCarousel';
import Loader from '../../components/common/Loader';
import type { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';
import { ShieldCheck, Truck, Star, Phone, SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';
import { useTenant } from '../../context/TenantContext'; // <--- CRITICAL IMPORT

export default function Home() {
  const { tenant, loading: tenantLoading } = useTenant(); // <--- Get Current Shop
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState(''); // Search State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (tenant) {
      const load = async () => {
        try {
          // Fetch ONLY this tenant's available products
          const data = await productService.getAvailableProducts(tenant.tenant_id);
          setProducts(data);
        } catch (error) {
          console.error("Failed to load products", error);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [tenant]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search by name (Case insensitive)
    if (searchTerm.trim() !== '') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Category
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // 3. Brand
    if (brand !== 'All') {
      result = result.filter(p => p.brand === brand);
    }

    // 4. Price Range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // 5. Sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
  }, [products, category, brand, priceRange, sortBy, searchTerm]);

  const clearFilters = () => {
    setCategory('All');
    setBrand('All');
    setPriceRange('all');
    setSortBy('newest');
    setSearchTerm('');
  };

  if (tenantLoading || loading) return <Loader />;
  if (!tenant) return <div className="text-center p-20 text-gray-500">Store Not Found</div>;

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-slate-300 via-pink-100 to-orange-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Dynamic Carousel */}
        <HeroCarousel/>

        {/* Dynamic Shop Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
            <p className="text-gray-500">Official Online Store</p>
        </div>
        
        {/* Trust Badges */}
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

          <FilterSidebar
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

          <div className="flex-1 w-full">

            {/* 🔥 TOOLBAR WITH SEARCH */}
            <div className="sticky top-17.5 z-30 backdrop-blur-md py-2 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">

                {/* Left Section: Filter Button & Search */}
                <div className="flex items-center gap-3 flex-1 w-full">
                    
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="lg:hidden shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    {/* 🔍 SEARCH BAR */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Right Section: Sort & Count */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap hidden md:block">
                        <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                    </span>

                    <div className="relative min-w-35">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                   <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1 mb-6 text-center">We couldn't find what you're looking for.<br/>Try adjusting your search or filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
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