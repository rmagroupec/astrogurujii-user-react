/**
 * LiveAstrologerPage.tsx
 * Route: /live-astrologer
 * White background version.
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

const API = "https://admin.astrogurujii.com";
const authToken = () => localStorage.getItem("token") ?? "";

interface Astrologer {
  _id: string;
  displayname: string;
  profile_img: string;
  name: string;
}

interface LiveItem {
  _id: string;
  title: string;
  is_live: "0" | "1" | string;
  channel_id: string;
  start_time: string;
  end_time: string;
  users: string[];
  live_date: string | null;
  recurringDay: string;
  status: string;
  astrologer_id: Astrologer;
}

const isLive       = (item: LiveItem) => item.is_live === "1";
const viewerCount  = (item: LiveItem) => item.users?.length ?? 0;
const astroName    = (item: LiveItem) => item.astrologer_id?.displayname || item.astrologer_id?.name || "Astrologer";
const astroImg     = (item: LiveItem) => item.astrologer_id?.profile_img || "";
const initials     = (name: string)   => name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
const cleanTitle   = (title: string)  => {
  if (!title) return "Live Session";
  const t = title.trim();
  return t.length > 60 ? t.slice(0, 57) + "…" : t;
};

function LiveDot({ size = "sm" }: { size?: "sm" | "md" }) {
  const sz = size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";
  return (
    <span className="relative flex shrink-0" style={{ width: size === "md" ? 10 : 8, height: size === "md" ? 10 : 8 }}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`} />
      <span className={`relative inline-flex rounded-full ${sz} bg-red-500`} />
    </span>
  );
}

// Skeleton — light style for white bg
function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-gray-100 border border-gray-200">
      <div className="h-[200px] bg-gray-200" />
      <div className="px-4 pt-3 pb-4 space-y-2">
        <div className="h-3 bg-gray-300 rounded-full w-3/4" />
        <div className="h-2.5 bg-gray-200 rounded-full w-1/2" />
        <div className="h-8 bg-gray-200 rounded-xl mt-3" />
      </div>
    </div>
  );
}

// Empty state — dark text for white bg
function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">🌙</div>
      <p className="text-gray-800 font-semibold text-lg mb-1">No sessions right now</p>
      <p className="text-gray-400 text-sm mb-6">Check back soon or refresh the page.</p>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold transition"
        style={{ background: "linear-gradient(135deg,#FF6F00,#FF9800)", boxShadow: "0 4px 14px rgba(255,111,0,0.35)" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.36" />
        </svg>
        Refresh
      </button>
    </div>
  );
}

const ACCENTS = [
  { from: "#FF6F00", to: "#FFB347", glow: "rgba(255,111,0,0.5)" },
  { from: "#E91E8C", to: "#FF6B6B", glow: "rgba(233,30,140,0.4)" },
  { from: "#7B2FF7", to: "#E040FB", glow: "rgba(123,47,247,0.4)" },
  { from: "#00B4D8", to: "#0077B6", glow: "rgba(0,180,216,0.4)" },
];

function LiveCard({ item, onJoin, index }: { item: LiveItem; onJoin: (item: LiveItem) => void; index: number }) {
  const live    = isLive(item);
  const name    = astroName(item);
  const img     = astroImg(item);
  const viewers = viewerCount(item);
  const title   = cleanTitle(item.title);
  const [imgErr, setImgErr]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div
      onClick={() => live && onJoin(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{ cursor: live ? "pointer" : "default" }}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: "linear-gradient(160deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",
          border: hovered && live ? `1.5px solid ${accent.from}` : "1.5px solid rgba(255,255,255,0.08)",
          boxShadow: hovered && live
            ? `0 20px 40px ${accent.glow}, 0 0 0 1px ${accent.from}22`
            : "0 4px 16px rgba(0,0,0,0.15)",
          transform: hovered && live ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
          opacity: !live ? 0.88 : 1,
        }}
      >
        {/* Photo */}
        <div className="relative h-[200px] overflow-hidden">
          <div className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(to top, rgba(15,20,50,0.95) 0%, rgba(15,20,50,0.2) 40%, transparent 65%)" }} />

          {img && !imgErr ? (
            <img
              src={img} alt={name}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ objectPosition: "center 10%", transform: hovered && live ? "scale(1.08)" : "scale(1)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-extrabold"
              style={{ background: `linear-gradient(135deg,${accent.from},${accent.to})` }}>
              {initials(name)}
            </div>
          )}

          {/* LIVE / UPCOMING badge */}
          <div
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
            style={{
              background: live ? "rgba(239,68,68,0.92)" : "rgba(245,158,11,0.92)",
              backdropFilter: "blur(6px)",
              boxShadow: live ? "0 2px 8px rgba(239,68,68,0.5)" : "0 2px 8px rgba(245,158,11,0.4)",
              letterSpacing: "0.08em",
            }}
          >
            {live ? <><LiveDot />LIVE</> : <><span>🔔</span>UPCOMING</>}
          </div>

          {/* Viewer count */}
          {live && viewers > 0 && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold text-white"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              {viewers}
            </div>
          )}

          {/* Accent top stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] z-20"
            style={{ background: `linear-gradient(90deg,${accent.from},${accent.to})` }} />
        </div>

        {/* Info */}
        <div className="px-4 pt-3 pb-4">
          <p className="font-poppins text-[14px] font-bold text-white leading-snug truncate">{name}</p>
          <p className="font-poppins text-[11px] text-white/40 mt-0.5 truncate">{title}</p>

          {!live && (
            <p className="text-[11px] text-white/30 mt-1">
              🕐 {item.start_time} – {item.end_time}
            </p>
          )}

          <button
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-bold text-white transition-all duration-200"
            style={{
              background: live && hovered
                ? `linear-gradient(135deg,${accent.from},${accent.to})`
                : "rgba(255,255,255,0.08)",
              border: live && hovered ? "none" : "1px solid rgba(255,255,255,0.12)",
              boxShadow: live && hovered ? `0 4px 14px ${accent.glow}` : "none",
            }}
          >
            {live
              ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>Watch Now</>
              : <><span>🔔</span>Set Reminder</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LiveAstrologersPage() {
  const navigate = useNavigate();
  const [all, setAll]         = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState<"all" | "live" | "upcoming">("all");

  const fetchLive = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API}/user_api/listing_of_live_astrlogers`,
        { headers: { Authorization: `Bearer ${authToken()}` } }
      );
      if (res.data?.status && Array.isArray(res.data.data)) {
        const sorted = [...res.data.data].sort((a: LiveItem, b: LiveItem) => {
          if (isLive(a) && !isLive(b)) return -1;
          if (!isLive(a) && isLive(b)) return 1;
          return 0;
        });
        setAll(sorted);
      } else {
        setAll([]);
      }
    } catch {
      setError("Could not load live sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 60_000);
    return () => clearInterval(interval);
  }, [fetchLive]);

  const handleJoin = (item: LiveItem) => {
    axios.post(`${API}/user_api/join_live`, { live_id: item._id },
      { headers: { Authorization: `Bearer ${authToken()}` } }).catch(() => {});
    navigate(`/live/${item._id}`, {
      state: {
        live_id: item._id,
        channel_id: item.channel_id,
        channel_name: item.channel_id,
        astro_id: item.astrologer_id?._id,
        astro_name: astroName(item),
        astro_image: astroImg(item),
        title: cleanTitle(item.title),
        start_time: item.start_time,
        end_time: item.end_time,
        viewers: viewerCount(item),
        live_type: "home",
      },
    });
  };

  const liveItems     = all.filter(isLive);
  const upcomingItems = all.filter((i) => !isLive(i));
  const displayed     = filter === "live" ? liveItems : filter === "upcoming" ? upcomingItems : all;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <BreadcrumbHeader
        title="Live Astrologers"
        highlight="Astrogurujii"
        description="Join live sessions with expert astrologers and get real-time guidance."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Live Astrologers" }]}
      />

      {/* Stats strip */}
      <div style={{ background: "linear-gradient(160deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <LiveDot size="md" />
            <span className="text-white text-sm font-semibold">{liveItems.length} Live Now</span>
          </div>
          {upcomingItems.length > 0 && (
            <span className="text-white/50 text-sm">{upcomingItems.length} Upcoming</span>
          )}
          <span className="text-white/30 text-xs ml-auto hidden sm:inline">Auto-refreshes every 60s</span>
        </div>
      </div>

      {/* ✅ White background content area */}
      <div className="bg-white" style={{ minHeight: "60vh" }}>
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Filter tabs + refresh */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {(["all", "live", "upcoming"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
                style={{
                  background: filter === f ? "linear-gradient(135deg,#FF6F00,#FF9800)" : "#f5f5f5",
                  color: filter === f ? "#fff" : "#555",
                  border: filter === f ? "none" : "1px solid #e0e0e0",
                  boxShadow: filter === f ? "0 4px 14px rgba(255,111,0,0.35)" : "none",
                }}
              >
                {f === "all"      && `All (${all.length})`}
                {f === "live"     && `🔴 Live (${liveItems.length})`}
                {f === "upcoming" && `🕐 Upcoming (${upcomingItems.length})`}
              </button>
            ))}

            {/* Refresh button */}
            <button
              onClick={fetchLive}
              disabled={loading}
              title="Refresh"
              className="ml-auto p-2.5 rounded-full transition disabled:opacity-40"
              style={{ background: "#f5f5f5", color: "#555", border: "1px solid #e0e0e0" }}
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.36" />
              </svg>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600"
              style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
              ⚠️ {error}
              <button onClick={fetchLive} className="ml-auto text-red-500 hover:text-red-700 font-semibold text-xs underline">
                Retry
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <EmptyState onRefresh={fetchLive} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayed.map((item, i) => (
                <LiveCard key={item._id} item={item} onJoin={handleJoin} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}