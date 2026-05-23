import React, { useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

// ─── Icons ────────────────────────────────────────────────────────────────────

const NumberIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange mt-0.5 shrink-0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const NUMBER_MEANINGS: Record<number, { planet: string; keyword: string; traits: string[]; career: string; love: string; finance: string; color: string; gemstone: string; mantra: string }> = {
  1: { planet: "Sun", keyword: "Leadership", color: "#FF6F00", gemstone: "Ruby", mantra: "Om Hreem Suryaye Namah", traits: ["Natural born leader", "Highly independent", "Ambitious and driven", "Original thinker"], career: "Best suited for entrepreneurship, CEO roles, politics, military, and any position of authority and leadership.", love: "Dominant in relationships. Needs a partner who is supportive yet strong. Very loyal and protective once committed.", finance: "Excellent money-making ability. Tendency to spend lavishly. Build savings discipline for long-term security." },
  2: { planet: "Moon", keyword: "Harmony", color: "#4ac9d9", gemstone: "Pearl", mantra: "Om Shreem Chandraye Namah", traits: ["Deeply intuitive", "Diplomatic peacemaker", "Emotionally sensitive", "Cooperative and supportive"], career: "Thrives in counseling, nursing, teaching, hospitality, music, and any role involving emotional support and cooperation.", love: "Most romantic of all numbers. Devoted, caring and deeply emotionally connected. Needs security and affirmation.", finance: "Prefers financial stability over risk. Good at managing others' finances. Needs to overcome fear of financial scarcity." },
  3: { planet: "Jupiter", keyword: "Creativity", color: "#f39c12", gemstone: "Yellow Sapphire", mantra: "Om Graam Greem Graum Sah Gurave Namah", traits: ["Brilliantly creative", "Highly expressive", "Naturally optimistic", "Socially magnetic"], career: "Excels in arts, writing, entertainment, teaching, public relations, marketing, and any creative or communication field.", love: "Charming and fun romantic partner. Sometimes flirtatious — needs freedom. Most compatible with numbers 1, 5, and 9.", finance: "Money flows easily but spends freely. Needs budgeting. Multiple income streams suit the 3's diverse talents." },
  4: { planet: "Rahu", keyword: "Foundation", color: "#607D8B", gemstone: "Hessonite (Gomed)", mantra: "Om Raam Rahave Namah", traits: ["Highly disciplined", "Practical and methodical", "Incredibly reliable", "Values hard work deeply"], career: "Born for engineering, architecture, accounting, law, real estate, project management and any field requiring systematic work.", love: "Stable, loyal and dependable partner. Slow to open up but deeply committed once they do. Values traditions.", finance: "Excellent at building wealth slowly and steadily. Real estate and fixed investments are ideal. Avoids unnecessary risk." },
  5: { planet: "Mercury", keyword: "Freedom", color: "#34a853", gemstone: "Emerald", mantra: "Om Braam Breem Braum Sah Budhaye Namah", traits: ["Highly adaptable", "Adventurous spirit", "Quick-witted communicator", "Lover of freedom"], career: "Excellent in sales, travel, media, PR, advertising, trading, and any field requiring quick thinking and adaptability.", love: "Needs freedom and variety in relationships. Exciting and stimulating partner. Commitment requires finding the right match.", finance: "Money comes and goes. Natural talent for quick financial opportunities. Needs to build an emergency financial foundation." },
  6: { planet: "Venus", keyword: "Nurturing", color: "#e74c8b", gemstone: "Diamond", mantra: "Om Draam Dreem Draum Sah Shukraye Namah", traits: ["Deeply nurturing", "Highly responsible", "Artistic and aesthetic", "Family-centered heart"], career: "Thrives in healthcare, teaching, interior design, hospitality, social work, beauty industry and community service roles.", love: "Most devoted and family-oriented number. Excellent parent and partner. Creates a beautiful, harmonious home environment.", finance: "Financially responsible and generous. May overspend on family. Steady income from service-oriented professions." },
  7: { planet: "Ketu", keyword: "Wisdom", color: "#9b59b6", gemstone: "Cat's Eye (Lahsuniya)", mantra: "Om Sraam Sreem Sraum Sah Ketave Namah", traits: ["Deeply philosophical", "Spiritually inclined", "Analytical genius", "Seeker of truth"], career: "Best in research, science, philosophy, spirituality, psychology, writing, and any field requiring deep analytical thinking.", love: "Needs intellectual and spiritual connection. Can be emotionally reserved. Deep, meaningful relationships over casual ones.", finance: "Not motivated by money but money often comes through expertise. Avoid gambling or speculation. Steady investments work." },
  8: { planet: "Saturn", keyword: "Power", color: "#1a1a2e", gemstone: "Blue Sapphire (Neelam)", mantra: "Om Praang Preeng Praung Sah Shanaischaraye Namah", traits: ["Highly ambitious", "Business-minded powerhouse", "Strong and resilient", "Master of material world"], career: "Born for business, finance, law, real estate, management and any field requiring executive authority and financial acumen.", love: "Serious and committed. Takes time to open up. Once committed, extremely loyal and protective of loved ones.", finance: "Greatest financial potential of all numbers. Build wealth methodically. Watch for workaholism that sacrifices relationships." },
  9: { planet: "Mars", keyword: "Humanitarian", color: "#e74c4c", gemstone: "Red Coral (Moonga)", mantra: "Om Kraam Kreem Kraum Sah Bhaumaye Namah", traits: ["Deeply compassionate", "Natural humanitarian", "Highly idealistic", "Courageous and selfless"], career: "Excels in social work, military, medicine, law, spirituality, arts, and any field that serves the greater good of humanity.", love: "Romantic, generous and idealistic in love. Needs a partner who shares their values and humanitarian outlook.", finance: "Generous to a fault — money often donated or spent helping others. Need to balance generosity with personal financial security." },
};

const LETTER_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

function reduceToSingle(n: number): number {
  while (n > 9) { n = String(n).split("").reduce((a, d) => a + Number(d), 0); }
  return n;
}

function lifePathNumber(dob: string): number {
  if (!dob) return 1;
  const digits = dob.replace(/-/g, "").split("").reduce((a, d) => a + Number(d), 0);
  return reduceToSingle(digits);
}

function destinyNumber(name: string): number {
  if (!name) return 1;
  const sum = name.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((a, c) => a + (LETTER_VALUES[c] || 0), 0);
  return reduceToSingle(sum);
}

function soulNumber(name: string): number {
  if (!name) return 1;
  const vowels = "AEIOU";
  const sum = name.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(c => vowels.includes(c)).reduce((a, c) => a + (LETTER_VALUES[c] || 0), 0);
  return reduceToSingle(sum || 1);
}

function personalityNumber(name: string): number {
  if (!name) return 1;
  const vowels = "AEIOU";
  const sum = name.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(c => !vowels.includes(c)).reduce((a, c) => a + (LETTER_VALUES[c] || 0), 0);
  return reduceToSingle(sum || 1);
}

// ─── Number Circle ─────────────────────────────────────────────────────────────

function NumberCircle({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-md" style={{ borderColor: color, background: color + "15" }}>
        <span className="font-poppins text-[26px] font-bold" style={{ color }}>{num}</span>
      </div>
      <span className="font-poppins text-[10px] font-semibold text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NumerologyPage() {
  const [form, setForm] = useState({ name: "", dob: "" });
  const [generated, setGenerated] = useState(false);
  const [activeNum, setActiveNum] = useState<"lifepath" | "destiny" | "soul" | "personality">("lifepath");

  const lp = lifePathNumber(form.dob);
  const dn = destinyNumber(form.name);
  const sn = soulNumber(form.name);
  const pn = personalityNumber(form.name);

  const numMap = { lifepath: lp, destiny: dn, soul: sn, personality: pn };
  const activeNumber = numMap[activeNum];
  const info = NUMBER_MEANINGS[activeNumber] || NUMBER_MEANINGS[1];

  const NUM_TABS = [
    { id: "lifepath" as const, label: "Life Path", num: lp },
    { id: "destiny" as const, label: "Destiny", num: dn },
    { id: "soul" as const, label: "Soul Urge", num: sn },
    { id: "personality" as const, label: "Personality", num: pn },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BreadcrumbHeader
        title="Numerology"
        highlight="Free Numerology"
        description="Unlock the mystical power of numbers. Discover your Life Path, Destiny, Soul Urge and Personality numbers and what they reveal about your true purpose."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Numerology" }]}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-[94px] lg:py-10">
        {!generated ? (
          <div className="mx-auto max-w-xl">
            {/* Form */}
            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAFAFA] p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF5EC] text-brand-orange"><NumberIcon /></div>
                <div>
                  <h2 className="font-poppins text-[16px] font-bold text-[#1A1A1A]">Calculate Your Numbers</h2>
                  <p className="font-euclid text-[12px] text-gray-400">Use your full birth name for accurate results</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-gray-600"><UserIcon /> Full Name (as on birth certificate)</label>
                  <input type="text" placeholder="e.g. Priya Anand Sharma" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E0D5CC] bg-white px-4 py-2.5 font-euclid text-[13px] text-gray-700 outline-none focus:border-brand-orange transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-poppins text-[12px] font-semibold text-gray-600"><CalendarIcon /> Date of Birth</label>
                  <input type="date" value={form.dob}
                    onChange={e => setForm({ ...form, dob: e.target.value })}
                    className="w-full rounded-xl border border-[#E0D5CC] bg-white px-4 py-2.5 font-euclid text-[13px] text-gray-700 outline-none focus:border-brand-orange transition-colors" />
                </div>
                <button onClick={() => setGenerated(true)}
                  className="mt-2 rounded-xl bg-brand-orange py-3 font-poppins text-[14px] font-bold text-white shadow-md hover:opacity-90 transition-opacity">
                  Reveal My Numbers ✨
                </button>
              </div>
            </div>

            {/* What you'll get */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { num: "Life Path", desc: "Your soul's mission and core purpose in this lifetime" },
                { num: "Destiny", desc: "What you are destined to achieve and contribute to the world" },
                { num: "Soul Urge", desc: "Your innermost desires, heart's deepest motivations" },
                { num: "Personality", desc: "How the world perceives you and the image you project" },
              ].map((f, i) => (
                <div key={i} className="rounded-xl border border-[#F0E8DF] bg-white p-3 shadow-sm">
                  <p className="font-poppins text-[11px] font-bold text-brand-orange mb-1">{f.num} Number</p>
                  <p className="font-euclid text-[10px] text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Pythagoras table */}
            <div className="mt-4 rounded-2xl border border-[#F0E8DF] bg-white p-4 shadow-sm">
              <p className="font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Pythagorean Letter-Number Grid</p>
              <div className="grid grid-cols-9 gap-1 text-center">
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <div key={n} className="rounded-lg bg-[#FFF5EC] py-1.5">
                    <span className="font-poppins text-[12px] font-bold text-brand-orange">{n}</span>
                  </div>
                ))}
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l, i) => (
                  <div key={l} className="rounded py-1">
                    <span className="font-euclid text-[10px] text-gray-500">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row">

            {/* Left */}
            <div className="w-full shrink-0 lg:w-[280px]">
              {/* Profile + numbers */}
              <div className="mb-4 rounded-2xl border border-[#F0E8DF] bg-[#FFF5EC] p-5 shadow-sm" style={{ borderLeft: "4px solid #FF6F00" }}>
                <p className="font-poppins text-[15px] font-bold text-[#1A1A1A] mb-0.5">{form.name || "Your Reading"}</p>
                <p className="font-euclid text-[11px] text-gray-500 mb-4">{form.dob}</p>
                <div className="grid grid-cols-2 gap-3">
                  <NumberCircle num={lp} label="Life Path" color={NUMBER_MEANINGS[lp]?.color || "#FF6F00"} />
                  <NumberCircle num={dn} label="Destiny" color={NUMBER_MEANINGS[dn]?.color || "#FF6F00"} />
                  <NumberCircle num={sn} label="Soul Urge" color={NUMBER_MEANINGS[sn]?.color || "#FF6F00"} />
                  <NumberCircle num={pn} label="Personality" color={NUMBER_MEANINGS[pn]?.color || "#FF6F00"} />
                </div>
              </div>

              {/* Lucky details */}
              <div className="rounded-2xl border border-[#F0E8DF] bg-white p-4 shadow-sm">
                <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400">Key Details</p>
                {[
                  { label: "Ruling Planet", value: info.planet },
                  { label: "Lucky Gemstone", value: info.gemstone },
                  { label: "Power Color", value: info.color },
                  { label: "Core Keyword", value: info.keyword },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between py-1.5 border-b border-[#F0E8DF] last:border-0">
                    <span className="font-poppins text-[11px] text-gray-400">{d.label}</span>
                    {d.label === "Power Color" ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border border-gray-200" style={{ background: d.value }} />
                      </div>
                    ) : (
                      <span className="font-poppins text-[11px] font-bold text-brand-orange">{d.value}</span>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => setGenerated(false)}
                className="mt-4 w-full rounded-xl border border-[#E0D5CC] py-2.5 font-poppins text-[12px] font-semibold text-gray-500 hover:border-brand-orange hover:text-brand-orange transition-colors">
                ← Recalculate
              </button>
            </div>

            {/* Right */}
            <div className="flex-1 min-w-0">
              {/* Tabs */}
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {NUM_TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveNum(t.id)}
                    className={`shrink-0 flex items-center gap-2 rounded-[6px] px-4 py-[7px] font-poppins text-[12px] font-semibold transition-all ${
                      activeNum === t.id ? "bg-brand-orange text-white shadow-md" : "border border-[#E0D5CC] text-[#666] hover:border-brand-orange hover:text-brand-orange"
                    }`}>
                    {t.label}
                    <span className={`rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold ${activeNum === t.id ? "bg-white/30 text-white" : "bg-[#FFF5EC] text-brand-orange"}`}>{t.num}</span>
                  </button>
                ))}
              </div>

              {/* Hero banner */}
              <div className="mb-4 rounded-2xl p-6 shadow-sm" style={{ background: `linear-gradient(135deg, ${info.color}15, ${info.color}08)`, borderLeft: `4px solid ${info.color}` }}>
                <div className="flex items-start gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl shadow-md" style={{ background: info.color + "20", border: `2px solid ${info.color}` }}>
                    <span className="font-poppins text-[42px] font-bold" style={{ color: info.color }}>{activeNumber}</span>
                  </div>
                  <div>
                    <p className="font-euclid text-[11px] uppercase tracking-widest text-gray-400">{NUM_TABS.find(t => t.id === activeNum)?.label} Number</p>
                    <h2 className="font-poppins text-[22px] font-bold text-[#1A1A1A]">Number {activeNumber} · {info.keyword}</h2>
                    <p className="font-euclid text-[12px] text-gray-500 mt-0.5">Ruled by {info.planet} · {info.gemstone}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {info.traits.map((t, i) => (
                        <span key={i} className="rounded-full px-2.5 py-0.5 font-poppins text-[10px] font-semibold text-white" style={{ background: info.color }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-lg border p-3" style={{ background: info.color + "08", borderColor: info.color + "30" }}>
                  <SparkleIcon />
                  <p className="font-poppins text-[11px] font-semibold italic" style={{ color: info.color }}>{info.mantra}</p>
                </div>
              </div>

              {/* Detail cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
                {[
                  { label: "Career & Work", content: info.career },
                  { label: "Love & Relationships", content: info.love },
                  { label: "Finance & Wealth", content: info.finance },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl border border-[#F0E8DF] bg-white p-4 shadow-sm hover:border-brand-orange/30 hover:shadow-md transition-all">
                    <p className="font-poppins text-[11px] font-bold uppercase tracking-wide text-brand-orange mb-2">{c.label}</p>
                    <p className="font-euclid text-[12px] leading-[1.7] text-gray-600">{c.content}</p>
                  </div>
                ))}
              </div>

              {/* All number compatibility */}
              <div className="rounded-2xl border border-[#F0E8DF] bg-white p-5 shadow-sm">
                <h3 className="font-poppins text-[13px] font-bold text-[#1A1A1A] mb-4">Number Compatibility Chart</h3>
                <div className="grid grid-cols-9 gap-2">
                  {[1,2,3,4,5,6,7,8,9].map(n => {
                    const m = NUMBER_MEANINGS[n];
                    const isActive = n === activeNumber;
                    return (
                      <div key={n} className={`flex flex-col items-center gap-1 rounded-xl p-2 border-2 transition-all ${isActive ? "border-brand-orange bg-[#FFF5EC]" : "border-transparent bg-[#FAFAFA]"}`}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: m.color + (isActive ? "30" : "15") }}>
                          <span className="font-poppins text-[13px] font-bold" style={{ color: m.color }}>{n}</span>
                        </div>
                        <span className="font-euclid text-[8px] text-gray-400 text-center">{m.planet}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}