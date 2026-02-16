import { Phone, ShieldCheck, Truck, Store, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTenant } from "../../context/TenantContext";
import "./Footer.css"; // Import the CSS file

export default function Footer() {
  const { tenant } = useTenant();

  // Fallbacks
  const storeName    = tenant?.name         || "Mobile Showroom";
  const mobileNumber = tenant?.mobile_number || "+91 98765 43210";
  const primaryColor = tenant?.primary_color || "#2563EB"; // blue-600

  return (
    <footer className="footer-root">
      {/* Main content */}
      <div className="footer-content">
        <div className="footer-grid">

          {/* Column 1 – Brand & short description */}
          <div className="brand-column">
            <div className="brand-header">
              <div
                className="store-icon-box"
                style={{ backgroundColor: primaryColor }}
              >
                <Store className="h-6 w-6" />
              </div>
              <span className="store-name">
                {storeName}
              </span>
            </div>

            <p className="brand-desc">
              Your trusted local destination for genuine smartphones, 
              unbeatable prices, fast delivery, and expert after-sales support.
            </p>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="column-title">
              Quick Links
            </h4>
            <ul className="footer-list link-list">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="footer-link">
                  All Mobiles
                </Link>
              </li>
              <li>
                <Link to="/" className="footer-link">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/" className="footer-link">
                  Offers & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Support / Contact */}
          <div>
            <h4 className="column-title">
              Contact Us
            </h4>
            <ul className="footer-list info-list">
              <li className="contact-item">
                <Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                <a 
                  href={`tel:${mobileNumber.replace(/\s+/g, '')}`}
                  className="contact-link"
                >
                  {mobileNumber}
                </a>
              </li>
              <li className="contact-item" style={{ color: '#9ca3af' }}>
                <Clock className="h-5 w-5" style={{ color: primaryColor }} />
                <span>Mon–Sat: 10:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4 – Trust & Why Choose Us */}
          <div>
            <h4 className="column-title">
              Why Choose Us
            </h4>
            <ul className="footer-list info-list">
              <li className="trust-item">
                <ShieldCheck className="h-5 w-5 icon-emerald" />
                <span>100% Genuine & Brand New</span>
              </li>
              <li className="trust-item">
                <Truck className="h-5 w-5 icon-emerald" />
                <span>Fast Same-Day Delivery</span>
              </li>
              <li className="trust-item">
                <div className="icon-circle">
                  <span className="checkmark">✓</span>
                </div>
                <span>Official Warranty</span>
              </li>
              <li className="trust-item">
                <div className="icon-circle">
                  <span className="checkmark">★</span>
                </div>
                <span>Expert Support</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="bottom-bar">
        <div className="bottom-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} <span className="store-highlight">{storeName}</span>.
            All rights reserved.
          </p>

          <div className="policy-links">
            <Link to="" className="policy-link">
              Privacy Policy
            </Link>
            <Link to="" className="policy-link">
              Terms of Service
            </Link>
            <Link to="" className="policy-link">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}