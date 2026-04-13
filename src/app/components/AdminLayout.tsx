import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Calendar, Image, Package, FileText, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { AnalyticsListener } from "./AnalyticsListener";
import { supabase } from "../../lib/supabase";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("Admin");

  useEffect(() => {
    const getDisplayNameFromUser = (
      user: { email?: string | null; user_metadata?: Record<string, unknown> } | null
    ) => {
      if (!user) return "Admin";

      const metadata = user.user_metadata ?? {};
      const nameFromMetadata =
        (typeof metadata.full_name === "string" && metadata.full_name) ||
        (typeof metadata.name === "string" && metadata.name) ||
        (typeof metadata.display_name === "string" && metadata.display_name);

      if (nameFromMetadata) return nameFromMetadata;
      if (user.email) return user.email.split("@")[0];

      return "Admin";
    };

    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setDisplayName(getDisplayNameFromUser(data.user));
    };

    fetchCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setDisplayName(getDisplayNameFromUser(session?.user ?? null));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/admin/login");
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/bookings", label: "Bookings", icon: FileText },
    { path: "/admin/portfolio", label: "Portfolio", icon: Image },
    { path: "/admin/services", label: "Services", icon: Package },
    { path: "/admin/calendar", label: "Calendar", icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AnalyticsListener />
      {/* Header */}
      <header className="bg-black text-white border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/djqvmg7pb/image/upload/v1775561534/LOGO_1_cmx2wn.png"
                alt="3NStudioz Logo"
                className="w-full h-10 object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold">3NStudioz</span>
              <span className="block text-xs text-white/60">Admin Panel</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">Logged in as {displayName}</span>
            <Link
              to="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200">
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-black text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}