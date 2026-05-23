/**
 * ChatContext.tsx  — Production Grade
 *
 * Responsibilities:
 *  1. Keep a single global countdown timer alive across page navigations.
 *  2. Persist session to sessionStorage every tick so it survives page refresh.
 *  3. Restore session from sessionStorage on mount (fixes "no popup after revisit").
 *  4. Expose startChatTimer / stopChatTimer to ChatScreen & ActiveChatBar.
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
  chatTimeLeft: number; // seconds remaining — ticks globally
  startChatTimer: (info: ActiveChatInfo, initialSeconds: number) => void;
  stopChatTimer: () => void;
};

// ─── Storage key ──────────────────────────────────────────────────────────────

const SESSION_KEY = "active_chat_session";

// ─── sessionStorage helpers ───────────────────────────────────────────────────

type PersistedSession = ActiveChatInfo & { timeLeft: number; savedAt: number };

function saveSession(info: ActiveChatInfo, timeLeft: number): void {
  try {
    const payload: PersistedSession = {
      ...info,
      timeLeft,
      savedAt: Date.now(), // used to correct drift after tab close
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* quota errors — ignore */
  }
}

function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Read back the saved session and correct timeLeft for elapsed wall-clock time.
 * Returns null if there is nothing valid to restore.
 */
function restoreSession(): { info: ActiveChatInfo; timeLeft: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: PersistedSession = JSON.parse(raw);

    // Basic shape validation
    if (
      !parsed?.gid ||
      !parsed?.astrologer_id ||
      typeof parsed.timeLeft !== "number" ||
      typeof parsed.savedAt !== "number"
    ) {
      clearSession();
      return null;
    }

    // Correct for time that elapsed while the tab was closed / navigating
    const elapsedSeconds = Math.floor((Date.now() - parsed.savedAt) / 1000);
    const correctedTimeLeft = parsed.timeLeft - elapsedSeconds;

    if (correctedTimeLeft <= 0) {
      // Session already expired while the user was away
      clearSession();
      return null;
    }

    const info: ActiveChatInfo = {
      gid: parsed.gid,
      fbchannelID: parsed.fbchannelID || "",
      astrologer_id: parsed.astrologer_id || "",
      astroName: parsed.astroName || "",
      astrologerImage: parsed.astrologerImage || "",
      rate: parsed.rate || "0",
      wallet: parsed.wallet || "0",
      name: parsed.name || "",
      gender: parsed.gender || "",
      dob: parsed.dob || "",
      tob: parsed.tob || "",
      place: parsed.place || "",
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
  // Restore from sessionStorage synchronously on first render
  // so ActiveChatBar renders immediately without a flash
  const [initialised] = useState<{ info: ActiveChatInfo | null; timeLeft: number }>(() => {
    const saved = restoreSession();
    return saved
      ? { info: saved.info, timeLeft: saved.timeLeft }
      : { info: null, timeLeft: 0 };
  });

  const [chatActive, setChatActive] = useState<boolean>(!!initialised.info);
  const [chatInfo, setChatInfo] = useState<ActiveChatInfo | null>(initialised.info);
  const [chatTimeLeft, setChatTimeLeft] = useState<number>(initialised.timeLeft);

  // Ref so the interval closure always sees current info without re-creating it
  const chatInfoRef = useRef<ActiveChatInfo | null>(initialised.info);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep ref in sync
  useEffect(() => {
    chatInfoRef.current = chatInfo;
  }, [chatInfo]);

  // ── Single global interval ─────────────────────────────────────────────────
  useEffect(() => {
    if (!chatActive) return;

    // Clear any stale interval before starting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;

        // Persist every tick (with current timestamp for drift correction)
        const info = chatInfoRef.current;
        if (info) {
          saveSession(info, next);
        }

        if (next <= 0) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
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
  }, [chatActive]); // only restarts when chatActive flips true → false → true

  // ── Public API ─────────────────────────────────────────────────────────────

  const startChatTimer = useCallback(
    (info: ActiveChatInfo, initialSeconds: number) => {
      // Stop any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      chatInfoRef.current = info;
      setChatInfo(info);
      setChatTimeLeft(initialSeconds);
      saveSession(info, initialSeconds);
      // Setting chatActive last so the useEffect above fires with correct state
      setChatActive(true);
    },
    []
  );

  const stopChatTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    chatInfoRef.current = null;
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