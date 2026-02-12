import { Phone,  ShieldCheck, Truck, Store, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTenant } from "../../context/TenantContext";

export default function Footer() {
  const { tenant } = useTenant();

  // Fallbacks
  const storeName    = tenant?.name         || "Mobile Showroom";
  const mobileNumber = tenant?.mobile_number || "+91 98765 43210";
  // const email        = tenant?.email        || `support@${storeName.toLowerCase().replace(/\s+/g, '')}.com`;
  const primaryColor = tenant?.primary_color || "#2563EB"; // blue-600
  // const address      = tenant?.address      || "Your City, Telangana";

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Column 1 – Brand & short description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl text-white shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                <Store className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {storeName}
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm">
              Your trusted local destination for genuine smartphones, 
              unbeatable prices, fast delivery, and expert after-sales support.
            </p>

            {/* <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
              <span>{address}</span>
            </div> */}
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  All Mobiles
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Offers & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Support / Contact */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                <a 
                  href={`tel:${mobileNumber.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {mobileNumber}
                </a>
              </li>
              {/* <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                <a 
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {email}
                </a>
              </li> */}
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="h-5 w-5" style={{ color: primaryColor }} />
                <span>Mon–Sat: 10:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4 – Trust & Why Choose Us */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 uppercase tracking-wide">
              Why Choose Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>100% Genuine & Brand New Products</span>
              </li>
              <li className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Fast Same-Day Local Delivery</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-500">✓</span>
                </div>
                <span>Official Manufacturer Warranty</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-500">★</span>
                </div>
                <span>Expert Guidance & After-Sales Support</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 text-center md:flex md:items-center md:justify-between text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} <span className="text-gray-300 font-medium">{storeName}</span>.
            All rights reserved.
          </p>

          <div className="mt-3 md:mt-0 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="" className="hover:text-gray-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}