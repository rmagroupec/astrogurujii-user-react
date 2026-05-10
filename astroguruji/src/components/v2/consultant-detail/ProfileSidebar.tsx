import type { ConsultantDetailData, Specialty } from "@/data/consultant-detail";
import { StarYellowIcon } from "@/assets/icons";
import "./ProfileSidebar.css";
import ConnectionModal, { IntakeFormData } from "../ConnectionModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { call_initiate } from "@/https_service";
interface ProfileSidebarProps {
  consultant: ConsultantDetailData;
  specialties: Specialty[];
  onSendGiftClick?: () => void;
}

export default function ProfileSidebar({
  consultant,
  onSendGiftClick,
}: Readonly<ProfileSidebarProps>) {


  const navigate = useNavigate();

  // ─── Modal State ───
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState<"chat" | "audio" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // ─── Mock Data (Replace with real API/Context data) ───
  const userWalletBalance = 250; // Get from global state / API
  const astrologerData = {
    id: "astro_987",
    name: "Astrologer Rahul",
    profileImage: "/images/v2/consultant-1.png",
    ratePerMinute: 20, 
  };

  // ─── Open Modal ───
  const handleOpenConnection = (type: "chat" | "audio") => {
    setActiveCallType(type);
    setIsModalOpen(true);
  };

  // ─── Handle Final Submit (API Call) ───
 const handleFinalSubmit = async (formData: IntakeFormData, type: "chat" | "audio" | "video") => {
  setIsConnecting(true);
  
  try {
    // Structure the data exactly as the Flutter api helper expects
    const payload = {
      astrologer_id: astrologerData.id,
      call_type: type, // "chat", "audio", or "video"
      fb_channel_id: "", // Sent as empty string, just like the Flutter example
      kundli: {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        tob: formData.timeOfBirth,
        place: formData.placeOfBirth,
      }
    };

    console.log("Initiating API Call with:", payload);

    // Call the actual HTTP Service
    const res = await call_initiate(payload);
    
    // Handle Navigation based on response
    if (res?.status === true) {
      setIsModalOpen(false); // Close Intake Modal

      // Route the user to the correct screen passing the newly generated channel_id
      if (type === "chat") {
        navigate(`/chat/${res.channel_id}`);
      } else if (type === "audio") {
        navigate(`/audio-call/${res.channel_id}`);
      } else if (type === "video") {
        // Matching the VideoCallScreen push from Flutter
        navigate(`/video-call/${res.channel_id}`);
      }
    } else {
      alert(res?.message || "Failed to initiate call. Please try again.");
    }

  } catch (error) {
    console.error("Connection Error:", error);
    alert("Something went wrong while connecting to the astrologer.");
  } finally {
    setIsConnecting(false);
  }
};
  return (
    <aside
      className="w-full shrink-0 flex flex-col gap-5 lg:w-[394px] lg:top-4 lg:self-start"
      data-testid="profile-sidebar"
    >
      {/* Profile Card */}
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

        {/* Bottom Stats Bar */}

        <div
          className="flex items-center justify-around mt-[24px]"
          style={{
            //   borderRadius: "0 0 10px 10px",
            //   border: "1px solid rgba(238, 128, 44, 0.23)",
            background: "#FFF5EE",
          }}
        >
          <div className="flex items-center justify-around h-[72px] w-full max-w-[350px]">
            {[
              { value: consultant.experience, label: "Years Exp" },
              { value: consultant.followers, label: "Followers" },
              { value: consultant.avgTime, label: "Wait Time" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-poppins text-[24px] font-semibold text-brand-orange">
                  {stat.value}
                </span>
                <span
                  className="font-poppins text-[11px] font-normal text-black"
                  style={{
                    translate: "0 -4px",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
            <button
              key="gift"
              type="button"
              className="flex flex-col items-center cursor-pointer bg-transparent border-none p-0"
              onClick={onSendGiftClick}
              aria-label="Send gift"
              data-testid="send-gift-trigger"
            >
              <span className="font-poppins text-[24px] font-semibold text-brand-orange h-9 flex items-center justify-center">
                <img
                  src="/images/giftbox.svg"
                  alt="Gift"
                  className="w-[21px] h-[21px]"
                />
              </span>
              <span
                className="font-poppins text-[11px] font-normal text-black"
                style={{
                  translate: "0 -4px",
                }}
              >
                Send Gift
              </span>
            </button>
          </div>
        </div>
        {/* ─── Inject The Modal ─── */}
      <ConnectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        astrologer={astrologerData}
        userWalletBalance={userWalletBalance}
        callType={activeCallType}
        onSubmit={handleFinalSubmit}
        isLoading={isConnecting}
      />
      </div>
    </aside>
  );
}
