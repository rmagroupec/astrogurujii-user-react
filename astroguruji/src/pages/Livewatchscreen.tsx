/**
 * LiveWatchScreen.tsx  —  Route: /live/:liveId
 *
 * UI CHANGES:
 * 1. HEADER LEFT  — avatar + name + [🔴 LIVE] [🕐 timer] [👁 viewers] badges under name
 * 2. HEADER RIGHT — red END button only
 * 3. BOTTOM STRIP — horizontally scrollable other-live-astrologers bar (responsive)
 *
 * FIX: viewer count now reads from Firebase LiveViewers/{channelId} in real time
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { IAgoraRTCClient, IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { createPortal } from "react-dom";

import { db } from "@/firebase";
import {
  ref, push, set, onChildAdded, off, query, limitToLast, orderByChild,
  onValue,  // ✅ ADDED for viewer count
} from "firebase/database";

import { fetchAgoraToken } from "./agoraToken";

// ─── Constants ────────────────────────────────────────────────────────────────
const AGORA_APP_ID = "8782e154141a4c0bbc8acaa3004d21f2";
const API = "https://admin.astrogurujii.com";
const tok = () => localStorage.getItem("token") ?? "";
const myName = () => localStorage.getItem("name") || "Viewer";
const myId = () => localStorage.getItem("id") || "web_user";

const STATIC_GIFTS = [
  { _id: "1", name: "Flowers", price: 11, icon: "/images/gifts/flowers.png", emoji: "🌸" },
  { _id: "2", name: "Namaste", price: 20, icon: "/images/gifts/namaste.png", emoji: "🙏" },
  { _id: "3", name: "Dakshina", price: 50, icon: "/images/gifts/dakshina.png", emoji: "💰" },
  { _id: "4", name: "Pooja Thali", price: 199, icon: "/images/gifts/pooja-thali.png", emoji: "🪔" },
  { _id: "5", name: "Kalash", price: 20, icon: "/images/gifts/kalash.png", emoji: "🏺" },
  { _id: "6", name: "Gemstone", price: 20, icon: "/images/gifts/gemstone.png", emoji: "💎" },
  { _id: "7", name: "Sweets", price: 20, icon: "/images/gifts/sweets.png", emoji: "🍬" },
  { _id: "8", name: "Shivling", price: 20, icon: "/images/gifts/shivling.png", emoji: "🕉️" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface WatchState {
  live_id?: string; channel_id?: string; astro_id?: string;
  astro_name?: string; astro_image?: string; title?: string;
  start_time?: string; end_time?: string; viewers?: number;
  live_type?: string; tags?: string[]; rate?: string;
}

interface FirebaseMsg {
  id: string;
  name: string;
  message: string;
  from: string;
  date_time: number;
  is_system: boolean;
  isGift?: boolean;
  giftName?: string;
  giftEmoji?: string;
  giftImg?: string;
}

interface GiftItem {
  _id: string; name: string; price: number;
  icon?: string; image?: string; img?: string; emoji?: string;
}

interface LiveAstrologer {
  astro_id: string;
  name: string;
  profile_image: string;
  title?: string;
  channel_id: string;
  live_type?: string;
  viewers?: number;
  per_min_chat?: string;
  tags?: string[];
}

type AgoraStatus = "idle" | "connecting" | "connected" | "error" | "no_broadcaster";
type FirebaseStatus = "idle" | "connecting" | "listening" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const gImg = (g: GiftItem) => g.icon || g.image || g.img || "";
const gEmoji = (g: GiftItem) => g.emoji || "🎁";
const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const fmtTs = (ts: number) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const avatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6F00&color=fff&size=64`;

// ─── App Modal ────────────────────────────────────────────────────────────────
function AppModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-700 to-orange-500 px-5 py-4 flex items-center justify-between">
          <p className="text-white font-bold">Download App to Call</p>
          <button onClick={onClose} className="text-white/70 text-lg">✕</button>
        </div>
        <div className="px-6 py-6 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-5xl">🔮</div>
          <p className="text-gray-900 font-bold text-lg">AstroGurujii App</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Audio & video calls with astrologers are available on our mobile app.
          </p>
          <a href="https://play.google.com/store/apps/details?id=com.astrogurujii"
            target="_blank" rel="noopener noreferrer" className="w-full">
            <div className="flex items-center gap-3 bg-black rounded-2xl px-5 py-3 justify-center hover:bg-gray-900 transition">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.587l1.984 1.147a1 1 0 010 1.746l-1.984 1.147L15.414 12l2.284-2.88zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
              </svg>
              <div className="text-left">
                <p className="text-white/60 text-[10px] uppercase tracking-wide">Get it on</p>
                <p className="text-white font-bold text-base">Google Play</p>
              </div>
            </div>
          </a>
          <button onClick={onClose} className="text-gray-400 text-sm">Continue watching</button>
        </div>
      </div>
    </div>, document.body
  );
}

// ─── Gift Modal ───────────────────────────────────────────────────────────────
function GiftModal({ gifts, astroName, astroId, onClose }: {
  gifts: GiftItem[]; astroName: string; astroId: string;
  onClose: (result?: { gift: GiftItem }) => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (sel === null) return;
    const gift = gifts[sel];
    setSending(true);
    try {
      await axios.post(`${API}/user_api/gift_transaction`,
        { astro_id: astroId, gift_id: gift._id, amount: gift.price },
        { headers: { Authorization: `Bearer ${tok()}` } });
    } catch { /* send optimistically */ }
    onClose({ gift });
  };

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="font-bold text-gray-900">Send a Gift</p>
            <p className="text-gray-400 text-xs mt-0.5">to {astroName}</p>
          </div>
          <button onClick={() => onClose()} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
        </div>
        <div className="grid grid-cols-4 gap-3 px-5 py-3">
          {gifts.map((g, i) => (
            <button key={g._id} onClick={() => setSel(i)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all
                ${sel === i ? "border-orange-500 bg-orange-50 scale-95" : "border-transparent bg-gray-50 hover:bg-orange-50"}`}>
              <div className="w-12 h-12 rounded-full border-2 border-orange-200 flex items-center justify-center bg-white overflow-hidden">
                {gImg(g)
                  ? <img src={gImg(g)} alt={g.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <span className="text-2xl">{gEmoji(g)}</span>}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{g.name}</span>
              <span className="text-[10px] font-bold text-green-600">₹{g.price}</span>
            </button>
          ))}
        </div>
        <div className="px-5 pb-5 pt-2">
          <button disabled={sel === null || sending} onClick={handleSend}
            className="w-full py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm disabled:opacity-40 hover:bg-orange-600 active:scale-[0.98] transition flex items-center justify-center gap-2">
            {sending && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {sel !== null ? `Send ${gifts[sel].name} · ₹${gifts[sel].price}` : "Select a Gift"}
          </button>
        </div>
      </div>
    </div>, document.body
  );
}

// ─── Leave Popup ──────────────────────────────────────────────────────────────
function LeavePopup({
  loadingLives, otherLives, onStay, onLeave, onJoinOther, followed, onFollow,
}: {
  loadingLives: boolean;
  otherLives: LiveAstrologer[];
  onStay: () => void;
  onLeave: () => void;
  onJoinOther: (a: LiveAstrologer) => void;
  followed: boolean;
  onFollow: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl pb-8"
        style={{ animation: "slideUp 0.28s cubic-bezier(0.32,0.72,0,1)" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="px-5 pb-3 flex items-center justify-between border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Leave this Live?</h3>
            <p className="text-xs text-gray-400 mt-0.5">Or jump into another live session</p>
          </div>
          <button onClick={onStay} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-5 pt-4">
          {loadingLives ? (
            <div className="flex justify-center py-8">
              <div className="w-7 h-7 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
          ) : otherLives.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-3xl">📡</span>
              <p className="text-sm text-gray-400">No other live sessions right now</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Live Now</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
                {otherLives.map((a) => (
                  <button key={a.astro_id} onClick={() => onJoinOther(a)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-[0.98]">
                    <div className="relative flex-shrink-0">
                      <img src={a.profile_image} alt={a.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                        onError={(e) => { (e.target as HTMLImageElement).src = avatarUrl(a.name); }} />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-tight">LIVE</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{a.name}</p>
                      {a.title && <p className="text-xs text-gray-400 truncate mt-0.5">{a.title}</p>}
                      {(a.viewers ?? 0) > 0 && (
                        <p className="text-[10px] text-orange-500 font-semibold mt-1">
                          👁 {(a.viewers ?? 0) >= 1000 ? `${((a.viewers ?? 0) / 1000).toFixed(1)}K` : a.viewers} watching
                        </p>
                      )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="px-5 pt-5 flex gap-3">
          <button onClick={onLeave}
            className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border-2 border-red-400 text-red-500 hover:bg-red-50 transition active:scale-[0.98]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Leave Now
          </button>
          <button onClick={() => { onFollow(); onLeave(); }}
            className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-sm hover:opacity-90 transition active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#FF6F00,#FF9800)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Follow & Leave
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>, document.body
  );
}

// ─── Message Row ──────────────────────────────────────────────────────────────
function MsgRow({ msg }: { msg: FirebaseMsg }) {
  if (msg.is_system) {
    return (
      <div className="flex justify-center py-1.5">
        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{msg.message}</span>
      </div>
    );
  }
  if (msg.isGift) {
    return (
      <div className="flex items-start gap-3 py-2.5 px-1 border-b border-gray-100 last:border-0">
        <img src={avatarUrl(msg.name)} alt={msg.name} className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{msg.name}</p>
            <span className="text-[11px] text-gray-400 shrink-0">{fmtTs(msg.date_time)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {msg.giftImg ? <img src={msg.giftImg} className="w-6 h-6 rounded" alt={msg.giftName} /> : <span className="text-lg">{msg.giftEmoji}</span>}
            <span className="text-gray-600 text-sm">gifted <b>{msg.giftName}</b></span>
          </div>
        </div>
      </div>
    );
  }
  const isMe = msg.from === myId();
  return (
    <div className="flex items-start gap-3 py-2.5 px-1 border-b border-gray-100 last:border-0">
      <img src={avatarUrl(msg.name)} alt={msg.name} className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className={`text-sm font-semibold truncate ${isMe ? "text-orange-600" : "text-gray-900"}`}>{msg.name}</p>
          <span className="text-[11px] text-gray-400 shrink-0">{fmtTs(msg.date_time)}</span>
        </div>
        <p className="text-gray-700 text-sm mt-0.5 leading-snug">{msg.message}</p>
      </div>
    </div>
  );
}

// ─── Video Placeholder ────────────────────────────────────────────────────────
function VideoPlaceholder({ name, img, title }: { name: string; img: string; title: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: "linear-gradient(135deg,#FC9B04 0%,#8F2822 100%)" }}>
      <div className="relative">
        {img && !err
          ? <img src={img} alt={name} onError={() => setErr(true)} className="w-28 h-28 rounded-full object-cover object-top border-4 border-white/30 shadow-2xl" />
          : <div className="w-28 h-28 rounded-full bg-orange-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">{name.charAt(0)}</div>}
        <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white" />
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-xl">{name}</p>
        <p className="text-white/60 text-sm mt-1 max-w-[200px] line-clamp-2">{title}</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/60"
            style={{ animation: `dot 1.2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Side Button ──────────────────────────────────────────────────────────────
function SideBtn({ icon, label, onClick, color = "#6C63FF" }: {
  icon: React.ReactNode; label: string; onClick: () => void; color?: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group" style={{ width: 64 }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 shadow-md"
        style={{ background: color }}>{icon}</div>
      <span className="text-gray-600 text-[10px] font-semibold text-center leading-tight">{label}</span>
    </button>
  );
}

// ─── Bottom Live Strip ────────────────────────────────────────────────────────
function BottomLiveStrip({
  lives,
  loading,
  onJoin,
}: {
  lives: LiveAstrologer[];
  loading: boolean;
  onJoin: (a: LiveAstrologer) => void;
}) {
  return (
    <div className="shrink-0 bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm" style={{ maxHeight: 120 }}>
      <p className="text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        Also Live Now
      </p>
      <div
        className="flex gap-3 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading && lives.length === 0 && [1,2,3,4,5].map(i => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5" style={{ width: 64 }}>
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-10 h-2.5 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}

        {lives.map((a) => (
          <button
            key={a.astro_id}
            onClick={() => onJoin(a)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 group focus:outline-none"
            style={{ width: 64 }}
          >
            <div className="relative">
              <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-full border-2 border-red-500" />
              <img
                src={a.profile_image || avatarUrl(a.name)}
                alt={a.name}
                className="w-14 h-14 rounded-full object-cover relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).src = avatarUrl(a.name); }}
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-px rounded-full leading-tight whitespace-nowrap shadow">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-800 font-semibold text-center leading-tight line-clamp-1 w-full group-hover:text-orange-500 transition-colors mt-0.5">
              {a.name.split(" ")[0]}
            </p>
          </button>
        ))}

        {!loading && lives.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
            <p className="text-gray-400 text-xs">No other astrologers live</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveWatchScreen() {
  const navigate = useNavigate();
  const { liveId } = useParams<{ liveId: string }>();
  const { state } = useLocation() as { state: WatchState | null };

  const channelId = state?.channel_id || liveId || "";
  const astroId = state?.astro_id || "";
  const astroName = state?.astro_name || "Astrologer";
  const astroImage = state?.astro_image || "";
  const liveTitle = state?.title || "Live Session";
  const liveType = state?.live_type || "home";
  const tags = state?.tags || ["Love", "Career", "Marriage", "Health", "Finance"];
  const sessionRate = state?.rate || "";

  // ── State ──────────────────────────────────────────────────────────────────
  const [hasVideo, setHasVideo] = useState(false);
  const [viewers, setViewers] = useState(state?.viewers ?? 0);
  const [msgs, setMsgs] = useState<FirebaseMsg[]>([]);
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [waitElapsed, setWaitElapsed] = useState(0);
  const [gifts, setGifts] = useState<GiftItem[]>(STATIC_GIFTS);
  const [showGifts, setShowGifts] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [giftToast, setGiftToast] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [followed, setFollowed] = useState<boolean>(() => {
    try { return localStorage.getItem(`followed_astro_${astroId}`) === "true"; }
    catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem(`followed_astro_${astroId}`, String(followed)); }
    catch { /* ignore */ }
  }, [followed, astroId]);
  const [imgErr, setImgErr] = useState(false);

  // Leave popup
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [otherLives, setOtherLives] = useState<LiveAstrologer[]>([]);
  const [loadingLives, setLoadingLives] = useState(false);

  // Agora / Firebase
  const [agoraStatus, setAgoraStatus] = useState<AgoraStatus>("idle");
  const [agoraErr, setAgoraErr] = useState("");
  const [fbStatus, setFbStatus] = useState<FirebaseStatus>("idle");
  const [fbErr, setFbErr] = useState("");

  // ── Refs ───────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const log = useCallback((level: "info" | "warn" | "error" | "success", msg: string) => {
    console[level === "success" ? "log" : level](`[Live] ${msg}`);
  }, []);

  // ── Fetch gift list ────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/user_api/gift_list`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(res => {
        const list = res.data?.results || res.data?.data || res.data?.gifts || [];
        if (Array.isArray(list) && list.length > 0) setGifts(list);
      })
      .catch(() => {});
  }, []);

  // ── Join live API ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!liveId) return;
    const ep = liveType === "pooja" ? `${API}/user_api/join_live_pooja` : `${API}/user_api/join_live`;
    axios.post(ep, { live_id: liveId }, { headers: { Authorization: `Bearer ${tok()}` } })
      .catch(() => {});
  }, [liveId, liveType]);

  // ── Agora ──────────────────────────────────────────────────────────────────
  const initAgora = useCallback(async () => {
    if (!channelId) {
      setAgoraErr(`No channel_id. liveId="${liveId}" state.channel_id="${state?.channel_id}"`);
      setAgoraStatus("error");
      return;
    }
    if (clientRef.current) {
      try { await clientRef.current.leave(); } catch {}
      clientRef.current = null;
    }
    setAgoraStatus("connecting");
    setAgoraErr("");
    AgoraRTC.setLogLevel(0);
    try {
      const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      clientRef.current = client;
      await client.setClientRole("audience", { level: 1 });

      client.on("user-published", async (user, mediaType) => {
        try {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setHasVideo(true);
            if (videoRef.current) {
              (user.videoTrack as IRemoteVideoTrack)?.play(videoRef.current);
              const tryStyle = () => {
                const v = videoRef.current?.querySelector("video");
                if (v) { v.style.width = "100%"; v.style.height = "100%"; v.style.objectFit = "cover"; }
                else setTimeout(tryStyle, 300);
              };
              tryStyle();
            }
          }
          if (mediaType === "audio") { (user.audioTrack as IRemoteAudioTrack)?.play(); }
        } catch (err: any) { log("error", `subscribe failed: ${err?.message}`); }
      });
      client.on("user-unpublished", (_, mt) => { if (mt === "video") setHasVideo(false); });
      client.on("user-left", () => {
        setHasVideo(false);
        setAgoraStatus("no_broadcaster");
        setAgoraErr("Broadcaster has left the stream.");
      });
      client.on("connection-state-change", (cur, _prev, reason) => {
        log("info", `Agora: ${_prev} → ${cur}${reason ? ` (${reason})` : ""}`);
        if (cur === "CONNECTED") { setAgoraStatus("connected"); setAgoraErr(""); }
        if (cur === "DISCONNECTED") { setAgoraStatus("error"); setAgoraErr("Disconnected."); }
        if (cur === "RECONNECTING") setAgoraErr("Reconnecting…");
      });
      client.on("exception", (evt) => log("error", `Agora exception: ${evt.code} ${evt.msg}`));

      const agoraToken = await fetchAgoraToken(channelId);
      await client.join(AGORA_APP_ID, channelId, agoraToken, 0);
      setAgoraStatus("connected");
    } catch (err: any) {
      const raw = err?.message || String(err);
      let msg = `Agora join failed: ${raw}`;
      if (raw.includes("CAN_NOT_GET_GATEWAY_SERVER")) msg = "Token rejected — App ID or Certificate mismatch.";
      else if (raw.includes("INVALID_TOKEN")) msg = "Invalid token from backend.";
      else if (raw.includes("NOT_AUTHORIZED")) msg = "Not authorised for this channel.";
      else if (raw.includes("UID_CONFLICT")) msg = "UID conflict — try refreshing.";
      setAgoraStatus("error");
      setAgoraErr(msg);
    }
  }, [channelId, liveId, state?.channel_id]);

  // ── Firebase chat ──────────────────────────────────────────────────────────
  const initChat = useCallback(() => {
    if (!channelId) { setFbErr("No channel ID for chat"); return; }
    setFbStatus("connecting");
    try {
      const msgRef = query(ref(db, `GroupLive/${channelId}`), orderByChild("date_time"), limitToLast(50));
      const handler = onChildAdded(msgRef, snap => {
        const v = snap.val();
        if (!v) return;
        setFbStatus("listening");
        setFbErr("");
        setMsgs(prev => {
          if (prev.find(m => m.id === snap.key)) return prev;
          const entry: FirebaseMsg = {
            id: snap.key!,
            name: v.name || v.sender || "Viewer",
            message: v.message || v.text || "",
            from: v.from || v.from_id || "",
            date_time: typeof v.date_time === "number" ? v.date_time : typeof v.ts === "number" ? v.ts : Date.now(),
            is_system: !!v.is_system,
            isGift: !!v.isGift,
            giftName: v.giftName,
            giftEmoji: v.giftEmoji,
            giftImg: v.giftImg,
          };
          return [...prev, entry].slice(-100);
        });
      }, err => {
        setFbStatus("error");
        setFbErr(`Firebase listener error: ${err.message}`);
      });
      setFbStatus("listening");
      return () => { off(ref(db, `GroupLive/${channelId}`), "child_added", handler); };
    } catch (err: any) {
      setFbStatus("error");
      setFbErr(`Firebase init error: ${err.message}`);
    }
  }, [channelId]);

  // ✅ FIX 1: Real-time viewer count from Firebase LiveViewers/{channelId}
  useEffect(() => {
    if (!channelId) return;
    const viewerRef = ref(db, `LiveViewers/${channelId}`);
    const unsub = onValue(viewerRef, (snap) => {
      const val = snap.val();
      const count = val && typeof val === "object" ? Object.keys(val).length : 0;
      setViewers(count);
    });
    return () => unsub();
  }, [channelId]);

  // ✅ FIX 2: Write this web viewer's presence so the count increments
  useEffect(() => {
    if (!channelId || agoraStatus !== "connected") return;
    const webUserId = myId() || `web_${Date.now()}`;
    const presenceRef = ref(db, `LiveViewers/${channelId}/${webUserId}`);
    set(presenceRef, true).catch(() => {});
    return () => {
      set(presenceRef, null).catch(() => {});
    };
  }, [channelId, agoraStatus]);

  // ── Timers ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (agoraStatus !== "connected") return;
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [agoraStatus]);

  const waitTimerRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (agoraStatus === "connected" && !hasVideo) {
      setWaitElapsed(0);
      waitTimerRef.current = setInterval(() => setWaitElapsed(e => e + 1), 1000);
    } else {
      clearInterval(waitTimerRef.current);
      if (hasVideo) setWaitElapsed(0);
    }
    return () => clearInterval(waitTimerRef.current);
  }, [agoraStatus, hasVideo]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // ── Mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    log("info", `=== LiveWatchScreen mounted === channel="${channelId}" astro="${astroName}"`);
    initAgora();
    const cleanup = initChat();
    return () => {
      cleanup?.();
      clearInterval(timerRef.current);
      try { clientRef.current?.leave(); } catch {}
    };
  }, [initAgora, initChat]);

  // ── Fetch other live astrologers ──────────────────────────────────────────
  const fetchOtherLives = useCallback(async () => {
    setLoadingLives(true);
    try {
      const res = await axios.get(`${API}/user_api/listing_of_live_astrlogers`, {
        headers: { Authorization: `Bearer ${tok()}` },
      });
      const data = res.data;

      if (data?.status && Array.isArray(data.data)) {
        const seen = new Set<string>();
        const mapped: LiveAstrologer[] = [];

        for (const item of data.data) {
          if (String(item.is_live) !== "1") continue;
          const id  = item.astrologer_id?._id || item._id || "";
          const ch  = item.channel_id || "";
          if (!id || seen.has(id)) continue;
          if (String(id) === String(astroId)) continue;
          if (String(ch) === String(channelId)) continue;
          seen.add(id);
          mapped.push({
            astro_id:      id,
            name:          item.astrologer_id?.displayname || item.astrologer_id?.name || "Astrologer",
            profile_image: item.astrologer_id?.profile_img || "",
            title:         item.title || "Live Session",
            channel_id:    ch,
            live_type:     "home",
            viewers:       Array.isArray(item.users) ? item.users.length : 0,
            per_min_chat:  item.per_min_chat || "",
            tags:          item.tags || [],
          });
          if (mapped.length >= 15) break;
        }
        setOtherLives(mapped);
      }
    } catch {
      try {
        const res2 = await fetch(`${API}/user_api/get_live_astrologer`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
          body: JSON.stringify({}),
        });
        const data2 = await res2.json();
        if (data2?.status && Array.isArray(data2.results)) {
          setOtherLives(
            data2.results
              .filter((a: LiveAstrologer) => String(a.astro_id) !== String(astroId))
              .slice(0, 15)
          );
        }
      } catch { /* silent */ }
    }
    setLoadingLives(false);
  }, [astroId, channelId]);

  useEffect(() => { fetchOtherLives(); }, [fetchOtherLives]);

  // ── Leave handling ─────────────────────────────────────────────────────────
  const leave = useCallback(async () => {
    clearInterval(timerRef.current);
    try { await clientRef.current?.leave(); } catch {}
    navigate("/live-astrologer");
  }, [navigate]);

  const handleBackPress = useCallback(() => {
    setShowLeavePopup(true);
    fetchOtherLives();
  }, [fetchOtherLives]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      handleBackPress();
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [handleBackPress]);

  const handleJoinOther = useCallback(async (a: LiveAstrologer) => {
    setShowLeavePopup(false);
    clearInterval(timerRef.current);
    try { await clientRef.current?.leave(); } catch {}
    navigate(`/live/${a.channel_id}`, {
      state: {
        channel_id: a.channel_id,
        astro_id: a.astro_id,
        astro_name: a.name,
        astro_image: a.profile_image,
        title: a.title || "Live Session",
        live_type: a.live_type || "home",
        viewers: a.viewers ?? 0,
        rate: a.per_min_chat || "",
        tags: a.tags || [],
      },
    });
  }, [navigate]);

  // ── Send message ───────────────────────────────────────────────────────────
 // ── Send message ───────────────────────────────────────────────────────────
const sendMsg = () => {
  const text = input.trim();
  if (!text || !channelId) return;
  const msgRef = push(ref(db, `GroupLive/${channelId}`));
  const payload = {
    name: myName(), message: text, from: myId(),
    date_time: Date.now(), is_system: false, message_id: msgRef.key,
  };
  set(msgRef, payload).catch(() => {});
  // ← REMOVED: setMsgs(p => [...p, { id: msgRef.key!, ...payload }]);
  setInput("");
  inputRef.current?.focus();
};

  // ── Send gift ──────────────────────────────────────────────────────────────
  const onGiftSent = (result?: { gift: GiftItem }) => {
    setShowGifts(false);
    if (!result || !channelId) return;
    const g = result.gift;
    const msgRef = push(ref(db, `GroupLive/${channelId}`));
    const payload = {
      name: myName(), message: `Sent a gift: ${g.name}`, from: myId(),
      date_time: Date.now(), is_system: false, isGift: true,
      giftName: g.name, giftEmoji: gEmoji(g), giftImg: gImg(g), message_id: msgRef.key,
    };
    set(msgRef, payload).catch(() => {});
    setMsgs(p => [...p, { id: msgRef.key!, ...payload }]);
    setGiftToast(`${gEmoji(g)} ${g.name} sent!`);
    setTimeout(() => setGiftToast(null), 3000);
  };

  const share = () => {
    navigator.share?.({ title: astroName, text: liveTitle, url: window.location.href })
      .catch(() => navigator.clipboard?.writeText(window.location.href));
  };

  const toggleMaximize = useCallback(() => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!isMaximized) {
        videoContainer.requestFullscreen?.().catch(() => {
          setIsMaximized(true);
        });
        setIsMaximized(true);
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        setIsMaximized(false);
      }
    }
  }, [isMaximized]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex flex-col bg-white" style={{ height: "100dvh", overflow: "hidden" }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      {!isMaximized && (
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 z-20">

          {/* Back button */}
          <button onClick={handleBackPress}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Avatar */}
          {astroImage && !imgErr
            ? <img src={astroImage} alt={astroName} onError={() => setImgErr(true)}
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-orange-200 shrink-0" />
            : <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                style={{ background: "#FC9B04" }}>{astroName.charAt(0)}</div>}

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-gray-900 font-extrabold text-xl leading-tight truncate">{astroName}</p>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#4FC3F7">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {/* LIVE */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-red-300 bg-red-50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-600 text-xs font-bold tracking-wide">LIVE</span>
              </div>
              {/* Timer */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-gray-700 text-xs font-bold tabular-nums">{fmtTime(elapsed)}</span>
              </div>
              {/* Viewers — now real-time from Firebase */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                <span className="text-gray-700 text-xs font-semibold">{viewers >= 1000 ? `${(viewers/1000).toFixed(1)}K` : viewers}</span>
              </div>
            </div>
          </div>

          {/* End Live button */}
          <button onClick={handleBackPress}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span className="text-white text-sm font-bold">End Live</span>
          </button>
        </div>
      )}

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div className="flex overflow-hidden" style={{ flex: "1 1 0", minHeight: 0 }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className={`flex flex-col overflow-hidden ${isMaximized ? "w-full" : ""}`} style={{ width: isMaximized ? "100%" : "60%", minWidth: 0 }}>

          {/* Video Container */}
          <div className={`relative bg-black overflow-hidden ${!isMaximized ? "rounded-3xl mx-4 mt-4" : ""}`} style={{ flex: "0 0 " + (isMaximized ? "100%" : "72%"), minHeight: 0 }}>
            <div ref={videoRef} className="absolute inset-0 z-10" style={{ width: "100%", height: "100%" }} />
            <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${hasVideo ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <VideoPlaceholder name={astroName} img={astroImage} title={liveTitle} />
              {agoraStatus === "connected" && !hasVideo && (
                <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-2 pb-5 pt-4"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}>
                  <p className="text-white/90 text-xs font-medium tracking-wide">Waiting for host to start…</p>
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-white text-[11px] font-bold tabular-nums">Wait: {fmtTime(waitElapsed)}</span>
                  </div>
                </div>
              )}
            </div>
            {/* LIVE badge overlay */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>

            {/* Maximize button */}
            <button onClick={toggleMaximize}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all border border-white/20">
              {isMaximized ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M8 3v4a1 1 0 0 1-1 1H3m18 0h-4a1 1 0 0 1-1-1V3m0 18v-4a1 1 0 0 1 1-1h4M3 16a1 1 0 0 1 1-1h4v4" />
                </svg>
              )}
            </button>

            {giftToast && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full text-white text-xs font-semibold whitespace-nowrap shadow-xl"
                style={{ background: "rgba(0,0,0,0.75)" }}>
                {giftToast}
              </div>
            )}
            {agoraErr && (
              <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(180,20,20,0.85)", backdropFilter: "blur(8px)" }}>
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-white text-xs flex-1">{agoraErr}</p>
                <button onClick={() => { setAgoraErr(""); initAgora(); }}
                  className="text-white/80 text-xs border border-white/30 rounded px-2 py-0.5 hover:bg-white/10 shrink-0">
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Info strip below video */}
          {!isMaximized && (
            <>
              <div className="shrink-0 px-5 py-4 bg-white mx-4 mt-3 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-900 font-bold text-lg leading-snug">{liveTitle}</p>
                <p className="text-gray-600 text-sm mt-1.5 font-medium">Get answers from {astroName}</p>
                {sessionRate && (
                  <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-[10px] font-bold text-yellow-900">₹</span>
                    </div>
                    <span className="text-gray-800 text-sm font-bold">{sessionRate}/min</span>
                  </div>
                )}
              </div>

              {/* Also Live Now strip */}
              <div className="shrink-0 mx-4 mt-3 mb-3 min-h-0">
                <BottomLiveStrip lives={otherLives} loading={loadingLives} onJoin={handleJoinOther} />
              </div>
            </>
          )}
        </div>

        {/* ── CHAT PANEL ─────────────────────────────────────────────────── */}
        {!isMaximized && (
          <div className="flex flex-col min-w-0 bg-white overflow-hidden border-r border-gray-100" style={{ flex: "1 1 0", minHeight: 0 }}>

            {/* Chat header with viewer count */}
            <div className="shrink-0 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-gray-900 font-bold text-base">Chat</p>
              <div className="flex items-center gap-1.5 text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm font-semibold">{viewers >= 1000 ? `${(viewers/1000).toFixed(1)}K` : viewers}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-1 min-h-0"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
              {msgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="text-4xl">💬</div>
                  <p className="text-gray-400 text-sm">No messages yet</p>
                  <p className="text-gray-300 text-xs">
                    {fbStatus === "listening" ? `Listening on GroupLive/${channelId}` : "Connecting to chat…"}
                  </p>
                </div>
              ) : (
                <>
                  {msgs.map(m => <MsgRow key={m.id} msg={m} />)}
                  <div ref={chatEnd} />
                </>
              )}
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-gray-100 px-3 pt-2.5 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5">
                  <input ref={inputRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMsg()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" />
                </div>
                <button onClick={sendMsg} disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center disabled:opacity-40 hover:bg-orange-500 active:scale-95 transition shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
                <button onClick={() => setShowApp(true)}
                  className="shrink-0 flex items-center gap-1.5 text-white rounded-full px-4 py-2.5 text-sm font-bold hover:opacity-90 active:scale-95 transition whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#FF6F00,#FF9800)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Join Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RIGHT SIDEBAR ───────────────────────────────────────────────── */}
        {!isMaximized && (
          <div className="shrink-0 flex flex-col items-center justify-start gap-6 py-5 px-3 bg-white border-l border-gray-100 overflow-y-auto"
            style={{ width: 90 }}>
            <SideBtn color="#6C63FF" label="Gift" onClick={() => setShowGifts(true)}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 12v10H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>} />
            <SideBtn color="#22c55e" label="Call Host" onClick={() => setShowApp(true)}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>} />
            <SideBtn color={followed ? "#e11d48" : "#9ca3af"} label={followed ? "Following" : "Follow"} onClick={() => setFollowed(f => !f)}
              icon={<svg className="w-6 h-6" fill={followed ? "white" : "none"} stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>} />
            <SideBtn color="#1d4ed8" label="Share" onClick={share}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>} />
            <SideBtn color="#d97706" label="Profile" onClick={() => navigate(`/consultants/${astroId}`)}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>} />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showGifts && <GiftModal gifts={gifts} astroName={astroName} astroId={astroId} onClose={onGiftSent} />}
      {showApp && <AppModal onClose={() => setShowApp(false)} />}
      {showLeavePopup && (
        <LeavePopup
          loadingLives={loadingLives}
          otherLives={otherLives}
          onStay={() => setShowLeavePopup(false)}
          onLeave={leave}
          onJoinOther={handleJoinOther}
          followed={followed}
          onFollow={() => setFollowed(f => !f)}
        />
      )}

      <style>{`
        @keyframes dot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        [ref] video, .agora-video-player video { width:100% !important; height:100% !important; object-fit:cover !important; }
        html, body { overflow: hidden !important; height: 100% !important; }
      `}</style>
    </div>
  );
}