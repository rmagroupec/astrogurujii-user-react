/**
 * HomeBannerSlider.tsx
 * Clean rewrite — images fully visible, no cropping, no dark overlay.
 * Prev / Next arrow buttons included.
 * Touch swipe + dot navigation.
 * Auto-slides every 4s, pauses on hover.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type BannerItem = {
  link?: string;
  img?: string;
  type?: string;
  redirectTo: string;
  _id?: string;
};

interface HomeBannerSliderProps {
  banners: BannerItem[];
  isLoading?: boolean;
}

function getRoute(redirectTo: string): string {
  const r = (redirectTo ?? "").toLowerCase().trim();
  if (r === "puja" || r === "pooja")             return "/book-pooja";
  if (r === "chat")                              return "/chat-with-astrolger";
  if (r === "call" || r === "audio")             return "/call-with-astrolger";
  if (r === "astromall" || r === "mall")         return "/astro-mall";
  if (r === "astrologer" || r === "consultants") return "/chat-with-astrolger";
  if (r === "live")                              return "/live-astrologer";
  if (r === "blog")                              return "/our-blog";
  if (r === "horoscope")                         return "/horoscope";
  if (r === "wallet" || r === "recharge")        return "/recharge-now";
  return "/";
}

const FALLBACKS = [
  { bg: "#FF9800", emoji: "🔮", text: "Chat with Astrologer" },
  { bg: "#e53935", emoji: "📞", text: "Talk to Astrologer"   },
  { bg: "#7B1FA2", emoji: "🪔", text: "Book a Pooja"         },
  { bg: "#1565C0", emoji: "📿", text: "Daily Horoscope"      },
  { bg: "#2E7D32", emoji: "⭐", text: "Live Astrologers"     },
];

function Skeleton() {
  return (
    <div style={{ width: "100%", padding: "8px 12px" }}>
      <div style={{
        width: "100%",
        height: 160,
        borderRadius: 10,
        background: "linear-gradient(90deg,#f5ede2 25%,#ffe4bc 50%,#f5ede2 75%)",
        backgroundSize: "200% 100%",
        animation: "bshimmer 1.5s infinite",
      }} />
      <style>{`@keyframes bshimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

export default function HomeBannerSlider({ banners, isLoading = false }: HomeBannerSliderProps) {
  const navigate            = useNavigate();
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const [anim, setAnim]     = useState(true);
  const autoRef             = useRef<ReturnType<typeof setInterval> | null>(null);
  const tx = useRef(0);
  const dx = useRef(0);

  const total = banners.length;

  const go = useCallback((next: number) => {
    setIdx(((next % total) + total) % total);
  }, [total]);

  const goNext = useCallback(() => go(idx + 1), [idx, go]);
  const goPrev = useCallback(() => go(idx - 1), [idx, go]);

  // auto-play
  useEffect(() => {
    if (paused || total <= 1) return;
    autoRef.current = setInterval(goNext, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [paused, idx, goNext, total]);

  // swipe
  const onTS = (e: React.TouchEvent) => { tx.current = e.touches[0].clientX; dx.current = 0; setPaused(true); };
  const onTM = (e: React.TouchEvent) => { dx.current = e.touches[0].clientX - tx.current; };
  const onTE = () => {
    if (Math.abs(dx.current) > 40) dx.current < 0 ? goNext() : goPrev();
    setTimeout(() => setPaused(false), 2000);
  };

  if (isLoading) return <Skeleton />;
  if (!banners || total === 0) return null;

  return (
    <div
      style={{ width: "100%", padding: "8px 0 4px", userSelect: "none" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Outer clip ── */}
      <div
        style={{ position: "relative", width: "100%", overflow: "hidden" }}
        onTouchStart={onTS}
        onTouchMove={onTM}
        onTouchEnd={onTE}
      >
        {/* ── Track — 100% wide per slide, translate by idx * 100% ── */}
        <div
          style={{
            display: "flex",
            transform: `translateX(-${idx * 100}%)`,
            transition: "transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94)",
            willChange: "transform",
          }}
        >
          {banners.map((banner, i) => {
            const fb  = FALLBACKS[i % FALLBACKS.length];
            const src = banner.img?.trim() || banner.link?.trim() || "";

            return (
              <div
                key={banner._id ?? i}
                style={{
                  minWidth: "100%",
                  flexShrink: 0,
                  padding: "0 8px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
                onClick={() => navigate(getRoute(banner.redirectTo))}
              >
                {src ? (
                  <img
                    src={src}
                    alt={`Banner ${i + 1}`}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "auto",          /* let the image breathe — no fixed height */
                      display: "block",
                      borderRadius: 10,
                      objectFit: "contain",    /* full image visible, no cropping */
                    }}
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = "none";
                      const wrap = img.parentElement!;
                      wrap.style.background   = fb.bg;
                      wrap.style.height       = "160px";
                      wrap.style.borderRadius = "10px";
                      wrap.style.display      = "flex";
                      wrap.style.flexDirection = "column";
                      wrap.style.alignItems   = "center";
                      wrap.style.justifyContent = "center";
                      wrap.style.gap          = "8px";
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 10,
                    background: fb.bg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}>
                    <span style={{ fontSize: 36 }}>{fb.emoji}</span>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{fb.text}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Prev button ── */}
        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous banner"
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* ── Next button ── */}
        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next banner"
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Dots ── */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 10 }}>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width:        i === idx ? 22 : 7,
                height:       7,
                borderRadius: 9999,
                border:       "none",
                padding:      0,
                cursor:       "pointer",
                background:   i === idx ? "#FF6F00" : "rgba(255,111,0,0.3)",
                transition:   "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}