import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import {
  Smartphone,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Smooth scroll for contact
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
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="bg-blue-600 p-2 rounded-xl">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Mobile<span className="text-blue-600">Showroom</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isAdmin && (
              <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Home
                </Link>

                <button
                  onClick={handleContactClick}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Contact
                </button>
              </div>
            )}

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      location.pathname.includes("dashboard")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4 inline mr-2" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
                >
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && !isAdmin && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-6 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 font-medium"
            >
              Home
            </Link>

            <button
              onClick={handleContactClick}
              className="block text-gray-700 font-medium"
            >
              Contact
            </button>

            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block bg-gray-900 text-white text-center py-2 rounded-lg font-semibold"
            >
              Admin Login
            </Link>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
