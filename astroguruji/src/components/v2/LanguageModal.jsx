import { useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English", short: "Eng" },
  { code: "hi", label: "Hindi", short: "हिंदी" },
  { code: "kn", label: "Kannada", short: "ಕನ್ನಡ" },
  { code: "ta", label: "Tamil", short: "தமிழ்" },
  { code: "te", label: "Telugu", short: "తెలుగు" },
];

export default function LanguageModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState("en");

  if (!isOpen) return null;

  const applyLanguage = () => {
    console.log("Selected Language:", selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      
      <div className="w-[90%] max-w-sm bg-white rounded-2xl p-5">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Choose Language</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`border rounded-xl p-3 text-center transition-all
                ${
                  selected === lang.code
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-300"
                }
              `}
            >
              <div className="text-sm font-medium">{lang.short}</div>
              <div className="text-xs text-gray-600">{lang.label}</div>
            </button>
          ))}
        </div>

        {/* Apply Button */}
        <button
          onClick={applyLanguage}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl"
        >
          APPLY
        </button>
      </div>
    </div>
  );
}