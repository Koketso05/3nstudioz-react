import { Outlet, Link, useLocation } from "react-router";
import { Camera, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnalyticsListener } from "./AnalyticsListener";
import { MarketingModal } from "./MarketingModal";
import { WhatsAppSticky } from "./WhatsAppSticky";
import { Seo } from "../../lib/seo";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/services", label: "Services" },
    { path: "/booking", label: "Book Now" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const adminLink = { path: "/admin/login", label: "Admin Login" };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AnalyticsListener />
      <Seo />
      <MarketingModal />
      <WhatsAppSticky />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/djqvmg7pb/image/upload/v1775561534/LOGO_1_cmx2wn.png"
                  alt="3NStudioz Logo"
                  className="w-full h-10 object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">3NStudioz</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? "text-yellow-400"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Admin Login Link */}
              <Link
                to={adminLink.path}
                className="ml-8 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
              >
                {adminLink.label}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 transition-colors ${
                    isActive(link.path)
                      ? "text-yellow-400"
                      : "text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Admin Login Link */}
              <Link
                to={adminLink.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 bg-yellow-400 text-black rounded-lg font-medium"
              >
                {adminLink.label}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/djqvmg7pb/image/upload/v1775561534/LOGO_1_cmx2wn.png"
                    alt="3NStudioz Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold">3NStudioz</span>
              </div>
              <p className="text-white/60 text-sm">
                Capturing Moments That Last Forever
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/terms-and-conditions"
                  className="block text-white/60 hover:text-white text-sm transition-colors"
                >
                  Terms and Conditions
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>Email: 3nstudioz@gmail.com</p>
                <p>Phone: +27 76 123 2491</p>
                <p>WhatsApp: +27 76 123 2491</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} 3NStudioz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
