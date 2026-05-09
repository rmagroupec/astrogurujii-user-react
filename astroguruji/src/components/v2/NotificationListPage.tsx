import { useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

// ─── Types ─────────────────────────────────────────

type NotificationType =
  | "horoscope"
  | "love"
  | "career"
  | "finance"
  | "tip";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
};

// ─── Mock Data (Dynamic later from API) ─────────────

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Daily Horoscope Ready",
    message: "Your stars for today are ready. Discover what awaits you.",
    time: "2 min ago",
    type: "horoscope",
    read: false,
  },
  {
    id: 2,
    title: "Love Insight 💖",
    message: "A romantic moment may surprise you today.",
    time: "10 min ago",
    type: "love",
    read: false,
  },
  {
    id: 3,
    title: "Career Growth 🚀",
    message: "Your work may get recognized today. Stay confident!",
    time: "1 hour ago",
    type: "career",
    read: true,
  },
  {
    id: 4,
    title: "Finance Alert 💰",
    message: "Avoid impulsive spending today.",
    time: "Yesterday",
    type: "finance",
    read: true,
  },
  {
    id: 5,
    title: "Lucky Tip 🔮",
    message: "Channel your energy into creativity.",
    time: "Yesterday",
    type: "tip",
    read: true,
  },
];

// ─── Helpers ───────────────────────────────────────

const ICONS: Record<NotificationType, string> = {
  horoscope: "🌟",
  love: "💖",
  career: "🚀",
  finance: "💰",
  tip: "🔮",
};

const COLORS: Record<NotificationType, string> = {
  horoscope: "#FF6F00",
  love: "#e74c8b",
  career: "#4a90d9",
  finance: "#34a853",
  tip: "#9b59b6",
};

// ─── Notification Card ─────────────────────────────

function NotificationItem({
  data,
  onClick,
}: {
  data: Notification;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all
        ${
          data.read
            ? "bg-white border-[#F0E8DF]"
            : "bg-orange-50 border-brand-orange/40"
        }
        hover:shadow-md`}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
        style={{ backgroundColor: `${COLORS[data.type]}20` }}
      >
        {ICONS[data.type]}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-poppins text-[13px] font-bold text-gray-800">
          {data.title}
        </h4>
        <p className="font-euclid text-[12px] text-gray-600 mt-1 leading-[1.6]">
          {data.message}
        </p>
        <span className="text-[10px] text-gray-400 mt-2 block">
          {data.time}
        </span>
      </div>

      {/* Unread Dot */}
      {!data.read && (
        <div className="h-2 w-2 rounded-full bg-brand-orange mt-2"></div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(NOTIFICATIONS);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const todayNotifications = notifications.filter((n) =>
    n.time.includes("min") || n.time.includes("hour")
  );

  const earlierNotifications = notifications.filter(
    (n) => !todayNotifications.includes(n)
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="Notifications"
        highlight="Astrogurujii"
        description="Stay updated with your latest horoscope insights and alerts."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Notifications" },
        ]}
      />

      <div className="mx-auto max-w-[900px] px-4 py-8 space-y-6">
        
        {/* Today */}
        {todayNotifications.length > 0 && (
          <div>
            <h3 className="font-poppins text-sm font-bold text-gray-500 mb-3">
              Today
            </h3>
            <div className="space-y-3">
              {todayNotifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  data={n}
                  onClick={() => markAsRead(n.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Earlier */}
        {earlierNotifications.length > 0 && (
          <div>
            <h3 className="font-poppins text-sm font-bold text-gray-500 mb-3">
              Earlier
            </h3>
            <div className="space-y-3">
              {earlierNotifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  data={n}
                  onClick={() => markAsRead(n.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}