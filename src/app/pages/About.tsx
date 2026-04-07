import { Camera, Award, Users, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const stats = [
    { number: "60+", label: "Events Covered" },
    { number: "45+", label: "Happy Clients" },
    { number: "50k+", label: "Photos Captured" },
    { number: "8+", label: "Years Experience" },
  ];

  const values = [
    {
      icon: Camera,
      title: "Professional Excellence",
      description:
        "We use state-of-the-art equipment and techniques to deliver stunning, high-quality results every time.",
    },
    {
      icon: Heart,
      title: "Passion & Creativity",
      description:
        "Every project is approached with genuine passion and creative vision to capture your unique story.",
    },
    {
      icon: Users,
      title: "Client-Focused",
      description:
        "Your satisfaction is our priority. We work closely with you to understand and exceed your expectations.",
    },
    {
      icon: Award,
      title: "Award-Winning",
      description:
        "Recognized by our for excellence in photography and videography across South Africa.",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl mb-4">About 3NStudioz</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Your trusted partner in capturing life's most precious moments
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl">Our Story</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Founded in 2018, 3NStudioz began with a simple passion: to capture and preserve
              life's most beautiful moments. What started as a one-person operation has grown
              into a full-service photography and videography studio serving clients across
              South Africa.
            </p>
            <p className="text-white/70 text-lg leading-relaxed">
              We believe that every moment tells a story, and our mission is to help you tell
              yours. Whether it's the joy of a wedding day, the energy of a corporate event, or
              the intimacy of a portrait session, we approach each project with dedication,
              creativity, and technical excellence.
            </p>
            <p className="text-white/70 text-lg leading-relaxed">
              Our team of experienced photographers and videographers combines artistic vision
              with the latest technology to deliver results that exceed expectations. We're not
              just here to take photos—we're here to create timeless memories.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?w=600"
                alt="Our work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=600"
                alt="Our work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=600"
                alt="Our work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1603201667493-4c2696de0b1f?w=600"
                alt="Our work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 py-16 border-y border-white/10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                {stat.number}
              </div>
              <div className="text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">What We Stand For</h2>
            <p className="text-white/60 text-lg">The values that drive everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-neutral-900 border border-white/10 p-8">
                  <div className="w-14 h-14 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl mb-3">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-neutral-900 border border-white/10 p-8 md:p-12 text-center">
          <h2 className="text-4xl mb-4">Meet Our Team</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Our talented team of photographers, videographers, and editors work together to bring
            your vision to life. With diverse backgrounds and unique perspectives, we're united by
            our passion for visual storytelling.
          </p>
          <div className="inline-block px-8 py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors cursor-pointer">
            View Team Profiles
          </div>
        </div>
      </div>
    </div>
  );
}
