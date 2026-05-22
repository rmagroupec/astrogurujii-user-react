/**
 * ChatContext.tsx
 *
 * Global context for chat session — keeps timer running even when
 * ChatScreen unmounts (user navigates away). Completely separate from
 * AudioCallContext which is only for Agora audio calls.
 */

import React, {
  createContext, useContext, useState,
  useCallback, useRef, useEffect,
} from "react";

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
  chatActive:   boolean;
  chatInfo:     ActiveChatInfo | null;
  chatTimeLeft: number;           // seconds remaining — ticks globally
  startChatTimer: (info: ActiveChatInfo, initialSeconds: number) => void;
  stopChatTimer:  () => void;     // call on end / rating submit
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatActive,   setChatActive]   = useState(false);
  const [chatInfo,     setChatInfo]     = useState<ActiveChatInfo | null>(null);
  const [chatTimeLeft, setChatTimeLeft] = useState(0);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatInfoRef = useRef<ActiveChatInfo | null>(null);

  // Keep ref in sync so the interval closure is never stale
  useEffect(() => { chatInfoRef.current = chatInfo; }, [chatInfo]);

  // The single global interval — survives page navigation
  useEffect(() => {
    if (!chatActive) return;

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;

        // Persist to sessionStorage every tick
        const info = chatInfoRef.current;
        if (info) {
          try {
            sessionStorage.setItem("active_chat_session", JSON.stringify({
              timeLeft:        next,
              gid:             info.gid,
              fbchannelID:     info.fbchannelID,
              astrologer_id:   info.astrologer_id,
              astroName:       info.astroName,
              astrologerImage: info.astrologerImage,
              rate:            info.rate,
              wallet:          info.wallet,
              name:            info.name,
              gender:          info.gender,
              dob:             info.dob,
              tob:             info.tob,
              place:           info.place,
            }));
          } catch { /* ignore */ }
        }

        if (next <= 0) {
          // Time expired — clean up
          clearInterval(timerRef.current!);
          setChatActive(false);
          setChatInfo(null);
          sessionStorage.removeItem("active_chat_session");
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chatActive]); // only re-runs when chatActive flips

  const startChatTimer = useCallback((info: ActiveChatInfo, initialSeconds: number) => {
    // Stop any existing timer first
    if (timerRef.current) clearInterval(timerRef.current);

    chatInfoRef.current = info;
    setChatInfo(info);
    setChatTimeLeft(initialSeconds);
    setChatActive(true);
  }, []);

  const stopChatTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setChatActive(false);
    setChatInfo(null);
    setChatTimeLeft(0);
    sessionStorage.removeItem("active_chat_session");
  }, []);

  return (
    <ChatContext.Provider value={{
      chatActive, chatInfo, chatTimeLeft,
      startChatTimer, stopChatTimer,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}