/**
 * AudioCallContext.tsx
 *
 * Global React context that holds the active audio call state.
 * This allows the minimized "Active Call Bar" to be visible on any page
 * while the user navigates — mirroring Flutter's floatingActionButton
 * on MainHomeScreenWithBottomNavigation.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export type CallStatus =
  | "idle"
  | "connecting"   // waiting for astrologer to accept
  | "ringing"      // call_initiate done, waiting for astrologer to join Agora
  | "connected"    // astrologer joined Agora channel
  | "on_hold"
  | "ended";

export type ActiveCallInfo = {
  channelId: string;       // Agora channel name (from call_initiate response)
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
  // Actions
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
  const [callStatus, _setCallStatus] = useState<CallStatus>("idle");
  const [callInfo, setCallInfo] = useState<ActiveCallInfo | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const startCall = useCallback((info: ActiveCallInfo) => {
    setCallInfo(info);
    _setCallStatus("connecting");
    setElapsedSeconds(0);
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
    setElapsedSeconds(0);
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