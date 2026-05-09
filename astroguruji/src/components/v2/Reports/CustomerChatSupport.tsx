import { useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

type Message = {
  id: number;
  text: string;
  sender: "user" | "support";
  time: string;
};

export default function SupportChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi 👋 How can we help you today?",
      sender: "support",
      time: "10:00 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // 🔥 Fake reply (replace with API/socket)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Thanks! Our team will respond shortly.",
          sender: "support",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <Navbar />

      <BreadcrumbHeader
        title="Customer Support"
        highlight="Astrogurujii"
        description="Chat with our support team for help and assistance."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Support Chat" },
        ]}
      />

      {/* Chat Container */}
      <div className="flex-1 max-w-[900px] mx-auto w-full px-4 py-6 flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-brand-orange text-white flex items-center justify-center">
            💬
          </div>
          <div>
            <p className="font-semibold text-sm">Support Team</p>
            <p className="text-xs text-green-600">● Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-brand-orange text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[10px] opacity-70 block mt-1 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-4 flex items-center gap-2 border-t pt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-[#E0D5CC] px-4 py-2 text-sm focus:border-brand-orange outline-none"
          />

          <button
            onClick={sendMessage}
            className="rounded-full bg-brand-orange px-5 py-2 text-white text-sm font-semibold"
          >
            Send
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}