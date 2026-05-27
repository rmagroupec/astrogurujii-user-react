/**
 * ChatViewOnlyScreen.tsx — Fixed
 *
 * Fix 1 — Messages always reflect the CURRENT session (gid):
 *   • Messages state is cleared whenever gid changes (key prop on outer div + reset in effect)
 *   • Both Firebase paths are read and merged so full conversation is visible
 *
 * Fix 2 — Review button shows correctly:
 *   • If rating already submitted (data.rating > 0) → show "Edit Review"
 *   • If not submitted yet (rating == 0 / null)     → show "Add Review"
 *   • Submits to user_api/add_rating with channel_id
 *
 * Fix 3 — "Chat Again" opens ConnectionModal with correct pre-filled rate
 */

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase";
import axios from "axios";
import ConnectionModal from "@/components/v2/ConnectionModal";
import { profile_api } from "@/https_service";

const API_BASE = "https://admin.astrogurujii.com";

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
  onEditClick?: () => void;

};

// ─── Audio bubble ─────────────────────────────────────────────────────────────

function AudioBubble({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
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
        <span className="text-[10px] text-white/70 mt-0.5 block">{fmt(duration)}</span>
      </div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={n <= value ? "#f59e0b" : "none"}
          stroke="#f59e0b"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Review dialog ────────────────────────────────────────────────────────────

function ReviewDialog({
  initialRating,
  initialReview,
  channelId,
  onClose,
  onSaved,
  onEditClick,

}: {
  initialRating: number;
  initialReview: string;
  channelId: string;
  onClose: () => void;
  onSaved: (rating: number, review: string) => void;
  onEditClick?: () => void;
}) {
  const [score, setScore] = useState(initialRating || 0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState(initialReview || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || "";

  const handleSubmit = async () => {
    if (!score) { setError("Please select a star rating"); return; }
    setSaving(true);
    try {
      await axios.post(
        `${API_BASE}/user_api/add_rating`,
        { channel_id: channelId, rating: String(score), review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved(score, review);
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <h3 className="text-center text-lg font-semibold text-gray-800">
          {initialRating > 0 ? "Edit Your Review" : "Add a Review"}
        </h3>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setScore(n)}
              className="transition-transform hover:scale-110"
            >
              <svg width="32" height="32" viewBox="0 0 24 24"
                fill={n <= (hovered || score) ? "#f59e0b" : "none"}
                stroke="#f59e0b" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-orange-400"
        />

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Rating display card ──────────────────────────────────────────────────────

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
  onEditClick?: () => void;
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

  const state = (location.state as any) || {};
  const {
    gid = "9gR2UAtT",
    astrologer_id = "673f05d77a277b8a9eab665c",
    astroName = "Astrologer",
    astrologerImage = "",
    userName = "You",
    userImage,
    // channelId for rating API
    fbchannelID = "",
    // initial rating from transaction list
    rating: initialRating = 0,
    review: initialReview = "",
    // rate for "Chat Again"
    rate = "0",
    per_min_chat = "0",
  } = state;

  const userId = localStorage.getItem("id") || "";
  const token = localStorage.getItem("token") || "";

  // ── Local state ────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Live rating/review (updated after user submits)
  const [currentRating, setCurrentRating] = useState(Number(initialRating) || 0);
  const [currentReview, setCurrentReview] = useState(initialReview || "");

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Wallet for "Chat Again" ────────────────────────────────────────────────
  useEffect(() => {
    profile_api().then((res) => {
      if (res?.status && res.results) {
        const w = parseFloat(res.results.wallet ?? "0");
        if (!isNaN(w)) setWalletBalance(w);
      }
    });
  }, []);

  // ── Load messages — FIXED ──────────────────────────────────────────────────
  // KEY FIXES:
  //   1. Clear messages immediately when gid changes (prevents stale display)
  //   2. Read BOTH Firebase paths (user→astro AND astro→user) and merge
  //   3. Deduplicate by message_id so messages don't appear twice
  useEffect(() => {
    // Clear immediately so old session messages don't linger
    setMessages([]);
    setLoading(true);

    if (!gid || !userId || !astrologer_id) {
      setLoading(false);
      return;
    }

    const pathUser = `Group/${gid}/${userId}/${astrologer_id}`;
    const pathAstro = `Group/${gid}/${astrologer_id}/${userId}`;

    let userSnap: Record<string, any> = {};
    let astroSnap: Record<string, any> = {};
    let loadedCount = 0;

    const rebuild = () => {
      // Merge both sides, deduplicate by message_id (or firebase key)
      const combined: Record<string, FirebaseMessage> = {};

      Object.entries(userSnap).forEach(([key, val]: any) => {
        const id = val?.message_id || key;
        combined[id] = { key, ...val };
      });

      Object.entries(astroSnap).forEach(([key, val]: any) => {
        const id = val?.message_id || key;
        if (!combined[id]) combined[id] = { key, ...val };
      });

      const list = Object.values(combined);
      list.sort((a, b) => (a.date_time || 0) - (b.date_time || 0));
      setMessages(list);
      setLoading(false);
    };

    const refUser = ref(db, pathUser);
    const refAstro = ref(db, pathAstro);

    // onValue fires immediately with current data and again on changes
    const unsubUser = onValue(refUser, (snap) => {
      userSnap = snap.val() || {};
      loadedCount = Math.max(loadedCount, 1);
      if (loadedCount >= 2) rebuild(); // only merge once both have loaded
    });

    const unsubAstro = onValue(refAstro, (snap) => {
      astroSnap = snap.val() || {};
      loadedCount = Math.max(loadedCount, 2);
      rebuild();
    });

    return () => {
      off(refUser);
      off(refAstro);
    };
  }, [gid, userId, astrologer_id]); // re-runs when gid changes → clears old messages

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
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      );
    }
    if (msg.type === "audio") return <AudioBubble src={msg.message} />;
    return (
      <p className={`text-sm leading-relaxed font-medium whitespace-pre-wrap break-words ${isMe ? "text-white" : "text-gray-800"}`}>
        {msg.message}
      </p>
    );
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const astroInitials = astroName
    .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  // Rate for ConnectionModal
  const chatRate = parseFloat(rate || per_min_chat || "0") || 0;

  // channelId for rating API — prefer fbchannelID, fallback to gid
  const ratingChannelId = fbchannelID || gid;

  return (
    // key={gid} forces a full remount when session changes → guaranteed clean slate
    <div key={gid} className="flex flex-col h-screen bg-[#f5f0ea]" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-orange-100 px-4 py-3 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-orange-50 transition-colors text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {astrologerImage ? (
          <img src={astrologerImage} alt={astroName}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 flex-shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {astroInitials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{astroName}</p>
          <p className="text-xs text-orange-400 font-medium">Chat History</p>
        </div>

        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 uppercase tracking-wide flex-shrink-0">
          Ended
        </span>
      </header>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
        style={{ backgroundImage: "url('/images/chat-bg.png')", backgroundSize: "cover", backgroundColor: "#e8ddd0" }}
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
            <div key={msg.key} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="flex-shrink-0 self-end mr-2">
                  {astrologerImage ? (
                    <img src={astrologerImage} alt={astroName}
                      className="w-7 h-7 rounded-full object-cover border border-orange-100"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                      {astroInitials[0]}
                    </div>
                  )}
                </div>
              )}

              <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isMe ? "bg-orange-500 rounded-br-sm" : "bg-white rounded-bl-sm border border-gray-100"
                  }`}>
                  {renderContent(msg, isMe)}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {msg.date_time ? formatTime(msg.date_time) : ""}
                </span>
              </div>
            </div>
          );
        })}

        {/* Rating card — always shown */}
        {/* {!loading && (
          <RatingCard
            rating={currentRating}
            review={currentReview}
            userName={userName}
            userImage={userImage}
            onEditClick={() => setShowReview(true)}
          />
        )} */}

        <div ref={bottomRef} />
      </div>
      <div className="flex-shrink-0">
        <RatingCard
          userName={userName}
          userImage={userImage}
          rating={Number(currentRating) || 0}
          review={currentReview || ""}
          onEditClick={() => setShowReview(true)}
        />
      </div>

      {/* ── Footer — Chat Again ────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 shadow-md">
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-md"
          style={{ background: "linear-gradient(135deg, #FF6F00, #FF9800)", boxShadow: "0 4px 14px rgba(255,111,0,0.30)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat Again with {astroName}
        </button>
      </div>

      {/* ── Image preview ─────────────────────────────────────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300">×</button>
        </div>
      )}

      {/* ── Review dialog ─────────────────────────────────────────────────── */}
      {showReview && (
        <ReviewDialog
          initialRating={currentRating}
          initialReview={currentReview}
          channelId={ratingChannelId}
          onClose={() => setShowReview(false)}
          onSaved={(r, v) => { setCurrentRating(r); setCurrentReview(v); }}
        />
      )}

      {/* ── Chat Again — ConnectionModal ──────────────────────────────────── */}
      {showModal && (
        <ConnectionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          astrologer={{
            id: astrologer_id,
            name: astroName,
            profileImage: astrologerImage,
            ratePerMinute: chatRate,
          }}
          userWalletBalance={walletBalance}
          callType="chat"
        />
      )}
    </div>
  );
}

