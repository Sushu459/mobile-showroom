import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CATEGORIES } from "../../utils/constants";
import { productService } from "../../services/productService";
import { Loader2, X, Plus } from "lucide-react";
import type { Product } from "../../types/product";
import { useTenant } from "../../context/TenantContext"; // Import Tenant Context

interface FormInputs {
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  in_stock: boolean;
}

interface ProductFormProps {
  onSuccess: () => void | Promise<void>;
  initialData?: Product;
}

export default function ProductForm({ onSuccess, initialData }: ProductFormProps) {
  const { tenant, loading: tenantLoading } = useTenant(); // Get Tenant Context
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      in_stock: true,
      discount: 0
    }
  });

  // State for multiple images
  const [newImages, setNewImages] = useState<File[]>([]); // New files to upload
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs from DB

  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(initialData);

  // Watch values for calculations
  const price = watch("price") || 0;
  const discount = watch("discount") || 0;
  const inStock = watch("in_stock");
  
  const finalPrice = price - (price * discount) / 100;

  // Initialize Form Data
  useEffect(() => {
    if (!initialData) return;

    reset({
      name: initialData.name,
      brand: initialData.brand,
      price: initialData.price,
      discount: initialData.discount,
      category: initialData.category,
      description: initialData.description,
      in_stock: initialData.in_stock !== undefined ? initialData.in_stock : true,
    });

    // Handle Image Migration (Array vs Single String)
    if (initialData.image_urls && initialData.image_urls.length > 0) {
      setExistingImages(initialData.image_urls);
    } else if ((initialData as any).image_url) {
      setExistingImages([(initialData as any).image_url]);
    }
    
    setNewImages([]);
  }, [initialData, reset]);

  const onSubmit = async (data: FormInputs) => {
    if (!tenant) {
      alert("Error: No shop context found. Cannot add product.");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare payload matching the Service logic
      const payload = {
        ...data,
        images: newImages,              // Array of new Files
        existingImages: existingImages, // Array of kept URLs
        in_stock: data.in_stock,
      };

      if (isEditMode && initialData) {
        // Update: ID + Payload
        await productService.updateProduct(initialData.id, payload);
      } else {
        // Create: Payload + TenantID
        await productService.addProduct(payload, tenant.tenant_id);
      }

      // Cleanup
      reset();
      setNewImages([]);
      setExistingImages([]);
      
      // Trigger refresh in parent
      await onSuccess();
      
    } catch (error) {
      console.error(error);
      alert(isEditMode ? "Failed to update product" : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Guard Clauses ---
  if (tenantLoading) return <div className="p-8 text-center text-gray-500">Loading shop settings...</div>;
  if (!tenant) return <div className="p-8 text-center text-red-500 font-bold">Error: Store context missing.</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? "Edit Product" : "Add New Mobile"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Name</label>
          <input
            {...register("name", { required: "Mobile name is required" })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            {...register("brand", { required: "Brand is required" })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            {...register("discount", {
              min: { value: 0, message: "Discount cannot be negative" },
              max: { value: 100, message: "Max discount is 100%" },
            })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          />
          {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register("category", { required: true })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description / Specs</label>
          <textarea 
            {...register('description')} 
            rows={3}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
            placeholder="e.g. 8GB RAM, 256GB Storage, 50MP Camera, Blue Color..."
          />
        </div>

        {/* --- MULTIPLE IMAGE UPLOAD --- */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Gallery (Select multiple images)
          </label>

          <div className="flex flex-wrap gap-4">
            {/* Upload Button */}
            <label className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all group">
              <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 mt-2">Add Images</span>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>

            {/* 1. Existing Images */}
            {existingImages.map((url, idx) => (
              <div key={`exist-${idx}`} className="relative w-28 h-28 group">
                <img
                  src={url}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-md border border-gray-100 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Saved
                </span>
              </div>
            ))}

            {/* 2. New Images */}
            {newImages.map((file, idx) => (
              <div key={`new-${idx}`} className="relative w-28 h-28 group animate-in fade-in zoom-in-95 duration-200">
                <img
                  src={URL.createObjectURL(file)}
                  alt="New Preview"
                  className="w-full h-full object-cover rounded-xl border-2 border-blue-500 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition scale-90 group-hover:scale-100"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                  New
                </span>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Tip: You can select multiple files at once. Click the 'X' to remove an image.
          </p>
        </div>

        {/* --- STOCK TOGGLE --- */}
        <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Availability Status</h3>
            <p className="text-xs text-gray-500 mt-1">
              {inStock 
                ? "Active: Product is visible to customers on the home page." 
                : "Hidden: Product is marked 'Out of Stock' and hidden from home page."}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setValue("in_stock", !inStock, { shouldDirty: true })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              inStock ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                inStock ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
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
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        {loading
          ? isEditMode
            ? "Updating Product..."
            : "Adding Product..."
          : isEditMode
            ? "Update Product"
            : "Add Product"}
      </button>
    </form>
  );
}