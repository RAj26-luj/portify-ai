"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft, Terminal, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/validators/auth/login";
import type { LoginInput } from "@/validators/auth/login";

export default function LoginPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitCredentials: SubmitHandler<LoginInput> = async (data) => {
    if (isSubmitting || isGoogleLoading) return;

    setError(null);

    try {
      setIsSubmitting(true);

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("LOGIN RESPONSE:", res);

      if (res?.error === "CredentialsSignin") {
        setError("Incorrect email or password.");
        return;
      }

      if (res?.error) {
        setError("Login failed.");
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      const role = session?.user?.role;
      const status = session?.user?.status;
      const isBlocked = session?.user?.isBlocked;
      const username = session?.user?.username;

      if (isBlocked) {
        setError("Account blocked");
        return;
      }

      if (status === "PENDING") {
        router.push("/pending-approval");
        return;
      }

      if (status === "REJECTED") {
        setError("Account has been rejected");
        return;
      }

      if (role === "ADMIN") {
        router.push("/admin");
        return;
      }

      if (username) {
        router.push(`/dashboard/${username}`);
        return;
      }

      router.refresh();
    } catch {
      setError("Login failed. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitGoogleAuth = async () => {
    if (isGoogleLoading || isSubmitting) return;

    try {
      setError(null);
      setIsGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/google-success",
      });
    } catch {
      setError("Google authentication process failed.");
    } finally {
      setIsGoogleLoading(false);
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

      <div className="w-full max-w-sm sm:max-w-lg p-5 sm:p-11 bg-gradient-to-b from-[#121214]/90 to-[#0C0C0E]/95 border border-white/5 sm:border-white/10 sm:border-t-white/[0.15] rounded-xl sm:rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] relative z-10 mt-16 mb-6 transition-all duration-500 md:[transform-style:preserve-3d] md:hover:[transform:rotateX(6deg)_rotateY(-4deg)_translateZ(10px)] hover:border-white/10 sm:hover:border-white/20 group/card">
        <div className="flex items-center justify-between mb-5 sm:mb-8 md:[transform:translateZ(30px)] gap-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck size={16} className="sm:hidden" />
            <ShieldCheck size={20} className="hidden sm:block" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-zinc-900/80 border border-white/5 font-mono text-[8px] sm:text-[9px] font-bold tracking-widest text-zinc-500 uppercase truncate">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="truncate">SECURE_AUTH_v2</span>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 md:[transform:translateZ(25px)]">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 mb-1.5">
            Welcome Back
          </h2>
          <p className="text-[11px] sm:text-sm text-zinc-400 font-sans leading-relaxed max-w-sm">
            Sign in to access your dashboard console metrics and handle incoming messaging queues.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmitCredentials)}
          className="space-y-4 sm:space-y-6 md:[transform:translateZ(20px)]"
        >
          <div className="space-y-1.5 group/input">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                Email Address
              </label>
              <Terminal size={11} className="text-zinc-700 hidden sm:block" />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="name@domain.com"
              disabled={isSubmitting || isGoogleLoading}
              className={`w-full p-2.5 sm:p-4 bg-[#0A0A0B] border rounded-lg sm:rounded-xl text-white placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:bg-[#0E0E10] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-sans shadow-inner ${
                errors.email
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/5 focus:border-blue-500/60"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 font-mono text-[10px] mt-1 flex items-center gap-1 pl-0.5 animate-fadeIn">
                <span>// {errors.email.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5 group/input">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                Security Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-500 hover:text-blue-400 uppercase tracking-wider transition-colors duration-200"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative flex items-center">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isSubmitting || isGoogleLoading}
                className={`w-full p-2.5 sm:p-4 pr-10 bg-[#0A0A0B] border rounded-lg sm:rounded-xl text-white placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:bg-[#0E0E10] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-sans shadow-inner ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/5 focus:border-blue-500/60"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || isGoogleLoading}
                className="absolute right-3 p-1 text-zinc-600 hover:text-zinc-300 transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 font-mono text-[10px] mt-1 flex items-center gap-1 pl-0.5 animate-fadeIn">
                <span>// {errors.password.message}</span>
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
            disabled={isSubmitting || isGoogleLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-3.5 sm:p-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 border border-blue-400/10 shadow-md hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-11 sm:h-auto select-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin shrink-0" size={12} />
                <span className="truncate">Authorizing Credentials...</span>
              </span>
            ) : (
              "Authorize Session"
            )}
          </button>
        </form>

        <div className="relative flex py-4 sm:py-6 items-center select-none md:[transform:translateZ(15px)]">
          <div className="flex-grow border-t border-white/[0.04]"></div>
          <span className="flex-shrink mx-3 text-[8px] sm:text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
            Federated Access
          </span>
          <div className="flex-grow border-t border-white/[0.04]"></div>
        </div>

        <button
          onClick={onSubmitGoogleAuth}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full flex items-center justify-center gap-2.5 bg-[#0F0F11] hover:bg-[#151518] border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white p-3.5 sm:p-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed md:[transform:translateZ(15px)] group/google h-11 sm:h-auto"
        >
          {isGoogleLoading ? (
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
          New system developer?{" "}
          <Link
            href="/register"
            className="font-mono font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider pl-0.5 transition-colors duration-150"
          >
            Register Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
