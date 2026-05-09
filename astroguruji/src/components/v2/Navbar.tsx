import { NAV_LINKS } from "@/data/home";
import { useState } from "react";
import LoginModal from "./UserLoginModal";
import LanguageModal from "./LanguageModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token");
const userName = typeof window !== "undefined" && localStorage.getItem("name");

const handleLogout = () => {
  localStorage.clear();
  window.location.reload();
};


  return (
    <nav className="w-full border-b border-gray-200 bg-white ">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-6 lg:px-[94px] lg:py-[18px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src="/images/v2/logo-vector.png"
            alt="Astrogurujii logo"
            className="h-[28px] w-auto object-contain md:h-[38px]"
          />
          <span className="font-poppins text-[18px] font-bold text-brand-orange md:text-[23px] uppercase">
            Astrogurujii
          </span>
        </a>

        {/* Nav links — hidden on mobile */}
        <ul className="hidden items-center gap-[20px] lg:flex lg:gap-[32px]">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-poppins text-[14px] font-medium text-black transition-colors hover:text-brand-orange"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-[10px] md:gap-[16px]">
          {/* Translate icon */}
          <button onClick={() => setShowLang(true)}
            aria-label="Translate"
            className="flex h-6 w-6 items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_59_5198)">
                <path
                  d="M21.5002 4H12.0002C11.9465 4 11.8932 4.00844 11.8422 4.02498L11.7222 4.06497C11.4602 4.15216 11.3184 4.43523 11.4056 4.69722C11.4061 4.69881 11.4067 4.70036 11.4072 4.70195L16.4332 19.389L13.1232 23.171C12.9415 23.3789 12.9627 23.6948 13.1707 23.8765C13.2619 23.9562 13.379 24.0001 13.5002 24H21.5002C22.8809 24 24.0002 22.8807 24.0002 21.5V6.50003C24.0002 5.11928 22.8809 4 21.5002 4Z"
                  fill="#ECEFF1"
                />
                <path
                  d="M17.455 19.293C17.3739 19.1146 17.196 19 17 19H12C11.7239 19 11.5 19.2239 11.5 19.5C11.5 19.5601 11.5108 19.6197 11.532 19.676L13.032 23.676C13.0939 23.8407 13.2379 23.9607 13.411 23.992C13.4404 23.9971 13.4702 23.9997 13.5 24C13.6442 23.9999 13.7812 23.9375 13.876 23.829L17.376 19.829C17.5052 19.6813 17.5361 19.4717 17.455 19.293Z"
                  fill="#1976D2"
                />
                <path
                  d="M21.5 11H14.5C14.2239 11 14 10.7762 14 10.5C14 10.2239 14.2239 10 14.5 10H21.5C21.7761 10 22 10.2239 22 10.5C22 10.7762 21.7762 11 21.5 11Z"
                  fill="#455A64"
                />
                <path
                  d="M17.5 11C17.2239 11 17 10.7761 17 10.5V9.50002C17 9.22388 17.2239 9 17.5 9C17.7762 9 18 9.22388 18 9.50002V10.5C18 10.7761 17.7762 11 17.5 11Z"
                  fill="#455A64"
                />
                <path
                  d="M15.9995 17C15.7234 16.9998 15.4997 16.7757 15.5 16.4996C15.5001 16.3382 15.5782 16.1868 15.7096 16.093C17.8996 14.537 19.4996 11.365 19.4996 10.5C19.4996 10.2239 19.7234 10 19.9996 10C20.2757 10 20.4996 10.2239 20.4996 10.5C20.4996 11.818 18.5726 15.286 16.2896 16.907C16.2049 16.9674 16.1036 16.9999 15.9995 17Z"
                  fill="#455A64"
                />
                <path
                  d="M20 17.999C19.8749 17.9992 19.7543 17.9524 19.662 17.868C19.3 17.536 16.104 14.584 15.537 13.187C15.4329 12.931 15.556 12.6392 15.812 12.535C16.068 12.4309 16.3599 12.5541 16.464 12.8101C16.873 13.8181 19.4 16.27 20.339 17.1291C20.5433 17.3148 20.5584 17.631 20.3727 17.8354C20.2773 17.9403 20.1418 17.9998 20 17.999Z"
                  fill="#455A64"
                />
                <path
                  d="M17.473 19.338L10.973 0.338016C10.9038 0.135844 10.7137 0 10.5 0H2.49998C1.11928 0 0 1.11928 0 2.49998V17.5C0 18.8807 1.11928 20 2.49998 20H17C17.2761 20 17.4999 19.7761 17.4999 19.5C17.5 19.4449 17.4908 19.3901 17.473 19.338Z"
                  fill="#2196F3"
                />
                <path
                  d="M9.49965 13.9999C9.28825 13.9999 9.09967 13.867 9.02865 13.6679L6.99967 7.98588L4.97069 13.6679C4.86742 13.924 4.57609 14.0479 4.31997 13.9446C4.07833 13.8472 3.952 13.5806 4.02967 13.3319L6.52965 6.33189C6.65195 6.07207 6.96175 5.96055 7.22158 6.0828C7.33103 6.13432 7.41911 6.22239 7.47067 6.33189L9.97065 13.3319C10.0637 13.5911 9.92959 13.8769 9.67065 13.9709C9.61572 13.9903 9.55787 14.0001 9.49965 13.9999Z"
                  fill="#FAFAFA"
                />
                <path
                  d="M8.00003 11H6.00002C5.72388 11 5.5 10.7762 5.5 10.5C5.5 10.2239 5.72388 10 6.00002 10H8.00003C8.27617 10 8.50005 10.2239 8.50005 10.5C8.5 10.7762 8.27617 11 8.00003 11Z"
                  fill="#FAFAFA"
                />
              </g>
              <defs>
                <clipPath id="clip0_59_5198">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>

          {/* Notification bell */}
          <button
            aria-label="Notifications"
            className="flex items-center justify-center"
          >
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
              <path
                d="M8.5 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6V8.5C15 5.43 13.36 2.86 10.5 2.18V1.5C10.5.67 9.83 0 9 0h-1C7.17 0 6.5.67 6.5 1.5v.68C3.63 2.86 2 5.42 2 8.5V14l-2 2v1h17v-1l-2-2z"
                fill="#000"
              />
            </svg>
          </button>

          {/* Login button */}
          {/* <button
              onClick={() => setShowLogin(true)}
              className="rounded-full bg-brand-orange px-[16px] py-[4px] text-[12px] text-white md:px-[25px] md:py-[5px]"
            >
              Login
            </button> */}
            {isLoggedIn ? (
  <div className="relative">
    {/* Avatar Button */}
    <button
      onClick={() => setUserMenuOpen(!userMenuOpen)}
      className="flex items-center gap-2 rounded-full border border-[#E0D5CC] px-3 py-1 hover:border-brand-orange transition"
    >
      <div className="h-8 w-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-sm font-bold">
      {typeof userName === "string" ? userName.charAt(0) : "U"}
      </div>
      <span className="hidden md:block text-[12px] font-medium">
        {userName || "User"}
      </span>
    </button>

    {/* Dropdown */}
    {userMenuOpen && (
      <div className="absolute right-0 mt-2 w-[200px] rounded-xl border border-[#F0E8DF] bg-white shadow-lg overflow-hidden z-50">
        
        {/* User Info */}
        <div className="px-4 py-3 border-b bg-[#FFF7F0]">
          <p className="text-[13px] font-semibold text-gray-800">
            {userName || "User"}
          </p>
          <p className="text-[11px] text-gray-500">
            {localStorage.getItem("email")}
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col">
          <a href="/user_profile" className="px-4 py-2 text-[13px] hover:bg-gray-50">
            👤 Edit Profile
          </a>
          <a href="/my-wallet" className="px-4 py-2 text-[13px] hover:bg-gray-50">
            💰 Wallet
          </a>
          <a href="/user-reports" className="px-4 py-2 text-[13px] hover:bg-gray-50">
            📦 My Orders
          </a>
          <a href="/customer-chat-support" className="px-4 py-2 text-[13px] hover:bg-gray-50">
          💻 Customer Chat Support
          </a>
          <button
            onClick={handleLogout}
            className="text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    )}
  </div>
) : (
  <button
    onClick={() => setShowLogin(true)}
    className="rounded-full bg-brand-orange px-[16px] py-[4px] text-[12px] text-white md:px-[25px] md:py-[5px]"
  >
    Login
  </button>
)}

          {/* Hamburger — mobile only */}
          <button
            aria-label="Menu"
            className="flex items-center justify-center lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block font-poppins text-[14px] font-medium text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoginModal
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onLoginSuccess={(userData: any) => console.log(userData)}
/>
      <LanguageModal
  isOpen={showLang}
  onClose={() => setShowLang(false)}
/>
    </nav>
  );
}
