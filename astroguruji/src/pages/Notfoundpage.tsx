import { useNavigate } from "react-router-dom";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF9]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center text-center max-w-[520px]">

          {/* Cosmic illustration */}
          <div className="relative mb-6 select-none">
            <span className="text-[100px] leading-none">🔮</span>
            <span
              className="absolute -top-2 -right-4 text-[36px] leading-none animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              ✨
            </span>
            <span
              className="absolute -bottom-2 -left-4 text-[28px] leading-none animate-bounce"
              style={{ animationDuration: "2.5s" }}
            >
              ⭐
            </span>
          </div>

          {/* 404 number */}
          <h1
            className="font-poppins font-extrabold text-[96px] leading-none"
            style={{
              background: "linear-gradient(135deg, #FF6F00 0%, #FFB347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>

          {/* Heading */}
          <h2 className="font-outfit font-semibold text-[24px] text-black mt-3">
            This Page Is Written in the Stars… Not Here
          </h2>

          {/* Sub-text */}
          <p className="font-poppins text-[14px] text-[#606060] mt-3 leading-relaxed">
            Even the cosmos couldn't locate this page. It may have moved,
            been removed, or perhaps never existed in this dimension.
          </p>

          {/* Divider */}
          <div
            className="w-16 h-[3px] rounded-full mt-6"
            style={{ background: "linear-gradient(90deg, #FF6F00, #FFB347)" }}
          />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex-1 h-[48px] rounded-[6px] bg-[#FF6F00] hover:bg-[#e06300] transition-colors font-poppins text-[14px] font-semibold text-white px-8"
            >
              🏠 Back to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex-1 h-[48px] rounded-[6px] border border-[#FF6F00] text-[#FF6F00] hover:bg-orange-50 transition-colors font-poppins text-[14px] font-semibold px-8"
            >
              ← Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-10">
            <p className="font-poppins text-[12px] text-[#909090] mb-3 uppercase tracking-wider">
              Popular Pages
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Chat with Astrologer", href: "/chat-with-astrolger" },
                { label: "Call with Astrologer", href: "/call-with-astrolger" },
                { label: "Horoscope", href: "/horoscope" },
                { label: "Free Kundli", href: "/free_kundli" },
                { label: "Blog", href: "/our-blog" },
              ].map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="rounded-full border border-[#FFDDC4] bg-[#FFF5EE] px-4 py-1.5 font-poppins text-[12px] font-medium text-[#FF6F00] hover:bg-[#FF6F00] hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}