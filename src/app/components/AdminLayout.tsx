import { Outlet, Link, useLocation } from "react-router";
import { Camera, LayoutDashboard, Calendar, Image, Package, FileText } from "lucide-react";

export function AdminLayout() {
  const location = useLocation();

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
      {/* Header */}
      <header className="bg-black text-white border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-bold">3NStudioz</span>
              <span className="block text-xs text-white/60">Admin Panel</span>
            </div>
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            View Site
          </Link>
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