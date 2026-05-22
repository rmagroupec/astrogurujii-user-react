import { useState, useEffect, useRef } from "react";

const API_BASE_URL = "https://admin.astrogurujii.com";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [dialCode] = useState("91");
  // 1. Updated state to hold exactly 4 digits
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset all state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("mobile");
      setMobile("");
      setOtp(["", "", "", ""]); // Reset to 4
      setError("");
      setTimer(59);
    }
  }, [isOpen]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  const validateMobile = (value) => {
    const pattern = /^(?:[+0]9)?[0-9]{8,14}$/;
    if (!value) { setError("Please enter mobile number"); return false; }
    if (!pattern.test(value)) { setError("Please enter a valid mobile number"); return false; }
    return true;
  };

  const sendOtp = async () => {
    setError("");
    if (!validateMobile(mobile)) return;
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user_api/user_login_new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          number: mobile,
          country_code: dialCode,
          country: "INR",
          otp: "",
          type: "",
        }),
      });
      const data = await res.json();
      if (data.status === true) {
        setStep("otp");
        setTimer(59);
        setOtp(["", "", "", ""]); // Reset to 4
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(data.message ?? "Failed to send OTP");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/user_api/user_login_new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          number: mobile,
          country_code: dialCode,
          country: "INR",
          otp: "",
          type: "",
        }),
      });
      setTimer(59);
      setOtp(["", "", "", ""]); // Reset to 4
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend OTP.");
    }
  };

  const verifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) { setError("Please enter the complete 4-digit OTP"); return; }
    setError("");
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user_api/user_login_new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          number: mobile,
          country_code: dialCode,
          country: "INR",
          otp: finalOtp,
          type: "",
          // 
        }),
      });
      const data = await res.json();
      if (data.status === true) {
        const result = data.results;
        localStorage.setItem("is_skip", "N");
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", result.name ?? "");
        localStorage.setItem("id", result.id ?? "");
        localStorage.setItem("email", result.email ?? "");
        localStorage.setItem("number", result.number ?? "");
        localStorage.setItem("gender", result.gender ?? "");
        localStorage.setItem("dob", result.dob ?? "");
        localStorage.setItem("birth_place", result.birth_place ?? result.birthPlace ?? "");
        localStorage.setItem("birth_time", result.birth_time ?? result.birthTime ?? "");
        onLoginSuccess?.({
          token: data.token,
          name: result.name,
          id: result.id,
          email: result.email,
          number: result.number,
          gender: result.gender,
          dob: result.dob,
          birth_place: result.birth_place ?? result.birthPlace,
          birth_time: result.birth_time ?? result.birthTime,
        });
        onClose(); // Close modal on successful login
      } else {
        setError(data.message ?? "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // 2. Updated focus shift to cap at index 3 instead of 5
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card — bottom sheet on mobile, centered card on md+ */}
      <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl p-6 animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">
            {step === "mobile" ? "Login / Signup" : "Verify OTP"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* MOBILE STEP */}
        {step === "mobile" && (
          <>
            <p className="text-gray-500 text-sm mb-4">
              Enter your mobile number to continue
            </p>

            <div className="flex items-center border rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-orange-400">
              <span className="mr-2 text-gray-600 font-medium">+{dialCode}</span>
              <div className="w-px h-5 bg-gray-300 mr-2" />
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => { setError(""); setMobile(e.target.value.replace(/\D/g, "")); }}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                className="w-full outline-none text-sm"
                placeholder="Enter mobile number"
                autoFocus
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending OTP…
                </span>
              ) : (
                "Send OTP"
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-orange-500 underline">Terms of Use</a>{" "}
              &amp;{" "}
              <a href="/privacy" className="text-orange-500 underline">Privacy Policy</a>
            </p>
          </>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            <p className="text-gray-500 text-sm mb-5 text-center">
              OTP sent to <span className="font-medium text-black">+91 {mobile}</span>
            </p>

            {/* 4-box OTP input (Updated UI) */}
            <div className="flex justify-center gap-4 mb-5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-14 border-2 rounded-lg text-center text-xl font-semibold focus:border-orange-400 focus:outline-none transition-colors"
                  style={{ height: "56px" }}
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Timer / Resend */}
            <div className="text-center mt-4 text-sm text-gray-500">
              {timer > 0 ? (
                <>Resend OTP available in <span className="font-medium">{timer}s</span></>
              ) : (
                <button
                  onClick={resendOtp}
                  className="text-orange-500 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={() => { setStep("mobile"); setError(""); setOtp(["", "", "", ""]); }}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}