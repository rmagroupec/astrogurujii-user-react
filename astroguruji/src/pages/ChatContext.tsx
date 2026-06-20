/**
 * ChatContext.tsx
 *
 * Timer logic mirrors Flutter ChatProvider exactly:
 *  - Firebase CallSession.started_at → calculate elapsed seconds (stopwatch up)
 *  - Firebase CallSession.max_minutes → calculate remaining seconds (countdown)
 *  - Every debit tick updates max_minutes + last_tick_at for drift correction
 *  - status end_astro/end_user/wallet_empty → stop everything
 *
 * No sessionStorage — restored via useLastCallStatus on mount.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActiveChatInfo = {
  gid: string;
  fbchannelID: string;
  astrologer_id: string;
  astroName: string;
  astrologerImage: string;
  rate: string;
  wallet: string;
  name: string;
  gender: string;
  dob: string;
  tob: string;
  place: string;
};

type ChatContextType = {
  chatActive: boolean;
  chatInfo: ActiveChatInfo | null;
  chatTimeLeft: number;       // countdown seconds remaining
  startChatTimer: (info: ActiveChatInfo, initialSeconds: number) => void;
  stopChatTimer: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: React.ReactNode }) {

  // No sessionStorage — useLastCallStatus restores on mount
  const [chatActive,   setChatActive]   = useState(false);
  const [chatInfo,     setChatInfo]     = useState<ActiveChatInfo | null>(null);
  const [chatTimeLeft, setChatTimeLeft] = useState(0);

  const chatInfoRef    = useRef<ActiveChatInfo | null>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeGidRef   = useRef<string | null>(null);
  const firebaseSubRef = useRef<(() => void) | null>(null);

  useEffect(() => { chatInfoRef.current = chatInfo; }, [chatInfo]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current)      clearInterval(timerRef.current);
      if (firebaseSubRef.current) firebaseSubRef.current();
    };
  }, []);

  // ── Local countdown interval ───────────────────────────────────────────────
  useEffect(() => {
    if (!chatActive) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          // Time ran out locally — clean up
          clearInterval(timerRef.current!);
          timerRef.current     = null;
          activeGidRef.current = null;
          chatInfoRef.current  = null;
          if (firebaseSubRef.current) {
            firebaseSubRef.current();
            firebaseSubRef.current = null;
          }
          setChatActive(false);
          setChatInfo(null);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [chatActive]);

  // ── Internal: subscribe Firebase CallSession ───────────────────────────────
  const subscribeFirebase = useCallback((channelId: string) => {
    // Unsubscribe any previous listener
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }

    const sessionRef = ref(db, `CallSession/${channelId}`);

    const handler = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const status     = String(data.status     ?? "");
      const maxMinutes = data.max_minutes;   // remaining minutes (updated every debit tick)
      const lastTick   = data.last_tick_at;  // ms timestamp of last server debit tick
      const startedAt  = data.started_at;
      const secondsRemaining = data.seconds_remaining;  // change from max_minutes

      console.log("[ChatContext] Firebase CallSession:", { status, maxMinutes, lastTick, startedAt });

      // ── Server ended the session ─────────────────────────────────────────
      if (["end_astro", "end_user", "wallet_empty", "rejected"].includes(status)) {
        console.log("[ChatContext] Firebase ended session:", status);
        setTimeout(() => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (firebaseSubRef.current) {
            firebaseSubRef.current();
            firebaseSubRef.current = null;
          }
          activeGidRef.current = null;
          chatInfoRef.current  = null;
          setChatTimeLeft(0);
          setChatActive(false);
          setChatInfo(null);
        }, 2000); // 2s grace so UI can react (show rating dialog etc.)
        return;
      }

      // ── Sync countdown from server ────────────────────────────────────────
      // Server sends max_minutes = remaining minutes after each debit tick
      // last_tick_at = when that debit happened
      // So accurate remaining = (max_minutes * 60) - seconds elapsed since last_tick_at

      if (secondsRemaining != null && lastTick != null) {
        const elapsedSinceTick = Math.floor((Date.now() - Number(lastTick)) / 1000);
        const accurate = Math.max(Number(secondsRemaining) - elapsedSinceTick, 0);

        setChatTimeLeft(prev => Math.abs(prev - accurate) > 5 ? accurate : prev);
      }
      if (maxMinutes != null) {
        let serverSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);

        if (lastTick) {
          const elapsedSinceTick = Math.floor((Date.now() - Number(lastTick)) / 1000);
          serverSeconds = Math.max(serverSeconds - elapsedSinceTick, 0);
        }

        setChatTimeLeft((prev) => {
          // Only correct if drift > 30 seconds to avoid jitter
          if (Math.abs(prev - serverSeconds) > 30) {
            console.log(`[ChatContext] Correcting timer drift: local=${prev}s server=${serverSeconds}s`);
            return serverSeconds;
          }
          return prev;
        });
      }

      // ── Fallback: if no max_minutes but we have started_at, use wallet ────
      // This handles the initial accept_astro tick before first debit
      if (maxMinutes == null && startedAt) {
        const info = chatInfoRef.current;
        if (info) {
          const rate   = parseFloat(info.rate   || "1");
          const wallet = parseFloat(info.wallet || "0");
          if (rate > 0 && wallet > 0) {
            const maxSeconds = Math.floor((wallet / rate) * 60);
            const elapsedSinceStart = Math.floor((Date.now() - Number(startedAt)) / 1000);
            const remaining = Math.max(maxSeconds - elapsedSinceStart, 0);
            setChatTimeLeft((prev) => {
              if (Math.abs(prev - remaining) > 30) {
                console.log(`[ChatContext] Correcting via started_at: local=${prev}s remaining=${remaining}s`);
                return remaining;
              }
              return prev;
            });
          }
        }
      }
    });

    firebaseSubRef.current = () => off(sessionRef, "value", handler);
  }, []);

  // ── Public API ─────────────────────────────────────────────────────────────

  const startChatTimer = useCallback((info: ActiveChatInfo, initialSeconds: number) => {
    console.log("[ChatContext] startChatTimer:", {
      gid: info.gid,
      initialSeconds,
      currentGid: activeGidRef.current,
    });

    // Same session already running — update time (Firebase correction) + info
    if (activeGidRef.current === info.gid) {
      chatInfoRef.current = info;
      setChatInfo(info);
      setChatTimeLeft(initialSeconds);
      return;
    }

    // Stop existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Set new session state
    activeGidRef.current = info.gid;
    chatInfoRef.current  = info;
    setChatInfo(info);
    setChatTimeLeft(initialSeconds);
    setChatActive(true);

    // Subscribe Firebase for live sync
    // Use fbchannelID if available, otherwise gid (they're the same in your setup)
    const channelId = info.fbchannelID || info.gid;
    subscribeFirebase(channelId);
  }, [subscribeFirebase]);

  const stopChatTimer = useCallback(() => {
    console.log("[ChatContext] stopChatTimer");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }
    activeGidRef.current = null;
    chatInfoRef.current  = null;
    setChatActive(false);
    setChatInfo(null);
    setChatTimeLeft(0);
  }, []);

  return (
    <ChatContext.Provider value={{ chatActive, chatInfo, chatTimeLeft, startChatTimer, stopChatTimer }}>
      {children}
    </ChatContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChat(): ChatContextType {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}