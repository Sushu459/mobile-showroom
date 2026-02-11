import { Smartphone, Phone, Mail, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Mobile<span className="text-blue-600">Showroom</span>
              </span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Your trusted local mobile store offering genuine products,
              best prices, and reliable after-sales support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <Link to="/" className="block hover:text-blue-600 transition">
                Home
              </Link>
              <Link to="/" className="block hover:text-blue-600 transition">
                All Mobiles
              </Link>
              <Link to="/admin/login" className="block hover:text-blue-600 transition">
                Partner Login
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              Support
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>support@mobileshowroom.com</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Mon - Sat: 9:00 AM - 9:00 PM
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
                <span>Fast & Safe Delivery</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs">
                  Official warranty on all devices
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MobileShowroom. All rights reserved.
        </div>
      </div>

    </footer>
  );
}
