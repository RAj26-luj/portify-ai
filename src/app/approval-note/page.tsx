"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MessageSquarePlus,
  Loader2,
  Info,
  Sparkles,
  Mail,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function ApprovalNotePage() {
  const router = useRouter();
  const { status } = useSession();

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const handleSubmit = async () => {
    if (status !== "authenticated" || loading) {
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const res = await fetch("/api/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit node stream.");
      }

      setFeedback({
        type: "success",
        message: "Security parameters transmitted successfully. Routing...",
      });
      setTimeout(() => {
        router.push("/pending-approval");
      }, 1000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "Transmission interrupted. Auto-routing to fallback sequence...",
      });
      setTimeout(() => {
        router.push("/pending-approval");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setFeedback(null);

      await fetch("/api/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: "__SKIPPED__",
        }),
      });

      setFeedback({
        type: "success",
        message: "Skipping optional message. Direct routing active...",
      });
    } catch {}

    setTimeout(() => {
      router.push("/pending-approval");
    }, 8000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-3 xs:px-4 py-6 sm:py-12 mobile-surface antialiased selection:bg-blue-500/20 selection:text-white relative overflow-hidden">
      {/* Background Lighting System Matrices */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/[0.02] rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />

      {/* Control Console Interface Card */}
      <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-xl rounded-xl sm:rounded-2xl border border-white/5 border-t-white/[0.08] bg-[#111111] p-4 xs:p-5 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-300 hover:border-white/10 group">
        {/* Dynamic Header Badge Layout */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner group-hover:border-blue-500/20 transition-colors duration-200 shrink-0">
            <MessageSquarePlus size={16} className="sm:hidden" />
            <MessageSquarePlus size={18} className="hidden sm:block" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm xs:text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 wrap">
              Verification Context Note
              <span className="text-[9px] sm:text-xs font-mono font-medium text-zinc-500 tracking-normal lowercase shrink-0">
                (Optional)
              </span>
            </h1>
          </div>
        </div>

        <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed mb-4 font-sans">
          To accelerate workspace provisioning, consider providing a brief context breakdown to help
          our manual audit team verify your activation request securely.
        </p>

        {/* Informational Guidelines Stack */}
        <div className="space-y-2 mb-4.5 sm:mb-6">
          <div className="rounded-lg bg-white/[0.01] border border-white/5 p-2.5 sm:p-3.5">
            <div className="flex gap-2">
              <Info size={14} className="text-blue-400 mt-0.5 shrink-0 sm:w-[16px] sm:h-[16px]" />
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-medium text-zinc-200">
                  What to include{" "}
                  <span className="text-zinc-500 font-normal italic">(Recommended Fields)</span>
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal">
                  Briefly explain your primary operational objective, engineering projects,
                  institution, or find your public developer link url from Google/GitHub and
                  copy/paste it below to ensure validation correctness.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/[0.01] border border-blue-500/10 p-2.5 sm:p-3.5">
            <div className="flex gap-2">
              <Sparkles
                size={14}
                className="text-blue-400 mt-0.5 shrink-0 sm:w-[16px] sm:h-[16px]"
              />
              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal">
                You are entirely <strong className="text-zinc-300 font-medium">free to skip</strong>{" "}
                this note. The administration queue evaluates skipped forms using standard automated
                processing parameters.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-amber-500/[0.02] border border-amber-500/10 p-2.5 sm:p-3.5">
            <div className="flex gap-2">
              <Mail size={14} className="text-amber-400 mt-0.5 shrink-0 sm:w-[16px] sm:h-[16px]" />
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase font-mono tracking-wide">
                  Crucial Notification Protocol
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal">
                  Following verification decision events, status notifications deploy instantly via
                  mail. Check your <strong className="text-zinc-300 font-medium">Spam</strong>,{" "}
                  <strong className="text-zinc-300 font-medium">Junk</strong>, and{" "}
                  <strong className="text-zinc-300 font-medium">Promotions</strong> filters. If a
                  message lands there, ensure to mark it as{" "}
                  <strong className="text-amber-400 font-medium">"Not Spam"</strong> for subsequent
                  system dispatches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Input Workspace Terminal */}
        <div className="relative">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            maxLength={1000}
            disabled={loading}
            placeholder="Type your verification message details or copy-paste engineering profile links here..."
            className="w-full border border-white/5 bg-[#171717] rounded-lg p-3 text-white placeholder-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.15)] transition-all duration-150 resize-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed font-sans"
          />
          <div className="absolute bottom-2 right-2 text-[8px] sm:text-[10px] font-mono text-zinc-600 select-none bg-[#111111] px-1.5 py-0.5 rounded border border-white/5">
            {note.length}/1000
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-lg border text-left flex items-start gap-2 animate-fade-in ${
              feedback.type === "success"
                ? "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-400"
                : "bg-red-500/[0.02] border-red-500/20 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            )}
            <p className="text-[10px] sm:text-xs font-sans leading-normal">{feedback.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-5 sm:mt-6 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-3 transition-all duration-200 border border-blue-400/10 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_16px_-4px_rgba(59,130,246,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-10"
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin shrink-0" />
                <span>Transmitting...</span>
              </>
            ) : (
              <span>Submit Parameter</span>
            )}
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full sm:flex-1 bg-[#171717] hover:bg-[#1f1f1f] border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-lg p-3 transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-10"
          >
            <span>Skip Request</span>
          </button>
        </div>
      </div>
    </main>
  );
}
