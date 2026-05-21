/**
 * ActiveCallBar.tsx
 *
 * Floating minimized call bar — shown globally at the bottom-right of the screen
 * whenever an audio call is active and minimized.
 *
 * Mirrors Flutter's floatingActionButton in MainHomeScreenWithBottomNavigation:
 *   CustomFloatingCard with profile image, name, rate, "Chat/Call in progress"
 *   and a button to return to the full call screen.
 *
 * Usage: Mount this once inside App (outside Routes) so it persists across navigation.
 */

import { useNavigate } from "react-router-dom";
import { useAudioCall } from "./AudioCallContext";

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function ActiveCallBar() {
  const navigate = useNavigate();
  const ctx = useAudioCall();

  const { callStatus, callInfo, elapsedSeconds, isMinimized } = ctx;

  // Only show when there IS an active call AND it's minimized
  const isVisible =
    isMinimized &&
    callInfo !== null &&
    callStatus !== "idle" &&
    callStatus !== "ended";

  if (!isVisible || !callInfo) return null;

  const handleReturn = () => {
    ctx.maximize();
    navigate("/audio-call", {
      state: {
        channelId: callInfo.channelId,
        apiChannelId: callInfo.channelId,
        astrologer_id: callInfo.astrologerId,
        astroName: callInfo.astroName,
        astrologerImage: callInfo.astroImage,
        rate: callInfo.rate,
        wallet: callInfo.wallet,
      },
    });
  };

  const handleEndFromBar = async () => {
    const { call_status_update } = await import("@/https_service");
    try { await call_status_update(callInfo.channelId, "end_user"); } catch { /* silent */ }
    ctx.endCall();
  };

  const statusLabel =
    callStatus === "connected" ? "Call in progress" :
    callStatus === "on_hold"   ? "On hold" :
    "Connecting...";

  const statusColor =
    callStatus === "connected" ? "#16a34a" :
    callStatus === "on_hold"   ? "#d97706" :
    "#9ca3af";

  return (
    <div
      className="fixed bottom-6 right-4 z-[300] w-[280px] rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: "white",
        border: "1.5px solid rgba(255,111,0,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(255,111,0,0.12)",
      }}
    >
      {/* Orange accent top bar */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #FF6F00, #FF9800, #FFC107)" }}
      />

      <div className="flex items-center gap-3 px-3 py-3">
        {/* Avatar with pulsing dot */}
        <div className="relative flex-shrink-0">
          <img
            src={callInfo.astroImage}
            alt={callInfo.astroName}
            className="w-11 h-11 rounded-full object-cover border-2 border-orange-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(callInfo.astroName)}&background=FF6F00&color=fff&size=44`;
            }}
          />
          {/* Live indicator */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
            style={{
              background: callStatus === "connected" ? "#22c55e" : "#f97316",
              animation: "pulse 1.5s infinite",
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{callInfo.astroName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[11px] font-semibold"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </span>
            {callStatus === "connected" && (
              <span className="text-[11px] font-mono text-gray-500">
                · {formatDuration(elapsedSeconds)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-orange-500 font-medium">₹{callInfo.rate}/min</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {/* Return to call */}
          <button
            onClick={handleReturn}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #FF6F00, #FF9800)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Open
          </button>

          {/* End call */}
          <button
            onClick={handleEndFromBar}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: "#ef4444" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13" />
              <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91" />
              <line x1="23" y1="1" x2="1" y2="23" />
            </svg>
            End
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}