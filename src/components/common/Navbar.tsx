import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { useTenant } from "../../context/TenantContext"; 
import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Phone,
  Store
} from "lucide-react";

export default function Navbar() {
  const { isAdmin } = useAuth();
  const { tenant } = useTenant(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Colors
  const primaryColor = tenant?.primary_color || "#2563EB"; 
  const secondaryColor = tenant?.secondary_color || "#1E40AF";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("contact");
        section?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const section = document.getElementById("contact");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "shadow-lg backdrop-blur-sm" 
            : ""
        }`}
        style={{ 
          // Apply Tenant Theme Gradient to the ENTIRE Navbar
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* --- LOGO & BRANDING --- */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* White Logo Box to Pop against Color */}
              <div 
                className="p-2.5 rounded-xl bg-white shadow-md transition-transform group-hover:scale-105 duration-300"
              >
                <Store className="h-5 w-5" style={{ color: primaryColor }} />
              </div>

              {/* White Text for Contrast */}
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight leading-none text-white">
                  {tenant?.name || "MobileShowroom"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  Official Store
                </span>
              </div>
            </Link>

            {/* --- DESKTOP NAV --- */}
            {!isAdmin && (
              <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <Link
                  to="/"
                  className="text-white/90 hover:text-white transition-colors relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
                </Link>

                {/* White Button with Colored Text */}
                <button
                  onClick={handleContactClick}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  style={{ color: primaryColor }}
                >
                  <Phone className="w-4 h-4" />
                  Contact Us
                </button>
              </div>
            )}

            {/* --- ADMIN NAV --- */}
            <div className="hidden md:flex items-center space-x-4">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                      location.pathname.includes("dashboard")
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="text-sm font-medium text-white/80 hover:text-white transition"
                >
                  Partner Login
                </Link>
              )}
            </div>

            {/* --- MOBILE TOGGLE --- */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full animate-in slide-in-from-top-5">
            <div className="px-6 py-6 space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 font-medium text-lg"
              >
                Home
              </Link>

              {!isAdmin && (
                <button
                  onClick={handleContactClick}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold shadow-md active:scale-95 transition-transform"
                  style={{ 
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
                  }}
                >
                  <Phone className="w-5 h-5" />
                  Contact Shop
                </button>
              )}

              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-sm text-gray-400 mt-4 pt-4 border-t border-gray-100"
                >
                  Partner Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
}