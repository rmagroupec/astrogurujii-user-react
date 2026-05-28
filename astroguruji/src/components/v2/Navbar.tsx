import { NAV_LINKS } from "@/data/home";
import { useState, useEffect, useRef } from "react";
import LoginModal from "./UserLoginModal";
import LanguageModal from "./LanguageModal";
import { useNavigate } from "react-router-dom";

// ── Route map — label → path ──────────────────────────────────
const NAV_ROUTES: Record<string, string> = {
  "Home":                "/",
  "Horoscope":           "/horoscope",
  "Panchang":            "/panchang",
  "Live Astrologer":     "/live-astrologer",
  "Chat With Astrolger": "/chat-with-astrolger",
  "Call With Astrolger": "/call-with-astrolger",
  "Our Blog":            "/our-blog",
};

export default function Navbar() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [showLogin, setShowLogin]       = useState(false);
  const [showLang, setShowLang]         = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef                     = useRef<HTMLDivElement>(null);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");
  const userName   = typeof window !== "undefined" ? (localStorage.getItem("name") || "") : "";
  const navigate   = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Open login from anywhere
  useEffect(() => {
    const handler = () => setShowLogin(true);
    window.addEventListener("open-login-modal", handler as EventListener);
    return () => window.removeEventListener("open-login-modal", handler as EventListener);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const allNavLinks = ["Home", ...NAV_LINKS];

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2 md:px-6 lg:px-[94px] lg:py-3">

          {/* ── Logo ──────────────────────────────────────── */}
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Astrogurujii Home">
            <img
              src="https://admin.astrogurujii.com/logo/logo2.png"
              alt="Astrogurujii"
              className="h-[44px] w-auto object-contain md:h-[52px]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </a>

          {/* ── Desktop nav links ──────────────────────────── */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center">
            {allNavLinks.map((link) => (
              <li key={link}>
                <a
                  href={NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-poppins text-[13px] xl:text-[14px] font-medium text-gray-800 transition-colors hover:text-brand-orange whitespace-nowrap"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Right actions ──────────────────────────────── */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">

            {/* Translate */}
            <button
              onClick={() => setShowLang(true)}
              aria-label="Change language"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_nav_lang)">
                  <path d="M21.5002 4H12.0002C11.9465 4 11.8932 4.00844 11.8422 4.02498L11.7222 4.06497C11.4602 4.15216 11.3184 4.43523 11.4056 4.69722L16.4332 19.389L13.1232 23.171C12.9415 23.3789 12.9627 23.6948 13.1707 23.8765C13.2619 23.9562 13.379 24.0001 13.5002 24H21.5002C22.8809 24 24.0002 22.8807 24.0002 21.5V6.50003C24.0002 5.11928 22.8809 4 21.5002 4Z" fill="#ECEFF1"/>
                  <path d="M11.9998 0H2.4998C1.11905 0 -0.00019455 1.11924 -0.00019455 2.5V17.5C-0.00019455 18.8808 1.11905 20 2.4998 20H11.9998C13.3806 20 14.4998 18.8808 14.4998 17.5V2.5C14.4998 1.11924 13.3806 0 11.9998 0Z" fill="#4CAF50"/>
                  <path d="M21.5 11H14.5C14.2239 11 14 10.7762 14 10.5C14 10.2239 14.2239 10 14.5 10H21.5C21.7761 10 22 10.2239 22 10.5C22 10.7762 21.7762 11 21.5 11Z" fill="#455A64"/>
                </g>
                <defs><clipPath id="clip0_nav_lang"><rect width="24" height="24" fill="white"/></clipPath></defs>
              </svg>
            </button>

            {/* Notification bell */}
            <button
              aria-label="Notifications"
              onClick={() => navigate("/notify_list")}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
                <path d="M8.5 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6V8.5C15 5.43 13.36 2.86 10.5 2.18V1.5C10.5.67 9.83 0 9 0h-1C7.17 0 6.5.67 6.5 1.5v.68C3.63 2.86 2 5.42 2 8.5V14l-2 2v1h17v-1l-2-2z" fill="#333"/>
              </svg>
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#E0D5CC] px-2 py-1 hover:border-brand-orange transition-colors"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="h-8 w-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {userInitial}
                  </div>
                  <span className="hidden md:block font-poppins text-[12px] font-medium text-gray-800 max-w-[80px] truncate pr-1">
                    {userName || "User"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[210px] rounded-2xl border border-[#F0E8DF] bg-white shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 bg-[#FFF7F0] border-b border-[#F0E8DF]">
                      <p className="font-poppins text-[13px] font-semibold text-gray-800 truncate">{userName || "User"}</p>
                      <p className="font-poppins text-[11px] text-gray-500 truncate">{localStorage.getItem("email") || ""}</p>
                    </div>
                    <div className="flex flex-col py-1">
                      {[
                        { icon: "👤", label: "Edit Profile",     href: "/user_profile" },
                        { icon: "💰", label: "Wallet",           href: "/my-wallet" },
                        { icon: "📦", label: "My Orders",        href: "/user-reports" },
                        { icon: "💬", label: "Customer Support", href: "/customer-chat-support" },
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2.5 px-4 py-2.5 font-poppins text-[13px] text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>{item.icon}</span>{item.label}
                        </a>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 font-poppins text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-full bg-brand-orange px-4 py-1.5 font-poppins text-[12px] font-semibold text-white hover:bg-orange-600 transition-colors md:px-5 md:py-2 md:text-[13px]"
              >
                Login
              </button>
            )}

            {/* Hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M3 6h18M3 12h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────── */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="border-t border-gray-100 bg-white px-4 py-3">
            <ul className="flex flex-col">
              {allNavLinks.map((link) => (
                <li key={link}>
                  <a
                    href={NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center py-3 font-poppins text-[14px] font-medium text-gray-800 hover:text-brand-orange border-b border-gray-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile: translate + notifications */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => { setShowLang(true); setMenuOpen(false); }}
                className="flex items-center gap-2 font-poppins text-[13px] text-gray-600 hover:text-brand-orange"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Language
              </button>
              <button
                onClick={() => { navigate("/notify_list"); setMenuOpen(false); }}
                className="flex items-center gap-2 font-poppins text-[13px] text-gray-600 hover:text-brand-orange"
              >
                <svg width="16" height="18" viewBox="0 0 17 20" fill="none">
                  <path d="M8.5 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6V8.5C15 5.43 13.36 2.86 10.5 2.18V1.5C10.5.67 9.83 0 9 0h-1C7.17 0 6.5.67 6.5 1.5v.68C3.63 2.86 2 5.42 2 8.5V14l-2 2v1h17v-1l-2-2z" fill="#555"/>
                </svg>
                Notifications
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={(userData: any) => console.log(userData)}
      />
      <LanguageModal
        isOpen={showLang}
        onClose={() => setShowLang(false)}
      />
    </>
  );
}