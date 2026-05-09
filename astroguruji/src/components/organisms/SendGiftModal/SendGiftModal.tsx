import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─── Types ─────────────────────────────────────────────────── */

export interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  astrologerName: string;
  className?: string;
}

interface Gift {
  name: string;
  price: number;
  icon: string;
}

/* ─── Gift Data ─────────────────────────────────────────────── */

const gifts: Gift[] = [
  { name: "Flowers", price: 11, icon: "/images/gifts/flowers.png" },
  { name: "Namaste", price: 20, icon: "/images/gifts/namaste.png" },
  { name: "Dakshina", price: 50, icon: "/images/gifts/dakshina.png" },
  { name: "Pooja Thali", price: 199, icon: "/images/gifts/pooja-thali.png" },
  { name: "Kalash", price: 20, icon: "/images/gifts/kalash.png" },
  { name: "Gemstone", price: 20, icon: "/images/gifts/gemstone.png" },
  { name: "Sweets", price: 20, icon: "/images/gifts/sweets.png" },
  { name: "Shivling", price: 20, icon: "/images/gifts/shivling.png" },
];

/* ─── Component ─────────────────────────────────────────────── */

export function SendGiftModal({
  isOpen,
  onClose,
  astrologerName,
  className,
}: SendGiftModalProps) {
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Animate in
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Trigger animation on next frame
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      setSelectedGift(null);
    }
  }, [isOpen]);

  // Focus trap & escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    // Focus the modal
    modalRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className ?? ""}`}
      aria-label={`Send gift to ${astrologerName}`}
      data-testid="send-gift-modal"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          visible ? "opacity-70" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="send-gift-modal-backdrop"
      />

      {/* Modal Container */}
      <dialog
        open
        ref={modalRef}
        aria-modal="true"
        tabIndex={-1}
        className={`relative w-[437px] max-w-[95vw] rounded-[10px] bg-white shadow-xl transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        data-testid="send-gift-modal-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2
            className="font-['Outfit'] text-lg font-semibold uppercase tracking-wide text-black"
            data-testid="send-gift-modal-title"
          >
            Send Gift to {astrologerName}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Close modal"
            data-testid="send-gift-modal-close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Gift Grid */}
        <div
          className="grid grid-cols-4 gap-4 px-6 py-4"
          data-testid="send-gift-grid"
        >
          {gifts.map((gift, index) => (
            <button
              key={gift.name}
              onClick={() => setSelectedGift(index)}
              className={`flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors ${
                selectedGift === index
                  ? "border-2 border-[#ff6f00] bg-orange-50"
                  : "border-2 border-transparent hover:bg-gray-50"
              }`}
              aria-pressed={selectedGift === index}
              data-testid={`gift-item-${gift.name.toLowerCase().split(/\s+/).join("-")}`}
            >
              <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border-2 border-[#ff6f00] overflow-hidden bg-gray-100">
                <img
                  src={gift.icon}
                  alt={gift.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-['Outfit'] text-xs font-semibold uppercase text-black">
                {gift.name}
              </span>
              <span className="font-['Outfit'] text-xs font-semibold text-[#34a853]">
                ₹ {gift.price}
              </span>
            </button>
          ))}
        </div>

        {/* Send Gift Button */}
        <div className="px-6 pb-5 pt-2">
          <button
            disabled={selectedGift === null}
            className="h-[41px] w-full rounded-[4px] bg-[#ff6f00] font-['Outfit'] text-[19px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="send-gift-button"
          >
            Send Gift
          </button>
        </div>
      </dialog>
    </div>,
    document.body,
  );
}

export default SendGiftModal;
