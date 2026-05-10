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
        <div className="rounded-xl border shadow-sm p-5 sm:p-6 bg-white">
          <label className="text-sm font-semibold text-gray-700">
            Enter Amount
          </label>
          <div className="relative mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setSelected(null);
              }}
              placeholder="Enter amount"
              className="w-full rounded-lg border-2 border-gray-200 pl-9 pr-4 py-3 focus:border-brand-orange outline-none transition-colors text-lg font-bold text-gray-800"
            />
          </div>
        </div>

        {/* Quick Options */}
        <div className="rounded-xl border shadow-sm p-5 sm:p-6 bg-white">
          <h3 className="font-semibold text-lg text-gray-800 mb-6">
            Quick Recharge
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
            {offers.map((item, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => selectAmount(item.recharge_amount, i)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-4 sm:p-5 transition-all duration-200
                    ${
                      isSelected
                        ? "border-brand-orange bg-[rgba(255,111,0,0.05)] shadow-md scale-[1.02]"
                        : "border-gray-200 hover:border-brand-orange/50 hover:bg-gray-50"
                    }`}
                >
                  {/* Floating Offer Badge */}
                  {item.msg && (
                    <div
                      className={`absolute -top-3 shadow-sm text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-10 transition-colors
                        ${
                          isSelected
                            ? "bg-brand-orange text-white"
                            : "bg-green-500 text-white"
                        }`}
                    >
                      {item.msg}
                    </div>
                  )}

                  {/* Amount Text */}
                  <span
                    className={`text-lg sm:text-2xl font-extrabold tracking-tight ${
                      isSelected ? "text-brand-orange" : "text-gray-800"
                    }`}
                  >
                    ₹ {item.recharge_amount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recharge Button */}
        <button
          onClick={handleRecharge}
          className="w-full rounded-full bg-brand-orange py-[14px] text-white text-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,111,0,0.39)] transition hover:bg-orange-600 hover:shadow-lg"
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Processing..." : "Recharge Now"}
        </button>
      </div>

      <Footer />

      {/* 🔥 Modal */}
      {modal.open && (
        <RechargeModal
          modal={modal}
          onClose={() => setModal({ ...modal, open: false })}
        />
      )}
    </div>
  );
}