import { Link } from "react-router";
import { Camera, Video, Star, ArrowRight, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const FALLBACK_HERO_SLIDES = [
  "https://res.cloudinary.com/djqvmg7pb/image/upload/v1775557926/711A2748_pr1wck.jpg",
];

export function Home() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoadingTestimonials(true);
      setTestimonialsError(null);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setTestimonialsError("Could not load testimonials.");
        setTestimonials([]);
      } else {
        setTestimonials(data || []);
      }
      setLoadingTestimonials(false);
    };
    fetchTestimonials();
  }, []);

  // Recent work from DB
  const [recentWork, setRecentWork] = useState<any[]>([]);
  const [loadingRecentWork, setLoadingRecentWork] = useState(true);
  const [recentLightbox, setRecentLightbox] = useState<any | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Close lightbox with Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRecentLightbox(null);
    };
    if (recentLightbox) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    return;
  }, [recentLightbox]);

  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.replace('www.', '');
      if (host === 'youtu.be') return parsedUrl.pathname.split('/').find(Boolean) ?? null;
      if (host === 'youtube.com' || host === 'm.youtube.com') {
        const watchId = parsedUrl.searchParams.get('v');
        if (watchId) return watchId;
        const parts = parsedUrl.pathname.split('/').filter(Boolean);
        if (parts[0] === 'shorts' || parts[0] === 'embed') return parts[1] ?? null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const getYouTubeThumbnailUrl = (url: string): string | null => {
    const id = getYouTubeVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const id = getYouTubeVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  };

  useEffect(() => {
    const fetchRecent = async () => {
      setLoadingRecentWork(true);
      try {
        const { data, error } = await supabase
          .from('recent_work')
          .select('*')
          .order('uploaded_at', { ascending: false })
          .limit(4);
        if (error) throw error;
        setRecentWork(data || []);
      } catch (err) {
        console.error('Error fetching recent work:', err);
        setRecentWork([]);
      } finally {
        setLoadingRecentWork(false);
      }
    };
    fetchRecent();
  }, []);

  const heroSlides = recentWork
    .map((item) => {
      if (item.type === "video") {
        return getYouTubeThumbnailUrl(item.url);
      }

      return item.url;
    })
    .filter((slide): slide is string => Boolean(slide))
    .slice(0, 5);

  const visibleHeroSlides = heroSlides.length > 0 ? heroSlides : FALLBACK_HERO_SLIDES;

  useEffect(() => {
    if (visibleHeroSlides.length <= 1) {
      setActiveHeroSlide(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) => (currentSlide + 1) % visibleHeroSlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [visibleHeroSlides.length]);

  useEffect(() => {
    if (activeHeroSlide >= visibleHeroSlides.length) {
      setActiveHeroSlide(0);
    }
  }, [activeHeroSlide, visibleHeroSlides.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {visibleHeroSlides.map((slide, index) => (
            <div
              key={slide}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeHeroSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <ImageWithFallback
                src={slide}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
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
            {loadingRecentWork ? (
              // placeholders
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-neutral-900 animate-pulse" />
              ))
            ) : recentWork.length === 0 ? (
              <div className="col-span-2 md:col-span-4 text-center text-white/60 py-12">No recent work available.</div>
            ) : (
              recentWork.map((item, i) => (
                <button
                  type="button"
                  key={item.id ?? i}
                  onClick={() => setRecentLightbox(item)}
                  aria-label={`Open ${item.title || 'media'}`}
                  className="aspect-square overflow-hidden"
                >
                  {item.type === 'video' ? (
                    (() => {
                      const thumb = getYouTubeThumbnailUrl(item.url);
                      if (thumb) {
                        return (
                          <ImageWithFallback
                            src={thumb}
                            alt={item.title || `Video ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        );
                      }
                      return (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      );
                    })()
                  ) : (
                    <ImageWithFallback
                      src={item.url}
                      alt={item.title || `Portfolio ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Recent work lightbox modal */}
          {recentLightbox && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="Close lightbox"
                onClick={() => setRecentLightbox(null)}
                className="absolute inset-0"
              />
              <div className="max-w-6xl w-full relative z-10">
                {/* Visible close button */}
                <button
                  onClick={() => setRecentLightbox(null)}
                  className="absolute top-3 right-3 z-20 bg-white/10 hover:bg-white/20 rounded-full p-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center">
                  {recentLightbox.type === 'video' ? (
                    (() => {
                      const embed = getYouTubeEmbedUrl(recentLightbox.url);
                      if (embed) {
                        return (
                          <div className="relative w-full h-full">
                            <iframe
                              src={embed}
                              title={recentLightbox.title}
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
                          src={recentLightbox.url}
                          className="max-h-full w-auto h-full object-contain"
                          controls
                          autoPlay
                          playsInline
                        />
                      );
                    })()
                  ) : (
                    <ImageWithFallback
                      src={recentLightbox.url}
                      alt={recentLightbox.title}
                      className="max-h-full w-auto h-full object-contain"
                    />
                  )}
                </div>

                <div className="text-center mt-6">
                  <p className="text-white text-xl mb-2">{recentLightbox.title}</p>
                  <p className="text-white/60 capitalize">{recentLightbox.category}</p>
                </div>
              </div>
            </div>
          )}

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

          {loadingTestimonials ? (
            <div className="text-center text-white/60 py-12">Loading testimonials...</div>
          ) : testimonialsError ? (
            <div className="text-center text-red-400 py-12">{testimonialsError}</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center text-white/60 py-12">No testimonials found.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={testimonial.id || i} className="bg-neutral-900 p-8 border border-white/10">
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
          )}
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