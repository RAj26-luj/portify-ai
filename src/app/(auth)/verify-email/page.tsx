"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { 
  Loader2, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Terminal, 
  RefreshCw,
  Mail,
  AlertTriangle
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const verifyEmail = async () => {
    if (loading || resending) return;

    setValidationError(null);
    setError(null);
    setMessage(null);

    if (!code) {
      setValidationError("Passcode metric is required to initialize verification.");
      return;
    }
    if (code.length !== 6) {
      setValidationError("Security token sequence must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Verification failed.");
      }

      setMessage("Email verified successfully. Routing...");

      const savedEmail = sessionStorage.getItem("pendingEmail");
      const savedPassword = sessionStorage.getItem("pendingPassword");

      if (savedEmail && savedPassword) {
        await signIn("credentials", {
          email: savedEmail,
          password: savedPassword,
          redirect: false,
        });
      }

      sessionStorage.removeItem("pendingEmail");
      sessionStorage.removeItem("pendingPassword");

      setTimeout(() => router.push("/approval-note"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resending || loading || cooldown > 0) return;

    try {
      setResending(true);
      setError(null);
      setMessage(null);
      setValidationError(null);

      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Failed to resend code.");
      }

      setMessage("New verification code dispatched.");
      setCooldown(180);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const handleInputChange = (val: string) => {
    const numericValue = val.replace(/[^0-9]/g, "");
    setCode(numericValue);
    if (validationError && numericValue.length === 6) {
      setValidationError(null);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-zinc-300 px-3 xs:px-4 py-6 antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-blue-600/5 via-purple-500/5 to-transparent blur-[60px] sm:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-lg p-4 xs:p-6 sm:p-11 bg-[#121214]/90 border border-white/5 rounded-xl sm:rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] relative z-10">
        
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 rounded-full bg-zinc-900/80 border border-white/5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            <span className={`w-1 h-1 rounded-full ${message ? "bg-emerald-500" : "bg-blue-500"}`} />
            <span>IDENTITY_CONFIRMATION</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Verify Email
          </h1>
          <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Enter the 6-digit token sent to your email. If not found, check <strong className="text-zinc-200">Spam/Junk/Promotions</strong>. If located, mark as <strong className="text-blue-400">"Not Spam"</strong> to ensure reliable delivery.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 pl-0.5">
              Security Passcode
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={code}
              disabled={loading || resending}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`w-full p-3 sm:p-4 text-center tracking-[0.4em] font-mono font-bold text-xs sm:text-base bg-[#0A0A0B] border rounded-lg text-white focus:outline-none transition-all duration-200 ${
                validationError ? "border-red-500/50" : "border-white/5 focus:border-blue-500/60"
              }`}
            />
            {validationError && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> {validationError}
              </p>
            )}
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2.5 text-[10px] sm:text-xs font-mono text-emerald-400">
              <CheckCircle2 size={13} className="shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center gap-2.5 text-[10px] sm:text-xs font-mono text-red-400">
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={verifyEmail}
            disabled={loading || resending || code.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2 h-11"
          >
            {loading ? <><Loader2 size={12} className="animate-spin" /> <span>Verifying...</span></> : "Confirm Code Block"}
          </button>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/[0.04]"></div>
          <span className="flex-shrink mx-3 text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-widest">Re-emit Stream</span>
          <div className="flex-grow border-t border-white/[0.04]"></div>
        </div>

        <form onSubmit={resendVerification} className="space-y-4">
          <div className="space-y-1.5 opacity-50">
            <div className="relative flex items-center">
              <input type="email" value={email} readOnly className="w-full p-3 bg-[#070708] border border-white/5 rounded-lg text-zinc-500 text-[11px] font-sans truncate" />
              <Terminal size={11} className="absolute right-3.5 text-zinc-700" />
            </div>
          </div>

          <button
            type="submit"
            disabled={resending || loading || cooldown > 0}
            className="w-full flex items-center justify-center gap-2 bg-[#0F0F11] hover:bg-[#151518] border border-white/5 text-zinc-300 p-3.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 disabled:opacity-40 h-11"
          >
            {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={11} />}
            <span>
              {cooldown > 0 
                ? `Retry in ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}` 
                : "Request Fresh Passcode"
              }
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}