import React, { useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

// ─── Icons ────────────────────────────────────────────────────────────────────

const PlanetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
  </svg>
);

const HouseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DashaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const YogaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange mt-0.5 shrink-0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

type KundaliTab = "chart" | "planets" | "houses" | "dasha" | "yogas";

const TABS: { id: KundaliTab; label: string }[] = [
  { id: "chart", label: "Birth Chart" },
  { id: "planets", label: "Planets" },
  { id: "houses", label: "Houses" },
  { id: "dasha", label: "Dasha" },
  { id: "yogas", label: "Yogas" },
];

const PLANETS = [
  { name: "Sun", symbol: "☉", sign: "Aries", house: "1st", degree: "15°22′", strength: 78, nature: "Benefic" },
  { name: "Moon", symbol: "☽", sign: "Cancer", house: "4th", degree: "8°45′", strength: 88, nature: "Benefic" },
  { name: "Mars", symbol: "♂", sign: "Scorpio", house: "8th", degree: "22°10′", strength: 65, nature: "Malefic" },
  { name: "Mercury", symbol: "☿", sign: "Pisces", house: "12th", degree: "3°55′", strength: 55, nature: "Neutral" },
  { name: "Jupiter", symbol: "♃", sign: "Sagittarius", house: "9th", degree: "18°30′", strength: 92, nature: "Benefic" },
  { name: "Venus", symbol: "♀", sign: "Taurus", house: "2nd", degree: "11°18′", strength: 85, nature: "Benefic" },
  { name: "Saturn", symbol: "♄", sign: "Capricorn", house: "10th", degree: "27°40′", strength: 70, nature: "Malefic" },
  { name: "Rahu", symbol: "☊", sign: "Gemini", house: "3rd", degree: "14°05′", strength: 60, nature: "Malefic" },
  { name: "Ketu", symbol: "☋", sign: "Sagittarius", house: "9th", degree: "14°05′", strength: 60, nature: "Malefic" },
];

const HOUSES = [
  { num: "1st", name: "Ascendant (Lagna)", sign: "Aries", ruler: "Mars", theme: "Self, personality, physical body and general outlook on life." },
  { num: "2nd", name: "Dhana Bhava", sign: "Taurus", ruler: "Venus", theme: "Wealth, family, speech, early education and accumulated resources." },
  { num: "3rd", name: "Sahaja Bhava", sign: "Gemini", ruler: "Mercury", theme: "Siblings, courage, short journeys, communication and skills." },
  { num: "4th", name: "Sukha Bhava", sign: "Cancer", ruler: "Moon", theme: "Mother, home, property, vehicles, emotional security and inner peace." },
  { num: "5th", name: "Putra Bhava", sign: "Leo", ruler: "Sun", theme: "Children, intelligence, creativity, romance, speculation and past life merits." },
  { num: "6th", name: "Ari Bhava", sign: "Virgo", ruler: "Mercury", theme: "Enemies, diseases, debts, service, daily work and competition." },
  { num: "7th", name: "Kalatra Bhava", sign: "Libra", ruler: "Venus", theme: "Marriage, partnerships, business alliances and open enemies." },
  { num: "8th", name: "Mrityu Bhava", sign: "Scorpio", ruler: "Mars", theme: "Longevity, transformation, hidden knowledge, inheritance and occult." },
  { num: "9th", name: "Dharma Bhava", sign: "Sagittarius", ruler: "Jupiter", theme: "Fortune, father, religion, higher education, philosophy and long journeys." },
  { num: "10th", name: "Karma Bhava", sign: "Capricorn", ruler: "Saturn", theme: "Career, social status, authority, ambition and public reputation." },
  { num: "11th", name: "Labha Bhava", sign: "Aquarius", ruler: "Saturn", theme: "Gains, income, elder siblings, friends, aspirations and fulfillment of desires." },
  { num: "12th", name: "Vyaya Bhava", sign: "Pisces", ruler: "Jupiter", theme: "Losses, isolation, foreign lands, spiritual liberation and hidden expenses." },
];

const DASHAS = [
  { planet: "Sun", start: "2018-04-12", end: "2024-04-12", years: 6, status: "Completed", color: "#FF6F00" },
  { planet: "Moon", start: "2024-04-12", end: "2034-04-12", years: 10, status: "Active", color: "#4ac9d9" },
  { planet: "Mars", start: "2034-04-12", end: "2041-04-12", years: 7, status: "Upcoming", color: "#e74c4c" },
  { planet: "Rahu", start: "2041-04-12", end: "2059-04-12", years: 18, status: "Upcoming", color: "#9b59b6" },
  { planet: "Jupiter", start: "2059-04-12", end: "2075-04-12", years: 16, status: "Upcoming", color: "#f39c12" },
];

const YOGAS = [
  { name: "Gajakesari Yoga", type: "Auspicious", strength: "Strong", description: "Moon and Jupiter in mutual kendras. Blesses with wisdom, wealth, fame and respected social standing throughout life." },
  { name: "Hamsa Yoga", type: "Pancha Mahapurusha", strength: "Very Strong", description: "Jupiter in own sign in a kendra. Bestows noble character, spiritual wisdom, physical grace and leadership qualities." },
  { name: "Malavya Yoga", type: "Pancha Mahapurusha", strength: "Strong", description: "Venus in own sign in a kendra. Grants luxury, artistic talent, beauty, romantic charm and material comforts." },
  { name: "Kemdrum Yoga", type: "Inauspicious", strength: "Moderate", description: "Moon without planets in adjacent houses. May cause periodic isolation or challenges in emotional expression." },
];

// ─── Kundali Chart SVG ─────────────────────────────────────────────────────

function KundaliChart() {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const houseLabels = [
    { x: cx, y: 28, label: "1", sign: "♈" },
    { x: cx + 68, y: 58, label: "2", sign: "♉" },
    { x: cx + 98, y: cy, label: "3", sign: "♊" },
    { x: cx + 68, y: cy + 82, label: "4", sign: "♋" },
    { x: cx, y: cy + 112, label: "5", sign: "♌" },
    { x: cx - 68, y: cy + 82, label: "6", sign: "♍" },
    { x: cx - 98, y: cy, label: "7", sign: "♎" },
    { x: cx - 68, y: 58, label: "8", sign: "♏" },
    { x: cx - 40, y: 50, label: "9", sign: "♐" },
    { x: cx + 40, y: 50, label: "10", sign: "♑" },
    { x: cx + 40, y: cy + 102, label: "11", sign: "♒" },
    { x: cx - 40, y: cy + 102, label: "12", sign: "♓" },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Outer square */}
      <rect x="10" y="10" width={size - 20} height={size - 20} fill="#FFF5EC" stroke="#FF6F00" strokeWidth="1.5" rx="4" />
      {/* Inner diamond */}
      <polygon
        points={`${cx},30 ${size - 30},${cy} ${cx},${size - 30} 30,${cy}`}
        fill="#fff" stroke="#FF6F00" strokeWidth="1.5"
      />
      {/* Diagonal lines */}
      <line x1="10" y1="10" x2={cx} y2={cy} stroke="#FFD4A8" strokeWidth="0.8" />
      <line x1={size - 10} y1="10" x2={cx} y2={cy} stroke="#FFD4A8" strokeWidth="0.8" />
      <line x1={size - 10} y1={size - 10} x2={cx} y2={cy} stroke="#FFD4A8" strokeWidth="0.8" />
      <line x1="10" y1={size - 10} x2={cx} y2={cy} stroke="#FFD4A8" strokeWidth="0.8" />
      {/* Corner cross lines */}
      <line x1="10" y1="10" x2={size - 10} y2="10" stroke="#FF6F00" strokeWidth="1.5" />
      <line x1={size - 10} y1="10" x2={size - 10} y2={size - 10} stroke="#FF6F00" strokeWidth="1.5" />
      <line x1={size - 10} y1={size - 10} x2="10" y2={size - 10} stroke="#FF6F00" strokeWidth="1.5" />
      <line x1="10" y1={size - 10} x2="10" y2="10" stroke="#FF6F00" strokeWidth="1.5" />

      {/* House numbers */}
      {houseLabels.map((h, i) => (
        <g key={i}>
          <text x={h.x} y={h.y} textAnchor="middle" fontSize="9" fill="#FF6F00" fontWeight="700">{h.label}</text>
          <text x={h.x} y={h.y + 12} textAnchor="middle" fontSize="10" fill="#888">{h.sign}</text>
        </g>
      ))}

      {/* Center text */}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="11" fill="#FF6F00" fontWeight="700">KUNDALI</text>
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="9" fill="#888">North Indian</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8" fill="#aaa">Style</text>
    </svg>
  );
}

// ─── Detail Card ──────────────────────────────────────────────────────────────

function InfoCard({ icon, label, content }: { icon: React.ReactNode; label: string; content: string }) {
  return (
    <div className="rounded-xl border border-[#F0E8DF] bg-white p-4 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF5EC] text-brand-orange">{icon}</span>
        <span className="font-poppins text-[11px] font-bold uppercase tracking-wide text-brand-orange">{label}</span>
      </div>
      <p className="font-euclid text-[13px] leading-[1.7] text-gray-600">{content}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KundaliPage() {
  const [activeTab, setActiveTab] = useState<KundaliTab>("chart");
  const [generated, setGenerated] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", tob: "", place: "" });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BreadcrumbHeader
        title="Free Kundali"
        highlight="Janma Kundali"
        description="Generate your detailed birth chart with planetary positions, house analysis, Dasha periods and auspicious Yogas — completely free."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Free Kundali" }]}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-[94px] lg:py-10">
        {!generated ? (
          /* ── Birth Details Form ── */
          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAFAFA] p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF5EC] text-brand-orange">
                  <PlanetIcon />
                </div>
                <div>
                  <h2 className="font-poppins text-[16px] font-bold text-[#1A1A1A]">Enter Birth Details</h2>
                  <p className="font-euclid text-[12px] text-gray-400">Accurate time & place gives precise results</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-gray-600">
                    <UserIcon /> Full Name
                  </label>
                  <input
                    type="text" placeholder="e.g. Rahul Sharma"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E0D5CC] bg-white px-4 py-2.5 font-euclid text-[13px] text-gray-700 outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                {/* DOB */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-gray-600">
                    <CalendarIcon /> Date of Birth
                  </label>
                  <input
                    type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })}
                    className="w-full rounded-xl border border-[#E0D5CC] bg-white px-4 py-2.5 font-euclid text-[13px] text-gray-700 outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                {/* TOB */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-gray-600">
                    <DashaIcon /> Time of Birth
                  </label>
                  <input
                    type="time" value={form.tob} onChange={e => setForm({ ...form, tob: e.target.value })}
                    className="w-full rounded-xl border border-[#E0D5CC] bg-white px-4 py-2.5 font-euclid text-[13px] text-gray-700 outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                {/* Place */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-gray-600">
                    <LocationIcon /> Place of Birth
                  </label>
                  <input
                    type="text" placeholder="e.g. Delhi, India"
                    value={form.place} onChange={e => setForm({ ...form, place: e.target.value })}
                    className="w-full rounded-xl border border-[#E0D5CC] bg-white px-4 py-2.5 font-euclid text-[13px] text-gray-700 outline-none focus:border-brand-orange transition-colors"
                  />
                </div>

                <button
                  onClick={() => setGenerated(true)}
                  className="mt-2 rounded-xl bg-brand-orange py-3 font-poppins text-[14px] font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                >
                  Generate Free Kundali ✨
                </button>
              </div>
            </div>

            {/* Feature hints */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: <PlanetIcon />, label: "9 Planet Positions", desc: "Accurate placement in signs & houses" },
                { icon: <HouseIcon />, label: "12 House Analysis", desc: "Complete bhava interpretation" },
                { icon: <DashaIcon />, label: "Vimshottari Dasha", desc: "Planetary period timeline" },
                { icon: <YogaIcon />, label: "Yoga Detection", desc: "Auspicious & inauspicious yogas" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-[#F0E8DF] bg-white p-3 shadow-sm">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF5EC] text-brand-orange">{f.icon}</div>
                  <div>
                    <p className="font-poppins text-[11px] font-bold text-[#1A1A1A]">{f.label}</p>
                    <p className="font-euclid text-[10px] text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Generated Kundali ── */
          <div className="flex flex-col gap-6 lg:flex-row">

            {/* Left: Chart + Quick Info */}
            <div className="w-full shrink-0 lg:w-[300px]">
              {/* Profile card */}
              <div className="mb-4 rounded-2xl border border-[#F0E8DF] bg-[#FFF5EC] p-5 shadow-sm" style={{ borderLeft: "4px solid #FF6F00" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow text-brand-orange">
                    <UserIcon />
                  </div>
                  <div>
                    <p className="font-poppins text-[15px] font-bold text-[#1A1A1A]">{form.name || "Your Kundali"}</p>
                    <p className="font-euclid text-[11px] text-gray-500">{form.dob} · {form.tob}</p>
                    <p className="font-euclid text-[11px] text-gray-500">{form.place}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Ascendant", value: "Aries" },
                    { label: "Moon Sign", value: "Cancer" },
                    { label: "Sun Sign", value: "Aries" },
                    { label: "Nakshatra", value: "Pushya" },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg bg-white/80 p-2 text-center shadow-sm">
                      <p className="font-poppins text-[9px] text-gray-400 uppercase">{s.label}</p>
                      <p className="font-poppins text-[12px] font-bold text-brand-orange">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-2xl border border-[#F0E8DF] bg-white p-4 shadow-sm">
                <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center">North Indian Chart</p>
                <KundaliChart />
              </div>

              <button
                onClick={() => setGenerated(false)}
                className="mt-4 w-full rounded-xl border border-[#E0D5CC] py-2.5 font-poppins text-[12px] font-semibold text-gray-500 hover:border-brand-orange hover:text-brand-orange transition-colors"
              >
                ← Edit Birth Details
              </button>
            </div>

            {/* Right: Tabs + Content */}
            <div className="flex-1 min-w-0">
              {/* Tabs */}
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 rounded-[6px] px-4 py-[7px] font-poppins text-[12px] font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-brand-orange text-white shadow-md"
                        : "border border-[#E0D5CC] text-[#666] hover:border-brand-orange hover:text-brand-orange"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Chart overview */}
              {activeTab === "chart" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-[#F0E8DF] bg-[#FFF5EC] p-5" style={{ borderLeft: "4px solid #FF6F00" }}>
                    <h3 className="font-poppins text-[15px] font-bold text-[#1A1A1A] mb-2">Chart Overview</h3>
                    <p className="font-euclid text-[13px] leading-[1.8] text-gray-600">
                      Your Kundali reveals a strongly positioned Jupiter in the 9th house forming a Hamsa Yoga — a Pancha Mahapurusha Yoga of extraordinary spiritual and material fortune. The Moon in Cancer (own sign) in the 4th house brings emotional stability, deep family bonds and a nurturing personality that others find magnetic and comforting. Mars as Lagna lord in the 8th house adds depth, investigative intelligence and transformative life experiences.
                    </p>
                    <div className="mt-3 flex items-start gap-3 rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-3">
                      <SparkleIcon />
                      <p className="font-poppins text-[12px] font-semibold italic text-brand-orange">
                        Jupiter and Moon's strength in your chart indicate a life of wisdom, deep relationships and spiritual growth.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoCard icon={<PlanetIcon />} label="Lagna Lord" content="Mars rules your Aries ascendant. Placed in Scorpio (own sign) in the 8th house, you possess remarkable investigative instincts, regenerative capacity and magnetic depth." />
                    <InfoCard icon={<YogaIcon />} label="Key Strength" content="Jupiter in Sagittarius (own sign) in the 9th house blesses you with great fortune, wisdom, spiritual inclination and long journeys that transform your worldview." />
                    <InfoCard icon={<DashaIcon />} label="Current Period" content="Moon Mahadasha (2024–2034) activates your emotional intelligence, home life, motherly connections and public popularity. A deeply nurturing 10-year cycle." />
                    <InfoCard icon={<HouseIcon />} label="Life Theme" content="Your chart strongly emphasizes the 4th, 9th and 10th houses — suggesting a life purpose rooted in family values, philosophical wisdom and professional achievement." />
                  </div>
                </div>
              )}

              {/* Tab: Planets */}
              {activeTab === "planets" && (
                <div className="rounded-2xl border border-[#F0E8DF] bg-white shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-[#F0E8DF]">
                    <h3 className="font-poppins text-[14px] font-bold text-[#1A1A1A]">Planetary Positions</h3>
                    <p className="font-euclid text-[12px] text-gray-400 mt-0.5">All 9 grahas in your birth chart</p>
                  </div>
                  <div className="divide-y divide-[#F0E8DF]">
                    {PLANETS.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF5EC] text-[18px]">{p.symbol}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-poppins text-[13px] font-bold text-[#1A1A1A]">{p.name}</span>
                            <span className={`rounded-full px-2 py-0.5 font-poppins text-[9px] font-semibold ${
                              p.nature === "Benefic" ? "bg-green-50 text-green-600" :
                              p.nature === "Malefic" ? "bg-red-50 text-red-500" :
                              "bg-gray-100 text-gray-500"
                            }`}>{p.nature}</span>
                          </div>
                          <p className="font-euclid text-[11px] text-gray-400">{p.sign} · House {p.house} · {p.degree}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="font-poppins text-[12px] font-bold text-brand-orange">{p.strength}%</span>
                          <div className="w-20 h-1.5 rounded-full bg-[#F0E8DF] overflow-hidden">
                            <div className="h-full rounded-full bg-brand-orange" style={{ width: `${p.strength}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Houses */}
              {activeTab === "houses" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {HOUSES.map((h, i) => (
                    <div key={i} className="rounded-xl border border-[#F0E8DF] bg-white p-4 shadow-sm hover:border-brand-orange/40 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF5EC] font-poppins text-[11px] font-bold text-brand-orange">{h.num}</span>
                        <div>
                          <p className="font-poppins text-[12px] font-bold text-[#1A1A1A]">{h.name}</p>
                          <p className="font-euclid text-[10px] text-gray-400">{h.sign} · Ruled by {h.ruler}</p>
                        </div>
                      </div>
                      <p className="font-euclid text-[12px] leading-[1.6] text-gray-500">{h.theme}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Dasha */}
              {activeTab === "dasha" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-[#F0E8DF] bg-white p-5 shadow-sm">
                    <h3 className="font-poppins text-[14px] font-bold text-[#1A1A1A] mb-4">Vimshottari Dasha Timeline</h3>
                    <div className="flex flex-col gap-3">
                      {DASHAS.map((d, i) => (
                        <div key={i} className={`flex items-center gap-4 rounded-xl p-3 border ${d.status === "Active" ? "border-brand-orange bg-[#FFF5EC]" : "border-[#F0E8DF] bg-[#FAFAFA]"}`}>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-bold" style={{ background: d.color }}>{d.planet[0]}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-poppins text-[13px] font-bold text-[#1A1A1A]">{d.planet} Mahadasha</span>
                              {d.status === "Active" && <span className="rounded-full bg-brand-orange px-2 py-0.5 font-poppins text-[9px] font-bold text-white">CURRENT</span>}
                            </div>
                            <p className="font-euclid text-[11px] text-gray-400">{d.start} → {d.end} · {d.years} years</p>
                          </div>
                          <span className={`font-poppins text-[10px] font-semibold ${d.status === "Completed" ? "text-gray-400" : d.status === "Active" ? "text-brand-orange" : "text-gray-400"}`}>{d.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Yogas */}
              {activeTab === "yogas" && (
                <div className="flex flex-col gap-4">
                  {YOGAS.map((y, i) => (
                    <div key={i} className={`rounded-xl border p-4 shadow-sm ${y.type === "Inauspicious" ? "border-red-100 bg-red-50/30" : "border-[#F0E8DF] bg-white hover:border-brand-orange/40"} transition-all`}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-poppins text-[14px] font-bold text-[#1A1A1A]">{y.name}</p>
                          <p className="font-euclid text-[11px] text-gray-400">{y.type}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-poppins text-[10px] font-semibold ${
                          y.type === "Inauspicious" ? "bg-red-50 text-red-500" : "bg-[#FFF5EC] text-brand-orange"
                        }`}>{y.strength}</span>
                      </div>
                      <p className="font-euclid text-[13px] leading-[1.7] text-gray-600">{y.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}