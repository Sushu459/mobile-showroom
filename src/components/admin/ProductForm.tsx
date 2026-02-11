import { useState } from "react";
import { useForm } from "react-hook-form";
import { CATEGORIES } from "../../utils/constants";
import { productService } from "../../services/productService";
import { Upload, Loader2 } from "lucide-react";

interface FormInputs {
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  description: string;
}

export default function ProductForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const price = watch("price") || 0;
  const discount = watch("discount") || 0;
  const finalPrice = price - (price * discount) / 100;

  const onSubmit = async (data: FormInputs) => {
    try {
      setLoading(true);
      await productService.addProduct({
        ...data,
        image: image || undefined,
      });

      reset();
      setImage(null);
      setPreview(null);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Mobile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mobile Name
          </label>
          <input
            {...register("name", { required: "Mobile name is required" })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            {...register("brand", { required: "Brand is required" })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.brand && (
            <p className="text-red-500 text-xs mt-1">
              {errors.brand.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            type="number"
            defaultValue={0}
            {...register("discount", {
              min: { value: 0, message: "Discount cannot be negative" },
              max: { value: 100, message: "Max discount is 100%" },
            })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.discount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.discount.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("category", { required: true })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Description (New) */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description / Specs</label>
          <textarea 
            {...register('description')} 
            rows={3}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
            placeholder="e.g. 8GB RAM, 256GB Storage, 50MP Camera, Blue Color..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>

          <div className="mt-2 flex items-center gap-4">
            <label className="cursor-pointer flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition">
              <Upload className="h-4 w-4 mr-2" />
              Upload
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0] || null)
                }
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>
      </div>

      {/* Price Preview */}
      {price > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
          <p>
            Final Price after discount:{" "}
            <span className="font-semibold text-blue-700">
              ₹{finalPrice.toFixed(2)}
            </span>
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        {loading ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}

