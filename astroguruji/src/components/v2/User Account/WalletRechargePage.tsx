import { useEffect, useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import axios from "axios";
import RechargeModal from "./component/RechargeModal";

export default function RechargePage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [modal, setModal] = useState({
    open: false,
    type: "success", // success | error
    message: "",
  });

  // ─── Fetch Wallet Amount List ───
  const getWalletAmounts = async () => {
    try {
      const res = await axios.post(
        "https://admin.astrogurujii.com/user_api/Wallet_amount_list",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.status) {
        setOffers(res.data.results || []);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWalletAmounts();
  }, []);

  // ─── Handle Select Amount ───
  const selectAmount = (amt: number, index: number) => {
    setAmount(String(amt));
    setSelected(index);
  };

  // ─── Recharge Action ───
  const handleRecharge = async () => {
    if (!amount || Number(amount) <= 0) {
      return showModal("error", "Enter valid amount");
    }

    try {
      setLoading(true);

      // 🔥 HERE integrate Razorpay / Payment Gateway
      await fakePayment();

      showModal("success", "Wallet recharged successfully 🎉");
    } catch (e) {
      showModal("error", "Payment failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const fakePayment = () =>
    new Promise((res) => setTimeout(res, 1500));

  const showModal = (type: "success" | "error", message: string) => {
    setModal({ open: true, type, message });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="Recharge Wallet"
        highlight="Astrogurujii"
        description="Add money to your wallet quickly and securely."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recharge" },
        ]}
      />

      <div className="mx-auto max-w-[800px] px-4 py-10 space-y-6">

        {/* Amount Input */}
        <div className="rounded-xl border p-5 bg-white">
          <label className="text-sm font-semibold text-gray-700">
            Enter Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelected(null);
            }}
            placeholder="Enter amount"
            className="mt-2 w-full rounded-lg border px-4 py-3 focus:border-brand-orange outline-none"
          />
        </div>

        {/* Quick Options */}
        <div className="rounded-xl border p-5 bg-white">
          <h3 className="font-semibold mb-4">Quick Recharge</h3>

          <div className="grid grid-cols-3 gap-3">
            {offers.map((item, i) => (
              <button
                key={i}
                onClick={() =>
                  selectAmount(item.recharge_amount, i)
                }
                className={`rounded-lg border p-3 text-sm font-semibold transition
                  ${
                    selected === i
                      ? "bg-brand-orange text-white"
                      : "hover:border-brand-orange"
                  }`}
              >
                ₹ {item.recharge_amount}
                {item.msg && (
                  <p className="text-[10px] mt-1">
                    {item.msg}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recharge Button */}
        <button
          onClick={handleRecharge}
          className="w-full rounded-full bg-brand-orange py-3 text-white font-semibold flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Processing..." : "Recharge Now"}
        </button>
      </div>

      <Footer />

      {/* 🔥 Modal */}
      {modal.open && (
        <RechargeModal modal={modal} onClose={() => setModal({ ...modal, open: false })} />
      )}
    </div>
  );
}