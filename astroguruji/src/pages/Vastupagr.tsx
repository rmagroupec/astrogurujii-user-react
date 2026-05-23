import React, { useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

// ─── Icons ────────────────────────────────────────────────────────────────────

const CompassIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange mt-0.5 shrink-0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

type RoomType = "home" | "office" | "shop" | "factory";

const ROOM_TYPES: { id: RoomType; label: string; emoji: string }[] = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "office", label: "Office", emoji: "🏢" },
  { id: "shop", label: "Shop", emoji: "🏪" },
  { id: "factory", label: "Factory", emoji: "🏭" },
];

const DIRECTIONS = [
  { dir: "North", deity: "Kuber", element: "Water", color: "#4ac9d9", ideal: "Treasury, Locker, Cash counter", avoid: "Toilet, Staircase, Heavy storage", score: 95 },
  { dir: "North-East", deity: "Ishaan (Shiva)", element: "Space", color: "#9b59b6", ideal: "Pooja room, Study, Meditation space", avoid: "Toilet, Kitchen, Bedroom", score: 88 },
  { dir: "East", deity: "Indra", element: "Air", color: "#34a853", ideal: "Main entrance, Living room, Windows", avoid: "Toilet, Garbage, Septic tank", score: 92 },
  { dir: "South-East", deity: "Agni (Fire)", element: "Fire", color: "#FF6F00", ideal: "Kitchen, Electrical equipment, Generator", avoid: "Water storage, Bedroom, Well", score: 80 },
  { dir: "South", deity: "Yama", element: "Earth", color: "#795548", ideal: "Master bedroom, Heavy furniture", avoid: "Main entrance, Kitchen, Well", score: 72 },
  { dir: "South-West", deity: "Nairruti", element: "Earth", color: "#8B4513", ideal: "Master bedroom, Strong room, Stairs", avoid: "Pooja room, Well, Open space", score: 78 },
  { dir: "West", deity: "Varuna", element: "Water", color: "#4a90d9", ideal: "Children's room, Study, Dining", avoid: "Kitchen, Toilet opposite entrance", score: 82 },
  { dir: "North-West", deity: "Vayu (Wind)", element: "Air", color: "#607D8B", ideal: "Guest room, Garage, Storage", avoid: "Master bedroom, Pooja room", score: 75 },
];

const VASTU_TIPS: Record<RoomType, { room: string; tips: string[]; remedy: string }[]> = {
  home: [
    { room: "Main Entrance", tips: ["Face East or North for maximum positive energy flow", "Keep entrance well-lit and clutter-free at all times", "Place a Swastika or Om symbol above the main door"], remedy: "Hang a brass bell or wind chime at the entrance to amplify positive vibrations." },
    { room: "Kitchen", tips: ["Ideal location is South-East zone (Agni corner)", "Cook facing East to enhance health and prosperity", "Never place the kitchen directly below or above a toilet"], remedy: "Keep a bowl of sea salt in a corner of the kitchen to absorb negative energy." },
    { room: "Master Bedroom", tips: ["Best in South-West corner of the home", "Head while sleeping should point South or East", "Avoid mirrors directly facing the bed"], remedy: "Place Rose Quartz crystals in the SW corner of the bedroom for harmony." },
    { room: "Pooja Room", tips: ["Ideal in North-East (Ishaan) corner of the home", "Idols should face West; devotee faces East while praying", "Keep it well-ventilated and always clean"], remedy: "Light a ghee diya daily in the pooja room to maintain divine energy flow." },
  ],
  office: [
    { room: "Owner's Cabin", tips: ["Position desk so owner faces North or East", "Sit with solid wall behind, not glass or window", "Place Kuber Yantra on the north wall of cabin"], remedy: "Keep a small aquarium in the North zone of office for financial prosperity." },
    { room: "Reception", tips: ["Should be in East or North-East zone", "Keep it bright, clean and welcoming", "Avoid heavy furniture or dark colors at reception"], remedy: "Place a laughing Buddha facing the main door to attract opportunities." },
    { room: "Conference Room", tips: ["West or North-West is ideal for discussions", "Rectangular table is preferred over circular", "Avoid sitting with back to main door"], remedy: "Place a pyramid Vastu yantra under the conference table for clarity." },
    { room: "Accounts Department", tips: ["North zone (Kuber's direction) is best for accounts", "Keep locker or cash box in North facing South", "Avoid placing accounts near toilets"], remedy: "Place Shri Yantra in the North of accounts room for financial strength." },
  ],
  shop: [
    { room: "Shop Entrance", tips: ["East or North facing entrance attracts maximum footfall", "Keep entrance clean, bright and obstacle-free", "Number the shop with a lucky number for your zodiac"], remedy: "Sprinkle sea salt water on the floor every Saturday to cleanse energy." },
    { room: "Cash Counter", tips: ["Position in North zone facing South", "Keep a red cloth under the cash drawer", "Never keep cash counter facing the exit door"], remedy: "Place Kuber Yantra behind the cash counter facing North for financial gains." },
    { room: "Storage", tips: ["South or West zone is ideal for heavy storage", "Keep storage area organized and clutter-free", "Avoid storing in North-East corner"], remedy: "Hang a camphor ball in the storage area to prevent energy stagnation." },
    { room: "Display Area", tips: ["East facing displays attract more buyers", "Use warm lighting for product displays", "Keep display area energetic and well-organized"], remedy: "Place a small crystal ball in the display area to amplify positive buyer energy." },
  ],
  factory: [
    { room: "Main Gate", tips: ["North or East facing main gate is most auspicious", "Gate should be the largest opening in the plot", "Avoid a gate in the South-West corner"], remedy: "Install a Vastu pyramid at the four corners of the factory compound." },
    { room: "Production Area", tips: ["South-East zone for machinery and production (fire element)", "Keep production area free of clutter and well-ventilated", "Avoid placing heavy machinery in North-East"], remedy: "Light camphor daily in the production area to purify the working environment." },
    { room: "Workers' Area", tips: ["Workers should face East or North while working", "Provide adequate natural light in working areas", "Keep toilets away from production and storage zones"], remedy: "Paint worker rest areas in green or light blue for calm and productivity." },
    { room: "Water Source", tips: ["North or North-East is ideal for borewells and water tanks", "Keep water storage areas clean and leak-free", "Avoid water in the South-East zone (fire conflict)"], remedy: "Place a flowing water feature in the North zone of factory premises." },
  ],
};

const DEFECTS = [
  { name: "Toilet in North-East", severity: "High", icon: "⚠️", remedy: "Place a Vastu pyramid inside the toilet and keep it spotlessly clean. Use blue color tiles. Keep the toilet seat down and door closed at all times." },
  { name: "Kitchen in North-East", severity: "High", icon: "🔥", remedy: "Shift kitchen if structurally feasible. If not, place a Vastu copper strip on the floor separating kitchen from NE. Paint NE wall in light yellow or cream." },
  { name: "Cut Corner (Missing zone)", severity: "Medium", icon: "📐", remedy: "Place a large mirror on the wall of the missing corner to virtually extend the space. Place a Vastu pyramid in that zone for correction." },
  { name: "Main Door in South", severity: "Medium", icon: "🚪", remedy: "Install bright lighting above the door. Place a Vastu Swastika or Om above the door. Use a red door mat. Ensure the door opens inward." },
  { name: "Staircase in North-East", severity: "High", icon: "🪜", remedy: "Paint staircase in light colors. Place a potted plant at the base. Hang a Vastu crystal ball in the NE zone to counterbalance the energy disruption." },
];

// ─── Vastu Compass ────────────────────────────────────────────────────────────

function VastuCompass() {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const colors = ["#4ac9d9", "#9b59b6", "#34a853", "#FF6F00", "#795548", "#8B4513", "#4a90d9", "#607D8B"];

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" className="mx-auto">
      {dirs.map((d, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const innerR = 40;
        const outerR = 95;
        const startAngle = ((i * 45 - 22.5 - 90) * Math.PI) / 180;
        const endAngle = (((i + 1) * 45 - 22.5 - 90) * Math.PI) / 180;
        const x1 = 110 + innerR * Math.cos(startAngle);
        const y1 = 110 + innerR * Math.sin(startAngle);
        const x2 = 110 + outerR * Math.cos(startAngle);
        const y2 = 110 + outerR * Math.sin(startAngle);
        const x3 = 110 + outerR * Math.cos(endAngle);
        const y3 = 110 + outerR * Math.sin(endAngle);
        const x4 = 110 + innerR * Math.cos(endAngle);
        const y4 = 110 + innerR * Math.sin(endAngle);
        const lx = 110 + 72 * Math.cos(angle);
        const ly = 110 + 72 * Math.sin(angle);
        return (
          <g key={d}>
            <path d={`M${x1},${y1} L${x2},${y2} A${outerR},${outerR} 0 0,1 ${x3},${y3} L${x4},${y4} A${innerR},${innerR} 0 0,0 ${x1},${y1}`}
              fill={colors[i]} fillOpacity="0.75" stroke="#fff" strokeWidth="1.5" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#fff">{d}</text>
          </g>
        );
      })}
      <circle cx="110" cy="110" r="38" fill="#FFF5EC" stroke="#FF6F00" strokeWidth="2" />
      <text x="110" y="106" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FF6F00">VASTU</text>
      <text x="110" y="120" textAnchor="middle" fontSize="9" fill="#888">COMPASS</text>
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VastuPage() {
  const [activeRoom, setActiveRoom] = useState<RoomType>("home");
  const [activeSection, setActiveSection] = useState<"directions" | "tips" | "defects">("directions");

  const SECTIONS = [
    { id: "directions" as const, label: "8 Directions" },
    { id: "tips" as const, label: "Room-wise Tips" },
    { id: "defects" as const, label: "Vastu Defects" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BreadcrumbHeader
        title="Vastu Shastra"
        highlight="Free Vastu Guide"
        description="Ancient Indian science of spatial harmony. Get directional analysis, room-wise recommendations and remedies for Vastu defects — completely free."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vastu Shastra" }]}
      />

      {/* Sticky tabs */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-[#F0E8DF]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`shrink-0 rounded-[6px] px-5 py-[7px] font-poppins text-[13px] font-semibold transition-all ${
                  activeSection === s.id ? "bg-brand-orange text-white shadow-md" : "border border-[#E0D5CC] text-[#666] hover:border-brand-orange hover:text-brand-orange"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-[94px] lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Left sidebar */}
          <aside className="w-full shrink-0 lg:w-[240px]">
            {/* Compass */}
            <div className="mb-4 rounded-2xl border border-[#F0E8DF] bg-white p-4 shadow-sm">
              <p className="mb-3 text-center font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400">Vastu Compass</p>
              <VastuCompass />
            </div>

            {/* Property type */}
            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAFAFA] p-4 shadow-sm">
              <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400">Property Type</p>
              <div className="grid grid-cols-2 gap-2">
                {ROOM_TYPES.map(r => (
                  <button key={r.id} onClick={() => setActiveRoom(r.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition-all ${
                      activeRoom === r.id ? "border-brand-orange bg-[#FFF5EC] shadow-md" : "border-transparent bg-white hover:border-brand-orange/40 hover:bg-[#FFF5EC]"
                    }`}>
                    <span className="text-[22px]">{r.emoji}</span>
                    <span className={`font-poppins text-[10px] font-semibold ${activeRoom === r.id ? "text-brand-orange" : "text-[#555]"}`}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5 elements */}
            <div className="mt-4 rounded-2xl border border-[#F0E8DF] bg-white p-4 shadow-sm">
              <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400">5 Elements</p>
              {[
                { el: "Earth", zone: "South-West", color: "#795548" },
                { el: "Water", zone: "North", color: "#4ac9d9" },
                { el: "Fire", zone: "South-East", color: "#FF6F00" },
                { el: "Air", zone: "North-West", color: "#34a853" },
                { el: "Space", zone: "Centre", color: "#9b59b6" },
              ].map(e => (
                <div key={e.el} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
                    <span className="font-poppins text-[11px] font-semibold text-[#333]">{e.el}</span>
                  </div>
                  <span className="font-euclid text-[10px] text-gray-400">{e.zone}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Right content */}
          <div className="flex-1 min-w-0">

            {/* Directions */}
            {activeSection === "directions" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-[#F0E8DF] bg-[#FFF5EC] p-5 shadow-sm" style={{ borderLeft: "4px solid #FF6F00" }}>
                  <h2 className="font-poppins text-[16px] font-bold text-[#1A1A1A] mb-1">8 Directions Guide</h2>
                  <p className="font-euclid text-[13px] text-gray-600 leading-relaxed">
                    Every direction in Vastu Shastra is governed by a deity and element. Correct placement of rooms and activities aligned with directional energies brings health, wealth, happiness and harmony to all occupants.
                  </p>
                  <div className="mt-3 flex items-start gap-3 rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-3">
                    <SparkleIcon />
                    <p className="font-poppins text-[12px] font-semibold italic text-brand-orange">North and East are the most auspicious directions for main entrances and important spaces.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {DIRECTIONS.map((d, i) => (
                    <div key={i} className="rounded-xl border border-[#F0E8DF] bg-white p-4 shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-poppins text-[10px] font-bold" style={{ background: d.color }}>{d.dir.split("-").map(w => w[0]).join("")}</div>
                          <div>
                            <p className="font-poppins text-[13px] font-bold text-[#1A1A1A]">{d.dir}</p>
                            <p className="font-euclid text-[10px] text-gray-400">{d.deity} · {d.element}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-poppins text-[13px] font-bold text-brand-orange">{d.score}%</p>
                          <div className="w-16 h-1.5 rounded-full bg-[#F0E8DF] mt-1 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.color }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-green-500 text-[10px]">✓</span>
                          <p className="font-euclid text-[11px] text-gray-600"><b>Ideal for:</b> {d.ideal}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-red-400 text-[10px]">✗</span>
                          <p className="font-euclid text-[11px] text-gray-500"><b>Avoid:</b> {d.avoid}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room tips */}
            {activeSection === "tips" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-[#F0E8DF] bg-[#FFF5EC] p-5 shadow-sm" style={{ borderLeft: "4px solid #FF6F00" }}>
                  <h2 className="font-poppins text-[16px] font-bold text-[#1A1A1A] mb-1">
                    {ROOM_TYPES.find(r => r.id === activeRoom)?.emoji} {ROOM_TYPES.find(r => r.id === activeRoom)?.label} Vastu Tips
                  </h2>
                  <p className="font-euclid text-[13px] text-gray-600">Practical room-by-room Vastu guidance for your {activeRoom} for harmony and prosperity.</p>
                </div>
                {VASTU_TIPS[activeRoom].map((t, i) => (
                  <div key={i} className="rounded-xl border border-[#F0E8DF] bg-white p-4 shadow-sm hover:border-brand-orange/30 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF5EC] text-brand-orange"><HomeIcon /></span>
                      <span className="font-poppins text-[13px] font-bold text-[#1A1A1A]">{t.room}</span>
                    </div>
                    <ul className="flex flex-col gap-1.5 mb-3">
                      {t.tips.map((tip, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="mt-0.5 shrink-0 text-brand-orange text-[11px]">✦</span>
                          <span className="font-euclid text-[12px] text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-start gap-2 rounded-lg bg-[#FFF5EC] border border-brand-orange/20 p-3">
                      <SparkleIcon />
                      <p className="font-euclid text-[11px] text-brand-orange font-medium">{t.remedy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Defects */}
            {activeSection === "defects" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-[#F0E8DF] bg-[#FFF5EC] p-5 shadow-sm" style={{ borderLeft: "4px solid #FF6F00" }}>
                  <h2 className="font-poppins text-[16px] font-bold text-[#1A1A1A] mb-1">Common Vastu Defects & Remedies</h2>
                  <p className="font-euclid text-[13px] text-gray-600">Identify and correct major Vastu doshas in your space with practical, affordable remedies.</p>
                </div>
                {DEFECTS.map((d, i) => (
                  <div key={i} className={`rounded-xl border p-4 shadow-sm ${d.severity === "High" ? "border-red-100 bg-red-50/40" : "border-yellow-100 bg-yellow-50/40"} hover:shadow-md transition-all`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[22px]">{d.icon}</span>
                        <p className="font-poppins text-[13px] font-bold text-[#1A1A1A]">{d.name}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-poppins text-[10px] font-bold ${
                        d.severity === "High" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                      }`}>{d.severity} Impact</span>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-white/60 border border-white p-3">
                      <SparkleIcon />
                      <p className="font-euclid text-[12px] text-gray-700 leading-relaxed"><b className="text-brand-orange">Remedy: </b>{d.remedy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}