import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Clock, ShieldAlert, MailCheck, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PendingApprovalPage() {
  const session = await auth();

  const user = session?.user as {
    role?: string;
    status?: string;
    isBlocked?: boolean;
    username?: string;
    hasApprovalNote?: boolean;
  } | null;

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-8 mobile-surface antialiased selection:bg-blue-500/20 selection:text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:3rem_3rem] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 bg-blue-500/[0.02] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl border border-white/5 border-t-white/[0.08] bg-[#111111] p-5 sm:p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-300 hover:border-white/10 group">
          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 mb-4 shadow-inner group-hover:border-blue-500/20 transition-colors duration-200">
            <Clock size={18} className="animate-pulse sm:hidden" />
            <Clock size={20} className="animate-pulse hidden sm:block" />
          </div>

          <h1 className="mb-2.5 text-base xs:text-lg sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
            Authentication Required
          </h1>

          <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto font-sans px-0.5">
            Please log in or verify your identity setup to configure or request authorization on your active workspace engine.
          </p>

          <div className="mt-5 sm:mt-8 pt-3.5 sm:pt-4 border-t border-white/5 text-[9px] sm:text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
            <span className="truncate">Session Context Offline</span>
          </div>
        </div>
      </main>
    );
  }

  if (user.isBlocked) {
    redirect("/unauthorized");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.status === "APPROVED") {
    if (user.username) {
      redirect(`/dashboard/${user.username}`);
    }
    redirect("/dashboard");
  }

  if (user.status === "REJECTED") {
    redirect("/unauthorized");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-3 xs:px-4 py-8 mobile-surface antialiased selection:bg-blue-500/20 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 bg-blue-500/[0.02] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl border border-white/5 border-t-white/[0.08] bg-[#111111] p-4 xs:p-5 sm:p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-300 hover:border-white/10 group">
        <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 mb-3.5 sm:mb-5 shadow-inner group-hover:border-blue-500/20 transition-colors duration-200">
          <Clock size={18} className="animate-pulse sm:hidden" />
          <Clock size={20} className="animate-pulse hidden sm:block" />
        </div>

        <h1 className="mb-2 text-base xs:text-lg sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
          Reviewing Your Application
        </h1>

        <div className="space-y-3 text-left my-4 sm:my-6">
          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 sm:p-4 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <ShieldAlert size={15} className="text-zinc-400 mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-normal font-sans">
                To maintain standard operational integrity, ensure total data privacy, and manage premium sandbox system clusters responsibly under infrastructure constraints, we process integrations through structured security workflows.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/[0.02] border border-blue-500/10 p-3 sm:p-4 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <MailCheck size={15} className="text-blue-400 mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
              <div className="space-y-1">
                <p className="text-[11px] sm:text-xs font-medium text-zinc-200 font-sans">
                  System Automated Notifications
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal font-sans">
                  An automated email transmission containing the definitive confirmation routing parameters or update response status details will deploy immediately following administrative review verification loops.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-500/[0.02] border border-amber-500/10 p-3 sm:p-4 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
              <div className="space-y-0.5">
                <p className="text-[11px] sm:text-xs font-semibold text-amber-400 tracking-wide uppercase font-mono">
                  Attention Required: Check Folders
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal font-sans">
                  Due to external mail routing and transport layer filtering configurations, please actively monitor your <strong className="text-zinc-200 font-medium">Spam</strong>, <strong className="text-zinc-200 font-medium">Junk</strong>, and <strong className="text-zinc-200 font-medium">Promotions</strong> directories for verification receipts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 pt-3.5 sm:pt-4 border-t border-white/5 text-[9px] sm:text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <span className="truncate">Awaiting Operational Authorization</span>
        </div>
      </div>
    </main>
  );
}