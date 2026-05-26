import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";

export default function ThankYou() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);
  const [animIn, setAnimIn] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (counter <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [counter, navigate]);

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
          <span className="text-gray-700 font-medium">Application Submitted</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-[720px] flex flex-col gap-6"
          style={{
            opacity: animIn ? 1 : 0,
            transform: animIn ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Orange header banner */}
            <div className="bg-gradient-to-r from-[#FF9800] to-[#FFB347] px-8 py-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-tight">Application Submitted!</h1>
                <p className="text-white/80 text-sm mt-0.5">We've received your astrologer enquiry.</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8 flex flex-col items-center text-center gap-6">

              {/* Big checkmark */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-[#FF9800]/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#FF9800]/10 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                {/* Pulse ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-[#FF9800]/30"
                  style={{ animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
                <p className="text-gray-500 text-sm mt-2 max-w-[420px] leading-relaxed">
                  Your astrologer registration request has been received. Our team will review your application and get back to you shortly.
                </p>
              </div>

              {/* What happens next */}
              <div className="w-full bg-[#FDF7F7] rounded-xl p-5 text-left">
                <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#FF9800] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">i</span>
                  What happens next?
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { step: "1", text: "Our team reviews your application within 2–3 business days." },
                    { step: "2", text: "You will receive a call or email from our onboarding team." },
                    { step: "3", text: "Complete a short verification and you'll be live on the platform." },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FF9800] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.step}
                      </span>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto redirect notice */}
              <p className="text-xs text-gray-400">
                Redirecting to home in{" "}
                <span className="font-bold text-[#FF9800]">{counter}s</span>
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-[#FF9800] hover:bg-[#e68a00] transition-colors text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-100 flex items-center justify-center gap-2 text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Go to Home
                </button>
                <button
                  onClick={() => navigate("/astrologers")}
                  className="flex-1 bg-orange-50 hover:bg-orange-100 transition-colors text-[#FF9800] font-bold py-3.5 rounded-xl border border-[#FF9800]/30 flex items-center justify-center gap-2 text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Explore Astrologers
                </button>
              </div>

            </div>
          </div>

          {/* Bottom info strip */}
          <div className="bg-gradient-to-r from-[#FF9800] to-[#FFB347] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="text-white font-bold text-sm">Need help? We're here for you.</p>
              <p className="text-white/80 text-xs mt-0.5">Contact us at astrogurujii2@gmail.com or +91-7615976021</p>
            </div>
            <a
              href="tel:+917615976021"
              className="flex-shrink-0 bg-white text-[#FF9800] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call Us
            </a>
          </div>

        </div>
      </div>

      {/* Ping animation keyframe via inline style tag */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      <Footer />
    </div>
  );
}