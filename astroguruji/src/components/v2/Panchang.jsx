import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import BreadcrumbHeader from "./BreadcrumbHeader";

// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

// ─── Types & Constants ───────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const TITHIS = [
  { number: 1,  name: "Pratipada",  sanskrit: "प्रतिपदा",  deity: "Agni",    quality: "Auspicious",        suitable: "New beginnings, starting ventures, travel" },
  { number: 2,  name: "Dwitiya",    sanskrit: "द्वितीया",   deity: "Brahma",  quality: "Auspicious",        suitable: "Building foundations, partnerships, education" },
  { number: 3,  name: "Tritiya",    sanskrit: "तृतीया",     deity: "Gauri",   quality: "Highly Auspicious", suitable: "Marriage, beauty rituals, ornaments" },
  { number: 4,  name: "Chaturthi",  sanskrit: "चतुर्थी",    deity: "Ganesha", quality: "Mixed",             suitable: "Removing obstacles, Ganesh worship" },
  { number: 5,  name: "Panchami",   sanskrit: "पञ्चमी",     deity: "Naga",    quality: "Auspicious",        suitable: "Serpent worship, healing, medicine" },
  { number: 6,  name: "Shashthi",   sanskrit: "षष्ठी",      deity: "Kartik",  quality: "Auspicious",        suitable: "War strategy, vigour, strength" },
  { number: 7,  name: "Saptami",    sanskrit: "सप्तमी",     deity: "Surya",   quality: "Auspicious",        suitable: "Sun worship, government work, travel" },
  { number: 8,  name: "Ashtami",    sanskrit: "अष्टमी",     deity: "Rudra",   quality: "Mixed",             suitable: "Courage, surgery, weapons" },
  { number: 9,  name: "Navami",     sanskrit: "नवमी",       deity: "Durga",   quality: "Auspicious",        suitable: "Devi worship, valor, fire rituals" },
  { number: 10, name: "Dashami",    sanskrit: "दशमी",       deity: "Dharma",  quality: "Auspicious",        suitable: "Good deeds, charity, Vishnu worship" },
  { number: 11, name: "Ekadashi",   sanskrit: "एकादशी",     deity: "Vishnu",  quality: "Highly Auspicious", suitable: "Fasting, spiritual sadhana, Hari worship" },
  { number: 12, name: "Dwadashi",   sanskrit: "द्वादशी",    deity: "Vishnu",  quality: "Auspicious",        suitable: "Breaking Ekadashi fast, charity" },
  { number: 13, name: "Trayodashi", sanskrit: "त्रयोदशी",   deity: "Kamadeva",quality: "Auspicious",        suitable: "Love, romance, beauty, art" },
  { number: 14, name: "Chaturdashi",sanskrit: "चतुर्दशी",   deity: "Shiva",   quality: "Mixed",             suitable: "Shiva worship, tantra, extreme practices" },
  { number: 15, name: "Purnima",    sanskrit: "पूर्णिमा",   deity: "Chandra", quality: "Highly Auspicious", suitable: "Full moon rites, meditation, all auspicious works" },
];

const NAKSHATRAS = [
  { id:1,  name:"Ashwini",     symbol:"🐴", ruling_planet:"Ketu",    deity:"Ashwini Kumaras", nature:"Light",    qualities:"Quick, healing, movement, initiative" },
  { id:2,  name:"Bharani",     symbol:"🔺", ruling_planet:"Venus",   deity:"Yama",            nature:"Fierce",   qualities:"Restraint, endurance, transformation, death" },
  { id:3,  name:"Krittika",    symbol:"🔪", ruling_planet:"Sun",     deity:"Agni",            nature:"Mixed",    qualities:"Purification, sharp, cutting through illusion" },
  { id:4,  name:"Rohini",      symbol:"🌸", ruling_planet:"Moon",    deity:"Brahma",          nature:"Fixed",    qualities:"Fertility, beauty, creativity, abundance" },
  { id:5,  name:"Mrigashira",  symbol:"🦌", ruling_planet:"Mars",    deity:"Soma",            nature:"Soft",     qualities:"Seeking, gentleness, sensitivity" },
  { id:6,  name:"Ardra",       symbol:"💎", ruling_planet:"Rahu",    deity:"Rudra",           nature:"Sharp",    qualities:"Storms, effort, destruction and renewal" },
  { id:7,  name:"Punarvasu",   symbol:"🏹", ruling_planet:"Jupiter", deity:"Aditi",           nature:"Movable",  qualities:"Return, renewal, goodness, restoration" },
  { id:8,  name:"Pushya",      symbol:"🌼", ruling_planet:"Saturn",  deity:"Brihaspati",      nature:"Light",    qualities:"Nourishment, spiritual growth, protection" },
  { id:9,  name:"Ashlesha",    symbol:"🐍", ruling_planet:"Mercury", deity:"Nagas",           nature:"Sharp",    qualities:"Serpentine wisdom, clinging, occult" },
  { id:10, name:"Magha",       symbol:"👑", ruling_planet:"Ketu",    deity:"Pitrs",           nature:"Fierce",   qualities:"Ancestral power, royalty, authority" },
  { id:11, name:"Purva Phalguni",symbol:"🛋️",ruling_planet:"Venus",  deity:"Bhaga",           nature:"Fierce",   qualities:"Pleasure, rest, creativity, love" },
  { id:12, name:"Uttara Phalguni",symbol:"🛏️",ruling_planet:"Sun",  deity:"Aryaman",         nature:"Fixed",    qualities:"Contracts, service, marriage, social connections" },
  { id:13, name:"Hasta",       symbol:"✋", ruling_planet:"Moon",    deity:"Surya",           nature:"Light",    qualities:"Skill, dexterity, healing hands" },
  { id:14, name:"Chitra",      symbol:"💫", ruling_planet:"Mars",    deity:"Vishwakarma",     nature:"Soft",     qualities:"Artistry, beauty, architecture, design" },
  { id:15, name:"Swati",       symbol:"🌬️", ruling_planet:"Rahu",   deity:"Vayu",            nature:"Movable",  qualities:"Independence, flexibility, wind, business" },
  { id:16, name:"Vishakha",    symbol:"⚡", ruling_planet:"Jupiter", deity:"Indra & Agni",    nature:"Mixed",    qualities:"Ambition, determination, intensity" },
  { id:17, name:"Anuradha",    symbol:"🌟", ruling_planet:"Saturn",  deity:"Mitra",           nature:"Soft",     qualities:"Devotion, friendship, travel, spirituality" },
  { id:18, name:"Jyeshtha",    symbol:"🔱", ruling_planet:"Mercury", deity:"Indra",           nature:"Sharp",    qualities:"Leadership, protection, courage, seniority" },
  { id:19, name:"Mula",        symbol:"🌿", ruling_planet:"Ketu",    deity:"Nirriti",         nature:"Fierce",   qualities:"Roots, research, extremes, transformation" },
  { id:20, name:"Purva Ashadha",symbol:"🌊",ruling_planet:"Venus",   deity:"Apas",            nature:"Fierce",   qualities:"Victory, invincibility, water, purification" },
  { id:21, name:"Uttara Ashadha",symbol:"🐘",ruling_planet:"Sun",   deity:"Vishwedeva",       nature:"Fixed",    qualities:"Immovable victory, stability, righteousness" },
  { id:22, name:"Shravana",    symbol:"👂", ruling_planet:"Moon",    deity:"Vishnu",          nature:"Movable",  qualities:"Listening, learning, connection, Vishnu" },
  { id:23, name:"Dhanishtha",  symbol:"🥁", ruling_planet:"Mars",    deity:"Ashta Vasus",     nature:"Movable",  qualities:"Wealth, music, rhythm, abundance" },
  { id:24, name:"Shatabhisha", symbol:"⭕", ruling_planet:"Rahu",    deity:"Varuna",          nature:"Movable",  qualities:"Healing, mystery, 100 stars, independence" },
  { id:25, name:"Purva Bhadra",symbol:"⚔️", ruling_planet:"Jupiter",deity:"Aja Ekapada",      nature:"Fierce",   qualities:"Fiery, passionate, transformation, mystical" },
  { id:26, name:"Uttara Bhadra",symbol:"🐍",ruling_planet:"Saturn", deity:"Ahir Budhnya",     nature:"Fixed",    qualities:"Depth, serpentine wisdom, stability, moksha" },
  { id:27, name:"Revati",      symbol:"🐟", ruling_planet:"Mercury", deity:"Pushan",          nature:"Soft",     qualities:"Journey's end, nourishment, completion, fish" },
];

const YOGAS = [
  { name:"Vishkumbha", meaning:"Bearer of Poison",    quality:"Inauspicious" },
  { name:"Priti",      meaning:"Love & Affection",    quality:"Auspicious"   },
  { name:"Ayushman",   meaning:"Long Life",           quality:"Auspicious"   },
  { name:"Saubhagya",  meaning:"Good Fortune",        quality:"Auspicious"   },
  { name:"Shobhana",   meaning:"Splendid",            quality:"Auspicious"   },
  { name:"Atiganda",   meaning:"Danger Everywhere",   quality:"Inauspicious" },
  { name:"Sukarman",   meaning:"Virtuous Deeds",      quality:"Auspicious"   },
  { name:"Dhriti",     meaning:"Determination",       quality:"Auspicious"   },
  { name:"Shula",      meaning:"Spear / Pain",        quality:"Inauspicious" },
  { name:"Ganda",      meaning:"Danger",              quality:"Inauspicious" },
  { name:"Vriddhi",    meaning:"Growth & Increase",   quality:"Auspicious"   },
  { name:"Dhruva",     meaning:"Fixed & Immovable",   quality:"Auspicious"   },
  { name:"Vyaghata",   meaning:"Striking Down",       quality:"Inauspicious" },
  { name:"Harshana",   meaning:"Joyful, Thrilling",   quality:"Auspicious"   },
  { name:"Vajra",      meaning:"Thunderbolt",         quality:"Mixed"        },
  { name:"Siddhi",     meaning:"Accomplishment",      quality:"Auspicious"   },
  { name:"Vyatipata",  meaning:"Calamity",            quality:"Inauspicious" },
  { name:"Variyana",   meaning:"Comfort & Pleasure",  quality:"Auspicious"   },
  { name:"Parigha",    meaning:"Obstruction",         quality:"Inauspicious" },
  { name:"Shiva",      meaning:"Auspicious, Benign",  quality:"Auspicious"   },
  { name:"Siddha",     meaning:"Accomplished",        quality:"Auspicious"   },
  { name:"Sadhya",     meaning:"Achievable Goals",    quality:"Auspicious"   },
  { name:"Shubha",     meaning:"Auspicious",          quality:"Auspicious"   },
  { name:"Shukla",     meaning:"Bright & Pure",       quality:"Auspicious"   },
  { name:"Brahma",     meaning:"Universal Creator",   quality:"Auspicious"   },
  { name:"Indra",      meaning:"King of Gods",        quality:"Auspicious"   },
  { name:"Vaidhriti",  meaning:"Support the Weak",    quality:"Inauspicious" },
];

const KARANAS = [
  { name:"Bava",      type:"Movable", ruler:"Indra",      nature:"Auspicious"   },
  { name:"Balava",    type:"Movable", ruler:"Brahma",     nature:"Auspicious"   },
  { name:"Kaulava",   type:"Movable", ruler:"Mitra",      nature:"Auspicious"   },
  { name:"Taitila",   type:"Movable", ruler:"Aryaman",    nature:"Auspicious"   },
  { name:"Gara",      type:"Movable", ruler:"Bhumi",      nature:"Mixed"        },
  { name:"Vanija",    type:"Movable", ruler:"Varuna",     nature:"Auspicious"   },
  { name:"Vishti",    type:"Movable", ruler:"Yama",       nature:"Inauspicious" },
  { name:"Shakuni",   type:"Fixed",   ruler:"Bhadrakali", nature:"Mixed"        },
  { name:"Chatushpada",type:"Fixed",  ruler:"Mahadeva",   nature:"Mixed"        },
  { name:"Naga",      type:"Fixed",   ruler:"Naga",       nature:"Mixed"        },
  { name:"Kimstughna",type:"Fixed",   ruler:"Surya",      nature:"Auspicious"   },
];

const VARAS = [
  { name:"Ravivara",   english:"Sunday",    planet:"Sun",     symbol:"☀️", color:"#FF6F00", auspicious:"Sun worship, leadership, government work, gold" },
  { name:"Somavara",   english:"Monday",    planet:"Moon",    symbol:"🌙", color:"#4a90d9", auspicious:"Moon worship, travel, water, silver, mind peace" },
  { name:"Mangalavara",english:"Tuesday",   planet:"Mars",    symbol:"🔴", color:"#e74c3c", auspicious:"Courage, strength, property, surgery, Hanuman" },
  { name:"Budhavara",  english:"Wednesday", planet:"Mercury", symbol:"🟢", color:"#27ae60", auspicious:"Education, writing, commerce, green vegetables" },
  { name:"Guruvara",   english:"Thursday",  planet:"Jupiter", symbol:"🟡", color:"#f39c12", auspicious:"Wisdom, teaching, Vishnu worship, yellow things" },
  { name:"Shukravara", english:"Friday",    planet:"Venus",   symbol:"✨", color:"#e74c8b", auspicious:"Romance, arts, beauty, Lakshmi worship" },
  { name:"Shanivara",  english:"Saturday",  planet:"Saturn",  symbol:"🪐", color:"#555",    auspicious:"Discipline, Shani worship, hard work, iron, black sesame" },
];

const RAHU_KAAL = {
  0: "4:30 PM – 6:00 PM",
  1: "7:30 AM – 9:00 AM",
  2: "3:00 PM – 4:30 PM",
  3: "12:00 PM – 1:30 PM",
  4: "1:30 PM – 3:00 PM",
  5: "10:30 AM – 12:00 PM",
  6: "9:00 AM – 10:30 AM",
};

const ABHIJIT_MUHURTA = "11:48 AM – 12:36 PM";

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getTithiForDate(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return TITHIS[dayOfYear % 15];
}

function getNakshatraForDate(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return NAKSHATRAS[dayOfYear % 27];
}

function getYogaForDate(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return YOGAS[dayOfYear % 27];
}

function getKaranaForDate(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return KARANAS[dayOfYear % 11];
}

function getSunriseSunset() { return { sunrise: "6:02 AM", sunset: "6:48 PM" }; }
function getMoonrise()       { return "8:14 PM"; }

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function getSamvat(date)      { return `Vikram Samvat ${date.getFullYear() + 56}`; }
function getShakaSamvat(date) { return `Shaka Samvat ${date.getFullYear() - 78}`; }

function getMaas() {
  const months = ["Chaitra","Vaishakha","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha","Pausha","Magha","Phalguna"];
  return months[Math.floor(((new Date().getMonth() + 10) % 12))];
}

function getPaksha(date) { return date.getDate() <= 15 ? "Shukla Paksha" : "Krishna Paksha"; }
function getAyanamsha()  { return "23° 9' 54\" (Lahiri)"; }

function getMoonSign() {
  const signs = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"];
  return signs[Math.floor(new Date().getDate() / 2.5) % 12];
}

function getSunSign() {
  const signs = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"];
  return signs[new Date().getMonth() % 12];
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function QualityBadge({ quality }) {
  const colors = {
    "Auspicious":        { bg:"#e8f5e9", color:"#2e7d32", border:"#a5d6a7" },
    "Highly Auspicious": { bg:"#fff3e0", color:"#e65100", border:"#FFB74D" },
    "Inauspicious":      { bg:"#fce4ec", color:"#c62828", border:"#ef9a9a" },
    "Mixed":             { bg:"#ede7f6", color:"#4527a0", border:"#b39ddb" },
    "Sacred":            { bg:"#e3f2fd", color:"#0d47a1", border:"#90caf9" },
    "Neutral":           { bg:"#f5f5f5", color:"#616161", border:"#e0e0e0" },
  };
  const c = colors[quality] || colors["Neutral"];
  return (
    <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700, background:c.bg, color:c.color, border:`1px solid ${c.border}` }}>
      {quality}
    </span>
  );
}

function PanchangDetailCard({ icon, label, content }) {
  return (
    <div style={{ borderRadius:16, border:"1.5px solid #F0E8DF", background:"#FAFAFA", padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <span style={{ fontSize:20 }}>{icon}</span>
        <span style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:"#FF6F00" }}>{label}</span>
      </div>
      <p style={{ margin:0, fontSize:13, color:"#555", lineHeight:1.7 }}>{content}</p>
    </div>
  );
}

function NakshatraCard({ nakshatra, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", flexDirection:"column", alignItems:"center", gap:4,
      borderRadius:12, border:`1.5px solid ${isActive ? "#FF6F00" : "#F0E8DF"}`,
      background: isActive ? "#FFF5EC" : "#FAFAFA",
      padding:"10px 8px", cursor:"pointer", transition:"all 0.2s",
      boxShadow: isActive ? "0 4px 16px rgba(255,111,0,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
      minWidth:76,
    }}>
      <span style={{ fontSize:22 }}>{nakshatra.symbol}</span>
      <span style={{ fontSize:9, fontWeight:700, color: isActive ? "#FF6F00" : "#555", textAlign:"center", lineHeight:1.2 }}>{nakshatra.name}</span>
      <span style={{ fontSize:8, color:"#999" }}>{nakshatra.ruling_planet}</span>
    </button>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:600, color:"#555" }}>{label}</span>
        <span style={{ fontSize:11, fontWeight:700, color }}>{value}%</span>
      </div>
      <div style={{ height:6, borderRadius:99, background:"#F0E8DF", overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:99, width:`${value}%`, backgroundColor:color, transition:"width 0.7s ease" }} />
      </div>
    </div>
  );
}

// ─── Main Panchang Page ───────────────────────────────────────────────────────

export default function PanchangPage() {
  const isMobile = useIsMobile();

  const [selectedDate, setSelectedDate]     = useState(new Date());
  const [activeTab, setActiveTab]           = useState("overview");
  const [activeNakshatra, setActiveNakshatra] = useState(null);
  const [showCalendar, setShowCalendar]     = useState(false);

  const vara             = VARAS[selectedDate.getDay()];
  const tithi            = getTithiForDate(selectedDate);
  const nakshatra        = getNakshatraForDate(selectedDate);
  const yoga             = getYogaForDate(selectedDate);
  const karana           = getKaranaForDate(selectedDate);
  const { sunrise, sunset } = getSunriseSunset();
  const moonrise         = getMoonrise();
  const raahuKaal        = RAHU_KAAL[selectedDate.getDay()];
  const paksha           = getPaksha(selectedDate);
  const maas             = getMaas();
  const displayedNakshatra = activeNakshatra || nakshatra;

  const tabs = [
    { id: "overview",   label: "Overview"   },
    { id: "tithi",      label: "Tithi"      },
    { id: "nakshatra",  label: "Nakshatra"  },
    { id: "muhurta",    label: "Muhurta"    },
    { id: "festivals",  label: "Festivals"  },
  ];

  function goToday()      { setSelectedDate(new Date()); }
  function changeDay(delta) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d);
  }

  const panchangScores = [
    { label: "Auspiciousness", value: tithi.quality === "Highly Auspicious" ? 95 : tithi.quality === "Auspicious" ? 78 : 45, color:"#FF6F00" },
    { label: "Yoga Strength",  value: yoga.quality === "Auspicious" ? 82 : 38, color:"#9b59b6" },
    { label: "Nakshatra Power",value: 74, color:"#4a90d9" },
    { label: "Vara Harmony",   value: 80, color:"#34a853" },
    { label: "Overall Muhurta",value: 70, color:"#e74c8b" },
  ];

  const FESTIVALS_DATA = [
    { date: "Apr 14", name: "Baisakhi / Tamil New Year", category: "Regional Festival", description: "Harvest festival celebrated across Punjab and Tamil Nadu marking the solar new year." },
    { date: "Apr 17", name: "Ram Navami",                category: "Hindu Festival",    description: "Birth anniversary of Lord Rama, celebrated with fasting, prayers, and devotional singing." },
    { date: "Apr 23", name: "Hanuman Jayanti",           category: "Hindu Festival",    description: "Birthday of Lord Hanuman, marked by recitation of Hanuman Chalisa and temple visits." },
    { date: "Apr 30", name: "Akshaya Tritiya",           category: "Auspicious Day",   description: "Extremely auspicious day for new beginnings, gold purchase, and charitable activities." },
  ];

  const MUHURTA_DATA = [
    { name:"Brahma Muhurta",  time:"4:24 AM – 5:12 AM",   quality:"Highly Auspicious", icon:"🌅", use:"Meditation, spiritual practice, studying" },
    { name:"Abhijit Muhurta", time:ABHIJIT_MUHURTA,        quality:"Highly Auspicious", icon:"☀️", use:"Auspicious starts, journeys, new work" },
    { name:"Vijaya Muhurta",  time:"2:00 PM – 2:48 PM",   quality:"Auspicious",         icon:"🏆", use:"Victory, court cases, competition" },
    { name:"Godhuli Muhurta", time:"6:00 PM – 6:24 PM",   quality:"Auspicious",         icon:"🐄", use:"Marriage, entering new home, ceremonies" },
    { name:"Nishita Muhurta", time:"11:48 PM – 12:36 AM", quality:"Sacred",             icon:"🌙", use:"Kali worship, occult, tantric practices" },
    { name:"Rahu Kaal",       time:raahuKaal,              quality:"Inauspicious",       icon:"⚠️", use:"Avoid all new starts, investments, travel" },
    { name:"Yamaganda",       time:"10:30 AM – 12:00 PM", quality:"Inauspicious",       icon:"🚫", use:"Avoid starting new ventures" },
    { name:"Gulika Kaal",     time:"3:00 PM – 4:30 PM",   quality:"Inauspicious",       icon:"⛔", use:"Avoid important auspicious activities" },
  ];

  // ── Responsive style helpers ──
  const px = isMobile ? "12px" : "24px";
  const mainPad = isMobile ? "16px 12px" : "32px 24px";

  return (
    <div style={{ minHeight:"100vh", background:"#FFFBF7", fontFamily:"Georgia, serif", color:"#1A1A1A" }}>

      {/* ── Nav Header ── */}
      <Navbar />

      <BreadcrumbHeader
        title="Daily Panchang"
        highlight="Astrogurujii"
        description="Sacred almanac of Tithi, Nakshatra, Yoga, Karana and auspicious timings — rooted in Vedic tradition."
        breadcrumbs={[{ label:"Home", href:"/" }, { label:"Panchang" }]}
      />

      {/* ── Tab Strip ── */}
      <div style={{ position:"sticky", top:0, zIndex:20, background:"white", borderBottom:"1px solid #F0E8DF", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`10px ${px}`, display:"flex", gap:6, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flexShrink:0, borderRadius:8, padding: isMobile ? "7px 14px" : "8px 18px",
              fontFamily:"Georgia, serif", fontSize: isMobile ? 12 : 13, fontWeight:600,
              border: activeTab === t.id ? "none" : "1px solid #E0D5CC",
              background: activeTab === t.id ? "#FF6F00" : "white",
              color: activeTab === t.id ? "white" : "#666",
              cursor:"pointer", transition:"all 0.2s",
              boxShadow: activeTab === t.id ? "0 2px 8px rgba(255,111,0,0.3)" : "none",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{
        maxWidth:1200, margin:"0 auto", padding:mainPad,
        display:"flex", gap:isMobile ? 16 : 28,
        flexDirection: isMobile ? "column" : "row",
        alignItems:"flex-start",
      }}>

        {/* ── Left: Date Navigator (full-width on mobile, 240px sidebar on desktop) ── */}
        <aside style={{ width:"100%", maxWidth: isMobile ? "100%" : 240, flexShrink:0 }}>

          {/* Date Picker */}
          <div style={{ borderRadius:16, border:"1.5px solid #F0E8DF", background:"white", padding:16, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#aaa" }}>
              Select Date
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, marginBottom:10 }}>
              <button onClick={() => changeDay(-1)} style={{ border:"1px solid #E0D5CC", borderRadius:8, background:"white", width:32, height:32, fontSize:16, cursor:"pointer", color:"#666", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
              <div style={{ textAlign:"center", flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#1A1A1A" }}>
                  {selectedDate.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                </div>
                <div style={{ fontSize:11, color:"#FF6F00", fontWeight:600 }}>
                  {selectedDate.toLocaleDateString("en-IN",{weekday:"short"})}
                </div>
              </div>
              <button onClick={() => changeDay(1)} style={{ border:"1px solid #E0D5CC", borderRadius:8, background:"white", width:32, height:32, fontSize:16, cursor:"pointer", color:"#666", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            </div>
            <button onClick={goToday} style={{
              width:"100%", borderRadius:8, padding:"8px 0",
              background:"#FF6F00", color:"white", border:"none",
              fontSize:12, fontWeight:700, cursor:"pointer"
            }}>Today</button>
          </div>

          {/* Panchang Summary List — horizontal scroll on mobile, vertical list on desktop */}
          <div style={{
            borderRadius:16, border:"1.5px solid #F0E8DF", background:"white",
            padding:16, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,0.04)"
          }}>
            <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#aaa" }}>
              At a Glance
            </p>
            {[
              { l:"Samvat",      v:getSamvat(selectedDate) },
              { l:"Shaka",       v:getShakaSamvat(selectedDate) },
              { l:"Maas",        v:maas },
              { l:"Paksha",      v:paksha },
              { l:"Tithi",       v:`${tithi.number} · ${tithi.name}` },
              { l:"Nakshatra",   v:nakshatra.name },
              { l:"Yoga",        v:yoga.name },
              { l:"Karana",      v:karana.name },
              { l:"Sun Sign",    v:getSunSign() },
              { l:"Moon Sign",   v:getMoonSign() },
              { l:"Ayanamsha",   v:getAyanamsha() },
            ].map(item => (
              <div key={item.l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F5F0EB" }}>
                <span style={{ fontSize:11, color:"#999" }}>{item.l}</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#1A1A1A", textAlign:"right", maxWidth:130 }}>{item.v}</span>
              </div>
            ))}
          </div>

          {/* Celestial Timings */}
          <div style={{ borderRadius:16, border:"1.5px solid #F0E8DF", background:"white", padding:16, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#aaa" }}>
              Celestial Timings
            </p>
            {[
              { icon:"🌅", l:"Sunrise",  v:sunrise },
              { icon:"🌇", l:"Sunset",   v:sunset },
              { icon:"🌕", l:"Moonrise", v:moonrise },
              { icon:"⚠️", l:"Rahu Kaal",v:raahuKaal },
              { icon:"☀️", l:"Abhijit",  v:ABHIJIT_MUHURTA },
            ].map(item => (
              <div key={item.l} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #F5F0EB" }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#aaa", fontWeight:600 }}>{item.l}</div>
                  <div style={{ fontSize:12, fontWeight:700, color: item.l==="Rahu Kaal" ? "#e74c3c" : "#FF6F00" }}>{item.v}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Right: Content ── */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* ── Hero Banner ── */}
          <div style={{
            borderRadius:isMobile ? 16 : 20, marginBottom:20,
            background:"linear-gradient(135deg, #FFF5EC 0%, #FFE8CC 50%, #FFF5EC 100%)",
            borderLeft:"4px solid #FF6F00", overflow:"hidden",
            padding: isMobile ? "16px" : "24px 28px",
          }}>
            {/* Top row: Vara circle + info */}
            <div style={{ display:"flex", gap: isMobile ? 12 : 20, alignItems:"flex-start" }}>
              {/* Vara Circle */}
              <div style={{
                width: isMobile ? 56 : 80, height: isMobile ? 56 : 80,
                borderRadius:"50%", background:"white", flexShrink:0,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
                border:`3px solid ${vara.color}22`
              }}>
                <span style={{ fontSize: isMobile ? 22 : 28 }}>{vara.symbol}</span>
              </div>

              {/* Main Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap: isMobile ? 6 : 10 }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 26, fontWeight:700, margin:0 }}>{vara.name}</h2>
                  <span style={{ borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700, color:"white", background:vara.color }}>{vara.planet}</span>
                  <QualityBadge quality={tithi.quality} />
                </div>
                <p style={{ margin:"4px 0 0", fontSize:12, color:"#777" }}>{formatDate(selectedDate)}</p>
                {!isMobile && (
                  <p style={{ margin:"8px 0 0", fontSize:14, lineHeight:1.7, color:"#555", maxWidth:480 }}>
                    <strong>Vara:</strong> {vara.english} is ruled by <strong>{vara.planet}</strong>. {vara.auspicious}.
                  </p>
                )}
              </div>

              {/* Lucky Stats — only on desktop */}
              {!isMobile && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ borderRadius:10, background:"white", padding:"8px 14px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize:10, color:"#aaa" }}>Tithi</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#FF6F00" }}>{tithi.number}</div>
                  </div>
                  <div style={{ borderRadius:10, background:"white", padding:"8px 14px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize:10, color:"#aaa" }}>Paksha</div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#FF6F00" }}>{paksha.split(" ")[0]}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Vara auspicious description on mobile */}
            {isMobile && (
              <p style={{ margin:"10px 0 0", fontSize:12, lineHeight:1.7, color:"#555" }}>
                <strong>Vara:</strong> {vara.english} is ruled by <strong>{vara.planet}</strong>. {vara.auspicious}.
              </p>
            )}

            {/* Panchang at a glance grid */}
            <div style={{
              marginTop:16, borderRadius:14, background:"rgba(255,255,255,0.7)",
              backdropFilter:"blur(8px)", padding: isMobile ? 12 : 16,
              display:"grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(160px, 1fr))",
              gap: isMobile ? 10 : 12,
            }}>
              {[
                { icon:"🌗", label:"Tithi",     value:`${tithi.number} · ${tithi.name}`, sub:tithi.sanskrit },
                { icon:"⭐", label:"Nakshatra",  value:nakshatra.name,                    sub:nakshatra.ruling_planet },
                { icon:"🔱", label:"Yoga",       value:yoga.name,                         sub:yoga.meaning },
                { icon:"🌀", label:"Karana",     value:karana.name,                       sub:karana.nature },
                { icon:"🏛️", label:"Maas",       value:maas,                              sub:paksha },
              ].map(item => (
                <div key={item.label} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span style={{ fontSize: isMobile ? 16 : 20, marginTop:2, flexShrink:0 }}>{item.icon}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:9, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{item.label}</div>
                    <div style={{ fontSize: isMobile ? 11 : 13, fontWeight:700, color:"#1A1A1A", wordBreak:"break-word" }}>{item.value}</div>
                    <div style={{ fontSize: isMobile ? 10 : 11, color:"#FF6F00" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div style={{
              marginTop:12, borderRadius:10, border:"1px solid rgba(255,111,0,0.3)",
              background:"rgba(255,111,0,0.05)", padding:"10px 14px",
              display:"flex", alignItems:"center", gap:8
            }}>
              <span style={{ fontSize:16, flexShrink:0 }}>✨</span>
              <p style={{ margin:0, fontSize:12, fontWeight:600, fontStyle:"italic", color:"#FF6F00" }}>
                {tithi.suitable} — auspicious activities for today.
              </p>
            </div>
          </div>

          {/* ── Panchang Scores ── */}
          <div style={{ borderRadius:18, border:"1.5px solid #F0E8DF", background:"white", padding: isMobile ? 16 : 20, marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin:"0 0 16px", fontSize:14, fontWeight:700 }}>⭐ Today's Panchang Strength</h3>
            <div style={{
              display:"grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
              gap:12,
            }}>
              {panchangScores.map(s => <ScoreBar key={s.label} {...s} />)}
            </div>
          </div>

          {/* ── TAB CONTENT ── */}

          {activeTab === "overview" && (
            <>
              {/* Detail Cards */}
              <div style={{
                display:"grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
                gap:isMobile ? 12 : 16, marginBottom:20,
              }}>
                <PanchangDetailCard icon="🌗" label="Tithi Details"
                  content={`${tithi.name} (${tithi.sanskrit}) — the ${tithi.number}${["st","nd","rd"][tithi.number-1]||"th"} day of the lunar fortnight. Presiding deity: ${tithi.deity}. Suitable for: ${tithi.suitable}.`} />
                <PanchangDetailCard icon="⭐" label="Nakshatra Details"
                  content={`${nakshatra.name} Nakshatra, ruled by ${nakshatra.ruling_planet}. Presiding deity: ${nakshatra.deity}. Nature: ${nakshatra.nature}. ${nakshatra.qualities}.`} />
                <PanchangDetailCard icon="🔱" label="Yoga Details"
                  content={`${yoga.name} Yoga — meaning "${yoga.meaning}". This is a ${yoga.quality.toLowerCase()} yoga. Plan your day accordingly with awareness of this yogic influence.`} />
                <PanchangDetailCard icon="🌀" label="Karana Details"
                  content={`${karana.name} Karana (${karana.type}) — ruled by ${karana.ruler}. Nature: ${karana.nature}. Karana shifts every half-tithi (~6 hours), influencing the quality of each quarter of the day.`} />
              </div>

              {/* Lucky Details Strip */}
              <div style={{
                display:"grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(130px, 1fr))",
                gap: isMobile ? 10 : 12, marginBottom:24,
              }}>
                {[
                  { icon:"🌅", label:"Sunrise",  value:sunrise },
                  { icon:"🌇", label:"Sunset",   value:sunset },
                  { icon:"🌕", label:"Moonrise", value:moonrise },
                  { icon:"⚠️", label:"Rahu Kaal",value:raahuKaal },
                  { icon:"☀️", label:"Abhijit",  value:"11:48 AM" },
                  { icon:"🪐", label:"Sun in",   value:getSunSign() },
                  { icon:"🌙", label:"Moon in",  value:getMoonSign() },
                  { icon:"📅", label:"Tithi No.", value:tithi.number },
                ].map(item => (
                  <div key={item.label} style={{
                    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                    borderRadius:14, border:"1.5px solid #F0E8DF", background:"#FAFAFA",
                    padding: isMobile ? "12px 8px" : "14px 8px", textAlign:"center",
                  }}>
                    <span style={{ fontSize: isMobile ? 18 : 22 }}>{item.icon}</span>
                    <span style={{ fontSize:10, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{item.label}</span>
                    <span style={{ fontSize: isMobile ? 11 : 12, fontWeight:700, color:"#FF6F00", wordBreak:"break-word", textAlign:"center" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Vara Reference */}
              <div style={{ marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ height:3, width:24, borderRadius:99, background:"#FF6F00", display:"block", flexShrink:0 }} />
                <h3 style={{ margin:0, fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>Vara Reference</h3>
                <span style={{ height:3, flex:1, borderRadius:99, background:"#F0E8DF", display:"block" }} />
              </div>
              <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:8, marginBottom:24, WebkitOverflowScrolling:"touch" }}>
                {VARAS.map(v => (
                  <div key={v.name} style={{
                    flexShrink:0, borderRadius:14,
                    border:`2px solid ${v.name === vara.name ? v.color : "#F0E8DF"}`,
                    background: v.name === vara.name ? "#FFF5EC" : "white",
                    padding: isMobile ? "10px 10px" : "12px 14px",
                    minWidth: isMobile ? 100 : 120, textAlign:"center",
                    boxShadow: v.name === vara.name ? `0 4px 16px ${v.color}33` : "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ fontSize: isMobile ? 20 : 24, marginBottom:4 }}>{v.symbol}</div>
                    <div style={{ fontSize:11, fontWeight:700, color: v.name === vara.name ? v.color : "#1A1A1A" }}>{v.name}</div>
                    <div style={{ fontSize:9, color:"#aaa", marginTop:2 }}>{v.planet}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "tithi" && (
            <div style={{ borderRadius:18, border:"1.5px solid #F0E8DF", background:"white", padding: isMobile ? 16 : 20, marginBottom:16 }}>
              <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Tithi — Lunar Day</h3>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#777", lineHeight:1.6 }}>
                The Tithi is the fundamental unit of the Hindu lunar calendar, representing the relationship angle between the Sun and Moon. There are 30 Tithis in a lunar month, 15 each in the bright (Shukla) and dark (Krishna) fortnights.
              </p>
              <div style={{
                display:"grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
                gap:10,
              }}>
                {TITHIS.slice(0, 15).map(t => (
                  <div key={t.number} style={{
                    borderRadius:12, border:`1.5px solid ${t.name === tithi.name ? "#FF6F00" : "#F0E8DF"}`,
                    background: t.name === tithi.name ? "#FFF5EC" : "#FAFAFA",
                    padding:"12px 14px", transition:"all 0.2s"
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:700, color: t.name === tithi.name ? "#FF6F00" : "#1A1A1A" }}>{t.number}. {t.name}</span>
                      <QualityBadge quality={t.quality} />
                    </div>
                    <div style={{ fontSize:11, color:"#999", marginBottom:4 }}>{t.sanskrit} · {t.deity}</div>
                    <div style={{ fontSize:11, color:"#666" }}>{t.suitable}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "nakshatra" && (
            <div style={{ borderRadius:18, border:"1.5px solid #F0E8DF", background:"white", padding: isMobile ? 16 : 20, marginBottom:16 }}>
              <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Nakshatra — Lunar Mansion</h3>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#777", lineHeight:1.6 }}>
                The 27 Nakshatras divide the zodiac into equal segments of 13°20' each. The Moon transits through one Nakshatra approximately every 24 hours, influencing the quality of each day's activities.
              </p>
              {/* Nakshatra scroll grid */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {NAKSHATRAS.map(n => (
                  <NakshatraCard key={n.id} nakshatra={n}
                    isActive={displayedNakshatra.id === n.id}
                    onClick={() => setActiveNakshatra(n)} />
                ))}
              </div>
              {displayedNakshatra && (
                <div style={{
                  borderRadius:14, background:"#FFF5EC", border:"1.5px solid #FF6F00",
                  padding: isMobile ? 14 : 18,
                  display:"flex", gap: isMobile ? 12 : 16, flexWrap:"wrap",
                  alignItems:"flex-start",
                }}>
                  <div style={{ fontSize: isMobile ? 36 : 48, flexShrink:0 }}>{displayedNakshatra.symbol}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                      <h4 style={{ margin:0, fontSize: isMobile ? 16 : 20, fontWeight:700 }}>{displayedNakshatra.name}</h4>
                      <span style={{ background:"#FF6F00", color:"white", borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{displayedNakshatra.ruling_planet}</span>
                      <span style={{ background:"#FFF", border:"1px solid #FFB74D", borderRadius:20, padding:"2px 10px", fontSize:11, color:"#FF6F00", fontWeight:700 }}>{displayedNakshatra.nature}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#555", marginBottom:4 }}><strong>Deity:</strong> {displayedNakshatra.deity}</div>
                    <div style={{ fontSize:12, color:"#555", marginBottom:4 }}><strong>Qualities:</strong> {displayedNakshatra.qualities}</div>
                    <div style={{ fontSize:12, color:"#FF6F00", fontStyle:"italic" }}>
                      {displayedNakshatra.id === nakshatra.id ? "✓ Today's active Nakshatra" : "Click any Nakshatra to explore"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "muhurta" && (
            <div style={{ borderRadius:18, border:"1.5px solid #F0E8DF", background:"white", padding: isMobile ? 16 : 20, marginBottom:16 }}>
              <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Muhurta — Auspicious Timings</h3>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#777", lineHeight:1.6 }}>
                Muhurta refers to a period of approximately 48 minutes. Selecting the right Muhurta for important activities ensures cosmic support and minimizes obstacles.
              </p>
              <div style={{
                display:"grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
                gap: isMobile ? 10 : 14,
              }}>
                {MUHURTA_DATA.map(m => (
                  <div key={m.name} style={{
                    borderRadius:14,
                    border:`1.5px solid ${m.quality==="Inauspicious" ? "#fce4ec" : "#F0E8DF"}`,
                    background: m.quality==="Inauspicious" ? "#fff5f5" : m.quality==="Highly Auspicious" ? "#FFF5EC" : "white",
                    padding: isMobile ? 12 : 16, transition:"all 0.2s"
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:20, flexShrink:0 }}>{m.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:700 }}>{m.name}</div>
                        <div style={{ fontSize:11, color:"#FF6F00", fontWeight:600 }}>{m.time}</div>
                      </div>
                      <div style={{ flexShrink:0 }}><QualityBadge quality={m.quality} /></div>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#666", lineHeight:1.6 }}>{m.use}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "festivals" && (
            <div style={{ borderRadius:18, border:"1.5px solid #F0E8DF", background:"white", padding: isMobile ? 16 : 20, marginBottom:16 }}>
              <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Upcoming Festivals & Vrats</h3>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#777", lineHeight:1.6 }}>
                Sacred days, fasts, and Hindu festivals in the coming weeks.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {FESTIVALS_DATA.map(f => (
                  <div key={f.name} style={{
                    borderRadius:14, border:"1.5px solid #F0E8DF", background:"#FAFAFA",
                    padding: isMobile ? "12px" : "16px",
                    display:"flex", gap: isMobile ? 12 : 16, alignItems:"flex-start"
                  }}>
                    <div style={{
                      borderRadius:12, background:"#FF6F00", color:"white",
                      padding: isMobile ? "6px 10px" : "8px 12px",
                      textAlign:"center", flexShrink:0, minWidth:46
                    }}>
                      <div style={{ fontSize: isMobile ? 13 : 16, fontWeight:700 }}>{f.date.split(" ")[1]}</div>
                      <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.date.split(" ")[0]}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                        <span style={{ fontSize: isMobile ? 13 : 15, fontWeight:700 }}>{f.name}</span>
                        <span style={{ borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700, background:"#FFF5EC", color:"#FF6F00", border:"1px solid #FFB74D" }}>{f.category}</span>
                      </div>
                      <p style={{ margin:0, fontSize:12, color:"#666", lineHeight:1.6 }}>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

}