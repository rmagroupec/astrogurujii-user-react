import { useEffect, useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import {
  notifications_list,
  notifications_drop,
  type NotificationResult,
} from "@/https_service";

// ─── Notification Card ─────────────────────────────

function NotificationItem({
  data,
  onDelete,
}: {
  data: NotificationResult;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#F0E8DF] bg-white p-4 hover:shadow-md transition-all">
      {/* Icon placeholder */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full text-xl bg-orange-100">
        🔔
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-poppins text-[13px] font-bold text-gray-800">
          {data.title}
        </h4>
        <p className="font-euclid text-[12px] text-gray-600 mt-1 leading-[1.6]">
          {data.text}
        </p>
        <span className="text-[10px] text-gray-400 mt-2 block">
          {data.created_date}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(data.id)}
        className="text-gray-400 hover:text-red-500 transition-colors mt-1"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setIsLoading(true);
    setError(null);
    const res = await notifications_list();
    if (res?.status && res.results) {
      setNotifications(res.results);
    } else {
      setError("Could not load notifications.");
    }
    setIsLoading(false);
  }

  async function handleDelete(id: number) {
    // Optimistic remove
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await notifications_drop(String(id));
  }

  async function handleDeleteAll() {
    setShowConfirm(false);
    const res = await notifications_drop("");
    if (res?.status) {
      setNotifications([]);
    }
  }

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
        {/* Header row */}
        {notifications.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-red-500 hover:underline font-poppins"
            >
              Delete All
            </button>
          </div>
        )}

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-20 text-gray-400 text-sm">
            Loading…
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20 text-red-400 text-sm">{error}</div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            No notifications yet.
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem key={n.id} data={n} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Delete All Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[320px] shadow-xl space-y-4">
            <p className="font-poppins text-sm text-gray-700">
              Do you want to delete all notifications?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}