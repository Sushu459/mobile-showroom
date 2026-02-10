import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../../utils/constants';
import { productService } from '../../services/productService';
import { Upload } from 'lucide-react';

interface FormInputs {
  name: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
}

export default function ProductForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, reset, formState: { } } = useForm<FormInputs>();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    try {
      setLoading(true);
      await productService.addProduct({ ...data, image: image || undefined });
      reset();
      setImage(null);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Mobile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Name</label>
          <input {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input {...register('brand', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input type="number" {...register('price', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input type="number" {...register('discount')} defaultValue={0} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select {...register('category')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Upload
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </label>
            <span className="ml-3 text-sm text-gray-500">{image?.name || 'No file chosen'}</span>
          </div>
        </div>
      </div>
      <button disabled={loading} type="submit" className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}