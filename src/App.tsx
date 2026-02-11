import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";

function LayoutWrapper() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="grow">
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
      <AuthProvider>
        <LayoutWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
