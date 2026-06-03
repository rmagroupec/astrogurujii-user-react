/**
 * LiveAstrologerPage.tsx  — fixed for actual API response
 * Route: /live-astrologer
 *
 * API: GET /user_api/listing_of_live_astrlogers  (bearer token)
 * Response fields (confirmed from real data):
 *   _id, title, is_live ("0"/"1"), channel_id, start_time, end_time,
 *   users (array), live_date, recurringDay, status
 *   astrologer_id: { _id, displayname, profile_img, name, number, email }
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

const API = "https://admin.astrogurujii.com";
const authToken = () => localStorage.getItem("token") ?? "";

// ─── Types (matching real API) ────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isLive = (item: LiveItem) => item.is_live === "1";
const viewerCount = (item: LiveItem) => item.users?.length ?? 0;

const astroName = (item: LiveItem) =>
  item.astrologer_id?.displayname || item.astrologer_id?.name || "Astrologer";

const astroImg = (item: LiveItem) => item.astrologer_id?.profile_img || "";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();

// Clean up messy/garbage titles (very long, repeated chars, etc.)
const cleanTitle = (title: string) => {
  if (!title) return "Live Session";
  const trimmed = title.trim();
  // If title is longer than 60 chars, truncate cleanly
  return trimmed.length > 60 ? trimmed.slice(0, 57) + "…" : trimmed;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 animate-pulse shadow-sm">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-8 bg-orange-50 rounded-xl mt-3" />
      </div>
    </div>
  );
}

// ─── Live pulsing dot ─────────────────────────────────────────────────────────

function LiveDot({ size = "sm" }: { size?: "sm" | "md" }) {
  const sz = size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";
  const inner = size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";
  return (
    <span className="relative flex shrink-0" style={{ width: size === "md" ? 10 : 8, height: size === "md" ? 10 : 8 }}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`} />
      <span className={`relative inline-flex rounded-full ${inner} bg-red-500`} />
    </span>
  );
}

// ─── Single Card ──────────────────────────────────────────────────────────────

function LiveCard({ item, onJoin }: { item: LiveItem; onJoin: (item: LiveItem) => void }) {
  const live = isLive(item);
  const name = astroName(item);
  const img = astroImg(item);
  const viewers = viewerCount(item);
  const title = cleanTitle(item.title);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      onClick={() => live && onJoin(item)}
      className={`group relative rounded-2xl overflow-hidden bg-white shadow-md border-2 transition-all duration-300
        ${live
          ? "border-[#C8960C] cursor-pointer hover:shadow-xl hover:-translate-y-1"
          : "border-gray-100 cursor-default"}`}
    >
      {/* ── Image ── */}
      <div className="relative h-[240px] overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100">
        {img && !imgErr ? (
          <img
            src={img} alt={name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg select-none">
              {initials(name)}
            </div>
          </div>
        )}

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* LIVE / SCHEDULED badge */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow
          ${live ? "bg-red-500" : "bg-amber-400"}`}>
          {live ? <LiveDot /> : <span className="text-[10px]">🔔</span>}
          {live ? "LIVE" : "SCHEDULED"}
        </div>

        {/* Viewer count */}
        {live && viewers > 0 && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-[11px] font-semibold">{viewers}</span>
          </div>
        )}

        {/* Verified badge top-right (when no viewer count) */}
        {!live && (
          <div className="absolute top-2.5 right-2.5 bg-white/90 rounded-lg p-1 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF6F00" stroke="#FF6F00" strokeWidth="1" />
              <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        )}

        {/* Icon circle at bottom center */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#8B5E0A] flex items-center justify-center shadow-md border-2 border-white z-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
          </svg>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="pt-7 px-3 pb-3 text-center">
        <h3 className="font-poppins text-[14px] font-bold text-gray-900 truncate">{name}</h3>
        <p className="text-[12px] text-[#C8960C] font-semibold mt-0.5 truncate">{title}</p>

        {/* Time row */}
        {(item.start_time || item.live_date) && (
          <div className="flex items-center justify-center gap-1 mt-1 text-gray-400 text-[11px]">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{item.start_time}{item.end_time ? ` – ${item.end_time}` : ""}</span>
          </div>
        )}

        {/* Stars row */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map(s => (
            <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-[11px] text-gray-500 ml-1">4.8</span>
          <span className="text-gray-200 mx-1">|</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[11px] text-gray-500">5 Yrs Exp.</span>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); live && onJoin(item); }}
          disabled={!live}
          className={`mt-3 w-full py-2 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all
            ${live
              ? "bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]"
              : "border-2 border-red-500 text-red-600 hover:bg-red-50 cursor-not-allowed"}`}
        >
          {live ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Chat Now
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Book Session
            </>
          )}
        </button>
      </div>
    </div>
  );
}
// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-5xl select-none">📡</div>
      <div>
        <p className="text-xl font-bold text-gray-800">No Live Sessions Right Now</p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
          Astrologers go live regularly. Check back soon or refresh the page.
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.36" />
        </svg>
        Refresh
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LiveAstrologersPage() {
  const navigate = useNavigate();
  const [all, setAll] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchLive = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API}/user_api/listing_of_live_astrlogers`,
        { headers: { Authorization: `Bearer ${authToken()}` } }
      );
      if (res.data?.status && Array.isArray(res.data.data)) {
        // Sort: live first, then by start_time
        const sorted = [...res.data.data].sort((a: LiveItem, b: LiveItem) => {
          if (isLive(a) && !isLive(b)) return -1;
          if (!isLive(a) && isLive(b)) return 1;
          return 0;
        });
        setAll(sorted);
      } else {
        setAll([]);
      }
    } catch (e) {
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

  // ── Navigate to watch screen ───────────────────────────────────────────────
  const handleJoin = (item: LiveItem) => {
    // Call join_live API (fire & forget — same as Flutter)
    axios.post(
      `${API}/user_api/join_live`,
      { live_id: item._id },
      { headers: { Authorization: `Bearer ${authToken()}` } }
    ).catch(() => { });

    navigate(`/live/${item._id}`, {
      state: {
        live_id: item._id,
        channel_id: item.channel_id,
        channel_name: item.channel_id, // channel_id IS the Agora channel name
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

  // ── Derived lists ──────────────────────────────────────────────────────────
  const liveItems = all.filter(isLive);
  const upcomingItems = all.filter((i) => !isLive(i));

  const displayed =
    filter === "live" ? liveItems :
      filter === "upcoming" ? upcomingItems : all;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="Live Astrologers"
        highlight="Astrogurujii"
        description="Join live sessions with expert astrologers and get real-time guidance."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Live Astrologers" }]}
      />

      {/* Stats strip */}
      <div className="bg-gradient-to-r from-orange-900 to-brand-orange">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <LiveDot size="md" />
            <span className="text-white text-sm font-semibold">
              {liveItems.length} Live Now
            </span>
          </div>
          {upcomingItems.length > 0 && (
            <span className="text-white/70 text-sm">
              {upcomingItems.length} Upcoming
            </span>
          )}
          <span className="text-white/40 text-xs ml-auto hidden sm:inline">
            Auto-refreshes every 60s
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Filter tabs + refresh */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["all", "live", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap
                ${filter === f
                  ? "bg-brand-orange text-white shadow-md shadow-orange-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}
            >
              {f === "all" && `All (${all.length})`}
              {f === "live" && `🔴 Live (${liveItems.length})`}
              {f === "upcoming" && `🕐 Upcoming (${upcomingItems.length})`}
            </button>
          ))}

          <button
            onClick={fetchLive}
            disabled={loading}
            title="Refresh"
            className="ml-auto p-2.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-brand-orange transition disabled:opacity-40"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.36" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
            <button onClick={fetchLive} className="ml-auto underline text-red-600 font-semibold whitespace-nowrap">Retry</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <EmptyState onRefresh={fetchLive} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map((item) => (
              <LiveCard key={item._id} item={item} onJoin={handleJoin} />
            ))}
          </div>
        )}

      </div>

      <Footer />

      <style>{`
        @keyframes ping { 75%,100%{ transform:scale(2.2); opacity:0; } }
      `}</style>
    </div>
  );
}