import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { supabase } from "../../services/supabase"; 
import { Lock } from "lucide-react";
import { useTenant } from "../../context/TenantContext"; // 1. Import Tenant Context

export default function AdminLogin() {
  const { tenant } = useTenant(); // 2. Get Tenant Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 3. Define Dynamic Color (Fallback to Blue if loading/missing)
  const primaryColor = tenant?.primary_color || "#2563EB"; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Perform standard Login
      const { user } = await authService.login(email, password);

      if (!user) throw new Error("Login failed");

      // ---------------------------------------------------------
      // FIX: Fetch the User's Tenant ID manually
      // ---------------------------------------------------------
      const { data: userRel, error: relError } = await supabase
        .from('user_tenants') 
        .select('tenant_id')
        .eq('user_id', user.id)
        .single();

      if (relError || !userRel) {
        throw new Error("This user is not assigned to any shop.");
      }

      const userTenantId = userRel.tenant_id;

      // ---------------------------------------------------------
      // 2. Domain Security Check (With Localhost Support)
      // ---------------------------------------------------------
      const currentDomain = window.location.origin;

      // IF LOCALHOST: Skip the strict domain check to allow testing
      if (currentDomain.includes("localhost")) {
        console.warn("⚠️ Localhost detected: Bypassing domain security check.");
      } 
      // IF PRODUCTION: Strictly check if this domain belongs to the user
      else {
        const { data: domainTenant } = await supabase
          .from('tenants')
          .select('tenant_id, name')
          .eq('domain', currentDomain)
          .single();

        if (!domainTenant) {
          throw new Error("This domain is not registered in the system.");
        }

        // STRICT CHECK: Does User's Tenant ID match this Domain's Tenant ID?
        if (userTenantId !== domainTenant.tenant_id) {
          await authService.logout(); 
          throw new Error(`You are not authorized to access ${domainTenant.name}.`);
        }
      }

      // 3. Success
      navigate("/admin/dashboard");

    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid credentials");
      if (err.message !== "Invalid credentials") {
          await authService.logout();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 space-y-6">
        
        {/* Icon Header */}
        <div className="flex flex-col items-center">
          <div 
            className="h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-colors duration-300"
            style={{ backgroundColor: primaryColor }} // Dynamic Background
          >
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-sm text-gray-500 mt-1">
             Login to <span className="font-semibold">{tenant?.name || 'Dashboard'}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties} // Dynamic Focus Ring
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties} // Dynamic Focus Ring
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-xl transition shadow-sm flex justify-center items-center hover:opacity-90 hover:shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: primaryColor }} // Dynamic Background
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}