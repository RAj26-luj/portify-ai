"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft, Check, Eye, EyeOff, X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [strengthScore, setStrengthScore] = useState(0);
  const [criteria, setCriteria] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const checks = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setCriteria(checks);

    const activeScore = Object.values(checks).filter(Boolean).length;
    setStrengthScore(activeScore);
  }, [password]);

  const checkEmail = async () => {
    if (!email.trim()) return;

    try {
      setCheckingEmail(true);
      setError(null);

      const errors = { ...validationErrors };
      delete errors.email;
      setValidationErrors(errors);

      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (data.exists) {
        setEmailValid(false);
        setValidationErrors((prev) => ({
          ...prev,
          email: "Email parameter is already bound to another registered identity instance.",
        }));
        return;
      }

      setEmailValid(true);
    } catch {
      setEmailValid(false);
      setError("Unable to verify email");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const errors: typeof validationErrors = {};

    if (!name.trim()) {
      errors.name = "Full name designation parameter is required.";
    }

    if (!email.trim()) {
      errors.email = "Account endpoint email identity is required.";
    } else if (emailValid === false) {
      errors.email = "Please specify an alternative unique verification email address.";
    }

    if (!password) {
      errors.password = "Cryptographic password system key is required.";
    } else if (strengthScore < 5) {
      errors.password = "Strict system cryptographic parameters requirement block failure.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirmation verification token copy mismatch.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords alignment parameters configuration mismatch.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (loading || checkingEmail) return;

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Registration failed");
      }

      sessionStorage.setItem("pendingEmail", email);
      sessionStorage.setItem("pendingPassword", password);

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (googleLoading || loading) return;

    try {
      setGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/google-success",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-zinc-300 px-4 py-6 sm:p-8 antialiased selection:bg-blue-500/30 selection:text-white relative overflow-hidden md:[perspective:1200px] select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[700px] h-[280px] sm:h-[700px] bg-gradient-to-tr from-blue-600/10 via-purple-500/5 to-transparent blur-[80px] sm:blur-[140px] rounded-full pointer-events-none z-0 animate-pulse duration-[8000ms]" />

      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-50 w-[calc(100%-2rem)] sm:w-auto">
        <Link
          href="/"
          className="group/back inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-[#0F0F0F]/80 backdrop-blur-md border border-white/5 hover:border-blue-500/20 text-zinc-400 hover:text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] active:scale-95 md:[transform-style:preserve-3d] md:hover:[transform:translateZ(15px)]"
        >
          <ArrowLeft
            size={12}
            className="transform group-hover/back:-translate-x-0.5 transition-transform text-zinc-500 group-hover/back:text-blue-400 sm:w-[13px] sm:h-[13px]"
          />
          <span>Return Home Base</span>
        </Link>
      </div>

      <div className="w-full max-w-sm sm:max-w-lg p-5 sm:p-11 bg-gradient-to-b from-[#121214]/90 to-[#0C0C0E]/95 border border-white/5 sm:border-white/10 sm:border-t-white/[0.15] rounded-xl sm:rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] relative z-10 mt-16 mb-6 transition-all duration-500 md:[transform-style:preserve-3d] md:hover:[transform:rotateX(4deg)_rotateY(-2deg)_translateZ(8px)] hover:border-white/10 sm:hover:border-white/20 group/card">
        <div className="flex items-center justify-between mb-5 sm:mb-8 md:[transform:translateZ(30px)] gap-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck size={16} className="sm:hidden" />
            <ShieldCheck size={20} className="hidden sm:block" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-zinc-900/80 border border-white/5 font-mono text-[8px] sm:text-[9px] font-bold tracking-widest text-zinc-500 uppercase truncate">
            <span
              className={`w-1 h-1 rounded-full shrink-0 ${emailValid === true && strengthScore === 5 ? "bg-emerald-500" : "bg-blue-500"}`}
            />
            <span className="truncate">WORKSPACE_REGISTRATION</span>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 md:[transform:translateZ(25px)]">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 mb-1.5">
            Create Account
          </h1>
          <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-sm">
            Create your Portify AI account and submit it for authorization verification.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4 sm:space-y-5 md:[transform:translateZ(20px)]"
        >
          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-0.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Raj Kumar"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name)
                  setValidationErrors((prev) => ({ ...prev, name: undefined }));
              }}
              disabled={loading}
              className={`w-full p-2.5 sm:p-3.5 bg-[#0A0A0B] border rounded-lg sm:rounded-xl text-white placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:bg-[#0E0E10] transition-all duration-200 disabled:opacity-40 ${
                validationErrors.name
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/5 focus:border-blue-500/60"
              }`}
              required
            />
            {validationErrors.name && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1 pl-0.5 animate-fadeIn">
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                <span>{validationErrors.name}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5 relative">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                Email Address
              </label>
              {checkingEmail && (
                <Loader2 size={11} className="text-amber-400 animate-spin shrink-0" />
              )}
              {!checkingEmail && emailValid === true && (
                <Check size={11} className="text-emerald-400 font-bold shrink-0" />
              )}
            </div>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailValid(null);
                if (validationErrors.email)
                  setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onBlur={checkEmail}
              disabled={loading}
              className={`w-full p-2.5 sm:p-3.5 bg-[#0A0A0B] border rounded-lg sm:rounded-xl text-white placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:bg-[#0E0E10] transition-all duration-200 disabled:opacity-40 font-sans shadow-inner truncate ${
                validationErrors.email || emailValid === false
                  ? "border-red-500/40 focus:border-red-500"
                  : emailValid === true
                    ? "border-emerald-500/40 focus:border-emerald-500"
                    : "border-white/5 focus:border-blue-500/60"
              }`}
              required
            />
            {validationErrors.email && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1 pl-0.5 animate-fadeIn">
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                <span>{validationErrors.email}</span>
              </p>
            )}
            {!validationErrors.email && checkingEmail && (
              <p className="text-[10px] font-mono font-medium text-zinc-500 mt-1 animate-pulse">
                // Checking email...
              </p>
            )}
            {!validationErrors.email && !checkingEmail && emailValid === true && (
              <p className="text-[10px] font-mono font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
                <span>// anchor_resolved:</span>
                <span className="text-zinc-400">Email available</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-0.5">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password)
                    setValidationErrors((prev) => ({ ...prev, password: undefined }));
                }}
                disabled={loading}
                className={`w-full p-2.5 sm:p-3.5 pr-10 bg-[#0A0A0B] border rounded-lg sm:rounded-xl text-white placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:bg-[#0E0E10] transition-all duration-200 disabled:opacity-40 font-sans shadow-inner ${
                  validationErrors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/5 focus:border-blue-500/60"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 p-1 text-zinc-600 hover:text-zinc-300 transition-colors focus:outline-none disabled:opacity-30"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1 pl-0.5 animate-fadeIn">
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                <span>{validationErrors.password}</span>
              </p>
            )}

            {password.length > 0 && (
              <div className="mt-2.5 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-[#0A0A0B] border border-white/5 space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono uppercase tracking-wider gap-2">
                  <span className="text-zinc-600">Password Vector:</span>
                  <span
                    className={`truncate font-bold ${strengthScore === 5 ? "text-emerald-400" : "text-zinc-500"}`}
                  >
                    {strengthScore === 5 ? "Approved" : `${strengthScore}/5 Requirements`}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 h-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full rounded-full transition-all duration-300 ${
                        i < strengthScore
                          ? strengthScore === 5
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            : "bg-blue-500/60"
                          : "bg-zinc-900"
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex flex-col gap-1 text-[9px] sm:text-[10px] font-mono max-h-24 overflow-y-auto">
                  <div
                    className={`flex items-center gap-1.5 ${criteria.minLength ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {criteria.minLength ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                    <span>Min 8 Characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${criteria.hasUpper ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {criteria.hasUpper ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                    <span>Uppercase Letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${criteria.hasLower ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {criteria.hasLower ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                    <span>Lowercase Letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${criteria.hasNumber ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {criteria.hasNumber ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                    <span>Numeric Digit</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${criteria.hasSpecial ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {criteria.hasSpecial ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                    <span>Special Symbol</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-0.5">
              Confirm Password Key
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword)
                    setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                disabled={loading}
                className={`w-full p-2.5 sm:p-3.5 pr-10 bg-[#0A0A0B] border rounded-lg sm:rounded-xl text-white placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:bg-[#0E0E10] transition-all duration-200 disabled:opacity-40 font-sans shadow-inner ${
                  validationErrors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/5 focus:border-blue-500/60"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute right-3 p-1 text-zinc-600 hover:text-zinc-300 transition-colors focus:outline-none disabled:opacity-30"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1 pl-0.5 animate-fadeIn">
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                <span>{validationErrors.confirmPassword}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-2.5 text-[10px] sm:text-xs font-mono text-red-400 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500 sm:w-[15px] sm:h-[15px]" />
              <span className="truncate">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || checkingEmail || emailValid !== true || strengthScore < 5}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-3.5 sm:p-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 border border-blue-400/10 shadow-md hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center h-11 sm:h-auto"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin shrink-0" size={12} />
                <span className="truncate">Creating Dashboard Instance...</span>
              </span>
            ) : (
              <span>Register Account</span>
            )}
          </button>
        </form>

        <div className="relative flex py-4 sm:py-5 items-center select-none md:[transform:translateZ(15px)]">
          <div className="flex-grow border-t border-white/[0.04]"></div>
          <span className="flex-shrink mx-3 text-[8px] sm:text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
            OR
          </span>
          <div className="flex-grow border-t border-white/[0.04]"></div>
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-2.5 bg-[#0F0F11] hover:bg-[#151518] border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white p-3.5 sm:p-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed md:[transform:translateZ(15px)] group/google h-11 sm:h-auto"
        >
          {googleLoading ? (
            <Loader2 className="animate-spin shrink-0" size={12} />
          ) : (
            <FcGoogle
              size={14}
              className="shrink-0 group-hover/google:scale-110 transition-transform duration-200"
            />
          )}
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/[0.04] text-[11px] sm:text-xs text-center font-sans text-zinc-500 md:[transform:translateZ(10px)]">
          Already have an instance?{" "}
          <Link
            href="/login"
            className="font-mono font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider pl-0.5 transition-colors duration-150"
          >
            Login Account
          </Link>
        </div>
      </div>
    </main>
  );
}
