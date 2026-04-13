import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Camera, Video, Clock, Users, MapPin, Check, type LucideIcon } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";

interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  image: string;
  description: string;
  packages: {
    id: string;
    name: string;
    price: string;
    duration: string;
    features: string[];
  }[];
}

interface ServiceRow {
  id: string;
  name: string;
  type: "photography" | "videography";
  price: string;
  duration: string;
  features: string[];
  is_active: boolean;
  created_at: string;
}

const durationToBookingValue = (duration: string): string => {
  const normalized = duration.toLowerCase();

  if (normalized.includes("1") && normalized.includes("2")) return "1-2";
  if (normalized.includes("2") && normalized.includes("3")) return "2-4";
  if (normalized.includes("2") && normalized.includes("4")) return "2-4";
  if (normalized.includes("4") && normalized.includes("6")) return "4-6";
  if (normalized.includes("6") && normalized.includes("8")) return "6-8";
  if (normalized.includes("full day") || normalized.includes("unlimited")) return "full-day";

  return "";
};

const serviceSectionMeta: Record<"photography" | "videography", Omit<Service, "packages">> = {
  photography: {
    id: "photography",
    title: "Photography Services",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=800",
    description:
      "Professional photography services capturing your most precious moments with artistic excellence.",
  },
  videography: {
    id: "videography",
    title: "Videography Services",
    icon: Video,
    image: "https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=800",
    description:
      "Cinematic video production that tells your story with professional editing and stunning visuals.",
  },
};

const buildServices = (serviceRows: ServiceRow[]): Service[] => {
  return (Object.keys(serviceSectionMeta) as Array<keyof typeof serviceSectionMeta>)
    .map((serviceType) => {
      const packages = serviceRows
        .filter((serviceRow) => serviceRow.type === serviceType)
        .map((serviceRow) => ({
          id: serviceRow.id,
          name: serviceRow.name,
          price: serviceRow.price,
          duration: serviceRow.duration,
          features: serviceRow.features ?? [],
        }));

      return {
        ...serviceSectionMeta[serviceType],
        packages,
      };
    })
    .filter((service) => service.packages.length > 0);
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error: servicesError } = await supabase
          .from("services")
          .select("id, name, type, price, duration, features, is_active, created_at")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (servicesError) throw servicesError;

        const serviceRows = (data as ServiceRow[]) ?? [];
        const groupedServices = buildServices(serviceRows);

        setServices(groupedServices);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err instanceof Error ? err.message : "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl mb-4">Our Services</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Professional packages tailored to capture your special moments perfectly
          </p>
        </div>

        {error && (
          <div className="mb-10 border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-16 text-center text-white/60">Loading services...</div>
        )}

        {!loading && services.length === 0 && !error && (
          <div className="py-16 text-center text-white/60">No active services available right now.</div>
        )}

        {/* Services */}
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className={`mb-24 ${index > 0 ? "pt-24 border-t border-white/10" : ""}`}
            >
              {/* Service Header */}
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h2 className="text-3xl">{service.title}</h2>
                  </div>
                  <p className="text-white/70 text-lg mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Flexible timing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>All locations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Professional team</span>
                    </div>
                  </div>
                </div>
                <div className="aspect-video overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Packages */}
              <div className="grid md:grid-cols-3 gap-6">
                {service.packages.map((pkg, packageIndex) => (
                  <div
                    key={pkg.id}
                    className={`bg-neutral-900 border p-8 flex flex-col ${
                      packageIndex === 1
                        ? "border-yellow-400 md:scale-105"
                        : "border-white/10"
                    }`}
                  >
                    {packageIndex === 1 && (
                      <div className="inline-block px-4 py-1 bg-yellow-400 text-black text-sm mb-4 self-start">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className="text-2xl mb-2">{pkg.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-yellow-400">
                        {pkg.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 mb-6 pb-6 border-b border-white/10">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/booking"
                      state={{
                        prefill: {
                          serviceType: service.id,
                          duration: durationToBookingValue(pkg.duration),
                          notes: `Selected package: ${service.title} - ${pkg.name} (${pkg.price})`,
                        },
                      }}
                      className={`w-full py-3 text-center transition-colors ${
                        service.packages.indexOf(pkg) === 1
                          ? "bg-yellow-400 text-black hover:bg-yellow-500"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      Book This Package
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="text-center py-16 px-6 bg-neutral-900 border border-white/10 mt-16">
          <h2 className="text-3xl mb-4">Need a Custom Package?</h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Every event is unique. Contact us to create a custom package that perfectly fits your needs and budget.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
