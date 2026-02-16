import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { supabase } from "../../services/supabase"; 
import { Lock } from "lucide-react";
import { useTenant } from "../../context/TenantContext";
import "./AdminLogin.css"; // Import the CSS file

export default function AdminLogin() {
  const { tenant } = useTenant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dynamic Color
  const primaryColor = tenant?.primary_color || "#2563EB"; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await authService.login(email, password);

      if (!user) throw new Error("Login failed");

      const { data: userRel, error: relError } = await supabase
        .from('user_tenants') 
        .select('tenant_id')
        .eq('user_id', user.id)
        .single();

      if (relError || !userRel) {
        throw new Error("This user is not assigned to any shop.");
      }

      const userTenantId = userRel.tenant_id;
      const currentDomain = window.location.origin;

      if (currentDomain.includes("localhost")) {
        console.warn("⚠️ Localhost detected: Bypassing domain security check.");
      } else {
        const { data: domainTenant } = await supabase
          .from('tenants')
          .select('tenant_id, name')
          .eq('domain', currentDomain)
          .single();

        if (!domainTenant) {
          throw new Error("This domain is not registered in the system.");
        }

        if (userTenantId !== domainTenant.tenant_id) {
          await authService.logout(); 
          throw new Error(`You are not authorized to access ${domainTenant.name}.`);
        }
      }

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
    <div className="login-page">
      <div className="login-card">
        
        {/* Icon Header */}
        <div className="login-header">
          <div 
            className="icon-wrapper"
            style={{ backgroundColor: primaryColor }}
          >
            <Lock className="lock-icon" />
          </div>
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">
             Login to <span className="tenant-name">{tenant?.name || 'Dashboard'}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-box">
              <p className="error-text">{error}</p>
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              required
              placeholder="Email address"
              className="login-input"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="login-input"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}