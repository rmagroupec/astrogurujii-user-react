/**
 * MainAstrologerProfile.tsx — Enhanced 3-card inline layout
 *
 * Aesthetic: "Sacred Luxury" — warm saffron/gold tones, deep shadows,
 * refined typography, subtle shimmer on hover, spiritual iconography.
 */

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ConnectionModal from "@/components/v2/ConnectionModal";
import { profile_api } from "@/https_service";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://admin.astrogurujii.com";

type AstrologerList = {
  id: string; name: string; profile_img: string; experience: number;
  avg_rate: string; consult: number; per_min_chat: number;
  per_min_chat_offer: string; per_min_voice_call: number;
  per_min_voice_call_offer: string;
  category: { name: string }[]; language: { name: string }[];
  skill: { name: string }[]; isChatOnline?: string; isVoiceOnline?: string;
};

type AstrologerDetail = AstrologerList & {
  about?: string; city?: string; state?: string; astro_country?: string;
  chat_count?: number; audio_count?: number; video_count?: number;
  followers?: number; rating_total_person?: number;
  five_rate?: string; four_rate?: string; three_rate?: string;
  two_rate?: string; one_rate?: string;
  rating?: { name: string; profileImg: string; rating: string; review: string; createdDate: string }[];
  galary?: { file: string; _id: string }[];
};

type ModalState = { astrologer: AstrologerDetail; callType: "chat" | "audio" } | null;

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const StarIcon = ({ size = 14, color = "#F59E0B" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "#94a3b8"}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ShieldCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="relative bg-white rounded-[20px] overflow-hidden shadow-md animate-pulse" style={{ border: "1px solid #f1e8d8" }}>
      {/* top gradient strip */}
      <div className="h-[6px] w-full" style={{ background: "linear-gradient(90deg,#FFD15B,#FF9800,#FF6F00)" }} />
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="flex justify-between w-full">
          <div className="h-6 w-20 bg-orange-100 rounded-full" />
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
        </div>
        <div className="w-[90px] h-[90px] rounded-full bg-orange-100" />
        <div className="h-4 w-20 bg-green-100 rounded-full" />
        <div className="h-6 w-40 bg-gray-100 rounded-lg" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
        <div className="h-px w-full bg-gray-100" />
        <div className="h-3 w-44 bg-gray-100 rounded" />
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6 mx-auto" />
        </div>
        <div className="h-4 w-28 bg-yellow-100 rounded" />
        <div className="h-14 w-full bg-orange-50 rounded-xl" />
        <div className="flex gap-3 w-full">
          <div className="flex-1 h-11 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-11 bg-green-100 rounded-xl" />
        </div>
        <div className="h-9 w-full bg-gray-50 rounded-full" />
        <div className="h-4 w-28 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Stars row ────────────────────────────────────────────────────────────────

function StarsRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <StarIcon key={n} size={13} color={n <= Math.round(rating) ? "#F59E0B" : "#E5E7EB"} />
      ))}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function AstrologerCard({
  a,
  onOpenModal,
}: {
  a: AstrologerDetail;
  onOpenModal: (a: AstrologerDetail, t: "chat" | "audio") => void;
}) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState((a as any).is_Follow === "1");
  const [hovered, setHovered] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;
    const next = !liked;
    setLiked(next);
    setFollowLoading(true);
    try {
      await axios.post(
        `${API_BASE}/user_api/follow_astro`,
        { astro_id: a.id, status: next ? "1" : "0" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      setLiked(!next);
    } finally {
      setFollowLoading(false);
    }
  };

  const chatBase = parseFloat(String(a.per_min_chat)) || 0;
  const chatOffer = a.per_min_chat_offer ? parseFloat(a.per_min_chat_offer) : null;
  const callBase = parseFloat(String(a.per_min_voice_call)) || 0;
  const callOffer = a.per_min_voice_call_offer ? parseFloat(a.per_min_voice_call_offer) : null;
  const baseRate = chatBase || callBase;
  const offerRate = chatOffer ?? callOffer;
  const hasDiscount = offerRate !== null && offerRate < baseRate;
  const displayRate = hasDiscount ? offerRate! : baseRate;
  const originalRate = hasDiscount ? baseRate : null;
  const discountPct = hasDiscount ? Math.round(((baseRate - offerRate!) / baseRate) * 100) : 0;


  const rating = parseFloat(a.avg_rate) || 0;
  const totalReviews = a.rating_total_person ?? a.rating?.length ?? 0;
  const isOnline = a.isChatOnline === "on" || a.isVoiceOnline === "on";
  const isChatOn = a.isChatOnline === "on";
  const isCallOn = a.isVoiceOnline === "on";

  const specialties = a.category?.slice(0, 3).map(c => c.name).join(" · ") ||
    a.skill?.slice(0, 3).map(s => s.name).join(" · ") || "";
  const languages = a.language?.map(l => l.name).join(", ") || "";
  const location = [a.city, a.state, a.astro_country].filter(Boolean).join(", ");
  const experience = a.experience ? `${a.experience} Yrs` : "";

  const avatar = imgErr || !a.profile_img
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=FF6F00&color=fff&size=200`
    : a.profile_img;

  const topReview = a.rating?.find(r => r.review?.trim().length > 5);

  return (
    <div

      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col bg-white rounded-[20px] overflow-hidden transition-all duration-300"
      style={{
        border: "1px solid #f0e6d3",
        boxShadow: hovered
          ? "0 20px 60px rgba(255,111,0,0.15), 0 4px 20px rgba(0,0,0,0.08)"
          : "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* ── Top accent bar ──────────────────────────────────────────────── */}
      <div className="h-[5px] w-full flex-shrink-0" style={{
        background: isOnline
          ? "linear-gradient(90deg,#34d399,#10b981,#059669)"
          : "linear-gradient(90deg,#FFD15B,#FF9800,#FF6F00)"
      }} />

      <div className="flex flex-col px-5 pt-4 pb-5 gap-0" onClick={() => navigate(`/consultants/${a.id}`)}>

        {/* ── Row: status + heart ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          {/* Online/Offline pill */}
          <div className={`flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[11px] font-semibold tracking-wide ${isOnline
            ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
            : "text-orange-700 bg-orange-50 border border-orange-200"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-orange-400"}`} />
            {isOnline ? "Online" : "Offline"}
          </div>

          {/* Heart */}
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              border: "1.5px solid",
              borderColor: liked ? "#fecaca" : "#e2e8f0",
              background: liked ? "#fff5f5" : "#fafafa",
            }}
          >
            <HeartIcon filled={liked} />
          </button>
        </div>

        {/* ── Avatar ──────────────────────────────────────────────────────── */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full transition-opacity duration-300"
              style={{
                background: isOnline
                  ? "radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(255,152,0,0.25) 0%, transparent 70%)",
                transform: "scale(1.15)",
                opacity: hovered ? 1 : 0.6,
              }}
            />
            <div
              className="w-[96px] h-[96px] rounded-full p-[2.5px]"
              style={{
                background: isOnline
                  ? "linear-gradient(135deg,#34d399,#10b981)"
                  : "linear-gradient(135deg,#FFD15B,#FF9800,#FF6F00)",
              }}
            >
              <img
                src={avatar}
                alt={a.name}
                className="w-full h-full rounded-full object-cover border-[3px] border-white"
                onError={() => setImgErr(true)}
              />
            </div>
            {/* Verified dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                <polyline points="20 6 9 17 4 12" strokeWidth="3" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Price ───────────────────────────────────────────────────────── */}
        {displayRate > 0 && (
          <div className="flex flex-col items-center mb-1">
            {originalRate !== null && (
              <span className="text-[13px] font-semibold text-[#FF6F00] line-through leading-tight">
                ₹{originalRate}/Min
              </span>
            )}
            <p className="font-bold text-[20px] m-0 leading-tight" style={{ color: "#16a34a", fontFamily: "'Outfit',sans-serif" }}>
              ₹{displayRate}
              <span className="text-[13px] font-semibold text-gray-400 ml-1">/Min</span>
            </p>
          </div>
        )}

        {/* ── Follow button ───────────────────────────────────────────────── */}
        <div className="flex justify-center mb-3">
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className="flex items-center gap-1.5 px-5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: liked
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "linear-gradient(135deg,#FF6F00,#FF9800)",
              color: "#fff",
              boxShadow: liked
                ? "0 3px 10px rgba(239,68,68,0.35)"
                : "0 3px 10px rgba(255,111,0,0.30)",
              border: "none",
              opacity: followLoading ? 0.7 : 1,
            }}
          >
            <HeartIcon filled={liked} />
            {followLoading ? "..." : liked ? "Following" : "+ Follow"}
          </button>
        </div>

        {/* ── Name ────────────────────────────────────────────────────────── */}
        <h3 className="text-center text-[21px] font-extrabold text-gray-900 leading-tight mb-1" style={{ fontFamily: "'Outfit',sans-serif" }}>
          {a.name}
        </h3>

        {/* ── Specialties ─────────────────────────────────────────────────── */}
        {specialties && (
          <p className="text-center text-[11.5px] text-gray-400 font-medium tracking-wide mb-0.5">
            {specialties}
          </p>
        )}

        {/* ── Languages ───────────────────────────────────────────────────── */}
        {languages && (
          <p className="text-center text-[11.5px] text-gray-400 mb-3">
            {languages}
          </p>
        )}

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div className="h-px w-full mb-3" style={{ background: "linear-gradient(90deg,transparent,#f0e6d3,transparent)" }} />

        {/* ── Location ────────────────────────────────────────────────────── */}
        {location && (
          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[12px] mb-3">
            <LocationIcon />
            <span className="font-medium">{location}</span>
          </div>
        )}

        {/* ── About ───────────────────────────────────────────────────────── */}
        {a.about && (
          <p className="text-center text-[12.5px] text-gray-500 leading-[1.65] line-clamp-3 mb-3">
            {a.about}
          </p>
        )}

        {/* ── Rating ──────────────────────────────────────────────────────── */}
        {rating > 0 && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <StarsRow rating={rating} />
            <span className="text-[14px] font-bold text-gray-800">{rating.toFixed(1)}</span>
            {totalReviews > 0 && (
              <span className="text-[12px] text-gray-400">({totalReviews} reviews)</span>
            )}
          </div>
        )}

        {/* ── Review quote ────────────────────────────────────────────────── */}
        {topReview && (
          <div className="relative rounded-xl px-4 py-3 mb-4 overflow-hidden"
            style={{ background: "linear-gradient(135deg,#fff8f0,#fff3e8)", border: "1px solid #fde8cc" }}>
            {/* decorative quote mark */}
            <svg className="absolute top-2 left-3 opacity-20" width="24" height="24" viewBox="0 0 24 24" fill="#FF9800">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2 italic pl-1">
              "{topReview.review}"
            </p>
            <p className="text-[11px] font-semibold text-orange-500 mt-1.5">— {topReview.name}</p>
          </div>
        )}

        {/* ── CHAT / CALL buttons ──────────────────────────────────────────── */}
        <div className="flex gap-2.5 mb-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const token = localStorage.getItem("token");

              if (!token) {
                window.dispatchEvent(new CustomEvent("open-login-modal"));
                return;
              }

              onOpenModal(a, "chat");
            }}
            className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl text-[13.5px] font-semibold transition-all duration-200 active:scale-95"
            style={
              isChatOn
                ? {
                  background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(255,111,0,0.30)",
                }
                : {
                  background: "#fff",
                  color: "#16a34a",
                  border: "2px solid #16a34a",
                }
            }
          >
            <ChatIcon /> Chat
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const token = localStorage.getItem("token");

              if (!token) {
                window.dispatchEvent(new CustomEvent("open-login-modal"));
                return;
              }

              onOpenModal(a, "audio");
            }}
            className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl text-[13.5px] font-semibold transition-all duration-200 active:scale-95"
            style={
              isCallOn
                ? {
                  background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(255,111,0,0.30)",
                }
                : {
                  background: "linear-gradient(135deg,#16a34a,#15803d)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
                }
            }
          >
            <PhoneIcon /> Call
          </button>
        </div>

        {/* ── Footer pill ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 rounded-full px-4 py-2 mb-3"
          style={{ background: "#f8faf8", border: "1px solid #e9f5ed" }}>
          <ShieldCheck />
          {languages && <span className="text-[11.5px] font-semibold text-gray-600">{languages}</span>}
          {experience && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
              <span className="text-[11.5px] font-semibold text-gray-600">{experience} Experience</span>
            </>
          )}
        </div>

        {/* ── View Profile ─────────────────────────────────────────────────── */}
        <a
          href={`/consultants/${a.id}`}
          className="flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-all duration-200 group/link"
          style={{ color: isOnline ? "#16a34a" : "#FF6F00" }}
        >
          <span className="group-hover/link:underline underline-offset-2">View Profile</span>
          <span className="transition-transform duration-200 group-hover/link:translate-x-1">
            <ArrowRightIcon />
          </span>
        </a>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MainAstrologerProfile() {
  const [astrologers, setAstrologers] = useState<AstrologerDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userWallet, setUserWallet] = useState(0);
  const [modal, setModal] = useState<ModalState>(null);

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await axios.post(
        `${API_BASE}/user_api/astrologer_list`,
        {
          search: "",
          page: "",
          is_chat: "on",
          followAstro: "",
          is_voice_call: "",
          is_video_call: "",
          cat_id: "",
          language_id: "",
          gender: "",
          sort_val: "",
          is_question: "",
          skill_id: "",
          country: "INR",
          report_id: "",
          expert_astro: "on",
        },
        { headers }
      );

      const top3: AstrologerList[] =
        res.data?.status
          ? (res.data.results ?? []).slice(0, 3)
          : [];

      const enriched = await Promise.all(
        top3.map(async (a) => {
          try {
            const d = await axios.post(
              `${API_BASE}/user_api/astrologer_profile`,
              { id: a.id },
              { headers }
            );

            return {
              ...a,
              ...(d.data?.results?.[0] ?? {}),
            } as AstrologerDetail;
          } catch {
            return a as AstrologerDetail;
          }
        })
      );

      setAstrologers(enriched);

    } catch (err) {
      console.log("Astrologer API Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await profile_api();
      if (res?.status === true && res.results) {
        const w = parseFloat(res.results.wallet ?? res.results.balance ?? res.results.amount ?? "0");
        setUserWallet(isNaN(w) ? 0 : w);
      }
    } catch { }
  }, []);

  useEffect(() => {
    fetchList();

    const token = localStorage.getItem("token");

    if (token) {
      fetchWallet();
    }
  }, [fetchList, fetchWallet]);

  const activeRate = modal
    ? modal.callType === "audio"
      ? parseFloat(modal.astrologer.per_min_voice_call_offer || String(modal.astrologer.per_min_voice_call)) || 0
      : parseFloat(modal.astrologer.per_min_chat_offer || String(modal.astrologer.per_min_chat)) || 0
    : 0;

  return (
    <>
      {/* Section */}
      <section
        className="w-full py-12 md:py-16 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#FFFBF4 0%,#FFF8EE 50%,#FFFBF4 100%)" }}
      >
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,152,0,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,111,0,0.04) 0%, transparent 40%)"
        }} />

        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10">

          {/* ── Section header ─────────────────────────────────────────────── */}
          <div className="text-center mb-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(255,152,0,0.1)", border: "1px solid rgba(255,152,0,0.2)" }}>
              <span className="text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase">✦ Our Experts ✦</span>
            </div>

            <h2
              className="text-[28px] md:text-[34px] font-extrabold text-gray-900 leading-tight block"
              style={{ fontFamily: "'Outfit',sans-serif" }}
            >
              Meet Our Featured{" "}
              <span style={{
                background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Astrologers
              </span>
            </h2>
            <p className="text-[14px] text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              Verified experts ready to guide you through life's most important questions.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg,transparent,#FF9800)" }} />
              <div className="flex gap-1.5">
                {[1, 0.6, 0.3].map((o, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: `rgba(255,152,0,${o})` }} />
                ))}
              </div>
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg,#FF9800,transparent)" }} />
            </div>
          </div>

          {/* ── Cards ─────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {isLoading
              ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
              : astrologers.map(a => (
                <AstrologerCard
                  key={a.id}
                  a={a}
                  onOpenModal={(ast, type) => setModal({ astrologer: ast, callType: type })}
                />
              ))
            }
          </div>

          {/* ── View all ──────────────────────────────────────────────────── */}
          {!isLoading && astrologers.length > 0 && (
            <div className="text-center mt-10">
              <a
                href="/chat-with-astrologer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#FF6F00,#FF9800)",
                  boxShadow: "0 4px 16px rgba(255,111,0,0.30)"
                }}
              >
                Explore All Astrologers
                <ArrowRightIcon />
              </a>
            </div>
          )}
        </div>
      </section>

      {modal && (
        <ConnectionModal
          isOpen
          onClose={() => setModal(null)}
          astrologer={{
            id: String(modal.astrologer.id),
            name: modal.astrologer.name,
            profileImage: modal.astrologer.profile_img,
            ratePerMinute: activeRate,
          }}
          userWalletBalance={userWallet}
          callType={modal.callType}
        />
      )}
    </>
  );
}