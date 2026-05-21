import { useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

// ── Types ─────────────────────────────────────────────────────
type JobListing = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  icon: string;
};

type ApplicationForm = {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
};

// ── Static job listings ───────────────────────────────────────
const JOBS: JobListing[] = [
  {
    id: 1,
    title: "Senior Vedic Astrologer",
    department: "Astrology",
    location: "Remote / Pan India",
    type: "Full-time",
    experience: "3+ Years",
    icon: "🔭",
  },
  {
    id: 2,
    title: "Tarot Card Reader",
    department: "Astrology",
    location: "Remote",
    type: "Part-time / Freelance",
    experience: "1+ Years",
    icon: "🃏",
  },
  {
    id: 3,
    title: "Numerology Expert",
    department: "Astrology",
    location: "Remote",
    type: "Freelance",
    experience: "2+ Years",
    icon: "🔢",
  },
  {
    id: 4,
    title: "React / React Native Developer",
    department: "Engineering",
    location: "Jaipur / Remote",
    type: "Full-time",
    experience: "2+ Years",
    icon: "💻",
  },
  {
    id: 5,
    title: "UI / UX Designer",
    department: "Design",
    location: "Jaipur / Remote",
    type: "Full-time",
    experience: "2+ Years",
    icon: "🎨",
  },
  {
    id: 6,
    title: "Customer Support Executive",
    department: "Operations",
    location: "Jaipur",
    type: "Full-time",
    experience: "0–1 Year",
    icon: "🎧",
  },
  {
    id: 7,
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Jaipur / Remote",
    type: "Full-time",
    experience: "3+ Years",
    icon: "📈",
  },
  {
    id: 8,
    title: "Content Writer – Astrology",
    department: "Content",
    location: "Remote",
    type: "Full-time / Freelance",
    experience: "1+ Years",
    icon: "✍️",
  },
];

const DEPARTMENTS = ["All", ...Array.from(new Set(JOBS.map((j) => j.department)))];

const PERKS = [
  { icon: "🏠", title: "Remote Friendly", desc: "Most roles are fully remote or hybrid — work from anywhere." },
  { icon: "📈", title: "Growth Fast-Track", desc: "We're a fast-growing startup. Your impact is visible and rewarded quickly." },
  { icon: "💰", title: "Competitive Pay", desc: "Market-rate salaries with performance bonuses and incentives." },
  { icon: "🌟", title: "Meaningful Work", desc: "Help millions of people find clarity and direction in their lives." },
  { icon: "🤝", title: "Great Culture", desc: "Collaborative, inclusive, and spiritually positive workplace." },
  { icon: "📚", title: "Learning Budget", desc: "Annual budget for courses, certifications, and skill development." },
];

// ── Sub-components ────────────────────────────────────────────
function DeptBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Astrology: "bg-[#FFF7F0] text-[#FF6F00] border-[#FFD9B3]",
    Engineering: "bg-[#EBF5FF] text-[#1976D2] border-[#B3D4F5]",
    Design: "bg-[#F3EBFF] text-[#9C27B0] border-[#DDB3F5]",
    Operations: "bg-[#E8F5E9] text-[#34A853] border-[#B3E0BC]",
    Marketing: "bg-[#FFF8E1] text-[#FFCC33] border-[#FFE98A]",
    Content: "bg-[#FFF0F0] text-[#D41000] border-[#FFB3B3]",
  };
  return (
    <span
      className={`font-poppins text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
        colors[label] ?? "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {label}
    </span>
  );
}

function JobCard({
  job,
  onApply,
}: {
  job: JobListing;
  onApply: (title: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#FFE8D6] p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#FFF7F0] flex items-center justify-center text-2xl flex-shrink-0">
          {job.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-poppins text-[14px] font-semibold text-[#1a1a1a] leading-tight">
            {job.title}
          </h4>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <DeptBadge label={job.department} />
            <span className="font-poppins text-[10px] text-[#575757] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
              {job.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[12px] font-poppins text-[#575757]">
        <span className="flex items-center gap-1">
          <span>📍</span> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <span>⏱️</span> {job.experience}
        </span>
      </div>

      <button
        onClick={() => onApply(job.title)}
        className="w-full bg-[#FF6F00] hover:bg-[#e56200] text-white font-poppins text-[13px] font-semibold py-2.5 rounded-xl transition-colors duration-200"
      >
        Apply Now
      </button>
    </div>
  );
}

function PerkCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-10 h-10 rounded-xl bg-[#FFF7F0] border border-[#FFE8D6] flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-poppins text-[13px] font-semibold text-[#1a1a1a]">{title}</p>
        <p className="font-poppins text-[12px] text-[#575757] leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ── Application Modal ─────────────────────────────────────────
function ApplicationModal({
  position,
  onClose,
}: {
  position: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ApplicationForm>({
    name: "",
    email: "",
    phone: "",
    position,
    experience: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    // Simulate API call — wire to your backend as needed
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[520px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-poppins text-[16px] font-bold text-white">Apply for Position</h3>
            <p className="font-poppins text-[11px] text-white/80">{position}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center text-3xl">
              ✅
            </div>
            <h4 className="font-poppins text-[16px] font-semibold text-[#1a1a1a]">
              Application Submitted!
            </h4>
            <p className="font-poppins text-[13px] text-[#575757] max-w-xs">
              Thank you for applying. Our team will review your application and reach out
              to you within 3–5 business days.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-[#FF6F00] text-white font-poppins text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#e56200] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Name */}
            <div>
              <label className="font-poppins text-[12px] font-medium text-[#1a1a1a] block mb-1">
                Full Name <span className="text-[#FF6F00]">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-[#FFE8D6] rounded-xl px-3 py-2.5 font-poppins text-[13px] text-[#1a1a1a] placeholder-[#b2b2b2] focus:outline-none focus:border-[#FF6F00] transition-colors"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-poppins text-[12px] font-medium text-[#1a1a1a] block mb-1">
                  Email <span className="text-[#FF6F00]">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full border border-[#FFE8D6] rounded-xl px-3 py-2.5 font-poppins text-[13px] text-[#1a1a1a] placeholder-[#b2b2b2] focus:outline-none focus:border-[#FF6F00] transition-colors"
                />
              </div>
              <div>
                <label className="font-poppins text-[12px] font-medium text-[#1a1a1a] block mb-1">
                  Phone <span className="text-[#FF6F00]">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-[#FFE8D6] rounded-xl px-3 py-2.5 font-poppins text-[13px] text-[#1a1a1a] placeholder-[#b2b2b2] focus:outline-none focus:border-[#FF6F00] transition-colors"
                />
              </div>
            </div>

            {/* Position (pre-filled) */}
            <div>
              <label className="font-poppins text-[12px] font-medium text-[#1a1a1a] block mb-1">
                Position Applying For
              </label>
              <input
                name="position"
                value={form.position}
                readOnly
                className="w-full border border-[#FFE8D6] rounded-xl px-3 py-2.5 font-poppins text-[13px] text-[#1a1a1a] bg-[#FFF7F0] cursor-not-allowed"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="font-poppins text-[12px] font-medium text-[#1a1a1a] block mb-1">
                Years of Experience
              </label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full border border-[#FFE8D6] rounded-xl px-3 py-2.5 font-poppins text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#FF6F00] transition-colors bg-white"
              >
                <option value="">Select experience</option>
                <option value="fresher">Fresher (0–1 yr)</option>
                <option value="1-2">1–2 years</option>
                <option value="2-5">2–5 years</option>
                <option value="5-10">5–10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Cover note */}
            <div>
              <label className="font-poppins text-[12px] font-medium text-[#1a1a1a] block mb-1">
                Why do you want to join Astrogurujii?
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us a bit about yourself and why you'd be a great fit..."
                className="w-full border border-[#FFE8D6] rounded-xl px-3 py-2.5 font-poppins text-[13px] text-[#1a1a1a] placeholder-[#b2b2b2] focus:outline-none focus:border-[#FF6F00] transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#FF6F00] hover:bg-[#e56200] disabled:bg-[#FFB37A] text-white font-poppins text-[14px] font-semibold py-3 rounded-xl transition-colors duration-200"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function CareersPage() {
  const [activeDept, setActiveDept] = useState("All");
  const [applyFor, setApplyFor] = useState<string | null>(null);

  const filtered =
    activeDept === "All" ? JOBS : JOBS.filter((j) => j.department === activeDept);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="Careers"
        highlight="Astrogurujii"
        description="Join our team and help us bring the wisdom of Vedic astrology to millions of people. Explore open roles below."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
      />

      <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-8">

        {/* ── Why Join Us ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🚀
            </div>
            <div>
              <h2 className="font-poppins text-[18px] font-bold text-white">
                Why Work With Us?
              </h2>
              <p className="font-poppins text-[12px] text-white/80">
                Be part of a mission-driven team changing how India seeks guidance
              </p>
            </div>
          </div>
          <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <PerkCard key={p.title} {...p} />
            ))}
          </div>
        </div>

        {/* ── Job Listings ──────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h3 className="font-poppins text-[18px] font-semibold text-[#1a1a1a]">
              Open <span className="text-[#FF6F00]">Positions</span>
              <span className="ml-2 font-poppins text-[13px] text-[#7e7e7e] font-normal">
                ({filtered.length} roles)
              </span>
            </h3>

            {/* Department filter */}
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`font-poppins text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors duration-150 ${
                    activeDept === dept
                      ? "bg-[#FF6F00] text-white border-[#FF6F00]"
                      : "bg-white text-[#575757] border-[#FFE8D6] hover:border-[#FF6F00] hover:text-[#FF6F00]"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#FFE8D6] py-12 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl">🔍</span>
              <p className="font-poppins text-[14px] text-[#575757]">
                No openings in this department right now.
              </p>
              <button
                onClick={() => setActiveDept("All")}
                className="font-poppins text-[13px] text-[#FF6F00] font-medium hover:underline"
              >
                View all positions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onApply={setApplyFor} />
              ))}
            </div>
          )}
        </div>

        {/* ── Open Application ──────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] rounded-2xl px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-poppins text-[17px] font-bold text-white">
              Don't see your role listed?
            </h3>
            <p className="font-poppins text-[13px] text-white/80 mt-1">
              Send us an open application — we're always looking for great people.
            </p>
          </div>
          <button
            onClick={() => setApplyFor("Open Application")}
            className="flex-shrink-0 bg-white text-[#FF6F00] font-poppins text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#FFF7F0] transition-colors duration-200 whitespace-nowrap"
          >
            Send Open Application →
          </button>
        </div>

        {/* ── Footer links ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="font-poppins text-[12px] text-[#7e7e7e]">
            © 2024 Astrogurujii. Equality opportunity employer.
          </p>
          <div className="flex gap-4">
            <a
              href="/about-us"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              About Us
            </a>
            <a
              href="/privacy-policy"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <Footer />

      {/* Application modal */}
      {applyFor && (
        <ApplicationModal position={applyFor} onClose={() => setApplyFor(null)} />
      )}
    </div>
  );
}