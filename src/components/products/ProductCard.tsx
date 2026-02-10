import type { Product } from '../../types/product';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const discountedPrice = product.price - (product.price * (product.discount / 100));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-100">
        <img 
          src={product.image_url || 'https://placehold.co/400x300?text=No+Image'} 
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
          {product.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-blue-600">₹{discountedPrice.toLocaleString()}</p>
            {product.discount > 0 && (
              <p className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}