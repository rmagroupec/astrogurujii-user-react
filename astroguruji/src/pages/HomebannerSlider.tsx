import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://admin.astrogurujii.com";

// ── Types ─────────────────────────────────────────────────────
interface BannerItem {
  _id?: string;
  id?: string;
  img?: string;
  file?: string;
  image?: string;
  banner_img?: string;
  title?: string;
  link?: string;
  redirectTo?: string;
  url?: string;
  banner_url?: string;
  page_link?: string;
  redirect?: string;
  target_url?: string;
  action_url?: string;
  deep_link?: string;
  [key: string]: any; // allow any extra fields
}

interface Props {
  banners: BannerItem[];
  isLoading?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────
function resolveImg(banner: BannerItem): string {
  const raw = banner.img || banner.file || banner.image || banner.banner_img || "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${API_BASE_URL}/${raw.replace(/^\/+/, "")}`;
}

// Try every possible link field the API might return
function resolveLink(banner: BannerItem): string {
  const candidates = [
    banner.link,
    banner.redirectTo || banner.redirect || banner.target_url || banner.action_url || banner.deep_link,
    banner.url,
    banner.banner_url,
    banner.page_link,
    banner.redirect,
    banner.target_url,
    banner.action_url,
    banner.deep_link,
  ];
  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim() && c.trim() !== "#") {
      return c.trim();
    }
  }
  return "";
}

// ── Skeleton ──────────────────────────────────────────────────
function BannerSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="block md:hidden w-full h-[180px] rounded-xl bg-gray-200" />
      <div className="hidden md:block w-full rounded-2xl bg-gray-200" style={{ aspectRatio: "16/5" }} />
    </div>
  );
}

// ── Slide image — pointer-events-none so parent div handles all clicks ──
function SlideImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ pointerEvents: "none", userSelect: "none" }}
        className="block md:hidden w-full object-cover object-center h-[160px] sm:h-[220px]"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/800x200/FFF5EC/FF6F00?text=AstroGurujii";
        }}
      />
      <div
        className="hidden md:block w-full bg-[#FFF9F4]"
        style={{ aspectRatio: "16/5", pointerEvents: "none" }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ pointerEvents: "none", userSelect: "none" }}
          className="w-full h-full object-contain object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/1200x375/FFF5EC/FF6F00?text=AstroGurujii";
          }}
        />
      </div>
    </>
  );
}

// ── Main slider ───────────────────────────────────────────────
export default function HomeBannerSlider({ banners, isLoading }: Props) {
  const navigate = useNavigate();
  const total    = banners.length;

  // Infinite clone-wrap: [last, ...originals, first], start at idx=1
  const [idx, setIdx]           = useState(1);
  const [animated, setAnimated] = useState(true);

  const autoRef          = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioning  = useRef(false);

  // Touch tracking
  const touchStartX  = useRef<number | null>(null);
  const touchStartY  = useRef<number | null>(null);
  const touchMoved   = useRef(false); // true if swipe detected

  const slides = total > 1
    ? [banners[total - 1], ...banners, banners[0]]
    : banners;

  // ── Auto-play ──────────────────────────────────────────────
  const pause = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  }, []);

  const resume = useCallback(() => {
    pause();
    if (total > 1) {
      autoRef.current = setInterval(() => {
        setAnimated(true);
        setIdx((i) => i + 1);
      }, 4000);
    }
  }, [pause, total]);

  useEffect(() => { resume(); return pause; }, [resume, pause]);

  // ── Infinite wrap on transition end ───────────────────────
  const handleTransitionEnd = useCallback(() => {
    isTransitioning.current = false;
    if (idx === 0) {
      setAnimated(false);
      setIdx(total);
    } else if (idx === total + 1) {
      setAnimated(false);
      setIdx(1);
    }
  }, [idx, total]);

  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      );
      return () => cancelAnimationFrame(raf);
    }
  }, [animated]);

  // ── Navigation ────────────────────────────────────────────
  const prev = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimated(true);
    setIdx((i) => i - 1);
    pause(); resume();
  }, [pause, resume]);

  const next = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimated(true);
    setIdx((i) => i + 1);
    pause(); resume();
  }, [pause, resume]);

  const goTo = useCallback((realIndex: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimated(true);
    setIdx(realIndex + 1);
    pause(); resume();
  }, [pause, resume]);

  // ── Touch ─────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current  = false;
    pause();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - (touchStartY.current ?? 0));
    if (dx > 10 && dx > dy) touchMoved.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const wasMoved = touchMoved.current;
    touchStartX.current = null;
    touchStartY.current = null;
    touchMoved.current  = false;

    if (wasMoved && Math.abs(dx) >= 40) {
      dx < 0 ? next() : prev();
    } else {
      resume();
    }
  };

  // ── Banner click — single source of truth ─────────────────
  // Called by the slide wrapper div onClick.
  // On touch: touchMoved was already reset to false in onTouchEnd,
  // so by the time the synthetic click fires this is always false → safe.
  const handleBannerClick = (banner: BannerItem) => {
    // Log the raw banner so we can see what fields the API returned
    console.log("[Banner click] raw data:", JSON.stringify(banner));

    const url = resolveLink(banner);
    console.log("[Banner click] resolved url:", url);

    if (!url) return;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url);
    }
  };

  // ── Active dot ────────────────────────────────────────────
  const dotActive =
    idx === 0         ? total - 1 :
    idx === total + 1 ? 0 :
    idx - 1;

  // ── Render ────────────────────────────────────────────────
  if (isLoading) return (
    <div className="w-full px-4 py-3 md:px-6 lg:px-[94px]">
      <BannerSkeleton />
    </div>
  );

  if (!total) return null;

  // Single banner
  if (total === 1) {
    const src = resolveImg(banners[0]);
    return (
      <div className="w-full px-4 py-3 md:px-6 lg:px-[94px]">
        <div
          className="w-full overflow-hidden rounded-xl md:rounded-2xl cursor-pointer"
          onClick={() => handleBannerClick(banners[0])}
        >
          {src
            ? <SlideImage src={src} alt={banners[0].title || "Banner"} />
            : <div className="w-full h-[160px] bg-orange-50 flex items-center justify-center" style={{ aspectRatio: "16/5" }}><span className="text-orange-300 text-sm">AstroGurujii</span></div>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-3 md:px-6 lg:px-[94px]">
      <div
        className="relative w-full overflow-hidden rounded-xl md:rounded-2xl select-none"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          style={{
            display: "flex",
            width: `${slides.length * 100}%`,
            transform: `translateX(-${(idx / slides.length) * 100}%)`,
            transition: animated ? "transform 480ms cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((banner, i) => {
            const src = resolveImg(banner);
            return (
              <div
                key={`slide-${i}`}
                style={{ width: `${100 / slides.length}%`, flexShrink: 0, cursor: "pointer" }}
                onClick={() => handleBannerClick(banner)}
              >
                {src
                  ? <SlideImage src={src} alt={banner.title || `Banner ${i}`} />
                  : <div className="w-full h-[160px] bg-orange-50 flex items-center justify-center" style={{ aspectRatio: "16/5" }}><span className="text-orange-300 text-sm">AstroGurujii</span></div>
                }
              </div>
            );
          })}
        </div>

        {/* Prev */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex
                     w-9 h-9 items-center justify-center rounded-full
                     bg-white/80 hover:bg-white shadow-md text-[#FF6F00]
                     transition-all duration-200 hover:scale-110 z-10 text-xl font-bold"
        >‹</button>

        {/* Next */}
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex
                     w-9 h-9 items-center justify-center rounded-full
                     bg-white/80 hover:bg-white shadow-md text-[#FF6F00]
                     transition-all duration-200 hover:scale-110 z-10 text-xl font-bold"
        >›</button>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === dotActive ? "20px" : "6px",
                height:     "6px",
                background: i === dotActive ? "#FF6F00" : "rgba(255,255,255,0.7)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}