import { Link } from "react-router";
import { Camera, Video, Star, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const testimonials = [
    {
      name: "Sarah & John",
      event: "Wedding",
      text: "3NStudioz captured our special day perfectly! Every moment was beautifully preserved.",
      rating: 5,
    },
    {
      name: "Gift Khumalo",
      event: "Wedding",
      text: "Professional, creative, and reliable. Highly recommend for any business event.",
      rating: 5,
    },
    {
      name: "Mothusi Bahlekazi",
      event: "Birthday Party",
      text: "The photos were stunning! They made our celebration unforgettable.",
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://res.cloudinary.com/djqvmg7pb/image/upload/v1775557926/711A2748_pr1wck.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-block px-6 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
              <span className="text-yellow-400">Professional Photography & Videography</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            Capturing Moments
            <br />
            <span className="text-yellow-400">That Last Forever</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
            Weddings • Events • Portraits • Parties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-white text-black hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
            >
              View Portfolio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/booking"
              className="px-8 py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 group"
            >
              Book Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-4 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Our Services</h2>
            <p className="text-white/60 text-lg">Professional photography & videography for every occasion</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors p-8 border border-white/10">
              <Camera className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-2xl mb-3">Photography</h3>
              <p className="text-white/60 mb-4">
                Stunning photography that captures the essence of your special moments with artistic precision.
              </p>
              <Link
                to="/services"
                className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group relative overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors p-8 border border-white/10">
              <Video className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-2xl mb-3">Videography</h3>
              <p className="text-white/60 mb-4">
                Cinematic video production that brings your story to life with professional editing and effects.
              </p>
              <Link
                to="/services"
                className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Recent Work</h2>
            <p className="text-white/60 text-lg">A glimpse of our latest projects</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              "https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=600",
              "https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=600",
              "https://images.unsplash.com/photo-1698082386199-fc60bc5b3e42?w=600",
              "https://images.unsplash.com/photo-1510114941-1dcfb5633651?w=600",
            ].map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                <ImageWithFallback
                  src={img}
                  alt={`Portfolio ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              View Full Portfolio <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">What Clients Say</h2>
            <p className="text-white/60 text-lg">Trusted by hundreds of satisfied clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-neutral-900 p-8 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-white/60">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Ready to Book?</h2>
          <p className="text-xl text-white/70 mb-8">
            Let's create something beautiful together. Check our availability and book your date today.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
          >
            Book Your Session <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
