import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import Footer from "@/components/v2/Footer";
import Navbar from "@/components/v2/Navbar";
import { useState } from "react";

// ── Mock Data ────────────────────────────────────────────────────────────────
const TAROT_TABS = ["All", "Love & Relationships", "Career & Finance", "Health", "Spiritual"];

const TAROT_READERS = [
  { id: 1, name: "Priya Sharma", specialty: "Tarot | Oracle Cards", rating: "4.9", reviews: 128, experience: "6 Years", location: "Delhi | NCR", price: 18, originalPrice: 32, online: true, avatar: "PS", color: "#FF6F00" },
  { id: 2, name: "Meera Nair", specialty: "Tarot | Angel Cards", rating: "5.0", reviews: 203, experience: "9 Years", location: "Mumbai | Maharashtra", price: 22, originalPrice: 40, online: true, avatar: "MN", color: "#34A853" },
  { id: 3, name: "Anita Verma", specialty: "Tarot | Celtic Spread", rating: "4.8", reviews: 95, experience: "5 Years", location: "Jaipur | Rajasthan", price: 15, originalPrice: 28, online: false, avatar: "AV", color: "#1976D2" },
  { id: 4, name: "Sunita Rao", specialty: "Tarot | Numerology", rating: "4.7", reviews: 74, experience: "4 Years", location: "Bangalore | Karnataka", price: 14, originalPrice: 25, online: true, avatar: "SR", color: "#FF81CA" },
  { id: 5, name: "Kavita Joshi", specialty: "Tarot | Love Spread", rating: "4.9", reviews: 156, experience: "7 Years", location: "Pune | Maharashtra", price: 20, originalPrice: 36, online: true, avatar: "KJ", color: "#34CFB6" },
  { id: 6, name: "Radha Mishra", specialty: "Tarot | Career Spread", rating: "4.6", reviews: 61, experience: "3 Years", location: "Lucknow | UP", price: 12, originalPrice: 22, online: false, avatar: "RM", color: "#925CB4" },
  { id: 7, name: "Deepa Pillai", specialty: "Tarot | Spiritual Reading", rating: "5.0", reviews: 310, experience: "12 Years", location: "Chennai | Tamil Nadu", price: 30, originalPrice: 55, online: true, avatar: "DP", color: "#FF6F00" },
  { id: 8, name: "Pooja Singh", specialty: "Tarot | Past Life", rating: "4.8", reviews: 88, experience: "5 Years", location: "Varanasi | UP", price: 17, originalPrice: 30, online: true, avatar: "PS2", color: "#34A853" },
];

const TAROT_CARDS = [
  { name: "The Fool", emoji: "🌟", meaning: "New Beginnings", color: "#FFF7F0" },
  { name: "The Lovers", emoji: "💕", meaning: "Love & Union", color: "#FFF0F5" },
  { name: "The Star", emoji: "⭐", meaning: "Hope & Renewal", color: "#F0F5FF" },
  { name: "The Moon", emoji: "🌙", meaning: "Intuition", color: "#F5F0FF" },
  { name: "The Sun", emoji: "☀️", meaning: "Joy & Success", color: "#FFFBF0" },
  { name: "The World", emoji: "🌍", meaning: "Completion", color: "#F0FFF5" },
];

const WHY_CARDS = [
  { icon: "🔮", title: "Verified Tarot Readers", desc: "All readers are tested and verified for genuine tarot expertise." },
  { icon: "💬", title: "Chat & Call Readings", desc: "Connect via chat or voice call for a personal reading experience." },
  { icon: "🔒", title: "100% Confidential", desc: "Your sessions are private and your data is fully secure." },
  { icon: "⚡", title: "Instant Connection", desc: "Connect with a reader in seconds, any time of the day." },
];

// ── Star Rating Component ────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="10" height="10" viewBox="0 0 24 24" fill={n <= Math.round(parseFloat(rating)) ? "#FFCC33" : "#E0E0E0"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ── Reader Card ──────────────────────────────────────────────────────────────
function ReaderCard({ reader }) {
  return (
    <div className="group relative w-full rounded-[10px] border border-[#DADADA] bg-white transition-all hover:border-[#FFCC33] hover:shadow-lg cursor-pointer">
      {/* Status badge */}
      <div className={`absolute left-[9px] top-[9px] z-10 rounded-[5px] px-3 py-1 text-[10px] font-semibold text-white ${reader.online ? "bg-[#34A853]" : "bg-[#D41000]"}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}>
        {reader.online ? "Online" : "Offline"}
      </div>

      {/* Avatar — half outside card */}
      <div className="absolute -top-[50px] left-1/2 -translate-x-1/2">
        <div className="relative">
          <div
            className="h-[100px] w-[100px] rounded-full border-2 border-[#DADADA] flex items-center justify-center text-2xl font-bold text-white shadow-md group-hover:border-[#FF6F00] transition-colors"
            style={{ background: `linear-gradient(135deg, ${reader.color}, ${reader.color}99)`, fontFamily: "'Poppins', sans-serif" }}>
            {reader.avatar.slice(0, 2)}
          </div>
          <button className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-400 px-3 py-[3px] text-[10px] font-semibold text-white transition-colors group-hover:bg-[#FF6F00]"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            + Follow
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="px-[14px] pb-3 pt-[70px] text-center">
        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-[12px] font-semibold text-[#34A853]" style={{ fontFamily: "'Poppins', sans-serif" }}>₹{reader.price}/Min</span>
          <span className="text-[10px] font-semibold text-[#CCCCCC] line-through" style={{ fontFamily: "'Poppins', sans-serif" }}>₹{reader.originalPrice}/Min</span>
        </div>

        {/* Name */}
        <h3 className="mt-1.5 text-[18px] font-bold text-black" style={{ fontFamily: "'DM Sans', sans-serif" }}>{reader.name}</h3>

        {/* Specialty */}
        <p className="text-[12px] text-[#575757] mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>{reader.specialty}</p>

        {/* Rating row */}
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <Stars rating={reader.rating} />
          <span className="text-[11px] font-semibold text-[#575757]" style={{ fontFamily: "'Poppins', sans-serif" }}>{reader.rating} ({reader.reviews})</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-center gap-3 mt-1.5 text-[11px] text-[#7E7E7E]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <span>🗓 {reader.experience}</span>
          <span>📍 {reader.location.split("|")[0]}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-[#DADADA] bg-gray-50 py-[8px] text-[12px] font-semibold text-black transition-colors group-hover:border-[#FF6F00] group-hover:bg-[#FF6F00] group-hover:text-white"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            💬 CHAT
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-[#DADADA] bg-gray-50 py-[8px] text-[12px] font-semibold text-black transition-colors group-hover:border-[#FF6F00] group-hover:bg-[#FF6F00] group-hover:text-white"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            📞 CALL
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function TarotReadingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = TAROT_READERS.filter(r =>
    search === "" || r.name.toLowerCase().includes(search.toLowerCase()) || r.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="min-h-screen bg-white">
         <Navbar />
         <BreadcrumbHeader
  title="Online"
  highlight="Tarot Reading"
  description="Connect with expert tarot readers for intuitive guidance on love, career, health, and life decisions. Get accurate tarot card readings via chat or call — anytime, anywhere, completely confidential."
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Tarot Reading" }
  ]}
/>
      {/* ── Featured Cards Carousel ── */}
      <section className="w-full bg-[#FFFCF0] py-8 md:py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
          <div className="mb-6 text-center">
            <h2 className="text-[22px] font-bold uppercase text-[#FF6F00] md:text-[25px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Pull A Card — Your Message Awaits
            </h2>
            <p className="mt-1 text-[13px] text-[#575757]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Click any card for a glimpse into its wisdom
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {TAROT_CARDS.map((card) => (
              <TarotCardTile key={card.name} card={card} />
            ))}
          </div>
        </div>
      </section>

    

      

      {/* ── Why Choose Section ── */}
      <section className="w-full bg-[#FFFCF0] py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
          <div className="mb-8 text-center">
            <h2 className="text-[22px] font-bold uppercase text-[#FF6F00] md:text-[25px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Why Choose Astrogurujii Tarot?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CARDS.map(card => (
              <div key={card.title} className="rounded-[10px] border border-[rgba(255,111,0,0.15)] bg-white p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3 text-4xl">{card.icon}</div>
                <h3 className="mb-1.5 text-[15px] font-semibold text-[#151924]" style={{ fontFamily: "'Poppins', sans-serif" }}>{card.title}</h3>
                <p className="text-[12px] leading-[20px] text-[#575757]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="w-full bg-white py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
          <div className="mb-8 text-center">
            <h2 className="text-[22px] font-bold uppercase text-[#FF6F00] md:text-[25px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto max-w-[800px] space-y-3">
            <FaqItem q="What is tarot reading?" a="Tarot reading is an ancient practice where a reader interprets cards drawn from a tarot deck to provide guidance on life situations — love, career, health, and more." />
            <FaqItem q="How accurate are online tarot readings?" a="Our verified readers are experienced professionals. While tarot provides guidance and insight, it is best used as a tool for reflection and decision-making rather than absolute prediction." />
            <FaqItem q="How do I connect with a tarot reader?" a="Simply browse the list of available readers, check their specialty and price, then click Chat or Call to connect instantly." />
            <FaqItem q="Is my reading confidential?" a="Yes, all sessions on Astrogurujii are 100% confidential. We never share your personal information or session content." />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
     <Footer />
    </div>
  );
}

// ── Tarot Card Tile ──────────────────────────────────────────────────────────
function TarotCardTile({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      className="cursor-pointer rounded-[12px] border border-[rgba(255,111,0,0.2)] w-[130px] sm:w-[150px] text-center shadow-sm hover:shadow-md transition-all select-none"
      style={{ background: flipped ? card.color : "#FFF7F0" }}>
      <div className="p-4">
        <div className="mb-2 text-4xl">{flipped ? card.emoji : "🂠"}</div>
        <p className="text-[13px] font-semibold text-[#151924]" style={{ fontFamily: "'Poppins', sans-serif" }}>{card.name}</p>
        {flipped && <p className="mt-1 text-[11px] text-[#FF6F00]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.meaning}</p>}
        {!flipped && <p className="mt-1 text-[11px] text-[#A0A0A0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tap to reveal</p>}
      </div>
    </div>
  );
}

// ── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[8px] border border-[rgba(255,111,0,0.15)] bg-white overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        style={{ fontFamily: "'Poppins', sans-serif" }}>
        <span className="text-[14px] font-semibold text-[#151924]">{q}</span>
        <span className={`text-[#FF6F00] text-xl font-bold transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-[13px] leading-[22px] text-[#575757]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
        </div>
      )}
    </div>
  );
}