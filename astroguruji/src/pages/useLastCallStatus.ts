import { useEffect, useRef } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/firebase";
import { lastCallList } from "@/https_service";
import { useChat } from "./ChatContext";
import { useAudioCall } from "./AudioCallContext";

export function useLastCallStatus() {
  const chatCtx  = useChat();
  const audioCtx = useAudioCall();
  const chatCtxRef  = useRef(chatCtx);
  const audioCtxRef = useRef(audioCtx);

  useEffect(() => { chatCtxRef.current  = chatCtx;  }, [chatCtx]);
  useEffect(() => { audioCtxRef.current = audioCtx; }, [audioCtx]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    let fbUnsub: (() => void) | null = null;

    async function check() {
      try {
        console.log("[useLastCallStatus] calling lastCallList...");
        const res = await lastCallList();
        console.log("[useLastCallStatus] result:", res?.result, "status:", res?.data2?.status, "callType:", res?.data2?.callType, "channelId:", res?.data2?.channelId);

        if (cancelled || !res?.result || !res.data2) return;

const d         = res.data2;
const status    = String(d.status        ?? d.status        ?? "");
const callType  = String(d.callType      ?? d.call_type     ?? "").toLowerCase();
const channelId = String(d.channelId     ?? d.channel_id    ?? "");
const astroId   = d.astroId              ?? d.astro_id      ?? "";
const astroName = d.astroName            ?? d.astro_name    ?? "";
const astroImg  = d.astroProfileImg      ?? d.astro_profile_img ?? "";
const userName  = d.userName             ?? d.user_name     ?? "";
const callRate  = d.callRate             ?? d.call_rate     ?? "1";
const totalAmt  = d.totalAmount          ?? d.total_amount  ?? "0";
const diff      = d.difference           ?? d.difference    ?? null;
const fbChannel = d.fbChannelId          ?? d.fb_channel_id ?? "";

console.log("[useLastCallStatus] mapped:", { status, callType, channelId, astroId });
        if (status !== "accept_astro" || !channelId) {
          console.log("[useLastCallStatus] no active session, status:", status);
          return;
        }

        const rate   = String(d.callRate    ?? "1");
        const wallet = String(d.totalAmount ?? "0");

        const info = {
          gid:             channelId,
          fbchannelID:     channelId,
          astrologer_id:   String(d.astroId        ?? ""),
          astroName:       String(d.astroName       ?? ""),
          astrologerImage: String(d.astroProfileImg ?? ""),
          rate,
          wallet,
          name:   String(d.userName ?? ""),
          gender: "", dob: "", tob: "", place: "",
        };

        // ── CHAT ────────────────────────────────────────────────────────
        if (callType === "chat") {
          console.log("[useLastCallStatus] chat session found, subscribing Firebase...");

          // Fallback from API difference field
          const fallbackSeconds = d.difference
            ? Math.max(Math.floor(Number(d.difference) * 60), 0)
            : 300;

          // Subscribe Firebase CallSession for live time
          const sessionRef = ref(db, `CallSession/${channelId}`);
          let started = false;
const handler = onValue(sessionRef, (snap) => {
  if (cancelled) return;
  const data = snap.val();
  console.log("[useLastCallStatus] Firebase data:", data);

  if (data) {
    const fbStatus   = String(data.status      ?? "");
    const maxMinutes = data.max_minutes;   // remaining minutes from server
    const lastTick   = data.last_tick_at;  // ms when last debit happened
    const startedAt  = data.started_at;   // ms when astrologer accepted

    // Server ended — don't start
    if (["end_astro", "end_user", "wallet_empty", "rejected"].includes(fbStatus)) {
      console.log("[useLastCallStatus] already ended:", fbStatus);
      if (fbUnsub) { fbUnsub(); fbUnsub = null; }
      return;
    }

    let accurateSeconds = 0;

    if (maxMinutes != null) {
      // Most accurate — server just debited, here's what's left
      accurateSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);

      if (lastTick) {
        // Subtract seconds elapsed since last server tick
        const elapsedSinceTick = Math.floor((Date.now() - Number(lastTick)) / 1000);
        accurateSeconds = Math.max(accurateSeconds - elapsedSinceTick, 0);
      }

      console.log("[useLastCallStatus] accurate seconds from max_minutes:", accurateSeconds);

    } else if (startedAt) {
      // First tick — no debit yet, calculate from wallet / rate
      const rate   = parseFloat(callRate) || 1;
      const wallet = parseFloat(totalAmt) || 0;
      const maxSec = Math.floor((wallet / rate) * 60);
      const elapsedSinceStart = Math.floor((Date.now() - Number(startedAt)) / 1000);
      accurateSeconds = Math.max(maxSec - elapsedSinceStart, 0);

      console.log("[useLastCallStatus] accurate seconds from started_at:", accurateSeconds);

    } else {
      // No Firebase data yet — use API fallback
      accurateSeconds = fallbackSeconds;
      console.log("[useLastCallStatus] using API fallback:", accurateSeconds);
    }

    chatCtxRef.current.startChatTimer(info, accurateSeconds);
    started = true;
    if (fbUnsub) { fbUnsub(); fbUnsub = null; } // one-time read, ChatContext takes over
    return;
  }

  // Firebase node empty — use API fallback
  if (!started) {
    console.log("[useLastCallStatus] no Firebase node, using fallback:", fallbackSeconds);
    chatCtxRef.current.startChatTimer(info, fallbackSeconds);
    started = true;
    if (fbUnsub) { fbUnsub(); fbUnsub = null; }
  }
}, (err) => {
  console.error("[useLastCallStatus] Firebase error:", err);
  if (!started) {
    chatCtxRef.current.startChatTimer(info, fallbackSeconds);
    started = true;
  }
});

          fbUnsub = () => off(sessionRef, "value", handler);
        }

        // ── AUDIO / VIDEO ────────────────────────────────────────────────
        if (callType === "audio" || callType === "video") {
          if (audioCtxRef.current.callInfo?.channelId === channelId) return;
          console.log("[useLastCallStatus] restoring audio/video call");
          audioCtxRef.current.startCall({
            channelId,
            astrologerId: String(d.astroId        ?? ""),
            astroName:    String(d.astroName       ?? ""),
            astroImage:   String(d.astroProfileImg ?? ""),
            rate,
            wallet,
          });
        }

      } catch (err) {
        console.error("[useLastCallStatus] error:", err);
      }
    }

    check();

    return () => {
      cancelled = true;
      if (fbUnsub) { fbUnsub(); fbUnsub = null; }
    };
  }, []);
}