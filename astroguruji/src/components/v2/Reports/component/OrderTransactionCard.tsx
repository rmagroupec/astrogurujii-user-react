/**
 * OrderTransactionCard.tsx
 * — "Call Again" added for call transactions
 * — "Chat Again" added for chat transactions (alongside existing View Chat)
 * — Wallet balance fetched live from profile_api (fixes ₹0 display)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConnectionModal from "@/components/v2/ConnectionModal";
import LoginModal from "@/components/v2/UserLoginModal";
import { profile_api } from "@/https_service";

export default function TransactionCard({ data, type }: { data: any; type?: string }) {
  const navigate = useNavigate();

  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionCallType, setConnectionCallType] = useState<"chat" | "audio">("audio");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // ✅ Fetch real wallet balance from profile API — not localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    profile_api().then((res) => {
      if (res?.status === true && res.results) {
        const raw =
          res.results.wallet ??
          res.results.balance ??
          res.results.amount ??
          res.results.wallet_amount ??
          "0";
        const parsed = parseFloat(String(raw));
        setWalletBalance(isNaN(parsed) ? 0 : parsed);
      }
    });
  }, []);

  const isCredit   = data.amount_type === "Credit";
  const isChatOrder = type === "chat" || data.call_type === "chat" || data.type === "chat" || data.description === "chat";
  const isCallOrder = type === "call";

  const ratingValue = Number(data.rating || 0);
  const astroImage  = data.astro_profile_img || data.astro_image || "";
  const isWallet    = type === "wallet" || type === "other" || (!data.astro_profile_img && !data.astro_image && !data.astro_name && !data.astro_display_name);
  const astroName   = data.astro_display_name || data.astro_name || data.description || data.amount_type_for || "";
  const astroId     = data.astr_id || data.astro_id || data.astrologer_id || "";
  const chatRate = parseFloat(
    data.per_min_chat || data.chat_rate || data.per_min_chat_offer || data.rate || "0"
  );
  const callRate = parseFloat(
    data.per_min_voice_call || data.per_min_call || data.call_rate ||
    data.per_min_audio || data.voice_rate || data.rate || "0"
  );

  // Derive rate from transaction if API fields are missing (amount ÷ duration)
  const derivedRate = (() => {
    const amt  = parseFloat(data.amount || "0");
    const mins = parseInt(String(
      data.call_min ?? data.chat_min ?? data.call_duration ?? data.call_duracation ?? data.duration ?? "0"
    ), 10);
    if (amt > 0 && mins > 0) return Math.round(amt / mins);
    return 0;
  })();

  const effectiveChatRate = chatRate > 0 ? chatRate : derivedRate;
  const effectiveCallRate = callRate > 0 ? callRate : derivedRate;

  const handleViewChat = () => {
    navigate("/chat-view-only", {
      state: {
        gid: data.fb_channel_id,
        fbchannelID: data.channel_id || data.fb_channel_id,
        astrologer_id: astroId,
        astroName,
        astrologerImage: astroImage,
        userName: data.user_name || localStorage.getItem("name") || "You",
        rating: data.rating || 0,
        review: data.review || "",
        rate: data.per_min_chat || data.rate || "0",
        per_min_chat: data.per_min_chat || "0",
      },
    });
  };

  const handleCallAgain = (cType: "chat" | "audio") => {
    const token = localStorage.getItem("token");
    if (!token) { setShowLoginModal(true); return; }
    setConnectionCallType(cType);
    setShowConnectionModal(true);
  };

  return (
    <>
      <div style={{
        display: "flex", borderRadius: "16px", overflow: "hidden",
        background: "#ffffff", boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        position: "relative", minHeight: "130px",
      }}>

        {/* ── Orange left strip ── */}
        <div style={{
          width: "72px",
          background: "linear-gradient(180deg, #FF6B00 0%, #FF8C00 100%)",
          flexShrink: 0, display: "flex", alignItems: "center",
          justifyContent: "center", position: "relative",
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {isChatOrder ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.9-1.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            )}
          </div>
        </div>

        {/* ── Right content ── */}
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>

          {/* Amount — top right, unchanged */}
          <div style={{ position: "absolute", top: "77px", right: "14px", textAlign: "right" }}>
            <span style={{ fontSize: "20px", fontWeight: 700, color: isCredit ? "#16a34a" : "#e53935" }}>
              {isCredit ? "+" : "-"}₹{data.amount || "0"}
            </span>
          </div>

          {/* Order ID + Duration */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            {(data.order_id || data.id || data.transaction_id) && (
              <span style={{ fontSize: "12px", color: "#888", fontWeight: 500 }}>
                #{data.order_id || data.id || data.transaction_id}
              </span>
            )}
            {(type === "call" || type === "chat" || type === "video") && (() => {
              const d = parseInt(String(data.call_min ?? data.chat_min ?? data.call_duracation ?? data.call_duration ?? data.duration ?? "0"), 10);
              const amt = parseFloat(data?.amount ?? "0");
              const rate = parseFloat(data?.per_min_chat ?? data?.call_rate ?? data?.chat_rate ?? data?.rate ?? "1");
              const descMatch = String(data.description ?? "").match(/(\d+)\s*min/i);
              const descMins = descMatch ? parseInt(descMatch[1], 10) : 0;
              const mins = d > 0 ? d : descMins > 0 ? descMins : (rate > 0 && amt > 0) ? Math.round(amt / rate) : 0;
              return mins > 0 ? (
                <>
                  <span style={{ color: "#ccc" }}>|</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#888" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {mins} min
                  </span>
                </>
              ) : null;
            })()}
          </div>

          {/* Astro info row */}
          {!isWallet && astroName && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {astroImage ? (
                <img src={astroImage} alt={astroName}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #FF6B0022", flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : null}
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{astroName}</div>
                {data.description && (
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{data.description}</div>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          {data.created_at && (
            <div style={{ fontSize: "11px", color: "#bbb" }}>{data.created_at}</div>
          )}

          {/* Rating */}
          {ratingValue > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                  fill={i <= Math.round(ratingValue) ? "#f59e0b" : "none"}
                  stroke={i <= Math.round(ratingValue) ? "#f59e0b" : "#d1d5db"} strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span style={{ fontSize: "12px", color: "#888", marginLeft: "4px" }}>{ratingValue.toFixed(1)}</span>
            </div>
          )}

          {/* ── Action buttons row ── */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>

            {/* View Chat — for chat orders */}
            {isChatOrder && (data.fb_channel_id || data.channel_id) && (
              <button
                onClick={handleViewChat}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px", borderRadius: "30px",
                  border: "1.5px solid #FF6B00", background: "#fff",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFF3E8")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#FF6B00" }}>View Chat</span>
              </button>
            )}

            {/* Chat Again — for chat orders with astrologer */}
            {isChatOrder && astroId && (
              <button
                onClick={() => handleCallAgain("chat")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px", borderRadius: "30px",
                  border: "1.5px solid #FF6B00",
                  background: "linear-gradient(135deg,#FF6B00,#FF9800)",
                  cursor: "pointer", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Chat Again</span>
              </button>
            )}

            {/* Call Again — for call orders with astrologer */}
            {isCallOrder && astroId && (
              <button
                onClick={() => handleCallAgain("audio")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px", borderRadius: "30px",
                  border: "1.5px solid #FF6B00",
                  background: "linear-gradient(135deg,#FF6B00,#FF9800)",
                  cursor: "pointer", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.9-1.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Call Again</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />

      {/* Connection Modal for Call Again / Chat Again */}
      {showConnectionModal && astroId && (
        <ConnectionModal
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
          astrologer={{
            id: astroId,
            name: astroName,
            profileImage: astroImage,
            ratePerMinute: connectionCallType === "chat" ? effectiveChatRate : effectiveCallRate,
          }}
          userWalletBalance={walletBalance}
          callType={connectionCallType}
        />
      )}
    </>
  );
}