import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AstrologerShortProfile = {
  id: string;
  name: string;
  profileImage: string;
  ratePerMinute: number; // ₹/min
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
  callType: "chat" | "audio" | null;
  onSubmit: (data: IntakeFormData, callType: "chat" | "audio") => void;
  isLoading?: boolean;
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export default function ConnectionModal({
  isOpen,
  onClose,
  astrologer,
  userWalletBalance,
  callType,
  onSubmit,
  isLoading = false,
}: ConnectionModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [formData, setFormData] = useState<IntakeFormData>({
    name: "",
    gender: "Male",
    dob: "",
    timeOfBirth: "",
    placeOfBirth: "",
  });
  const [errors, setErrors] = useState<Partial<IntakeFormData>>({});

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen || !callType) return null;

  // ─── Calculations (Matches Flutter logic) ───
  const maxDurationMins = Math.floor(userWalletBalance / astrologer.ratePerMinute);
  const minRequiredMins = 5;
  const minRequiredBalance = astrologer.ratePerMinute * minRequiredMins;
  const hasSufficientBalance = maxDurationMins >= minRequiredMins;
  const typeLabel = callType === "chat" ? "Chat" : "Audio Call";

  // ─── Validation Logic ───
  const validateForm = () => {
    const newErrors: Partial<IntakeFormData> = {};
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = "Enter a valid full name (min 3 chars)";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else if (formData.dob > today) {
      newErrors.dob = "Date of Birth cannot be in the future";
    }
    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = "Time of Birth is required";
    }
    if (!formData.placeOfBirth.trim() || formData.placeOfBirth.trim().length < 3) {
      newErrors.placeOfBirth = "Enter a valid city/place (min 3 chars)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedClick = () => {
    if (hasSufficientBalance) {
      setStep(2); // Go to Intake Form
    } else {
      onClose();
      navigate("/recharge"); // Navigate to Wallet Recharge Page
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, callType);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof IntakeFormData]) {
      setErrors({ ...errors, [e.target.name]: undefined }); // Clear error on typing
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4 transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Container - Bottom sheet on mobile, rounded card on desktop */}
      <div className="relative w-full max-w-[480px] bg-white rounded-t-[24px] sm:rounded-[24px] p-6 animate-slideUp shadow-2xl max-h-[95vh] overflow-y-auto scrollbar-hide">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <CloseIcon />
        </button>

        {/* ================================================================= */}
        {/* STEP 1: PAYMENT & DURATION CONFIRMATION                           */}
        {/* ================================================================= */}
        {step === 1 && (
          <div className="flex flex-col items-center pt-2">
            <h2 className="text-xl font-bold text-gray-900 font-poppins mb-6">
              Astrologer & Payment Details
            </h2>

            {/* Profile Info */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={astrologer.profileImage}
                alt={astrologer.name}
                className="w-24 h-24 rounded-full border-4 border-[#FFF5EC] object-cover mb-3 shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/v2/consultant-1.png'; }}
              />
              <h3 className="text-2xl font-bold text-gray-900 font-poppins">{astrologer.name}</h3>
              <p className="text-[#FF6F00] font-semibold mt-1">
                {typeLabel} Rate: ₹{astrologer.ratePerMinute}/min
              </p>
            </div>

            {/* Wallet & Duration Cards */}
            <div className="w-full grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <WalletIcon />
                  <span className="text-sm font-semibold text-gray-600">Wallet Balance</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">₹{userWalletBalance}</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon />
                  <span className="text-sm font-semibold text-gray-600">Max Duration</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{maxDurationMins} mins</span>
              </div>
            </div>

            {/* Warning Message if Balance is Low */}
            {!hasSufficientBalance && (
              <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-lg mb-6 text-center">
                Minimum balance of 5 minutes (₹{minRequiredBalance}) is required to start a {typeLabel.toLowerCase()} with {astrologer.name}.
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleProceedClick}
              className="w-full rounded-full bg-[#FF6F00] py-4 text-[16px] font-bold text-white shadow-[0_4px_14px_0_rgba(255,111,0,0.39)] transition-all hover:bg-[#E66400] hover:shadow-lg"
            >
              {hasSufficientBalance ? "Proceed to Intake Form" : "Recharge Wallet"}
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: INTAKE FORM (KUNDLI DETAILS)                              */}
        {/* ================================================================= */}
        {step === 2 && (
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setStep(1)} 
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-poppins">Intake Details</h2>
                <p className="text-sm text-gray-500 font-euclid">Fill birth details for accurate predictions.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors focus:bg-white ${
                    errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              {/* Gender Selection */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Gender</label>
                <div className="flex gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-all ${
                        formData.gender === g
                          ? "border-[#FF6F00] bg-[#FFF5EC] text-[#FF6F00]"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-[#FF6F00]/40"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Birth & Time of Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 px-3 py-3 text-sm outline-none transition-colors focus:bg-white ${
                      errors.dob ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"
                    }`}
                  />
                  {errors.dob && <p className="mt-1 text-xs text-red-500 font-medium">{errors.dob}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Time of Birth</label>
                  <input
                    type="time"
                    name="timeOfBirth"
                    value={formData.timeOfBirth}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 px-3 py-3 text-sm outline-none transition-colors focus:bg-white ${
                      errors.timeOfBirth ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"
                    }`}
                  />
                  {errors.timeOfBirth && <p className="mt-1 text-xs text-red-500 font-medium">{errors.timeOfBirth}</p>}
                </div>
              </div>

              {/* Place of Birth */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Place of Birth</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </span>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    placeholder="City, State, Country"
                    className={`w-full rounded-xl border-2 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:bg-white ${
                      errors.placeOfBirth ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-[#FF6F00]"
                    }`}
                  />
                </div>
                {errors.placeOfBirth && <p className="mt-1 text-xs text-red-500 font-medium">{errors.placeOfBirth}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-[#FF6F00] py-4 text-[16px] font-bold text-white shadow-[0_4px_14px_0_rgba(255,111,0,0.39)] transition-all hover:bg-[#E66400] hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Connecting...
                    </span>
                  ) : (
                    `Start ${typeLabel}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}