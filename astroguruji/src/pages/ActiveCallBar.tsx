/**
 * ActiveCallBar.tsx
 *
 * Standalone floating bar for active audio calls.
 * Shows when:
 *   1. On app load — lastCallList API has accept_astro audio call
 *   2. During session — agoraManager.channelId is set (user pressed back from AudioCallScreen)
 *
 * Timer synced from Firebase CallSession (max_minutes + last_tick_at) — same as ActiveChatBar.
 * Hidden on /audio-call page (full screen is showing).
 * margin-bottom: 100px to clear bottom nav.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/firebase";
import { lastCallList, call_status_update, profile_api } from "@/https_service";
import { agoraManager } from "./agoraManager";

type CallSessionInfo = {
  channelId: string;
  astroId: string;
  astroName: string;
  astroImg: string;
  rate: string;
  wallet: string;
  userName: string;
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function ActiveCallBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session,  setSession]  = useState<CallSessionInfo | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading,  setLoading]  = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const fbUnsubRef  = useRef<(() => void) | null>(null);
  const timeLeftRef = useRef(0);

  // Hide when full-screen call is open
  const hiddenPaths = ["/audio-call"];
  const isOnCallPage = hiddenPaths.some(p => location.pathname.startsWith(p));

  // ── Core: subscribe Firebase CallSession for live countdown ────────────────
  function subscribeAndStart(info: CallSessionInfo, fallbackSeconds: number) {
    // Clean previous
    if (timerRef.current)  { clearInterval(timerRef.current); timerRef.current = null; }
    if (fbUnsubRef.current) { fbUnsubRef.current(); fbUnsubRef.current = null; }

    const sessionRef = ref(db, `CallSession/${info.channelId}`);
    let started = false;

    const handler = onValue(sessionRef, (snap) => {
      const data = snap.val();
      console.log("[ActiveCallBar] Firebase CallSession:", data);

      if (data) {
        const fbStatus   = String(data.status ?? "");
        const maxMinutes = data.max_minutes;
        const lastTick   = data.last_tick_at;
        const startedAt  = data.started_at;

        if (["end_astro", "end_user", "wallet_empty", "rejected", "disconnect_user"].includes(fbStatus)) {
          console.log("[ActiveCallBar] session ended:", fbStatus);
          cleanup();
          setSession(null);
          setTimeLeft(0);
          return;
        }

        let serverSeconds: number | null = null;

        if (maxMinutes != null) {
          serverSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);
          if (lastTick) {
            const elapsed = Math.floor((Date.now() - Number(lastTick)) / 1000);
            serverSeconds = Math.max(serverSeconds - elapsed, 0);
          }
        } else if (startedAt) {
          const rate   = parseFloat(info.rate) || 1;
          const wallet = parseFloat(info.wallet) || 0;
          const maxSec = wallet > 0 ? Math.floor((wallet / rate) * 60) : 300;
          serverSeconds = Math.max(maxSec - Math.floor((Date.now() - Number(startedAt)) / 1000), 0);
        }

        if (!started) {
          const initSec = serverSeconds ?? fallbackSeconds;
          console.log("[ActiveCallBar] starting timer at", initSec, "s");
          setSession(info);
          setTimeLeft(initSec);
          timeLeftRef.current = initSec;
          startTimer();
          started = true;
        } else if (serverSeconds != null) {
          // Correct drift > 30s
          setTimeLeft(prev => {
            if (Math.abs(prev - serverSeconds!) > 30) {
              timeLeftRef.current = serverSeconds!;
              return serverSeconds!;
            }
            return prev;
          });
        }
        return;
      }

      // No Firebase data yet — use fallback
      if (!started) {
        console.log("[ActiveCallBar] no Firebase data, fallback:", fallbackSeconds);
        setSession(info);
        setTimeLeft(fallbackSeconds);
        timeLeftRef.current = fallbackSeconds;
        startTimer();
        started = true;
      }
    }, (err) => {
      console.error("[ActiveCallBar] Firebase error:", err);
      if (!started) {
        setSession(info);
        setTimeLeft(fallbackSeconds);
        timeLeftRef.current = fallbackSeconds;
        startTimer();
        started = true;
      }
    });

    fbUnsubRef.current = () => off(sessionRef, "value", handler);
  }

  // ── On mount: check lastCallList ───────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;

    async function init() {
      try {
        console.log("[ActiveCallBar] checking lastCallList...");
        const res = await lastCallList();
        if (cancelled || !res?.result || !res.data2) return;

        const d = res.data2 as any;

        const status    = String(d.status            ?? "");
        const callType  = String(d.call_type         ?? d.callType  ?? "").toLowerCase().trim();
        const channelId = String(d.channel_id        ?? d.channelId ?? "");
        const astroId   = String(d.astro_id          ?? d.astroId   ?? "");
        const astroName = String(d.astro_name        ?? d.astroName ?? "");
        const astroImg  = String(d.astro_profile_img ?? d.astroProfileImg ?? "");
        const userName  = String(d.user_name         ?? d.userName  ?? "");
        const callRate  = String(d.call_rate         ?? d.callRate  ?? "1");
        const totalAmt  = String(d.total_amount      ?? d.totalAmount ?? "0");
        const diff      = Number(d.difference        ?? 0);

        console.log("[ActiveCallBar] mapped:", { status, callType, channelId });

        if (status !== "accept_astro" || callType !== "audio" || !channelId) return;

        const info: CallSessionInfo = { channelId, astroId, astroName, astroImg, rate: callRate, wallet: totalAmt, userName };
        const rate   = parseFloat(callRate) || 1;
        const wallet = parseFloat(totalAmt) || 0;
        const maxSec = wallet > 0 ? Math.floor((wallet / rate) * 60) : 300;
        const fallback = wallet > 0 ? Math.max(maxSec - diff, 0) : 300;

        subscribeAndStart(info, fallback);
      } catch (err) {
        console.error("[ActiveCallBar] init error:", err);
      }
    }

    init();
    return () => { cancelled = true; cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Also show when user navigates BACK from AudioCallScreen mid-session ────
  // agoraManager.channelId is set → call is active but screen is closed
  useEffect(() => {
    // Only trigger when navigating TO a non-call page with an active agoraManager session
    if (isOnCallPage) return;

    const activeChannelId = agoraManager.channelId;
    if (!activeChannelId) return;

    // Already showing this session
    if (session?.channelId === activeChannelId) return;

    console.log("[ActiveCallBar] agoraManager active, showing bar for channel:", activeChannelId);

    // We don't have full info here — read from lastCallList to get astro details
    // But that's async; use a minimal session and let Firebase fill the rest
    const token = localStorage.getItem("token");
    if (!token) return;

    lastCallList().then((res) => {
      if (!res?.result || !res.data2) return;
      const d = res.data2 as any;
      const channelId = String(d.channel_id ?? d.channelId ?? "");
      if (channelId !== activeChannelId) return;

      const info: CallSessionInfo = {
        channelId,
        astroId:   String(d.astro_id          ?? d.astroId   ?? ""),
        astroName: String(d.astro_name        ?? d.astroName ?? ""),
        astroImg:  String(d.astro_profile_img ?? d.astroProfileImg ?? ""),
        rate:      String(d.call_rate         ?? d.callRate  ?? "1"),
        wallet:    String(d.total_amount      ?? d.totalAmount ?? "0"),
        userName:  String(d.user_name         ?? d.userName  ?? ""),
      };

      const rate    = parseFloat(info.rate) || 1;
      const wallet  = parseFloat(info.wallet) || 0;
      const fallback = wallet > 0 ? Math.floor((wallet / rate) * 60) : 300;

      subscribeAndStart(info, fallback);
    }).catch(() => { /* silent */ });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // re-check on every route change

  // ── Local countdown timer ──────────────────────────────────────────────────
  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        timeLeftRef.current = next;
        if (next <= 0) { cleanup(); setSession(null); return 0; }
        return next;
      });
    }, 1000);
  }

  function cleanup() {
    if (timerRef.current)  { clearInterval(timerRef.current); timerRef.current = null; }
    if (fbUnsubRef.current) { fbUnsubRef.current(); fbUnsubRef.current = null; }
  }

  // ── Return to full call screen ─────────────────────────────────────────────
  const handleReturn = async () => {
    if (!session || loading) return;
    setLoading(true);

    let currentWallet = session.wallet;
    try {
      const res = await profile_api();
      if (res?.status === true && res.results) {
        const raw = res.results.wallet ?? res.results.balance ?? res.results.amount ?? res.results.wallet_amount ?? "0";
        const parsed = parseFloat(String(raw));
        if (!isNaN(parsed) && parsed > 0) currentWallet = String(parsed);
      }
    } catch { /* use saved */ }

    setLoading(false);
    navigate("/audio-call", {
      state: {
        channelId:       session.channelId,
        apiChannelId:    session.channelId,
        astrologer_id:   session.astroId,
        astroName:       session.astroName,
        astrologerImage: session.astroImg,
        rate:            session.rate,
        wallet:          currentWallet,
      },
    });
  };

  // ── End from bar ───────────────────────────────────────────────────────────
  const handleEnd = async () => {
    if (!session) return;
    cleanup();
    await agoraManager.leave();
    try { await call_status_update(session.channelId, "end_user"); } catch { /* silent */ }
    setSession(null);
    setTimeLeft(0);
  };

  // ── Visibility ─────────────────────────────────────────────────────────────
  if (!session || isOnCallPage) return null;

  return (
    <div
      className="fixed right-4 z-[500] flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-3 py-2.5 border border-orange-100"
      style={{ bottom: "100px", minWidth: 260, maxWidth: 340 }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={session.astroImg}
          alt={session.astroName}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(session.astroName)}&background=FF6F00&color=fff&size=80`;
          }}
        />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500"
          style={{ animation: "acbPulse 1.5s infinite" }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{session.astroName}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] font-semibold text-green-600">Call in progress</span>
          <span className="text-[11px] font-mono text-gray-500">· {formatDuration(timeLeft)}</span>
        </div>
        <p className="text-[10px] text-orange-500 font-medium">₹{session.rate}/min</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={handleReturn}
          disabled={loading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#FF6F00,#FF9800)" }}
        >
          {loading
            ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
          }
          Open
        </button>
        <button
          onClick={handleEnd}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white"
          style={{ background: "#ef4444" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13"/>
            <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91"/>
            <line x1="23" y1="1" x2="1" y2="23"/>
          </svg>
          End
        </button>
      </div>

      <style>{`
        @keyframes acbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}