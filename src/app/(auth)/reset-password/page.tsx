"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  AlertTriangle 
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email") ||
    (typeof window !== "undefined" ? sessionStorage.getItem("resetEmail") : null) ||
    "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setValidationErrors({});

    const errors: typeof validationErrors = {};

    if (!otp) {
      errors.otp = "Access token passcode is required.";
    } else if (otp.length !== 6) {
      errors.otp = "Passcode must be exactly 6 digits.";
    }

    if (!password) {
      errors.password = "New authorization key is required.";
    } else if (password.length < 8) {
      errors.password = "Minimum 8 characters required.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Password mismatch detected.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: otp, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Reset operation failed.");
      }

      sessionStorage.removeItem("resetEmail");
      setSuccess("Password updated successfully. Routing...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "System transmission failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-zinc-300 px-3 xs:px-4 py-6 antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden select-none">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-blue-600/5 via-purple-500/5 to-transparent blur-[60px] sm:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-lg p-4 xs:p-6 sm:p-11 bg-[#121214]/90 border border-white/5 rounded-xl sm:rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] relative z-10">
        
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <KeyRound size={18} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 rounded-full bg-zinc-900/80 border border-white/5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            <span className={`w-1 h-1 rounded-full ${success ? "bg-emerald-500" : "bg-blue-500"}`} />
            <span>MEMORY_RECONFIGURATION</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Reset Password
          </h1>
          <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Input your 6-digit security token. If not received, verify your <strong className="text-zinc-200">Spam/Junk</strong> folders. Mark our dispatch as <strong className="text-blue-400">"Not Spam"</strong> for stable future delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 opacity-60">
            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 pl-0.5">Target Identity</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-3 bg-[#0A0A0B] border border-white/5 rounded-lg text-zinc-500 text-[11px] sm:text-sm font-sans truncate shadow-inner cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">Security OTP</label>
              <span className="text-[9px] font-mono text-zinc-600">{otp.length}/6</span>
            </div>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              className={`w-full p-3.5 text-center tracking-[0.5em] font-mono font-bold text-xs bg-[#0A0A0B] border rounded-lg text-white focus:outline-none transition-all duration-200 ${
                validationErrors.otp ? "border-red-500/50" : "border-white/5 focus:border-blue-500/60"
              }`}
            />
            {validationErrors.otp && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> {validationErrors.otp}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 pl-0.5">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3.5 pr-10 bg-[#0A0A0B] border rounded-lg text-white text-xs focus:outline-none transition-all duration-200 ${
                  validationErrors.password ? "border-red-500/50" : "border-white/5 focus:border-blue-500/60"
                }`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 text-zinc-600 hover:text-zinc-300">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> {validationErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 pl-0.5">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3.5 pr-10 bg-[#0A0A0B] border rounded-lg text-white text-xs focus:outline-none transition-all duration-200 ${
                  validationErrors.confirmPassword ? "border-red-500/50" : "border-white/5 focus:border-blue-500/60"
                }`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 text-zinc-600 hover:text-zinc-300">
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center gap-2.5 text-[10px] font-mono text-red-400">
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2.5 text-[10px] font-mono text-emerald-400">
              <CheckCircle2 size={13} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2 h-11"
          >
            {loading ? <><Loader2 size={12} className="animate-spin" /> <span>Resetting...</span></> : "Commit Password Reset"}
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