import { useEffect, useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import axios from "axios";
import TransactionItem from "./component/TransectionLogItems";
import { useNavigate } from "react-router-dom";
type Transaction = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  message: string;
  date: string;
};

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();
  // ─── Fetch Wallet + Logs ───
  const getWalletData = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();

      const res = await axios.get(
        "https://admin.astrogurujii.com/user_api/get_profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          

          signal: controller.signal,
        }
      );

      if (res.data.status) {
        const data = res.data.results_web || res.data.results;

        // ✅ Wallet
        setWallet(data.wallet || 0);

        // ❗ If your API doesn't give logs, use dummy or another API
        setTransactions([
          {
            id: "1",
            type: "credit",
            amount: 100,
            message: "Wallet Recharge",
            date: "Today",
          },
          {
            id: "2",
            type: "debit",
            amount: 50,
            message: "Astrology Consultation",
            date: "Yesterday",
          },
        ]);
      }
    } catch (e) {
      alert("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWalletData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="Wallet"
        highlight="Astrogurujii"
        description="Manage your wallet balance and transactions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Wallet" },
        ]}
      />

      <div className="mx-auto max-w-[900px] px-4 py-10 space-y-6">

        {/* Wallet Card */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-orange to-orange-400 p-6 text-white shadow-md">
          <p className="text-sm opacity-90">Available Balance</p>
          <h2 className="text-3xl font-bold mt-1">
            ₹ {wallet}
          </h2>

          <button
            className="mt-4 rounded-full bg-white text-brand-orange px-6 py-2 text-sm font-semibold hover:opacity-90"
            onClick={() => navigate("/recharge-now")}
          >
            Recharge Now
          </button>
        </div>

        {/* Transactions */}
        {/* <div className="rounded-2xl border border-[#F0E8DF] bg-white p-5 shadow-sm">
          <h3 className="font-poppins text-[16px] font-bold mb-4">
            Recent Transactions
          </h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-500">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <TransactionItem key={t.id} data={t} />
              ))}
            </div>
          )}
        </div> */}
      </div>

      <Footer />
    </div>
  );
}