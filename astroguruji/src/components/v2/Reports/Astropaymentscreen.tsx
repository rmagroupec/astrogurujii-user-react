/**
 * PaymentScreen.tsx
 * Route: /payment
 * Navigate here from WalletRechargePage:
 *   navigate("/payment", { state: { amount, currency, offer_id, offer_percent } })
 */

import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/v2/Navbar";
import axios from "axios";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const GST = 18;
function calcPrices(base: number, currency: string, offerPercent: number) {
  const original    = base;
  const gst         = currency === "INR" ? parseFloat(((original * GST) / 100).toFixed(2)) : 0;
  const net         = parseFloat((original + gst).toFixed(2));
  const bonus       = parseFloat(((original * offerPercent) / 100).toFixed(2));
  const totalWallet = parseFloat((original + bonus).toFixed(2));
  return { original, gst, net, bonus, totalWallet };
}
const sym = (c: string) => (c === "USD" ? "$" : "₹");
const fmt = (n: number, c: string) => `${sym(c)}${n.toFixed(2)}`;

const token = () => localStorage.getItem("token") ?? "";

async function fetchCouponList(coupon_code: string, type = "wallet") {
  const res = await axios.post(
    "https://admin.astrogurujii.com/user_api/coupan_list",
    { coupan_code: coupon_code, type },
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
}

async function callAddWallet(payload: {
  offer_id: any; profit_amount: string; coupan_code: string;
  amount: string; wallet_amount: string; transaction_id: string;
}) {
  const res = await axios.post(
    "https://admin.astrogurujii.com/user_api/user_wallet_add",
    payload,
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
}

function SummaryRow({ label, value, accent = false, muted = false }: {
  label: string; value: string; accent?: boolean; muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-[10px] border-b border-gray-100 last:border-0">
      <span className={`text-sm font-medium ${muted ? "text-gray-400" : "text-gray-600"}`}>{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-brand-orange" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state: { amount: string; currency?: string; offer_id?: any; offer_percent?: string; } | null;
  };

  if (!state?.amount) { navigate("/recharge-now"); return null; }

  const currency       = state.currency ?? "INR";
  const baseAmount     = parseFloat(state.amount) || 0;
  const initialPercent = parseFloat(state.offer_percent ?? "0") || 0;
  const initialOfferId = state.offer_id ?? null;

  const [couponInput,   setCouponInput]   = useState("");
  const [couponStatus,  setCouponStatus]  = useState<null | "loading" | "success" | "error">(null);
  const [couponMsg,     setCouponMsg]     = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; percent: number; id: any; title: string; }>(null);
  const [paying,   setPaying]   = useState(false);
  const [payError, setPayError] = useState("");

  const activePercent = appliedCoupon?.percent ?? initialPercent;
  const activeOfferId = appliedCoupon?.id ?? initialOfferId;
  const { original, gst, net, bonus, totalWallet } = calcPrices(baseAmount, currency, activePercent);

  const applyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;
    setCouponStatus("loading"); setCouponMsg("");
    try {
      const res = await fetchCouponList(couponInput.trim());
      if (res.status && res.results?.length > 0) {
        const offer = res.results[0];
        setAppliedCoupon({ code: couponInput.trim(), percent: parseFloat(offer.offer_percent ?? offer.percent ?? "0"), id: offer.id ?? offer.offer_id, title: offer.title ?? couponInput.trim() });
        setCouponStatus("success");
        setCouponMsg(`Coupon applied! +${offer.offer_percent ?? offer.percent}% bonus`);
      } else {
        setAppliedCoupon(null); setCouponStatus("error");
        setCouponMsg(res.message || "Invalid or expired coupon");
      }
    } catch { setCouponStatus("error"); setCouponMsg("Failed to validate coupon. Try again."); }
  }, [couponInput]);

  const removeCoupon = () => { setAppliedCoupon(null); setCouponInput(""); setCouponStatus(null); setCouponMsg(""); };

  const handlePayNow = async () => {
    setPaying(true); setPayError("");
    const loaded = await loadRazorpay();
    if (!loaded) { setPayError("Payment gateway failed to load."); setPaying(false); return; }

    const sharedState = { amountPaid: net, walletCredited: totalWallet, bonusEarned: bonus, currency };

    const options = {
      key: "rzp_live_91JPRPBs9lDIZw", // 🔑 Replace
      amount: Math.round(net * 100),
      currency,
      name: "ASTROGURUJII",
      description: "Wallet Recharge",
      image: "https://admin.astrogurujii.com/logo/app_logo.png",
      prefill: { contact: localStorage.getItem("phone") ?? "", email: localStorage.getItem("email") ?? "" },
      theme: { color: "#FF6F00" },

      handler: async (response: any) => {
        const txnId: string = response.razorpay_payment_id;
        try {
          const walletRes = await callAddWallet({
            offer_id: activeOfferId, profit_amount: bonus.toFixed(2),
            coupan_code: appliedCoupon?.code ?? "", amount: net.toFixed(2),
            wallet_amount: totalWallet.toFixed(2), transaction_id: txnId,
          });
          if (walletRes?.status) {
            navigate("/recharge-success", { state: { ...sharedState, txnId, message: walletRes.message } });
          } else {
            // Razorpay captured payment but wallet API uncertain → pending
            navigate("/recharge-pending", { state: { ...sharedState, txnId } });
          }
        } catch {
          // Network error after capture → pending (NOT failed)
          navigate("/recharge-pending", { state: { ...sharedState, txnId } });
        }
        setPaying(false);
      },

      modal: { ondismiss: () => setPaying(false) },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (resp: any) => {
      navigate("/recharge-failed", {
        state: { ...sharedState, txnId: resp.error?.metadata?.payment_id ?? "", errorMsg: resp.error?.description ?? "Payment failed." },
      });
      setPaying(false);
    });
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />
      {/* <div className="bg-gradient-to-r from-orange-800 to-brand-orange px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white transition-colors">
          ← Back
        </button>
        <p className="text-white/70 text-xs tracking-widest uppercase mb-1">Wallet Recharge</p>
        <p className="text-white text-4xl font-bold">{fmt(net, currency)}</p>
        {currency === "INR" && <p className="text-white/60 text-xs mt-1">Incl. GST ₹{gst.toFixed(2)}</p>}
      </div> */}

      <div className="max-w-[520px] mx-auto px-4 py-6 space-y-4">

        <div className="bg-white rounded-2xl border border-[#F0E8DF] shadow-sm p-5">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Payment Summary</p>
          <SummaryRow label="Base Amount"    value={fmt(original, currency)} />
          {currency === "INR" && <SummaryRow label={`GST @ ${GST}%`} value={fmt(gst, currency)} muted />}
          <SummaryRow label="Amount Payable" value={fmt(net, currency)} accent />
        </div>

        {activePercent > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-green-800">🎁 Bonus Cashback ({activePercent}%)</p>
                <p className="text-xs text-green-600 mt-0.5">{appliedCoupon?.title ?? "Offer applied"}</p>
              </div>
              <span className="text-base font-bold text-green-700">+{fmt(bonus, currency)}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200 flex justify-between">
              <span className="text-sm text-green-700">Total Wallet Credit</span>
              <span className="text-base font-bold text-green-900">{fmt(totalWallet, currency)}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#F0E8DF] shadow-sm p-5">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Coupon / Promo Code</p>
          {appliedCoupon ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-green-50 border border-green-300 rounded-xl px-3 py-2">
                <span className="text-sm font-semibold text-green-800">✓ {appliedCoupon.code}</span>
                <span className="text-xs text-green-600 ml-2">— {appliedCoupon.percent}% bonus</span>
              </div>
              <button onClick={removeCoupon} className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()} placeholder="Enter coupon code"
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-mono tracking-wider focus:border-brand-orange outline-none transition-colors"
              />
              <button onClick={applyCoupon} disabled={couponStatus === "loading" || !couponInput.trim()}
                className="px-5 py-2 rounded-xl bg-brand-orange text-white text-sm font-semibold disabled:opacity-40 hover:bg-orange-600 transition">
                {couponStatus === "loading"
                  ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : "Apply"}
              </button>
            </div>
          )}
          {couponStatus === "error"   && <p className="mt-2 text-xs text-red-500">✗ {couponMsg}</p>}
          {couponStatus === "success" && <p className="mt-2 text-xs text-green-600">✓ {couponMsg}</p>}
        </div>

        {payError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">⚠ {payError}</div>
        )}

        <div className="bg-white rounded-2xl border border-[#F0E8DF] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-800 to-brand-orange px-5 py-3 flex justify-between items-center">
            <span className="text-white/80 text-sm">Total Pay</span>
            <span className="text-white text-lg font-bold">{currency} {net.toFixed(2)}</span>
          </div>
          <div className="p-4">
            <button onClick={handlePayNow} disabled={paying}
              className="w-full py-4 rounded-xl bg-brand-orange text-white text-base font-bold tracking-wide disabled:opacity-50 hover:bg-orange-600 transition-all shadow-[0_4px_14px_rgba(255,111,0,0.35)]">
              {paying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : `PAY ${fmt(net, currency)}`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">Secured by Razorpay · 100% Safe & Encrypted</p>
          </div>
        </div>

      </div>
    </div>
  );
}