import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold text-gray-900 mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ADD PRODUCT */}
        <div
          onClick={() => navigate("/admin/add")}
          className="group cursor-pointer rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-green-100 mb-6">
            <PlusCircle className="text-green-600 h-7 w-7" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Add Product
          </h2>

          <p className="text-sm text-gray-600">
            Create and publish a new product in your shop.
          </p>
        </div>

        {/* UPDATE / MODIFY */}
        <div
          onClick={() => navigate("/admin/manage")}
          className="group cursor-pointer rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 mb-6">
            <Pencil className="text-blue-600 h-7 w-7" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Update / Modify Product
          </h2>

          <p className="text-sm text-gray-600">
            Edit and update existing product details.
          </p>
        </div>

        {/* DELETE */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="group cursor-pointer rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-red-100 mb-6">
            <Trash2 className="text-red-600 h-7 w-7" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Product
          </h2>

          <p className="text-sm text-gray-600">
            Remove products permanently from your store.
          </p>
        </div>

      </div>
    </div>
  );
}
