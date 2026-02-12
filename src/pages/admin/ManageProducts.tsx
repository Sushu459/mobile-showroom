import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useTenant } from "../../context/TenantContext"; // Import Tenant Context

export default function ManageProducts() {
  const navigate = useNavigate();
  const { tenant, loading: tenantLoading } = useTenant(); // Get Current Shop
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; 

  useEffect(() => {
    if (tenant) {
      loadProducts();
    }
  }, [tenant]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadProducts = async () => {
    if (!tenant) return;

    try {
      setLoading(true);
      // Pass tenant_id to fetch ONLY this shop's products
      const data = await productService.getAllProducts(tenant.tenant_id);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!tenant) return;

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      // Pass tenant_id to ensure we don't accidentally delete another shop's item
      await productService.deleteProduct(id, tenant.tenant_id);
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  // Filter Logic
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (tenantLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
      return <div className="text-center p-10 text-red-500">Error: Shop context not found.</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Products
          </h1>
          <p className="text-gray-600 text-lg">
            View, edit, and manage inventory for <span className="font-semibold text-blue-600">{tenant.name}</span>
          </p>
        </div>

        {/* Search and Add Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => navigate("/admin/add")}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <p className="text-gray-600 text-lg mb-2 font-medium">
              No products found
            </p>
            <p className="text-gray-500 mb-6">
              Start by adding your first mobile product to your store
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-600 border-0">
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.length > 0 ? (
                    currentItems.map((product, index) => {
                        // Determine the thumbnail image
                        const thumbnail = (product.image_urls && product.image_urls.length > 0) 
                            ? product.image_urls[0] 
                            : (product as any).image_url || 'https://placehold.co/100';

                        return (
                          <tr
                            key={product.id}
                            className={`transition duration-200 hover:bg-blue-50 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={thumbnail}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                />
                                <span className="text-sm font-semibold text-gray-900">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600 font-medium">
                                {product.brand}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.discount > 0 && (
                                  <span className="text-xs text-green-600 font-medium">
                                      {product.discount}% Off
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                                {product.in_stock ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        <Eye className="w-3 h-3" /> Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                        <EyeOff className="w-3 h-3" /> Hidden
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/admin/edit/${product.id}`)}
                                  className="inline-flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg text-sm"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="inline-flex items-center gap-1 px-3 py-2 bg-red-400 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg text-sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No products found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {filteredProducts.length > 0 && (
              <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-700">
                  Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(indexOfLastItem, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-semibold text-gray-900">{filteredProducts.length}</span> results
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}