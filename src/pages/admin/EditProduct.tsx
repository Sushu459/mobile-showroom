import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { productService } from "../../services/productService";
import ProductForm from "../../components/admin/ProductForm";
import Loader from '../../components/common/Loader';

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Product
        </h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">

        <ProductForm
          initialData={product}
          onSuccess={() => navigate("/admin/dashboard")}
        />

      </div>

    </div>
  );
}
