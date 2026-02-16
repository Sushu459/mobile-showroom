import { useEffect, useState, useMemo } from 'react';
import ProductCard from '../../components/products/ProductCard';
import FilterSidebar from '../../components/products/FilterSidebar';
import HeroCarousel from '../../components/home/HeroCarousel';
import Loader from '../../components/common/Loader';
import type { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';
import { ShieldCheck, Truck, Star, Phone, SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';
import { useTenant } from '../../context/TenantContext'; 
import "./Home.css"; // Import the CSS file

export default function Home() {
  const { tenant, loading: tenantLoading } = useTenant(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const primaryColor = tenant?.primary_color || "#7C3AED"; 

  useEffect(() => {
    if (tenant) {
      const load = async () => {
        try {
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

  useEffect(() => {
    if (!tenant?.name) return;

    const fullText = tenant.name;
    let index = 0;
    let isDeleting = false;
    let typingSpeed = 120;
    let timeout: ReturnType<typeof setTimeout>;

    const typeEffect = () => {
      setDisplayedName(fullText.slice(0, index));

      if (!isDeleting) {
        index++;
        typingSpeed = 120; 

        if (index > fullText.length) {
          isDeleting = true;
          typingSpeed = 1200; 
        }
      } else {
        index--;
        typingSpeed = 60; 

        if (index === 0) {
          isDeleting = false;
          typingSpeed = 500; 
        }
      }

      timeout = setTimeout(typeEffect, typingSpeed);
    };

    timeout = setTimeout(typeEffect, typingSpeed);

    return () => clearTimeout(timeout);
  }, [tenant?.name]);

  const uniqueBrands = useMemo(() => {
    const brandMap = new Map<string, string>();
    products.forEach((product) => {
      const rawBrand = String(product.brand ?? "").trim();
      if (!rawBrand) return;
      const key = rawBrand.toLowerCase();
      if (!brandMap.has(key)) {
        brandMap.set(key, rawBrand);
      }
    });
    return Array.from(brandMap.values()).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const normalizeText = (value: unknown) =>
      String(value ?? "").trim().toLowerCase();

    const parsePrice = (value: unknown) => {
      if (typeof value === "number") return value;
      const cleaned = String(value ?? "").replace(/[^0-9.]/g, "");
      const parsed = Number(cleaned);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const selectedCategoryValue = normalizeText(category);
    const selectedBrandValue = normalizeText(brand);

    // 1. Search
    if (searchTerm.trim() !== '') {
      const searchValue = normalizeText(searchTerm);
      result = result.filter(p =>
        normalizeText(p.name).includes(searchValue) || 
        normalizeText(p.brand).includes(searchValue)
      );
    }

    // 2. Category
    if (selectedCategoryValue !== 'all') {
      result = result.filter(p => normalizeText(p.category) === selectedCategoryValue);
    }

    // 3. Brand
    if (selectedBrandValue !== 'all') {
      result = result.filter(p => normalizeText(p.brand) === selectedBrandValue);
    }

    // 4. Price
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => {
        const priceValue = parsePrice(p.price);
        if (priceValue === null) return false;
        return priceValue >= min && priceValue <= max;
      });
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
    <div className="home-root">

      <div className="home-container">

        {/* Dynamic Carousel */}
        <HeroCarousel/>

        {/* Dynamic Shop Header */}
        <div className="shop-header">
            <h1
              className="shop-title"
              style={{ color: primaryColor }}
            >
              {displayedName}
              <span
                className="cursor-blink"
                style={{ color: primaryColor }}
              >
                |
              </span>
            </h1>
            <p className="shop-subtitle">Official Online Store</p>
        </div>
        
        {/* Trust Badges */}
        <div className="trust-badges-container">
          {[
            { icon: ShieldCheck, title: "100% Original", sub: "Official Warranty" },
            { icon: Star, title: "Top Rated", sub: "Best Local Service" },
            { icon: Truck, title: "Fast Delivery", sub: "Same Day Delivery" },
            { icon: Phone, title: "Support", sub: "Call Anytime" }
          ].map((item, idx) => (
            <div key={idx} className="trust-item">
              <div className="trust-icon-box">
                <item.icon className="trust-icon" />
              </div>
              <div className="trust-text-col">
                <h3 className="trust-title">{item.title}</h3>
                <p className="trust-sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="home-layout">

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

          <div className="content-area">

            {/* 🔥 TOOLBAR WITH SEARCH */}
            <div className="toolbar-sticky">
                <div className="toolbar-card">

                {/* Left Section: Filter Button & Search */}
                <div className="toolbar-left">
                    
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="mobile-filter-btn"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    {/* 🔍 SEARCH BAR */}
                    <div className="search-wrapper">
                        <Search className="search-icon-pos" />
                        <input
                            type="text"
                            placeholder="Search mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-field"
                        />
                    </div>
                </div>

                {/* Right Section: Sort & Count */}
                <div className="toolbar-right">
                    <span className="results-count">
                        <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                    </span>

                    <div className="sort-wrapper">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <ArrowUpDown className="sort-icon" />
                    </div>
                </div>

                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon-circle">
                   <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="empty-title">No products found</h3>
                <p className="empty-desc">We couldn't find what you're looking for.<br/>Try adjusting your search or filters.</p>
                <button
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="product-grid-layout">
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