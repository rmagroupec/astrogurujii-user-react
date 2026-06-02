/**
 * OrderTransactionCard.tsx — Fixed
 *
 * Passes ALL required fields to /chat-view-only:
 *   gid            = fb_channel_id  (Firebase group path key)
 *   fbchannelID    = channel_id     (used for rating API call)
 *   rate           = per_min_chat   (for "Chat Again" ConnectionModal)
 */

import { useNavigate } from "react-router-dom";

export default function TransactionCard({ data, type }: { data: any; type?: string }) {
  const navigate = useNavigate();

  const isCredit = data.amount_type === "Credit";
  const isChatOrder =
    type === "chat" ||
    data.call_type === "chat" ||
    data.type === "chat" ||
    data.description === "chat";

  const badgeLabel = type || data.type || data.call_type || data.description || "order";
  const isCallOrder = type === "call"; const ratingValue = Number(data.rating || 0);
  const astroImage = data.astro_profile_img || data.astro_image || "";
  const isWallet = type === "wallet" || type === "other" || (!data.astro_profile_img && !data.astro_image && !data.astro_name && !data.astro_display_name);
  const astroName = data.astro_display_name || data.astro_name || data.description || data.amount_type_for || ""; const handleViewChat = () => {
    navigate("/chat-view-only", {
      state: {
        // Firebase group key — this is what gid must be in ChatViewOnlyScreen
        gid: data.fb_channel_id,
        // API channel_id — used for rating submission
        fbchannelID: data.channel_id || data.fb_channel_id,
        astrologer_id: data.astr_id || data.astro_id || data.astrologer_id,
        astroName,
        astrologerImage: astroImage,
        userName: data.user_name || localStorage.getItem("name") || "You",
        // Rating already given (0 = none, >0 = already rated)
        rating: data.rating || 0,
        review: data.review || "",
        // Rate for "Chat Again" button
        rate: data.per_min_chat || data.rate || "0",
        per_min_chat: data.per_min_chat || "0",
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        position: "relative",
        minHeight: "130px",
      }}
    >
      {/* Orange left strip */}
      <div
        style={{
          width: "72px",
          background: "linear-gradient(180deg, #FF6B00 0%, #FF8C00 100%)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
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

      {/* Right content */}
      <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>

        {/* Price top-right */}
        <div style={{ position: "absolute", top: "12px", right: "14px", textAlign: "right" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: isCredit ? "#16a34a" : "#e53935" }}>
            {isCredit ? "+" : "-"}₹{data.amount || "0"}
          </span>
        </div>

        {/* Astro info */}
        {/* Order ID + Duration row */}
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
                <span style={{ color: "#ddd" }}>|</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span style={{ fontSize: "12px", color: "#aaa" }}>{mins} min</span>
                </div>
              </>
            ) : null;
          })()}
        </div>

        {/* Astro info */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {astroImage ? (
            <img src={astroImage} alt={astroName}
              style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid #FF6B00", flexShrink: 0 }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          ) : isWallet ? (
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#FF6B0015", border: "2px solid #FF6B00", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                <path d="M16 3H8a2 2 0 0 0-2 2v2" /><circle cx="17" cy="13" r="1" />
              </svg>
            </div>
          ) : (
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#FF6B0020", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B00", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
              {astroName?.[0] || "?"}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            {astroName && (
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
                {astroName}
              </p>
            )}
            <p style={{ fontSize: "11px", color: "#888", marginTop: "1px", textTransform: "capitalize" }}>
              {data.description || data.amount_type_for || badgeLabel}
            </p>
          </div>
        </div>

        {/* Date */}
        {data.created_at && (
          <p style={{ fontSize: "11px", color: "#aaa" }}>
            {new Date(data.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        )}

        {/* Stars */}
        {ratingValue > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 24 24"
                fill={i <= Math.round(ratingValue) ? "#f59e0b" : "none"}
                stroke={i <= Math.round(ratingValue) ? "#f59e0b" : "#d1d5db"}
                strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span style={{ fontSize: "12px", color: "#888", marginLeft: "4px" }}>{ratingValue.toFixed(1)}</span>
          </div>
        )}

        {/* View Chat button — only for chat orders with a firebase channel */}
        {(isChatOrder && (data.fb_channel_id || data.channel_id)) && (
          <button
            onClick={handleViewChat}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "10px 20px", borderRadius: "30px",
              border: "1.5px solid #FF6B00", background: "#fff",
              cursor: "pointer", transition: "background 0.15s",
              marginTop: "4px", alignSelf: "flex-start",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FFF3E8")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#FF6B00" }}>View Chat</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </button>
        )}

        {/* {(type === "call" && (data.order_id || data.channel_id)) && (
          <button
            onClick={() => navigate("/call-history-detail", { state: { orderId: data.order_id ?? data.id, data } })}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "10px 20px", borderRadius: "30px",
              border: "1.5px solid #FF6B00", background: "#fff",
              cursor: "pointer", transition: "background 0.15s",
              marginTop: "4px", alignSelf: "flex-start",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FFF3E8")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.9-1.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#FF6B00" }}>View Call</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </button>
        )} */}
      </div>
    </div>
  );
}