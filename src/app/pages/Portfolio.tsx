import { useState, useEffect } from "react";
import { X, Play } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  url: string;
  uploaded_at: string;
}

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.replace("www.", "");

      if (host === "youtu.be") {
        return parsedUrl.pathname.split("/").find(Boolean) ?? null;
      }

      if (host === "youtube.com" || host === "m.youtube.com") {
        const watchId = parsedUrl.searchParams.get("v");
        if (watchId) return watchId;

        const parts = parsedUrl.pathname.split("/").filter(Boolean);
        if (parts[0] === "shorts" || parts[0] === "embed") {
          return parts[1] ?? null;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  };

  const getYouTubeThumbnailUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  const fetchPortfolioItems = async () => {
    try {
      setErrorMessage(null);
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      const items = (data as PortfolioItem[]) || [];
      setPortfolioItems(items);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
      setCategories(["all", ...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      setErrorMessage("Could not load portfolio items. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl mb-4">Portfolio</h1>
            <p className="text-white/60 text-lg">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl mb-4">Portfolio</h1>
          <p className="text-white/60 text-lg">
            Explore our collection of memorable moments
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 transition-all capitalize ${
                selectedCategory === category
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-neutral-900"
              onClick={() => setLightboxImage(item)}
              aria-label={`Open ${item.title}`}
            >
              {item.type === "video" ? (
                (() => {
                  const youTubeThumbnailUrl = getYouTubeThumbnailUrl(item.url);

                  if (youTubeThumbnailUrl) {
                    return (
                      <ImageWithFallback
                        src={youTubeThumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    );
                  }

                  return (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  );
                })()
              ) : (
                <ImageWithFallback
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-white/60 text-sm capitalize">
                    {item.category}
                  </p>
                </div>
                {item.type === "video" && (
                  <Play className="absolute top-4 right-4 w-8 h-8 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="text-center py-8">
            <p className="text-red-400 text-lg">{errorMessage}</p>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No items found in this category</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={() => setLightboxImage(null)}
            className="absolute inset-0"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-6xl w-full relative z-10">
            {lightboxImage.type === "video" ? (
              (() => {
                const youTubeEmbedUrl = getYouTubeEmbedUrl(lightboxImage.url);

                if (youTubeEmbedUrl) {
                  return (
                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                      <iframe
                        src={youTubeEmbedUrl}
                        title={lightboxImage.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  );
                }

                return (
                  <video
                    src={lightboxImage.url}
                    className="w-full h-auto max-h-[90vh] object-contain"
                    controls
                    autoPlay
                    playsInline
                    aria-label={lightboxImage.title}
                  >
                    <track kind="captions" srcLang="en" label="English captions" />
                  </video>
                );
              })()
            ) : (
              <ImageWithFallback
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
            <div className="text-center mt-6">
              <p className="text-white text-xl mb-2">{lightboxImage.title}</p>
              <p className="text-white/60 capitalize">
                {lightboxImage.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
