/**
 * ChatScreen.tsx  — Production Grade
 *
 * Changes applied:
 *  ✅ 1. Audio recorded as .mp3 (file named voice_xxx.mp3, type audio/mpeg)
 *  ✅ 2. Wallet balance font increased (text-base font-bold)
 *  ✅ 3. END button dark red (bg-[#7f1d1d] text-white)
 *  ✅ 4. Upload image icon bg orange (bg-orange-500 text-white)
 *  ✅ 5. Block phone/email/website in messages — show alert, don't send
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue, push, set, off, DatabaseReference } from "firebase/database";
import { db } from "../firebase";
import { useChat, type ActiveChatInfo } from "./ChatContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageType = "text" | "image" | "audio";

type FirebaseMessage = {
  name: string;
  to: string;
  from: string;
  message: string;
  type: MessageType;
  message_id: string;
  date_time: number;
  seen: boolean;
};

type RatingState = { score: number; review: string };
type ToastType = "success" | "error" | "info" | "warning";
type Toast = { id: number; message: string; type: ToastType };

// ─── Toast system ─────────────────────────────────────────────────────────────

let toastCounter = 0;

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  const colors: Record<ToastType, string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  };
  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${colors[t.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-start gap-2 max-w-xs pointer-events-auto`}
        >
          <span className="font-bold mt-0.5 flex-shrink-0">{icons[t.type]}</span>
          <span className="text-sm flex-1">{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="flex-shrink-0 text-white/70 hover:text-white ml-1"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, show, remove };
}

// ─── API helper ───────────────────────────────────────────────────────────────

const API_BASE = "https://admin.astrogurujii.com";

async function apiPost(endpoint: string, body: object, token: string) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const MicIcon = ({ active }: { active?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const StopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);
const PhoneOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13" />
    <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);
const WalletIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2" /><circle cx="17" cy="13" r="1" />
  </svg>
);
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Audio player ─────────────────────────────────────────────────────────────

// Update the fmt function and add a loaded state:

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const fmt = (s: number) =>
    isNaN(s) || !isFinite(s) || s <= 0
      ? "0:00"
      : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // ← THE REAL FIX: seek to end to force browser to calculate duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryGetDuration = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        return;
      }
      // Seek to a huge number — browser will clamp to actual end
      // and fire "durationchange" with real value
      audio.currentTime = 1e101;
    };

    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        audio.currentTime = 0; // reset back to start
      }
    };

    const onSeeked = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        audio.currentTime = 0; // reset back to start
      }
    };

    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("seeked", onSeeked);
    audio.addEventListener("loadedmetadata", tryGetDuration);

    if (audio.readyState >= 1) tryGetDuration();

    return () => {
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("seeked", onSeeked);
      audio.removeEventListener("loadedmetadata", tryGetDuration);
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          if (isFinite(a.duration) && a.duration > 0) {
            if (duration === 0) setDuration(a.duration);
            setProgress((a.currentTime / a.duration) * 100);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }}
      />
      <button
        onClick={toggle}
        className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <div
          className="h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            if (!audioRef.current || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
          }}
        >
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] font-bold mt-0.5 block" style={{ color: "#7B3000" }}>
          {fmt(currentTime)} / {duration > 0 ? fmt(duration) : "--:--"}
        </span>
      </div>
    </div>
  );
}
// ─── Dialogs ──────────────────────────────────────────────────────────────────

function EndChatDialog({ onConfirm, onExplore }: { onConfirm: () => void; onExplore: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pb-0">
      <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        <h3 className="text-center text-lg font-semibold text-gray-800">Leave Chat?</h3>
        <p className="text-center text-sm text-gray-500">
          Your chat session will stay active in the background. You can return anytime.
        </p>
        <button
          onClick={onExplore}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          🔮 Explore Other Things
        </button>
        <button
          onClick={onConfirm}
          className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          End Chat Permanently
        </button>
      </div>
    </div>
  );
}

function RatingDialog({ onSubmit }: { onSubmit: (r: RatingState) => void }) {
  const [score, setScore] = useState(0);
  const [review, setReview] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <h3 className="text-center text-lg font-semibold text-gray-800">Rate Your Experience</h3>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setScore(n)}>
              <StarIcon filled={n <= score} />
            </button>
          ))}
        </div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:border-orange-400"
        />
        <button
          onClick={() => { if (score) onSubmit({ score, review }); }}
          disabled={!score}
          className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Rating
        </button>
        {!score && (
          <p className="text-center text-xs text-gray-400">Please select a star rating</p>
        )}
      </div>
    </div>
  );
}

// ─── Supported mime type ──────────────────────────────────────────────────────

function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

// ─── ChatScreen ───────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, show: showToast, remove: removeToast } = useToast();
  const chatCtx = useChat();

  // ── Resolve session data ───────────────────────────────────────────────────
  const stateRaw = (location.state || {}) as Partial<ActiveChatInfo & { gender: string }>;

  const gid = stateRaw.gid || chatCtx.chatInfo?.gid || "";
  const fbchannelID = stateRaw.fbchannelID || chatCtx.chatInfo?.fbchannelID || "";
  const astrologer_id = stateRaw.astrologer_id || chatCtx.chatInfo?.astrologer_id || "";
  const astroName = stateRaw.astroName || chatCtx.chatInfo?.astroName || "";
  const astrologerImage = stateRaw.astrologerImage || chatCtx.chatInfo?.astrologerImage || "";
  const wallet = stateRaw.wallet || chatCtx.chatInfo?.wallet || "0";
  const rate = stateRaw.rate || chatCtx.chatInfo?.rate || "0";
  const dob = stateRaw.dob || chatCtx.chatInfo?.dob || "";
  const tob = stateRaw.tob || chatCtx.chatInfo?.tob || "";
  const place = stateRaw.place || chatCtx.chatInfo?.place || "";
  const gender = stateRaw.gender || chatCtx.chatInfo?.gender || "";
  const userName = stateRaw.name || chatCtx.chatInfo?.name || "";

  const userId = localStorage.getItem("id") || "";
  const userDisplayName = localStorage.getItem("name") || userName || "";
  const token = localStorage.getItem("token") || "";

  // ── State ──────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<(FirebaseMessage & { key: string })[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dbRef = useRef<DatabaseReference | null>(null);
  const initialMsgSent = useRef<boolean>(
    !!gid && sessionStorage.getItem(`kundli_sent_${gid}`) === "1"
  );
  const isEndingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const formatMsgTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  // ── Timer from global context ──────────────────────────────────────────────
  const timeLeft = chatCtx.chatTimeLeft;
  const showLowBalance = timeLeft > 0 && timeLeft <= 5 * 60;
  const showRecharge = timeLeft > 0 && timeLeft <= 1 * 60;

  // ── Start / resume global timer ────────────────────────────────────────────
  useEffect(() => {
    if (!gid || !astrologer_id) return;
    if (chatCtx.chatActive && chatCtx.chatInfo?.gid === gid) return;

    const info: ActiveChatInfo = {
      gid,
      fbchannelID: fbchannelID || "",
      astrologer_id: astrologer_id || "",
      astroName: astroName || "",
      astrologerImage: astrologerImage || "",
      rate: rate || "0",
      wallet: wallet || "0",
      name: userName || userDisplayName || "",
      gender: gender || "",
      dob: dob || "",
      tob: tob || "",
      place: place || "",
    };

    // AFTER ✅
    const w = parseFloat(wallet || "0");
    const r = parseFloat(rate || "1");
    const initialSeconds = r > 0 ? Math.floor((w / r) * 60) : 0;

    chatCtx.startChatTimer(info, initialSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, astrologer_id]);

  // ── Firebase listener ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!gid || !userId || !astrologer_id) return;

    const listenPath = `Group/${gid}/${userId}/${astrologer_id}`;
    const dbRef2 = ref(db, listenPath);
    dbRef.current = dbRef2;

    onValue(dbRef2, (snapshot) => {
      const data = snapshot.val();
      if (!data) { setMessages([]); return; }
      const list = Object.entries(data).map(([key, val]) => ({
        key,
        ...(val as FirebaseMessage),
      }));
      list.sort((a, b) => (a.date_time || 0) - (b.date_time || 0));
      setMessages(list);
    });

    return () => off(dbRef2);
  }, [gid, userId, astrologer_id]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Initial kundli message ─────────────────────────────────────────────────
  useEffect(() => {
    if (!gid || !userId || !astrologer_id || initialMsgSent.current) return;
    if (!gender || !dob || !tob || !place) return;
    initialMsgSent.current = true;
    try { sessionStorage.setItem(`kundli_sent_${gid}`, "1"); } catch { /* ignore */ }
    const displayName = userDisplayName || userName || "User";
    const msg = `Name : ${displayName}\nGender : ${gender}\nBirth Date : ${dob}\nBirth Time : ${tob}\nBirth Location : ${place}`;
    sendFirebaseMessage(msg, "text");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, userId, astrologer_id, gender]);

  // ── Status poll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!fbchannelID) return;

    statusPollRef.current = setInterval(async () => {
      try {
        const res = await apiPost(
          "user_api/call_initiate_status",
          { channel_id: fbchannelID },
          token
        );
        const st = res?.results?.status;
        if (st === "end_astro") {
          clearInterval(statusPollRef.current!);
          setShowRatingDialog(true);
        } else if (st === "reject_astro") {
          clearInterval(statusPollRef.current!);
          navigate(-1);
        }
      } catch { /* silent */ }
    }, 2000);

    return () => clearInterval(statusPollRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fbchannelID]);

  // ── Send Firebase message ──────────────────────────────────────────────────
  const sendFirebaseMessage = useCallback(
    async (content: string, type: MessageType) => {
      if (!gid || !userId || !astrologer_id) {
        showToast("Cannot send — session data missing", "error");
        return;
      }

      const timestamp = Date.now();
      const senderPath = `Group/${gid}/${userId}/${astrologer_id}`;
      const receiverPath = `Group/${gid}/${astrologer_id}/${userId}`;
      const msgId = push(ref(db, senderPath)).key;
      if (!msgId) { showToast("Failed to generate message ID", "error"); return; }

      const msgBody: FirebaseMessage = {
        name: userDisplayName || userName || "User",
        to: astrologer_id,
        from: userId,
        message: content,
        type,
        message_id: msgId,
        date_time: timestamp,
        seen: false,
      };

      try {
        await set(ref(db, `${senderPath}/${msgId}`), msgBody);
        await set(ref(db, `${receiverPath}/${msgId}`), msgBody);
      } catch {
        showToast("Failed to send message. Check your connection.", "error");
      }
    },
    [gid, userId, astrologer_id, userDisplayName, userName, showToast]
  );

  // ── CHANGE 5: Detect personal info (phone / email / website) ──────────────
  const containsPersonalInfo = (text: string): boolean => {
    const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const websiteRegex = /(https?:\/\/|www\.)[^\s]+/gi;
    return phoneRegex.test(text) || emailRegex.test(text) || websiteRegex.test(text);
  };

  // ── Text send ──────────────────────────────────────────────────────────────
  const handleSendText = async () => {
    const text = inputText.trim();
    if (!text) return;

    // CHANGE 5: Block phone/email/website — show alert, preserve input
    if (containsPersonalInfo(text)) {
      showToast(
        "⚠️ Sharing phone numbers, emails, or websites is not allowed. Please remove that content.",
        "error"
      );
      return;
    }

    setInputText("");
    await sendFirebaseMessage(text, "text");
  };

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE}/user_api/upload_a_file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data?.status === true && data?.results) {
        await sendFirebaseMessage(data.results, "image");
        showToast("Image sent!", "success");
      } else {
        showToast(data?.message || "Image upload failed.", "error");
      }
    } catch {
      showToast("Image upload failed. Check your connection.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Audio recording ────────────────────────────────────────────────────────
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      audioChunksRef.current = [];

      recorder.addEventListener("dataavailable", (e) => {
        if (e.data?.size > 0) audioChunksRef.current.push(e.data);
      });

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(
        () => setRecordingSeconds((s) => s + 1),
        1000
      );
    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        showToast("Microphone permission denied.", "error");
      } else {
        showToast("Cannot access microphone.", "error");
      }
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    clearInterval(recordingTimerRef.current!);
    setIsRecording(false);
    setRecordingSeconds(0);

    const recorder = mediaRecorderRef.current;
    const mimeType = recorder.mimeType || "audio/webm";

    await new Promise<void>((resolve) => {
      recorder.addEventListener("stop", () => resolve(), { once: true });
      recorder.stop();
    });

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;

    const chunks = audioChunksRef.current;
    audioChunksRef.current = [];

    if (chunks.length === 0) {
      showToast("Recording too short. Hold longer.", "warning");
      return;
    }

    const blob = new Blob(chunks, { type: mimeType });
    if (blob.size < 1000) {
      showToast("Recording too short. Try again.", "warning");
      return;
    }

    // CHANGE 1: Always send as .mp3 — server expects mp3 extension
    const file = new File([blob], `voice_${Date.now()}.mp3`, { type: "audio/mpeg" });

    setIsLoading(true);
    try {
      // Try upload_mp3_file first
      let res = await fetch(`${API_BASE}/user_api/upload_mp3_file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: (() => { const fd = new FormData(); fd.append("image", file); return fd; })(),
      });
      let data = await res.json();

      // Fallback upload_a_file
      if (data?.status !== true || !data?.results) {
        const fd2 = new FormData();
        fd2.append("image", file);
        res = await fetch(`${API_BASE}/user_api/upload_a_file`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd2 });
        data = await res.json();
      }

      if (data?.status === true && data?.results) {
        await sendFirebaseMessage(data.results, "audio");
        showToast("Voice message sent!", "success");
      } else {
        showToast(data?.message || "Audio upload failed.", "error");
      }
    } catch {
      showToast("Audio upload failed. Check your connection.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  // Block browser back button — show end dialog instead
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      setShowEndDialog(true);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ── End chat ───────────────────────────────────────────────────────────────
  const handleEndChat = async (confirmed = false) => {
    if (isEndingRef.current) return;
    if (!confirmed) { setShowEndDialog(true); return; }

    isEndingRef.current = true;
    setIsEnding(true);

    clearInterval(statusPollRef.current!);
    if (dbRef.current) off(dbRef.current);

    try {
      await apiPost(
        "user_api/call_status_update",
        { channel_id: gid, status: "end_user" },
        token
      );
    } catch { /* silent */ }

    chatCtx.stopChatTimer();
    try { sessionStorage.removeItem(`kundli_sent_${gid}`); } catch { /* ignore */ }
    setShowRatingDialog(true);
  };

  // ── Submit rating ──────────────────────────────────────────────────────────
  const handleSubmitRating = async (r: RatingState) => {
    try {
      await apiPost(
        "user_api/add_rating",
        { channel_id: gid, rating: String(r.score), review: r.review },
        token
      );
    } catch { /* silent */ }

    chatCtx.stopChatTimer();
    try { sessionStorage.removeItem(`kundli_sent_${gid}`); } catch { /* ignore */ }
    setShowRatingDialog(false);
    navigate("/", { replace: true });
  };

  // ── Render message content ─────────────────────────────────────────────────
  const renderContent = (msg: FirebaseMessage & { key: string }) => {
    const isMe = msg.from === userId;
    if (msg.type === "image") {
      return (
        <img
          src={msg.message}
          alt="Attachment"
          className="max-w-[200px] rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setPreviewImage(msg.message)}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      );
    }
    if (msg.type === "audio")
      return <AudioPlayer src={msg.message} />;
    return (
      <p className={`text-sm leading-relaxed font-medium whitespace-pre-wrap break-words ${isMe ? "text-white" : "text-gray-800"}`}>
        {msg.message}
      </p>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 overflow-hidden">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex-shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Astrologer info */}
          {/* ── Minimize / Back button ── */}
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors mr-1"
            aria-label="Minimize chat"
            title="Minimize — chat stays active"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={astrologerImage || ""}
                alt={astroName}
                className="w-9 h-9 rounded-full object-cover border-2 border-orange-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${astroName}&background=f97316&color=fff&size=64`;
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{astroName}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-green-500 font-semibold">● Live Chat</span>
                <span className="text-[10px]" style={{ color: "#C05A00" }}>·</span>
                <span className={`text-[11px] font-semibold ${showLowBalance ? "text-red-500" : "text-orange-500"}`}>
                  ⏱ {formatTime(timeLeft)}
                </span>
                {showLowBalance && (
                  <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                    Low Balance
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CHANGE 2: Wallet balance — larger font */}
          {/* Wallet balance — bordered pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-orange-400 bg-orange-50 mr-1">
            <WalletIcon />
            <span className="text-[17px] font-extrabold text-orange-600 leading-none">₹{wallet}</span>
          </div>

          {/* CHANGE 3: END button — dark red */}
          <button
            onClick={() => handleEndChat(false)}
            disabled={isEnding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7f1d1d] text-white hover:bg-[#991b1b] transition-colors shadow-sm disabled:opacity-60"
          >
            <PhoneOffIcon />
            <span className="text-xs font-bold hidden sm:inline">End</span>
          </button>
        </div>

        <div className="bg-amber-50 border-t border-amber-100 px-4 py-1.5">
          <p className="text-[10px] text-amber-700 text-center">
            🔒 Do not share personal phone numbers or payment details. Astrogurujii never asks for direct payment.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
        style={{ backgroundImage: "url('/images/chat-bg.png')", backgroundSize: "cover", backgroundColor: "#e8ddd0" }}
      >
        {messages.length === 0 && (
          <div className="flex justify-center mt-10">
            <div className="bg-white/80 backdrop-blur rounded-xl px-5 py-3 text-xs text-gray-500 shadow-sm">
              Chat started. Say hello! 👋
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.from === userId;
          return (
            <div key={msg.key} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <img
                  src={astrologerImage || ""}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover mr-2 mt-1 flex-shrink-0 self-end border border-orange-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${astroName}&background=f97316&color=fff&size=64`;
                  }}
                />
              )}
              <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isMe ? "bg-orange-500 rounded-br-sm" : "bg-white rounded-bl-sm border border-gray-100"}`}>
                  {renderContent(msg)}
                </div>
                <span className="text-[9px] mt-1 px-1 flex items-center gap-1" style={{ color: "#C05A00" }}>                  {msg.date_time ? formatMsgTime(msg.date_time) : ""}
                  {isMe && (
                    <span className={msg.seen ? "text-blue-400" : "text-gray-300"}>
                      {msg.seen ? "✓✓" : "✓"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-orange-100 rounded-2xl rounded-br-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recharge banner */}
      {showRecharge && (
        <div className="flex-shrink-0 mx-3 mb-2">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-3 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src={astrologerImage || ""}
                alt=""
                className="w-9 h-9 rounded-full object-cover border-2 border-white/50 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${astroName}&background=f97316&color=fff`;
                }}
              />
              <p className="text-white text-xs font-medium truncate">
                Wallet running low! Recharge to continue at ₹{rate}/min
              </p>
            </div>
            <button
              onClick={() => navigate("/recharge-now")}
              className="flex-shrink-0 ml-2 bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Recharge
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2">

          {/* CHANGE 4: Image upload icon — orange background */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
          >
            <ImageIcon />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 flex items-center min-h-[42px] transition-colors focus-within:border-orange-300">
            {isRecording ? (
              <div className="flex items-center gap-2 w-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-sm text-red-500 font-semibold flex-1">
                  🎙 Recording... {formatTime(recordingSeconds)}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">Tap ■ to send</span>
              </div>
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); }
                }}
                placeholder="Type a message..."
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
            )}
          </div>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${isRecording
              ? "bg-red-500 scale-110 animate-pulse"
              : "bg-green-500 hover:bg-green-600 hover:scale-105"
              }`}
            title={isRecording ? "Tap to stop & send" : "Tap to record voice"}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </button>

          {inputText.trim() && !isRecording && (
            <button
              onClick={handleSendText}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-md"
            >
              <SendIcon />
            </button>
          )}
        </div>

        <p className="text-[10px] text-center text-gray-400 mt-1.5">
          Tap 🎤 to record • Tap ■ to send voice • Tap 📷 for image
        </p>
      </div>

      {/* Dialogs */}
      {showEndDialog && (
        <EndChatDialog
          onConfirm={() => { setShowEndDialog(false); handleEndChat(true); }}
          onExplore={() => { setShowEndDialog(false); navigate("/", { replace: false }); }}
        />
      )}
      {showRatingDialog && <RatingDialog onSubmit={handleSubmitRating} />}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300">×</button>
        </div>
      )}
    </div>
  );
}