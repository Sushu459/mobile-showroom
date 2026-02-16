import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CATEGORIES } from "../../utils/constants";
import { productService } from "../../services/productService";
import { Loader2, X, Plus, UploadCloud } from "lucide-react";
import type { Product } from "../../types/product";
import { useTenant } from "../../context/TenantContext";
import "./ProductForm.css";

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
  const { tenant, loading: tenantLoading } = useTenant();
  const [isDragging, setIsDragging] = useState(false);
  
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

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(initialData);

  const price = watch("price") || 0;
  const discount = watch("discount") || 0;
  const inStock = watch("in_stock");
  const finalPrice = price - (price * discount) / 100;

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

    if (initialData.image_urls && initialData.image_urls.length > 0) {
      setExistingImages(initialData.image_urls);
    } else if ((initialData as any).image_url) {
      setExistingImages([(initialData as any).image_url]);
    }
    setNewImages([]);
  }, [initialData, reset]);

  // --- Image Processing Logic ---
  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      const validImages = filesArray.filter(file => file.type.startsWith('image/'));
      setNewImages((prev) => [...prev, ...validImages]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormInputs) => {
    if (!tenant) return alert("Error: No shop context found.");

    try {
      setLoading(true);
      const payload = {
        ...data,
        images: newImages,
        existingImages: existingImages,
        in_stock: data.in_stock,
      };

      if (isEditMode && initialData) {
        await productService.updateProduct(initialData.id, payload);
      } else {
        await productService.addProduct(payload, tenant.tenant_id);
      }

      reset();
      setNewImages([]);
      setExistingImages([]);
      await onSuccess();
    } catch (error) {
      console.error(error);
      alert(isEditMode ? "Failed to update product" : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (tenantLoading) return <div className="p-8 text-center text-gray-500">Loading shop settings...</div>;
  if (!tenant) return <div className="p-8 text-center text-red-500 font-bold">Error: Store context missing.</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h2 className="form-title">
        {isEditMode ? "Edit Product" : "Add New Mobile"}
      </h2>

      <div className="form-grid">
        <div>
          <label className="form-label">Mobile Name</label>
          <input
            {...register("name", { required: "Mobile name is required" })}
            className="form-input"
          />
          {errors.name && <p className="error-msg">{errors.name.message}</p>}
        </div>

        <div>
          <label className="form-label">Brand</label>
          <input
            {...register("brand", { required: "Brand is required" })}
            className="form-input"
          />
          {errors.brand && <p className="error-msg">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className="form-input"
          />
          {errors.price && <p className="error-msg">{errors.price.message}</p>}
        </div>

        <div>
          <label className="form-label">Discount (%)</label>
          <input
            type="number"
            {...register("discount", {
              min: { value: 0, message: "No negative discount" },
              max: { value: 100, message: "Max 100%" },
            })}
            className="form-input"
          />
          {errors.discount && <p className="error-msg">{errors.discount.message}</p>}
        </div>

        <div>
          <label className="form-label">Category</label>
          <select {...register("category", { required: true })} className="form-select">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="full-width">
          <label className="form-label">Description / Specs</label>
          <textarea 
            {...register('description')} 
            rows={3}
            className="form-textarea"
            placeholder="e.g. 8GB RAM, 256GB Storage..."
          />
        </div>

        {/* --- Image Gallery Section --- */}
        <div className="full-width">
          <label className="form-label" style={{ marginBottom: '0.75rem' }}>
            Product Gallery
          </label>

          <div className="gallery-container">
            <label 
              className={`upload-box group ${isDragging ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon-wrapper">
                {isDragging ? (
                   <UploadCloud className="h-6 w-6 text-blue-500 animate-bounce" />
                ) : (
                   <Plus className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-400 mt-2">
                {isDragging ? "Drop to Upload" : "Add or Drag Images"}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>

            {/* Render Previews */}
            {existingImages.map((url, idx) => (
              <div key={`exist-${idx}`} className="image-preview group">
                <img src={url} alt="Existing" className="preview-img" />
                <button type="button" onClick={() => removeExistingImage(idx)} className="remove-btn group-hover:opacity-100">
                  <X size={14} />
                </button>
                <span className="badge badge-saved">Saved</span>
              </div>
            ))}

            {newImages.map((file, idx) => (
              <div key={`new-${idx}`} className="image-preview group">
                <img src={URL.createObjectURL(file)} alt="New" className="preview-img border-blue-500" />
                <button type="button" onClick={() => removeNewImage(idx)} className="remove-btn group-hover:opacity-100">
                  <X size={14} />
                </button>
                <span className="badge badge-new">New</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Stock Toggle --- */}
        <div className="full-width stock-panel">
          <div>
            <h3 className="text-sm font-bold">Availability Status</h3>
            <p className="text-xs text-gray-500 mt-1">
              {inStock ? "Active: Visible on home page." : "Hidden: Marked Out of Stock."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setValue("in_stock", !inStock, { shouldDirty: true })}
            className={`toggle-switch ${inStock ? 'active' : 'inactive'}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {price > 0 && (
        <div className="price-preview">
          Final Price: <span className="font-semibold text-blue-500">₹{finalPrice.toFixed(2)}</span>
        </div>
      )}

      <button disabled={loading} type="submit" className="submit-btn">
        {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
        {loading ? "Processing..." : (isEditMode ? "Update Product" : "Add Product")}
      </button>
    </form>
  );
}