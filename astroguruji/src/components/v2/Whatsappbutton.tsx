/**
 * WhatsAppButton.tsx
 *
 * Fixed floating WhatsApp button — hidden on chat, call, and live pages.
 */

import { useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = "918881110523";
const WHATSAPP_MESSAGE = "Hello! I need help with Astrogurujii.";

// Routes where the button should NOT appear
const HIDDEN_ROUTES = [
  "/chat-with-astrologer",
  "/call-with-astrologer",
  "/live-astrologer",
  "/chat",
  "/audio-call",
  "/chat-calling",
  "/live",
];

export default function WhatsAppButton() {
  const { pathname } = useLocation();

  // Hide on exact matches or prefix matches (e.g. /live/someId)
  const isHidden = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isHidden) return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-[56px] h-[56px] rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30" fill="white">
        <path d="M4.868 43.303l2.694-9.835a18.953 18.953 0 01-2.54-9.538C5.026 13.514 13.517 5 24 5c10.481 0 18.974 8.514 18.974 19.002S34.481 43 24 43a18.94 18.94 0 01-9.103-2.324L4.868 43.303zm10.447-6.023l.58.344A15.724 15.724 0 0024 40c8.697 0 15.762-7.077 15.762-15.998S32.697 8 24 8 8.238 15.077 8.238 24c0 2.91.812 5.733 2.348 8.179l.365.582-1.545 5.643 5.909-1.124z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M19.268 15.071c-.369-.82-.757-.836-1.108-.851-.287-.013-.615-.012-.943-.012s-.86.123-1.311.615c-.451.492-1.721 1.681-1.721 4.099 0 2.418 1.762 4.754 2.008 5.083.247.328 3.409 5.44 8.394 7.408 4.152 1.638 4.986 1.313 5.887 1.23.9-.082 2.908-1.189 3.318-2.337.41-1.148.41-2.132.287-2.337-.123-.205-.451-.328-.943-.574-.492-.246-2.908-1.435-3.359-1.599-.451-.164-.779-.246-1.106.247-.328.492-1.27 1.599-1.557 1.927-.287.328-.574.369-1.066.123-.492-.246-2.077-.766-3.955-2.44-1.462-1.305-2.449-2.916-2.736-3.408-.287-.492-.031-.758.215-1.003.221-.22.492-.574.738-.861.246-.287.328-.492.492-.82.164-.328.082-.615-.041-.861-.123-.247-1.076-2.654-1.493-3.629z" />
      </svg>

      <span
        className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{ backgroundColor: "#25D366" }}
      />
    </a>
  );
}