/**
 * ChatContext.tsx  — Fixed
 *
 * Root cause of "shows maximum duration everywhere":
 *   startChatTimer() was resetting chatTimeLeft to initialSeconds whenever called,
 *   even if a session for the same gid was already ticking. The guard in ChatScreen
 *   (`if chatActive && chatInfo?.gid === gid return`) could miss if chatInfo was
 *   briefly null mid-render, causing a full reset back to max duration.
 *
 * Fix: startChatTimer checks the gid ref directly (never null mid-render).
 *   If the same gid is already active, it simply skips — no reset, no restart.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

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
  chatTimeLeft: number;
  startChatTimer: (info: ActiveChatInfo, initialSeconds: number) => void;
  stopChatTimer: () => void;
};

// ─── Storage key ──────────────────────────────────────────────────────────────

const SESSION_KEY = "active_chat_session";

// ─── sessionStorage helpers ───────────────────────────────────────────────────

type PersistedSession = ActiveChatInfo & { timeLeft: number; savedAt: number };

function saveSession(info: ActiveChatInfo, timeLeft: number): void {
  try {
    const payload: PersistedSession = { ...info, timeLeft, savedAt: Date.now() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch { /* quota errors */ }
}

function clearSession(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

function restoreSession(): { info: ActiveChatInfo; timeLeft: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: PersistedSession = JSON.parse(raw);

    if (
      !parsed?.gid ||
      !parsed?.astrologer_id ||
      typeof parsed.timeLeft !== "number" ||
      typeof parsed.savedAt !== "number"
    ) {
      clearSession();
      return null;
    }

    // Correct for time elapsed while tab was closed / navigating
    const elapsedSeconds = Math.floor((Date.now() - parsed.savedAt) / 1000);
    const correctedTimeLeft = parsed.timeLeft - elapsedSeconds;

    if (correctedTimeLeft <= 0) {
      clearSession();
      return null;
    }

    const info: ActiveChatInfo = {
      gid:             parsed.gid,
      fbchannelID:     parsed.fbchannelID     || "",
      astrologer_id:   parsed.astrologer_id   || "",
      astroName:       parsed.astroName       || "",
      astrologerImage: parsed.astrologerImage || "",
      rate:            parsed.rate            || "0",
      wallet:          parsed.wallet          || "0",
      name:            parsed.name            || "",
      gender:          parsed.gender          || "",
      dob:             parsed.dob             || "",
      tob:             parsed.tob             || "",
      place:           parsed.place           || "",
    };

    return { info, timeLeft: correctedTimeLeft };
  } catch {
    clearSession();
    return null;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [initialised] = useState<{ info: ActiveChatInfo | null; timeLeft: number }>(() => {
    const saved = restoreSession();
    return saved ? { info: saved.info, timeLeft: saved.timeLeft } : { info: null, timeLeft: 0 };
  });

  const [chatActive, setChatActive]     = useState<boolean>(!!initialised.info);
  const [chatInfo, setChatInfo]         = useState<ActiveChatInfo | null>(initialised.info);
  const [chatTimeLeft, setChatTimeLeft] = useState<number>(initialised.timeLeft);

  const chatInfoRef    = useRef<ActiveChatInfo | null>(initialised.info);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  // ── KEY FIX: track active gid in a ref so startChatTimer never misses it ──
  const activeGidRef   = useRef<string | null>(initialised.info?.gid ?? null);

  useEffect(() => {
    chatInfoRef.current = chatInfo;
  }, [chatInfo]);

  // ── Single global interval ─────────────────────────────────────────────────
  useEffect(() => {
    if (!chatActive) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;

        const info = chatInfoRef.current;
        if (info) saveSession(info, next);

        if (next <= 0) {
          clearInterval(timerRef.current!);
          timerRef.current  = null;
          activeGidRef.current = null;
          setChatActive(false);
          setChatInfo(null);
          clearSession();
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

  // ── Public API ─────────────────────────────────────────────────────────────

  const startChatTimer = useCallback(
    (info: ActiveChatInfo, initialSeconds: number) => {
      // ── KEY FIX: if this exact gid is already running, do NOT reset ────────
      // This prevents re-mount of ChatScreen from resetting the timer to max.
      if (activeGidRef.current === info.gid) {
        // Session already ticking — just make sure info is up-to-date
        chatInfoRef.current = info;
        setChatInfo(info);
        return;
      }

      // New session — stop any existing timer and start fresh
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      activeGidRef.current = info.gid;
      chatInfoRef.current  = info;
      setChatInfo(info);
      setChatTimeLeft(initialSeconds);
      saveSession(info, initialSeconds);
      setChatActive(true);
    },
    []
  );

  const stopChatTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    activeGidRef.current = null;
    chatInfoRef.current  = null;
    setChatActive(false);
    setChatInfo(null);
    setChatTimeLeft(0);
    clearSession();
  }, []);

  return (
    <ChatContext.Provider
      value={{ chatActive, chatInfo, chatTimeLeft, startChatTimer, stopChatTimer }}
    >
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