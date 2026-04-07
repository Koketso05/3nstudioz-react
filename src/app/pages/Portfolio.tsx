import { useState } from "react";
import { X, Play } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Category = "all" | "weddings" | "events" | "portraits" | "corporate";

interface PortfolioItem {
  id: number;
  category: Category[];
  type: "image" | "video";
  src: string;
  thumbnail: string;
  title: string;
}

const portfolioItems: PortfolioItem[] = [
  // Weddings
  {
    id: 1,
    category: ["weddings"],
    type: "image",
    src: "https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=600",
    title: "Wedding Couple Portrait",
  },
  {
    id: 2,
    category: ["weddings"],
    type: "image",
    src: "https://images.unsplash.com/photo-1698082386199-fc60bc5b3e42?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1698082386199-fc60bc5b3e42?w=600",
    title: "Traditional Wedding",
  },
  {
    id: 3,
    category: ["weddings"],
    type: "image",
    src: "https://images.unsplash.com/photo-1613067532577-736f72dcbae3?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1613067532577-736f72dcbae3?w=600",
    title: "Wedding Kiss",
  },
  {
    id: 4,
    category: ["weddings"],
    type: "image",
    src: "https://images.unsplash.com/photo-1686294587476-89759f386382?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1686294587476-89759f386382?w=600",
    title: "Outdoor Wedding",
  },
  // Events
  {
    id: 5,
    category: ["events"],
    type: "image",
    src: "https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=600",
    title: "Concert Performance",
  },
  {
    id: 6,
    category: ["events"],
    type: "image",
    src: "https://images.unsplash.com/photo-1510114941-1dcfb5633651?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1510114941-1dcfb5633651?w=600",
    title: "DJ Event",
  },
  {
    id: 7,
    category: ["events"],
    type: "image",
    src: "https://images.unsplash.com/photo-1694720274936-298495c4dc8a?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1694720274936-298495c4dc8a?w=600",
    title: "Stage Performance",
  },
  {
    id: 8,
    category: ["events"],
    type: "image",
    src: "https://images.unsplash.com/photo-1612389930565-6975454dc7cc?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1612389930565-6975454dc7cc?w=600",
    title: "Night Concert",
  },
  // Portraits
  {
    id: 9,
    category: ["portraits"],
    type: "image",
    src: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?w=600",
    title: "Professional Portrait",
  },
  {
    id: 10,
    category: ["portraits"],
    type: "image",
    src: "https://images.unsplash.com/photo-1659303388076-de1535159d6c?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1659303388076-de1535159d6c?w=600",
    title: "Sports Portrait",
  },
  // Corporate
  {
    id: 11,
    category: ["corporate"],
    type: "image",
    src: "https://images.unsplash.com/photo-1603201667493-4c2696de0b1f?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1603201667493-4c2696de0b1f?w=600",
    title: "Corporate Office",
  },
  {
    id: 12,
    category: ["corporate"],
    type: "image",
    src: "https://images.unsplash.com/photo-1641260783083-a0af6cf964ca?w=1920",
    thumbnail: "https://images.unsplash.com/photo-1641260783083-a0af6cf964ca?w=600",
    title: "Executive Portrait",
  },
];

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);

  const categories = [
    { id: "all" as Category, label: "All" },
    { id: "weddings" as Category, label: "Weddings" },
    { id: "events" as Category, label: "Events" },
    { id: "portraits" as Category, label: "Portraits" },
    { id: "corporate" as Category, label: "Corporate" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category.includes(selectedCategory));

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
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 transition-all ${
                selectedCategory === category.id
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              {category.label}
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
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-white/60 text-sm capitalize">
                    {item.category.join(", ")}
                  </p>
                </div>
              </div>
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
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
              src={lightboxImage.src}
              alt={lightboxImage.title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <div className="text-center mt-6">
              <p className="text-white text-xl mb-2">{lightboxImage.title}</p>
              <p className="text-white/60 capitalize">
                {lightboxImage.category.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
