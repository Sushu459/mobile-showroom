import { useState } from 'react';
import type { Product } from '../../types/product';
import { X, ShoppingBag, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { useTenant } from '../../context/TenantContext'; // <--- 1. Import Context

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { tenant } = useTenant(); // <--- 2. Get Dynamic Tenant Data
  const [showModal, setShowModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const discountedPrice = product.price - (product.price * (product.discount / 100));

  // --- NATIVE SHARE (Image File) ---
  const handleNativeShare = async () => {
    // Determine the image to share (first one or fallback)
    const imageUrl = (product.image_urls && product.image_urls.length > 0) 
        ? product.image_urls[0] 
        : (product as any).image_url;

    if (!imageUrl) return;

    if (!navigator.share) {
      alert("Sharing is not supported on this device.");
      return;
    }

    try {
      setIsSharing(true);
      const response = await fetch(imageUrl);
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

  // --- WHATSAPP HANDLER (Dynamic Number) ---
  const handleWhatsApp = () => {
    // 3. Use the number from the Database, NOT constants.ts
    const phoneNumber = tenant?.mobile_number; 

    if (!phoneNumber) {
        alert("Shop contact number not available.");
        return;
    }

    const imageUrl = (product.image_urls && product.image_urls.length > 0) 
        ? product.image_urls[0] 
        : (product as any).image_url;

    const text = `
*Product Inquiry*
*Shop:* ${tenant?.name}
*Model:* ${product.brand} ${product.name}
*Price:* ₹${discountedPrice.toLocaleString()} (MRP: ₹${product.price.toLocaleString()})
*Link/Image:* ${imageUrl}

Hi, is this available?`.trim();

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Helper for image display in card
  const displayImage = (product.image_urls && product.image_urls.length > 0)
    ? product.image_urls[0]
    : (product as any).image_url || 'https://placehold.co/400x300?text=No+Image';

  return (
    <>
      {/* CARD UI */}
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="relative h-64 bg-gray-50 p-6 flex items-center justify-center group-hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowModal(true)}>
          <img 
            src={displayImage} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
            disabled={isSharing}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm z-10 transition-colors"
          >
            {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
          </button>

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
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-base font-bold text-gray-900 truncate mt-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setShowModal(true)}>
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
            
            <button onClick={() => setShowModal(true)} className="bg-purple-100 text-purple-700 p-2.5 rounded-full hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 shadow-sm">
               <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10">
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
                 <button 
                    onClick={handleNativeShare}
                    disabled={isSharing}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-blue-600 z-20"
                  >
                    {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                  </button>
                <img src={displayImage} alt={product.name} className="max-h-75 object-contain mix-blend-multiply" />
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{product.brand}</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-3xl font-extrabold text-gray-900">₹{discountedPrice.toLocaleString()}</p>
                  {product.discount > 0 && <p className="text-sm text-gray-500 mt-1">MRP: <span className="line-through">₹{product.price.toLocaleString()}</span> <span className="text-green-600 font-bold ml-2">({product.discount}% OFF)</span></p>}
                </div>
                <div className="prose prose-sm text-gray-600 mb-8">
                  <h4 className="text-gray-900 font-bold mb-2">Specifications</h4>
                  <p className="whitespace-pre-line leading-relaxed text-sm">{product.description || "No specific details available."}</p>
                </div>
                
                {/* 4. WhatsApp Button using Dynamic Number */}
                <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-[0.98] mt-auto">
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Send Inquiry on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}