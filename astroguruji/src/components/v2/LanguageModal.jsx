import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "en",  label: "English",    short: "Eng",      googleCode: "/en/en" },
  { code: "hi",  label: "Hindi",      short: "हिंदी",    googleCode: "/en/hi" },
  { code: "kn",  label: "Kannada",    short: "ಕನ್ನಡ",   googleCode: "/en/kn" },
  { code: "ta",  label: "Tamil",      short: "தமிழ்",   googleCode: "/en/ta" },
  { code: "te",  label: "Telugu",     short: "తెలుగు",  googleCode: "/en/te" },
  { code: "mr",  label: "Marathi",    short: "मराठी",   googleCode: "/en/mr" },
  { code: "bn",  label: "Bengali",    short: "বাংলা",   googleCode: "/en/bn" },
  { code: "gu",  label: "Gujarati",   short: "ગુજરાતી", googleCode: "/en/gu" },
  { code: "ml",  label: "Malayalam",  short: "മലയാളം",  googleCode: "/en/ml" },
];

/**
 * Set the `googtrans` cookie on both the current domain and the naked domain.
 * Value format: /sourceLang/targetLang  e.g. /en/hi
 * Setting it to /en/en (or deleting it) restores English.
 */
function setGoogTransCookie(value) {
  const domain = window.location.hostname;
  const naked  = domain.replace(/^www\./, "");
  const expire = value
    ? ""
    : "; expires=Thu, 01 Jan 1970 00:00:00 UTC";

  const cookieStr = (d) =>
    `googtrans=${value}${expire}; path=/; domain=${d}`;

  document.cookie = cookieStr(domain);
  document.cookie = cookieStr(`.${naked}`);   // naked domain for sub-domain coverage
  document.cookie = `googtrans=${value}${expire}; path=/`; // fallback without domain
}

function applySaved() {
  const saved = localStorage.getItem("app_lang_google") || "";
  if (saved && saved !== "/en/en") {
    setGoogTransCookie(saved);
  }
}

// Call once at module load so the cookie is set before React hydrates
applySaved();

export default function LanguageModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(
    () => localStorage.getItem("app_lang_code") || "en"
  );

  // Keep selected in sync if modal re-opens
  useEffect(() => {
    if (isOpen) {
      setSelected(localStorage.getItem("app_lang_code") || "en");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const applyLanguage = () => {
    const lang = LANGUAGES.find((l) => l.code === selected);
    if (!lang) { onClose(); return; }

    localStorage.setItem("app_lang_code",   lang.code);
    localStorage.setItem("app_lang_google", lang.googleCode);

    if (lang.code === "en") {
      // Clear cookie → restore original English
      setGoogTransCookie("");
    } else {
      setGoogTransCookie(lang.googleCode);
    }

    // Reload so Google Translate picks up the new cookie and translates the page
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-sm bg-white rounded-2xl p-5 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-poppins text-[17px] font-semibold text-black">
            Choose Language
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`border rounded-xl p-3 text-center transition-all ${
                selected === lang.code
                  ? "border-[#FF6F00] bg-[#FFF5EE] shadow-sm"
                  : "border-gray-200 hover:border-[#FF6F00]/50"
              }`}
            >
              <div
                className={`text-sm font-semibold ${
                  selected === lang.code ? "text-[#FF6F00]" : "text-black"
                }`}
              >
                {lang.short}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {lang.label}
              </div>
              {selected === lang.code && (
                <div className="mt-1 flex justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6F00]" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current selection label */}
        <p className="text-center font-poppins text-[12px] text-gray-400 mb-3">
          Selected:{" "}
          <span className="text-[#FF6F00] font-semibold">
            {LANGUAGES.find((l) => l.code === selected)?.label}
          </span>
        </p>

        {/* Apply */}
        <button
          onClick={applyLanguage}
          className="w-full bg-[#FF6F00] hover:bg-[#e06300] text-white font-poppins font-semibold py-3 rounded-xl transition-colors"
        >
          APPLY
        </button>
      </div>
    </div>
  );
}