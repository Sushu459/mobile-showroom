import { useState } from 'react';
import type { Product } from '../../types/product';
import { 
  X, 
  ShoppingBag, 
  Share2, 
  MessageCircle, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { tenant } = useTenant();
  const [showModal, setShowModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discountedPrice = product.price - (product.price * (product.discount / 100));

  // Safe Image Access
  const images = (product.image_urls && product.image_urls.length > 0) 
    ? product.image_urls 
    : [(product as any).image_url || 'https://placehold.co/400x300?text=No+Image'];

  const currentImage = images[currentImageIndex];

  // --- HANDLERS ---
  const handleOpenModal = () => {
    setCurrentImageIndex(0);
    setShowModal(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // --- NATIVE SHARE ---
  const handleNativeShare = async () => {
    if (!currentImage) return;
    if (!navigator.share) {
      alert("Sharing is not supported on this device.");
      return;
    }

    try {
      setIsSharing(true);
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const file = new File([blob], `${product.name.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });

      await navigator.share({
        title: `${product.brand} ${product.name}`,
        text: `Check out this ${product.name} at ${tenant?.name || 'Mobile Showroom'}!`,
        files: navigator.canShare && navigator.canShare({ files: [file] }) ? [file] : undefined,
        url: !navigator.canShare({ files: [file] }) ? window.location.href : undefined
      });
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // --- WHATSAPP ---
  const handleWhatsApp = () => {
    const phoneNumber = tenant?.mobile_number; 
    if (!phoneNumber) {
        alert("Shop contact number not available.");
        return;
    }

    const text = `
*Product Inquiry*
*Shop:* ${tenant?.name}
*Model:* ${product.brand} ${product.name}
*Price:* ₹${discountedPrice.toLocaleString()} (MRP: ₹${product.price.toLocaleString()})
*Image:* ${currentImage}

Hi, is this available?`.trim();

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* 1. PRODUCT CARD (Grid View) */}
      <div 
        className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer overflow-hidden"
        onClick={handleOpenModal}
      >
        {/* Card Image Area */}
        <div className="relative h-64 p-6 flex items-center justify-center bg-gray-50/50 group-hover:bg-gray-50 transition-colors">
          <img 
            src={images[0]} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
              -{product.discount}%
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
             <button 
                onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
                className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 transition-colors"
             >
                {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
             </button>
          </div>
        </div>
        
        {/* Card Details */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-2">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </div>
          
          <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
            <div>
               <p className="text-lg font-extrabold text-gray-900">₹{discountedPrice.toLocaleString()}</p>
               {product.discount > 0 && (
                 <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
               )}
            </div>
            <div className="p-2 bg-purple-200 rounded-full  group-hover:bg-purple-400 group-hover:text-white transition-colors">
               <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREMIUM MODAL (Mobile Optimized) */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-lg transition-opacity" 
            onClick={handleCloseModal} 
          />
          
          {/* Main Modal Container: Fixed height, Flex layout */}
          <div className="relative bg-white w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-4xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row">
            
            {/* Close Button (Floating) */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full z-50 transition-all shadow-sm border border-gray-200"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {/* --- LEFT: GALLERY (Compact on Mobile, Full on Desktop) --- */}
            {/* h-auto max-h-[40vh] on mobile prevents it from eating the whole screen */}
            <div className="w-full md:w-7/12 h-auto max-h-[35vh] md:max-h-full md:h-full bg-[#F8F9FA] relative flex flex-col justify-center p-4 md:p-10 shrink-0">
               
               {/* Main Stage */}
               <div className="flex-1 flex items-center justify-center relative min-h-0">
                 <img 
                    src={currentImage} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xl" 
                 />
                 
                 {/* Navigation Arrows */}
                 {images.length > 1 && (
                   <>
                     <button onClick={prevImage} className="absolute left-0 p-2 bg-white/80 rounded-full shadow-md text-gray-800 hover:scale-110 transition-transform">
                       <ChevronLeft className="w-5 h-5" />
                     </button>
                     <button onClick={nextImage} className="absolute right-0 p-2 bg-white/80 rounded-full shadow-md text-gray-800 hover:scale-110 transition-transform">
                       <ChevronRight className="w-5 h-5" />
                     </button>
                   </>
                 )}
               </div>

               {/* Thumbnails (Hidden on very small screens if needed, or kept compact) */}
               {images.length > 1 && (
                 <div className="flex justify-center gap-2 mt-4 overflow-x-auto py-1 px-2 no-scrollbar shrink-0">
                   {images.map((img, idx) => (
                     <button
                       key={idx}
                       onClick={() => setCurrentImageIndex(idx)}
                       className={`relative w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                         currentImageIndex === idx 
                           ? 'border-gray-900 shadow-md scale-105' 
                           : 'border-transparent bg-white opacity-60 hover:opacity-100'
                       }`}
                     >
                       <img src={img} alt="thumb" className="w-full h-full object-cover mix-blend-multiply" />
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* --- RIGHT: PRODUCT DETAILS (Scrollable Area) --- */}
            <div className="w-full md:w-5/12 bg-white flex flex-col flex-1 min-h-0 border-l border-gray-100 relative">
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                
                {/* Header */}
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
                      {product.brand}
                    </span>
                    {product.in_stock ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <span>Official Warranty Included</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-6 md:mb-8 p-4 md:p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-extrabold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  {product.discount > 0 && (
                    <div className="text-right">
                      <span className="block text-xs text-gray-400 line-through decoration-red-400 decoration-2">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg mt-1 inline-block">
                        Save {product.discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Specs / Description */}
                <div className="mb-20 md:mb-8">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Specifications
                  </h4>
                  <div className="prose prose-sm text-gray-600 leading-relaxed text-sm">
                    <p className="whitespace-pre-line">
                      {product.description || "No specific details available for this product. Please contact the shop owner for more information."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Actions (Always visible at bottom) */}
              <div className="p-4 md:p-8 border-t border-gray-100 bg-white/95 backdrop-blur-sm absolute bottom-0 left-0 w-full z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button 
                  onClick={handleWhatsApp} 
                  className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-base md:text-lg py-3.5 md:py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  <span>Buy on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}