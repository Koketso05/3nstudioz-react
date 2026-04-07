import { useState } from "react";
import { Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";

interface ServicePackage {
  id: number;
  name: string;
  type: "photography" | "videography";
  price: string;
  duration: string;
  features: string[];
  isActive: boolean;
}

export function AdminServices() {
  const [services, setServices] = useState<ServicePackage[]>([
    {
      id: 1,
      name: "Basic Photography Package",
      type: "photography",
      price: "R2,500",
      duration: "2-3 hours",
      features: [
        "Up to 3 hours coverage",
        "100+ edited photos",
        "Online gallery",
        "High-resolution digital files",
      ],
      isActive: true,
    },
    {
      id: 2,
      name: "Premium Photography Package",
      type: "photography",
      price: "R5,000",
      duration: "Full day",
      features: [
        "Full day coverage (8 hours)",
        "300+ edited photos",
        "Online gallery",
        "Printed photo album",
        "Second photographer",
      ],
      isActive: true,
    },
    {
      id: 3,
      name: "Highlights Videography Package",
      type: "videography",
      price: "R3,500",
      duration: "2-3 hours",
      features: [
        "Up to 3 hours filming",
        "3-5 minute highlight video",
        "Professional editing",
        "4K resolution",
      ],
      isActive: true,
    },
    {
      id: 4,
      name: "Full Coverage Videography Package",
      type: "videography",
      price: "R7,000",
      duration: "Full day",
      features: [
        "Full day filming",
        "10-15 minute feature film",
        "Professional editing",
        "Second videographer",
      ],
      isActive: true,
    },
  ]);

  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredServices =
    selectedType === "all"
      ? services
      : services.filter((service) => service.type === selectedType);

  const handleDelete = (id: number) => {
    console.log(`Delete service ${id}`);
    setServices(services.filter((s) => s.id !== id));
  };

  const toggleActive = (id: number) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Services Management</h1>
          <p className="text-neutral-600">Manage your service packages and pricing</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
          <Plus className="w-5 h-5" />
          Add New Package
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white border border-neutral-200 p-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 transition-colors ${
              selectedType === "all"
                ? "bg-black text-white"
                : "border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setSelectedType("photography")}
            className={`px-4 py-2 transition-colors ${
              selectedType === "photography"
                ? "bg-black text-white"
                : "border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            Photography
          </button>
          <button
            onClick={() => setSelectedType("videography")}
            className={`px-4 py-2 transition-colors ${
              selectedType === "videography"
                ? "bg-black text-white"
                : "border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            Videography
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-white border p-6 ${
              service.isActive ? "border-neutral-200" : "border-neutral-300 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-xs uppercase mb-2">
                  {service.type}
                </span>
                <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-neutral-100 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-6 mb-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-neutral-400" />
                <span className="font-semibold text-lg">{service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-600">{service.duration}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Includes:</h4>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-1.5"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(service.id)}
                className={`flex-1 py-2 transition-colors ${
                  service.isActive
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-neutral-300 text-neutral-700 hover:bg-neutral-400"
                }`}
              >
                {service.isActive ? "Active" : "Inactive"}
              </button>
              <button className="px-6 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors">
                Edit Package
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-neutral-600 mb-4">No services found</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
            <Plus className="w-5 h-5" />
            Add New Package
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">{services.length}</div>
          <div className="text-sm text-neutral-600">Total Packages</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {services.filter((s) => s.isActive).length}
          </div>
          <div className="text-sm text-neutral-600">Active Packages</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {services.filter((s) => !s.isActive).length}
          </div>
          <div className="text-sm text-neutral-600">Inactive Packages</div>
        </div>
      </div>
    </div>
  );
}
