import { CircleChevronLeftIcon, CircleChevronRightIcon } from "@/assets/icons";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LiveItem {
    id: string;
    name: string;
    profile_img: string;
    channel_id: string;
    password?: string;
}

function LiveDot() {
    return (
        <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
    );
}

function LiveCard({ item, onJoin }: { item: LiveItem; onJoin: (item: LiveItem) => void }) {
    const [imgErr, setImgErr] = useState(false);
    const initials = item.name
        .split(" ")
        .map((w) => w[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            onClick={() => onJoin(item)}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
            style={{ width: 170 }}
        >
            {/* Avatar with golden ring */}
            <div className="relative" style={{ paddingTop: 12 }}>
                <div
                    className="rounded-full p-[3px] transition-all duration-300 group-hover:scale-105"
                    style={{
                        width: 140,
                        height: 140,
                        background: "linear-gradient(135deg, #FF6F00 0%, #FFD15B 50%, #FF6F00 100%)",
                        boxShadow: "0 0 0 4px rgba(255,111,0,0.12), 0 6px 24px rgba(255,111,0,0.20)",
                    }}
                >
                    <div className="w-full h-full rounded-full p-[2.5px] bg-white">
                        {imgErr || !item.profile_img ? (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold select-none">
                                {initials}
                            </div>
                        ) : (
                            <img
                                src={item.profile_img}
                                alt={item.name}
                                onError={() => setImgErr(true)}
                                className="w-full h-full rounded-full object-cover"
                                style={{ objectPosition: "center 10%", objectFit: "cover" }} />
                        )}
                    </div>
                </div>

                {/* LIVE badge */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2.5 py-[3px] rounded-full shadow-lg shadow-red-200 whitespace-nowrap z-10">
                    <LiveDot />
                    LIVE
                </div>

                {/* Hover glow ring */}
                <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: "0 0 0 6px rgba(255,111,0,0.18)" }}
                />
            </div>

            {/* Name */}
            <p className="mt-3 font-poppins text-[13px] font-bold text-gray-900 text-center line-clamp-1 w-full px-1 group-hover:text-[#FF6F00] transition-colors duration-200">
                {item.name}
            </p>

            {/* Watch Now button */}
            <button
                className="mt-1.5 flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] font-semibold text-white transition-all duration-200 group-hover:scale-105 active:scale-95"
                style={{
                    background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                    boxShadow: "0 2px 8px rgba(255,111,0,0.30)",
                }}
            >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Now
            </button>
        </div>
    );
}

export default function LiveAstrologers({ data = [] }: { data: any[] }) {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Deduplicate by name
    const unique: LiveItem[] = data.filter(
        (item, idx, arr) => arr.findIndex((x: any) => x.name === item.name) === idx
    );

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
        setTimeout(updateScrollState, 350);
    };

    useEffect(() => {
        updateScrollState();
    }, [unique.length]);

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
            className="w-full py-8 md:py-12"
            style={{ background: "linear-gradient(180deg,#FFFBF4 0%,#FFF8EE 60%,#FFFBF4 100%)" }}
        >
            <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <LiveDot />
                            <span className="text-[11px] font-bold tracking-[0.18em] text-red-500 uppercase">
                                Live Now · {unique.length} Astrologers
                            </span>
                        </div>

                        <h2 className="font-poppins text-[22px] md:text-[28px] font-extrabold text-gray-900 leading-tight">
                            Watch{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Live Astrologers
                            </span>
                        </h2>
                        <p className="text-[13px] text-gray-400 mt-0.5">
                            Join live sessions happening right now — ask your questions live
                        </p>
                    </div>

                    {/* Arrows + View All desktop */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="transition-opacity disabled:opacity-30"
                        >
                            <CircleChevronLeftIcon color={canScrollLeft ? "#FF6F00" : "#E0E0E0"} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="transition-opacity disabled:opacity-30"
                        >
                            <CircleChevronRightIcon color={canScrollRight ? "#FF6F00" : "#E0E0E0"} />
                        </button>
                        <a
                            href="/live-astrologer"
                            className="ml-3 px-5 py-2 rounded-full text-[12px] font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 whitespace-nowrap"
                            style={{
                                background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                                boxShadow: "0 3px 12px rgba(255,111,0,0.30)",
                            }}
                        >
                            View All →
                        </a>
                    </div>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center gap-3 mb-7">
                    <div
                        className="h-px flex-1"
                        style={{ background: "linear-gradient(90deg,transparent,#FFD15B,transparent)" }}
                    />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9800">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <div
                        className="h-px flex-1"
                        style={{ background: "linear-gradient(90deg,transparent,#FFD15B,transparent)" }}
                    />
                </div>

                {/* Scroll row */}
                <div
                    ref={scrollRef}
                    onScroll={updateScrollState}
                    className="flex gap-8 pb-4"
                    style={{
                        overflowX: "auto",
                        scrollSnapType: "x mandatory",
                        scrollbarWidth: "none" as any,
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {unique.map((item) => (
                        <div key={item.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                            <LiveCard item={item} onJoin={handleJoin} />
                        </div>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="flex justify-center mt-5 sm:hidden">
                    <a
                        href="/live-astrologer"
                        className="px-7 py-2.5 rounded-full text-[13px] font-semibold text-white"
                        style={{
                            background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                            boxShadow: "0 3px 12px rgba(255,111,0,0.30)",
                        }}
                    >
                        View All Live Astrologers →
                    </a>
                </div>

            </div>
        </section>
    );
}