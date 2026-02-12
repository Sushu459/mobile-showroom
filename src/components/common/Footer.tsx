import { Phone, Mail, ShieldCheck, Truck, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useTenant } from "../../context/TenantContext"; // <--- Import Context

export default function Footer() {
  const { tenant } = useTenant(); // <--- Get Dynamic Data

  // Fallbacks if data is missing
  const storeName = tenant?.name || "Mobile Showroom";
  const mobileNumber = tenant?.mobile_number || "+91 98765 43210";
  const primaryColor = tenant?.primary_color || "#2563EB"; // Default Blue

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="p-2 rounded-lg text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <Store className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                {storeName}
              </span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Your trusted local mobile store offering genuine products,
              best prices, and reliable after-sales support in your city.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <Link to="/" className="block hover:text-gray-900 transition hover:underline">
                Home
              </Link>
              <Link to="/" className="block hover:text-gray-900 transition hover:underline">
                All Mobiles
              </Link>
              <Link to="/admin/login" className="block hover:text-gray-900 transition hover:underline">
                Partner Login
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                <a href={`tel:${mobileNumber}`} className="hover:text-gray-900 transition">
                  {mobileNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                <span>support@{storeName.toLowerCase().replace(/\s+/g, '')}.com</span>
              </div>
              <p className="text-gray-500 text-xs mt-2 pl-6">
                Mon - Sat: 10:00 AM - 9:00 PM
              </p>
            </div>
          </div>

          {/* Trust Signals */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Why Choose Us
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>100% Genuine Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Fast Local Delivery</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                  Official Warranty Available
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} <span className="font-bold text-gray-700">{storeName}</span>. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}