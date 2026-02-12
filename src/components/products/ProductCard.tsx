import { useState } from 'react';
import type { Product } from '../../types/product';
import { X, ShoppingBag, Share2, MessageCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Open Modal & Reset Gallery
  const handleOpenModal = () => {
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  // Gallery Navigation
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

      const shareData: ShareData = {
        title: `${product.brand} ${product.name}`,
        text: `Check out this ${product.name} at ${tenant?.name || 'Mobile Showroom'}!`,
        files: navigator.canShare && navigator.canShare({ files: [file] }) ? [file] : undefined,
        url: !navigator.canShare({ files: [file] }) ? window.location.href : undefined
      };

      await navigator.share(shareData);
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
      {/* 1. CARD GRID ITEM */}
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        {/* Main Card Image (Shows First Image) */}
        <div className="relative h-64 bg-gray-50 p-6 flex items-center justify-center group-hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleOpenModal}>
          <img 
            src={images[0]} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Share Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
            disabled={isSharing}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm z-10 transition-colors"
          >
            {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.category === 'Trending' && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Trending</span>}
            {product.category === 'New Arrival' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase">New</span>}
          </div>
          {product.discount > 0 && (
            <div className="absolute bottom-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              {product.discount}% OFF
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-base font-bold text-gray-900 truncate mt-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleOpenModal}>
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-[2.5em]">
              {product.description || 'View details for specifications...'}
            </p>
          </div>
          
          <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
            <div className="flex flex-col">
               <span className="text-xs text-gray-400 font-medium">Price</span>
               <div className="flex items-baseline gap-2">
                  <p className="text-xl font-extrabold text-gray-900">₹{discountedPrice.toLocaleString()}</p>
                  {product.discount > 0 && (
                    <p className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
                  )}
               </div>
            </div>
            
            <button onClick={handleOpenModal} className="bg-purple-100 text-purple-700 p-2.5 rounded-full hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 shadow-sm">
               <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. DETAILS MODAL WITH GALLERY */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-30 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* --- LEFT: IMAGE GALLERY --- */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center relative select-none">
               
               {/* Main Large Image */}
               <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-4">
                 <img 
                    src={currentImage} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300" 
                 />
                 
                 {/* Navigation Arrows (Only if > 1 image) */}
                 {images.length > 1 && (
                   <>
                     <button onClick={prevImage} className="absolute left-0 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 transition-all hover:scale-110">
                       <ChevronLeft className="w-6 h-6" />
                     </button>
                     <button onClick={nextImage} className="absolute right-0 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 transition-all hover:scale-110">
                       <ChevronRight className="w-6 h-6" />
                     </button>
                   </>
                 )}
               </div>

               {/* Thumbnails Row */}
               {images.length > 1 && (
                 <div className="flex gap-2 overflow-x-auto py-2 px-1 max-w-full no-scrollbar">
                   {images.map((img, idx) => (
                     <button
                       key={idx}
                       onClick={() => setCurrentImageIndex(idx)}
                       className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                         currentImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                       }`}
                     >
                       <img src={img} alt="thumb" className="w-full h-full object-cover" />
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* --- RIGHT: DETAILS --- */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto bg-white">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{product.brand}</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h2>
              
              <div className="mb-6 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  ₹{discountedPrice.toLocaleString()}
                </p>
                {product.discount > 0 && (
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    MRP: <span className="line-through">₹{product.price.toLocaleString()}</span> 
                    <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                      {product.discount}% SAVED
                    </span>
                  </p>
                )}
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 grow">
                <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
                  Specifications
                </h4>
                <p className="whitespace-pre-line leading-relaxed text-sm">
                  {product.description || "No specific details available."}
                </p>
              </div>
              
              <div className="mt-auto space-y-3">
                <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-1">
                  <MessageCircle className="w-6 h-6 fill-current" />
                  <span className="text-lg">Chat on WhatsApp</span>
                </button>
                
                <button onClick={handleNativeShare} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share with Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}