import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "astroguruji_promo_dismissed";
const SHOW_DELAY_MS = 4000; // show after 4 seconds
const COOLDOWN_HOURS = 24; // don't show again for 24 hours

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show if user is logged in
    const token = localStorage.getItem("token");
    const isSkip = localStorage.getItem("is_skip");
    if (token && isSkip !== "Y") return;

    // Don't show if dismissed recently
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const hoursSince = (Date.now() - dismissedAt) / 1000 / 60 / 60;
      if (hoursSince < COOLDOWN_HOURS) return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setAnimating(true), 10);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }, 300);
  };

  const handleCTA = (path: string) => {
    dismiss();
    // Trigger login modal first if not logged in
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new CustomEvent("open-login-modal"));
    } else {
      navigate(path);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px]"
        style={{
          opacity: animating ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        onClick={dismiss}
      />

      {/* Popup card */}
      <div
        className="fixed z-[201] bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[420px] md:w-full"
        style={{
          transform: animating
            ? window.innerWidth >= 768
              ? "translate(-50%, -50%) scale(1)"
              : "translateY(0)"
            : window.innerWidth >= 768
              ? "translate(-50%, -50%) scale(0.92)"
              : "translateY(100%)",
          opacity: animating ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        }}
      >
        <div className="bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl w-full">

          {/* Top gradient banner */}
          <div
            className="relative px-6 pt-8 pb-6 text-white text-center"
            style={{
              background: "linear-gradient(135deg, #FF6F00 0%, #FF9A3C 50%, #FFB347 100%)",
            }}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Stars + moon decorative */}
            <div className="absolute top-4 left-5 opacity-30 text-xl select-none">✨</div>
            <div className="absolute top-8 left-12 opacity-20 text-sm select-none">⭐</div>
            <div className="absolute top-6 right-14 opacity-25 text-lg select-none">🌙</div>

            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-3 text-3xl">
              🔮
            </div>

            <h2 className="font-poppins font-bold text-[22px] leading-tight mb-1">
              Get <span className="text-yellow-200">First Chat FREE!</span>
            </h2>
            <p className="font-poppins text-[13px] text-white/90 leading-snug">
              Talk to India's top astrologers<br />and get cosmic clarity today
            </p>
          </div>

          {/* Offer pills */}
          <div className="flex gap-2 px-5 py-4 justify-center bg-[#FFF7F0]">
            {[
              { emoji: "💬", text: "Free 5-min Chat" },
              { emoji: "⭐", text: "5000+ Experts" },
              { emoji: "🔒", text: "100% Private" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex flex-col items-center gap-1 flex-1 bg-white rounded-xl px-2 py-2.5 shadow-sm border border-[#FFE8D6]"
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="font-poppins text-[10px] font-semibold text-gray-600 text-center leading-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Body content */}
          <div className="px-5 pt-2 pb-5">

            {/* Urgency timer strip */}
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
              <span className="text-red-500 text-lg">⏰</span>
              <div>
                <p className="font-poppins text-[11px] text-red-500 font-bold uppercase tracking-wide">
                  Limited Time Offer
                </p>
                <p className="font-poppins text-[12px] text-gray-600">
                  New users get <strong className="text-red-500">₹50 FREE</strong> wallet credit on signup
                </p>
              </div>
            </div>

            {/* Active users strip */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {["🧑", "👩", "👨", "🧕"].map((a, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs"
                  >
                    {a}
                  </div>
                ))}
              </div>
              <p className="font-poppins text-[12px] text-gray-500">
                <span className="font-bold text-gray-800">2,341 people</span> consulted today
              </p>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-poppins text-[11px] text-green-600 font-semibold">Live</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <button
              onClick={() => handleCTA("/chat-with-astrologer")}
              className="w-full py-3.5 rounded-2xl font-poppins font-bold text-[15px] text-white mb-2.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, #FF6F00, #FF9A3C)",
                boxShadow: "0 6px 20px rgba(255,111,0,0.35)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat with Astrologer — FREE
            </button>

            <button
              onClick={() => handleCTA("/call-with-astrologer")}
              className="w-full py-3 rounded-2xl font-poppins font-semibold text-[14px] text-[#FF6F00] border-2 border-[#FF6F00] flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-[0.98] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Talk on Call Instead
            </button>

            {/* Skip link */}
            <button
              onClick={dismiss}
              className="w-full mt-2 font-poppins text-[12px] text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              No thanks, I'll explore later
            </button>
          </div>

        </div>
      </div>
    </>
  );
}