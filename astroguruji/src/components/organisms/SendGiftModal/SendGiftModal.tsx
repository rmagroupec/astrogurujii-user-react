import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ConnectionModal from "@/components/v2/ConnectionModal";

const API = "https://admin.astrogurujii.com";
const tok = () => localStorage.getItem("token") ?? "";

export interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  astrologerName: string;
  astrologerId: string;
  astrologerImage?: string;
  chatRate?: number;
  callRate?: number;
  className?: string;
}

interface Gift {
  _id: string;
  title: string;
  image: string;
  price: number;
  status?: string;
}

const STATIC_GIFTS: Gift[] = [
  { _id: "1", title: "Flowers",     price: 11,  image: "/images/gifts/flowers.png" },
  { _id: "2", title: "Namaste",     price: 20,  image: "/images/gifts/namaste.png" },
  { _id: "3", title: "Dakshina",    price: 50,  image: "/images/gifts/dakshina.png" },
  { _id: "4", title: "Pooja Thali", price: 199, image: "/images/gifts/pooja-thali.png" },
  { _id: "5", title: "Kalash",      price: 20,  image: "/images/gifts/kalash.png" },
  { _id: "6", title: "Gemstone",    price: 20,  image: "/images/gifts/gemstone.png" },
  { _id: "7", title: "Sweets",      price: 20,  image: "/images/gifts/sweets.png" },
  { _id: "8", title: "Shivling",    price: 20,  image: "/images/gifts/shivling.png" },
];

// ─── Success Popup ────────────────────────────────────────────────────────────
function SuccessPopup({
  gift,
  astrologerName,
  astrologerId,
  astrologerImage,
  chatRate,
  callRate,
  onClose,
}: {
  gift: Gift;
  astrologerName: string;
  astrologerId: string;
  astrologerImage?: string;
  chatRate?: number;
  callRate?: number;
  onClose: () => void;
}) {
  const [showConnection, setShowConnection] = useState(false);
  const [callType, setCallType]             = useState<"chat" | "audio">("chat");
  const [walletBalance, setWalletBalance]   = useState(0);

  useEffect(() => {
    // Fetch wallet for ConnectionModal
    axios.get(`${API}/user_api/get_profile`, {
      headers: { Authorization: `Bearer ${tok()}` },
    }).then((res) => {
      const raw = res.data?.results?.wallet ?? res.data?.results?.balance ?? "0";
      setWalletBalance(parseFloat(String(raw)) || 0);
    }).catch(() => {});
  }, []);

  const handleAction = (type: "chat" | "audio") => {
    setCallType(type);
    setShowConnection(true);
  };

  if (showConnection) {
    return (
      <ConnectionModal
        isOpen={true}
        onClose={() => { setShowConnection(false); onClose(); }}
        astrologer={{
          id: astrologerId,
          name: astrologerName,
          profileImage: astrologerImage || "",
          ratePerMinute: callType === "chat" ? (chatRate || 0) : (callRate || 0),
        }}
        userWalletBalance={walletBalance}
        callType={callType}
      />
    );
  }

  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.55)", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "28px 24px",
        maxWidth: 340, width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        animation: "pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Orange checkmark */}
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg,#FF6F00,#FF9800)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
          boxShadow: "0 8px 24px rgba(255,111,0,0.4)",
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Gift image */}
        {gift.image && (
          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            border: "2px solid #FFDDC4", background: "#FFF5EE",
            overflow: "hidden", margin: "0 auto 12px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src={gift.image} alt={gift.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        <p style={{ fontWeight: 800, fontSize: 20, color: "#111", margin: "0 0 6px" }}>
          Gift Sent! 🎉
        </p>
        <p style={{ fontSize: 14, color: "#555", margin: "0 0 4px" }}>
          You sent <strong style={{ color: "#FF6F00" }}>{gift.title}</strong>
        </p>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 22px" }}>
          to {astrologerName}
        </p>

        {/* Chat Now / Call Now */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => handleAction("chat")}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "1.5px solid #FF6F00", background: "#fff",
              color: "#FF6F00", fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FFF3E8")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat Now
          </button>
          <button
            onClick={() => handleAction("audio")}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "none", background: "linear-gradient(135deg,#FF6F00,#FF9800)",
              color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
              boxShadow: "0 4px 12px rgba(255,111,0,0.35)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.9-1.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", color: "#9ca3af",
            fontSize: 13, cursor: "pointer", padding: "4px 0",
          }}
        >
          Maybe later
        </button>
      </div>

      <style>{`
        @keyframes pop-in {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function SendGiftModal({
  isOpen,
  onClose,
  astrologerName,
  astrologerId,
  astrologerImage,
  chatRate,
  callRate,
}: SendGiftModalProps) {
  const [sel, setSel]           = useState<number | null>(null);
  const [gifts, setGifts]       = useState<Gift[]>(STATIC_GIFTS);
  const [sending, setSending]   = useState(false);
  const [sentGift, setSentGift] = useState<Gift | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSel(null);
    setSending(false);
    setSentGift(null);

    axios.get(`${API}/user_api/get_gifts`, {
      headers: { Authorization: `Bearer ${tok()}` },
    })
      .then((res) => {
        console.log("[GetGifts] raw:", JSON.stringify(res.data));
        const raw: Gift[] = res.data?.data || [];
        if (Array.isArray(raw) && raw.length > 0) setGifts(raw);
      })
      .catch((err) => console.warn("[GetGifts] failed, static fallback:", err.message));
  }, [isOpen]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSend = async () => {
    if (sel === null || sending) return;
    const gift = gifts[sel];
    setSending(true);
    try {
      const res = await axios.post(
        `${API}/user_api/gift_transaction`,
        { astro_id: astrologerId, gift_id: gift._id, amount: gift.price },
        { headers: { Authorization: `Bearer ${tok()}` } }
      );
      console.log("[SendGift] response:", res.data);
    } catch (err: any) {
      console.error("[SendGift] error:", err?.response?.data || err.message);
    } finally {
      setSending(false);
      setSentGift(gift); // show success popup
    }
  };

  if (sentGift) {
    return (
      <SuccessPopup
        gift={sentGift}
        astrologerName={astrologerName}
        astrologerId={astrologerId}
        astrologerImage={astrologerImage}
        chatRate={chatRate}
        callRate={callRate}
        onClose={() => { setSentGift(null); onClose(); }}
      />
    );
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)", padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}>

        {/* Header — matches screenshot exactly */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid #f3f4f6",
        }}>
          <h2 style={{
            fontWeight: 700, fontSize: 16, color: "#111",
            textTransform: "uppercase", letterSpacing: "0.04em", margin: 0,
          }}>
            Send Gift to {astrologerName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", fontSize: 20, lineHeight: 1, padding: 4,
            }}
          >×</button>
        </div>

        {/* Gift Grid — 4 cols, big circles like screenshot */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, padding: "20px 24px",
        }}>
          {gifts.map((g, i) => (
            <button
              key={g._id}
              onClick={() => setSel(i)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, padding: "12px 6px", borderRadius: 12, cursor: "pointer",
                border: `2px solid ${sel === i ? "#FF6F00" : "transparent"}`,
                background: sel === i ? "#FFF5EE" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {/* Big circle image — matches screenshot */}
              <div style={{
                width: 76, height: 76, borderRadius: "50%",
                border: `2px solid ${sel === i ? "#FF6F00" : "#e5e7eb"}`,
                overflow: "hidden", background: "#f9fafb",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {g.image
                  ? <img
                      src={g.image} alt={g.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  : <span style={{ fontSize: 28 }}>🎁</span>
                }
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#111",
                textAlign: "center", textTransform: "uppercase", letterSpacing: "0.03em",
                lineHeight: 1.2,
              }}>
                {g.title}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#34a853" }}>
                ₹ {g.price}
              </span>
            </button>
          ))}
        </div>

        {/* Send Button — full width orange, matches screenshot */}
        <div style={{ padding: "4px 24px 24px" }}>
          <button
            onClick={handleSend}
            disabled={sel === null || sending}
            style={{
              width: "100%", padding: "15px 0",
              borderRadius: 8, border: "none",
              background: sel !== null
                ? "linear-gradient(135deg, #FF6F00, #FF9800)"
                : "#f3f4f6",
              color: sel !== null ? "#fff" : "#9ca3af",
              fontWeight: 700, fontSize: 17,
              cursor: sel !== null ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: sel !== null ? "0 4px 14px rgba(255,111,0,0.4)" : "none",
              transition: "all 0.2s",
            }}
          >
            {sending && (
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.35)",
                borderTopColor: "#fff", display: "inline-block",
                animation: "gift-spin 0.7s linear infinite",
              }} />
            )}
            {sel !== null
              ? `Send ${gifts[sel].title} · ₹${gifts[sel].price}`
              : "Send Gift"
            }
          </button>
        </div>
      </div>

      <style>{`@keyframes gift-spin { to { transform: rotate(360deg); } }`}</style>
    </div>,
    document.body
  );
}

export default SendGiftModal;