"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, AlertCircle, CheckCircle2, ArrowLeft, Terminal, Check, Mail, AlertTriangle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const checkEmail = async () => {
    if (!email.trim()) return;

    try {
      setCheckingEmail(true);
      setError(null);
      setValidationError(null);

      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.exists) {
        setEmailValid(false);
        setValidationError("No identity node found matching this email address.");
        return;
      }

      setEmailValid(true);
      setValidationError(null);
    } catch {
      setEmailValid(false);
      setError("Validation node connection dropped.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setValidationError(null);

    if (!email.trim()) {
      setValidationError("Identity target email is required.");
      return;
    }

    if (emailValid === false) {
      setValidationError("Cannot emit link sequence for an unregistered email anchor.");
      return;
    }

    if (loading || checkingEmail) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Failed to send reset link.");
      }

      sessionStorage.setItem("resetEmail", email);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "System transmission failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white px-3 xs:px-4 py-6 antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden select-none">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-blue-600/5 via-purple-500/5 to-transparent blur-[60px] sm:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-lg p-4 xs:p-6 sm:p-11 bg-[#121214]/90 border border-white/5 rounded-xl sm:rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] relative z-10">
        
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <KeyRound size={18} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 rounded-full bg-zinc-900/80 border border-white/5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            <span className={`w-1 h-1 rounded-full ${emailValid ? "bg-emerald-500" : "bg-blue-500"}`} />
            <span>SECURITY_RECOVERY</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Enter your email to receive a recovery token. Note: If you do not see the message, verify your <strong className="text-zinc-200">Spam</strong>, <strong className="text-zinc-200">Junk</strong>, and <strong className="text-zinc-200">Promotions</strong> folders. If found, mark it as <strong className="text-blue-400">"Not Spam"</strong> to ensure reliable future delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 pl-0.5">
              Account Email
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(null);
                  if (validationError) setValidationError(null);
                }}
                onBlur={checkEmail}
                disabled={loading}
                className={`w-full p-3 sm:p-4 bg-[#0A0A0B] border rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 transition-all duration-200 font-sans ${
                  validationError ? "border-red-500/50" : emailValid ? "border-emerald-500/40" : "border-white/5"
                }`}
              />
              <div className="absolute right-3.5 flex items-center">
                {checkingEmail && <Loader2 size={12} className="text-amber-400 animate-spin" />}
                {!checkingEmail && emailValid === true && <Check size={12} className="text-emerald-500" />}
              </div>
            </div>

            {validationError && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> {validationError}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center gap-2.5 text-[10px] sm:text-xs font-mono text-red-400">
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || checkingEmail || !emailValid}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={12} className="animate-spin" /> <span>Emitting...</span></>
            ) : (
              <span>Deploy Token</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.04] text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500 hover:text-white uppercase tracking-wider"
          >
            <ArrowLeft size={11} />
            <span>Abort & Return to Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}