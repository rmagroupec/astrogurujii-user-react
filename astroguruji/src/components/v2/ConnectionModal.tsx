import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  call_initiate,
  buildKundliString,
  generateChannelId,
  geocode,
  profile_api,
} from "@/https_service";

const API_BASE = "https://admin.astrogurujii.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AstrologerShortProfile = {
  id: string;
  name: string;
  profileImage: string;
  ratePerMinute: number;
};

export type IntakeFormData = {
  name: string;
  gender: string;
  dob: string;
  timeOfBirth: string;
  placeOfBirth: string;
};

type ConnectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  astrologer: AstrologerShortProfile;
  userWalletBalance: number;
  callType: "chat" | "audio" | "video" | null;
  onSubmit?: (data: IntakeFormData, callType: "chat" | "audio" | "video") => void;
  isLoading?: boolean;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const LocationPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── PlaceField ───────────────────────────────────────────────────────────────

function PlaceField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (place: string, lat: string, lng: string) => void;
  error?: string;
}) {
  const [inputVal, setInputVal] = useState(value);
  const [, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setInputVal(value); }, [value]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch(`${API_BASE}/user_api/geocode`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ place: query }),
      });
      const data = await res.json();
      if (data?.status === true) setSuggestions([]);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 600);
  };

  const handleBlur = async () => {
    setSuggestions([]);
    if (!inputVal.trim()) return;
    setLoading(true);
    const result = await geocode(inputVal.trim());
    setLoading(false);
    const lat = result?.lat ?? "0";
    const lng = result?.lng ?? "0";
    const display = inputVal.length > 40 ? inputVal.substring(0, 40) + ".." : inputVal;
    onChange(display, lat, lng);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        Place of Birth <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <LocationPinIcon />
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={handleInput}
          onBlur={handleBlur}
          placeholder="e.g. New Delhi, India"
          autoComplete="off"
          className={`w-full rounded-xl border-2 py-3 pl-10 pr-10 text-sm outline-none transition-colors focus:bg-white ${
            error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"
          }`}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      <p className="mt-1 text-[10px] text-gray-400">Type your birth city and move to next field.</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ConnectionModal({
  isOpen,
  onClose,
  astrologer,
  userWalletBalance,
  callType,
}: ConnectionModalProps) {
  const navigate = useNavigate();
  const [step, setStep]               = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [formData, setFormData]       = useState<IntakeFormData>({ name: "", gender: "Male", dob: "", timeOfBirth: "", placeOfBirth: "" });
  const [latLng, setLatLng]           = useState({ lat: "0", lng: "0" });
  const [errors, setErrors]           = useState<Partial<Record<keyof IntakeFormData, string>>>({});

  // ✅ Live rate state — used when ratePerMinute is 0 (e.g. opened from transaction history)
  const [liveRate, setLiveRate] = useState<number>(0);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setStep(1); setErrors({}); setIsSubmitting(false); setLiveRate(0); }
  }, [isOpen]);

  // ✅ Fetch live astrologer rate when ratePerMinute is 0
  useEffect(() => {
    if (!isOpen || !astrologer.id || astrologer.ratePerMinute > 0) return;
    const token = localStorage.getItem("token") ?? "";
    fetch(`${API_BASE}/user_api/astrologer_profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: astrologer.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.status && Array.isArray(data.results) && data.results[0]) {
          const d = data.results[0];
          const r = callType === "audio"
            ? parseFloat(d.per_min_voice_call_offer || d.per_min_voice_call || "0")
            : parseFloat(d.per_min_chat_offer || d.per_min_chat || "0");
          if (r > 0) setLiveRate(r);
        }
      })
      .catch(() => {});
  }, [isOpen, astrologer.id, astrologer.ratePerMinute, callType]);

  // Pre-fill from profile API
  useEffect(() => {
    if (!isOpen || profileLoaded) return;
    profile_api().then((res) => {
      if (res?.status === true && res.results) {
        const r = res.results;
        let savedDob = "";
        if (r.dob) {
          const parts = (r.dob as string).split(/[-\/]/);
          if (parts.length === 3) {
            savedDob = parts[0].length === 4
              ? r.dob
              : `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
          }
        }
        let savedTob = "";
        if (r.tob) {
          const t = (r.tob as string).trim();
          if (/am|pm/i.test(t)) {
            const [time, period] = t.split(" ");
            const [hStr, mStr] = time.split(":");
            let h = parseInt(hStr, 10);
            if (/pm/i.test(period) && h !== 12) h += 12;
            if (/am/i.test(period) && h === 12) h = 0;
            savedTob = `${String(h).padStart(2, "0")}:${(mStr ?? "00").padStart(2, "0")}`;
          } else {
            savedTob = t.substring(0, 5);
          }
        }
        setFormData({ name: r.name ?? "", gender: r.gender ?? "Male", dob: savedDob, timeOfBirth: savedTob, placeOfBirth: r.pob ?? "" });
        if (r.pob) {
          geocode(r.pob).then((geo) => {
            if (geo) setLatLng({ lat: geo.lat, lng: geo.lng });
          });
        }
      }
      setProfileLoaded(true);
    });
  }, [isOpen, profileLoaded]);

  if (!isOpen || !callType) return null;

  // ✅ Use liveRate as fallback when ratePerMinute is 0
  const rate   = Number(astrologer.ratePerMinute) || liveRate || 0;
  const wallet = Number(userWalletBalance) || 0;

  const maxDurationMins     = rate > 0 ? Math.floor(wallet / rate) : Infinity;
  const hasSufficientBalance = rate === 0 || maxDurationMins >= 5;
  const minRequiredBalance   = rate * 5;
  const typeLabel            = callType === "chat" ? "Chat" : callType === "audio" ? "Call" : "Video";

  // ─── Validation ──────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: typeof errors = {};
    const today = new Date().toISOString().split("T")[0];
    if (!formData.name.trim() || formData.name.trim().length < 2)
      e.name = "Enter a valid name (min 2 characters)";
    if (!formData.dob)
      e.dob = "Date of Birth is required";
    else if (formData.dob > today)
      e.dob = "Date of Birth cannot be in the future";
    if (!formData.timeOfBirth) e.timeOfBirth = "Time of Birth is required";
    if (!formData.placeOfBirth.trim() || formData.placeOfBirth.trim().length < 2)
      e.placeOfBirth = "Enter a valid city name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof IntakeFormData, val: string) => {
    setFormData((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handlePlaceChange = (place: string, lat: string, lng: string) => {
    setFormData((p) => ({ ...p, placeOfBirth: place }));
    setLatLng({ lat, lng });
    if (errors.placeOfBirth) setErrors((p) => ({ ...p, placeOfBirth: undefined }));
  };

  const handleProceedClick = () => {
    if (hasSufficientBalance) setStep(2);
    else { onClose(); navigate("/recharge-now"); }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("id") ?? "";
      const [yearStr, monthStr, dayStr] = formData.dob.split("-");
      const [hhStr, mmStr]              = formData.timeOfBirth.split(":");
      const dobDisplay  = `${dayStr}-${monthStr}-${yearStr}`;
      const hhNum       = parseInt(hhStr, 10);
      const amPm        = hhNum >= 12 ? "PM" : "AM";
      const hh12        = hhNum % 12 === 0 ? 12 : hhNum % 12;
      const tobDisplay  = `${String(hh12).padStart(2, "0")}:${mmStr} ${amPm}`;

      const kundliString = buildKundliString({
        name: formData.name, gender: formData.gender,
        yy: yearStr, mm: monthStr, dd: dayStr,
        hh_time: hhStr, mm_time: mmStr,
        latitude: latLng.lat, longitude: latLng.lng,
        place: formData.placeOfBirth,
      });

      const preChannelId = generateChannelId(userId, astrologer.id);
      const res = await call_initiate({
        astrologer_id: astrologer.id,
        call_type: callType as "chat" | "audio" | "video",
        fb_channel_id: preChannelId,
        kundli: kundliString,
      });

      if (res?.status === true) {
        localStorage.setItem("name", formData.name);
        onClose();
        const sessionState = {
          astrologer_id: astrologer.id,
          astroName: astrologer.name,
          astrologerImage: astrologer.profileImage,
          rate: String(rate),
          wallet: String(wallet),
          name: formData.name, gender: formData.gender,
          dob: dobDisplay, tob: tobDisplay,
          place: formData.placeOfBirth,
          latitude: latLng.lat, longitude: latLng.lng,
          day: dayStr, month: monthStr, year: yearStr,
          hh: hhStr, mm: mmStr,
        };
        if (callType === "audio" || callType === "video") {
          navigate("/audio-call", { state: { ...sessionState, channelId: res.channel_id, apiChannelId: res.channel_id } });
        } else {
          navigate("/chat-calling", { state: { ...sessionState, _channel_id: res.channel_id } });
        }
      } else {
        alert(res?.message ?? "Failed to initiate. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl" style={{ maxHeight: "92vh", overflowY: "auto" }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {step === 1 ? "Astrologer & Payment Details" : "Birth Details"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="px-5 py-4">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">

              {/* Astrologer info */}
              <div className="flex flex-col items-center gap-2 py-2">
                <img
                  src={astrologer.profileImage}
                  alt={astrologer.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=FF6F00&color=fff`;
                  }}
                />
                <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {astrologer.name}
                </h3>
                <p className="text-sm text-[#FF6F00] font-semibold">
                  {typeLabel} Rate: ₹{rate}/min
                  {/* Show loading indicator while fetching live rate */}
                  {astrologer.ratePerMinute === 0 && liveRate === 0 && (
                    <span className="ml-2 inline-block w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin align-middle" />
                  )}
                </p>
              </div>

              {/* Wallet & Duration */}
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <WalletIcon />
                    <span className="text-sm font-semibold text-gray-600">Wallet Balance</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">₹{wallet}</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon />
                    <span className="text-sm font-semibold text-gray-600">Max Duration</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {/* ✅ Show actual minutes when rate > 0, ∞ only when truly free */}
                    {rate > 0
                      ? `${maxDurationMins} min`
                      : astrologer.ratePerMinute === 0 && liveRate === 0
                        ? <span className="flex items-center gap-1 text-base text-gray-400">Fetching... <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /></span>
                        : "∞ min"
                    }
                  </span>
                </div>
              </div>

              {/* Low balance warning */}
              {!hasSufficientBalance && (
                <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-lg text-center">
                  Minimum balance of 5 minutes (₹{minRequiredBalance.toFixed(0)}) is required to start a {typeLabel.toLowerCase()} with {astrologer.name}.
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleProceedClick}
                className="w-full rounded-full bg-[#FF6F00] py-4 text-[16px] font-bold text-white shadow-[0_4px_14px_0_rgba(255,111,0,0.39)] transition-all hover:bg-[#E66400] hover:shadow-lg"
              >
                {hasSufficientBalance ? "Proceed to Intake Form" : "Recharge Wallet"}
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors focus:bg-white ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Gender</label>
                  <div className="flex gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g} type="button"
                        onClick={() => handleChange("gender", g)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${formData.gender === g ? "border-[#FF6F00] bg-orange-50 text-[#FF6F00]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DOB + TOB */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Date of Birth <span className="text-red-400">*</span></label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors focus:bg-white ${errors.dob ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"}`}
                    />
                    {errors.dob && <p className="mt-1 text-xs text-red-500 font-medium">{errors.dob}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Time of Birth <span className="text-red-400">*</span></label>
                    <input
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={(e) => handleChange("timeOfBirth", e.target.value)}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors focus:bg-white ${errors.timeOfBirth ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"}`}
                    />
                    {errors.timeOfBirth && <p className="mt-1 text-xs text-red-500 font-medium">{errors.timeOfBirth}</p>}
                  </div>
                </div>

                {/* Place of Birth */}
                <PlaceField value={formData.placeOfBirth} onChange={handlePlaceChange} error={errors.placeOfBirth} />

                {/* Submit */}
                <div className="pt-1 pb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-[#FF6F00] py-4 text-[16px] font-bold text-white shadow-[0_4px_14px_0_rgba(255,111,0,0.39)] transition-all hover:bg-[#E66400] hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Connecting...</>
                    ) : (
                      `Start ${typeLabel} with ${astrologer.name}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}