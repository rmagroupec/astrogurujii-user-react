/**
 * AudioCallScreen.tsx
 *
 * Uses agoraManager singleton — Agora client lives at MODULE level,
 * NOT inside React refs, so it survives component unmount (back button).
 *
 * Back / minimize → navigate("/") without leaving Agora.
 * ActiveCallBar shows and the audio keeps playing.
 * Tap Open → screen remounts, re-attaches listeners, resumes countdown.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { call_initiate_status, call_status_update, add_rating } from "@/https_service";
import { fetchAgoraToken } from "./agoraToken";
import { agoraManager } from "./agoraManager";
import { db } from "@/firebase";
import { ref, onValue, off } from "firebase/database";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

async function readCallSessionRemaining(channelId: string, rate: string, wallet: string): Promise<number> {
  return new Promise((resolve) => {
    try {
      const r = ref(db, `CallSession/${channelId}`);
      onValue(r, (snap) => {
        off(r);
        const d = snap.val();
        if (!d) { resolve(0); return; }
        const maxMin   = d.max_minutes;
        const lastTick = d.last_tick_at;
        const startAt  = d.started_at;
        if (maxMin != null) {
          let secs = Math.max(Math.floor(Number(maxMin) * 60), 0);
          if (lastTick) secs = Math.max(secs - Math.floor((Date.now() - Number(lastTick)) / 1000), 0);
          resolve(secs);
        } else if (startAt) {
          const maxSec = Math.floor((parseFloat(wallet) / (parseFloat(rate) || 1)) * 60);
          resolve(Math.max(maxSec - Math.floor((Date.now() - Number(startAt)) / 1000), 0));
        } else {
          resolve(0);
        }
      }, { onlyOnce: true });
    } catch { resolve(0); }
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AgoraErrorToast({ visible, message, onRetry, onDismiss }: {
  visible: boolean; message: string; onRetry: () => void; onDismiss: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed top-5 right-4 z-[9999] flex items-start gap-3 bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl"
      style={{ minWidth: 280, maxWidth: 360, animation: "slideInRight 0.3s ease-out" }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Audio connection failed</p>
        <p className="text-xs text-white/75 mt-0.5">{message}</p>
        <button onClick={onRetry} className="mt-2 text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-lg">Try Again</button>
      </div>
      <button onClick={onDismiss} className="text-white/70 hover:text-white text-xl">×</button>
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill={n <= (hovered || value) ? "#f97316" : "none"}
            stroke={n <= (hovered || value) ? "#f97316" : "#d1d5db"}
            strokeWidth="1.5"
            style={{
              filter: n <= (hovered || value) ? "drop-shadow(0 0 4px #f59e0b66)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function RatingDialog({ onSubmit }: { onSubmit: (r: number, t: string) => void }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const labels: Record<number, string> = {
    1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent",
  };

  const tagsByScore: Record<number, string[]> = {
    1: ["Not helpful", "Wrong predictions", "Rude behavior"],
    2: ["Vague answers", "Too short", "Needs improvement"],
    3: ["Decent session", "Mostly helpful", "Average"],
    4: ["Very helpful", "Good insights", "Friendly"],
    5: ["Amazing!", "Highly accurate", "Will consult again"],
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-4 pb-0">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FC7601,#FF9800,#FC7601)" }} />

        <div className="p-6 space-y-5">
          {/* Drag handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

          {/* Title */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-gray-900">How was your call?</h2>
            <p className="text-xs text-gray-400">Your feedback helps improve our astrologers</p>
          </div>

          {/* Stars */}
          <div className="flex flex-col items-center gap-2">
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && (
              <span className="text-sm font-semibold text-orange-500">
                {labels[rating]}
              </span>
            )}
          </div>

          {/* Quick tags */}
          {rating > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {tagsByScore[rating].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setReview((prev) =>
                      prev.includes(tag)
                        ? prev.replace(tag, "").replace(/,\s*$/, "").replace(/^,\s*/, "").trim()
                        : prev ? `${prev}, ${tag}` : tag
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    review.includes(tag)
                      ? "text-white border-orange-500"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"
                  }`}
                  style={review.includes(tag) ? { background: "linear-gradient(135deg,#FC7601,#FF9800)" } : {}}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Text review */}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Add a personal note (optional)..."
            rows={2}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 bg-gray-50 placeholder-gray-300 transition-all"
          />

          {/* Submit */}
          <button
            type="button"
            onClick={() => {
              if (rating < 1) { alert("Please give your valuable feedback"); return; }
              onSubmit(rating, review);
            }}
            disabled={!rating}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: rating ? "linear-gradient(135deg,#FC7601,#FF9800)" : "#d1d5db" }}
          >
            {rating ? "Submit Rating ✨" : "Select a star to continue"}
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={() => onSubmit(rating || 0, review)}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-500 py-1 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
function ActionBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[64px]">
      <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
        style={{ background: active ? "rgba(0,0,0,0.08)" : "white", boxShadow: active ? "none" : "0 2px 12px rgba(0,0,0,0.12)", border: active ? "1.5px solid rgba(0,0,0,0.1)" : "1px solid rgba(0,0,0,0.06)" }}>
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </button>
  );
}

function SpinAvatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
      <div className="absolute inset-0 rounded-full border-4 border-orange-300 opacity-40 animate-ping" />
      <div className="absolute inset-3 rounded-full border-2 border-orange-400 opacity-30 animate-ping" style={{ animationDelay: "0.4s" }} />
      <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg,#FF6F00,#FF9800,#FFC107,#FF6F00)", animation: "spin 8s linear infinite", padding: 3 }}>
        <div className="w-full h-full rounded-full bg-white" />
      </div>
      <img src={src} alt={name} className="absolute w-[110px] h-[110px] rounded-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6F00&color=fff&size=120`; }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AudioCallScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state ?? {}) as {
    channelId: string; apiChannelId: string; astrologer_id: string;
    astroName: string; astrologerImage: string; rate: string; wallet: string;
  };
  const { channelId, apiChannelId, astrologer_id, astroName, astrologerImage, rate, wallet } = state;

  const [callStatus,    setCallStatus]    = useState<"ringing"|"connected"|"on_hold"|"ended">("ringing");
  const [timeLeft,      setTimeLeft]      = useState(0);
  const [abortCount,    setAbortCount]    = useState(119);
  const [isMuted,       setIsMuted]       = useState(false);
  const [isHold,        setIsHold]        = useState(false);
  const [isSpeaker,     setIsSpeaker]     = useState(false);
  const [showRating,    setShowRating]    = useState(false);
  const [someoneJoined, setSomeoneJoined] = useState(false);
  const [isEnding,      setIsEnding]      = useState(false);
  const [toastMsg,      setToastMsg]      = useState("");
  const [toastVisible,  setToastVisible]  = useState(false);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const ringtoneRef  = useRef<AudioBufferSourceNode | null>(null);
  const isEndingRef  = useRef(false);
  const timeLeftRef  = useRef(0);
  const handleEndRef = useRef<(s?: "end_user"|"disconnect_user") => void>(() => {});

  const showToast = (msg: string) => { setToastMsg(msg); setToastVisible(true); };

  // ── Countdown ──────────────────────────────────────────────────────────────
  const startCountdown = useCallback((from: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timeLeftRef.current = from;
    setTimeLeft(from);
    timerRef.current = setInterval(() => {
      timeLeftRef.current = Math.max(timeLeftRef.current - 1, 0);
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) { clearInterval(timerRef.current!); timerRef.current = null; }
    }, 1000);
  }, []);

  // ── Ringtone ───────────────────────────────────────────────────────────────
  const playRingtone = useCallback(async () => {
    try {
      const ac = new AudioContext(); audioCtxRef.current = ac;
      const res = await fetch("/assets/ring.mp3").catch(() => null);
      if (!res) return;
      const src = ac.createBufferSource();
      src.buffer = await ac.decodeAudioData(await res.arrayBuffer());
      src.loop = true; src.connect(ac.destination); src.start();
      ringtoneRef.current = src;
    } catch { /* autoplay blocked */ }
  }, []);

  const stopRingtone = useCallback(() => {
    try { ringtoneRef.current?.stop(); ringtoneRef.current = null; audioCtxRef.current?.close(); audioCtxRef.current = null; } catch { /* silent */ }
  }, []);

  // ── End call (true disconnect) ─────────────────────────────────────────────
  const handleEnd = useCallback(async (status: "end_user"|"disconnect_user" = "end_user") => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsEnding(true);
    clearInterval(pollRef.current!);
    clearInterval(timerRef.current!);
    clearInterval(abortRef.current!);
    stopRingtone();
    await agoraManager.leave(); // ← only place we actually leave
    try { await call_status_update(apiChannelId, status); } catch { /* silent */ }
    setShowRating(true);
  }, [apiChannelId, stopRingtone]);

  useEffect(() => { handleEndRef.current = handleEnd; }, [handleEnd]);

  // ── Minimize / back — DO NOT leave Agora ──────────────────────────────────
  const handleMinimize = useCallback(() => {
    clearInterval(pollRef.current!); // pause polling
    clearInterval(timerRef.current!); // pause UI countdown (ActiveCallBar takes over)
    stopRingtone();
    agoraManager.clearListeners(); // detach screen callbacks — audio keeps playing
    navigate("/");
  }, [navigate, stopRingtone]);

  // ── Status poll ────────────────────────────────────────────────────────────
  const startPoll = useCallback((ch: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await call_initiate_status(ch);
        const s   = res?.results?.status;
        if      (s === "accept_astro")                        { clearInterval(abortRef.current!); stopRingtone(); }
        else if (s === "reject_astro")                        { clearInterval(pollRef.current!); navigate("/"); }
        else if (s === "end_astro")                           { clearInterval(pollRef.current!); setShowRating(true); }
        else if (s === "end_user" || s === "disconnect_user") { clearInterval(pollRef.current!); navigate("/"); }
      } catch { /* keep retrying */ }
    }, 2000);
  }, [navigate, stopRingtone]);

  // ── Abort countdown (ringing phase) ───────────────────────────────────────
  const startAbort = useCallback(() => {
    abortRef.current = setInterval(() => {
      setAbortCount((prev) => {
        if (prev <= 1) { clearInterval(abortRef.current!); handleEndRef.current("disconnect_user"); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── Mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Intercept browser/Android back → minimize instead of unmount
    const onPop = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      handleMinimize();
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);

    // Attach Agora listeners — fires even if already connected (resume case)
    agoraManager.setListeners({
      onUserJoined: () => {
        setSomeoneJoined(true);
        clearInterval(abortRef.current!);
        stopRingtone();
      },
      onAudioStarted: async () => {
        setCallStatus("connected");
        setToastVisible(false);
        // Read countdown from Firebase CallSession
        const remaining = await readCallSessionRemaining(channelId, rate, wallet);
        const fallback  = Math.floor((parseFloat(wallet) / (parseFloat(rate) || 1)) * 60);
        startCountdown(remaining > 0 ? remaining : fallback);
      },
      onUserLeft: () => {
        setCallStatus("ended");
        clearInterval(timerRef.current!);
        setShowRating(true);
      },
      onError: showToast,
    });

    // If already connected (resume from bar), fire onAudioStarted immediately
    if (agoraManager.isConnected) {
      agoraManager.setListeners({
        ...agoraManager, // keep existing
        onAudioStarted: async () => {
          setCallStatus("connected");
          const remaining = await readCallSessionRemaining(channelId, rate, wallet);
          const fallback  = Math.floor((parseFloat(wallet) / (parseFloat(rate) || 1)) * 60);
          startCountdown(remaining > 0 ? remaining : fallback);
        },
        onUserLeft: () => { setCallStatus("ended"); clearInterval(timerRef.current!); setShowRating(true); },
        onError: showToast,
      });
      // Trigger immediately since audio is already live
      readCallSessionRemaining(channelId, rate, wallet).then((remaining) => {
        const fallback = Math.floor((parseFloat(wallet) / (parseFloat(rate) || 1)) * 60);
        setCallStatus("connected");
        startCountdown(remaining > 0 ? remaining : fallback);
      });
    } else {
      // Fresh call
      playRingtone();
      startAbort();
      fetchAgoraToken(channelId)
        .then((token) => {
          if (!token) { showToast("Token not found. Check /user_api/agora_token endpoint."); return; }
          return agoraManager.join(channelId, token);
        })
        .catch((err) => { console.error("Agora init error:", err); });
    }

    startPoll(apiChannelId);

    return () => {
      window.removeEventListener("popstate", onPop);
      // On unmount: if not truly ending, just detach listeners (audio keeps playing)
      // handleMinimize already called clearListeners when navigating away
      // handleEnd already called agoraManager.leave() when ending
      clearInterval(pollRef.current!);
      clearInterval(timerRef.current!);
      clearInterval(abortRef.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Rating ─────────────────────────────────────────────────────────────────
  const handleRating = useCallback(async (rating: number, review: string) => {
    try { await add_rating(apiChannelId, String(rating), review); } catch { /* silent */ }
    setShowRating(false);
    navigate("/", { replace: true });
  }, [apiChannelId, navigate]);

  // ── Controls ───────────────────────────────────────────────────────────────
  const toggleMute = useCallback(async () => {
    const next = !isMuted;
    await agoraManager.setMuted(next);
    setIsMuted(next);
  }, [isMuted]);

  const toggleHold = useCallback(async () => {
    const next = !isHold;
    await agoraManager.setHold(next);
    setIsHold(next);
    setCallStatus(next ? "on_hold" : "connected");
  }, [isHold]);

  const toggleSpeaker = useCallback(async () => {
    const next = !isSpeaker;
    await agoraManager.setSpeaker(next);
    setIsSpeaker(next);
  }, [isSpeaker]);

  // ── UI ─────────────────────────────────────────────────────────────────────
  const statusLabel = callStatus === "connected" ? "Connected" : callStatus === "on_hold" ? "On Hold" : callStatus === "ended" ? "Call Ended" : "Connecting...";
  const statusColor = callStatus === "connected" ? "#16a34a" : callStatus === "on_hold" ? "#d97706" : callStatus === "ended" ? "#dc2626" : "#9ca3af";

  return (
    <>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideInRight { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
      `}</style>

      <AgoraErrorToast visible={toastVisible} message={toastMsg}
        onRetry={() => {
          setToastVisible(false);
          fetchAgoraToken(channelId).then(t => { if (t) agoraManager.join(channelId, t); });
        }}
        onDismiss={() => setToastVisible(false)} />

      <div className="fixed inset-0 z-[150] flex flex-col"
        style={{ background:"linear-gradient(135deg,#FF6F00 0%,#FF9800 50%,#FFC107 100%)", fontFamily:"'DM Sans',sans-serif", height:"100dvh", overflow:"hidden" }}>

        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-8 pb-2">
          <button onClick={handleMinimize} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="text-white text-sm font-semibold opacity-80">Astrogurujii</div>
          <button onClick={handleMinimize} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
          </button>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center gap-2 mt-2">
          <SpinAvatar src={astrologerImage} name={astroName} />
          <div className="text-center">
            <h2 className="text-white text-xl font-bold">{astroName}</h2>
            <p className="text-white/70 text-sm mt-0.5">Astrologer</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:statusColor, boxShadow:`0 0 6px ${statusColor}` }} />
            <span className="text-white text-sm font-semibold">{statusLabel}</span>
          </div>
          {callStatus === "ringing" && <p className="text-white/60 text-xs">Auto-cancel in {fmt(abortCount)}</p>}
          {(callStatus === "connected" || callStatus === "on_hold") && (
            <div className="flex flex-col items-center">
              <p className="text-white text-2xl font-bold tracking-widest">{fmt(timeLeft)}</p>
              <p className="text-white/60 text-xs mt-0.5">time remaining</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-end min-h-0 mt-3">
          <div className="w-full mx-4 mb-3 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex justify-around text-center border-b border-gray-100 py-3 px-6">
              <div><p className="text-xs text-gray-400 font-medium">Rate</p><p className="text-sm font-bold text-gray-800">₹{rate}/min</p></div>
              <div className="w-px bg-gray-200" />
              <div><p className="text-xs text-gray-400 font-medium">Balance</p><p className="text-sm font-bold text-gray-800">₹{wallet}</p></div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Max time</p>
                <p className="text-sm font-bold text-gray-800">{rate && wallet && Number(rate) > 0 ? Math.floor(Number(wallet)/Number(rate)) : "—"} min</p>
              </div>
            </div>

            <div className="flex justify-around items-center px-6 py-5">
              <ActionBtn active={isMuted} label={isMuted?"Unmute":"Mute"} onClick={toggleMute}
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill={isMuted?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMuted?"text-gray-400":"text-gray-700"}>
                  {isMuted?(<><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>)
                  :(<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>)}
                </svg>} />
              <ActionBtn active={isHold} label={isHold?"Resume":"Hold"} onClick={toggleHold}
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isHold?"#d97706":"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isHold?"":"text-gray-700"}>
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>} />
              <ActionBtn active={isSpeaker} label={isSpeaker?"Speaker":"Earpiece"} onClick={toggleSpeaker}
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill={isSpeaker?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSpeaker?"text-orange-500":"text-gray-700"}>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>} />
            </div>

            <div className="flex justify-center py-4">
              <button onClick={() => handleEnd(someoneJoined ? "end_user" : "disconnect_user")} disabled={isEnding}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-60"
                style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", boxShadow:"0 4px 20px rgba(239,68,68,0.45)" }}>
                {isEnding ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13"/>
                      <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91"/>
                      <line x1="23" y1="1" x2="1" y2="23"/>
                    </svg>}
              </button>
            </div>
          </div>
        </div>

        <p className="flex-shrink-0 text-center text-white/50 text-[10px] py-2 px-6">
          Do not share personal payment details. Astrogurujii never asks for direct payment.
        </p>
      </div>

      {showRating && <RatingDialog onSubmit={handleRating} />}
    </>
  );
}