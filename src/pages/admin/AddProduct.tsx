import ProductForm from "../../components/admin/ProductForm"
import { useNavigate } from "react-router-dom";

export default function AddProduct() {

  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Add Product
        </h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm onSuccess={() => navigate("/admin/dashboard")} />
      </div>

    </div>
  );
}
