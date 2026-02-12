import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { supabase } from "../../services/supabase"; 
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const currentDomain = window.location.origin; // e.g., http://localhost:5173

      // IF LOCALHOST: Skip the strict domain check to allow testing
      if (currentDomain.includes("localhost")) {
        console.warn("⚠️ Localhost detected: Bypassing domain security check.");
        // We allow the login because we can't check domain ownership locally
      } 
      // IF PRODUCTION: Strictly check if this domain belongs to the user
      else {
        const { data: domainTenant } = await supabase
          .from('tenants')
          .select('tenant_id, name')
          .eq('domain', currentDomain) // Ensure your DB has 'https://...'
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
      // Optional: Logout if we failed partway through to clear state
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
        
        {/* Icon */}
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Secure access for authorized users only</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-sm flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}