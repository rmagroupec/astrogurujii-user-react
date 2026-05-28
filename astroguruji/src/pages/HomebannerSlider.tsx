import { useEffect, useRef, useState } from "react";
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
  redirect_url?: string;
}

interface Props {
  banners: BannerItem[];
  isLoading?: boolean;
}

// ── Helper: resolve image URL ─────────────────────────────────
function resolveImg(banner: BannerItem): string {
  const raw =
    banner.img ||
    banner.file ||
    banner.image ||
    banner.banner_img ||
    "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${API_BASE_URL}/${raw.replace(/^\/+/, "")}`;
}

// ── Skeleton placeholder ──────────────────────────────────────
function BannerSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Mobile skeleton */}
      <div className="block md:hidden w-full h-[180px] rounded-xl bg-gray-200" />
      {/* Desktop skeleton */}
      <div className="hidden md:block w-full rounded-2xl bg-gray-200" style={{ aspectRatio: "16/5" }} />
    </div>
  );
}

// ── Banner image — mobile uses fixed height + cover, desktop uses
//    aspect-ratio container + contain so nothing gets cropped ──
function BannerImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="w-full cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Mobile: fixed height, cover (fills nicely on small screens) */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block md:hidden w-full object-cover object-center h-[160px] sm:h-[220px]"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/800x200/FFF5EC/FF6F00?text=AstroGurujii";
        }}
      />
      {/* Desktop: aspect-ratio box + object-contain — no cropping */}
      <div
        className="hidden md:block w-full bg-[#FFF9F4]"
        style={{ aspectRatio: "16/5" }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="w-full h-full object-contain object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/1200x375/FFF5EC/FF6F00?text=AstroGurujii";
          }}
        />
      </div>
    </div>
  );
}

// ── Fallback placeholder (no src) ────────────────────────────
function BannerPlaceholder({ onClick }: { onClick?: () => void }) {
  return (
    <div className="w-full cursor-pointer" onClick={onClick}>
      {/* Mobile */}
      <div className="flex md:hidden w-full h-[160px] sm:h-[220px] items-center justify-center bg-gradient-to-r from-[#FFF5EC] to-[#FFE8D6]">
        <span className="font-poppins text-[16px] font-semibold text-[#FF6F00] opacity-40">
          AstroGurujii
        </span>
      </div>
      {/* Desktop */}
      <div
        className="hidden md:flex w-full items-center justify-center bg-gradient-to-r from-[#FFF5EC] to-[#FFE8D6]"
        style={{ aspectRatio: "16/5" }}
      >
        <span className="font-poppins text-[20px] font-semibold text-[#FF6F00] opacity-40">
          AstroGurujii
        </span>
      </div>
    </div>
  );
}

export default function HomebannerSlider({ banners, isLoading }: Props) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = banners.length;

  const goTo = (index: number) => {
    if (isTransitioning || total === 0) return;
    setIsTransitioning(true);
    setCurrent((index + total) % total);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Auto-play every 3.5s
  useEffect(() => {
    if (total <= 1) return;
    autoPlayRef.current = setInterval(next, 3500);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [current, total]);

  const pauseAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const resumeAutoPlay = () => {
    if (total <= 1) return;
    autoPlayRef.current = setInterval(next, 3500);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    pauseAutoPlay();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    resumeAutoPlay();
  };

  const handleClick = (banner: BannerItem) => {
    const url = banner.link || banner.redirect_url;
    if (url) {
      if (url.startsWith("http")) {
        window.open(url, "_blank", "noopener");
      } else {
        navigate(url);
      }
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) return (
    <div className="w-full px-4 py-3 md:px-6 lg:px-[94px]">
      <BannerSkeleton />
    </div>
  );

  // ── Empty ─────────────────────────────────────────────────
  if (!total) return null;

  // ── Single banner ─────────────────────────────────────────
  if (total === 1) {
    const src = resolveImg(banners[0]);
    return (
      <div className="w-full px-4 py-3 md:px-6 lg:px-[94px]">
        <div className="w-full overflow-hidden rounded-xl md:rounded-2xl">
          {src ? (
            <BannerImage
              src={src}
              alt={banners[0].title || "Banner"}
              onClick={() => handleClick(banners[0])}
            />
          ) : (
            <BannerPlaceholder onClick={() => handleClick(banners[0])} />
          )}
        </div>
      </div>
    );
  }

  // ── Multi-banner slider ───────────────────────────────────
  return (
    <div className="w-full px-4 py-3 md:px-6 lg:px-[94px]">
      <div
        className="relative w-full overflow-hidden rounded-xl md:rounded-2xl select-none"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slide track */}
        <div
          className="flex transition-transform duration-[400ms] ease-in-out will-change-transform"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, i) => {
            const src = resolveImg(banner);
            return (
              <div
                key={banner._id || banner.id || i}
                className="shrink-0 w-full"
                onClick={() => handleClick(banner)}
              >
                {src ? (
                  <BannerImage
                    src={src}
                    alt={banner.title || `Banner ${i + 1}`}
                    onClick={() => handleClick(banner)}
                  />
                ) : (
                  <BannerPlaceholder onClick={() => handleClick(banner)} />
                )}
              </div>
            );
          })}
        </div>

        {/* Prev / Next arrows — desktop only */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex
                     w-9 h-9 items-center justify-center rounded-full
                     bg-white/80 hover:bg-white shadow-md text-[#FF6F00]
                     transition-all duration-200 hover:scale-110 z-10"
        >
          ‹
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex
                     w-9 h-9 items-center justify-center rounded-full
                     bg-white/80 hover:bg-white shadow-md text-[#FF6F00]
                     transition-all duration-200 hover:scale-110 z-10"
        >
          ›
        </button>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current ? "#FF6F00" : "rgba(255,255,255,0.7)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}