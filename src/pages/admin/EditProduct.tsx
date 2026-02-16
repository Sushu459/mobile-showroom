import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import ProductForm from "../../components/admin/ProductForm";
import Loader from '../../components/common/Loader';
import "./EditProduct.css"; // Import the CSS file

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await productService.getProductById(id);

        if (data) {
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="edit-product-container">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="edit-product-container">
        Product not found
      </div>
    );
  }

  return (
    <div className="edit-product-container">

      <div className="edit-header">
        <h1 className="edit-title">
          Edit Product
        </h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="back-link"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="edit-form-wrapper">
        <ProductForm
          initialData={product}
          onSuccess={() => navigate("/admin/dashboard")}
        />
      </div>

    </div>
  );
}