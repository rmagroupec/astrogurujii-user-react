/**
 * agoraManager.ts
 *
 * Module-level singleton that keeps the Agora client alive
 * even when AudioCallScreen unmounts (back button / minimize).
 *
 * This is the only way to keep audio running across navigation —
 * React refs die with the component, but module-level objects persist.
 */

import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";

const AGORA_APP_ID = "8782e154141a4c0bbc8acaa3004d21f2";

// ── Singleton state ────────────────────────────────────────────────────────────
let client:      IAgoraRTCClient  | null = null;
let localTrack:  ILocalAudioTrack | null = null;
let remoteTrack: IRemoteAudioTrack | null = null;
let activeChannel: string | null = null;

// Callbacks the screen can subscribe to
type Listeners = {
  onUserJoined?:    () => void;
  onAudioStarted?:  () => void;  // remote audio published → truly connected
  onUserLeft?:      () => void;
  onError?:         (msg: string) => void;
};

let listeners: Listeners = {};

export const agoraManager = {

  get isConnected() { return !!client && !!remoteTrack; },
  get channelId()   { return activeChannel; },
  get isMuted()     { return localTrack?.muted ?? false; },

  /** Called by AudioCallScreen on mount */
  setListeners(l: Listeners) { listeners = l; },
  clearListeners()            { listeners = {}; },

  /** Join channel and publish mic. Safe to call even if already in channel. */
  async join(channelId: string, token: string): Promise<void> {
    // Already in this channel — just re-attach listeners (resume case)
    if (client && activeChannel === channelId) {
      console.log("[agoraManager] already in channel, re-attaching listeners");
      // If remote track already playing, fire onAudioStarted immediately
      if (remoteTrack) listeners.onAudioStarted?.();
      return;
    }

    // Clean up previous session if different channel
    await agoraManager.leave();

    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    activeChannel = channelId;

    client.on("user-joined", () => {
      console.log("[agoraManager] user-joined");
      listeners.onUserJoined?.();
    });

    client.on("user-published", async (user, mediaType) => {
      if (!client) return;
      await client.subscribe(user, mediaType);
      if (mediaType === "audio" && user.audioTrack) {
        remoteTrack = user.audioTrack;
        user.audioTrack.play();
        console.log("[agoraManager] remote audio playing");
        listeners.onAudioStarted?.();
      }
    });

    client.on("user-unpublished", (user) => {
      user.audioTrack?.stop();
      remoteTrack = null;
    });

    client.on("user-left", () => {
      console.log("[agoraManager] user-left");
      remoteTrack = null;
      listeners.onUserLeft?.();
    });

    try {
      await client.join(AGORA_APP_ID, channelId, token, null);
      localTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([localTrack]);
      console.log("[agoraManager] joined and published");
    } catch (err: any) {
      console.error("[agoraManager] join error:", err);
      let msg = "Could not connect to call server.";
      if (err?.message?.includes("CAN_NOT_GET_GATEWAY_SERVER")) msg = "Token rejected. Check App ID / Certificate.";
      else if (err?.message?.includes("INVALID_TOKEN"))  msg = "Invalid Agora token.";
      else if (err?.message?.includes("TOKEN_EXPIRED"))  msg = "Token expired. Try again.";
      listeners.onError?.(msg);
      throw err;
    }
  },

  /** Fully disconnect and clean up — called only on true end */
  async leave(): Promise<void> {
    try {
      localTrack?.stop(); localTrack?.close(); localTrack = null;
      remoteTrack?.stop(); remoteTrack = null;
      await client?.leave(); client = null;
      activeChannel = null;
      console.log("[agoraManager] left channel");
    } catch { /* silent */ }
  },

  async setMuted(muted: boolean) {
    try { await localTrack?.setMuted(muted); } catch { /* silent */ }
  },

  async setHold(hold: boolean) {
    try {
      await localTrack?.setMuted(hold);
      for (const u of client?.remoteUsers ?? []) {
        if (u.audioTrack) hold ? u.audioTrack.stop() : u.audioTrack.play();
      }
    } catch { /* silent */ }
  },

  async setSpeaker(speaker: boolean) {
    try {
      if (remoteTrack) {
        const devs = await AgoraRTC.getPlaybackDevices();
        if (devs.length > 1) {
          const t = speaker
            ? devs.find(d => d.label.toLowerCase().includes("speaker")) ?? devs[0]
            : devs.find(d => d.label.toLowerCase().includes("earpiece") || d.label.toLowerCase().includes("receiver")) ?? devs[1];
          await remoteTrack.setPlaybackDevice(t.deviceId);
        }
      }
    } catch { /* silent */ }
  },
};