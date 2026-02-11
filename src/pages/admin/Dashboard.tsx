import { useEffect, useState } from "react";
import ProductForm from "../../components/admin/ProductForm";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import { Trash2 } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const data = await productService.getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await productService.deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Shop Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your products and inventory efficiently
          </p>
        </div>

        {/* Product Form */}
        <ProductForm onSuccess={fetchProducts} />

        {/* Product Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Product List
            </h2>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          product.image_url ||
                          "https://placehold.co/100"
                        }
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.brand}
                        </p>
                      </div>
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
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-400"
                  >
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
}
