import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import { STATS } from "@/data/home";

const API_BASE_URL = "https://admin.astrogurujii.com";

// ── Types ─────────────────────────────────────────────────────
type SettingResult = {
  about_us?: string;
  terms_and_conditions?: string;
  privacy_policy?: string;
};

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div className="h-3 bg-orange-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-5/6 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
      ))}
    </div>
  );
}

// ── Value card ────────────────────────────────────────────────
function ValueCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#FFE8D6] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="w-11 h-11 rounded-xl bg-[#FFF7F0] flex items-center justify-center text-2xl">
        {icon}
      </div>
      <h4 className="font-poppins text-[14px] font-semibold text-[#1a1a1a]">
        {title}
      </h4>
      <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#FFF7F0] rounded-2xl border border-[#FFE8D6] py-6 px-4">
      <span className="font-poppins text-[32px] font-bold text-[#FF6F00] leading-none">
        {value}
      </span>
      <span className="font-poppins text-[13px] text-[#575757] mt-1 text-center capitalize">
        {label}
      </span>
    </div>
  );
}

// ── Team card ─────────────────────────────────────────────────
function TeamCard({
  initials,
  name,
  role,
  color,
}: {
  initials: string;
  name: string;
  role: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[22px] font-bold font-poppins"
        style={{ background: color }}
      >
        {initials}
      </div>
      <div>
        <p className="font-poppins text-[14px] font-semibold text-[#1a1a1a]">
          {name}
        </p>
        <p className="font-poppins text-[12px] text-[#FF6F00]">{role}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function AboutUsPage() {
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get<{ status: boolean; results: SettingResult }>(
          `${API_BASE_URL}/user_api/setting`
        );
        if (res.data?.status && res.data?.results?.about_us) {
          setAboutContent(res.data.results.about_us);
        }
      } catch {
        // fall through to static
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const VALUES = [
    {
      icon: "🔭",
      title: "Ancient Wisdom",
      description:
        "We root every consultation in thousands of years of Vedic tradition, ensuring guidance that is authentic, time-tested, and deeply meaningful.",
    },
    {
      icon: "✅",
      title: "Verified Experts",
      description:
        "Every astrologer on our platform is rigorously vetted for knowledge, experience, and ethical practice before they can consult users.",
    },
    {
      icon: "🔒",
      title: "Complete Privacy",
      description:
        "Your personal details and conversations are strictly confidential. We never share user data with any third parties.",
    },
    {
      icon: "💬",
      title: "Always Available",
      description:
        "With 24/7 availability via chat, voice, and video, our astrologers are ready to guide you whenever you need clarity.",
    },
    {
      icon: "🛡️",
      title: "Secure Payments",
      description:
        "All transactions are processed through encrypted, industry-standard payment gateways so your money is always safe.",
    },
    {
      icon: "🌟",
      title: "Personalised Guidance",
      description:
        "We believe no two birth charts are alike. Every consultation is tailored to your unique planetary positions and life circumstances.",
    },
  ];

  const TEAM = [
    { initials: "RK", name: "Rajesh Kumar", role: "Founder & CEO", color: "#FF6F00" },
    { initials: "PS", name: "Priya Sharma", role: "Head of Astrology", color: "#34A853" },
    { initials: "AV", name: "Amit Verma", role: "CTO", color: "#1976D2" },
    { initials: "SM", name: "Sunita Mishra", role: "Head of Operations", color: "#9C27B0" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="About Us"
        highlight="Astrogurujii"
        description="Learn about our mission to bring authentic Vedic astrology guidance to millions of people across the world."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-8">

        {/* ── Hero card ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] overflow-hidden shadow-sm">
          {/* Orange header */}
          <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🔱
            </div>
            <div>
              <h2 className="font-poppins text-[18px] font-bold text-white">
                Who We Are
              </h2>
              <p className="font-poppins text-[12px] text-white/80">
                Connecting seekers with verified Vedic astrologers since 2020
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {loading ? (
              <Skeleton />
            ) : aboutContent ? (
              <div
                className="font-poppins text-[13px] text-[#575757] leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutContent }}
              />
            ) : (
              <div className="space-y-4">
                <div className="bg-[#FFF7F0] border-l-4 border-[#FF6F00] rounded-r-xl px-4 py-3">
                  <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
                    <strong className="text-[#FF6F00]">Astrogurujii</strong> is
                    India's fastest-growing astrology platform, connecting millions
                    of users with certified Vedic astrologers for guidance in love,
                    career, health, and life decisions.
                  </p>
                </div>
                <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
                  Founded with a single purpose — to make authentic astrological
                  wisdom accessible to everyone — Astrogurujii brings together the
                  ancient knowledge of Vedic astrology and modern technology. We
                  believe that the stars hold insights that can illuminate your path
                  forward, and our mission is to make that wisdom available to you
                  anytime, anywhere.
                </p>
                <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
                  Our platform hosts over 15,000 verified astrologers specialising in
                  Vedic astrology, Kundali matching, numerology, tarot reading, Vastu
                  Shastra, and more. Whether you prefer a live chat, voice call, or
                  video session, we have the right expert for your needs — available
                  24/7, from anywhere in the world.
                </p>
                <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
                  Every astrologer on our platform is rigorously screened for
                  knowledge, years of practice, and ethical standards. We do not just
                  list astrologers — we stand behind every consultation our platform
                  facilitates.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────────── */}
        <div>
          <h3 className="font-poppins text-[18px] font-semibold text-[#1a1a1a] mb-4">
            Our <span className="text-[#FF6F00]">Impact</span> in Numbers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} />
            ))}
            <StatCard value="4.8★" label="Average Rating" />
            <StatCard value="10+" label="Languages Supported" />
            <StatCard value="24/7" label="Expert Availability" />
          </div>
        </div>

        {/* ── Mission & Vision ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#FFE8D6] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7F0] flex items-center justify-center text-lg">
                🎯
              </div>
              <h3 className="font-poppins text-[15px] font-semibold text-[#1a1a1a]">
                Our Mission
              </h3>
            </div>
            <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
              To democratise access to authentic Vedic astrology by connecting every
              seeker — regardless of location or background — with verified, compassionate
              experts who provide real guidance rooted in ancient wisdom.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#FFE8D6] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7F0] flex items-center justify-center text-lg">
                🌄
              </div>
              <h3 className="font-poppins text-[15px] font-semibold text-[#1a1a1a]">
                Our Vision
              </h3>
            </div>
            <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
              To become the world's most trusted astrology platform — where every
              person can find clarity, purpose, and peace by aligning with the cosmic
              energy that surrounds them.
            </p>
          </div>
        </div>

        {/* ── Values ───────────────────────────────────────── */}
        <div>
          <h3 className="font-poppins text-[18px] font-semibold text-[#1a1a1a] mb-4">
            What We <span className="text-[#FF6F00]">Stand For</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {VALUES.map((v) => (
              <ValueCard
                key={v.title}
                icon={v.icon}
                title={v.title}
                description={v.description}
              />
            ))}
          </div>
        </div>

        {/* ── Team ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] p-6">
          <h3 className="font-poppins text-[18px] font-semibold text-[#1a1a1a] mb-6 text-center">
            Meet Our <span className="text-[#FF6F00]">Leadership</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((t) => (
              <TeamCard key={t.name} {...t} />
            ))}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] rounded-2xl px-6 py-8 text-center">
          <h3 className="font-poppins text-[20px] font-bold text-white mb-2">
            Ready to discover your cosmic path?
          </h3>
          <p className="font-poppins text-[13px] text-white/80 mb-5 max-w-md mx-auto">
            Talk to a verified Vedic astrologer right now — via chat, call, or video.
            Your first consultation starts in minutes.
          </p>
          <a
            href="/chat-with-astrolger"
            className="inline-block bg-white text-[#FF6F00] font-poppins text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[#FFF7F0] transition-colors duration-200"
          >
            Talk to an Astrologer →
          </a>
        </div>

        {/* ── Footer links ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="font-poppins text-[12px] text-[#7e7e7e]">
            © 2024 Astrogurujii. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="/privacy-policy"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-and-conditions"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              Terms & Conditions
            </a>
            <a
              href="/career"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              Careers
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}