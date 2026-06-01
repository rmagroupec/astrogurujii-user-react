import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { call_initiate_status, call_status_update } from "@/https_service";

export type ChatCallingState = {
  astrologer_id: string;
  astroName: string;
  astrologerImage: string;
  rate: string;
  wallet: string;
  name: string;
  gender: string;
  dob: string;
  tob: string;
  place: string;
  latitude: string;
  longitude: string;
  day: string;
  month: string;
  year: string;
  hh: string;
  mm: string;
  _channel_id: string; // server's channel_id — used as groupId AND poll ID
};

function PulseRings({ src }: { src: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>  <div className="absolute inset-0 rounded-full border-2 border-orange-300 opacity-40 animate-[ping_2s_ease-in-out_infinite]" />
      <div className="absolute inset-4 rounded-full border-2 border-orange-400 opacity-50 animate-[ping_2s_ease-in-out_0.4s_infinite]" />
      <div className="absolute inset-8 rounded-full border-2 border-orange-500 opacity-60 animate-[ping_2s_ease-in-out_0.8s_infinite]" />
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
  className="w-28 h-28 rounded-full object-cover"
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
        <span key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
          style={{ animationDelay: `${i * 180}ms` }} />
      ))}
    </div>
  );
}

export default function ChatCallingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const s = (location.state ?? {}) as ChatCallingState;

  // server's channel_id is the SINGLE shared ID — used for:
  // 1. Firebase groupId  → Group/{channel_id}/{userId}/{astrologer_id}
  // 2. Status polling    → call_initiate_status(channel_id)
  // 3. ChatScreen gid    → gid passed to ChatScreen
  const channelId = s._channel_id ?? "";

  const [secondsLeft, setSecondsLeft] = useState(180);
  const [status, setStatus] = useState<"waiting" | "accepted" | "rejected">("waiting");
  const [isEnding, setIsEnding] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isEndingRef = useRef(false);
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const stopAll = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  };

  async function endCall() {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsEnding(true);
    stopAll();
    try {
      if (channelId) await call_status_update(channelId, "disconnect_user");
    } catch { /* silent */ }
    navigateRef.current("/", { replace: true });
  }

  const maxChatMins = (() => {
    const w = parseFloat(s.wallet ?? "0");
    const r = parseFloat(s.rate ?? "1");
    return r > 0 ? Math.floor(w / r) : 0;
  })();

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (!channelId) { navigate(-1); return; }

    const onPop = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);

    // 3-min countdown
    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          endCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Poll every 2s
    pollRef.current = setInterval(async () => {
      try {
        const res = await call_initiate_status(channelId);
        const st = res?.results?.status;

        if (st === "accept_astro") {
          stopAll();
          setStatus("accepted");

          const st2 = s; // captured at effect time — stable
          setTimeout(() => {
            navigateRef.current("/chat", {
              replace: true,
              state: {
                // KEY FIX: gid = channel_id (same value astrologer receives)
                // Astrologer reads: Group/{channel_id}/{astrologer_id}/{userId}
                // User writes to:  Group/{channel_id}/{astrologer_id}/{userId}  ✅
                gid: channelId,
                fbchannelID: channelId,
                astrologer_id: st2.astrologer_id,
                astroName: st2.astroName,
                astrologerImage: st2.astrologerImage,
                rate: st2.rate,
                wallet: st2.wallet,
                name: st2.name,
                gender: st2.gender,
                dob: st2.dob,
                tob: st2.tob,
                place: st2.place,
              },
            });
          }, 600);

        } else if (st === "reject_astro") {
          stopAll();
          setStatus("rejected");
          setTimeout(() => navigateRef.current(-1 as any), 1500);

        } else if (st === "end_user" || st === "disconnect_user") {
          stopAll();
          navigateRef.current("/", { replace: true });
        }
      } catch { /* keep retrying */ }
    }, 2000);

    return () => {
      stopAll();
      window.removeEventListener("popstate", onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusLabel =
    status === "accepted" ? "✅ Connected!" :
      status === "rejected" ? "❌ Not available right now" :
        "Connecting......";

  const statusColor =
    status === "accepted" ? "#16a34a" :
      status === "rejected" ? "#dc2626" :
        "#e91e8c";

  return (
<div className="fixed inset-0 flex flex-col items-center justify-between"
  style={{ background: "linear-gradient(160deg, #fff8f0 0%, #fff3e6 40%, #ffe0b2 100%)", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", height: "100dvh", width: "100vw" }}>
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FF9800, transparent 70%)" }} />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #FF6F00, transparent 70%)" }} />
        <div className="absolute top-16 left-8 text-3xl opacity-10 rotate-12">✦</div>
        <div className="absolute top-32 right-10 text-2xl opacity-10 -rotate-6">✧</div>
        <div className="absolute bottom-40 right-12 text-xl opacity-10 rotate-45">✦</div>
        <div className="absolute bottom-60 left-6 text-4xl opacity-10 -rotate-12">☽</div>
      </div>

      {/* Top bar */}<div className="relative z-10 w-full flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
          style={{
            background: secondsLeft < 60 ? "rgba(239,68,68,0.12)" : "rgba(255,111,0,0.1)",
            color: secondsLeft < 60 ? "#dc2626" : "#c2410c",
            border: `1.5px solid ${secondsLeft < 60 ? "rgba(239,68,68,0.3)" : "rgba(255,111,0,0.25)"}`,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {formatTime(secondsLeft)}
        </div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ background: "rgba(255,111,0,0.1)", border: "1px solid rgba(255,111,0,0.2)" }}>
          <span className="text-xs font-bold text-orange-700">Astrogurujii</span>
          <span className="text-base">🔮</span>
        </div>
      </div>

      {/* Middle */}<div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <PulseRings src={s.astrologerImage ?? ""} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{s.astroName ?? "Astrologer"}</h1>
          <p className="text-sm text-orange-600 mt-1 font-medium">₹{s.rate ?? "0"}/min • Chat Session</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-semibold transition-all duration-500" style={{ color: statusColor }}>
            {statusLabel}
          </p>
          <p className="text-base font-semibold" style={{ color: statusColor }}>
            {formatTime(secondsLeft)}
          </p>
          {status === "waiting" && <ConnectingDots />}
        </div><div className="w-full max-w-xs rounded-2xl px-4 py-2 shadow-sm"
          style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,111,0,0.15)" }}>
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Wallet</p>
              <p className="text-lg font-bold text-gray-800">₹{s.wallet ?? "0"}</p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-right">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Max Duration</p>
              <p className="text-lg font-bold text-orange-600">{maxChatMins} min</p>
            </div>
          </div>
        </div>
        <p className="hidden">
  Please wait while we connect you to your astrologer. Do not close or navigate away.
</p>
      </div>

      {/* End button */}
     <div className="relative z-10 w-full flex flex-col items-center gap-4 px-6" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>        <button onClick={endCall} disabled={isEnding}
        className="group flex flex-col items-center gap-2 disabled:opacity-50">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-active:scale-95"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 4px 20px rgba(239,68,68,0.4)" }}>
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