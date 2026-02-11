import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Default slide to show if no products exist yet
  const defaultSlide = {
    id: 'default',
    name: 'Welcome to MobileShowroom',
    brand: 'Best Deals in Town',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop',
    discount: 0,
    category: 'Welcome'
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const products = await productService.getFeaturedProducts();
        setSlides(products.length > 0 ? products : []);
      } catch (error) {
        console.error("Failed to load carousel images", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (slides.length <= 1) return; // Don't scroll if only 1 slide
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurrent((curr) => (curr + 1) % slides.length);

  // If loading or empty, show default state
  const displaySlides = slides.length > 0 ? slides : [defaultSlide];
  // Ensure we don't crash if current index is out of bounds after an update

  if (loading) return <div className="w-full h-100 md:h-125 bg-gray-200 animate-pulse rounded-2xl mb-12"></div>;

  return (
    <div className="relative w-full h-100 md:h-125 overflow-hidden rounded-2xl shadow-2xl mb-12 group bg-gray-900">
      {displaySlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-10" />
          
          {/* We use object-cover to fill the area, but if user uploads weird sizes, this ensures it looks decent */}
          {/* Background Blur Layer */}
<div
  className="absolute inset-0 bg-center bg-cover scale-110 blur-xl opacity-30"
  style={{ backgroundImage: `url(${slide.image_url})` }}
/>

{/* Main Image */}
<img
  src={slide.image_url}
  alt={slide.name}
  className="absolute inset-0 w-full h-full object-contain object-center"
/>

          
          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 text-white max-w-4xl">
            {slide.discount > 0 ? (
              <span className="inline-block px-4 py-1 mb-4 text-sm font-bold tracking-wider uppercase bg-red-600 rounded-full w-fit animate-fade-in-up shadow-lg">
                Flat {slide.discount}% OFF
              </span>
            ) : (
              <span className="inline-block px-4 py-1 mb-4 text-sm font-bold tracking-wider uppercase bg-blue-600 rounded-full w-fit animate-fade-in-up shadow-lg">
                {slide.category}
              </span>
            )}
            
            <h2 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight leading-tight drop-shadow-lg">
              {slide.name}
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 font-medium mb-6 drop-shadow-md">
              {slide.brand}
            </p>

            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-transform hover:scale-105 w-fit shadow-xl flex items-center gap-2">
              View Details
            </button>
          </div>
        </div>
      ))}

      {/* Only show navigation if we have multiple slides */}
      {displaySlides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20">
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
  );
}