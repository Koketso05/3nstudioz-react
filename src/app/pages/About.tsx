import { useState, useEffect } from "react";
import { Camera, Award, Users, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  instagram: string | null;
  display_order: number;
}

export function About() {
  const [showTeam, setShowTeam] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);

  useEffect(() => {
    if (!showTeam || team.length > 0) return;
    setTeamLoading(true);
    setTeamError(null);
    supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setTeamError("Failed to load team members.");
        } else {
          setTeam((data as TeamMember[]) ?? []);
        }
        setTeamLoading(false);
      });
  }, [showTeam, team.length]);

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
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
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
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-neutral-900 border border-white/10 p-8">
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
          <button
            onClick={() => setShowTeam((v) => !v)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors font-semibold"
          >
            {showTeam ? "Hide Team Profiles" : "View Team Profiles"}
            {showTeam ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showTeam && (
            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
              {teamLoading && (
                <p className="col-span-3 text-center text-white/50 py-8">Loading team...</p>
              )}
              {teamError && (
                <p className="col-span-3 text-center text-red-400 py-8">{teamError}</p>
              )}
              {!teamLoading && !teamError && team.map((member) => (
                <div key={member.id} className="bg-black border border-white/10 overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={member.image_url ?? ""}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-yellow-400 text-sm mb-3">{member.role}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-white/50 hover:text-yellow-400 transition-colors"
                      >
                        <FaInstagram className="w-4 h-4" />
                        @{member.instagram}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
