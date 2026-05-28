import { SERVICE_PILLS } from "@/data/home";
import BrandLogoMidIcon from "@/assets/icons/BrandLogoMidIcon";
import ServicePill from "./ServicePill";

// ── Inline icon circles ──────────────────────────────────────
function IconCircle({ color, icon }: { color: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    chat: (
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
        <rect x="2" y="3" width="20" height="14" rx="3" fill="white" />
        <path d="M2 17l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 10h10M7 7h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    talk: (
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" fill="white" />
        <path d="M15 7a5 5 0 015 5M15 3a9 9 0 019 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    mall: (
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
        <path d="M3 3h2l3 10h10l3-7H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="19" r="1.5" fill="white" />
        <circle cx="17" cy="19" r="1.5" fill="white" />
      </svg>
    ),
    pooja: (
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
        <path d="M12 3c-2 0-3.5 1.5-3.5 3s1.5 2.5 3.5 2.5S15.5 7.5 15.5 6 14 3 12 3z" fill="white" />
        <path d="M7.5 8.5h9l1.5 10h-12z" fill="white" fillOpacity="0.9" />
        <path d="M6 18.5h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {icons[icon] ?? null}
    </div>
  );
}

// ── Mobile pill ──────────────────────────────────────────────
function MobilePill({
  label, icon, color, dotSide, onClick,
}: {
  label: string; icon: string; color: string;
  dotSide: "left" | "right"; onClick?: () => void;
}) {
  const reverse = dotSide === "right";
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={onClick}
        style={{
          display: "flex",
          flexDirection: reverse ? "row-reverse" : "row",
          alignItems: "center",
          gap: 8,
          background: "white",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: 999,
          padding: reverse ? "7px 8px 7px 12px" : "7px 12px 7px 8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <IconCircle color={color} icon={icon} />
        <span style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10,
          fontWeight: 800,
          color: "#1a1a1a",
          textTransform: "uppercase",
          lineHeight: 1.35,
          textAlign: reverse ? "right" : "left",
          whiteSpace: "pre-line",
        }}>
          {label}
        </span>
      </button>
      <span style={{
        position: "absolute",
        [dotSide]: -17,
        top: "50%",
        transform: "translateY(-50%)",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 0 3px ${color}40`,
        display: "block",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ── Mobile center logo ───────────────────────────────────────
function MobileCenterLogo() {
  return (
    <div style={{ position: "relative", width: 80, height: 80 }}>
      <div style={{
        position: "absolute", inset: -20, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255,111,0,0.20) 0%,transparent 70%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.13)", padding: 4,
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: "linear-gradient(135deg,#FF6F00,#FF9A3C)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BrandLogoMidIcon width={44} height={30} className="object-contain brightness-0 invert" />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pb-[40px]">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        <div className="mt-6 flex flex-col items-center">

          {/* ══════════════════════════════════════════
              MOBILE: mind-map  (< md)
              The outer div uses only Tailwind — no inline display.
              The inner div owns the grid layout.
          ══════════════════════════════════════════ */}
          <div className="md:hidden w-full flex justify-center">
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 1fr",
              alignItems: "center",
              rowGap: 16,
              width: "100%",
              maxWidth: 340,
            }}>
              {/* LEFT col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end", paddingRight: 14 }}>
                <MobilePill
                  label={"CHAT TO\nASTROLOGER"}
                  icon="chat"
                  color={SERVICE_PILLS[0].color}
                  dotSide="right"
                />
                <MobilePill
                  label={"TALK TO\nASTROLOGER"}
                  icon="talk"
                  color={SERVICE_PILLS[1].color}
                  dotSide="right"
                />
              </div>

              {/* CENTER col */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MobileCenterLogo />
              </div>

              {/* RIGHT col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start", paddingLeft: 14 }}>
                <MobilePill
                  label={"ASTRO\nMALL"}
                  icon="mall"
                  color={SERVICE_PILLS[2].color}
                  dotSide="left"
                />
                <MobilePill
                  label={"BOOK\nPOOJA"}
                  icon="pooja"
                  color={SERVICE_PILLS[3].color}
                  dotSide="left"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              DESKTOP: single centred row  (≥ md)
          ══════════════════════════════════════════ */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-1 w-full">
            {SERVICE_PILLS.slice(0, 2).map((pill) => (
              <ServicePill key={pill.label} {...pill} />
            ))}

            <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full bg-brand-orange shadow-md">
              <BrandLogoMidIcon
                width={48}
                height={32}
                className="object-contain brightness-0 invert"
              />
            </div>

            {SERVICE_PILLS.slice(2).map((pill) => (
              <ServicePill key={pill.label} {...pill} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}