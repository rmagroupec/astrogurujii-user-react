/**
 * MainAstrologerProfile.tsx  (v4 — rich slider, mobile-first)
 *
 * • Fetches first 3 expert astrologers + enriches each with astrologer_profile
 * • Touch-swipe slider (no library) with dot indicators + prev/next arrows
 * • Each slide = full-detail card: avatar, rating bars, gallery, about, skills,
 *   top review, session counts, CTA buttons
 * • Mobile: single-column card, swipe; Desktop: 1 card visible, arrows
 */

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import ConnectionModal from "@/components/v2/ConnectionModal";
import { profile_api } from "@/https_service";

const API_BASE = "https://admin.astrogurujii.com";

// ─── Types ────────────────────────────────────────────────────────────────────

type AstrologerList = {
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

type AstrologerDetail = AstrologerList & {
  about?: string;
  city?: string;
  state?: string;
  astro_country?: string;
  chat_count?: number;
  audio_count?: number;
  video_count?: number;
  followers?: number;
  rating_total_person?: number;
  five_rate?: string;
  four_rate?: string;
  three_rate?: string;
  two_rate?: string;
  one_rate?: string;
  rating?: { name: string; profileImg: string; rating: string; review: string; createdDate: string }[];
  galary?: { file: string; _id: string }[];
};

type ModalState = { astrologer: AstrologerDetail; callType: "chat" | "audio" } | null;

// ─── Mini icons ───────────────────────────────────────────────────────────────

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const StarFilled = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF9800">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => {
        const pct = Math.min(100, Math.max(0, (rating-(n-1))*100));
        if (pct >= 100) return <StarFilled key={n} size={size} />;
        const id = `s${n}${Math.random().toString(36).slice(2,5)}`;
        return (
          <svg key={n} width={size} height={size} viewBox="0 0 24 24">
            <defs><linearGradient id={id}><stop offset={`${pct}%`} stopColor="#FF9800"/><stop offset={`${pct}%`} stopColor="#E5E7EB"/></linearGradient></defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#${id})`} stroke="#FF9800" strokeWidth="0.5"/>
          </svg>
        );
      })}
    </div>
  );
}

function fmt(n?: number) {
  if (!n) return "—";
  return n >= 1000 ? `${Math.floor(n/1000)}K+` : `${n}+`;
}

// ─── Rich card (single slide) ─────────────────────────────────────────────────

function AstrologerCard({
  a,
  onOpenModal,
}: {
  a: AstrologerDetail;
  onOpenModal: (a: AstrologerDetail, t: "chat" | "audio") => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  const chatRate = parseFloat(a.per_min_chat_offer  || String(a.per_min_chat))        || 0;
  const callRate = parseFloat(a.per_min_voice_call_offer || String(a.per_min_voice_call)) || 0;
  const chatOrig = Number(a.per_min_chat)        || 0;
  const callOrig = Number(a.per_min_voice_call)  || 0;

  const rating     = parseFloat(a.avg_rate) || 4.9;
  const total      = a.rating_total_person ?? a.rating?.length ?? 0;
  const isOnline   = a.isChatOnline === "on" || a.isVoiceOnline === "on";
  const specialties = a.category?.map(c=>c.name).join(" • ") || "Vedic Astrology";
  const languages   = a.language?.map(l=>l.name).join(", ") || "";
  const location    = [a.city, a.state, a.astro_country].filter(Boolean).join(", ");

  const avatar = imgErr || !a.profile_img
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=FF6F00&color=fff&size=400`
    : a.profile_img;

  const bars = [
    { s:5, pct: Math.round(Number(a.five_rate  ||0)) },
    { s:4, pct: Math.round(Number(a.four_rate  ||0)) },
    { s:3, pct: Math.round(Number(a.three_rate ||0)) },
    { s:2, pct: Math.round(Number(a.two_rate   ||0)) },
    { s:1, pct: Math.round(Number(a.one_rate   ||0)) },
  ];

  const topReview = a.rating?.find(r => r.review?.trim().length > 10);

  return (
    <div className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-xl border border-orange-100 flex flex-col md:flex-row">

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div
        className="md:w-[240px] lg:w-[280px] shrink-0 flex flex-col items-center py-7 px-5 gap-4"
        style={{ background: "linear-gradient(180deg,#FFF8EE 0%,#FFF0D6 100%)" }}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-[3px] shadow-xl"
            style={{ background: "linear-gradient(135deg,#FFD15B,#FF9800,#FF6F00)" }}>
            <img src={avatar} alt={a.name}
              className="w-full h-full rounded-full object-cover border-[3px] border-white"
              onError={() => setImgErr(true)} />
          </div>
          {isOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow" />
          )}
        </div>

        {/* Rating big */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-gray-900">{rating.toFixed(1)}</span>
            <StarFilled size={20} />
          </div>
          <StarRow rating={rating} />
          <span className="text-[10px] text-gray-400">{total > 0 ? `${total} reviews` : "Verified Expert"}</span>
        </div>

        {/* Rating bars */}
        {bars.some(b=>b.pct>0) && (
          <div className="w-full space-y-1.5">
            {bars.map(b => (
              <div key={b.s} className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 w-2 text-right">{b.s}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${b.pct}%`, background:"linear-gradient(90deg,#FF9800,#FF6F00)" }} />
                </div>
                <span className="text-[10px] text-gray-400 w-5 text-right">{b.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium text-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </div>
        )}

        {/* Gallery */}
        {(a.galary?.length ?? 0) > 0 && (
          <div className="w-full">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Gallery</p>
            <div className="grid grid-cols-3 gap-1">
              {a.galary!.slice(0,6).map((g,i) => (
                <div key={g._id||i} className="relative aspect-square rounded-lg overflow-hidden bg-orange-50">
                  <img src={g.file} alt="" className="w-full h-full object-cover"
                    onError={e => {(e.target as HTMLImageElement).style.display="none";}} />
                  {i===5 && (a.galary!.length>6) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{a.galary!.length-6}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Online pills */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {a.isChatOnline === "on" && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Chat
            </span>
          )}
          {a.isVoiceOnline === "on" && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Call
            </span>
          )}
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-5 md:p-7 gap-4 overflow-y-auto">

        {/* Name */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900" style={{fontFamily:"'Outfit',sans-serif"}}>
              {a.name}
            </h3>
            <img src="/images/verified.svg" alt="Verified" className="w-5 h-5 shrink-0"
              onError={e=>{(e.target as HTMLImageElement).style.display="none";}} />
            {isOnline && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">● Live Now</span>
            )}
          </div>
          <p className="text-sm font-semibold text-orange-500 mt-0.5">{specialties}</p>
          {languages && <p className="text-xs text-gray-400 mt-0.5">🌐 {languages}</p>}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {[
            { v: a.experience ? `${a.experience}+` : "15+", l: "Yrs Exp" },
            { v: fmt(a.consult),   l: "Sessions" },
            { v: fmt(a.followers), l: "Followers" },
            { v: "100%",           l: "Privacy" },
          ].map((s,i,arr) => (
            <div key={s.l} className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 leading-none">{s.v}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.l}</p>
              </div>
              {i < arr.length-1 && <div className="w-px h-8 bg-orange-100" />}
            </div>
          ))}
        </div>

        {/* Session counts */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: <ChatIcon />, label:"Chats",  val: a.chat_count,  color:"text-orange-500" },
            { icon: <PhoneIcon />, label:"Calls", val: a.audio_count, color:"text-blue-500"   },
            { icon: <VideoIcon />, label:"Videos", val: a.video_count, color:"text-purple-500" },
          ].map(c => (
            <div key={c.label} className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
              <span className={c.color}>{c.icon}</span>
              <span className="text-gray-400">{c.label}</span>
              <span className="font-bold text-gray-800">{fmt(c.val)}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-orange-50" />

        {/* About */}
        {a.about && (
          <div>
            <p className="text-[9px] font-bold tracking-widest text-orange-400 uppercase mb-1">About</p>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{a.about}</p>
          </div>
        )}

        {/* Skills */}
        {(a.skill?.length ?? 0) > 0 && (
          <div>
            <p className="text-[9px] font-bold tracking-widest text-orange-400 uppercase mb-1.5">Expertise</p>
            <div className="flex flex-wrap gap-1.5">
              {a.skill.slice(0,6).map(s => (
                <span key={s.name} className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-orange-700"
                  style={{background:"rgba(255,111,0,0.09)",border:"1px solid rgba(255,111,0,0.18)"}}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top review */}
        {topReview && (
          <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <img
                src={topReview.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(topReview.name)}&background=FF9800&color=fff&size=40`}
                alt={topReview.name}
                className="w-6 h-6 rounded-full object-cover border border-orange-200"
                onError={e=>{(e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${encodeURIComponent(topReview.name)}&background=FF9800&color=fff&size=40`;}}
              />
              <div>
                <p className="text-[11px] font-bold text-gray-800">{topReview.name}</p>
                <StarRow rating={Number(topReview.rating)||5} size={10} />
              </div>
              <p className="ml-auto text-[9px] text-gray-400 shrink-0">{topReview.createdDate}</p>
            </div>
            <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-2">"{topReview.review}"</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-1">
          {callRate > 0 && (
            <button
              onClick={() => onOpenModal(a, "audio")}
              className="flex items-center gap-2 py-2.5 px-5 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{background:"linear-gradient(135deg,#FF6F00,#FF9800)",boxShadow:"0 4px 14px rgba(255,111,0,0.30)"}}>
              <PhoneIcon />
              <span>Call Now <span className="text-orange-100 text-xs ml-1">{callOrig>callRate&&<s className="text-orange-300 mr-0.5">₹{callOrig}</s>}₹{callRate}/min</span></span>
            </button>
          )}
          {chatRate > 0 && (
            <button
              onClick={() => onOpenModal(a, "chat")}
              className="flex items-center gap-2 py-2.5 px-5 rounded-full font-semibold text-sm border-2 transition-all hover:bg-orange-50 active:scale-95"
              style={{borderColor:"#FF6F00",color:"#FF6F00"}}>
              <ChatIcon />
              <span>Chat Now <span className="text-orange-400 text-xs ml-1">{chatOrig>chatRate&&<s className="text-orange-300 mr-0.5">₹{chatOrig}</s>}₹{chatRate}/min</span></span>
            </button>
          )}
          <a href={`/consultants/${a.id}`}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors">
            Full Profile
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonSlide() {
  return (
    <div className="w-full rounded-3xl bg-white shadow-md border border-orange-50 overflow-hidden animate-pulse flex flex-col md:flex-row" style={{minHeight:420}}>
      <div className="md:w-[260px] shrink-0 flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 p-8 gap-4">
        <div className="w-32 h-32 rounded-full bg-orange-200" />
        <div className="h-5 w-28 bg-orange-100 rounded" />
        <div className="h-3 w-20 bg-orange-50 rounded" />
        <div className="w-full space-y-2 mt-2">
          {[80,65,45,30,15].map(p => (
            <div key={p} className="flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-orange-100 rounded" />
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                <div className="h-full bg-orange-200 rounded-full" style={{width:`${p}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 md:p-8 space-y-4">
        <div className="h-7 bg-gray-100 rounded w-2/3" />
        <div className="h-4 bg-orange-50 rounded w-1/2" />
        <div className="flex gap-4">
          {[1,2,3,4].map(i=><div key={i} className="h-10 w-16 bg-gray-100 rounded-xl"/>)}
        </div>
        <div className="h-px bg-gray-100" />
        <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-3 bg-gray-100 rounded" style={{width:`${100-i*10}%`}}/>)}</div>
        <div className="flex gap-2 flex-wrap">{[1,2,3,4].map(i=><div key={i} className="h-6 w-20 bg-orange-50 rounded-full"/>)}</div>
        <div className="flex gap-3 mt-4">
          <div className="h-11 w-36 bg-orange-200 rounded-full" />
          <div className="h-11 w-36 bg-orange-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Slider wrapper ───────────────────────────────────────────────────────────

function Slider({
  items,
  userWallet,
  onOpenModal,
}: {
  items: AstrologerDetail[];
  userWallet: number;
  onOpenModal: (a: AstrologerDetail, t: "chat" | "audio") => void;
}) {
  const [idx, setIdx]   = useState(0);
  const total           = items.length;
  const trackRef        = useRef<HTMLDivElement>(null);

  // Touch swipe
  const tx  = useRef(0);
  const dx  = useRef(0);

  const go = (n: number) => setIdx(((n % total) + total) % total);

  const onTouchStart = (e: React.TouchEvent) => {
    tx.current = e.touches[0].clientX;
    dx.current = 0;
  };
  const onTouchMove  = (e: React.TouchEvent) => {
    dx.current = e.touches[0].clientX - tx.current;
  };
  const onTouchEnd   = () => {
    if (Math.abs(dx.current) > 40) dx.current < 0 ? go(idx+1) : go(idx-1);
  };

  // Arrow button style
  const arrowCls = "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 hover:opacity-90 disabled:opacity-30 shrink-0";
  const arrowStyle = { background:"linear-gradient(135deg,#FF6F00,#FF9800)" };

  return (
    <div className="w-full relative select-none">

      {/* Track */}
      <div className="overflow-hidden rounded-3xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {items.map(a => (
            <div key={a.id} className="min-w-full">
              <AstrologerCard a={a} onOpenModal={onOpenModal} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between mt-5 px-1">

        {/* Prev */}
        <button
          onClick={() => go(idx-1)}
          disabled={total <= 1}
          className={arrowCls}
          style={arrowStyle}
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width:  i === idx ? 28 : 8,
                height: 8,
                background: i === idx
                  ? "linear-gradient(90deg,#FF6F00,#FF9800)"
                  : "#FFD5A8",
              }}
              aria-label={`Go to slide ${i+1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(idx+1)}
          disabled={total <= 1}
          className={arrowCls}
          style={arrowStyle}
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Slide counter */}
      <p className="text-center text-xs text-gray-400 font-medium mt-2">
        {idx+1} / {total}
      </p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MainAstrologerProfile() {
  const [astrologers, setAstrologers] = useState<AstrologerDetail[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [userWallet, setUserWallet]   = useState(0);
  const [modal, setModal]             = useState<ModalState>(null);

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") ?? "";
      const res = await axios.post(
        `${API_BASE}/user_api/astrologer_list`,
        { search:"",page:"",is_chat:"on",followAstro:"",is_voice_call:"",is_video_call:"",cat_id:"",
          language_id:"",gender:"",sort_val:"",is_question:"",skill_id:"",country:"INR",report_id:"",expert_astro:"on" },
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      const top3: AstrologerList[] = res.data?.status ? (res.data.results ?? []).slice(0,3) : [];

      const enriched = await Promise.all(
        top3.map(async a => {
          try {
            const d = await axios.post(
              `${API_BASE}/user_api/astrologer_profile`,
              { id: a.id },
              { headers:{ Authorization:`Bearer ${token}` } }
            );
            return { ...a, ...(d.data?.results?.[0] ?? {}) } as AstrologerDetail;
          } catch { return a as AstrologerDetail; }
        })
      );
      setAstrologers(enriched);
    } catch {}
    finally { setIsLoading(false); }
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await profile_api();
      if (res?.status === true && res.results) {
        const w = parseFloat(res.results.wallet ?? res.results.balance ?? res.results.amount ?? "0");
        setUserWallet(isNaN(w) ? 0 : w);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchList(); fetchWallet(); }, [fetchList, fetchWallet]);

  const activeRate = modal
    ? modal.callType === "audio"
      ? parseFloat(modal.astrologer.per_min_voice_call_offer || String(modal.astrologer.per_min_voice_call)) || 0
      : parseFloat(modal.astrologer.per_min_chat_offer       || String(modal.astrologer.per_min_chat))        || 0
    : 0;

  return (
    <>
      <section className="w-full bg-[#FFFBF0] py-12 md:py-16 px-4 overflow-hidden">
        <div className="max-w-[1000px] mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold tracking-widest text-orange-400 uppercase mb-2">✦ Our Experts ✦</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight" style={{fontFamily:"'Outfit',sans-serif"}}>
              Meet Our Featured{" "}
              <span className="text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(90deg,#FF6F00,#FF9800)"}}>
                Astrologers
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Verified experts ready to guide you through life's most important questions.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-300" />
              <div className="flex gap-1">
                {[0,1,2].map(i=><span key={i} className="w-1.5 h-1.5 rounded-full inline-block" style={{background:`rgba(255,111,0,${1-i*0.3})`}} />)}
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-300" />
            </div>
          </div>

          {/* Slider or Skeleton */}
          {isLoading ? (
            <SkeletonSlide />
          ) : astrologers.length === 0 ? null : (
            <Slider
              items={astrologers}
              userWallet={userWallet}
              onOpenModal={(ast, type) => setModal({ astrologer: ast, callType: type })}
            />
          )}

          {/* View all */}
          {!isLoading && astrologers.length > 0 && (
            <div className="text-center mt-8">
              <a href="/consultants"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 border-b-2 border-orange-200 hover:border-orange-400 pb-0.5 transition-all">
                Explore All Astrologers
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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