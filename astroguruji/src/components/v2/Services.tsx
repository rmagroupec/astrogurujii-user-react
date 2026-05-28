import BrandLogoMidIcon from "@/assets/icons/BrandLogoMidIcon";
import { useNavigate } from "react-router-dom";


const ChatSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" style={{width:"100%",height:"100%"}}>
    <rect x="3" y="4" width="26" height="18" rx="4" fill="white"/>
    <path d="M3 22l5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 13h12M10 9h8" stroke="#FF4FB8" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const PhoneSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" style={{width:"100%",height:"100%"}}>
    <path d="M7 5h5l3 7-3 2a14 14 0 006 6l2-3 7 3v5a3 3 0 01-3 3C11 28 4 21 4 8a3 3 0 013-3z" fill="white"/>
    <path d="M20 8a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 3a11 11 0 0111 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const CartSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" style={{width:"100%",height:"100%"}}>
    <path d="M4 4h3l4 14h14l3-9H8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="13" cy="26" r="2" fill="white"/>
    <circle cx="23" cy="26" r="2" fill="white"/>
  </svg>
);
const PoojaSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" style={{width:"100%",height:"100%"}}>
    <path d="M16 4c-3 0-5 2-5 4s2 3 5 3 5-1 5-3-2-4-5-4z" fill="white"/>
    <path d="M10 11h12l2 13H8L10 11z" fill="white" fillOpacity="0.9"/>
    <path d="M7 24h18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const LotusSVG = () => (
  <svg viewBox="0 0 64 64" fill="none" style={{width:"100%",height:"100%"}}>
    <path d="M32 54C32 54 13 43 13 27C13 18 20 12 28 15C30 16 31 17 32 19C33 17 34 16 36 15C44 12 51 18 51 27C51 43 32 54 32 54Z" fill="white" fillOpacity="0.85"/>
    <path d="M32 54C32 54 19 39 19 27C19 21 24 17 30 20C31 20 31.5 21 32 23C32.5 21 33 20 34 20C40 17 45 21 45 27C45 39 32 54 32 54Z" fill="white"/>
    <path d="M32 54C32 54 25 41 25 30C25 25 28 22 32 22C36 22 39 25 39 30C39 41 32 54 32 54Z" fill="white" fillOpacity="0.6"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────
type IconComp = () => JSX.Element;

interface PillItem {
  lines: [string, string];
  Icon: IconComp;
  g1: string;
  g2: string;
  dot: string;
  link: string;
}

// ── Data — named components, NOT array-indexed JSX ────────────
const CHAT:  PillItem = { lines:["CHAT TO","ASTROLOGER"], Icon:ChatSVG,  g1:"#FF4FB8", g2:"#FF82CB", dot:"#FF4FB8", link:"/chat-with-astrolger" };
const MALL:  PillItem = { lines:["ASTRO","MALL"],         Icon:CartSVG,  g1:"#4A90E2", g2:"#74B3FF", dot:"#4A90E2", link:"#" };
const TALK:  PillItem = { lines:["TALK TO","ASTROLOGER"], Icon:PhoneSVG, g1:"#1DC9A4", g2:"#4EDDC4", dot:"#1DC9A4", link:"/call-with-astrolger" };
const POOJA: PillItem = { lines:["BOOK A","POOJA"],       Icon:PoojaSVG, g1:"#22c55e", g2:"#4ade80", dot:"#22c55e", link:"#" };

const ALL_PILLS: PillItem[] = [CHAT, MALL, TALK, POOJA];

// ── Styles ────────────────────────────────────────────────────
const pillBase: React.CSSProperties = {
  display:"flex", alignItems:"center", gap:10,
  borderRadius:999, padding:"8px 16px 8px 8px",
  background:"white", border:"1px solid rgba(0,0,0,0.07)",
  boxShadow:"0 3px 14px rgba(0,0,0,0.09)",
  cursor:"pointer", WebkitTapHighlightColor:"transparent" as any,
};
const pillReverse: React.CSSProperties = {
  ...pillBase, flexDirection:"row-reverse", paddingLeft:16, paddingRight:8,
};
const labelBase: React.CSSProperties = {
  fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:800,
  color:"#1a1a1a", textTransform:"uppercase", lineHeight:1.35, whiteSpace:"pre-line",
};

function iconBox(g1: string, g2: string): React.CSSProperties {
  return {
    width:42, height:42, borderRadius:"50%", padding:9, flexShrink:0,
    background:`linear-gradient(135deg,${g1},${g2})`,
  };
}

function connectDot(side: "left"|"right", color: string): React.CSSProperties {
  return {
    position:"absolute",
    [side]: -18,
    top:"50%", transform:"translateY(-50%)",
    width:10, height:10, borderRadius:"50%",
    background:color, boxShadow:`0 0 0 3px ${color}33`,
    display:"block",
  };
}

// ── Sub-components ────────────────────────────────────────────
function DesktopPill({ item, onPress }: { item: PillItem; onPress: () => void }) {
  const { Icon, lines, g1, g2 } = item;
  return (
    <button onClick={onPress} style={pillBase}>
      <div style={iconBox(g1, g2)}><Icon /></div>
      <span style={labelBase}>{lines.join("\n")}</span>
    </button>
  );
}

function LeftPill({ item, onPress }: { item: PillItem; onPress: () => void }) {
  const { Icon, lines, g1, g2, dot } = item;
  return (
    <div style={{position:"relative"}}>
      <button onClick={onPress} style={pillReverse}>
        <div style={iconBox(g1, g2)}><Icon /></div>
        <span style={{...labelBase, textAlign:"right"}}>{lines.join("\n")}</span>
      </button>
      <span style={connectDot("right", dot)} />
    </div>
  );
}

function RightPill({ item, onPress }: { item: PillItem; onPress: () => void }) {
  const { Icon, lines, g1, g2, dot } = item;
  return (
    <div style={{position:"relative"}}>
      <button onClick={onPress} style={pillBase}>
        <div style={iconBox(g1, g2)}><Icon /></div>
        <span style={labelBase}>{lines.join("\n")}</span>
      </button>
      <span style={connectDot("left", dot)} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function Services() {
  const navigate = useNavigate();
  const go = (link: string) => { if (link !== "#") navigate(link); };

  return (
    <section style={{width:"100%", background:"white", padding:"24px 0 28px"}}>
      <div style={{maxWidth:1440, margin:"0 auto", padding:"0 16px"}}>

        {/* Desktop: horizontal row */}
        <div className="hidden md:flex" style={{justifyContent:"center", gap:16, flexWrap:"wrap"}}>
          {ALL_PILLS.map((item, i) => (
            <DesktopPill key={i} item={item} onPress={() => go(item.link)} />
          ))}
        </div>

        {/* Mobile: mind-map grid */}
        <div className="flex md:hidden" style={{
          display:"grid",
          gridTemplateColumns:"1fr 80px 1fr",
          alignItems:"center",
          gap:"14px 0",
          maxWidth:340,
          margin:"0 auto",
        }}>

          {/* Left column */}
          <div style={{display:"flex", flexDirection:"column", gap:14, alignItems:"flex-end", paddingRight:14}}>
            <LeftPill item={CHAT}  onPress={() => go(CHAT.link)} />
            <LeftPill item={TALK}  onPress={() => go(TALK.link)} />
          </div>

          {/* Center lotus */}
          <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <div style={{position:"relative", width:76, height:76}}>
              <div style={{
                position:"absolute", inset:-18, borderRadius:"50%",
                background:"radial-gradient(circle,rgba(255,111,0,0.20) 0%,transparent 70%)",
              }}/>
              <div style={{
                position:"absolute", inset:0, borderRadius:"50%",
                background:"white", boxShadow:"0 4px 20px rgba(0,0,0,0.13)", padding:4,
              }}>
                <div style={{
                  width:"100%", height:"100%", borderRadius:"50%",
                  background:"linear-gradient(135deg,#FF6F00,#FF9A3C)",
                  display:"flex", alignItems:"center", justifyContent:"center", padding:13,
                }}>
                  <BrandLogoMidIcon
                                  width={48}
                                  height={32}
                                  className="object-contain brightness-0 invert"
                                />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{display:"flex", flexDirection:"column", gap:14, alignItems:"flex-start", paddingLeft:14}}>
            <RightPill item={MALL}  onPress={() => go(MALL.link)} />
            <RightPill item={POOJA} onPress={() => go(POOJA.link)} />
          </div>

        </div>

      </div>
    </section>
  );
}