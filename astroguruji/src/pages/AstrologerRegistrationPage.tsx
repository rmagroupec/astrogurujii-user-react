import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";

// In development, requests go via Vite proxy (/api -> https://admin.astrogurujii.com)
// In production, set VITE_API_BASE_URL to https://admin.astrogurujii.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const REGISTER_URL = `https://admin.astrogurujii.com/v2/astroRequest`;
const STATUS_URL = `https://admin.astrogurujii.com/astro-request-status`;

export default function AstrologerRegistration() {
  const navigate = useNavigate();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // States
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [astroMsg, setAstroMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // File States
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "Rohit",
    email: "rohit@gmail.com",
    mobile: "9876543210",
    qualification: "Vedic Astrology",
    experience: "5 Years",
  });

  useEffect(() => {
    const checkAstroStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(STATUS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // DEBUG: log full response to understand shape
        console.log("STATUS API full response:", JSON.stringify(res.data));

        // API returns status:false + data.status when already applied
        const appStatus = res.data?.data?.status || res.data?.status_name;

        if (appStatus) {
          switch (appStatus) {
            case "Request Sent":
              setAstroMsg("You have already requested for astrologer");
              break;
            case "Selected":
              setAstroMsg("Your request for astrologer is selected");
              break;
            case "Rejected":
              setAstroMsg("Your request for astrologer is rejected");
              break;
            case "Hold":
              setAstroMsg("Your request for astrologer is on Hold");
              break;
            default:
              setAstroMsg(null);
          }
        } else {
          setAstroMsg(null); // No prior application — show form
        }
      } catch (error) {
        setAstroMsg(null);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    checkAstroStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorToast(null);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorToast("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorToast("Profile photo must be under 5MB.");
      return;
    }
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
    setErrorToast(null);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setErrorToast("Please upload a PDF or Word document for CV.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorToast("CV must be under 10MB.");
      return;
    }
    setCvFile(file);
    setErrorToast(null);
  };

  const validateForm = () => {
    const { name, email, mobile, qualification, experience } = formData;
    if (!name.trim()) return "Enter your Name";
    if (name.trim().length < 3) return "Name is too short";
    if (!email.trim()) return "Enter your email";
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return "Enter a valid email";
    if (!mobile.trim()) return "Enter your mobile number";
    if (!/^[0-9]{10}$/.test(mobile)) return "Enter a valid 10-digit mobile number";
    if (!qualification.trim()) return "Enter your Qualification";
    if (!experience.trim()) return "Enter your Experience";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorToast(validationError);
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // DEBUG: remove these console.logs once working
      console.log("TOKEN:", token);
      console.log("ENDPOINT:", REGISTER_URL);
      if (!token) {
        setErrorToast("Not logged in. Please login first and try again.");
        setIsLoading(false);
        return;
      }
      // END DEBUG

      // JSON payload
      const payload = {
        name: formData.name.trim(),
        number: formData.mobile.trim(),
        email: formData.email.trim(),
        qulification: formData.qualification.trim(),
        experience: formData.experience.trim(),
      };

      const res = await axios.post(REGISTER_URL, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      if (res.data?.status) {
        navigate("/thank-you");
      } else {
        const msg = res.data?.message || "";
        const alreadyApplied =
          msg.toLowerCase().includes("already") ||
          res.data?.data?.status === "Request Sent";

        if (alreadyApplied) {
          // Show status view instead of error
          setAstroMsg("You have already requested for astrologer");
        } else {
          setErrorToast(msg || "Submission failed. Please check your details.");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const status = error?.response?.status;
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      if (status === 404) {
        setErrorToast("API endpoint not found (404). Please contact support or check the API URL.");
      } else if (status === 401 || status === 403) {
        setErrorToast("Session expired. Please login again.");
      } else if (status === 422) {
        setErrorToast(serverMsg || "Validation error. Please check your inputs.");
      } else {
        setErrorToast(serverMsg ? `Error: ${serverMsg}` : "Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) return <MasterLoader text="Checking Status..." />;

  const statusConfig: Record<string, { icon: string; color: string; bg: string; border: string }> = {
    "You have already requested for astrologer": {
      icon: "⏳",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    "Your request for astrologer is selected": {
      icon: "✅",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    "Your request for astrologer is rejected": {
      icon: "❌",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    "Your request for astrologer is on Hold": {
      icon: "⏸️",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
  };

  const statusStyle = astroMsg ? statusConfig[astroMsg] ?? { icon: "ℹ️", color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" } : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="w-full max-w-[1200px] mx-auto px-6 pt-5 pb-1">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-[#FF9800] transition-colors">
            Home
          </button>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700 font-medium">Astrologer Registration</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="w-full max-w-[1200px] mx-auto px-6 pt-4 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="text-[#FF9800]">Astrogurujii</span> Astrologer Registration
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Join our growing team of expert astrologers and help guide millions toward clarity and purpose.
        </p>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 pb-12 flex flex-col lg:flex-row gap-8">

        {/* LEFT: Why Join Us panel */}
        <div className="lg:w-[360px] flex-shrink-0 flex flex-col gap-5">
          {/* Why Join Banner */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[#FF9800] px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🔮</div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Why Join Us?</h2>
                <p className="text-white/80 text-xs mt-0.5">Be part of a mission-driven astrology platform</p>
              </div>
            </div>
            <div className="bg-white px-5 py-4 grid grid-cols-1 gap-4">
              {[
                { icon: "🌐", title: "Work Remotely", desc: "Consult from anywhere in India or abroad." },
                { icon: "📈", title: "Grow Fast", desc: "Get featured to millions of users on our platform." },
                { icon: "💰", title: "Competitive Pay", desc: "Earn per-minute rates with timely payouts." },
                { icon: "🤝", title: "Great Community", desc: "Collaborate in a spiritually positive environment." },
                { icon: "📚", title: "Skill Support", desc: "Resources and training to sharpen your craft." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements card */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FF9800] rounded-full flex items-center justify-center text-white text-xs">✓</span>
              Basic Requirements
            </h3>
            <ul className="space-y-2">
              {[
                "Minimum 1 year of astrology practice",
                "Strong knowledge of Vedic or Western astrology",
                "Good communication in Hindi or English",
                "Smartphone or laptop with internet",
              ].map((req) => (
                <li key={req} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-[#FF9800] font-bold mt-0.5">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Form or Status */}
        <div className="flex-1">
          {astroMsg && statusStyle ? (
            /* ── Status View ── */
            <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center min-h-[320px] text-center border border-gray-100">
              <div className="text-5xl mb-4">{statusStyle.icon}</div>
              <div className={`inline-block px-6 py-4 rounded-xl border ${statusStyle.bg} ${statusStyle.border}`}>
                <p className={`text-base font-semibold ${statusStyle.color}`}>{astroMsg}</p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="mt-6 text-sm text-[#FF9800] font-medium hover:underline transition-all"
              >
                ← Back to Home
              </button>
            </div>
          ) : (
            /* ── Registration Form ── */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#FF9800] to-[#FFB347] px-8 py-5">
                <h2 className="text-white font-bold text-xl">Astrologer Enquiry Form</h2>
                <p className="text-white/80 text-sm mt-1">Fill in your details and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-6">

                {/* Error / Success Toast */}
                {errorToast && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <span className="text-lg">⚠️</span>
                    <span>{errorToast}</span>
                    <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setErrorToast(null)}>✕</button>
                  </div>
                )}

                {/* Profile Photo Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Profile Photo</label>
                  <div className="flex items-center gap-5">
                    {/* Avatar Preview */}
                    <div
                      className="w-20 h-20 rounded-full border-2 border-dashed border-[#FF9800] overflow-hidden flex items-center justify-center bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors flex-shrink-0"
                      onClick={() => profileInputRef.current?.click()}
                    >
                      {profilePicPreview ? (
                        <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-[#FF9800]">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span className="text-[9px] mt-1 font-medium">Upload</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => profileInputRef.current?.click()}
                        className="bg-orange-50 hover:bg-orange-100 border border-[#FF9800] text-[#FF9800] text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Choose Photo
                      </button>
                      <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WEBP · Max 5MB</p>
                      {profilePic && (
                        <p className="text-xs text-green-600 mt-1 font-medium">✓ {profilePic.name}</p>
                      )}
                    </div>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Two-column grid for Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      maxLength={27}
                      className="w-full bg-[#FDF7F7] border border-[#F0E8E8] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF9800]/30 focus:border-[#FF9800] text-sm text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email ID"
                      className="w-full bg-[#FDF7F7] border border-[#F0E8E8] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF9800]/30 focus:border-[#FF9800] text-sm text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                {/* Phone + Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-[#F0E8E8] rounded-l-xl text-sm text-gray-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength={10}
                        className="flex-1 bg-[#FDF7F7] border border-[#F0E8E8] rounded-r-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF9800]/30 focus:border-[#FF9800] text-sm text-gray-800 placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Experience <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5 years"
                      className="w-full bg-[#FDF7F7] border border-[#F0E8E8] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF9800]/30 focus:border-[#FF9800] text-sm text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                {/* Qualification full width */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Qualification <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. Jyotish Acharya, B.Sc Astrology"
                    className="w-full bg-[#FDF7F7] border border-[#F0E8E8] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF9800]/30 focus:border-[#FF9800] text-sm text-gray-800 placeholder-gray-400 transition-all"
                  />
                </div>

                {/* CV Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Upload CV / Resume</label>
                  <div
                    className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      cvFile
                        ? "border-green-400 bg-green-50"
                        : "border-[#FF9800]/40 bg-orange-50/50 hover:bg-orange-50 hover:border-[#FF9800]"
                    }`}
                    onClick={() => cvInputRef.current?.click()}
                  >
                    {cvFile ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-700">{cvFile.name}</p>
                          <p className="text-xs text-green-500">{(cvFile.size / 1024).toFixed(1)} KB · Click to replace</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Click to upload your CV</p>
                        <p className="text-xs text-gray-400 mt-1">PDF or Word · Max 10MB</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleCvChange}
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF9800] hover:bg-[#e68a00] disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white text-base font-bold py-4 rounded-xl shadow-md shadow-orange-200 flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    By submitting, you agree to our{" "}
                    <button type="button" className="text-[#FF9800] hover:underline">Terms & Conditions</button>
                  </p>
                </div>

              </form>
            </div>
          )}

          {/* Bottom CTA Banner */}
          {!astroMsg && (
            <div className="mt-5 bg-gradient-to-r from-[#FF9800] to-[#FFB347] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-white font-bold text-base">Already an astrologer on our platform?</p>
                <p className="text-white/80 text-sm mt-0.5">Login to your astrologer dashboard to manage sessions.</p>
              </div>
              <button
                onClick={() => navigate("/astrologer-login")}
                className="flex-shrink-0 bg-white text-[#FF9800] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap"
              >
                Login Now →
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}