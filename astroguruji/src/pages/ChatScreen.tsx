import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ref,
  onValue,
  push,
  update,
  off,
  DatabaseReference,
} from "firebase/database";
import { db } from "../firebase";

// ─── Types (mirrors Flutter's message structure) ─────────────────────────────
type MessageType = "text" | "image" | "audio";

type FirebaseMessage = {
  date: string;
  from: string;
  mRecipientOrSenderStatus: number;
  message: string;
  message_id: string;
  date_time: number;
  name: string;
  time: string;
  to: string;
  type: MessageType;
};

type RatingState = { score: number; review: string };

// ─── API BASE ────────────────────────────────────────────────────────────────
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

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const MicIcon = ({ active }: { active?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const PhoneOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.29 7.76 15.6 6.06 13" />
    <path d="M6.06 13A19.79 19.79 0 0 1 3 4.36 2 2 0 0 1 5 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#f97316" : "none"} stroke="#f97316" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const WalletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2" /><circle cx="17" cy="13" r="1" />
  </svg>
);

// ─── Audio Player Component ───────────────────────────────────────────────────
function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => {
          if (audioRef.current) setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
        }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />
      <button onClick={toggle} className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="flex-1">
        <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] text-white/70 mt-0.5 block">
          {duration > 0 ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}` : "0:00"}
        </span>
      </div>
    </div>
  );
}

// ─── Rating Dialog ────────────────────────────────────────────────────────────
function RatingDialog({
  onSubmit,
  onClose,
}: {
  onSubmit: (rating: RatingState) => void;
  onClose?: () => void;
}) {
  const [rating, setRating] = useState<RatingState>({ score: 0, review: "" });
  const [hovered, setHovered] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <h2 className="text-center text-lg font-semibold text-gray-800">Rate your experience</h2>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
              onClick={() => setRating((r) => ({ ...r, score: n }))}>
              <StarIcon filled={n <= (hovered || rating.score)} />
            </button>
          ))}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">Additional comments</p>
          <textarea
            value={rating.review}
            onChange={(e) => setRating((r) => ({ ...r, review: e.target.value }))}
            placeholder="Write your review here..."
            className="w-full h-24 border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          onClick={() => {
            if (rating.score < 1) { alert("Please rate your experience"); return; }
            onSubmit(rating);
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

// ─── Recharge Banner ──────────────────────────────────────────────────────────
function RechargeBanner({ astroName, astroImage, rate, onRecharge }: {
  astroName: string; astroImage: string; rate: string; onRecharge: () => void;
}) {
  return (
    <div className="mx-3 mb-2 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4">
        <div className="flex items-center gap-3 mb-3">
          <img src={astroImage} alt={astroName} className="w-12 h-12 rounded-full object-cover border-2 border-white/50" />
          <p className="text-white text-sm font-medium flex-1">
            Hi! Let's continue this chat at a discounted price of ₹{rate}/min
          </p>
        </div>
        <button onClick={onRecharge}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-sm shadow hover:from-red-600 hover:to-red-800 transition-all">
          Recharge Now
        </button>
      </div>
    </div>
  );
}

// ─── End Chat Confirm Dialog ──────────────────────────────────────────────────
function EndChatDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 space-y-4">
        <h3 className="text-center text-lg font-semibold text-gray-800">End Chat</h3>
        <p className="text-center text-sm text-gray-500">Are you sure you want to end your chat?</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold text-sm hover:bg-orange-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
            Yes, End
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Preview Dialog ─────────────────────────────────────────────────────
function ImagePreviewDialog({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <img src={src} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
    </div>
  );
}

// ─── Main ChatScreen ──────────────────────────────────────────────────────────
export default function ChatScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    gid,              // Firebase group ID (fb_channel_id from call_initiate response)
    fbchannelID,      // API channel_id
    astrologer_id,
    astroName,
    astrologerImage,
    name: userName,
    wallet,
    rate,
    dob,
    tob,
    place,
    gender,
  } = location.state || {};

  const userId = localStorage.getItem("id") || "";
  const userDisplayName = localStorage.getItem("name") || "";
  const token = localStorage.getItem("token") || "";

  // ─── State ───────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<(FirebaseMessage & { key: string })[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer (mirrors CountdownManager)
  const getInitialSeconds = () => {
    const walletAmt = parseFloat(wallet || "0");
    const rateAmt = parseFloat(rate || "1");
    return rateAmt > 0 ? Math.floor((walletAmt / rateAmt) * 60) : 300;
  };
  const [timeLeft, setTimeLeft] = useState(getInitialSeconds);
  const [showLowBalance, setShowLowBalance] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);

  // UI state
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  // Audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dbRef = useRef<DatabaseReference | null>(null);
  const initialMessageSent = useRef(false);

  // ─── Format time ─────────────────────────────────────────────────────────────
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const formatDateTime = (ts: number) => {
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  // ─── Countdown Timer (mirrors CountdownManager) ───────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        const minutes = Math.floor(next / 60);
        if (minutes <= 1) setShowRecharge(true);
        if (minutes <= 5) setShowLowBalance(true);
        if (next <= 0) {
          clearInterval(timerRef.current!);
          handleEndChat(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // ─── Firebase Listener (mirrors Flutter readLocal + FirebaseAnimatedList) ──
  useEffect(() => {
    if (!gid || !userId || !astrologer_id) return;

    // Path: Group/{gid}/{userId}/{astrologerId}  — mirrors Flutter exactly
    const path = `Group/${gid}/${userId}/${astrologer_id}`;
    dbRef.current = ref(db, path);

    const unsubscribe = onValue(dbRef.current, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const list = Object.entries(data).map(([key, val]) => ({
        key,
        ...(val as FirebaseMessage),
      }));
      // Sort by date_time ascending (newest at bottom) — matches Flutter reverse:true logic
      list.sort((a, b) => (a.date_time || 0) - (b.date_time || 0));
      setMessages(list);
    });

    return () => off(dbRef.current!);
  }, [gid, userId, astrologer_id]);

  // ─── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Send initial kundli message (mirrors Flutter readLocal) ──────────────
  useEffect(() => {
    if (!gid || !userId || !astrologer_id || initialMessageSent.current) return;
    if (!gender || !dob || !tob || !place) return;
    initialMessageSent.current = true;

    const senderMessage = `Name : ${userName}\n Gender : ${gender}\n Birth Date : ${dob}\n Birth Time : ${tob}\n Birth Location : ${place}`;
    sendFirebaseMessage(senderMessage, "text");
  }, [gid, userId, astrologer_id, gender]);

  // ─── Status Polling (mirrors Flutter checkForNewStatus every 2s) ─────────
  useEffect(() => {
    if (!fbchannelID) return;

    statusPollRef.current = setInterval(async () => {
      try {
        const res = await apiPost("user_api/call_initiate_status", { channel_id: fbchannelID }, token);
        const status = res?.results?.status;
        if (status === "end_astro") {
          clearInterval(statusPollRef.current!);
          setShowRatingDialog(true);
        } else if (status === "reject_astro") {
          clearInterval(statusPollRef.current!);
          navigate(-1);
        }
      } catch { /* silent */ }
    }, 2000);

    return () => clearInterval(statusPollRef.current!);
  }, [fbchannelID]);

  // ─── Core: Send to Firebase (mirrors Flutter onSendMessage) ──────────────
  const sendFirebaseMessage = useCallback(async (content: string, type: MessageType) => {
    if (!gid || !userId || !astrologer_id) return;

    const timestamp = Date.now();
    const senderRef = ref(db, `Group/${gid}/${userId}/${astrologer_id}`);
    const receiverRef = ref(db, `Group/${gid}/${astrologer_id}/${userId}`);

    const newMsgRef = push(senderRef);
    const msgId = newMsgRef.key!;

    const msgBody: FirebaseMessage = {
      date: "",
      from: userId,
      mRecipientOrSenderStatus: 0,
      message: content,
      message_id: msgId,
      date_time: timestamp,
      name: userDisplayName,
      time: "",
      to: astrologer_id,
      type,
    };

    // Mirror Flutter: update both sender and receiver paths simultaneously
    await update(ref(db), {
      [`Group/${gid}/${userId}/${astrologer_id}/${msgId}`]: msgBody,
      [`Group/${gid}/${astrologer_id}/${userId}/${msgId}`]: msgBody,
    });
  }, [gid, userId, astrologer_id, userDisplayName]);

  // ─── Text send ───────────────────────────────────────────────────────────────
  const handleSendText = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    await sendFirebaseMessage(text, "text");
  };

  // ─── Image upload (mirrors Flutter chat_image_update) ────────────────────
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
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Audio recording (mirrors Flutter startRecording/stopRecording) ───────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      alert("Microphone permission denied.");
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        clearInterval(recordingTimerRef.current!);
        setIsRecording(false);
        setRecordingSeconds(0);

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `audio_${Date.now()}.webm`, { type: "audio/webm" });

        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append("image", file);

          const res = await fetch(`${API_BASE}/user_api/upload_mp3_file`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const data = await res.json();

          if (data?.status === true && data?.results) {
            await sendFirebaseMessage(data.results, "audio");
          } else {
            alert("Audio upload failed.");
          }
        } catch {
          alert("Audio upload failed.");
        } finally {
          setIsLoading(false);
          resolve();
        }

        // Stop all mic tracks
        mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current!.stop();
    });
  };

  // ─── End chat (mirrors Flutter endChatWebservice) ────────────────────────
  const handleEndChat = async (auto = false) => {
    if (isEnding) return;
    if (!auto) {
      setShowEndDialog(true);
      return;
    }
    setIsEnding(true);
    clearInterval(statusPollRef.current!);
    clearInterval(timerRef.current!);

    try {
      await apiPost("user_api/call_status_update", {
        channel_id: fbchannelID,
        status: "end_user",
      }, token);
    } catch { /* silent */ }

    setShowRatingDialog(true);
  };

  // ─── Submit rating (mirrors Flutter callAliForRaiting) ───────────────────
  const handleSubmitRating = async (r: RatingState) => {
    try {
      await apiPost("user_api/add_rating", {
        channel_id: fbchannelID,
        rating: String(r.score),
        review: r.review,
      }, token);
    } catch { /* silent */ }
    setShowRatingDialog(false);
    navigate("/", { replace: true });
  };

  // ─── Render message ───────────────────────────────────────────────────────
  const renderMessageContent = (msg: FirebaseMessage & { key: string }) => {
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
    if (msg.type === "audio") {
      return <AudioPlayer src={msg.message} />;
    }
    return (
      <p className={`text-sm leading-relaxed font-[500] whitespace-pre-wrap break-words ${isMe ? "text-white" : "text-gray-800"}`}>
        {msg.message}
      </p>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0ebe0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Back */}
          <button onClick={() => navigate("/")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="relative">
            <img
              src={astrologerImage || "/placeholder-avatar.png"}
              alt={astroName}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${astroName}&background=f97316&color=fff`; }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {/* Name & Timer */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm truncate">{astroName}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs font-bold ${showLowBalance ? "text-red-500" : "text-orange-500"}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
              {showLowBalance && (
                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                  Low Balance
                </span>
              )}
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-1 text-gray-500 mr-1">
            <WalletIcon />
            <span className="text-xs font-semibold">₹{wallet}</span>
          </div>

          {/* End chat */}
          <button
            onClick={() => handleEndChat(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <PhoneOffIcon />
            <span className="text-xs font-bold hidden sm:inline">End</span>
          </button>
        </div>

        {/* Disclaimer strip */}
        <div className="bg-amber-50 border-t border-amber-100 px-4 py-1.5">
          <p className="text-[10px] text-amber-700 text-center">
            🔒 Do not share personal phone numbers or payment details. Astrogurujii never asks for direct payment.
          </p>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
        style={{
          backgroundImage: "url('/images/chat-bg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          backgroundColor: "#e8ddd0",
        }}
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
              <div className={`max-w-[78%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                    isMe
                      ? "bg-orange-500 rounded-br-sm"
                      : "bg-white rounded-bl-sm border border-gray-100"
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {msg.date_time ? formatDateTime(msg.date_time) : ""}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-center">
            <div className="bg-white/80 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
              <div className="w-3 h-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Recharge Banner ─────────────────────────────────────────────── */}
      {showRecharge && (
        <RechargeBanner
          astroName={astroName || "Astrologer"}
          astroImage={astrologerImage || ""}
          rate={rate || "0"}
          onRecharge={() => navigate("/wallet")}
        />
      )}

      {/* ── Input Bar ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2">

          {/* Image upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
          >
            <ImageIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Text input / Recording indicator */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 flex items-center min-h-[42px]">
            {isRecording ? (
              <div className="flex items-center gap-2 w-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-500 font-semibold">
                  Recording {formatTime(recordingSeconds)}
                </span>
                <span className="text-xs text-gray-400 ml-auto">Release to send</span>
              </div>
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
                placeholder="Type your message..."
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
            )}
          </div>

          {/* Mic button (hold to record) */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={() => { if (isRecording) stopRecording(); }}
            onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
              isRecording ? "bg-red-500 scale-110" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <MicIcon active={isRecording} />
          </button>

          {/* Send button */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SendIcon />
          </button>
        </div>

        <p className="text-[10px] text-center text-gray-400 mt-1.5">
          Hold 🎤 to record audio • Tap 📷 to send image
        </p>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {showEndDialog && (
        <EndChatDialog
          onConfirm={() => { setShowEndDialog(false); handleEndChat(true); }}
          onCancel={() => setShowEndDialog(false)}
        />
      )}

      {showRatingDialog && (
        <RatingDialog onSubmit={handleSubmitRating} />
      )}

      {previewImage && (
        <ImagePreviewDialog src={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
}