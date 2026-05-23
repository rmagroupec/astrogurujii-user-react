/**
 * ConsultantCard.tsx
 *
 * Field names from REAL API response (is_chat_online NOT isChatOnline):
 *   is_chat_online   : "on" | "off"
 *   is_voice_online  : "on" | "off"
 *   is_video_online  : "on" | "off"
 *   is_busy          : 0 | 1  (number)
 *   is_Follow        : "1" | "0"  (string)
 *   watting_time     : number
 *   per_min_chat, per_min_voice_call, per_min_video_call : number
 *   per_min_chat_offer, per_min_voice_call_offer         : string (empty="" means no offer)
 *
 * Status logic mirrors Flutter TalkAstrologer2 exactly:
 *
 *   setBorderColorChat(Online, is_busy):
 *     "on" && 0  → red   (active/available border)
 *     "off"      → grey  (offline)
 *     busy==1    → amber (busy)
 *
 *   setTitle(Online, is_busy, title):
 *     "on"&&0&&"CHAT NOW" → "Chat"
 *     "on"&&0&&"Talk NOW" → "Call"
 *     "off"               → "Offline"
 *     busy==1             → "Notify me"
 *
 *   getColorImageBorder: green(online) / grey(offline) / red(busy)
 *   getColor:            green(online) / grey(offline) / red(busy)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConnectionModal from "@/components/v2/ConnectionModal";
import LoginModal from "@/components/v2/UserLoginModal";
import { profile_api } from "@/https_service";

const API_BASE_URL = "https://admin.astrogurujii.com";

function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  const isSkip = localStorage.getItem("is_skip");
  return !!token && isSkip !== "Y";
}

// ─── Flutter: setBorderColorChat(Online, is_busy) ─────────────────────────────
function setBorderColorChat(online: string, isBusy: number): string {
  if (online === "on" && isBusy === 0) return "#e53935"; // Colors.red in Flutter (active)
  if (online === "off") return "#9e9e9e";                // offlineColor → grey
  if (isBusy === 1) return "#f59e0b";                   // busyColor → amber
  return "#9e9e9e";
}

// ─── Flutter: setTitle(Online, is_busy, title) ────────────────────────────────
function setTitle(online: string, isBusy: number, title: string): string {
  if (online === "on" && isBusy === 0 && title === "CHAT NOW") return "Chat";
  if (online === "on" && isBusy === 0 && title === "Talk NOW") return "Call";
  if (online === "on" && isBusy === 0 && title === "Video Call") return "Video Call";
  if (online === "off") return "Offline";
  if (isBusy === 1) return "Notify me";
  return "Busy";
}

// ─── Flutter: setTitleStatus(Online, is_busy, callType) ──────────────────────
function setTitleStatus(online: string, isBusy: number, callType: string): string {
  if (online === "on" && isBusy === 0) return "Online";
  if (online !== "on") return "Offline";
  if (isBusy === 1) return "Busy";
  return "Busy";
}

// ─── Flutter: getColor(Online, is_busy, callType) ────────────────────────────
function getColor(online: string, isBusy: number): string {
  if (online === "on" && isBusy === 0) return "#34a853"; // green
  if (online !== "on") return "#9e9e9e";                 // grey
  if (isBusy === 1) return "#e53935";                   // red
  return "#e53935";
}

// ─── Flutter: getColorImageBorder(astro, is_busy) ────────────────────────────
function getColorImageBorder(online: string, isBusy: number): string {
  if (online === "on" && isBusy === 0) return "#34a853"; // green
  if (online !== "on") return "#9e9e9e";                 // grey
  if (isBusy === 1) return "#e53935";                   // red
  return "#e53935";
}

export default function ConsultantCard({
  consultant,
  showStatusBadge = false,
  callType = "chat",
  onFollowToggle,
}: Readonly<{
  consultant: any;
  showStatusBadge?: boolean;
  callType?: "chat" | "audio";
  onFollowToggle?: (id: string, followed: boolean) => void;
}>) {
  const navigate = useNavigate();

  const [followed, setFollowed] = useState(
    consultant.is_Follow === "1" || consultant.is_Follow === "yes"
  );
  const [followLoading, setFollowLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [userWallet, setUserWallet] = useState(0);
  const [notified, setNotified] = useState(false);

  // ─── Real API field names (snake_case from actual response) ──────────────
  const isChatOnline: string  = consultant.is_chat_online ?? "off";
  const isVoiceOnline: string = consultant.is_voice_online ?? "off";
  const isBusy: number        = Number(consultant.is_busy ?? 0);

  // Pick the right online field per page type
  const onlineField = callType === "chat" ? isChatOnline : isVoiceOnline;

  // ─── Flutter logic functions applied ─────────────────────────────────────
  const borderColor      = setBorderColorChat(onlineField, isBusy);
  const buttonLabel      = callType === "chat"
    ? setTitle(onlineField, isBusy, "CHAT NOW")
    : setTitle(onlineField, isBusy, "Talk NOW");
  const statusLabel      = setTitleStatus(onlineField, isBusy, callType);
  const dotColor         = getColor(onlineField, isBusy);
  const avatarRingColor  = getColorImageBorder(onlineField, isBusy);

  // Badge bg class
  const badgeBg = onlineField === "on" && isBusy === 0
    ? "bg-[#34a853]"
    : isBusy === 1
    ? "bg-amber-500"
    : "bg-[#9e9e9e]";

  // ─── Pricing ──────────────────────────────────────────────────────────────
  const basePrice = callType === "chat"
    ? Number(consultant.per_min_chat ?? 0)
    : Number(consultant.per_min_voice_call ?? 0);

  const offerStr = callType === "chat"
    ? consultant.per_min_chat_offer
    : consultant.per_min_voice_call_offer;

  const offerPrice    = offerStr && offerStr !== "" ? parseFloat(offerStr) : null;
  const displayPrice  = offerPrice !== null ? offerPrice : basePrice;
  const originalPrice = offerPrice !== null ? basePrice : null;

  const specialty  = consultant.category?.map((c: any) => c.name).join(", ") ?? "";
  const location   = consultant.country ?? "India";
  const profileImg = consultant.profile_img ?? "";
  const modalRate  = offerPrice !== null ? offerPrice : basePrice;

  // ─── Flutter action condition ─────────────────────────────────────────────
  // chat:  is_busy==0 && is_chat_online=="on" → connect
  // audio: is_busy==0 && is_voice_online=="on" → connect
  const canConnect = isBusy === 0 && onlineField === "on";

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn()) { setShowLoginModal(true); return; }
    if (followLoading) return;
    const next = !followed;
    setFollowed(next);
    setFollowLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/user_api/follow_astro`,
        { astro_id: consultant.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onFollowToggle?.(String(consultant.id), next);
    } catch {
      setFollowed(!next);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleActionClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn()) { setShowLoginModal(true); return; }

    if (canConnect) {
      const res = await profile_api();
      if (res?.status && res.results) {
        const w = parseFloat(res.results.wallet ?? "0");
        setUserWallet(isNaN(w) ? 0 : w);
      }
      setConnectionModalOpen(true);
    } else {
      // callNotifyMeApi
      try {
        await axios.post(
          `${API_BASE_URL}/user_api/notify_me`,
          { astro_id: consultant.id },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } catch { /* silent */ }
      setNotified(true);
      setTimeout(() => setNotified(false), 3000);
    }
  };

  return (
    <>
      <div
        onClick={() => navigate(`/consultants/${consultant.id}`)}
        className="group relative w-full rounded-[10px] border border-[#DADADA] bg-white transition-all hover:border-brand-amber"
      >
        {/* Status badge */}
        {showStatusBadge && (
          <div className={`absolute left-[9px] top-[9px] z-10 rounded-[5px] ${badgeBg} px-3 py-1 font-poppins text-[10px] font-semibold text-white`}>
            {statusLabel}
          </div>
        )}

        {/* Avatar — ring colour = getColorImageBorder */}
        <div className="absolute -top-[45px] sm:-top-[63px] left-1/2 -translate-x-1/2">
          <div className="relative">
            <div
              className="rounded-full p-[3px]"
              style={{ backgroundColor: avatarRingColor }}
            >
              <img
                src={profileImg}
                alt={consultant.name}
                className="h-[84px] w-[84px] sm:h-[120px] sm:w-[120px] rounded-full border-2 border-white bg-gray-300 object-cover shadow-[0_4px_4px_0_rgba(0,0,0,0.05)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(consultant.name)}&background=FF6F00&color=fff&size=126`;
                }}
              />
            </div>

            {/* Follow badge */}
            <button
              onClick={handleFollowClick}
              disabled={followLoading}
              className={`absolute -bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-3 sm:px-4 py-[3px] font-poppins text-[9px] sm:text-[10px] font-semibold text-white transition-colors
                ${followed ? "bg-brand-orange" : "bg-gray-400 group-hover:bg-brand-orange"}
                ${followLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {followed ? "✓ Followed" : "+ Follow"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-[10px] sm:px-[14px] pb-2 pt-[55px] sm:pt-[80px] text-center">
          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-poppins text-[12px] font-semibold text-brand-green">
              ₹{displayPrice}/Min
            </span>
            {originalPrice !== null && originalPrice > 0 && (
              <span className="font-poppins text-[10px] font-semibold text-text-disabled line-through">
                ₹{originalPrice}/Min
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="mt-2 font-euclid text-[16px] sm:text-[20px] font-bold text-black">
            {consultant.name}
          </h3>

          {/* Specialty */}
          <p className="mt-1 font-euclid text-[10px] text-text-subtle line-clamp-2">
            {specialty}
          </p>

          {/* Location */}
          <div className="mx-auto mt-2 flex items-center justify-center gap-1 border-y border-gray-200 py-[6px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <g clipPath="url(#loc)">
                <path d="M4.6572 0C2.73132 0 1.16406 1.5572 1.16406 3.47171C1.16406 6.19202 4.32884 9.0008 4.46352 9.11875C4.51903 9.16739 4.58811 9.19152 4.6572 9.19152C4.72628 9.19152 4.79537 9.16739 4.85087 9.11914C4.98555 9.0008 8.15033 6.19202 8.15033 3.47171C8.15033 1.5572 6.58308 0 4.6572 0ZM4.6572 5.36172C3.58713 5.36172 2.71657 4.5027 2.71657 3.44682C2.71657 2.39094 3.58713 1.53192 4.6572 1.53192C5.72726 1.53192 6.59783 2.39094 6.59783 3.44682C6.59783 4.5027 5.72726 5.36172 4.6572 5.36172Z" fill="black"/>
              </g>
              <defs><clipPath id="loc"><rect width="9.31503" height="9.19152" fill="white"/></clipPath></defs>
            </svg>
            <span className="font-euclid text-[11px] text-black">{location}</span>
          </div>

          {/* Busy wait time (mirrors Flutter durationToString) */}
          {isBusy === 1 && consultant.watting_time > 0 && (
            <p className="mt-1 font-poppins text-[10px] text-red-500">
              wait - {consultant.watting_time} m
            </p>
          )}

          {/* Notify Me feedback */}
          {notified && (
            <p className="mt-1 font-poppins text-[10px] text-green-600">
              You'll be notified when available!
            </p>
          )}

          {/* Online dot + label (mirrors Flutter status pill under avatar) */}
          <div className="mt-2 flex items-center justify-center gap-1">
            <span
              className="inline-block w-[7px] h-[7px] rounded-full"
              style={{ backgroundColor: dotColor, border: `2px solid ${dotColor}` }}
            />
            <span className="font-poppins text-[10px] font-medium" style={{ color: dotColor }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Action buttons — border/text colour = setBorderColorChat */}
        <div className="flex gap-[6px] sm:gap-[10px] px-[10px] sm:px-[20px] pb-[8px] pt-[4px]">

          {/* Primary: Chat / Call / Notify me */}
          <button
            onClick={handleActionClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-[20px] border-2 py-[8px] font-poppins text-[12px] font-semibold transition-colors"
            style={{ borderColor: borderColor, color: borderColor }}
          >
            {canConnect && callType === "chat" && (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <g clipPath="url(#ci)">
                  <path d="M7.82907 0.435547H2.60942C2.03283 0.436238 1.48005 0.665595 1.07233 1.07331C0.664618 1.48102 0.435261 2.0338 0.43457 2.6104V6.09016C0.435203 6.59134 0.608598 7.07697 0.925529 7.46521C1.24246 7.85346 1.68355 8.12056 2.17445 8.22152V9.56993C2.17444 9.64868 2.19581 9.72595 2.23627 9.79351C2.27674 9.86106 2.33478 9.91637 2.40422 9.95352C2.47365 9.99067 2.55187 10.0083 2.63053 10.0045C2.70918 10.0006 2.78532 9.97553 2.85083 9.93182L5.34974 8.26502H7.82907C8.40566 8.26433 8.95844 8.03497 9.36616 7.62725C9.77387 7.21954 10.0032 6.66676 10.0039 6.09016V2.6104C10.0032 2.0338 9.77387 1.48102 9.36616 1.07331C8.95844 0.665595 8.40566 0.436238 7.82907 0.435547Z" fill={borderColor}/>
                </g>
                <defs><clipPath id="ci"><rect width="10.4393" height="10.4393" fill="white"/></clipPath></defs>
              </svg>
            )}
            {canConnect && callType === "audio" && (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <g clipPath="url(#phi)">
                  <path d="M10.1549 7.66139L8.69811 6.20455C8.17781 5.68426 7.2933 5.8924 7.08519 6.56876C6.9291 7.03705 6.4088 7.2972 5.94053 7.19312C4.89993 6.93297 3.49513 5.5802 3.23498 4.48757C3.07889 4.01928 3.39107 3.49898 3.85934 3.34291C4.53573 3.1348 4.74384 2.25029 4.22355 1.72999L2.76671 0.273156C2.35047 -0.0910521 1.72612 -0.0910521 1.36191 0.273156L0.373342 1.26172C-0.615225 2.30232 0.477401 5.0599 2.9228 7.5053C5.3682 9.9507 8.12578 11.0954 9.16638 10.0548L10.1549 9.06619C10.5192 8.64995 10.5192 8.0256 10.1549 7.66139Z" fill={borderColor}/>
                </g>
                <defs><clipPath id="phi"><rect width="10.4393" height="10.4393" fill="white"/></clipPath></defs>
              </svg>
            )}
            {!canConnect && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={borderColor} strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            )}
            {buttonLabel}
          </button>

          {/* Second CALL button — only on chat page (original layout) */}
          {callType === "chat" && (
            <button
              onClick={handleActionClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-[8px] font-poppins text-[12px] font-semibold text-black transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <g clipPath="url(#ph2)">
                  <path d="M10.1549 7.66139L8.69811 6.20455C8.17781 5.68426 7.2933 5.8924 7.08519 6.56876C6.9291 7.03705 6.4088 7.2972 5.94053 7.19312C4.89993 6.93297 3.49513 5.5802 3.23498 4.48757C3.07889 4.01928 3.39107 3.49898 3.85934 3.34291C4.53573 3.1348 4.74384 2.25029 4.22355 1.72999L2.76671 0.273156C2.35047 -0.0910521 1.72612 -0.0910521 1.36191 0.273156L0.373342 1.26172C-0.615225 2.30232 0.477401 5.0599 2.9228 7.5053C5.3682 9.9507 8.12578 11.0954 9.16638 10.0548L10.1549 9.06619C10.5192 8.64995 10.5192 8.0256 10.1549 7.66139Z" className="fill-black transition-colors group-hover:fill-white"/>
                </g>
                <defs><clipPath id="ph2"><rect width="10.4393" height="10.4393" fill="white"/></clipPath></defs>
              </svg>
              CALL
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />

      {/* Connection Modal */}
      {connectionModalOpen && (
        <ConnectionModal
          isOpen={connectionModalOpen}
          onClose={() => setConnectionModalOpen(false)}
          astrologer={{
            id: String(consultant.id),
            name: consultant.name,
            profileImage: profileImg,
            ratePerMinute: modalRate,
          }}
          userWalletBalance={userWallet}
          callType={callType}
        />
      )}
    </>
  );
}