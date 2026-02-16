import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TenantProvider } from './context/TenantContext';
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
import ThemeController from "./utils/ThemeController";

// 1. Import your new CSS file here
import "./App.css"; 

function LayoutWrapper() {
  const location = useLocation();

  return (
    // 2. Use the clean class name defined in App.css
    <div className="app-layout">
      <Navbar />
      
      {/* 3. Use the clean class name for the main area */}
      <main className="main-content">
        <AppRoutes />
      </main>

      {/* Hide footer on all admin pages */}
      {!location.pathname.startsWith("/admin") && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <ThemeController />
          <LayoutWrapper />
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;