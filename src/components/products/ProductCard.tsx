import { useState } from 'react';
import type { Product } from '../../types/product';
import { X, ShoppingBag,  Share2, MessageCircle } from 'lucide-react'; // Added Share2 icon
import { SHOP_PHONE } from '../../utils/constants';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [showModal, setShowModal] = useState(false);
  const discountedPrice = product.price - (product.price * (product.discount / 100));

  // 1. Generate the Professional Message
  const generateShareData = () => {
    const title = `${product.brand} ${product.name}`;
    const text = `
📱 *Product Inquiry*
*Model:* ${product.brand} ${product.name}
*Price:* ₹${discountedPrice.toLocaleString()} (MRP: ₹${product.price.toLocaleString()})
*Discount:* ${product.discount}% OFF

*Specs:*
${product.description || 'Standard Configuration'}

*Image:* ${product.image_url}

---------------------------
Hi, I am interested in this mobile. Is it available?
    `.trim();

    return { title, text, url: product.image_url };
  };

  // 2. Handle "Native Share" (Like Amazon app)
const handleNativeShare = async () => {
  const data = generateShareData();

  if (navigator.share && navigator.canShare) {
    try {
      // Fetch image
      const response = await fetch(product.image_url);
      const blob = await response.blob();

      const file = new File([blob], `${product.name}.jpg`, {
        type: blob.type,
      });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: data.title,
          text: data.text,
          files: [file], // 🔥 Real image file shared
        });
      } else {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: window.location.href,
        });
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  } else {
    alert("Sharing is supported only on modern mobile browsers.");
  }
};


  // 3. Handle Direct WhatsApp Chat (Fallback & Primary CTA)
  const handleWhatsApp = () => {
    const data = generateShareData();
    const whatsappUrl = `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(data.text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* 1. The Card */}
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="relative h-64 bg-gray-50 p-6 flex items-center justify-center group-hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowModal(true)}>
          <img 
            src={product.image_url || 'https://placehold.co/400x300?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
          {/* Top Right Share Icon */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm z-10 transition-colors"
          >
            <Share2 className="w-4 h-4" />
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
            <h3 
              className="text-base font-bold text-gray-900 truncate mt-1 group-hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => setShowModal(true)}
            >
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
            
            <button 
              onClick={() => setShowModal(true)}
              className="bg-purple-100 text-purple-700 p-2.5 rounded-full hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 shadow-sm"
            >
               <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. The Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
                 {/* Share Button Inside Modal */}
                 <button 
                    onClick={handleNativeShare}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-blue-600 z-20"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="max-h-75 object-contain mix-blend-multiply"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{product.brand}</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-3xl font-extrabold text-gray-900">₹{discountedPrice.toLocaleString()}</p>
                  {product.discount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      MRP: <span className="line-through">₹{product.price.toLocaleString()}</span> 
                      <span className="text-green-600 font-bold ml-2">({product.discount}% OFF)</span>
                    </p>
                  )}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8">
                  <h4 className="text-gray-900 font-bold mb-2">Specifications</h4>
                  <p className="whitespace-pre-line leading-relaxed text-sm">
                    {product.description || "No specific details available."}
                  </p>
                </div>

                {/* Big WhatsApp Button */}
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-[0.98] mt-auto"
                >
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