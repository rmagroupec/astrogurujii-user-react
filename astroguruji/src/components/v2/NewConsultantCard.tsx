import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ApiAstrologer = {
  id: string;
  name: string;
  profile_img: string;
  country: string;
  experience: number;
  per_min_chat: number;
  per_min_chat_offer: string;
  language: { name: string }[];
  online?: boolean;
  is_Follow?: string;
};

export default function ConsultantCardNew({
  consultant,
  showStatusBadge = false,
}: Readonly<{
  consultant: ApiAstrologer;
  showStatusBadge?: boolean;
}>) {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState(consultant.is_Follow === "1");
  const [followLoading, setFollowLoading] = useState(false);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;
    const next = !followed;
    setFollowed(next);
    setFollowLoading(true);
    try {
      await fetch("https://admin.astrogurujii.com/user_api/follow_astro", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ astro_id: consultant.id, status: next ? "1" : "0" }),
      });
    } catch {
      setFollowed(!next);
    } finally {
      setFollowLoading(false);
    }
  };

  const price = consultant.per_min_chat;
  const offerPrice = consultant.per_min_chat_offer ? parseFloat(consultant.per_min_chat_offer) : null;
  const hasDiscount = offerPrice !== null && offerPrice < price;
  const displayPrice = hasDiscount ? offerPrice! : price;
  const originalPrice = hasDiscount ? price : null;
  const discountPct = hasDiscount ? Math.round(((price - offerPrice!) / price) * 100) : 0;
  const specialty = consultant.language?.map((l) => l.name).join(", ") || "Astrology";
  const location = consultant.country || "India";
  const experienceLabel = `${consultant.experience} Yr${consultant.experience !== 1 ? "s" : ""}`;

  return (
    <div onClick={() => navigate(`/consultants/${consultant.id}`)} className="group relative w-full rounded-[10px] border border-[#DADADA] bg-white transition-all hover:border-brand-amber">
      {/* {showStatusBadge &&
        (consultant.online ? (
          <div className="absolute left-[9px] top-[9px] z-10 rounded-[5px] bg-[#34a853] px-3 py-1 font-poppins text-[10px] font-semibold text-white">Online</div>
        ) : (
          <div className="absolute left-[9px] top-[9px] z-10 rounded-[5px] bg-brand-red px-3 py-1 font-poppins text-[10px] font-semibold uppercase text-white">Offline</div>
        ))} */}

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute right-[9px] top-[9px] z-10 rounded-[5px] bg-[#FF6F00] px-2 py-1 font-poppins text-[9px] font-bold text-white">{discountPct}% OFF</div>
      )}

      {/* Avatar */}
      <div className="absolute -top-[45px] sm:-top-[63px] left-1/2 -translate-x-1/2">
        <div className="relative">
          <img
            src={(consultant as any).profile_img}
            alt={consultant.name}
            className="h-[90px] w-[90px] sm:h-[126px] sm:w-[126px] rounded-full border border-[#DADADA] bg-gray-300 object-cover shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-colors group-hover:border-brand-amber"
          />
          {/* Follow badge */}
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`absolute -bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-3 sm:px-4 py-[3px] font-poppins text-[9px] sm:text-[10px] font-semibold text-white transition-colors
              ${followed ? "bg-brand-orange" : "bg-gray-400 group-hover:bg-brand-orange"}
              ${followLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {followLoading ? "..." : followed ? "✓ Following" : "+ Follow"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-[10px] sm:px-[14px] pb-2 pt-[55px] sm:pt-[80px] text-center">

        {/* Experience only (replaces INR price) */}
        <div className="flex items-center justify-center gap-1">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <g clipPath="url(#starExp)">
              <path d="M11.3554 4.30853C11.2808 4.08105 11.0764 3.91948 10.8344 3.89797L7.54841 3.60355L6.24902 0.602537C6.15321 0.382601 5.93501 0.240234 5.69257 0.240234C5.45014 0.240234 5.23194 0.382601 5.13613 0.603051L3.83674 3.60355L0.55019 3.89797C0.30871 3.92 0.104756 4.08105 0.0297926 4.30853C-0.0451703 4.536 0.0240596 4.78551 0.206733 4.94279L2.69058 7.09226L1.95815 10.2758C1.90456 10.5099 1.99663 10.7519 2.19347 10.8923C2.29927 10.9677 2.42305 11.0061 2.54787 11.0061C2.65549 11.0061 2.76225 10.9775 2.85806 10.9209L5.69257 9.24928L8.52605 10.9209C8.73339 11.044 8.99476 11.0328 9.19116 10.8923C9.38808 10.7515 9.48007 10.5094 9.42647 10.2758L8.69404 7.09226L11.1779 4.94322C11.3606 4.78551 11.4303 4.53643 11.3554 4.30853Z" fill="#FF6F00"/>
            </g>
            <defs><clipPath id="starExp"><rect width="11.385" height="11.2341" fill="white"/></clipPath></defs>
          </svg>
          <span className="font-poppins text-[12px] font-semibold text-brand-green">{experienceLabel} Experience</span>
        </div>

        <h3 className="mt-2 font-euclid text-[16px] sm:text-[20px] font-bold text-black">{consultant.name}</h3>
        <p className="mt-1 font-euclid text-[10px] text-text-subtle">{specialty}</p>

        <div className="border-y border-gray-200 my-2" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-[6px] sm:gap-[10px] px-[10px] sm:px-[20px] pb-[8px] pt-[10px]">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-[8px] font-poppins text-[12px] font-semibold text-black transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="transition-colors">
            <g clipPath="url(#chat)">
              <path d="M7.82907 0.435547H2.60942C2.03283 0.436238 1.48005 0.665595 1.07233 1.07331C0.664618 1.48102 0.435261 2.0338 0.43457 2.6104V6.09016C0.435203 6.59134 0.608598 7.07697 0.925529 7.46521C1.24246 7.85346 1.68355 8.12056 2.17445 8.22152V9.56993C2.17444 9.64868 2.19581 9.72595 2.23627 9.79351C2.27674 9.86106 2.33478 9.91637 2.40422 9.95352C2.47365 9.99067 2.55187 10.0083 2.63053 10.0045C2.70918 10.0006 2.78532 9.97553 2.85083 9.93182L5.34974 8.26502H7.82907C8.40566 8.26433 8.95844 8.03497 9.36616 7.62725C9.77387 7.21954 10.0032 6.66676 10.0039 6.09016V2.6104C10.0032 2.0338 9.77387 1.48102 9.36616 1.07331C8.95844 0.665595 8.40566 0.436238 7.82907 0.435547ZM6.95913 5.65519H3.47936C3.364 5.65519 3.25337 5.60937 3.17179 5.52779C3.09022 5.44622 3.04439 5.33558 3.04439 5.22022C3.04439 5.10486 3.09022 4.99423 3.17179 4.91265C3.25337 4.83108 3.364 4.78525 3.47936 4.78525H6.95913C7.07449 4.78525 7.18513 4.83108 7.2667 4.91265C7.34827 4.99423 7.3941 5.10486 7.3941 5.22022C7.3941 5.33558 7.34827 5.44622 7.2667 5.52779C7.18513 5.60937 7.07449 5.65519 6.95913 5.65519ZM7.82907 3.91531H2.60942C2.49406 3.91531 2.38343 3.86948 2.30185 3.78791C2.22028 3.70634 2.17445 3.5957 2.17445 3.48034C2.17445 3.36498 2.22028 3.25434 2.30185 3.17277C2.38343 3.0912 2.49406 3.04537 2.60942 3.04537H7.82907C7.94443 3.04537 8.05507 3.0912 8.13664 3.17277C8.21821 3.25434 8.26404 3.36498 8.26404 3.48034C8.26404 3.5957 8.21821 3.70634 8.13664 3.78791C8.05507 3.86948 7.94443 3.91531 7.82907 3.91531Z" className="fill-black transition-colors group-hover:fill-white"/>
            </g>
            <defs><clipPath id="chat"><rect width="10.4393" height="10.4393" fill="white"/></clipPath></defs>
          </svg>
          CHAT
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-[8px] font-poppins text-[12px] font-semibold text-black transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="transition-colors">
            <g clipPath="url(#call)">
              <path d="M10.1549 7.66139L8.69811 6.20455C8.17781 5.68426 7.2933 5.8924 7.08519 6.56876C6.9291 7.03705 6.4088 7.2972 5.94053 7.19312C4.89993 6.93297 3.49513 5.5802 3.23498 4.48757C3.07889 4.01928 3.39107 3.49898 3.85934 3.34291C4.53573 3.1348 4.74384 2.25029 4.22355 1.72999L2.76671 0.273156C2.35047 -0.0910521 1.72612 -0.0910521 1.36191 0.273156L0.373342 1.26172C-0.615225 2.30232 0.477401 5.0599 2.9228 7.5053C5.3682 9.9507 8.12578 11.0954 9.16638 10.0548L10.1549 9.06619C10.5192 8.64995 10.5192 8.0256 10.1549 7.66139Z" className="fill-black transition-colors group-hover:fill-white"/>
            </g>
            <defs><clipPath id="call"><rect width="10.4393" height="10.4393" fill="white"/></clipPath></defs>
          </svg>
          CALL
        </button>
      </div>

      {/* Experience row */}
      <div className="relative px-[18px] pb-[10px]">
        <div className="flex items-center justify-center gap-3 px-[20px] py-1 rounded-[10px] bg-[rgba(255,111,0,0.09)]">
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <g clipPath="url(#star)">
                <path d="M11.3554 4.30853C11.2808 4.08105 11.0764 3.91948 10.8344 3.89797L7.54841 3.60355L6.24902 0.602537C6.15321 0.382601 5.93501 0.240234 5.69257 0.240234C5.45014 0.240234 5.23194 0.382601 5.13613 0.603051L3.83674 3.60355L0.55019 3.89797C0.30871 3.92 0.104756 4.08105 0.0297926 4.30853C-0.0451703 4.536 0.0240596 4.78551 0.206733 4.94279L2.69058 7.09226L1.95815 10.2758C1.90456 10.5099 1.99663 10.7519 2.19347 10.8923C2.29927 10.9677 2.42305 11.0061 2.54787 11.0061C2.65549 11.0061 2.76225 10.9775 2.85806 10.9209L5.69257 9.24928L8.52605 10.9209C8.73339 11.044 8.99476 11.0328 9.19116 10.8923C9.38808 10.7515 9.48007 10.5094 9.42647 10.2758L8.69404 7.09226L11.1779 4.94322C11.3606 4.78551 11.4303 4.53643 11.3554 4.30853Z" fill="#FF6F00"/>
              </g>
              <defs><clipPath id="star"><rect width="11.385" height="11.2341" fill="white"/></clipPath></defs>
            </svg>
            <span className="font-euclid text-[10px] text-text-subtle whitespace-nowrap">{specialty}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.78381 1.3297L8.15141 2.28502C8.16245 2.31375 8.18819 2.33218 8.21927 2.33367L9.25363 2.38343C9.32397 2.38681 9.35278 2.47427 9.29787 2.5178L8.49069 3.15798C8.46643 3.17722 8.4566 3.20708 8.46476 3.2367L8.73645 4.22275C8.75492 4.2898 8.67956 4.34387 8.62062 4.30578L7.75416 3.74612C7.72811 3.72931 7.69633 3.72931 7.67028 3.74612L6.80382 4.30581C6.74491 4.34387 6.66953 4.28983 6.68799 4.22278L6.95968 3.2367C6.96784 3.20705 6.95804 3.17722 6.93375 3.15798L6.12657 2.5178C6.07166 2.47427 6.10047 2.38681 6.17081 2.38343L7.20517 2.33367C7.23628 2.33218 7.26199 2.31375 7.27303 2.28502L7.6406 1.3297C7.66549 1.2651 7.75898 1.2651 7.78381 1.3297Z" fill="#FF6F00"/>
            </svg>
            <span className="font-euclid text-[10px] text-text-subtle whitespace-nowrap">{experienceLabel} Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
}