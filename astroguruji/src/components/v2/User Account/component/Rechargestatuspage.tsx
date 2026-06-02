/**
 * RechargeStatusPage.tsx
 * Routes:
 *   /recharge-success  → status: "success"
 *   /recharge-failed   → status: "failed"
 *   /recharge-pending  → status: "pending"
 *
 * All three share this one component — the `status` prop decides what renders.
 * Navigate here from PaymentScreen via:
 *
 *   navigate("/recharge-success", {
 *     state: {
 *       amountPaid: 590,
 *       walletCredited: 720,
 *       bonusEarned: 100,
 *       currency: "INR",
 *       txnId: "pay_xxx",
 *       message: "Wallet updated",
 *     }
 *   });
 *
 *   navigate("/recharge-failed", {
 *     state: { amountPaid: 590, currency: "INR", txnId: "pay_xxx", errorMsg: "..." }
 *   });
 *
 *   navigate("/recharge-pending", {
 *     state: { amountPaid: 590, currency: "INR", txnId: "pay_xxx" }
 *   });
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "success" | "failed" | "pending";

interface RouteState {
  amountPaid?: number;
  walletCredited?: number;
  bonusEarned?: number;
  currency?: string;
  txnId?: string;
  message?: string;
  errorMsg?: string;
}

// ─── Config per status ────────────────────────────────────────────────────────

const CONFIG = {
  success: {
    headerGradient: "from-green-600 to-emerald-500",
    iconBg: "bg-green-100",
    iconColor: "#16a34a",
    ringColor: "border-green-300",
    badgeBg: "bg-green-50",
    badgeBorder: "border-green-200",
    badgeText: "text-green-700",
    title: "Payment Successful!",
    subtitle: "Your wallet has been recharged.",
    label: "SUCCESS",
    labelBg: "bg-green-100 text-green-700",
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  failed: {
    headerGradient: "from-red-700 to-red-500",
    iconBg: "bg-red-100",
    iconColor: "#dc2626",
    ringColor: "border-red-300",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-200",
    badgeText: "text-red-700",
    title: "Payment Failed",
    subtitle: "Your transaction could not be completed.",
    label: "FAILED",
    labelBg: "bg-red-100 text-red-700",
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  pending: {
    headerGradient: "from-amber-600 to-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "#d97706",
    ringColor: "border-amber-300",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-700",
    title: "Payment Pending",
    subtitle: "We're verifying your transaction.",
    label: "PENDING",
    labelBg: "bg-amber-100 text-amber-700",
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
};

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-brand-orange" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Animated icon ────────────────────────────────────────────────────────────

function StatusIcon({ config, status }: { config: typeof CONFIG["success"]; status: Status }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse ring — only for success */}
      {status === "success" && (
        <div
          className={`absolute inset-0 rounded-full border-2 ${config.ringColor}`}
          style={{ animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
        />
      )}
      {/* Spinner ring — only for pending */}
      {status === "pending" && (
        <div
          className={`absolute inset-0 rounded-full border-4 border-t-amber-400 border-amber-100`}
          style={{ animation: "spin 1s linear infinite" }}
        />
      )}
      <div className={`w-24 h-24 rounded-full ${config.iconBg} flex items-center justify-center`}>
        {config.icon}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  status: Status;
}

export default function RechargeStatusPage({ status }: Props) {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: RouteState | null };

  const [animIn, setAnimIn] = useState(false);
  const [countdown, setCountdown] = useState(status === "success" ? 8 : 0);

  const cfg = CONFIG[status];
  const currency = state?.currency ?? "INR";
  const sym = currency === "USD" ? "$" : "₹";
  const fmt = (n?: number) => (n != null ? `${sym}${n.toFixed(2)}` : "—");

  // Fade in
  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Auto-redirect for success
  useEffect(() => {
    if (status !== "success" || countdown <= 0) return;
    if (countdown === 0) { navigate("/my-wallet"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, status, navigate]);

  // Guard: if no state at all, redirect to recharge
  useEffect(() => {
    if (!state) navigate("/recharge-now");
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <Navbar />

      {/* Gradient header strip */}
      <div className={`bg-gradient-to-r ${cfg.headerGradient} px-6 py-5`}>
        <nav className="max-w-[720px] mx-auto flex items-center gap-2 text-sm text-white/70">
          <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Home</button>
          <span>›</span>
          <button onClick={() => navigate("/my-wallet")} className="hover:text-white transition-colors">Wallet</button>
          <span>›</span>
          <span className="text-white font-medium">{cfg.title}</span>
        </nav>
      </div>

      {/* Main card */}
      <div className="flex-grow flex items-start justify-center px-4 py-10">
        <div
          className="w-full max-w-[520px] space-y-4"
          style={{
            opacity: animIn ? 1 : 0,
            transform: animIn ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        >

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Coloured top banner */}
            <div className={`bg-gradient-to-r ${cfg.headerGradient} px-6 py-5 flex items-center gap-4`}>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {status === "success" && <polyline points="20 6 9 17 4 12" />}
                  {status === "failed"  && <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
                  {status === "pending" && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">{cfg.title}</h1>
                <p className="text-white/75 text-sm">{cfg.subtitle}</p>
              </div>
              {/* Status pill */}
              <span className={`ml-auto text-[10px] font-bold px-3 py-1 rounded-full ${cfg.labelBg}`}>
                {cfg.label}
              </span>
            </div>

            {/* Body */}
            <div className="px-6 py-8 flex flex-col items-center gap-6">

              {/* Icon */}
              <StatusIcon config={cfg} status={status} />

              {/* Message */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">{cfg.title}</h2>
                <p className="text-gray-400 text-sm mt-1 max-w-xs leading-relaxed">
                  {status === "success" && (state.message || "Your wallet has been credited successfully.")}
                  {status === "failed"  && (state.errorMsg || "Your payment could not be processed. If any amount was debited, it will be refunded within 2–3 working days.")}
                  {status === "pending" && "Your payment is under verification. This usually resolves in a few minutes. Do not retry the payment."}
                </p>
              </div>

              {/* Transaction details */}
              <div className={`w-full rounded-xl border ${cfg.badgeBorder} ${cfg.badgeBg} p-4`}>
                <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${cfg.badgeText}`}>
                  Transaction Details
                </p>

                {state.txnId && (
                  <DetailRow label="Transaction ID" value={state.txnId} />
                )}
                {state.amountPaid != null && (
                  <DetailRow label="Amount Paid" value={fmt(state.amountPaid)} />
                )}
                {status === "success" && state.bonusEarned != null && state.bonusEarned > 0 && (
                  <DetailRow label="Bonus Earned" value={`+${fmt(state.bonusEarned)}`} />
                )}
                {status === "success" && state.walletCredited != null && (
                  <DetailRow label="Wallet Credited" value={fmt(state.walletCredited)} highlight />
                )}
              </div>

              {/* Status-specific info box */}
              {status === "pending" && (
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <span>⏳</span> What to do now?
                  </p>
                  <ul className="space-y-1.5 text-amber-700 text-xs pl-1">
                    <li>• Do <strong>not</strong> retry the payment — you may be charged twice.</li>
                    <li>• Wait 5–10 minutes for automatic resolution.</li>
                    <li>• Check your wallet balance in a few minutes.</li>
                    <li>• If unresolved after 30 minutes, contact support.</li>
                  </ul>
                </div>
              )}

              {status === "failed" && (
                <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <span>ℹ️</span> What happens next?
                  </p>
                  <ul className="space-y-1.5 text-red-700 text-xs pl-1">
                    <li>• If your bank account was debited, the amount will be refunded within <strong>2–3 working days</strong>.</li>
                    <li>• Refunds go back to the original payment method.</li>
                    <li>• You can safely try recharging again below.</li>
                  </ul>
                </div>
              )}

              {status === "success" && countdown > 0 && (
                <p className="text-xs text-gray-400">
                  Redirecting to wallet in{" "}
                  <span className="font-bold text-brand-orange">{countdown}s</span>
                </p>
              )}

            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {status === "success" && (
              <>
                <button
                  onClick={() => navigate("/my-wallet")}
                  className="flex-1 bg-brand-orange hover:bg-orange-600 transition text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-100 flex items-center justify-center gap-2 text-sm"
                >
                  <WalletIcon />
                  View Wallet
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-orange-50 hover:bg-orange-100 transition text-brand-orange font-bold py-3.5 rounded-xl border border-orange-200 flex items-center justify-center gap-2 text-sm"
                >
                  <HomeIcon />
                  Go Home
                </button>
              </>
            )}

            {status === "failed" && (
              <>
                <button
                  onClick={() => navigate("/recharge-now")}
                  className="flex-1 bg-brand-orange hover:bg-orange-600 transition text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-100 flex items-center justify-center gap-2 text-sm"
                >
                  <RetryIcon />
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/my-wallet")}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm"
                >
                  <WalletIcon />
                  My Wallet
                </button>
              </>
            )}

            {status === "pending" && (
              <>
                <button
                  onClick={() => navigate("/my-wallet")}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 transition text-white font-bold py-3.5 rounded-xl shadow-md shadow-amber-100 flex items-center justify-center gap-2 text-sm"
                >
                  <WalletIcon />
                  Check Wallet
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm"
                >
                  <HomeIcon />
                  Go Home
                </button>
              </>
            )}
          </div>

          {/* Support strip */}
          <div className={`bg-gradient-to-r ${cfg.headerGradient} rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3`}>
            <div>
              <p className="text-white font-bold text-sm">Need help?</p>
              <p className="text-white/70 text-xs">Our support team is available 24×7</p>
            </div>
            <button
              onClick={() => navigate("/customer-chat-support")}
              className="bg-white/20 hover:bg-white/30 transition text-white text-xs font-bold px-5 py-2.5 rounded-xl border border-white/30 whitespace-nowrap"
            >
              Contact Support →
            </button>
          </div>

        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes ping  { 75%,100% { transform: scale(1.6); opacity: 0; } }
        @keyframes spin  { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Tiny inline icons ────────────────────────────────────────────────────────

function WalletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.36"/>
    </svg>
  );
}