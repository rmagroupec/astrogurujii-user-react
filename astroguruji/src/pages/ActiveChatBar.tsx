/**
 * ActiveChatBar.tsx
 *
 * Completely standalone — no Context, no Provider.
 * 1. On mount → calls lastCallList API
 * 2. If accept_astro → subscribes Firebase CallSession for live timer
 * 3. Counts down locally, syncs from Firebase every tick
 * 4. Shows floating bar with Return button
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/firebase";
import { lastCallList, profile_api } from "@/https_service";

type ChatSessionInfo = {
  channelId: string;
  astroId: string;
  astroName: string;
  astroImg: string;
  rate: string;
  wallet: string;
  userName: string;
};

export default function ActiveChatBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession]       = useState<ChatSessionInfo | null>(null);
  const [timeLeft, setTimeLeft]     = useState(0);
  const [loading, setLoading]       = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const fbUnsubRef  = useRef<(() => void) | null>(null);
  const timeLeftRef = useRef(0); // keep ref in sync for timer callback

  const hiddenPaths = ["/chat", "/chat-calling", "/audio-call"];
  const isOnChatPage = hiddenPaths.some(p => location.pathname.startsWith(p));

  // ── On mount: check lastCallList → subscribe Firebase ─────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;

    async function init() {
      try {
        console.log("[ActiveChatBar] checking lastCallList...");
        const res = await lastCallList();
        console.log("[ActiveChatBar] raw:", JSON.stringify(res));

        if (cancelled || !res?.result || !res.data2) return;

        const d = res.data2 as any;

        const status    = String(d.status           ?? "");
        const callType  = String(d.call_type        ?? d.callType   ?? "").toLowerCase().trim();
        const channelId = String(d.channel_id       ?? d.channelId  ?? "");
        const astroId   = String(d.astro_id         ?? d.astroId    ?? "");
        const astroName = String(d.astro_name       ?? d.astroName  ?? "");
        const astroImg  = String(d.astro_profile_img ?? d.astroProfileImg ?? "");
        const userName  = String(d.user_name        ?? d.userName   ?? "");
        const callRate  = String(d.call_rate        ?? d.callRate   ?? "1");
        const totalAmt  = String(d.total_amount     ?? d.totalAmount ?? "0");
        const diff      = Number(d.difference       ?? 0);

        console.log("[ActiveChatBar] mapped:", { status, callType, channelId });

        if (status !== "accept_astro" || callType !== "chat" || !channelId) return;

        const info: ChatSessionInfo = {
          channelId, astroId, astroName, astroImg,
          rate: callRate, wallet: totalAmt, userName,
        };

        // Fallback seconds
        const fallbackSeconds = diff > 0 ? Math.max(Math.floor(diff * 60), 0) : 300;

        // Subscribe Firebase CallSession for live time
        const sessionRef = ref(db, `CallSession/${channelId}`);
        let started = false;

        const handler = onValue(sessionRef, (snap) => {
          if (cancelled) return;
          const data = snap.val();
          console.log("[ActiveChatBar] Firebase:", data);

          if (data) {
            const fbStatus   = String(data.status ?? "");
            const maxMinutes = data.max_minutes;
            const lastTick   = data.last_tick_at;

            // Session ended
            if (["end_astro", "end_user", "wallet_empty", "rejected"].includes(fbStatus)) {
              console.log("[ActiveChatBar] session ended:", fbStatus);
              cleanup();
              setSession(null);
              setTimeLeft(0);
              return;
            }

            // Compute accurate seconds
            if (maxMinutes != null) {
              let serverSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);
              if (lastTick) {
                const elapsed = Math.floor((Date.now() - Number(lastTick)) / 1000);
                serverSeconds = Math.max(serverSeconds - elapsed, 0);
              }

              if (!started) {
                // First sync — start everything
                console.log("[ActiveChatBar] starting with", serverSeconds, "seconds");
                setSession(info);
                setTimeLeft(serverSeconds);
                timeLeftRef.current = serverSeconds;
                startTimer();
                started = true;
              } else {
                // Ongoing sync — correct drift > 30s
                setTimeLeft(prev => {
                  if (Math.abs(prev - serverSeconds) > 30) {
                    console.log("[ActiveChatBar] correcting drift:", prev, "→", serverSeconds);
                    timeLeftRef.current = serverSeconds;
                    return serverSeconds;
                  }
                  return prev;
                });
              }
              return;
            }
          }

          // No Firebase data — use fallback
          if (!started) {
            console.log("[ActiveChatBar] no Firebase data, fallback:", fallbackSeconds);
            setSession(info);
            setTimeLeft(fallbackSeconds);
            timeLeftRef.current = fallbackSeconds;
            startTimer();
            started = true;
          }
        }, (err) => {
          console.error("[ActiveChatBar] Firebase error:", err);
          if (!started) {
            setSession(info);
            setTimeLeft(fallbackSeconds);
            timeLeftRef.current = fallbackSeconds;
            startTimer();
            started = true;
          }
        });

        fbUnsubRef.current = () => off(sessionRef, "value", handler);

      } catch (err) {
        console.error("[ActiveChatBar] init error:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // ── Local countdown timer ──────────────────────────────────────────────────
  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        timeLeftRef.current = next;

        if (next <= 0) {
          cleanup();
          setSession(null);
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function cleanup() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (fbUnsubRef.current) {
      fbUnsubRef.current();
      fbUnsubRef.current = null;
    }
  }

  // ── Return to chat ─────────────────────────────────────────────────────────
  const handleReturnToChat = async () => {
    if (!session || loading) return;
    setLoading(true);

    let currentWallet = session.wallet;
    try {
      const res = await profile_api();
      if (res?.status === true && res.results) {
        const raw =
          res.results.wallet      ??
          res.results.balance     ??
          res.results.amount      ??
          res.results.wallet_amount ?? "0";
        const w = parseFloat(String(raw));
        if (!isNaN(w) && w > 0) currentWallet = String(w);
      }
    } catch { /* keep existing */ }
    finally { setLoading(false); }

    navigate("/chat", {
      replace: false,
      state: {
        gid:             session.channelId,
        fbchannelID:     session.channelId,
        astrologer_id:   session.astroId,
        astroName:       session.astroName,
        astrologerImage: session.astroImg,
        rate:            session.rate,
        wallet:          currentWallet,
        name:            session.userName,
        gender:          "",
        dob:             "",
        tob:             "",
        place:           "",
      },
    });
  };

  // ── Don't show if no session, time up, or on chat page ────────────────────
  if (!session || timeLeft <= 0 || isOnChatPage) return null;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const rateDisplay = session.rate && session.rate !== "0"
    ? `₹${session.rate}/min`
    : "Chat";

  const isLow = timeLeft > 0 && timeLeft <= 5 * 60;

  return (
    <>
      <style>{`
        @keyframes chatBarSlideUp {
          from { transform: translate(-50%, 120%); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
        .chat-bar-in {
          animation: chatBarSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
      `}</style>

      <div
        className="chat-bar-in fixed bottom-6 left-1/2 z-[9998] w-[calc(100%-32px)] max-w-[420px]"
        style={{ transform: "translateX(-50%)" }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fffbf7 0%, #ffffff 100%)",
            border: "1.5px solid rgba(255,111,0,0.25)",
            boxShadow: "0 8px 32px rgba(255,111,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top gradient accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

          <div className="px-4 py-3 flex items-center gap-3">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-orange-400 opacity-20 animate-ping" />
              <img
                src={session.astroImg}
                alt={session.astroName}
                className="relative w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(session.astroName)}&background=FF6F00&color=fff&size=96`;
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Chat in Progress
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 truncate pr-6">
                {session.astroName}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs font-semibold text-orange-500">{rateDisplay}</span>
                <span className="text-[10px] text-gray-300">•</span>
                <span className={`text-xs font-bold ${isLow ? "text-red-500" : "text-gray-600"}`}>
                  ⏱ {formatTime(timeLeft)}
                </span>
                {isLow && (
                  <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                    Low balance
                  </span>
                )}
              </div>
            </div>

            {/* Return button */}
            <button
              onClick={handleReturnToChat}
              disabled={loading}
              aria-label="Return to chat"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #FF6F00, #FF9800)",
                boxShadow: "0 4px 14px rgba(255,111,0,0.35)",
                minWidth: 80,
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.62" />
                  </svg>
                  Return
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}