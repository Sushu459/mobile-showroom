import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid credentials");
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

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Admin Portal
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Secure access for authorized users only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-sm hover:shadow-md"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}
