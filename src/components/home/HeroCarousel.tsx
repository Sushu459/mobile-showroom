import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MessageCircle, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';
import { useTenant } from '../../context/TenantContext'; // Import Tenant Context

// Accept optional prop to stay compatible with Home.tsx, but prefer Context
export default function HeroCarousel({ tenantId }: { tenantId?: string }) {
  const { tenant } = useTenant(); // Get full tenant details (name, mobile, etc.)
  
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Default slide (Fallback)
  const defaultSlide = {
    id: 'default',
    name: tenant ? `Welcome to ${tenant.name}` : 'Welcome to MobileShowroom',
    brand: 'Best Deals in Town',
    image_urls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop'],
    discount: 0,
    category: 'Welcome',
    price: 0,
    description: '',
    in_stock: true
  } as Product;

  useEffect(() => {
    const fetchSlides = async () => {
      // Use the prop if passed, otherwise fallback to context
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

  // Auto-scroll logic
  useEffect(() => {
    if (slides.length <= 1 || selectedProduct) return; // Pause auto-scroll if modal is open
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, selectedProduct]);

  const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurrent((curr) => (curr + 1) % slides.length);

  // --- MODAL LOGIC ---
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

  // UPDATED: Use Dynamic Tenant Mobile Number
  const handleWhatsApp = (product: Product) => {
    const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [(product as any).image_url];
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

    // Use Tenant's number if available
    const phoneNumber = tenant?.mobile_number;
    
    if (phoneNumber) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert("Shop contact number not found.");
    }
  };
  
  // --- RENDER ---
  const displaySlides = slides.length > 0 ? slides : [defaultSlide];

  if (loading) return (
    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-2xl mb-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <>
      {/* 1. CAROUSEL */}
      <div className="relative w-full h-95 md:h-95 overflow-hidden rounded-2xl shadow-2xl mb-12 group bg-gray-900 border border-gray-800">
        {displaySlides.map((slide, index) => {
          // Handle image array vs single string fallback
          const heroImage = (slide.image_urls && slide.image_urls.length > 0) 
            ? slide.image_urls[0] 
            : (slide as any).image_url || 'https://placehold.co/800x600?text=No+Image';

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-center bg-cover scale-110 blur-xl opacity-40 transition-transform duration-10000 ease-linear"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent z-10" />

              <img
                src={heroImage}
                alt={slide.name}
                className="absolute right-0 top-0 h-full w-2/3 object-contain object-right-center z-0 mix-blend-lighten opacity-90 p-8"
              />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
                <div className="animate-fade-in-up">
                  {slide.discount > 0 ? (
                    <span className="inline-block px-4 py-1 mb-4 text-sm font-bold tracking-wider uppercase bg-red-600 rounded-full w-fit shadow-lg shadow-red-900/50">
                      Flat {slide.discount}% OFF
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-1 mb-4 text-sm font-bold tracking-wider uppercase bg-blue-600 rounded-full w-fit shadow-lg shadow-blue-900/50">
                      {slide.category}
                    </span>
                  )}
                  
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight leading-tight drop-shadow-2xl">
                    {slide.name}
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8 drop-shadow-md">
                    {slide.brand}
                  </p>

                  <button 
                    onClick={() => openModal(slide)} 
                    className="bg-white text-gray-900 px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all w-fit shadow-xl shadow-white/10 flex items-center gap-2"
                  >
                    View Details
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {displaySlides.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 active:scale-90">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 active:scale-90">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                    idx === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. DETAILS MODAL (Pop-up) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-30">
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Modal Image Section */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
               <div className="relative w-full h-full flex items-center justify-center">
                 {(() => {
                   // Ensure images is always an array
                   const images = selectedProduct.image_urls && selectedProduct.image_urls.length > 0 
                     ? selectedProduct.image_urls 
                     : [(selectedProduct as any).image_url || 'https://placehold.co/400x300'];
                   
                   return (
                     <>
                       <img 
                         src={images[modalImageIndex]} 
                         alt={selectedProduct.name} 
                         className="max-h-[60vh] object-contain mix-blend-multiply"
                       />
                       {images.length > 1 && (
                         <>
                           <button 
                             onClick={() => setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))} 
                             className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-20"
                           >
                             <ChevronLeft size={24} />
                           </button>
                           <button 
                             onClick={() => setModalImageIndex((prev) => (prev + 1) % images.length)} 
                             className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-20"
                           >
                             <ChevronRight size={24} />
                           </button>
                           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                             {images.map((_, idx) => (
                               <div key={idx} className={`h-2 rounded-full transition-all ${idx === modalImageIndex ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}`} />
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
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{selectedProduct.brand}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-3xl font-extrabold text-gray-900">
                  ₹{getPriceDetails(selectedProduct).discounted.toLocaleString()}
                </p>
                {selectedProduct.discount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    MRP: <span className="line-through">₹{selectedProduct.price.toLocaleString()}</span> 
                    <span className="text-green-600 font-bold ml-2">({selectedProduct.discount}% OFF)</span>
                  </p>
                )}
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 grow">
                <h4 className="text-gray-900 font-bold mb-2">Specifications</h4>
                <p className="whitespace-pre-line leading-relaxed text-sm">
                  {selectedProduct.description || "No specific details available."}
                </p>
              </div>

              <button 
                onClick={() => handleWhatsApp(selectedProduct)}
                className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-[0.98] mt-4"
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