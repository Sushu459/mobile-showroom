import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MessageCircle, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';
import { useTenant } from '../../context/TenantContext'; 
// Make sure to import the CSS file
import './HeroCarousel.css'; 

export default function HeroCarousel({ tenantId }: { tenantId?: string }) {
  const { tenant } = useTenant();
  
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Fallback slide if no products exist
  const defaultSlide = {
    id: 'default',
    name: tenant ? `Welcome to ${tenant.name}` : 'Welcome to MobileShowroom',
    brand: 'Best Deals in Town',
    image_urls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop'],
    discount: 0,
    category: 'Welcome',
    price: 0,
    description: 'Explore our latest collection of premium smartphones.',
    in_stock: true
  } as Product;

  useEffect(() => {
    const fetchSlides = async () => {
      const targetId = tenantId || tenant?.tenant_id;
      if (!targetId) return;

      try {
        const products = await productService.getFeaturedProducts(targetId);
        setSlides(products.length > 0 ? products : []);
      } catch (error) {
        console.error("Failed to load carousel images", error);
      } finally {
        setLoading(false);
      }
    };

    if (tenant || tenantId) {
        fetchSlides();
    }
  }, [tenant, tenantId]);

  // Auto-rotate slides (pauses if modal is open)
  useEffect(() => {
    if (slides.length <= 1 || selectedProduct) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, selectedProduct]);

  const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurrent((curr) => (curr + 1) % slides.length);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const getPriceDetails = (product: Product) => {
    const discounted = product.price - (product.price * (product.discount / 100));
    return { discounted };
  };

  // Helper to safely get image array
  const getProductImages = (product: Product) => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls;
    }
    // Fallback for legacy data structure or empty images
    return [(product as any).image_url || 'https://placehold.co/800x600?text=No+Image'];
  };

  const handleWhatsApp = (product: Product) => {
    const images = getProductImages(product);
    const currentImg = images[modalImageIndex] || images[0];
    const { discounted } = getPriceDetails(product);

    const shopName = tenant?.name || "Mobile Showroom";
    
    const text = `
📱 *Product Inquiry*
*Shop:* ${shopName}
*Model:* ${product.brand} ${product.name}
*Price:* ₹${discounted.toLocaleString()} (MRP: ₹${product.price.toLocaleString()})
*Discount:* ${product.discount}% OFF

*Specs:*
${product.description || 'Standard Configuration'}

*Image:* ${currentImg}

---------------------------
Hi, I am interested in this mobile. Is it available?
    `.trim();

    const phoneNumber = tenant?.mobile_number;
    
    if (phoneNumber) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert("Shop contact number not found.");
    }
  };
  
  const displaySlides = slides.length > 0 ? slides : [defaultSlide];

  if (loading) return (
    <div className="hero-loader-container">
        <Loader2 className="spinner" />
    </div>
  );

  return (
    <>
      {/* 1. CAROUSEL */}
      <div className="carousel-root group">
        {displaySlides.map((slide, index) => {
          const heroImages = getProductImages(slide);
          const heroImage = heroImages[0];

          return (
            <div
              key={slide.id}
              className={`slide-item ${index === current ? "active" : "inactive"}`}
            >
              {/* Blurred Background */}
              <div
                className="slide-bg"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="slide-overlay" />

              {/* Main Hero Image */}
              <img
                src={heroImage}
                alt={slide.name}
                className="hero-product-img"
              />
              
              <div className="hero-content">
                <div className="hero-anim-wrapper">
                  {slide.discount > 0 ? (
                    <span className="hero-badge badge-red">
                      Flat {slide.discount}% OFF
                    </span>
                  ) : (
                    <span className="hero-badge badge-blue">
                      {slide.category}
                    </span>
                  )}
                  
                  <h2 className="hero-title">
                    {slide.name}
                  </h2>
                  
                  <p className="hero-subtitle">
                    {slide.brand}
                  </p>

                  <button 
                    onClick={() => openModal(slide)} 
                    className="hero-btn"
                  >
                    View Details
                    <ChevronRight size={20} className="text-current" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {displaySlides.length > 1 && (
          <>
            <button onClick={prev} className="nav-arrow nav-prev group-hover:opacity-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="nav-arrow nav-next group-hover:opacity-100">
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="nav-dots">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`nav-dot ${idx === current ? "active" : "inactive"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. DETAILS MODAL */}
      {selectedProduct && (
        <div className="modal-overlay">
          {/* Backdrop handles the close event */}
          <div className="modal-backdrop" onClick={closeModal} />
          
          {/* Container stops propagation so clicking inside doesn't close modal */}
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="modal-close-btn">
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Modal Image Section */}
            <div className="modal-left">
               <div className="modal-img-wrapper">
                 {(() => {
                   const images = getProductImages(selectedProduct);
                   
                   return (
                     <>
                       <img 
                         src={images[modalImageIndex]} 
                         alt={selectedProduct.name} 
                         className="modal-main-img"
                       />
                       {images.length > 1 && (
                         <>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                             }} 
                             className="modal-arrow modal-arrow-left"
                           >
                             <ChevronLeft size={24} />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setModalImageIndex((prev) => (prev + 1) % images.length);
                             }} 
                             className="modal-arrow modal-arrow-right"
                           >
                             <ChevronRight size={24} />
                           </button>
                           <div className="modal-dots">
                             {images.map((_, idx) => (
                               <div key={idx} className={`modal-dot ${idx === modalImageIndex ? 'active' : 'inactive'}`} />
                             ))}
                           </div>
                         </>
                       )}
                     </>
                   );
                 })()}
               </div>
            </div>

            {/* Modal Details Section */}
            <div className="modal-right">
              <span className="modal-brand">{selectedProduct.brand}</span>
              <h2 className="modal-title">{selectedProduct.name}</h2>
              
              <div className="modal-price-box">
                <p className="price-main">
                  ₹{getPriceDetails(selectedProduct).discounted.toLocaleString()}
                </p>
                {selectedProduct.discount > 0 && (
                  <p className="price-sub">
                    MRP: <span className="strike">₹{selectedProduct.price.toLocaleString()}</span> 
                    <span className="discount-tag">({selectedProduct.discount}% OFF)</span>
                  </p>
                )}
              </div>

              <div className="modal-desc-box">
                <h4 className="desc-title">Specifications</h4>
                {/* Renders description ensuring new lines are respected */}
                <p className="desc-text" style={{ whiteSpace: 'pre-line' }}>
                  {selectedProduct.description || "No specific details available."}
                </p>
              </div>

              <button 
                onClick={() => handleWhatsApp(selectedProduct)}
                className="whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Send Inquiry on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}