import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import TransactionCard from "./component/OrderTransactionCard";
import Empty from "./component/EmptyState";
import GiftCard from "./component/GiftTransactionCard";

const TABS = ["call", "chat", "video", "wallet", "other", "gift"];
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("call");
  const [data, setData] = useState<any[]>([]);
  const [giftData, setGiftData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTransactions = async (type: string) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://admin.astrogurujii.com/user_api/transaction",
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(res.data?.transactions?.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGift = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://admin.astrogurujii.com/user_api/gift_transaction",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGiftData(res.data?.gifts || []);
    } catch {
      setGiftData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "gift") fetchGift();
    else fetchTransactions(activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      {/* ✅ Header */}
      <BreadcrumbHeader
        title="Orders & Transactions"
        highlight="Astrogurujii"
        description="View all your activities, purchases, and wallet usage."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Orders" },
        ]}
      />

      <div className="max-w-[1000px] mx-auto px-4 py-6">

        {/* 🔥 Tabs */}
        <div className="sticky top-0 z-10 bg-[#FFFDF9] pb-3">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition
                  ${activeTab === tab
                    ? "bg-brand-orange text-white shadow-md"
                    : "bg-white border border-[#E0D5CC] text-gray-700 hover:border-brand-orange"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 🔥 Content Card */}
        <div className="mt-4 rounded-2xl border border-[#F0E8DF] bg-white p-4 shadow-sm min-h-[300px]">

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : activeTab === "gift" ? (
            giftData.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {giftData.map((item: any, i) => (
                  <GiftCard key={i} data={item} />
                ))}
              </div>
            )
          ) : data.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-3">
              {data.map((item: any, i) => (
                <TransactionCard key={i} data={item} type={activeTab} />
))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}