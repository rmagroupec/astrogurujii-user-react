import { NAV_LINKS } from "@/data/home";
import { useState, useEffect, useRef } from "react";
import LoginModal from "./UserLoginModal";
import LanguageModal from "./LanguageModal";
import { useNavigate, useLocation } from "react-router-dom";

// ── Route map ─────────────────────────────────────────────────
const NAV_ROUTES: Record<string, string> = {
  "Home": "/",
  "Horoscope": "/horoscope",
  "Panchang": "/panchang",
  "Live Astrologer": "/live-astrologer",
  "Chat With Astrolger": "/chat-with-astrologer",
  "Call With Astrolger": "/call-with-astrologer",
  "Our Blog": "/our-blog",
};

// ── Icons ─────────────────────────────────────────────────────
const NAV_ICONS: Record<string, React.ReactNode> = {
  "Home": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  "Horoscope": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  "Panchang": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  "Live Astrologer": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  "Chat With Astrolger": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  "Call With Astrolger": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  "Our Blog": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
};

// ── Reusable avatar component ─────────────────────────────────
function UserAvatar({
  profileImg,
  initial,
  size = "sm",
}: {
  profileImg: string;
  initial: string;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "w-9 h-9 text-[15px]" : "h-8 w-8 text-sm";
  if (profileImg) {
    return (
      <img
        src={profileImg}
        alt="Profile"
        className={`${dim} rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-brand-orange text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initial}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Reactive user state (updates on profile-updated event) ───
  const [userName, setUserName] = useState(() => localStorage.getItem("name") || "");
  const [profileImg, setProfileImg] = useState(() => localStorage.getItem("profile_img") || "");

  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Listen for profile updates from EditProfilePage
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (detail.profile_img !== undefined) setProfileImg(detail.profile_img);
      if (detail.name !== undefined) setUserName(detail.name);
      // Fallback: re-read localStorage
      setProfileImg(localStorage.getItem("profile_img") || "");
      setUserName(localStorage.getItem("name") || "");
    };
    window.addEventListener("profile-updated", handler as EventListener);
    return () => window.removeEventListener("profile-updated", handler as EventListener);
  }, []);

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

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const allNavLinks = ["Home", ...NAV_LINKS];

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2 md:px-6 lg:px-[94px] lg:py-3">

          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Astrogurujii Home">
            <img
              src="https://admin.astrogurujii.com/logo/logo2.png"
              alt="Astrogurujii"
              className="h-[44px] w-auto object-contain md:h-[52px]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </a>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center">
            {allNavLinks.map((link) => (
              <li key={link}>
                <a
                  href={NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`font-poppins text-[13px] xl:text-[14px] font-medium transition-colors whitespace-nowrap relative
    ${location.pathname === (NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`)
                      ? "text-brand-orange after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-brand-orange after:rounded-full"
                      : "text-gray-800 hover:text-brand-orange"
                    }`}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">

            {/* Translate */}
            <button
              onClick={() => setShowLang(true)}
              aria-label="Change language"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#4285F4">
                <path d="M22.401 4.818h-9.927L10.927 0H1.599C.72 0 .002.719.002 1.599v16.275c0 .878.72 1.597 1.597 1.597h10L13.072 24H22.4c.878 0 1.597-.707 1.597-1.572V6.39c0-.865-.72-1.572-1.597-1.572zM6.741 13.498c-2.07 0-3.75-1.68-3.75-3.75 0-2.07 1.68-3.75 3.75-3.75 1.012 0 1.86.375 2.512.976l-.99.952a2.194 2.194 0 0 0-1.522-.584c-1.305 0-2.363 1.08-2.363 2.409s1.058 2.409 2.363 2.409c1.507 0 2.13-1.08 2.19-1.808l-2.188-.002V9.066h3.51c.05.23.09.457.09.764 0 2.147-1.434 3.669-3.602 3.669zm15.417 7.93c0 .59-.492 1.072-1.097 1.072h-8.875l3.649-4.03-.74-2.302s.568-.488 1.277-1.24c.712.771 1.63 1.699 2.818 2.805l.771-.772c-1.272-1.154-2.204-2.07-2.89-2.805.919-1.087 1.852-2.455 2.049-3.707h2.034v-.94h-4.532v-1.52h-1.471v1.52H14.3l-1.672-5.21h9.433c.605 0 1.097.48 1.097 1.072v16.057z" />
              </svg>
            </button>

            {/* Notification bell */}
            <button
              aria-label="Notifications"
              onClick={() => navigate("/notify_list")}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
                <path d="M8.5 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6V8.5C15 5.43 13.36 2.86 10.5 2.18V1.5C10.5.67 9.83 0 9 0h-1C7.17 0 6.5.67 6.5 1.5v.68C3.63 2.86 2 5.42 2 8.5V14l-2 2v1h17v-1l-2-2z" fill="#333" />
              </svg>
            </button>

            {/* User button */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#E0D5CC] px-2 py-1 hover:border-brand-orange transition-colors"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  {/* ✅ Shows profile photo if available, else initial */}
                  <UserAvatar profileImg={profileImg} initial={userInitial} size="sm" />
                  <span className="hidden md:block font-poppins text-[12px] font-medium text-gray-800 max-w-[80px] truncate pr-1">
                    {userName || "User"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[210px] rounded-2xl border border-[#F0E8DF] bg-white shadow-xl overflow-hidden z-50">
                    {/* Dropdown header with photo */}
                    <div className="px-4 py-3 bg-[#FFF7F0] border-b border-[#F0E8DF] flex items-center gap-3">
                      <UserAvatar profileImg={profileImg} initial={userInitial} size="md" />
                      <div className="min-w-0">
                        <p className="font-poppins text-[13px] font-semibold text-gray-800 truncate">{userName || "User"}</p>
                        <p className="font-poppins text-[11px] text-gray-500 truncate">{localStorage.getItem("email") || ""}</p>
                      </div>
                    </div>
                    <div className="flex flex-col py-1">
                      {[
                        { icon: "👤", label: "Edit Profile", href: "/user_profile" },
                        { icon: "💰", label: "Wallet", href: "/my-wallet" },
                        { icon: "📦", label: "My Orders", href: "/user-reports" },
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 z-[70] h-full w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#FFFFFF]">
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Astrogurujii Home">
            <img
              src="https://admin.astrogurujii.com/logo/logo2.png"
              alt="Astrogurujii"
              className="h-[44px] w-auto object-contain md:h-[52px]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ✅ Drawer user strip — shows profile photo */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 px-5 py-3 bg-[#FFF7F0] border-b border-[#FFE8D6]">
            <UserAvatar profileImg={profileImg} initial={userInitial} size="md" />
            <div className="min-w-0">
              <p className="font-poppins text-[13px] font-semibold text-gray-800 truncate">{userName}</p>
              <p className="font-poppins text-[11px] text-gray-500 truncate">{localStorage.getItem("email") || ""}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="flex flex-col">
            {allNavLinks.map((link, i) => (
              <li key={link}>
                <a
                  href={NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`flex items-center gap-4 px-5 py-3.5 font-poppins text-[14px] font-medium transition-colors group
    ${location.pathname === (NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`)
                      ? "bg-[#FFF7F0] text-[#FF6F00] border-l-4 border-[#FF6F00]"
                      : "text-gray-800 hover:bg-[#FFF7F0] hover:text-[#FF6F00]"
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={`transition-colors flex-shrink-0 ${location.pathname === (NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`)
                      ? "text-[#FF6F00]" : "text-gray-400 group-hover:text-[#FF6F00]"
                    }`}>
                    {NAV_ICONS[link]}
                  </span>
                  <span className="flex-1">{link}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className={location.pathname === (NAV_ROUTES[link] ?? `/${link.toLowerCase().replace(/\s+/g, "-")}`)
                      ? "text-[#FF6F00]" : "text-gray-300 group-hover:text-[#FF6F00]"}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
                {i < allNavLinks.length - 1 && <div className="mx-5 h-px bg-gray-100" />}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => { setShowLang(true); setMenuOpen(false); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 font-poppins text-[12px] font-medium text-gray-600 hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Language
            </button>
            <button
              onClick={() => { navigate("/notify_list"); setMenuOpen(false); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 font-poppins text-[12px] font-medium text-gray-600 hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors"
            >
              <svg width="15" height="17" viewBox="0 0 17 20" fill="none">
                <path d="M8.5 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6V8.5C15 5.43 13.36 2.86 10.5 2.18V1.5C10.5.67 9.83 0 9 0h-1C7.17 0 6.5.67 6.5 1.5v.68C3.63 2.86 2 5.42 2 8.5V14l-2 2v1h17v-1l-2-2z" fill="currentColor" />
              </svg>
              Alerts
            </button>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 py-2.5 font-poppins text-[13px] font-semibold text-red-500 hover:bg-red-100 transition-colors"
            >
              <span>🚪</span> Logout
            </button>
          ) : (
            <button
              onClick={() => { setShowLogin(true); setMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF6F00] py-2.5 font-poppins text-[13px] font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

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