import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Seo } from "../../lib/seo";

export function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Seo />
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold mb-4 text-yellow-400">404</h1>
        <h2 className="text-4xl mb-4">Page Not Found</h2>
        <p className="text-white/60 text-lg mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
