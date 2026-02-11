interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  image?: string;
}

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Product List
        </h2>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition">
              
              <td className="px-6 py-4 flex items-center gap-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.brand}
                  </p>
                </div>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {product.category}
              </td>

              <td className="px-6 py-4 font-medium text-gray-800">
                ₹{product.price}
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
