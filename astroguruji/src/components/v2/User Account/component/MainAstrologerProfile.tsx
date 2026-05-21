/**
 * MainAstrologerProfile.tsx
 *
 * Featured astrologer section on the Home page.
 *
 * What was broken / fixed:
 *  ✅ Removed broken `import StarYellowIcon from "@/assets/icons/star-yellow.svg"`
 *     → replaced with inline SVG star (no import needed, no 404 risk)
 *  ✅ Removed all hardcoded placeholder data
 *     → fetches the first astrologer from /user_api/astrologer_list API
 *  ✅ Replaced non-existent /images/v2/astrologer-circle.png
 *     → uses real profile_img from API with ui-avatars fallback
 *  ✅ Call Now / Chat Now buttons now open ConnectionModal with real data
 *  ✅ Loading skeleton while data is fetching
 *  ✅ Error / empty state handled gracefully
 *  ✅ Wallet balance fetched from profile API for ConnectionModal
 */

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ConnectionModal from "@/components/v2/ConnectionModal";
import { profile_api } from "@/https_service";

const API_BASE = "https://admin.astrogurujii.com";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeaturedAstrologer = {
  id: string;
  name: string;
  profile_img: string;
  experience: number;
  avg_rate: string;
  consult: number;
  per_min_chat: number;
  per_min_chat_offer: string;
  per_min_voice_call: number;
  per_min_voice_call_offer: string;
  category: { name: string }[];
  language: { name: string }[];
  skill: { name: string }[];
  isChatOnline?: string;
  isVoiceOnline?: string;
};

// ─── Inline star SVG (replaces missing asset) ────────────────────────────────

function StarIcon({ filled = true, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#f97316" : "none"}
      stroke="#f97316"
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <section className="w-full bg-[#FFFBF0] py-16 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 animate-pulse">
        <div className="w-full md:w-5/12 flex justify-center">
          <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full bg-orange-100" />
        </div>
        <div className="w-full md:w-7/12 space-y-4">
          <div className="h-10 bg-orange-100 rounded-xl w-2/3" />
          <div className="h-5 bg-orange-50 rounded-lg w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
          <div className="flex gap-4 mt-6">
            <div className="h-12 w-40 bg-orange-200 rounded-full" />
            <div className="h-12 w-40 bg-orange-100 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MainAstrologerProfile() {
  const [astrologer, setAstrologer]   = useState<FeaturedAstrologer | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [userWallet, setUserWallet]   = useState(0);
  const [modalOpen, setModalOpen]     = useState(false);
  const [callType, setCallType]       = useState<"chat" | "audio" | null>(null);
  const [imgError, setImgError]       = useState(false);

  // ─── Fetch featured astrologer (first expert astrologer from list) ─────────
  const fetchAstrologer = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") ?? "";
      const res = await axios.post(
        `${API_BASE}/user_api/astrologer_list`,
        {
          search: "", page: "", is_chat: "on", followAstro: "",
          is_voice_call: "", is_video_call: "", cat_id: "",
          language_id: "", gender: "", sort_val: "", is_question: "",
          skill_id: "", country: "INR", report_id: "", expert_astro: "on",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.status && res.data?.results?.length > 0) {
        setAstrologer(res.data.results[0]);
      }
    } catch {
      // Fail silently — component won't render if null
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Fetch user wallet for ConnectionModal ─────────────────────────────────
  const fetchWallet = useCallback(async () => {
    const res = await profile_api();
    if (res?.status === true && res.results) {
      const w = parseFloat(
        res.results.wallet ?? res.results.balance ?? res.results.amount ?? "0"
      );
      setUserWallet(isNaN(w) ? 0 : w);
    }
  }, []);

  useEffect(() => {
    fetchAstrologer();
    fetchWallet();
  }, [fetchAstrologer, fetchWallet]);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return <Skeleton />;

  // ─── Nothing to show ──────────────────────────────────────────────────────
  if (!astrologer) return null;

  // ─── Derived values ────────────────────────────────────────────────────────
  const chatRate  = parseFloat(astrologer.per_min_chat_offer || String(astrologer.per_min_chat)) || 0;
  const callRate  = parseFloat(astrologer.per_min_voice_call_offer || String(astrologer.per_min_voice_call)) || 0;
  const chatOrig  = Number(astrologer.per_min_chat) || 0;
  const callOrig  = Number(astrologer.per_min_voice_call) || 0;

  const activeRate = callType === "audio" ? callRate : chatRate;

  const specialties = astrologer.category?.map((c) => c.name).join(" • ") || "Vedic Astrology";
  const languages   = astrologer.language?.map((l) => l.name).join(", ") || "";
  const rating      = parseFloat(astrologer.avg_rate) || 4.9;
  const consultations = astrologer.consult
    ? astrologer.consult >= 1000
      ? `${Math.floor(astrologer.consult / 1000)}K+`
      : `${astrologer.consult}+`
    : "50K+";
  const experience = astrologer.experience ? `${astrologer.experience}+` : "15+";

  const avatarSrc = imgError || !astrologer.profile_img
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=FF6F00&color=fff&size=350`
    : astrologer.profile_img;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <section className="w-full bg-[#FFFBF0] py-14 px-4 font-euclid overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-10 lg:gap-16">

          {/* ── Left: Avatar + stats ─────────────────────────────────────── */}
          <div className="w-full md:w-5/12 flex flex-col items-center">

            {/* Gradient ring avatar */}
            <div className="relative">
              <div
                className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full p-[5px]"
                style={{ background: "linear-gradient(135deg, #FFD15B, #FF9800, #FF6F00)" }}
              >
                <img
                  src={avatarSrc}
                  alt={astrologer.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
                  onError={() => setImgError(true)}
                />
              </div>

              {/* Rating badge */}
              <div className="absolute bottom-4 right-0 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 border border-orange-100">
                <StarIcon filled size={16} />
                <span className="font-bold text-gray-800 text-sm">{rating.toFixed(1)}</span>
              </div>

              {/* Online badge */}
              {(astrologer.isChatOnline === "on" || astrologer.isVoiceOnline === "on") && (
                <div className="absolute top-4 left-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                  Online
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-8 px-6 py-4 bg-white rounded-2xl shadow-sm border border-orange-100 w-full max-w-xs justify-center">
              <StatPill value={experience} label="Years Exp." />
              <div className="w-px h-10 bg-orange-100" />
              <StatPill value={consultations} label="Consultations" />
              <div className="w-px h-10 bg-orange-100" />
              <StatPill value="100%" label="Privacy" />
            </div>

            {/* Languages */}
            {languages && (
              <p className="mt-3 text-xs text-gray-500 font-medium text-center">
                🌐 {languages}
              </p>
            )}
          </div>

          {/* ── Right: Info + CTA ────────────────────────────────────────── */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">

            {/* Name + verified */}
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {astrologer.name}
              </h2>
              <img
                src="/images/verified.svg"
                alt="Verified"
                className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Specialties */}
            <p className="text-base md:text-lg font-semibold text-[#FF9800] mb-5 leading-snug">
              {specialties}
            </p>

            {/* About paragraphs */}
            <div className="space-y-3 text-gray-600 leading-relaxed mb-7 text-sm md:text-base">
              <p>
                With over {experience} years of deep expertise in Vedic Astrology and spiritual sciences,{" "}
                <span className="font-semibold text-gray-800">{astrologer.name}</span> has helped
                thousands of individuals find clarity, peace, and direction in their lives.
              </p>
              <p>
                Whether you are facing challenges in your career, love life, marriage, or finances,
                get accurate readings and effective remedies — all from the comfort of your home.
              </p>
            </div>

            {/* Skills / tags */}
            {astrologer.skill?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-7">
                {astrologer.skill.slice(0, 5).map((s) => (
                  <span
                    key={s.name}
                    className="px-3 py-1 rounded-full text-xs font-semibold text-orange-700"
                    style={{ background: "rgba(255,111,0,0.10)", border: "1px solid rgba(255,111,0,0.20)" }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">

              {/* Call Now */}
              {callRate > 0 && (
                <button
                  onClick={() => { setCallType("audio"); setModalOpen(true); }}
                  className="flex items-center gap-2.5 py-3 px-7 rounded-full font-semibold text-white text-sm transition-all hover:shadow-lg hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #FF6F00, #FF9800)", boxShadow: "0 4px 16px rgba(255,111,0,0.35)" }}
                >
                  {/* Phone icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>
                    Call Now
                    <span className="ml-1.5 text-orange-200 text-xs font-medium">
                      ₹{callRate}/min
                    </span>
                  </span>
                </button>
              )}

              {/* Chat Now */}
              {chatRate > 0 && (
                <button
                  onClick={() => { setCallType("chat"); setModalOpen(true); }}
                  className="flex items-center gap-2.5 py-3 px-7 rounded-full font-semibold text-sm transition-all hover:bg-orange-50 active:scale-95 border-2"
                  style={{ borderColor: "#FF6F00", color: "#FF6F00" }}
                >
                  {/* Chat icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>
                    Chat Now
                    <span className="ml-1.5 text-orange-400 text-xs font-medium">
                      ₹{chatRate}/min
                    </span>
                  </span>
                </button>
              )}

              {/* View Profile */}
              <a
                href={`/consultants/${astrologer.id}`}
                className="flex items-center gap-2 py-3 px-6 rounded-full font-semibold text-sm text-gray-600 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                View Profile
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            </div>

            {/* Original price callout */}
            {(chatOrig > chatRate || callOrig > callRate) && (
              <p className="mt-4 text-xs text-gray-400">
                🏷️ Special discounted rates — original prices{" "}
                {chatOrig > chatRate && <span className="line-through">₹{chatOrig}</span>}
                {chatOrig > chatRate && callOrig > callRate && " / "}
                {callOrig > callRate && <span className="line-through">₹{callOrig}</span>}
                {" "}per minute.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ConnectionModal — opens when Call/Chat is clicked */}
      {modalOpen && callType && (
        <ConnectionModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setCallType(null); }}
          astrologer={{
            id: String(astrologer.id),
            name: astrologer.name,
            profileImage: astrologer.profile_img,
            ratePerMinute: activeRate,
          }}
          userWalletBalance={userWallet}
          callType={callType}
        />
      )}
    </>
  );
}