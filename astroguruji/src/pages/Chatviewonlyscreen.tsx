/**
 * ChatViewOnlyScreen.tsx
 *
 * Read-only view of a completed chat session.
 * Mirrors Flutter's ChatViewOnly — loads Firebase messages for the given gid,
 * and shows the user's rating/review card at the bottom.
 *
 * Route: /chat-view-only
 * Navigate here with location.state containing:
 *   gid, astrologer_id, fbchannelID, astroName, astrologerImage,
 *   userName, rating, review, userImage?
 */

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type MsgType = "text" | "image" | "audio";

type FirebaseMessage = {
  key: string;
  from: string;
  to: string;
  name: string;
  message: string;
  type: MsgType;
  date_time: number;
  seen?: boolean;
};

// ─── Audio player (inline, minimal) ─────────────────────────────────────────

function AudioBubble({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => {
          if (!audioRef.current || !duration) return;
          setProgress((audioRef.current.currentTime / duration) * 100);
        }}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />
      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow"
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
      <div className="flex-1 flex flex-col gap-1">
        <div
          className="h-1.5 bg-white/40 rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            if (!audioRef.current || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            audioRef.current.currentTime =
              ((e.clientX - rect.left) / rect.width) * duration;
          }}
        >
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[9px] text-white/60">
          {duration ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}` : "0:00"}
        </span>
      </div>
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24"
          fill={n <= value ? "#f59e0b" : "none"}
          stroke="#f59e0b" strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Rating Card ──────────────────────────────────────────────────────────────

function RatingCard({
  userName,
  userImage,
  rating,
  review,
}: {
  userName: string;
  userImage?: string;
  rating: number;
  review: string;
}) {
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="border-t border-orange-100 bg-gradient-to-b from-orange-50/60 to-amber-50/40 px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest mb-3">
          Your Review
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm leading-tight">
                {userName}
              </p>
              <div className="mt-1">
                <Stars value={Math.round(rating)} />
              </div>
              {review ? (
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {review}
                </p>
              ) : (
                <p className="mt-2 text-gray-400 text-xs italic">No written review</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ChatViewOnlyScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    gid,
    astrologer_id,
    astroName = "Astrologer",
    astrologerImage,
    userName = "You",
    userImage,
    rating = 0,
    review = "",
  } = (location.state as any) || {};

  const userId = localStorage.getItem("id") || "";

  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Load Firebase messages ─────────────────────────────────────────────────
  useEffect(() => {
    if (!gid || !userId || !astrologer_id) {
      setLoading(false);
      return;
    }

    const listenPath = `Group/${gid}/${userId}/${astrologer_id}`;
    const dbRef = ref(db, listenPath);

    const unsub = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        setLoading(false);
        return;
      }
      const list: FirebaseMessage[] = Object.entries(data).map(
        ([key, val]) => ({ key, ...(val as Omit<FirebaseMessage, "key">) })
      );
      list.sort((a, b) => (a.date_time || 0) - (b.date_time || 0));
      setMessages(list);
      setLoading(false);
    });

    return () => off(dbRef);
  }, [gid, userId, astrologer_id]);

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Render message content ─────────────────────────────────────────────────
  const renderContent = (msg: FirebaseMessage, isMe: boolean) => {
    if (msg.type === "image") {
      return (
        <img
          src={msg.message}
          alt="attachment"
          className="max-w-[200px] rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setPreviewImage(msg.message)}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "";
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }
    if (msg.type === "audio") {
      return <AudioBubble src={msg.message} />;
    }
    // text
    return (
      <p
        className={`text-sm leading-relaxed font-medium whitespace-pre-wrap break-words ${
          isMe ? "text-white" : "text-gray-800"
        }`}
      >
        {msg.message}
      </p>
    );
  };

  // ── Astrologer avatar fallback ─────────────────────────────────────────────
  const astroInitials = astroName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex flex-col h-screen bg-[#f5f0ea]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── AppBar ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-orange-100 px-4 py-3 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-orange-50 transition-colors text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Astrologer avatar */}
        {astrologerImage ? (
          <img
            src={astrologerImage}
            alt={astroName}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 flex-shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {astroInitials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
            {astroName}
          </p>
          <p className="text-xs text-orange-400 font-medium">Chat History</p>
        </div>

        {/* Ended badge */}
        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 uppercase tracking-wide flex-shrink-0">
          Ended
        </span>
      </header>

      {/* ── Messages area ─────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
        style={{
          backgroundImage: "url('/images/chat-bg.png')",
          backgroundSize: "cover",
          backgroundColor: "#e8ddd0",
        }}
      >
        {loading && (
          <div className="flex justify-center mt-10">
            <div className="h-6 w-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex justify-center mt-16">
            <div className="bg-white/80 backdrop-blur rounded-xl px-6 py-4 text-sm text-gray-500 shadow-sm text-center">
              <p className="text-2xl mb-2">💬</p>
              <p>No messages found for this session.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.from === userId;
          return (
            <div
              key={msg.key}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* Astrologer avatar on left */}
              {!isMe && (
                <div className="flex-shrink-0 self-end mr-2">
                  {astrologerImage ? (
                    <img
                      src={astrologerImage}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-orange-100"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                      {astroInitials}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`max-w-[75%] flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                    isMe
                      ? "bg-orange-500 rounded-br-sm"
                      : "bg-white rounded-bl-sm border border-gray-100"
                  }`}
                >
                  {renderContent(msg, isMe)}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {msg.date_time
                    ? format(new Date(msg.date_time), "hh:mm a")
                    : ""}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ── Rating card ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <RatingCard
          userName={userName}
          userImage={userImage}
          rating={Number(rating) || 0}
          review={review || ""}
        />
      </div>

      {/* ── Image preview overlay ─────────────────────────────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
          <button className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300">
            ×
          </button>
        </div>
      )}
    </div>
  );
}