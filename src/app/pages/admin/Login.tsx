import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const defaultAdminEmail = "admin@3nstudioz.com";
  const defaultAdminPassword = "3nstudioz@2026";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simple authentication (replace with proper backend auth in production)
      if (email === defaultAdminEmail && password === defaultAdminPassword) {
        // Store auth token in localStorage
        localStorage.setItem("adminAuth", JSON.stringify({
          email,
          token: btoa(`${email}:${password}`),
          loginTime: new Date().toISOString(),
        }));
        navigate("/admin/bookings");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-neutral-200 p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-black" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-neutral-600 text-center mb-8">3NStudioz Booking Management</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@3nstudioz.com"
                required
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-neutral-600 text-center mt-6">
            Demo credentials: admin@3nstudioz.com / 3nstudioz@2026
          </p>
        </div>
      </div>
    </div>
  );
}
