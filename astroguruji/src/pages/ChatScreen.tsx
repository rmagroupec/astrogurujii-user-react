import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ref, onValue, push, set, serverTimestamp } from "firebase/database";
import { db }  from '../firebase';

// ─── Types matching your Flutter Firebase Structure ──────────────
type FirebaseMessage = {
  idFrom: string;
  idTo: string;
  timestamp: number;
  content: string;
  type: number; // 0 = text, 1 = image, 2 = audio
  time: string; // e.g., "10:30 AM"
};

// ─── Icons ───────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// ─── Component ───────────────────────────────────────────────────

export default function ChatScreen() {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const location = useLocation();

  // Extract data passed from the previous screen (ConnectionModal)
  const {
    astrologer_id,
    name: astroName,
    profile: astroProfile,
    wallet,
    rate,
  } = location.state || {};

  const currentUserId = localStorage.getItem("id") || "";
  const token = localStorage.getItem("token") || "";

  // ─── State ───
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const [isEnding, setIsEnding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Timer Logic (Matches Flutter count_down_manager) ───
  // Calculate total allowed seconds based on Wallet / Rate
  const getInitialSeconds = () => {
    if (!wallet || !rate) return 300; // default 5 mins fallback
    const totalMinutes = Math.floor(parseFloat(wallet) / parseFloat(rate));
    return totalMinutes * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialSeconds());

  useEffect(() => {
    if (timeLeft <= 0) {
      handleEndChat("Time Over");
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // ─── Firebase Listener ───
  useEffect(() => {
    if (!channelId) return;

    // Path matches Flutter: "message/channel_id"
    const messagesRef = ref(db, `message/${channelId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and sort by timestamp
        const msgList: FirebaseMessage[] = Object.values(data);
        msgList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgList);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [channelId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Handlers ───
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !channelId) return;

    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMessageRef = push(ref(db, `message/${channelId}`));
    
    // Structure strictly matches your Flutter 'Kundli' / 'onSendMessage' payload
    await set(newMessageRef, {
      idFrom: currentUserId,
      idTo: astrologer_id,
      timestamp: serverTimestamp(),
      content: inputText.trim(),
      type: 0, // 0 = text, as per Flutter code
      time: formattedTime,
    });

    setInputText("");
  };

  const handleEndChat = async (reason = "User Ended") => {
    if (isEnding) return;
    setIsEnding(true);

    const confirmEnd = reason === "Time Over" || window.confirm("Are you sure you want to end this chat?");
    
    if (confirmEnd) {
      try {
        // Same API as HttpServices.dart call_status_update
        await fetch("https://admin.astrogurujii.com/user_api/call_status_update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            channel_id: channelId,
            status: "Ended",
          }),
        });

        // Navigate to Chat History or Review Screen
        navigate("/chat-history", { state: { channelId, astrologer_id, astroName } });

      } catch (error) {
        console.error("Failed to end chat:", error);
        alert("Failed to end chat properly.");
        setIsEnding(false);
      }
    } else {
      setIsEnding(false);
    }
  };

  // ─── Formatters ───
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFDF9] md:bg-gray-100">
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-white shadow-xl relative overflow-hidden md:border-x border-gray-200">
        
        {/* ─── Header ─── */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleEndChat()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <BackIcon />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={astroProfile || "/images/v2/consultant-1.png"} 
                  alt={astroName} 
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/v2/consultant-1.png'; }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h2 className="font-poppins font-bold text-[15px] text-gray-900 leading-tight">
                  {astroName || "Astrologer"}
                </h2>
                <p className="font-euclid text-[12px] text-green-600 font-medium">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-poppins text-sm font-bold transition-colors ${
              timeLeft <= 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-50 text-brand-orange'
            }`}>
              <ClockIcon />
              {formatTime(timeLeft)}
            </div>

            {/* End Chat Button */}
            <button 
              onClick={() => handleEndChat()}
              disabled={isEnding}
              className="font-poppins text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {isEnding ? "..." : "END"}
            </button>
          </div>
        </header>

        {/* ─── Chat Messages Area ─── */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFDF9] bg-[url('/images/v2/chat-bg-pattern.png')] bg-cover">
          
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[11px] font-euclid px-4 py-2 rounded-lg text-center shadow-sm max-w-md">
              Do not share your personal phone number or payment details here. Astrogurujii will never ask for direct payments.
            </div>
          </div>

          {messages.map((msg, index) => {
            const isUser = msg.idFrom === currentUserId;
            
            return (
              <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  
                  {/* Message Bubble */}
                  <div className={`px-4 py-2.5 text-[14px] font-euclid shadow-sm break-words ${
                    isUser 
                      ? "bg-brand-orange text-white rounded-[20px] rounded-br-[4px]" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-[20px] rounded-bl-[4px]"
                  }`}>
                    {/* Render Text. If type === 1 (image), render img tag here */}
                    {msg.type === 0 ? (
                      msg.content
                    ) : msg.type === 1 ? (
                      <img src={msg.content} alt="Attachment" className="max-w-[200px] rounded-lg" />
                    ) : (
                      "Audio Message" // You can implement audio_play_pop_up equivalent here later
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          
          <div ref={messagesEndRef} />
        </main>

        {/* ─── Input Area ─── */}
        <footer className="bg-white border-t border-gray-200 p-3 shrink-0">
          <form 
            onSubmit={handleSendMessage} 
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pr-1.5 pl-4 py-1.5 focus-within:border-brand-orange focus-within:bg-white transition-colors shadow-sm"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-[14px] font-euclid text-gray-800 placeholder:text-gray-400"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-brand-orange text-white disabled:opacity-50 disabled:bg-gray-300 hover:bg-[#e66400] transition-colors shadow-md"
            >
              <SendIcon />
            </button>
          </form>
        </footer>

      </div>
    </div>
  );
}