import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import { ArrowLeft,  MessageCircle } from "lucide-react";

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
      const whatsappNumber = "8978951842"; // Note: Usually you don't target a specific number for general sharing, but I kept it per your code.
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
    };

    try {
      // 1. Check if the browser supports sharing files
      if (navigator.share && navigator.canShare) {
        
        // 2. Fetch the image to create a "File" object
        // Note: Your image server (Supabase) must allow CORS for this to work
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
      // If the user cancels the share or an error occurs, you might want to fallback or just do nothing
      // fallbackToWhatsAppUrl(); // Optional: Uncomment if you want to force the link on error
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg">Product not found</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * (product.discount / 100));
  const savings = product.price - discountedPrice;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-8 transition duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Shop
        </button>

        {/* Main Product Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-72 w-72 object-contain rounded-lg shadow-lg bg-white p-4"
                />
                {product.discount > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Details + Specifications (combined right column) */}
            <div className="flex flex-col justify-between">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-300">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <p className="text-xl text-gray-600 mb-6">
                  Brand: <span className="font-semibold text-gray-900">{product.brand}</span>
                </p>

                {/* Price Section */}
                <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Current Price</p>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{discountedPrice.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <div>
                        <p className="text-lg text-gray-500 line-through">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          Save ₹{savings.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compact Product Info Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500">Original</p>
                    <p className="text-base font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="text-base font-semibold text-orange-600">{product.discount}%</p>
                  </div>
                </div>

                {/* Specifications moved beside image (in same right column) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="border-l-4 border-blue-600 pl-3 bg-white/60 rounded-md p-2">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Product</h3>
                    <p className="text-sm font-bold text-gray-900 mt-1">{product.name}</p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-3 bg-white/60 rounded-md p-2">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Brand</h3>
                    <p className="text-sm font-bold text-gray-900 mt-1">{product.brand}</p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-3 bg-white/60 rounded-md p-2">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Category</h3>
                    <p className="text-sm font-bold text-gray-900 mt-1">{product.category}</p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-3 bg-white/60 rounded-md p-2">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Price</h3>
                    <p className="text-sm font-bold text-blue-600 mt-1">₹{discountedPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Compact single share icon (opens WhatsApp with image and details) */}
              <div className="flex items-center justify-start mt-4">
                <button
                  onClick={handleShareWhatsApp}
                  aria-label="Share on WhatsApp"
                  className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition duration-200"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-700">Share</span>
              </div>
            </div>
          </div>
        </div>

        {/* Removed separate specifications block — specs are now in right column */}
      </div>
    </div>
  );
}
