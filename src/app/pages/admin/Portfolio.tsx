import { useState, useEffect } from "react";
import { Upload, Trash2, Edit, Image as ImageIcon, Video } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  type: "image" | "video";
  url: string;
  uploadedAt: string;
}

export function AdminPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(["all"]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Wedding Portrait",
      category: "weddings",
      type: "image",
      url: "https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=400",
      uploadedAt: "2026-03-15",
    },
    {
      id: 2,
      title: "Concert Performance",
      category: "events",
      type: "image",
      url: "https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=400",
      uploadedAt: "2026-03-10",
    },
    {
      id: 3,
      title: "Professional Portrait",
      category: "portraits",
      type: "image",
      url: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?w=400",
      uploadedAt: "2026-03-05",
    },
    {
      id: 4,
      title: "Corporate Office",
      category: "corporate",
      type: "image",
      url: "https://images.unsplash.com/photo-1603201667493-4c2696de0b1f?w=400",
      uploadedAt: "2026-03-01",
    },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('category')
        .neq('category', '')
        .order('category', { ascending: true });

      if (error) {
        throw error;
      }

      const fetchedCategories = data?.map((item) => item.category).filter(Boolean) ?? [];
      setCategories(['all', ...Array.from(new Set(fetchedCategories))]);
    } catch (error) {
      console.error('Error fetching portfolio categories:', error);
      setCategories(["all", "weddings", "events", "portraits", "corporate"]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpload = () => {
    console.log("Upload triggered");
    // In production, this would open a file picker
  };

  const handleDelete = (id: number) => {
    console.log(`Delete item ${id}`);
    // In production, this would delete from backend
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio Management</h1>
        <p className="text-neutral-600">Upload and manage your portfolio items</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-neutral-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Content</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleUpload}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Photos
          </button>
          <button
            onClick={handleUpload}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            <Video className="w-5 h-5" />
            Upload Videos
          </button>
          <div className="flex-1 flex items-center text-sm text-neutral-600">
            <p>Supported formats: JPG, PNG, MP4, MOV • Max size: 50MB</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 capitalize transition-colors ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 overflow-hidden group">
            <div className="aspect-square relative overflow-hidden bg-neutral-100">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white text-black hover:bg-neutral-200 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs flex items-center gap-1">
                {item.type === "image" ? (
                  <ImageIcon className="w-3 h-3" />
                ) : (
                  <Video className="w-3 h-3" />
                )}
                {item.type}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span className="capitalize">{item.category}</span>
                <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">No items found in this category</p>
          <button
            onClick={handleUpload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Content
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">{portfolioItems.length}</div>
          <div className="text-sm text-neutral-600">Total Items</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {portfolioItems.filter((i) => i.type === "image").length}
          </div>
          <div className="text-sm text-neutral-600">Photos</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {portfolioItems.filter((i) => i.type === "video").length}
          </div>
          <div className="text-sm text-neutral-600">Videos</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">{categories.length - 1}</div>
          <div className="text-sm text-neutral-600">Categories</div>
        </div>
      </div>
    </div>
  );
}
