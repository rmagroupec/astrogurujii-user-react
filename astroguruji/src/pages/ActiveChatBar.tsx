import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChat } from "./ChatContext";
import { profile_api } from "@/https_service";

export default function ActiveChatBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { chatActive, chatInfo, chatTimeLeft } = useChat();

  const [dismissed, setDismissed]   = useState(false);
  const [prevGid, setPrevGid]       = useState<string | null>(null);
  const [dismissing, setDismissing] = useState(false);
  const [loading, setLoading]       = useState(false);

  const isOnChatPage =
    location.pathname === "/chat" ||
    location.pathname === "/chat-calling";

  // Reset dismissed when a NEW chat session starts
  if (chatInfo?.gid && chatInfo.gid !== prevGid) {
    setPrevGid(chatInfo.gid);
    setDismissed(false);
  }

  const shouldShow = chatActive && chatTimeLeft > 0 && !isOnChatPage && !dismissed && !!chatInfo;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleReturnToChat = async () => {
    if (!chatInfo || loading) return;
    setLoading(true);

    // Fetch current wallet balance
    let currentWallet = chatInfo.wallet;
    try {
      const res = await profile_api();
      if (res?.status === true && res.results) {
        const w = parseFloat(
          res.results.wallet ?? res.results.balance ??
          res.results.amount ?? res.results.wallet_amount ?? "0"
        );
        if (!isNaN(w) && w > 0) currentWallet = String(w);
      }
    } catch { /* use existing */ }

    setLoading(false);

    // Navigate back to chat — timer is already running in ChatContext, not reset
    navigate("/chat", {
      replace: false,
      state: {
        gid:             chatInfo.gid,
        fbchannelID:     chatInfo.fbchannelID,
        astrologer_id:   chatInfo.astrologer_id,
        astroName:       chatInfo.astroName,
        astrologerImage: chatInfo.astrologerImage,
        rate:            chatInfo.rate,
        wallet:          currentWallet,
        name:            chatInfo.name,
        gender:          chatInfo.gender,
        dob:             chatInfo.dob,
        tob:             chatInfo.tob,
        place:           chatInfo.place,
      },
    });
  };

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => {
      setDismissed(true);
      setDismissing(false);
    }, 300);
  };

  if (!shouldShow) return null;

  const rateDisplay = chatInfo.rate && chatInfo.rate !== "0"
    ? `₹${chatInfo.rate}/min`
    : "Chat";

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
        className={`fixed bottom-6 left-1/2 z-[9998] w-[calc(100%-32px)] max-w-[400px] ${
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
          {/* Top accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="px-4 py-3 flex items-center gap-3">

            {/* Avatar with pulse */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-orange-400 opacity-25 animate-ping" />
              <img
                src={chatInfo.astrologerImage}
                alt={chatInfo.astroName}
                className="relative w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(chatInfo.astroName)}&background=FF6F00&color=fff&size=96`;
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
              <p className="text-sm font-bold text-gray-900 truncate">{chatInfo.astroName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-orange-500">{rateDisplay}</span>
                <span className="text-[10px] text-gray-300">•</span>
                {/* Live ticking countdown from ChatContext */}
                <span className="text-xs font-bold text-red-500">
                  ⏱ {formatTime(chatTimeLeft)}
                </span>
              </div>
            </div>

            {/* Return button */}
            <button
              onClick={handleReturnToChat}
              disabled={loading}
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
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-3.62"/>
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