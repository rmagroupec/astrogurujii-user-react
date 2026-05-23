/**
 * OrderTransactionCard.tsx
 * Matches the reference design: orange left strip with chat bubble,
 * astro profile, zodiac wheel background, price top-right, View Chat button.
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
  const ratingValue = Number(data.rating || 0);
  const astroImage = data.astro_profile_img || data.astro_image;
  const astroName = data.astro_display_name || data.astro_name || "–";

  const handleViewChat = () => {
    navigate("/chat-view-only", {
      state: {
        gid: data.fb_channel_id,
        fbchannelID: data.channel_id,
        astrologer_id: data.astr_id || data.astro_id || data.astrologer_id,
        astroName,
        astrologerImage: astroImage,
        userName: data.user_name || localStorage.getItem("name") || "You",
        rating: data.rating,
        review: data.review,
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
        {/* Chat bubble circle */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="11" r="1" fill="#fff" stroke="none"/>
            <circle cx="12" cy="11" r="1" fill="#fff" stroke="none"/>
            <circle cx="15" cy="11" r="1" fill="#fff" stroke="none"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "14px 16px", position: "relative", overflow: "hidden" }}>

        {/* Zodiac wheel background */}
        <div style={{ position: "absolute", right: "-20px", top: "-20px", opacity: 0.12, pointerEvents: "none" }}>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="#FF6B00" strokeWidth="1"/>
            <circle cx="100" cy="100" r="65" stroke="#FF6B00" strokeWidth="1"/>
            <circle cx="100" cy="100" r="40" stroke="#FF6B00" strokeWidth="1"/>
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 100 + 40 * Math.cos(angle);
              const y1 = 100 + 40 * Math.sin(angle);
              const x2 = 100 + 90 * Math.cos(angle);
              const y2 = 100 + 90 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF6B00" strokeWidth="0.8"/>;
            })}
            {/* Stars */}
            <circle cx="60" cy="40" r="2" fill="#FF6B00"/>
            <circle cx="150" cy="60" r="1.5" fill="#FF6B00"/>
            <circle cx="40" cy="130" r="1.5" fill="#FF6B00"/>
            <circle cx="170" cy="140" r="2" fill="#FF6B00"/>
            <circle cx="120" cy="30" r="1" fill="#FF6B00"/>
          </svg>
        </div>

        {/* Dots decoration */}
        <div style={{ position: "absolute", bottom: "16px", right: "120px", opacity: 0.2, pointerEvents: "none" }}>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: "#FF6B00", margin: "2px" }} />
          ))}
        </div>

        {/* Top row: badge + order ID | Price */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "#FFF3E8",
                border: "1px solid #FFD4A8",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FF6B00", textTransform: "capitalize" as const }}>
                {badgeLabel}
              </span>
            </div>

            {/* Divider */}
            <span style={{ color: "#ddd", fontSize: "16px" }}>|</span>

            {/* Order ID */}
            <span style={{ fontSize: "13px", color: "#888" }}>#{data.order_id || "–"}</span>
          </div>

          {/* Price top right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#888" }}>Price</span>
            <span style={{ color: "#ddd", fontSize: "16px" }}>|</span>
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#FF6B00" }}>
              ₹{data.amount}
            </span>
          </div>
        </div>

        {/* Astro row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          {/* Avatar with online dot */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                border: "2px solid #FF6B00",
                overflow: "hidden",
                background: "#f5f5f5",
              }}
            >
              {astroImage ? (
                <img src={astroImage} alt={astroName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
          </div>

          {/* Name + date + duration */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a" }}>{astroName}</span>
              {/* Verified badge */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B00">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Date */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={{ fontSize: "12px", color: "#888" }}>{data.transaction_date}</span>
              </div>

              {data.time && (
                <>
                  <span style={{ color: "#ddd" }}>|</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{ fontSize: "12px", color: "#888" }}>{data.time} min</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        {ratingValue > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "12px" }}>
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(ratingValue) ? "#f59e0b" : "none"} stroke={i < Math.round(ratingValue) ? "#f59e0b" : "#d1d5db"} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span style={{ fontSize: "12px", color: "#888", marginLeft: "4px" }}>{ratingValue.toFixed(1)}</span>
          </div>
        )}

        {/* View Chat button */}
        {isChatOrder && (data.fb_channel_id || data.channel_id) && (
          <button
            onClick={handleViewChat}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "30px",
              border: "1.5px solid #FF6B00",
              background: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FFF3E8")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#FF6B00" }}>View Chat</span>
            {/* Arrow circle */}
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}