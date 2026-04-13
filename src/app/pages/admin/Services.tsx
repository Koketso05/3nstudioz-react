import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, DollarSign, Clock, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const getSubmitLabel = (isSubmitting: boolean, isEditing: boolean) => {
  if (isSubmitting) {
    return isEditing ? "Updating..." : "Adding...";
  }

  return isEditing ? "Update Service" : "Add Service";
};

interface ServicePackage {
  id: string;
  name: string;
  type: "photography" | "videography";
  price: string;
  duration: string;
  features: string[];
  is_active: boolean;
}

export function AdminServices() {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "photography" as "photography" | "videography",
    price: "",
    duration: "",
    features: [""],
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      setError(error.message);
    } else {
      setServices(data || []);
      setError(null);
    }
    setLoading(false);
  };

  const filteredServices =
    selectedType === "all"
      ? services
      : services.filter((service) => service.type === selectedType);

  const handleDelete = (id: string) => {
    setServiceToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    const { error: functionError } = await supabase.functions.invoke("manage-services", {
      body: {
        action: "delete",
        serviceId: serviceToDelete,
      },
    });

    if (functionError) {
      console.error("Error deleting service:", functionError);
      setError(functionError.message);
    } else {
      setServices(services.filter((s) => s.id !== serviceToDelete));
      setError(null);
    }

    setIsConfirmDialogOpen(false);
    setServiceToDelete(null);
  };

  const toggleActive = async (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;

    const { data: functionData, error: functionError } = await supabase.functions.invoke("manage-services", {
      body: {
        action: "toggle-active",
        serviceId: id,
        payload: { is_active: !service.is_active },
      },
    });

    if (functionError) {
      console.error("Error updating service:", functionError);
      setError(functionError.message);
    } else {
      const updatedService = functionData?.service;
      setServices(
        services.map((s) =>
          s.id === id ? (updatedService ?? { ...s, is_active: !service.is_active }) : s
        )
      );
      setError(null);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      name: "",
      type: "photography",
      price: "",
      duration: "",
      features: [""],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: ServicePackage) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      price: service.price,
      duration: service.duration,
      features: service.features.length > 0 ? service.features : [""],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out empty features
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== "");

    const serviceData = {
      name: formData.name,
      type: formData.type,
      price: formData.price,
      duration: formData.duration,
      features: filteredFeatures,
      is_active: editingService ? editingService.is_active : true,
    };

    if (editingService) {
      const { data: functionData, error: functionError } = await supabase.functions.invoke("manage-services", {
        body: {
          action: "update",
          serviceId: editingService.id,
          payload: serviceData,
        },
      });

      if (functionError) {
        console.error("Error updating service:", functionError);
        setError(functionError.message);
      } else {
        setServices(services.map((s) =>
          s.id === editingService.id ? (functionData?.service ?? { ...s, ...serviceData }) : s
        ));
        setIsDialogOpen(false);
        setEditingService(null);
        setError(null);
      }
    } else {
      const { data: functionData, error: functionError } = await supabase.functions.invoke("manage-services", {
        body: {
          action: "create",
          payload: serviceData,
        },
      });

      if (functionError) {
        console.error("Error adding service:", functionError);
        setError(functionError.message);
      } else {
        setServices([functionData?.service, ...services].filter(Boolean));
        setIsDialogOpen(false);
        setError(null);
      }
    }

    setIsSubmitting(false);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Services Management</h1>
          <p className="text-neutral-600">Manage your service packages and pricing</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
          <Plus className="w-5 h-5" />
          Add New Package
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-600 p-4">
          {error}
        </div>
      )}

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
      {loading ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-neutral-600">Loading services...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white border p-6 ${
                service.is_active
                  ? "border-neutral-200"
                  : "border-neutral-300 opacity-60"
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
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
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
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm text-neutral-600 flex items-start gap-2"
                    >
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
                    service.is_active
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-neutral-300 text-neutral-700 hover:bg-neutral-400"
                  }`}
                >
                  {service.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="px-6 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  Edit Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredServices.length === 0 && !loading && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-neutral-600 mb-4">No services found</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
          >
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
            {services.filter((s) => s.is_active).length}
          </div>
          <div className="text-sm text-neutral-600">Active Packages</div>
        </div>
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-3xl font-bold mb-2">
            {services.filter((s) => !s.is_active).length}
          </div>
          <div className="text-sm text-neutral-600">Inactive Packages</div>
        </div>
      </div>

      {/* Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingService(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service Package" : "Add New Service Package"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the service package details."
                : "Create a new photography or videography service package."
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Premium Photography Package"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Service Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "photography" | "videography") =>
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="videography">Videography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., R5,000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., Full day"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Features Included</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={`${index}-${feature}`} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="e.g., Professional editing"
                      className="flex-1"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {getSubmitLabel(isSubmitting, Boolean(editingService))}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service package? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setServiceToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
