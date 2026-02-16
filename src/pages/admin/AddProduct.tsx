import ProductForm from "../../components/admin/ProductForm";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();

  return (
    <>
      {/* Using a React Fragment (<>) instead of a wrapper div 
         to remove the outer container entirely.
      */}
      <div className="page-header">
        <h1 className="page-title">Add Product</h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Removed the .form-wrapper div. 
         ProductForm will now render directly. 
      */}
      <ProductForm onSuccess={() => navigate("/admin/dashboard")} />
    </>
  );
}