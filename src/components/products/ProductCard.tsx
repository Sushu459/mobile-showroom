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
import "./ProductCard.css"; // Import the CSS file

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
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        className="product-card"
        onClick={handleOpenModal}
      >
        {/* Card Image Area */}
        <div className="card-image-area">
          <img 
            src={images[0]} 
            alt={product.name}
            className="card-img"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="discount-badge">
              -{product.discount}%
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="quick-action">
             <button 
                onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
                className="share-btn"
             >
                {isSharing ? <Loader2 className="icon-sm spin" /> : <Share2 className="icon-sm" />}
             </button>
          </div>
        </div>
        
        {/* Card Details */}
        <div className="card-details">
          <div style={{ marginBottom: '0.5rem' }}>
            <p className="card-brand">{product.brand}</p>
            <h3 className="card-title">
              {product.name}
            </h3>
          </div>
          
          <div className="card-footer">
            <div>
               <p className="price-lg">₹{discountedPrice.toLocaleString()}</p>
               {product.discount > 0 && (
                 <p className="price-sm">₹{product.price.toLocaleString()}</p>
               )}
            </div>
            <div className="bag-icon-box">
               <ShoppingBag className="icon-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREMIUM MODAL */}
      {showModal && (
        <div className="modal-fixed-wrapper">
          <div 
            className="modal-backdrop" 
            onClick={handleCloseModal} 
          />
          
          {/* Main Modal Container */}
          <div className="modal-box">
            
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="modal-close-btn"
            >
              <X className="icon-md text-gray-800" />
            </button>

            {/* --- LEFT: GALLERY --- */}
            <div className="gallery-section">
               
               {/* Main Stage */}
               <div className="gallery-stage">
                 <img 
                    src={currentImage} 
                    alt={product.name} 
                    className="gallery-main-img" 
                 />
                 
                 {/* Navigation Arrows */}
                 {images.length > 1 && (
                   <>
                     <button onClick={prevImage} className="gallery-nav-btn nav-left">
                       <ChevronLeft className="icon-md" />
                     </button>
                     <button onClick={nextImage} className="gallery-nav-btn nav-right">
                       <ChevronRight className="icon-md" />
                     </button>
                   </>
                 )}
               </div>

               {/* Thumbnails */}
               {images.length > 1 && (
                 <div className="thumbnails-row no-scrollbar">
                   {images.map((img, idx) => (
                     <button
                       key={idx}
                       onClick={() => setCurrentImageIndex(idx)}
                       className={`thumb-btn ${currentImageIndex === idx ? 'active' : 'inactive'}`}
                     >
                       <img src={img} alt="thumb" className="thumb-img" />
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* --- RIGHT: PRODUCT DETAILS --- */}
            <div className="details-section">
              
              {/* Scrollable Content */}
              <div className="details-content custom-scrollbar">
                
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="header-row">
                    <span className="brand-pill">
                      {product.brand}
                    </span>
                    {product.in_stock ? (
                      <span className="stock-pill in-stock">
                        <CheckCircle2 className="icon-sm" /> In Stock
                      </span>
                    ) : (
                      <span className="stock-pill out-stock">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  
                  <h2 className="modal-title">
                    {product.name}
                  </h2>
                  
                  <div className="warranty-row">
                    <ShieldCheck className="icon-sm text-gray-400" />
                    <span>Official Warranty Included</span>
                  </div>
                </div>
                
                {/* Price Section */}
                <div className="details-price-box">
                  <div>
                    <p className="price-label">Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="price-box-main">₹{discountedPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  {product.discount > 0 && (
                    <div className="text-right">
                      <span className="block text-xs text-gray-400 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="save-pill">
                        Save {product.discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Specs / Description */}
                <div className="specs-area">
                  <h4 className="specs-title">
                    <Smartphone className="icon-sm" /> Specifications
                  </h4>
                  <div className="specs-text">
                    <p>
                      {product.description || "No specific details available for this product. Please contact the shop owner for more information."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Actions */}
              <div className="sticky-footer">
                <button 
                  onClick={handleWhatsApp} 
                  className="whatsapp-action-btn"
                >
                  <MessageCircle className="icon-md fill-current" />
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