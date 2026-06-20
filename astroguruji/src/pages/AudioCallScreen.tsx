/**
 * AudioCallScreen.tsx
 *
 * Full-screen audio call — mirrors Flutter's AfterCallConnecting exactly.
 *
 * KEY FIX: Agora project has App Certificate enabled → requires a signed token.
 *   - fetchAgoraToken() calls backend to get the token before joining
 *   - If token fetch fails → shows toast error with "Try Again" (no call end)
 *   - accept_astro handled in status poller
 *   - handleEnd stale-closure fixed via ref
 *   - AGORA_APP_ID hardcoded
 *   - LAYOUT FIX: full 100dvh, no scroll, flex-shrink-0 on header/info
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import { useAudioCall } from "./AudioCallContext";
import { call_initiate_status, call_status_update, add_rating } from "@/https_service";
import { fetchAgoraToken } from "./agoraToken";

// ─── Hardcoded App ID ─────────────────────────────────────────────────────────
const AGORA_APP_ID = "8782e154141a4c0bbc8acaa3004d21f2";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// ─── Agora Error Toast ────────────────────────────────────────────────────────
function AgoraErrorToast({
  visible,
  message,
  onRetry,
  onDismiss,
}: {
  visible: boolean;
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  if (!visible) return null;
  return (
    <div
      className="fixed top-5 right-4 z-[9999] flex items-start gap-3 bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl"
      style={{ minWidth: 280, maxWidth: 360, animation: "slideInRight 0.3s ease-out" }}
    >
      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">Audio connection failed</p>
        <p className="text-xs text-white/75 mt-0.5">{message}</p>
        <button
          onClick={onRetry}
          className="mt-2 text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          Try Again
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="text-white/70 hover:text-white text-xl leading-none flex-shrink-0 mt-0.5"
      >
        ×
      </button>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
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
          className="transition-transform hover:scale-110"
        >
          <svg width="32" height="32" viewBox="0 0 24 24"
            fill={n <= (hovered || value) ? "#f97316" : "none"}
            stroke="#f97316" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Rating Dialog ────────────────────────────────────────────────────────────
function RatingDialog({ onSubmit }: { onSubmit: (rating: number, review: string) => void }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <h2 className="text-center text-lg font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Please rate your experience
        </h2>
        <StarRating value={rating} onChange={setRating} />
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium text-center">Additional comments</p>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Review here..."
            className="w-full h-[120px] border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          onClick={() => {
            if (rating < 1) { alert("Please give your valuable feedback"); return; }
            onSubmit(rating, review);
          }}
          className="w-full py-3 rounded-2xl font-bold text-white text-sm tracking-wide"
          style={{ background: "linear-gradient(135deg, #FC7601, #FF9800)" }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[64px]">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0"
        style={{
          background: active ? "rgba(0,0,0,0.08)" : "white",
          boxShadow: active ? "none" : "0 2px 12px rgba(0,0,0,0.12)",
          border: active ? "1.5px solid rgba(0,0,0,0.1)" : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </button>
  );
}

// ─── Spinning avatar ──────────────────────────────────────────────────────────
function SpinAvatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
      <div className="absolute inset-0 rounded-full border-4 border-orange-300 opacity-40 animate-ping" />
      <div className="absolute inset-3 rounded-full border-2 border-orange-400 opacity-30 animate-ping" style={{ animationDelay: "0.4s" }} />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #FF6F00, #FF9800, #FFC107, #FF6F00)",
          animation: "spin 8s linear infinite",
          padding: 3,
        }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </div>
      <img
        src={src}
        alt={name}
        className="absolute w-[110px] h-[110px] rounded-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6F00&color=fff&size=120`;
        }}
      />
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AudioCallScreen() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const ctx        = useAudioCall();

  const state = (location.state ?? {}) as {
    channelId: string;
    apiChannelId: string;
    astrologer_id: string;
    astroName: string;
    astrologerImage: string;
    rate: string;
    wallet: string;
  };

  const { channelId, apiChannelId, astrologer_id, astroName, astrologerImage, rate, wallet } = state;

  // ─── Local state ───────────────────────────────────────────────────────────
  const [callStatus,    setCallStatus]    = useState<"ringing" | "connected" | "on_hold" | "ended">("ringing");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [abortCountdown, setAbortCountdown] = useState(119);
  const [isMuted,       setIsMuted]       = useState(false);
  const [isHold,        setIsHold]        = useState(false);
  const [isSpeakerOn,   setIsSpeakerOn]   = useState(false);
  const [showRating,    setShowRating]    = useState(false);
  const [someoneJoined, setSomeoneJoined] = useState(false);
  const [isEnding,      setIsEnding]      = useState(false);

  // Toast
  const [toastVisible,  setToastVisible]  = useState(false);
  const [toastMessage,  setToastMessage]  = useState("");

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const clientRef        = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef    = useRef<ILocalAudioTrack | null>(null);
  const remoteTrackRef   = useRef<IRemoteAudioTrack | null>(null);
  const elapsedTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const ringtoneNodeRef  = useRef<AudioBufferSourceNode | null>(null);
  const isEndingRef      = useRef(false);
  const handleEndRef     = useRef<(status?: "end_user" | "disconnect_user") => void>(() => {});

  // ─── Toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  }, []);

  // ─── Ringtone ──────────────────────────────────────────────────────────────
  const playRingtone = useCallback(async () => {
    try {
      const ctx2 = new AudioContext();
      audioCtxRef.current = ctx2;
      const res = await fetch("/assets/ring.mp3").catch(() => null);
      if (!res) return;
      const buf     = await res.arrayBuffer();
      const decoded = await ctx2.decodeAudioData(buf);
      const source  = ctx2.createBufferSource();
      source.buffer = decoded;
      source.loop   = true;
      source.connect(ctx2.destination);
      source.start();
      ringtoneNodeRef.current = source;
    } catch { /* autoplay may be blocked */ }
  }, []);

  const stopRingtone = useCallback(() => {
    try {
      ringtoneNodeRef.current?.stop();
      ringtoneNodeRef.current = null;
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    } catch { /* silent */ }
  }, []);

  // ─── Elapsed timer ─────────────────────────────────────────────────────────
  const startElapsedTimer = useCallback(() => {
    elapsedTimerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  }, []);

  // ─── Abort countdown ───────────────────────────────────────────────────────
  const startAbortCountdown = useCallback(() => {
    abortTimerRef.current = setInterval(() => {
      setAbortCountdown((s) => {
        if (s <= 1) {
          clearInterval(abortTimerRef.current!);
          handleEndRef.current("disconnect_user");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  // ─── Agora init ────────────────────────────────────────────────────────────
  const initAgora = useCallback(async () => {
    if (!AGORA_APP_ID || !channelId) return;

    try {
      localTrackRef.current?.stop();
      localTrackRef.current?.close();
      localTrackRef.current = null;
      remoteTrackRef.current?.stop();
      remoteTrackRef.current = null;
      await clientRef.current?.leave();
      clientRef.current = null;
    } catch { /* silent */ }

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-joined", () => {
      setSomeoneJoined(true);
      setCallStatus("connected");
      setToastVisible(false);
      stopRingtone();
      clearInterval(abortTimerRef.current!);
      startElapsedTimer();
    });

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio" && user.audioTrack) {
        remoteTrackRef.current = user.audioTrack;
        user.audioTrack.play();
      }
    });

    client.on("user-unpublished", (user) => {
      user.audioTrack?.stop();
    });

    client.on("user-left", () => {
      setCallStatus("ended");
      clearInterval(elapsedTimerRef.current!);
      setShowRating(true);
    });

    try {
      const agoraToken = await fetchAgoraToken(channelId);
      if (!agoraToken) {
        showToast("Token not found. Ask backend to add /user_api/agora_token endpoint.");
        return;
      }
      await client.join(AGORA_APP_ID, channelId, agoraToken, null);
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current = localAudioTrack;
      await client.publish([localAudioTrack]);
      setToastVisible(false);
    } catch (err: any) {
      console.error("Agora join error:", err);
      let msg = "Could not connect to the call server.";
      if (err?.message?.includes("CAN_NOT_GET_GATEWAY_SERVER")) msg = "Token rejected by Agora. Check App ID / App Certificate match.";
      else if (err?.message?.includes("INVALID_TOKEN")) msg = "Invalid Agora token. Backend may be returning a stale token.";
      else if (err?.message?.includes("TOKEN_EXPIRED")) msg = "Agora token expired. Request a new one.";
      else if (err?.message?.includes("NOT_AUTHORIZED")) msg = "Agora: not authorised. Check token privileges.";
      showToast(msg);
    }
  }, [channelId, stopRingtone, startElapsedTimer, showToast]);

  // ─── Leave Agora ───────────────────────────────────────────────────────────
  const leaveAgora = useCallback(async () => {
    try {
      localTrackRef.current?.stop();
      localTrackRef.current?.close();
      localTrackRef.current = null;
      remoteTrackRef.current?.stop();
      remoteTrackRef.current = null;
      await clientRef.current?.leave();
      clientRef.current = null;
    } catch { /* silent */ }
  }, []);

  // ─── End call ──────────────────────────────────────────────────────────────
  const handleEnd = useCallback(async (status: "end_user" | "disconnect_user" = "end_user") => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsEnding(true);
    clearInterval(pollTimerRef.current!);
    clearInterval(elapsedTimerRef.current!);
    clearInterval(abortTimerRef.current!);
    stopRingtone();
    await leaveAgora();
    try { await call_status_update(apiChannelId, status); } catch { /* silent */ }
    setShowRating(true);
    ctx.endCall();
  }, [apiChannelId, leaveAgora, stopRingtone, ctx]);

  useEffect(() => { handleEndRef.current = handleEnd; }, [handleEnd]);

  // ─── Status polling ────────────────────────────────────────────────────────
  const startStatusPoll = useCallback((ch: string) => {
    pollTimerRef.current = setInterval(async () => {
      try {
        const res    = await call_initiate_status(ch);
        const status = res?.results?.status;
        if (status === "accept_astro") {
          clearInterval(abortTimerRef.current!);
          stopRingtone();
        } else if (status === "reject_astro") {
          clearInterval(pollTimerRef.current!);
          navigate(-1);
        } else if (status === "end_astro") {
          clearInterval(pollTimerRef.current!);
          setShowRating(true);
        } else if (status === "end_user" || status === "disconnect_user") {
          clearInterval(pollTimerRef.current!);
          navigate("/");
        }
      } catch { /* keep retrying */ }
    }, 2000);
  }, [navigate, stopRingtone]);

  // ─── Rating submit ─────────────────────────────────────────────────────────
  const handleRatingSubmit = useCallback(async (rating: number, review: string) => {
    try { await add_rating(apiChannelId, String(rating), review); } catch { /* silent */ }
    setShowRating(false);
    navigate("/", { replace: true });
  }, [apiChannelId, navigate]);

  // ─── Controls ──────────────────────────────────────────────────────────────
  const toggleMute = useCallback(async () => {
    if (!localTrackRef.current) return;
    const next = !isMuted;
    try {
      await localTrackRef.current.setMuted(next);
      setIsMuted(next);
    } catch (err) { console.error("Mute error:", err); }
  }, [isMuted]);

  const toggleHold = useCallback(async () => {
    const next = !isHold;
    try {
      if (localTrackRef.current) await localTrackRef.current.setMuted(next);
      if (clientRef.current) {
        for (const user of clientRef.current.remoteUsers) {
          if (user.audioTrack) {
            if (next) user.audioTrack.stop();
            else      user.audioTrack.play();
          }
        }
      }
      setIsHold(next);
      setCallStatus(next ? "on_hold" : "connected");
    } catch (err) { console.error("Hold error:", err); }
  }, [isHold]);

  const toggleSpeaker = useCallback(async () => {
    const next = !isSpeakerOn;
    try {
      if (remoteTrackRef.current) {
        const devices = await AgoraRTC.getPlaybackDevices();
        if (devices.length > 1) {
          const target = next
            ? devices.find(d => d.label.toLowerCase().includes("speaker")) ?? devices[0]
            : devices.find(d => d.label.toLowerCase().includes("earpiece") || d.label.toLowerCase().includes("receiver")) ?? devices[1];
          await remoteTrackRef.current.setPlaybackDevice(target.deviceId);
        }
      }
    } catch (err) { console.error("Speaker error:", err); }
    setIsSpeakerOn(next);
  }, [isSpeakerOn]);

  const handleMinimize = useCallback(() => {
    ctx.startCall({ channelId: apiChannelId, astrologerId: astrologer_id, astroName, astroImage: astrologerImage, rate, wallet });
    ctx.setElapsedSeconds(elapsedSeconds);
    ctx.setCallStatus(callStatus as any);
    navigate(-1);
  }, [ctx, apiChannelId, astrologer_id, astroName, astrologerImage, rate, wallet, elapsedSeconds, callStatus, navigate]);

  // ─── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handlePop = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePop);
    playRingtone();
    startAbortCountdown();
    startStatusPoll(apiChannelId);
    initAgora();
    return () => {
      window.removeEventListener("popstate", handlePop);
      clearInterval(pollTimerRef.current!);
      clearInterval(elapsedTimerRef.current!);
      clearInterval(abortTimerRef.current!);
      stopRingtone();
      leaveAgora();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived UI ────────────────────────────────────────────────────────────
  const statusLabel =
    callStatus === "connected" ? "Connected"  :
    callStatus === "on_hold"   ? "On Hold"    :
    callStatus === "ended"     ? "Call Ended" :
    "Connecting...";

  const statusColor =
    callStatus === "connected" ? "#16a34a" :
    callStatus === "on_hold"   ? "#d97706" :
    callStatus === "ended"     ? "#dc2626" :
    "#9ca3af";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      <AgoraErrorToast
        visible={toastVisible}
        message={toastMessage}
        onRetry={() => { setToastVisible(false); initAgora(); }}
        onDismiss={() => setToastVisible(false)}
      />

     <div
  className="fixed inset-0 z-[150] flex flex-col"
  style={{
    background: "linear-gradient(135deg, #FF6F00 0%, #FF9800 50%, #FFC107 100%)",
    fontFamily: "'DM Sans', sans-serif",
    height: "100dvh",
    width: "100vw",
    overflow: "hidden",
  }}
>
        {/* ── Top bar ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-8 pb-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="text-white text-sm font-semibold opacity-80">Astrogurujii</div>
          <button onClick={handleMinimize} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors" title="Minimize">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        {/* ── Astrologer info ── */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 mt-2">
          <SpinAvatar src={astrologerImage} name={astroName} />
          <div className="text-center">
            <h2 className="text-white text-xl font-bold">{astroName}</h2>
            <p className="text-white/70 text-sm mt-0.5">Astrologer</p>
          </div>

          {/* Status pill */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
            <span className="text-white text-sm font-semibold">{statusLabel}</span>
          </div>

          {callStatus === "ringing" && (
            <p className="text-white/60 text-xs">Auto-cancel in {formatDuration(abortCountdown)}</p>
          )}
          {(callStatus === "connected" || callStatus === "on_hold") && (
            <p className="text-white text-2xl font-bold tracking-widest">{formatDuration(elapsedSeconds)}</p>
          )}
        </div>

        {/* ── White card — fills remaining space ── */}
        <div className="flex-1 flex items-end min-h-0 mt-3">
          <div className="w-full mx-4 mb-3 bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Wallet / rate row */}
            <div className="flex justify-around text-center border-b border-gray-100 py-3 px-6">
              <div>
                <p className="text-xs text-gray-400 font-medium">Rate</p>
                <p className="text-sm font-bold text-gray-800">₹{rate}/min</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Balance</p>
                <p className="text-sm font-bold text-gray-800">₹{wallet}</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Max time</p>
                <p className="text-sm font-bold text-gray-800">
                  {rate && wallet && Number(rate) > 0 ? Math.floor(Number(wallet) / Number(rate)) : "—"} min
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-around items-center px-6 py-5">
              <ActionBtn
                active={isMuted}
                label={isMuted ? "Unmute" : "Mute"}
                onClick={toggleMute}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24"
                    fill={isMuted ? "currentColor" : "none"}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={isMuted ? "text-gray-400" : "text-gray-700"}>
                    {isMuted ? (
                      <>
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                        <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                      </>
                    )}
                  </svg>
                }
              />

              <ActionBtn
                active={isHold}
                label={isHold ? "Resume" : "Hold"}
                onClick={toggleHold}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke={isHold ? "#d97706" : "currentColor"} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className={isHold ? "" : "text-gray-700"}>
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                }
              />

              <ActionBtn
                active={isSpeakerOn}
                label={isSpeakerOn ? "Speaker" : "Earpiece"}
                onClick={toggleSpeaker}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24"
                    fill={isSpeakerOn ? "currentColor" : "none"}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={isSpeakerOn ? "text-orange-500" : "text-gray-700"}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                }
              />
            </div>

            {/* End call button */}
            <div className="flex justify-center py-4">
              <button
                onClick={() => handleEnd(someoneJoined ? "end_user" : "disconnect_user")}
                disabled={isEnding}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 4px 20px rgba(239,68,68,0.45)" }}
              >
                {isEnding ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13" />
                    <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91" />
                    <line x1="23" y1="1" x2="1" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="flex-shrink-0 text-center text-white/50 text-[10px] py-2 px-6">
          Do not share personal payment details. Astrogurujii never asks for direct payment.
        </p>
      </div>

      {showRating && <RatingDialog onSubmit={handleRatingSubmit} />}
    </>
  );
}