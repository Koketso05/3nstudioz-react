import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/admin/login", { replace: true });
          return;
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check error:', err);
        navigate("/admin/login", { replace: true });
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate("/admin/login", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
