import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LiveItem {
    id: string;
    name: string;
    profile_img: string;
    channel_id: string;
    password?: string;
}

// ── Pulsing live dot ─────────────────────────────────────────
function LiveDot() {
    return (
        <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
    );
}

// ── Viewer count badge ────────────────────────────────────────
function ViewersBadge({ count }: { count: number }) {
    if (!count) return null;
    return (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-white/80">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            {count}
        </span>
    );
}

// ── Live Card — new design ────────────────────────────────────
function LiveCard({ item, onJoin, index }: { item: LiveItem; onJoin: (item: LiveItem) => void; index: number }) {
    const [imgErr, setImgErr] = useState(false);
    const [hovered, setHovered] = useState(false);

    const initials = item.name
        .split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();

    // Rotating accent colors per card for variety
    const accents = [
        { from: "#FF6F00", to: "#FFB347", glow: "rgba(255,111,0,0.5)" },
        { from: "#E91E8C", to: "#FF6B6B", glow: "rgba(233,30,140,0.4)" },
        { from: "#7B2FF7", to: "#E040FB", glow: "rgba(123,47,247,0.4)" },
        { from: "#00B4D8", to: "#0077B6", glow: "rgba(0,180,216,0.4)" },
    ];
    const accent = accents[index % accents.length];

    return (
        <div
            onClick={() => onJoin(item)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative flex-shrink-0 cursor-pointer"
            style={{ width: 200 }}
        >
            {/* Card body */}
            <div
                className="relative overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                    background: "linear-gradient(160deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",
                    border: hovered
                        ? `1.5px solid ${accent.from}`
                        : "1.5px solid rgba(255,255,255,0.08)",
                    boxShadow: hovered
                        ? `0 20px 40px ${accent.glow}, 0 0 0 1px ${accent.from}22`
                        : "0 8px 24px rgba(0,0,0,0.35)",
                    transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                }}
            >
                {/* Photo area */}
                <div className="relative h-[200px] overflow-hidden">
                    {/* Gradient overlay on photo */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            background: "linear-gradient(to top, #1a1a2e 0%, transparent 55%)",
                        }}
                    />

                    {imgErr || !item.profile_img ? (
                        <div
                            className="w-full h-full flex items-center justify-center text-white text-3xl font-extrabold"
                            style={{
                                background: `linear-gradient(135deg,${accent.from},${accent.to})`,
                            }}
                        >
                            {initials}
                        </div>
                    ) : (
                        <img
                            src={item.profile_img}
                            alt={item.name}
                            onError={() => setImgErr(true)}
                            className="w-full h-full object-cover transition-transform duration-500"
                            style={{
                                objectPosition: "center 10%",
                                transform: hovered ? "scale(1.08)" : "scale(1)",
                            }}
                        />
                    )}

                    {/* LIVE pill — top left */}
                    <div
                        className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                        style={{
                            background: "rgba(239,68,68,0.92)",
                            backdropFilter: "blur(6px)",
                            boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
                            letterSpacing: "0.08em",
                        }}
                    >
                        <LiveDot />
                        LIVE
                    </div>

                    {/* Accent gradient line at top */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[3px] z-20"
                        style={{ background: `linear-gradient(90deg,${accent.from},${accent.to})` }}
                    />
                </div>

                {/* Info area */}
                <div className="px-4 pt-3 pb-4">
                    <p className="font-poppins text-[14px] font-bold text-white leading-snug truncate">
                        {item.name}
                    </p>
                    <p className="font-poppins text-[11px] text-white/40 mt-0.5">Vedic Astrologer</p>

                    {/* Watch button */}
                    <button
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-bold text-white transition-all duration-200"
                        style={{
                            background: hovered
                                ? `linear-gradient(135deg,${accent.from},${accent.to})`
                                : "rgba(255,255,255,0.08)",
                            border: hovered
                                ? "none"
                                : `1px solid rgba(255,255,255,0.12)`,
                            boxShadow: hovered ? `0 4px 14px ${accent.glow}` : "none",
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Watch Now
                    </button>
                </div>

                {/* Sparkle particles — decorative */}
                {hovered && (
                    <>
                        <div className="absolute top-[52px] right-4 w-1 h-1 rounded-full opacity-60 animate-ping"
                            style={{ background: accent.to }} />
                        <div className="absolute top-[80px] right-8 w-0.5 h-0.5 rounded-full opacity-40 animate-ping"
                            style={{ background: accent.from, animationDelay: "0.3s" }} />
                    </>
                )}
            </div>
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────
export default function LiveAstrologers({ data = [] }: { data: any[] }) {
    const navigate  = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft]   = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const unique: LiveItem[] = data.filter(
        (item, idx, arr) => arr.findIndex((x: any) => x.name === item.name) === idx
    );

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scroll = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
        setTimeout(updateScrollState, 350);
    };

    useEffect(() => { updateScrollState(); }, [unique.length]);

    if (!unique.length) return null;

    const handleJoin = (item: LiveItem) => {
        navigate(`/live/${item.id}`, {
            state: {
                live_id: item.id,
                channel_id: item.channel_id,
                channel_name: item.channel_id,
                astro_id: item.id,
                astro_name: item.name,
                astro_image: item.profile_img,
                title: `${item.name} Live`,
                live_type: "home",
            },
        });
    };

    return (
        <section
            className="w-full py-10 md:py-16 overflow-hidden"
            style={{ background: "#ffffff" }}
        >


            <div className="relative mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

                {/* Header row */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        {/* eyebrow */}
                        <div className="flex items-center gap-2 mb-2">
                            <LiveDot />
                            <span
                                className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500"
                            >
                                Live Now · {unique.length} Astrologers
                            </span>
                        </div>

                        <h2
                            className="text-[26px] md:text-[32px] font-extrabold leading-tight text-gray-900"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Watch{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg,#FF6F00,#FFB347)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Live Astrologers
                            </span>
                        </h2>
                        <p className="text-[13px] mt-1" style={{ color: "#9ca3af" }}>
                            Join live sessions happening right now — ask your questions live
                        </p>
                    </div>

                    {/* Desktop: arrows + View All */}
                    <div className="hidden sm:flex items-center gap-3">
                        {[["left", canScrollLeft], ["right", canScrollRight]].map(([dir, enabled]) => (
                            <button
                                key={dir as string}
                                onClick={() => scroll(dir as "left" | "right")}
                                disabled={!enabled}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
                                style={{
                                    background: enabled ? "rgba(255,111,0,0.10)" : "rgba(0,0,0,0.04)",
                                    border: enabled ? "1px solid rgba(255,111,0,0.4)" : "1px solid rgba(0,0,0,0.10)",
                                    color: enabled ? "#FF6F00" : "#d1d5db",
                                }}
                            >
                                {dir === "left"
                                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                                }
                            </button>
                        ))}

                        <a
                            href="/live-astrologer"
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold text-white transition-all duration-200 hover:scale-105"
                            style={{
                                background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                                boxShadow: "0 4px 16px rgba(255,111,0,0.35)",
                            }}
                        >
                            View All
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>

                {/* Card strip */}
                <div
                    ref={scrollRef}
                    onScroll={updateScrollState}
                    className="flex gap-4 overflow-x-auto pb-2"
                    style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <style>{`.live-scroll::-webkit-scrollbar{display:none}`}</style>
                    {unique.map((item, i) => (
                        <div key={item.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                            <LiveCard item={item} onJoin={handleJoin} index={i} />
                        </div>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="flex justify-center mt-6 sm:hidden">
                    <a
                        href="/live-astrologer"
                        className="px-7 py-2.5 rounded-full text-[13px] font-bold text-white"
                        style={{
                            background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                            boxShadow: "0 4px 14px rgba(255,111,0,0.35)",
                        }}
                    >
                        View All Live Astrologers →
                    </a>
                </div>
            </div>
        </section>
    );
}