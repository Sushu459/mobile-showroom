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
import "./Navbar.css"; // Import the CSS file

export default function Navbar() {
  const { isAdmin } = useAuth();
  const { tenant } = useTenant(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Colors
  const primaryColor = tenant?.primary_color || ""; 
  const secondaryColor = tenant?.secondary_color || "";
  const mobileNumber = tenant?.mobile_number || "";

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

    if (!mobileNumber) {
      alert("Contact number not available");
      return;
    }

    window.location.href = `tel:${mobileNumber.replace(/\s+/g, "")}`;
  };

  return (
    <>
      <nav
        className={`navbar-root ${isScrolled ? "scrolled" : ""}`}
        style={{ 
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        <div className="navbar-container">
          <div className="navbar-content">

            {/* --- LOGO & BRANDING --- */}
            <Link
              to="/"
              className="brand-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* White Logo Box */}
              <div className="logo-box">
                <Store className="h-5 w-5" style={{ color: primaryColor }} />
              </div>

              {/* White Text */}
              <div className="brand-text-col">
                <span className="brand-title">
                  {tenant?.name || ""}
                </span>
                <span className="brand-subtitle">
                  Official Store
                </span>
              </div>
            </Link>

            {/* --- DESKTOP NAV --- */}
            {!isAdmin && (
              <div className="desktop-nav">
                <Link to="/" className="nav-link">
                  Home
                  <span className="nav-link-underline" />
                </Link>

                <button
                  onClick={handleContactClick}
                  className="contact-btn"
                  style={{ color: primaryColor }}
                >
                  <Phone className="w-4 h-4" />
                  Contact Us
                </button>
              </div>
            )}

            {/* --- ADMIN NAV --- */}
            <div className="auth-nav">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`dashboard-link ${
                      location.pathname.includes("dashboard") ? "active" : "inactive"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="partner-link">
                  Partner Login
                </Link>
              )}
            </div>

            {/* --- MOBILE TOGGLE --- */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-toggle-btn"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-nav-item mobile-link-main"
              >
                Home
              </Link>

              {!isAdmin && (
                <button
                  onClick={handleContactClick}
                  className="mobile-contact-btn"
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
                    className="mobile-nav-item mobile-link-main"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="mobile-nav-item mobile-logout">
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-partner"
                >
                  Partner Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="navbar-spacer" />
    </>
  );
}