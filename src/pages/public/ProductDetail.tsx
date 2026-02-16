import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import { ArrowLeft, MessageCircle } from "lucide-react";
import "./ProductDetail.css"; // Import the CSS file

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleShareWhatsApp = async () => {
    if (!product) return;

    const productLink = `${window.location.origin}/product/${product.id}`;
    const messageText = `Check out this mobile! 📱\n\n${product.name}\nBrand: ${product.brand}\nPrice: ₹${product.price.toLocaleString()}\nDiscount: ${product.discount}%\n\nView Details: ${productLink}`;

    // Function to handle the fallback (old method) if native sharing fails
    const fallbackToWhatsAppUrl = () => {
      const messageWithImageLink = `${messageText}\n\nImage: ${product.image_url}`;
      const encodedMessage = encodeURIComponent(messageWithImageLink);
      const whatsappNumber = "8978951842"; 
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
    };

    try {
      // 1. Check if the browser supports sharing files
      if (navigator.share && navigator.canShare) {
        
        // 2. Fetch the image to create a "File" object
        const response = await fetch(product.image_url);
        const blob = await response.blob();
        const file = new File([blob], "product_image.jpg", { type: blob.type });

        // 3. Verify if this specific file is shareable
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: product.name,
            text: messageText,
            files: [file], // This sends the actual image!
          });
        } else {
          fallbackToWhatsAppUrl();
        }
      } else {
        // Fallback for Desktop or unsupported browsers
        fallbackToWhatsAppUrl();
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p className="status-text">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="status-container">
        <p className="status-text">Product not found</p>
        <button
          onClick={() => navigate("/")}
          className="back-btn"
          style={{ justifyContent: 'center', width: '100%' }}
        >
          ← Back to Shop
        </button>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * (product.discount / 100));
  const savings = product.price - discountedPrice;

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Shop
        </button>

        {/* Main Product Content */}
        <div className="product-card-wrapper">
          <div className="product-content-grid">
            
            {/* Product Image */}
            <div className="image-section">
              <div className="image-wrapper">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
                {product.discount > 0 && (
                  <div className="discount-badge">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Details + Specifications */}
            <div className="details-column">
              {/* Header Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="category-badge">
                    {product.category}
                  </span>
                </div>

                <h1 className="product-title">
                  {product.name}
                </h1>

                <p className="brand-text">
                  Brand: <span className="brand-highlight">{product.brand}</span>
                </p>

                {/* Price Section */}
                <div className="price-section">
                  <p className="price-label">Current Price</p>
                  <div className="price-row">
                    <span className="price-main">
                      ₹{discountedPrice.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <div>
                        <p className="price-old">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <p className="price-savings">
                          Save ₹{savings.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compact Product Info Row */}
                <div className="info-grid">
                  <div className="info-card">
                    <p className="info-label">Original</p>
                    <p className="info-value">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="info-card">
                    <p className="info-label">Discount</p>
                    <p className="info-value text-orange">{product.discount}%</p>
                  </div>
                </div>

                {/* Specifications moved beside image */}
                <div className="specs-list">
                  <div className="spec-item">
                    <h3 className="spec-label">Product</h3>
                    <p className="spec-value">{product.name}</p>
                  </div>
                  <div className="spec-item">
                    <h3 className="spec-label">Brand</h3>
                    <p className="spec-value">{product.brand}</p>
                  </div>
                  <div className="spec-item">
                    <h3 className="spec-label">Category</h3>
                    <p className="spec-value">{product.category}</p>
                  </div>
                  <div className="spec-item">
                    <h3 className="spec-label">Price</h3>
                    <p className="spec-value text-blue">₹{discountedPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Compact single share icon */}
              <div className="share-section">
                <button
                  onClick={handleShareWhatsApp}
                  aria-label="Share on WhatsApp"
                  className="share-btn-wa"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
                <span className="share-label">Share</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}