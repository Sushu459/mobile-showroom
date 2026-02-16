import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil } from "lucide-react";
import "./Dashboard.css"; // Import the CSS file

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Admin Dashboard
      </h1>

      <div className="dashboard-grid">

        {/* ADD PRODUCT */}
        <div
          onClick={() => navigate("/admin/add")}
          className="action-card"
        >
          <div className="icon-box green">
            <PlusCircle className="action-icon green" />
          </div>

          <h2 className="card-title">
            Add Product
          </h2>

          <p className="card-desc">
            Create and publish a new product in your shop.
          </p>
        </div>

        {/* UPDATE / MODIFY */}
        <div
          onClick={() => navigate("/admin/manage")}
          className="action-card"
        >
          <div className="icon-box blue">
            <Pencil className="action-icon blue" />
          </div>

          <h2 className="card-title">
            View / Modify Product
          </h2>

          <p className="card-desc">
            Edit and update existing product details.
          </p>
        </div>

        
    </div>
    </div>
  );
}