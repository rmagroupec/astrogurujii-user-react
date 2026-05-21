/**
 * ChatCallingScreen.tsx
 *
 * Mirrors Flutter's ChatCallingScreen exactly:
 *  - Receives all session data via router state (no URL params)
 *  - On mount: calls callStartChat() → call_initiate API
 *  - Polls call_initiate_status every 2 seconds
 *  - On accept_astro  → cancel timer, navigate to /chat with full state
 *  - On reject_astro  → go back
 *  - 3-minute countdown (startTimer2) — auto-cancel if no response
 *  - End button  → call disconnect_user status, navigate home
 *  - WillPopScope equivalent — back gesture is blocked
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  call_initiate,
  call_initiate_status,
  call_status_update,
  buildKundliString,
  generateChannelId,
  type KundliData,
} from "@/https_service";

// ─── Types ────────────────────────────────────────────────────────────────────

/** All data passed from ConnectionModal / ProfileSidebar via navigate state */
export type ChatCallingState = {
  // Astrologer info
  astrologer_id: string;
  astroName: string;
  astrologerImage: string;
  rate: string;
  wallet: string;
  // Kundli / birth details (raw strings from intake form)
  name: string;         // user name
  gender: string;
  dob: string;          // "dd-MM-yyyy"
  tob: string;          // "hh:mm a"  e.g. "10:30 AM"
  place: string;
  latitude: string;
  longitude: string;
  // Pre-parsed date/time parts for kundli string
  day: string;
  month: string;
  year: string;
  hh: string;
  mm: string;
};

// ─── Animated dots ────────────────────────────────────────────────────────────
function PulseRings({ src }: { src: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer pulse rings */}
      <div className="absolute inset-0 rounded-full border-2 border-orange-300 opacity-40 animate-[ping_2s_ease-in-out_infinite]" />
      <div className="absolute inset-4 rounded-full border-2 border-orange-400 opacity-50 animate-[ping_2s_ease-in-out_0.4s_infinite]" />
      <div className="absolute inset-8 rounded-full border-2 border-orange-500 opacity-60 animate-[ping_2s_ease-in-out_0.8s_infinite]" />

      {/* Avatar ring */}
      <div
        className="relative z-10 rounded-full p-1"
        style={{
          background: "linear-gradient(135deg, #FF6F00, #FF9800)",
          boxShadow: "0 0 0 4px rgba(255,111,0,0.25), 0 8px 32px rgba(255,111,0,0.4)",
        }}
      >
        <img
          src={src}
          alt="astrologer"
          className="w-36 h-36 rounded-full object-cover"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.onerror = null;
            t.src = `https://ui-avatars.com/api/?name=Astrologer&background=FF6F00&color=fff&size=128`;
          }}
        />
      </div>
    </div>
  );
}

function ConnectingDots() {
  return (
    <div className="flex gap-1.5 items-center mt-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatCallingScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // All session data comes from navigation state
  const state = (location.state ?? {}) as ChatCallingState;
  const {
    astrologer_id,
    astroName,
    astrologerImage,
    rate,
    wallet,
    name,
    gender,
    dob,
    tob,
    place,
    latitude,
    longitude,
    day,
    month,
    year,
    hh,
    mm,
  } = state;

  const userId = localStorage.getItem("id") ?? "";

  // ─── Refs (mirrors Flutter timer & sub) ─────────────────────────────────────
  const statusPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const isEndingRef   = useRef(false);

  // API channel_id returned from call_initiate — used for all status calls
  const channelIdRef    = useRef<string>("");
  // Firebase fb_channel_id — used as the gid for the chat path
  const fbChannelIdRef  = useRef<string>("");
  // Pre-generated channel ID sent as fb_channel_id in call_initiate
  const preChannelIdRef = useRef<string>("");

  // ─── UI State ────────────────────────────────────────────────────────────────
  // 3-minute countdown (mirrors Flutter _secondsRemaining = 180)
  const [secondsLeft, setSecondsLeft]   = useState(180);
  const [callStatus, setCallStatus]     = useState<"connecting" | "waiting" | "rejected" | "accepted">("connecting");
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);
  const [isEnding, setIsEnding]         = useState(false);

  // ─── Format countdown mm:ss ─────────────────────────────────────────────────
  const formatCountdown = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ─── Cleanup all timers ──────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    if (statusPollRef.current) clearInterval(statusPollRef.current);
    if (countdownRef.current)  clearInterval(countdownRef.current);
  }, []);

  // ─── Navigate to home safely ─────────────────────────────────────────────────
  const goHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  // ─── End / cancel call (mirrors Flutter EndChatWebservice) ───────────────────
  const handleEndCall = useCallback(async () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsEnding(true);
    clearAllTimers();

    try {
      if (channelIdRef.current) {
        await call_status_update(channelIdRef.current, "disconnect_user");
      }
    } catch {/* silent */}

    goHome();
  }, [clearAllTimers, goHome]);

  // ─── Start 3-minute countdown (mirrors Flutter startTimer2) ─────────────────
  const startCountdown = useCallback(() => {
    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          // Auto-cancel: no astrologer accepted within 3 minutes
          handleEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearAllTimers, handleEndCall]);

  // ─── Poll call_initiate_status every 2s (mirrors Flutter checkForNewStatus) ──
  const startStatusPoll = useCallback((channel_id: string) => {
    statusPollRef.current = setInterval(async () => {
      try {
        const res = await call_initiate_status(channel_id);
        const status = res?.results?.status;

        if (status === "accept_astro") {
          // ✅ Accepted — stop everything, navigate to ChatScreen
          clearAllTimers();
          setCallStatus("accepted");

          // Small visual delay so user sees "Connected!" briefly
          setTimeout(() => {
            navigate("/chat", {
              replace: true,
              state: {
                // Firebase path IDs
                gid: fbChannelIdRef.current,
                fbchannelID: channel_id,
                // Astrologer info
                astrologer_id,
                astroName,
                astrologerImage,
                rate,
                wallet,
                // User birth details
                name,
                gender,
                dob,
                tob,
                place,
              },
            });
          }, 800);

        } else if (status === "reject_astro") {
          // ❌ Rejected — stop, go back
          clearAllTimers();
          setCallStatus("rejected");
          setTimeout(() => navigate(-1), 1500);

        } else if (status === "end_user" || status === "disconnect_user") {
          clearAllTimers();
          goHome();
        }
        // "pending" or anything else → keep polling
      } catch {
        // Network error during poll — keep retrying silently
      }
    }, 2000);
  }, [
    clearAllTimers, goHome, navigate,
    astrologer_id, astroName, astrologerImage, rate, wallet,
    name, gender, dob, tob, place,
  ]);

  // ─── callStartChat (mirrors Flutter callStartChat) ────────────────────────────
  const callStartChat = useCallback(async () => {
    try {
      // Build kundli JSON string exactly like Flutter's Kundli.toString()
      const kundliData: KundliData = {
        name,
        gender,
        yy: year   ?? "",
        mm: month  ?? "",
        dd: day    ?? "",
        hh_time: hh ?? "",
        mm_time: mm ?? "",
        latitude:  latitude  ?? "",
        longitude: longitude ?? "",
        place,
      };
      const kundliString = buildKundliString(kundliData);

      // Generate channel ID: userId_astrologerId_timestamp (mirrors Flutter)
      const preChannelId = generateChannelId(userId, astrologer_id);
      preChannelIdRef.current = preChannelId;

      const res = await call_initiate({
        astrologer_id,
        call_type: "chat",
        fb_channel_id: preChannelId,
        kundli: kundliString,
      });

      if (res?.status === true) {
        // Store both channel IDs
        channelIdRef.current   = res.channel_id;
        fbChannelIdRef.current = res.fb_channel_id ?? preChannelId;

        setCallStatus("waiting");

        // Start polling for status
        startStatusPoll(res.channel_id);
      } else {
        setErrorMsg(res?.message ?? "Failed to connect. Please try again.");
        setTimeout(() => navigate(-1), 2500);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Network error. Please try again.");
      setTimeout(() => navigate(-1), 2500);
    }
  }, [
    astrologer_id, userId,
    name, gender, year, month, day, hh, mm, latitude, longitude, place,
    startStatusPoll, navigate,
  ]);

  // ─── Mount — start call then countdown (mirrors Flutter initState) ────────────
  useEffect(() => {
    // Block back navigation (mirrors Flutter WillPopScope)
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    callStartChat();
    startCountdown();

    return () => {
      clearAllTimers();
      window.removeEventListener("popstate", handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived display ─────────────────────────────────────────────────────────
  const maxChatMins = (() => {
    const w = parseFloat(wallet ?? "0");
    const r = parseFloat(rate ?? "1");
    return r > 0 ? Math.floor(w / r) : 0;
  })();

  const statusLabel =
    callStatus === "accepted"  ? "✅ Connected!" :
    callStatus === "rejected"  ? "❌ Not available right now" :
    callStatus === "connecting" ? "Initiating..." :
    "Connecting...";

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #fff8f0 0%, #fff3e6 40%, #ffe0b2 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Decorative background blobs ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FF9800, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #FF6F00, transparent 70%)" }}
        />
        {/* Star/astro decorative elements */}
        <div className="absolute top-16 left-8 text-3xl opacity-10 rotate-12">✦</div>
        <div className="absolute top-32 right-10 text-2xl opacity-10 -rotate-6">✧</div>
        <div className="absolute bottom-40 right-12 text-xl opacity-10 rotate-45">✦</div>
        <div className="absolute bottom-60 left-6 text-4xl opacity-10 -rotate-12">☽</div>
      </div>

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex items-center justify-between px-5 pt-12 pb-4">
        {/* Countdown badge */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
          style={{
            background: secondsLeft < 60
              ? "rgba(239,68,68,0.12)"
              : "rgba(255,111,0,0.1)",
            color: secondsLeft < 60 ? "#dc2626" : "#c2410c",
            border: `1.5px solid ${secondsLeft < 60 ? "rgba(239,68,68,0.3)" : "rgba(255,111,0,0.25)"}`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {formatCountdown(secondsLeft)}
        </div>

        {/* Astrogurujii brand pill */}
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ background: "rgba(255,111,0,0.1)", border: "1px solid rgba(255,111,0,0.2)" }}
        >
          <span className="text-xs font-bold text-orange-700">Astrogurujii</span>
          <span className="text-base">🔮</span>
        </div>
      </div>

      {/* ── Middle section ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">

        {/* Error state */}
        {errorMsg && (
          <div className="w-full max-w-xs bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 font-medium shadow-sm">
            {errorMsg}
          </div>
        )}

        {/* Avatar with pulse rings */}
        {!errorMsg && <PulseRings src={astrologerImage ?? ""} />}

        {/* Astrologer name */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{astroName ?? "Astrologer"}</h1>
          <p className="text-sm text-orange-600 mt-1 font-medium">
            ₹{rate ?? "0"}/min • Chat Session
          </p>
        </div>

        {/* Status text + animated dots */}
        <div className="flex flex-col items-center gap-1">
          <p
            className="text-base font-semibold transition-all duration-500"
            style={{ color: callStatus === "accepted" ? "#16a34a" : callStatus === "rejected" ? "#dc2626" : "#c2410c" }}
          >
            {statusLabel}
          </p>
          {(callStatus === "connecting" || callStatus === "waiting") && !errorMsg && (
            <ConnectingDots />
          )}
        </div>

        {/* Wallet info card */}
        <div
          className="w-full max-w-xs rounded-2xl px-5 py-4 shadow-sm"
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,111,0,0.15)",
          }}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Wallet</p>
              <p className="text-lg font-bold text-gray-800">₹{wallet ?? "0"}</p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-right">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Max Duration</p>
              <p className="text-lg font-bold text-orange-600">{maxChatMins} min</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-gray-400 max-w-[260px] leading-relaxed">
          Please wait while we connect you to your astrologer. Do not close or navigate away.
        </p>
      </div>

      {/* ── Bottom — End call button ────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col items-center gap-4 px-6 pb-14">

        {/* End Call button (mirrors Flutter call_end image button) */}
        <button
          onClick={handleEndCall}
          disabled={isEnding}
          className="group flex flex-col items-center gap-2 disabled:opacity-50"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
            }}
          >
            {isEnding ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13" />
                <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91" />
                <line x1="23" y1="1" x2="1" y2="23" />
              </svg>
            )}
          </div>
          <span className="text-xs font-semibold text-red-500">
            {isEnding ? "Cancelling..." : "End Call"}
          </span>
        </button>
      </div>
    </div>
  );
}