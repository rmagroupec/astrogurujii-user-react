import type { ConsultantDetailData, Specialty } from "@/data/consultant-detail";
import { StarYellowIcon } from "@/assets/icons";
import "./ProfileSidebar.css";
import ConnectionModal from "../ConnectionModal";
import LoginModal from "@/components/v2/UserLoginModal";
import { useState, useEffect } from "react";
import { profile_api } from "@/https_service";

interface ProfileSidebarProps {
  consultant: ConsultantDetailData;
  specialties: Specialty[];
  onSendGiftClick?: () => void;
}

function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  const isSkip = localStorage.getItem("is_skip");
  return !!token && isSkip !== "Y";
}

export default function ProfileSidebar({
  consultant,
  onSendGiftClick,
}: Readonly<ProfileSidebarProps>) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState<"chat" | "audio" | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCallType, setPendingCallType] = useState<"chat" | "audio" | null>(null);
  const [userWallet, setUserWallet] = useState<number>(0);

  useEffect(() => {
    profile_api().then((res) => {
      if (res?.status === true && res.results) {
        const raw =
          res.results.wallet ??
          res.results.balance ??
          res.results.amount ??
          res.results.wallet_amount ??
          "0";
        const parsed = parseFloat(String(raw));
        setUserWallet(isNaN(parsed) ? 0 : parsed);
      }
    });
  }, []);

  const handleOpenConnection = (type: "chat" | "audio") => {
    if (!isLoggedIn()) {
      setPendingCallType(type);
      setShowLoginModal(true);
      return;
    }
    setActiveCallType(type);
    setIsModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingCallType) {
      setActiveCallType(pendingCallType);
      setPendingCallType(null);
      setIsModalOpen(true);
    }
  };

  const activeRate =
    activeCallType === "chat"
      ? Number(consultant.chatPrice) || 0
      : Number(consultant.callPrice) || 0;

  return (
    <>
      <aside
        className="w-full shrink-0 flex flex-col gap-5 lg:w-[394px] lg:top-4 lg:self-start"
        data-testid="profile-sidebar"
      >
        <div
          className="bg-white rounded-[10px] overflow-hidden pt-3"
          style={{ border: "1px solid rgba(238, 128, 44, 0.23)" }}
        >
          {/* Avatar */}
          <div className="flex justify-center">
            <img
              src={consultant.avatar}
              alt={consultant.name}
              className="w-[160px] h-[160px] rounded-full object-cover mt-[15px]"
              style={{
                border: "1px solid #FF6F00",
                boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.05)",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(consultant.name)}&background=FF6F00&color=fff&size=160`;
              }}
            />
          </div>

          {/* Name + Verified Badge */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <h1 className="font-outfit text-[23px] font-semibold text-black">
              {consultant.name}
            </h1>
            {consultant.verified && (
              <img
                src="/images/verified.svg"
                alt="Verified"
                className="w-6 h-6"
              />
            )}
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 mt-1">
            <img
              src="/images/location-pin.svg"
              alt=""
              className="w-[10px] h-[10px]"
            />
            <span className="font-outfit text-[15px] font-normal text-black">
              {consultant.location}
            </span>
          </div>

          {/* Stats Pill */}
          <div className="flex justify-center mt-3">
            <div
              className="flex items-center gap-2 rounded-[50px] px-5 h-[36px]"
              style={{ border: "1px solid #FF6F00" }}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <img
                    key={`star-${n}`}
                    src={StarYellowIcon}
                    alt=""
                    className="w-3 h-[13px]"
                    style={{
                      opacity: n <= consultant.rating ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              <span className="font-poppins text-[14px] sm:text-[17px] font-semibold leading-none text-brand-orange text-profile-down">
                {consultant.rating}
              </span>
              <div className="w-px h-4 bg-slate-300" />
              <span className="font-poppins text-[14px] sm:text-[17px] font-semibold leading-none text-black text-profile-down">
                {consultant.orders}
              </span>
              <span className="font-poppins text-[14px] sm:text-[17px] font-semibold leading-none text-brand-orange text-profile-down">
                Orders
              </span>
            </div>
          </div>

          {/* Language */}
          <p className="text-center font-poppins text-[13px] font-semibold text-brand-orange mt-[10px]">
            {consultant.languages}
          </p>

          {/* Chat Now */}
          <div className="flex justify-center mt-[14px]">
            <button
              className="flex items-center w-full max-w-[330px] h-[50px] rounded-[4px] px-4"
              onClick={() => handleOpenConnection("chat")}
              style={{
                border: "1px solid #FFDDC4",
                background: "rgba(255, 238, 225, 0.26)",
              }}
            >
              <img
                src="/images/chat-now-icon.svg"
                alt=""
                className="w-[30px] h-[30px]"
              />
              <span className="font-poppins text-[14px] font-semibold text-black ml-[22px]">
                Chat Now
              </span>
              <div className="ml-auto flex flex-col items-end">
                <span className="font-poppins text-[10px] font-semibold text-brand-orange line-through">
                  ₹{consultant.chatOriginal}/Min
                </span>
                <span className="font-poppins text-[14px] font-semibold text-[#34A853]">
                  ₹{consultant.chatPrice}/Min
                </span>
              </div>
            </button>
          </div>

          {/* Call Now */}
          <div className="flex justify-center mt-2">
            <button
              className="flex items-center w-full max-w-[330px] h-[50px] rounded-[4px] px-4"
              onClick={() => handleOpenConnection("audio")}
              style={{
                border: "1px solid #FFDDC4",
                background: "rgba(255, 238, 225, 0.26)",
              }}
            >
              <img
                src="/images/call-icon.svg"
                alt=""
                className="w-[26px] h-[26px]"
              />
              <span className="font-poppins text-[14px] font-semibold text-black ml-[22px]">
                Call Now
              </span>
              <div className="ml-auto flex flex-col items-end">
                <span className="font-poppins text-[10px] font-semibold text-brand-orange line-through">
                  ₹{consultant.callOriginal}/Min
                </span>
                <span className="font-poppins text-[14px] font-semibold text-[#34A853]">
                  ₹{consultant.callPrice}/Min
                </span>
              </div>
            </button>
          </div>

          {/* ✅ FIX: Send Gift Button — was missing entirely */}
          <div className="flex justify-center mt-2 mb-1">
            <button
              className="flex items-center justify-center gap-2 w-full max-w-[330px] h-[50px] rounded-[4px] px-4 bg-[#FF6F00] hover:bg-[#e06300] transition-colors"
              onClick={onSendGiftClick}
            >
              {/* Gift icon — falls back gracefully if image missing */}
              <img
                src="/images/gift-icon.svg"
                alt=""
                className="w-[24px] h-[24px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-poppins text-[14px] font-semibold text-white">
                Send Gift
              </span>
            </button>
          </div>

          {/* Bottom Stats Bar */}
          <div
            className="flex items-center justify-around mt-[24px]"
            style={{ background: "#FFF5EE" }}
          >
            <div className="flex items-center justify-around h-[72px] w-full max-w-[350px]">
              {[
                { value: consultant.experience, label: "Years Exp" },
                { value: consultant.followers, label: "Followers" },
                { value: consultant.avgTime, label: "Avg Time" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="font-poppins text-[15px] font-bold text-black">
                      {stat.value}
                    </span>
                    <span className="font-poppins text-[11px] font-medium text-[#606060]">
                      {stat.label}
                    </span>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-[#E0D5CC]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingCallType(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Connection Modal */}
      {isModalOpen && activeCallType && (
        <ConnectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          astrologer={{
            id: String(consultant.id),
            name: consultant.name,
            profileImage: consultant.avatar,
            ratePerMinute: activeRate,
          }}
          userWalletBalance={userWallet}
          callType={activeCallType}
        />
      )}
    </>
  );
}