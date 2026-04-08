import { useState, useEffect } from "react";
import { X, Play } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";

type Category = "all" | string;

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  url: string;
  uploadedAt: string;
}

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(["all"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("uploadedAt", { ascending: false });

      if (error) throw error;

      const items = (data as PortfolioItem[]) || [];
      setPortfolioItems(items);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
      setCategories(["all", ...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
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
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-neutral-900"
              onClick={() => setLightboxImage(item)}
            >
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
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
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No items found in this category</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <ImageWithFallback
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
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
