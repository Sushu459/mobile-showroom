import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../hooks/useAuth"; 
import "./ManageProducts.css"; 

export default function ManageProducts() {
  const navigate = useNavigate();
  const { tenant, loading: tenantLoading } = useTenant();
  const {} = useAuth(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; 

  // Reload when tenant or user changes
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
    const currentTenantId = tenant?.tenant_id;
    if (!currentTenantId) return;

    try {
      setLoading(true);
      const data = await productService.getAllProducts(currentTenantId);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const currentTenantId = tenant?.tenant_id;
    if (!currentTenantId) return;

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productService.deleteProduct(id, currentTenantId);
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
      <div className="loader-wrapper">
        <div className="loader-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
      return <div className="text-center p-10 text-red-500">Error: Shop context not found. Please log in.</div>;
  }

  const shopName = tenant?.name || "Your Shop";

  return (
    <div className="manage-page">
      <div className="manage-container">
        
        {/* Header */}
        <div className="manage-header">
          <h1 className="page-title">
            Manage Products
          </h1>
          <p className="page-subtitle">
            View, edit, and manage inventory for <span className="shop-highlight">{shopName}</span>
          </p>
        </div>

        {/* Search and Add Toolbar */}
        <div className="toolbar">
          <div className="search-box-wrapper">
            <div className="search-icon-wrapper">
              <Search className="search-icon" />
            </div>
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => navigate("/admin/add")}
            className="add-btn"
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
          <div className="empty-state">
            <p className="empty-title">
              No products found
            </p>
            <p className="empty-subtitle">
              Start by adding your first product to {shopName}
            </p>
          </div>
        ) : (
          <div className="table-card">
            {/* Table Wrapper */}
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr className="table-head-row">
                    <th className="table-th">Product Name</th>
                    <th className="table-th">Brand</th>
                    <th className="table-th">Price</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Category</th>
                    <th className="table-th">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-tbody">
                  {currentItems.length > 0 ? (
                    currentItems.map((product, index) => {
                        const thumbnail = (product.image_urls && product.image_urls.length > 0) 
                            ? product.image_urls[0] 
                            : (product as any).image_url || 'https://placehold.co/100';

                        return (
                          <tr
                            key={product.id}
                            className={`table-tr ${index % 2 === 0 ? "even" : "odd"}`}
                          >
                            <td className="table-td">
                              <div className="product-cell">
                                <img
                                  src={thumbnail}
                                  alt={product.name}
                                  className="product-thumb"
                                />
                                <span className="product-name-text">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="table-td">
                              <span className="brand-text">
                                {product.brand}
                              </span>
                            </td>
                            <td className="table-td">
                              <div className="price-col">
                                <span className="price-main">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.discount > 0 && (
                                  <span className="discount-sub">
                                      {product.discount}% Off
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="table-td">
                                {product.in_stock ? (
                                    <span className="status-badge status-active">
                                        <Eye className="w-3 h-3" /> Active
                                    </span>
                                ) : (
                                    <span className="status-badge status-hidden">
                                        <EyeOff className="w-3 h-3" /> Hidden
                                    </span>
                                )}
                            </td>
                            <td className="table-td">
                              <span className="category-badge">
                                {product.category}
                              </span>
                            </td>
                            <td className="table-td">
                              <div className="actions-cell">
                                <button
                                  onClick={() => {
                                      // 1. Create a URL-safe slug from the brand
                                      const brandSlug = (product.brand || "product")
                                          .toLowerCase()
                                          .replace(/[^a-z0-9]+/g, '-') // Replace special chars with -
                                          .replace(/(^-|-$)+/g, '');   // Trim -
                                      
                                      // 2. Navigate to /admin/edit/brand-slug/product-id
                                      navigate(`/admin/edit/${brandSlug}/${product.id}`);
                                  }}
                                  className="action-btn btn-edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="action-btn btn-delete"
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
                      <td colSpan={6} className="table-td text-center text-gray-500">
                        No products found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {filteredProducts.length > 0 && (
              <div className="pagination-footer">
                <span className="pagination-info">
                  Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(indexOfLastItem, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-semibold text-gray-900">{filteredProducts.length}</span> results
                </span>

                <div className="pagination-controls">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-arrow-btn"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`page-num-btn ${currentPage === i + 1 ? "active" : "inactive"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-arrow-btn"
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