import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";


import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import ManageProducts from "../pages/admin/ManageProducts";

import ProtectedRoute from "../components/common/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add" element={<AddProduct />} />
        <Route path="/admin/manage" element={<ManageProducts />} />
        <Route path="/admin/edit/:id" element={<EditProduct />} />
      </Route>
    </Routes>
  );
}
