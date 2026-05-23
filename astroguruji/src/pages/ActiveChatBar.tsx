/**
 * ActiveChatBar.tsx  — Production Grade
 *
 * Floating bar shown on every page EXCEPT /chat and /chat-calling.
 * Appears automatically when:
 *   • A chat session is active in ChatContext (live or restored from sessionStorage).
 *   • The user is not already on the chat screen.
 *
 * Key fixes vs previous version:
 *  ✅ Never starts as dismissed=true — restored sessions always show the bar.
 *  ✅ Dismissed state is per-session (keyed on gid) and stored in sessionStorage
 *     so it survives a soft navigation but resets on a new session.
 *  ✅ Wallet balance is refreshed from API before returning to chat.
 *  ✅ Slide-up animation plays correctly on restore.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChat } from "./ChatContext";
import { profile_api } from "@/https_service";

const DISMISS_KEY = "chat_bar_dismissed_gid";

export default function ActiveChatBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatActive, chatInfo, chatTimeLeft } = useChat();

  // ── Dismissed is per-session, persisted so dismiss survives soft navigation
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      // Only treat as dismissed if it was dismissed for THIS exact session
      const dismissedGid = sessionStorage.getItem(DISMISS_KEY);
      return !!chatInfo?.gid && dismissedGid === chatInfo.gid;
    } catch {
      return false;
    }
  });

  const [dismissing, setDismissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const prevGidRef = useRef<string | null>(chatInfo?.gid ?? null);

  // Paths where bar must NOT show
  const hiddenPaths = ["/chat", "/chat-calling", "/audio-call"];
  const isOnChatPage = hiddenPaths.includes(location.pathname);

  // ── When a NEW session starts (different gid), always un-dismiss ──────────
  useEffect(() => {
    if (!chatInfo?.gid) return;

    if (chatInfo.gid !== prevGidRef.current) {
      prevGidRef.current = chatInfo.gid;
      // Clear dismissed flag for the new session
      try { sessionStorage.removeItem(DISMISS_KEY); } catch { /* ignore */ }
      setDismissed(false);
    }
  }, [chatInfo?.gid]);

  // ── When chatActive flips true (page restore), always un-dismiss ──────────
  useEffect(() => {
    if (chatActive) {
      try {
        const dismissedGid = sessionStorage.getItem(DISMISS_KEY);
        // Only keep dismissed if it was THIS session that was dismissed
        if (dismissedGid !== chatInfo?.gid) {
          setDismissed(false);
        }
      } catch {
        setDismissed(false);
      }
    }
  }, [chatActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const shouldShow =
    chatActive &&
    chatTimeLeft > 0 &&
    !isOnChatPage &&
    !dismissed &&
    !!chatInfo;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── Return to chat ─────────────────────────────────────────────────────────
  const handleReturnToChat = async () => {
    if (!chatInfo || loading) return;
    setLoading(true);

    let currentWallet = chatInfo.wallet;
    try {
      const res = await profile_api();
      if (res?.status === true && res.results) {
        const raw =
          res.results.wallet ??
          res.results.balance ??
          res.results.amount ??
          res.results.wallet_amount ??
          "0";
        const w = parseFloat(String(raw));
        if (!isNaN(w) && w > 0) currentWallet = String(w);
      }
    } catch {
      /* keep existing wallet value */
    } finally {
      setLoading(false);
    }

    // Timer keeps ticking in ChatContext — ChatScreen will skip restarting it
    navigate("/chat", {
      replace: false,
      state: {
        gid: chatInfo.gid,
        fbchannelID: chatInfo.fbchannelID,
        astrologer_id: chatInfo.astrologer_id,
        astroName: chatInfo.astroName,
        astrologerImage: chatInfo.astrologerImage,
        rate: chatInfo.rate,
        wallet: currentWallet,
        name: chatInfo.name,
        gender: chatInfo.gender,
        dob: chatInfo.dob,
        tob: chatInfo.tob,
        place: chatInfo.place,
      },
    });
  };

  // ── Dismiss (per-session) ──────────────────────────────────────────────────
  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => {
      try {
        if (chatInfo?.gid) sessionStorage.setItem(DISMISS_KEY, chatInfo.gid);
      } catch { /* ignore */ }
      setDismissed(true);
      setDismissing(false);
    }, 300);
  };

  if (!shouldShow) return null;

  const rateDisplay =
    chatInfo.rate && chatInfo.rate !== "0"
      ? `₹${chatInfo.rate}/min`
      : "Chat";

  const isLow = chatTimeLeft > 0 && chatTimeLeft <= 5 * 60;

  return (
    <>
      <style>{`
        @keyframes chatBarSlideUp {
          from { transform: translate(-50%, 120%); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
        @keyframes chatBarSlideDown {
          from { transform: translate(-50%, 0);    opacity: 1; }
          to   { transform: translate(-50%, 120%); opacity: 0; }
        }
        .chat-bar-in  { animation: chatBarSlideUp   0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .chat-bar-out { animation: chatBarSlideDown 0.3s ease-in forwards; }
      `}</style>

      <div
        className={`fixed bottom-6 left-1/2 z-[9998] w-[calc(100%-32px)] max-w-[420px] ${
          dismissing ? "chat-bar-out" : "chat-bar-in"
        }`}
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

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss chat bar"
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="px-4 py-3 flex items-center gap-3">

            {/* Avatar with pulse ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-orange-400 opacity-20 animate-ping" />
              <img
                src={chatInfo.astrologerImage}
                alt={chatInfo.astroName}
                className="relative w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    chatInfo.astroName
                  )}&background=FF6F00&color=fff&size=96`;
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            {/* Session info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Chat in Progress
                </span>
              </div>

              <p className="text-sm font-bold text-gray-900 truncate pr-6">
                {chatInfo.astroName}
              </p>

              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs font-semibold text-orange-500">
                  {rateDisplay}
                </span>
                <span className="text-[10px] text-gray-300">•</span>
                <span
                  className={`text-xs font-bold ${
                    isLow ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  ⏱ {formatTime(chatTimeLeft)}
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
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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