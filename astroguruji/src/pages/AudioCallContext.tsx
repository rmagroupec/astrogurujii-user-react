/**
 * AudioCallContext.tsx
 *
 * Global context for active audio call state.
 * Restore logic is handled by useLastCallStatus hook (same pattern as chat).
 *
 * KEY: When call is minimized (floating bar), context ticks elapsed seconds
 * internally so the bar shows a live timer even without AudioCallScreen open.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type CallStatus =
  | "idle"
  | "connecting"
  | "ringing"
  | "connected"
  | "on_hold"
  | "ended";

export type ActiveCallInfo = {
  channelId: string;
  astrologerId: string;
  astroName: string;
  astroImage: string;
  rate: string;
  wallet: string;
};

type AudioCallContextType = {
  callStatus: CallStatus;
  callInfo: ActiveCallInfo | null;
  elapsedSeconds: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isMinimized: boolean;
  startCall: (info: ActiveCallInfo) => void;
  setCallStatus: (s: CallStatus) => void;
  setElapsedSeconds: (n: number) => void;
  setIsMuted: (v: boolean) => void;
  setIsSpeakerOn: (v: boolean) => void;
  minimize: () => void;
  maximize: () => void;
  endCall: () => void;
};

const AudioCallContext = createContext<AudioCallContextType | null>(null);

export function AudioCallProvider({ children }: { children: React.ReactNode }) {
  const [callStatus,     _setCallStatus]    = useState<CallStatus>("idle");
  const [callInfo,       setCallInfo]       = useState<ActiveCallInfo | null>(null);
  const [elapsedSeconds, _setElapsedSeconds] = useState(0);
  const [isMuted,        setIsMuted]        = useState(false);
  const [isSpeakerOn,    setIsSpeakerOn]    = useState(false);
  const [isMinimized,    setIsMinimized]    = useState(false);

  // Internal ref so the ticker always reads the latest value
  const elapsedRef   = useRef(0);
  const tickerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStatusRef = useRef<CallStatus>("idle");

  const setElapsedSeconds = useCallback((n: number) => {
    elapsedRef.current = n;
    _setElapsedSeconds(n);
  }, []);

  // ─── Ticker: runs when minimized + connected ───────────────────────────────
  // AudioCallScreen ticks elapsed itself when open.
  // When minimized, the context takes over so the floating bar stays live.
  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  useEffect(() => {
    if (isMinimized && callStatus === "connected") {
      // Start ticking from current elapsed
      if (tickerRef.current) clearInterval(tickerRef.current);
      tickerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        _setElapsedSeconds(elapsedRef.current);
      }, 1000);
    } else {
      // AudioCallScreen is open — it manages the timer, stop the context ticker
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    }
    return () => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    };
  }, [isMinimized, callStatus]);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const startCall = useCallback((info: ActiveCallInfo) => {
    setCallInfo(info);
    _setCallStatus("connecting");
    elapsedRef.current = 0;
    _setElapsedSeconds(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsMinimized(false);
  }, []);

  const setCallStatus = useCallback((s: CallStatus) => {
    _setCallStatus(s);
  }, []);

  const minimize = useCallback(() => setIsMinimized(true), []);
  const maximize = useCallback(() => setIsMinimized(false), []);

  const endCall = useCallback(() => {
    _setCallStatus("idle");
    setCallInfo(null);
    elapsedRef.current = 0;
    _setElapsedSeconds(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsMinimized(false);
  }, []);

  return (
    <AudioCallContext.Provider
      value={{
        callStatus,
        callInfo,
        elapsedSeconds,
        isMuted,
        isSpeakerOn,
        isMinimized,
        startCall,
        setCallStatus,
        setElapsedSeconds,
        setIsMuted,
        setIsSpeakerOn,
        minimize,
        maximize,
        endCall,
      }}
    >
      {children}
    </AudioCallContext.Provider>
  );
}

export function useAudioCall() {
  const ctx = useContext(AudioCallContext);
  if (!ctx) throw new Error("useAudioCall must be used inside AudioCallProvider");
  return ctx;
}