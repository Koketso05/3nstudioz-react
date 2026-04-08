import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Upload, Trash2, Edit, Image as ImageIcon, Video } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  url: string;
  uploaded_at: string;
}

export function AdminPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedType, setSelectedType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayedItems = portfolioItems;
  const filteredItems =
    selectedCategory === "all"
      ? displayedItems
      : displayedItems.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    fetchPortfolioItems();
    fetchCategories();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) {
        throw error;
      }

      setPortfolioItems((data as PortfolioItem[]) || []);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("category")
        .neq("category", "")
        .order("category", { ascending: true });

      if (error) {
        throw error;
      }

      const fetchedCategories = (data as { category: string }[])
        ?.map((item) => item.category)
        .filter(Boolean) ?? [];

      setCategories(["all", ...Array.from(new Set(fetchedCategories))]);
    } catch (error) {
      console.error("Error fetching portfolio categories:", error);
      setCategories(["all", "weddings", "events", "portraits", "corporate"]);
    }
  };

  const openUploadPicker = (type: "image" | "video") => {
    setSelectedType(type);
    setUploadError(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const expectedPrefix = selectedType === "image" ? "image/" : "video/";
    if (!file.type.startsWith(expectedPrefix)) {
      setUploadError(`Please select a ${selectedType} file.`);
      return;
    }

    setFileName(file.name);
    await uploadPortfolioItem(file);
  };

  const uploadPortfolioItem = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const path = `${selectedType}s/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("portfolio")
        .getPublicUrl(path);

      if (publicUrlError) {
        throw publicUrlError;
      }

      const url = publicUrlData?.publicUrl;
      if (!url) {
        throw new Error("Unable to generate public URL for uploaded file.");
      }

      const newTitle = title.trim() || file.name;
      const newCategory = categoryInput.trim() || "uncategorized";
      const uploadedAt = new Date().toISOString().slice(0, 10);

      const { data, error: insertError } = await supabase
        .from("portfolio_items")
        .insert([
          {
            title: newTitle,
            category: newCategory,
            type: selectedType,
            url,
            uploaded_at: uploadedAt,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setPortfolioItems((current) => [data as PortfolioItem, ...current]);
      if (!categories.includes(newCategory)) {
        setCategories((current) => [...current, newCategory]);
      }

      setSelectedCategory("all");
      setTitle("");
      setCategoryInput("");
      setFileName("");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
      if (error) throw error;
      setPortfolioItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete portfolio item error:", error);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={selectedType === "image" ? "image/*" : "video/*"}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio Management</h1>
        <p className="text-neutral-600">Upload and manage your portfolio items</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-neutral-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Content</h2>
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Beach Wedding"
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700">Category</label>
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="Example: weddings"
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700">Selected file</label>
            <div className="rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-600">
              {fileName || "No file selected yet"}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={() => openUploadPicker("image")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
            disabled={uploading}
          >
            <Upload className="w-5 h-5" />
            Upload Photo
          </button>
          <button
            type="button"
            onClick={() => openUploadPicker("video")}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
            disabled={uploading}
          >
            <Video className="w-5 h-5" />
            Upload Video
          </button>
          <div className="flex-1 flex items-center text-sm text-neutral-600">
            <p>Supported formats: JPG, PNG, MP4, MOV • Max size: 50MB</p>
          </div>
        </div>

        {uploadError && (
          <p className="mt-4 text-sm text-red-600">{uploadError}</p>
        )}
        {uploading && (
          <p className="mt-4 text-sm text-neutral-600">Uploading file, please wait...</p>
        )}
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
                <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">No portfolio items found in this category</p>
          <button
            onClick={() => openUploadPicker("image")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Content
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">{displayedItems.length}</div>
          <div className="text-sm text-neutral-600">Total Items</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {displayedItems.filter((i) => i.type === "image").length}
          </div>
          <div className="text-sm text-neutral-600">Photos</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {displayedItems.filter((i) => i.type === "video").length}
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
