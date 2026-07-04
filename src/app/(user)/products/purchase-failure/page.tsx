import { XCircle, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PurchaseFailurePage() {
  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4 relative">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none glow-bg z-0" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Warning Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-destructive/10 blur-xl animate-pulse w-24 h-24 -m-2" />
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive relative">
            <XCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Purchase Unsuccessful
        </h1>
        
        <p className="text-sm md:text-base text-[#c9c8ab] mb-8 leading-relaxed max-w-md">
          We couldn't process your payment. This could be due to a temporary network issue, insufficient funds, or the transaction being canceled.
        </p>

        {/* Info Card */}
        <div className="w-full glass-card rounded-xl p-5 mb-8 text-left border border-[#252525]">
          <h2 className="text-xs font-bold text-[#929277] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-brand-yellow" />
            Troubleshooting Tips
          </h2>
          <ul className="text-xs text-[#c9c8ab] space-y-2.5 list-disc pl-4">
            <li>Check that your credit/debit card details are correct.</li>
            <li>Make sure you have sufficient funds in your account.</li>
            <li>Verify if your bank blocked the transaction for security reasons.</li>
            <li>Try using a different payment method if the issue persists.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand-yellow hover:brightness-110 active:scale-95 text-[#1b1d00] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Purchasing Again</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#1c1b1b] border border-[#252525] hover:bg-[#252525] active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
