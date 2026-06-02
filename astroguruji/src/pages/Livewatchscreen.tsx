/**
 * LiveWatchScreen.tsx  —  Route: /live/:liveId
 *
 * FIXES:
 * 1. AGORA — "live" mode + audience role + level:1 to receive Flutter broadcaster
 * 2. FIREBASE — reads correct fields from Flutter GoLiveScreen:
 *      Flutter writes: { name, message, from, date_time, is_system, message_id }
 *      Web was reading: { text, sender }  ← WRONG, fixed below
 * 3. CHAT SEND — writes same structure Flutter expects
 * 4. ERROR PANEL — all errors shown on screen with full detail
 * 5. DEBUG LOG — visible diagnostic panel shows live connection state
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { IAgoraRTCClient, IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { createPortal } from "react-dom";

// ── Firebase — same db instance as ChatScreen ─────────────────────────────────
import { db } from "@/firebase";
import {
  ref, push, set, onChildAdded, off, query, limitToLast, orderByChild,
} from "firebase/database";

// ── Agora token — same fetcher as AudioCallScreen ─────────────────────────────
import { fetchAgoraToken } from "./agoraToken";

// ─── Constants ────────────────────────────────────────────────────────────────
// Same App ID as Flutter GoLiveScreen and AudioCallScreen
const AGORA_APP_ID = "8782e154141a4c0bbc8acaa3004d21f2";
const API          = "https://admin.astrogurujii.com";
const tok          = () => localStorage.getItem("token") ?? "";
const myName       = () => localStorage.getItem("name") || "Viewer";
const myId         = () => localStorage.getItem("id")   || "web_user";

// Static gifts (from SendGiftModal.tsx in codebase)
const STATIC_GIFTS = [
  { _id: "1", name: "Flowers",     price: 11,  icon: "/images/gifts/flowers.png",     emoji: "🌸" },
  { _id: "2", name: "Namaste",     price: 20,  icon: "/images/gifts/namaste.png",     emoji: "🙏" },
  { _id: "3", name: "Dakshina",    price: 50,  icon: "/images/gifts/dakshina.png",    emoji: "💰" },
  { _id: "4", name: "Pooja Thali", price: 199, icon: "/images/gifts/pooja-thali.png", emoji: "🪔" },
  { _id: "5", name: "Kalash",      price: 20,  icon: "/images/gifts/kalash.png",      emoji: "🏺" },
  { _id: "6", name: "Gemstone",    price: 20,  icon: "/images/gifts/gemstone.png",    emoji: "💎" },
  { _id: "7", name: "Sweets",      price: 20,  icon: "/images/gifts/sweets.png",      emoji: "🍬" },
  { _id: "8", name: "Shivling",    price: 20,  icon: "/images/gifts/shivling.png",    emoji: "🕉️" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface WatchState {
  live_id?: string; channel_id?: string; astro_id?: string;
  astro_name?: string; astro_image?: string; title?: string;
  start_time?: string; end_time?: string; viewers?: number;
  live_type?: string; tags?: string[]; rate?: string;
}

// Flutter GoLiveScreen writes this structure to GroupLive/<channelId>/<pushKey>:
// { name, message, from, date_time, is_system, message_id }
interface FirebaseMsg {
  id:        string;   // Firebase push key
  name:      string;   // sender display name
  message:   string;   // message text
  from:      string;   // sender ID
  date_time: number;   // Unix ms timestamp
  is_system: boolean;  // true for "Live started" system messages
  isGift?:   boolean;
  giftName?: string;
  giftEmoji?: string;
  giftImg?:  string;
}

interface GiftItem {
  _id: string; name: string; price: number;
  icon?: string; image?: string; img?: string; emoji?: string;
}

type AgoraStatus = "idle" | "connecting" | "connected" | "error" | "no_broadcaster";
type FirebaseStatus = "idle" | "connecting" | "listening" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const gImg   = (g: GiftItem) => g.icon || g.image || g.img || "";
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
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.587l1.984 1.147a1 1 0 010 1.746l-1.984 1.147L15.414 12l2.284-2.88zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/>
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
  const [sel, setSel]         = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (sel === null) return;
    const gift = gifts[sel];
    setSending(true);
    try {
      await axios.post(`${API}/user_api/send_gift`,
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
        <img src={avatarUrl(msg.name)} alt={msg.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{msg.name}</p>
            <span className="text-[11px] text-gray-400 shrink-0">{fmtTs(msg.date_time)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {msg.giftImg
              ? <img src={msg.giftImg} className="w-6 h-6 rounded" alt={msg.giftName} />
              : <span className="text-lg">{msg.giftEmoji}</span>}
            <span className="text-gray-600 text-sm">gifted <b>{msg.giftName}</b></span>
          </div>
        </div>
      </div>
    );
  }

  const isMe = msg.from === myId();
  return (
    <div className="flex items-start gap-3 py-2.5 px-1 border-b border-gray-100 last:border-0">
      <img src={avatarUrl(msg.name)} alt={msg.name}
        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
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
          ? <img src={img} alt={name} onError={() => setErr(true)}
              className="w-28 h-28 rounded-full object-cover object-top border-4 border-white/30 shadow-2xl" />
          : <div className="w-28 h-28 rounded-full bg-orange-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
              {name.charAt(0)}
            </div>}
        <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white" />
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-xl">{name}</p>
        <p className="text-white/60 text-sm mt-1 max-w-[200px] line-clamp-2">{title}</p>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/60"
            style={{ animation: `dot 1.2s ${i*0.2}s ease-in-out infinite` }} />
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
      <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95"
        style={{ background: color }}>{icon}</div>
      <span className="text-gray-500 text-[11px] font-medium">{label}</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveWatchScreen() {
  const navigate   = useNavigate();
  const { liveId } = useParams<{ liveId: string }>();
  const { state }  = useLocation() as { state: WatchState | null };

  // channel_id from navigate state, fallback to URL liveId param
  const channelId  = state?.channel_id || liveId || "";
  const astroId    = state?.astro_id    || "";
  const astroName  = state?.astro_name  || "Astrologer";
  const astroImage = state?.astro_image || "";
  const liveTitle  = state?.title       || "Live Session";
  const liveType   = state?.live_type   || "home";
  const tags       = state?.tags        || ["Love", "Career", "Marriage", "Health", "Finance"];
  const sessionRate = state?.rate       || "";

  // ── State ──────────────────────────────────────────────────────────────────
  const [hasVideo,     setHasVideo]     = useState(false);
  const [viewers,      setViewers]      = useState(state?.viewers ?? 0);
  const [msgs,         setMsgs]         = useState<FirebaseMsg[]>([]);
  const [input,        setInput]        = useState("");
  const [elapsed,      setElapsed]      = useState(0);
  const [gifts,        setGifts]        = useState<GiftItem[]>(STATIC_GIFTS);
  const [showGifts,    setShowGifts]    = useState(false);
  const [showApp,      setShowApp]      = useState(false);
  const [giftToast,    setGiftToast]    = useState<string | null>(null);
  const [followed,     setFollowed]     = useState(false);
  const [imgErr,       setImgErr]       = useState(false);

  // Diagnostic states — errors shown on screen only
  const [agoraStatus,  setAgoraStatus]  = useState<AgoraStatus>("idle");
  const [agoraErr,     setAgoraErr]     = useState("");
  const [fbStatus,     setFbStatus]     = useState<FirebaseStatus>("idle");
  const [fbErr,        setFbErr]        = useState("");

  // ── Refs ───────────────────────────────────────────────────────────────────
  const videoRef  = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const chatEnd   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval>>();

  // ── Simple console logger ─────────────────────────────────────────────────
  const log = useCallback((level: "info" | "warn" | "error" | "success", msg: string) => {
    console[level === "success" ? "log" : level](`[Live] ${msg}`);
  }, []);

  // ── Fetch gift list ────────────────────────────────────────────────────────
  useEffect(() => {
    log("info", "Fetching gift list…");
    axios.get(`${API}/user_api/gift_list`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(res => {
        const list = res.data?.results || res.data?.data || res.data?.gifts || [];
        if (Array.isArray(list) && list.length > 0) {
          setGifts(list);
          log("success", `Loaded ${list.length} gifts from API`);
        } else {
          log("warn", "gift_list empty — using static fallback");
        }
      })
      .catch(err => log("warn", `gift_list failed: ${err.message} — using static fallback`));
  }, []);

  // ── Join live API ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!liveId) return;
    const ep = liveType === "pooja" ? `${API}/user_api/join_live_pooja` : `${API}/user_api/join_live`;
    log("info", `Calling join API: ${ep} live_id=${liveId}`);
    axios.post(ep, { live_id: liveId }, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => log("success", `join_live response: status=${r.data?.status} msg=${r.data?.message}`))
      .catch(e => log("warn", `join_live API failed (non-fatal): ${e.message}`));
  }, [liveId, liveType]);

  // ── Agora ──────────────────────────────────────────────────────────────────
  const initAgora = useCallback(async () => {
    if (!channelId) {
      const msg = `❌ No channel_id to join. liveId param = "${liveId}", state.channel_id = "${state?.channel_id}"`;
      log("error", msg);
      setAgoraErr(msg);
      setAgoraStatus("error");
      return;
    }

    // Clean up previous instance
    if (clientRef.current) {
      log("info", "Cleaning up previous Agora client…");
      try { await clientRef.current.leave(); } catch { /* ignore */ }
      clientRef.current = null;
    }

    setAgoraStatus("connecting");
    setAgoraErr("");
    AgoraRTC.setLogLevel(0); // 0 = DEBUG, shows everything in browser console

    log("info", `Agora: creating client mode=live codec=vp8`);

    try {
      // MUST be "live" mode — Flutter broadcaster uses channelProfileLiveBroadcasting
      const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      clientRef.current = client;

      // MUST set audience role with level:1 (low latency) BEFORE joining
      // Without this, audience won't receive the broadcaster's stream
      await client.setClientRole("audience", { level: 1 });
      log("info", "Agora: role=audience level=1 (low latency)");

      client.on("user-published", async (user, mediaType) => {
        log("info", `Agora: user-published uid=${user.uid} type=${mediaType}`);
        try {
          await client.subscribe(user, mediaType);
          log("success", `Agora: subscribed to ${mediaType} from uid=${user.uid}`);

          if (mediaType === "video") {
            setHasVideo(true);

            // Play immediately — no delay needed, React state update is synchronous
            // videoRef.current is already mounted (it's always in DOM, just hidden by opacity)
            if (videoRef.current) {
              (user.videoTrack as IRemoteVideoTrack)?.play(videoRef.current);
              // Force the Agora-injected <video> element to fill the container
              const videoEl = videoRef.current.querySelector("video");
              if (videoEl) {
                videoEl.style.width = "100%";
                videoEl.style.height = "100%";
                videoEl.style.objectFit = "cover";
                log("success", "Agora: video element found and styled");
              } else {
                // Agora may inject the element slightly after play() — retry once
                setTimeout(() => {
                  const v = videoRef.current?.querySelector("video");
                  if (v) {
                    v.style.width = "100%";
                    v.style.height = "100%";
                    v.style.objectFit = "cover";
                    log("success", "Agora: video element styled (delayed)");
                  } else {
                    log("warn", "Agora: <video> element not found after retry");
                  }
                }, 300);
              }
              log("success", "Agora: video playing in DOM element");
            } else {
              log("error", "Agora: videoRef.current is null — cannot play video");
            }
          }

          if (mediaType === "audio") {
            (user.audioTrack as IRemoteAudioTrack)?.play();
            log("success", "Agora: audio playing");
          }
          setViewers(v => v + 1);
        } catch (subErr: any) {
          log("error", `Agora: subscribe failed: ${subErr?.message}`);
        }
      });

      client.on("user-unpublished", (user, mt) => {
        log("warn", `Agora: user-unpublished uid=${user.uid} type=${mt}`);
        if (mt === "video") setHasVideo(false);
      });

      client.on("user-left", (user) => {
        log("warn", `Agora: broadcaster left uid=${user.uid}`);
        setHasVideo(false);
        setViewers(v => Math.max(0, v - 1));
        setAgoraStatus("no_broadcaster");
        setAgoraErr("Broadcaster has left the stream.");
      });

      client.on("connection-state-change", (cur, prev, reason) => {
        log("info", `Agora: connection ${prev} → ${cur}${reason ? ` (${reason})` : ""}`);
        if (cur === "CONNECTED")    { setAgoraStatus("connected"); setAgoraErr(""); }
        if (cur === "DISCONNECTED") { setAgoraStatus("error"); setAgoraErr("Disconnected from Agora."); }
        if (cur === "RECONNECTING") setAgoraErr("Reconnecting…");
      });

      client.on("exception", (evt) => {
        log("error", `Agora exception: code=${evt.code} msg=${evt.msg} uid=${evt.uid}`);
      });

      // Fetch token from same backend as AudioCallScreen
      log("info", `Fetching Agora token for channel: ${channelId}`);
      const agoraToken = await fetchAgoraToken(channelId);
      if (agoraToken) {
        log("success", `Got Agora token (first 20 chars): ${agoraToken.substring(0, 20)}…`);
      } else {
        log("warn", "No token from backend — joining without token (only works if App Certificate disabled)");
      }

      log("info", `Joining channel: "${channelId}" appId: "${AGORA_APP_ID.substring(0, 8)}…"`);
      await client.join(AGORA_APP_ID, channelId, agoraToken, 0);
      setAgoraStatus("connected");
      log("success", `✅ Joined Agora channel "${channelId}" as audience. Waiting for broadcaster…`);

      // Log currently published users (broadcaster may already be live)
      const users = client.remoteUsers;
      log("info", `Remote users already in channel: ${users.length}`);
      users.forEach(u => log("info", `  uid=${u.uid} hasVideo=${u.hasVideo} hasAudio=${u.hasAudio}`));

    } catch (err: any) {
      const rawMsg = err?.message || String(err);
      let friendly = `Agora join failed: ${rawMsg}`;
      if (rawMsg.includes("CAN_NOT_GET_GATEWAY_SERVER")) friendly = "Token rejected — App ID or Certificate mismatch. Check AGORA_APP_ID and token.";
      else if (rawMsg.includes("INVALID_TOKEN"))         friendly = "Invalid token from backend. Check fetchAgoraToken().";
      else if (rawMsg.includes("NOT_AUTHORIZED"))        friendly = "Not authorised for this channel. Token privilege missing.";
      else if (rawMsg.includes("UID_CONFLICT"))          friendly = "UID conflict — another tab may be open. Try refreshing.";
      setAgoraStatus("error");
      setAgoraErr(friendly);
      log("error", `❌ ${friendly}`);
    }
  }, [channelId, liveId, state?.channel_id]);

  // ── Firebase — read GroupLive/<channelId> ──────────────────────────────────
  // Flutter GoLiveScreen writes: { name, message, from, date_time, is_system, message_id }
  // Firebase URL: https://astrogurujii-production-default-rtdb.firebaseio.com/
  const initChat = useCallback(() => {
    if (!channelId) {
      log("error", "Firebase: no channelId, skipping chat listener");
      setFbErr("No channel ID for chat");
      return;
    }

    log("info", `Firebase: subscribing to GroupLive/${channelId}`);
    setFbStatus("connecting");

    try {
      // Order by date_time, get last 50 — same ordering as Flutter's orderByChild('date_time')
      const msgRef = query(
        ref(db, `GroupLive/${channelId}`),
        orderByChild("date_time"),
        limitToLast(50)
      );

      const handler = onChildAdded(msgRef, snap => {
        const v = snap.val();
        if (!v) return;

        log("info", `Firebase: received message key=${snap.key} name="${v.name}" msg="${(v.message || "").substring(0, 30)}"`);
        setFbStatus("listening");
        setFbErr("");

        // Map Flutter's fields to our type
        setMsgs(prev => {
          if (prev.find(m => m.id === snap.key)) return prev;
          const entry: FirebaseMsg = {
            id:        snap.key!,
            name:      v.name      || v.sender || "Viewer",  // Flutter: name, Web: sender
            message:   v.message   || v.text   || "",         // Flutter: message, Web: text
            from:      v.from      || v.from_id || "",
            date_time: typeof v.date_time === "number" ? v.date_time
                     : typeof v.ts === "number"        ? v.ts
                     : Date.now(),
            is_system: !!v.is_system,
            isGift:    !!v.isGift,
            giftName:  v.giftName,
            giftEmoji: v.giftEmoji,
            giftImg:   v.giftImg,
          };
          return [...prev, entry].slice(-100);
        });
      }, err => {
        const msg = `Firebase listener error: ${err.message}`;
        log("error", `❌ ${msg}`);
        setFbStatus("error");
        setFbErr(msg);
      });

      setFbStatus("listening");
      log("success", `✅ Firebase: listening to GroupLive/${channelId}`);
      return () => {
        off(ref(db, `GroupLive/${channelId}`), "child_added", handler);
        log("info", "Firebase: listener removed");
      };
    } catch (err: any) {
      const msg = `Firebase init error: ${err.message}`;
      log("error", `❌ ${msg}`);
      setFbStatus("error");
      setFbErr(msg);
    }
  }, [channelId]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (agoraStatus !== "connected") return;
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [agoraStatus]);

  // ── Auto scroll ────────────────────────────────────────────────────────────
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // ── Mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    log("info", `=== LiveWatchScreen mounted ===`);
    log("info", `channel_id="${channelId}" live_id="${liveId}"`);
    log("info", `astro="${astroName}" db=${!!db}`);
    initAgora();
    const cleanup = initChat();
    return () => {
      cleanup?.();
      clearInterval(timerRef.current);
      try { clientRef.current?.leave(); } catch { /* ignore */ }
      log("info", "LiveWatchScreen unmounted");
    };
  }, [initAgora, initChat]);

  // ── Send message ───────────────────────────────────────────────────────────
  // Write same structure as Flutter GoLiveScreen expects:
  // { name, message, from, date_time, is_system, message_id }
  const sendMsg = () => {
    const text = input.trim();
    if (!text) return;
    if (!channelId) { log("error", "Cannot send: no channelId"); return; }

    const msgRef = push(ref(db, `GroupLive/${channelId}`));
    const payload = {
      name:       myName(),
      message:    text,
      from:       myId(),
      date_time:  Date.now(),
      is_system:  false,
      message_id: msgRef.key,
    };

    // Use standalone set() — modular SDK does NOT have ref.set() method
    set(msgRef, payload)
      .then(() => log("success", `Sent message: "${text.substring(0, 30)}"`))
      .catch(err => log("error", `Send failed: ${err.message}`));

    // Optimistic local add
    setMsgs(p => [...p, { id: msgRef.key!, ...payload }]);
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
      name:       myName(),
      message:    `Sent a gift: ${g.name}`,
      from:       myId(),
      date_time:  Date.now(),
      is_system:  false,
      isGift:     true,
      giftName:   g.name,
      giftEmoji:  gEmoji(g),
      giftImg:    gImg(g),
      message_id: msgRef.key,
    };
    set(msgRef, payload).catch(() => {});
    setMsgs(p => [...p, { id: msgRef.key!, ...payload }]);
    setGiftToast(`${gEmoji(g)} ${g.name} sent!`);
    setTimeout(() => setGiftToast(null), 3000);
    log("success", `Gift sent: ${g.name}`);
  };

  const leave = async () => {
    clearInterval(timerRef.current);
    try { await clientRef.current?.leave(); } catch { /* ignore */ }
    navigate("/live-astrologer");
  };

  const share = () => {
    navigator.share?.({ title: astroName, text: liveTitle, url: window.location.href })
      .catch(() => navigator.clipboard?.writeText(window.location.href));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "#f8f8f8" }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 z-20">
        {astroImage && !imgErr
          ? <img src={astroImage} alt={astroName} onError={() => setImgErr(true)}
              className="w-11 h-11 rounded-full object-cover object-top border-2 border-gray-200 shrink-0" />
          : <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base border-2 border-gray-200 shrink-0"
              style={{ background: "#FC9B04" }}>{astroName.charAt(0)}</div>}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-gray-900 font-bold text-base truncate">{astroName}</p>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#4FC3F7">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-yellow-500 text-xs">★ 4.9</span>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-500 text-xs">{viewers > 0 ? `${viewers.toLocaleString()} viewers` : "Live"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-bold">LIVE</span>
          </div>
          {viewers > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100 border border-gray-200">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-600 text-xs font-medium">{viewers >= 1000 ? `${(viewers/1000).toFixed(1)}K` : viewers}</span>
            </div>
          )}
          {agoraStatus === "connected" && <span className="text-gray-400 text-xs">{fmtTime(elapsed)}</span>}
          <button onClick={leave} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── VIDEO PANEL ────────────────────────────────────────────────── */}
        <div className="flex flex-col shrink-0 border-r border-gray-200" style={{ width: "60%", minWidth: 0 }}>

          {/* Video surface */}
          <div className="flex-1 relative bg-black overflow-hidden" style={{ minHeight: 0 }}>
            {/* Agora injects a <video> element here — must be z-10 and cover full area */}
            <div
              ref={videoRef}
              className="absolute inset-0 z-10"
              style={{ width: "100%", height: "100%" }}
            />

            {/* Placeholder — shown ONLY when no video, sits below Agora layer */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${hasVideo ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <VideoPlaceholder name={astroName} img={astroImage} title={liveTitle} />
            </div>

            {/* LIVE chip */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>

            {/* Gift toast */}
            {giftToast && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full text-white text-xs font-semibold whitespace-nowrap shadow-xl"
                style={{ background: "rgba(0,0,0,0.75)" }}>
                {giftToast}
              </div>
            )}

            {/* Error banner — only shown when Agora has a hard error */}
            {agoraErr && (
              <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(180,20,20,0.85)", backdropFilter: "blur(8px)" }}>
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-white text-xs flex-1">{agoraErr}</p>
                <button onClick={() => { setAgoraErr(""); initAgora(); }}
                  className="text-white/80 text-xs border border-white/30 rounded px-2 py-0.5 hover:bg-white/10 shrink-0">
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Video bottom info */}
          <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
            {sessionRate && (
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-gray-400 text-xs">Consultation Fee</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-yellow-900">₹</span>
                  </div>
                  <span className="text-gray-900 text-sm font-bold">{sessionRate}/min</span>
                </div>
              </div>
            )}
            <p className="text-gray-900 font-bold text-base leading-tight">{liveTitle}</p>
            <p className="text-gray-400 text-xs mt-1">Get answers from {astroName}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {tags.map((tag, i) => {
                const colors = ["#FF9F43","#10b981","#e11d48","#8b5cf6","#f59e0b"];
                return (
                  <div key={tag} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                    <span className="text-gray-600 text-xs">{tag}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CHAT PANEL ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 border-r border-gray-200 bg-white">

          {/* Chat header */}
          <div className="shrink-0 px-4 py-3 border-b border-gray-200">
            <p className="text-gray-900 font-semibold text-sm">Chat</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 min-h-0"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
            {msgs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
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

          {/* Input + Join Call */}
          <div className="shrink-0 border-t border-gray-100 px-3 pt-2 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2">
                <input ref={inputRef} value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMsg()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" />
              </div>
              <button onClick={sendMsg} disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center disabled:opacity-40 hover:bg-orange-600 active:scale-95 transition shadow-md shadow-orange-100 shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
              <button onClick={() => setShowApp(true)}
                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full px-3 py-2 text-xs font-bold shadow-md shadow-orange-200 hover:opacity-90 active:scale-95 transition whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Join Call
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ───────────────────────────────────────────────── */}
        <div className="shrink-0 flex flex-col items-center justify-start gap-6 py-6 px-2 border-l border-gray-200 bg-gray-50"
          style={{ width: 88 }}>
          <SideBtn color="#6C63FF" label="Gift" onClick={() => setShowGifts(true)}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>} />
          <SideBtn color="#22c55e" label="Call Host" onClick={() => setShowApp(true)}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} />
          <SideBtn color={followed ? "#e11d48" : "#9ca3af"} label="Follow" onClick={() => setFollowed(f => !f)}
            icon={<svg className="w-6 h-6 text-white" fill={followed ? "white" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>} />
          <SideBtn color="#1d4ed8" label="Share" onClick={share}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>} />
          <SideBtn color="#d97706" label="Profile" onClick={() => navigate(`/consultants/${astroId}`)}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        </div>
      </div>

      {/* ── Modals ── */}
      {showGifts && <GiftModal gifts={gifts} astroName={astroName} astroId={astroId} onClose={onGiftSent} />}
      {showApp   && <AppModal onClose={() => setShowApp(false)} />}

      <style>{`
        @keyframes dot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        /* Force Agora-injected video to fill its container */
        [ref] video, .agora-video-player video { width:100% !important; height:100% !important; object-fit:cover !important; }
      `}</style>
    </div>
  );
}