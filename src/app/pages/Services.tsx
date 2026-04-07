import { Link } from "react-router";
import { Camera, Video, Clock, Users, MapPin, Check } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Service {
  id: string;
  title: string;
  icon: typeof Camera;
  image: string;
  description: string;
  packages: {
    name: string;
    price: string;
    duration: string;
    features: string[];
  }[];
}

const services: Service[] = [
  {
    id: "photography",
    title: "Photography Services",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=800",
    description:
      "Professional photography services capturing your most precious moments with artistic excellence.",
    packages: [
      {
        name: "Basic Package",
        price: "From R2,500",
        duration: "2-3 hours",
        features: [
          "Up to 3 hours coverage",
          "100+ edited photos",
          "Online gallery",
          "High-resolution digital files",
          "Personal rights to images",
        ],
      },
      {
        name: "Premium Package",
        price: "From R5,000",
        duration: "Full day",
        features: [
          "Full day coverage (8 hours)",
          "300+ edited photos",
          "Online gallery with favorites",
          "High-resolution digital files",
          "Personal rights to images",
          "Printed photo album (30 pages)",
          "Second photographer",
        ],
      },
      {
        name: "Luxury Package",
        price: "Request Quote",
        duration: "Unlimited",
        features: [
          "Unlimited coverage",
          "500+ edited photos",
          "Premium online gallery",
          "High-resolution digital files",
          "Personal rights to images",
          "Luxury printed album (60 pages)",
          "Second photographer",
          "Engagement shoot included",
          "Canvas prints (3x)",
        ],
      },
    ],
  },
  {
    id: "videography",
    title: "Videography Services",
    icon: Video,
    image: "https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=800",
    description:
      "Cinematic video production that tells your story with professional editing and stunning visuals.",
    packages: [
      {
        name: "Highlights Package",
        price: "From R3,500",
        duration: "2-3 hours",
        features: [
          "Up to 3 hours filming",
          "3-5 minute highlight video",
          "Professional editing",
          "Music licensed soundtrack",
          "4K resolution",
          "Digital download",
        ],
      },
      {
        name: "Full Coverage Package",
        price: "From R7,000",
        duration: "Full day",
        features: [
          "Full day filming (8 hours)",
          "10-15 minute feature film",
          "3-5 minute highlight video",
          "Professional editing & color grading",
          "Music licensed soundtrack",
          "4K resolution",
          "Digital download + USB",
          "Second videographer",
        ],
      },
      {
        name: "Cinematic Package",
        price: "Request Quote",
        duration: "Unlimited",
        features: [
          "Unlimited filming",
          "20+ minute cinematic film",
          "5-7 minute highlight video",
          "Professional editing & color grading",
          "Custom music & sound design",
          "4K resolution",
          "Digital download + USB + Blu-ray",
          "Two videographers",
          "Drone footage included",
          "Raw footage provided",
        ],
      },
    ],
  },
];

export function Services() {
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
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`bg-neutral-900 border p-8 flex flex-col ${
                      service.packages.indexOf(pkg) === 1
                        ? "border-yellow-400 md:scale-105"
                        : "border-white/10"
                    }`}
                  >
                    {service.packages.indexOf(pkg) === 1 && (
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
