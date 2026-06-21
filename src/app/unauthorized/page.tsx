import Link from "next/link";
import { ShieldAlert, MailX, AlertCircle, HelpCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-3 xs:px-4 py-8 antialiased selection:bg-red-500/20 selection:text-white relative overflow-hidden">
      {/* Absolute Ambient Background Glow Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 bg-red-500/[0.02] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

      {/* Security Shield Control Card */}
      <div className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl border border-white/5 border-t-white/[0.08] bg-[#111111] p-4 xs:p-5 sm:p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-300 hover:border-white/10 group">
        
        {/* Animated Icon Header Node */}
        <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400 mb-3.5 sm:mb-5 shadow-inner transition-colors duration-200 group-hover:border-red-500/20">
          <ShieldAlert size={18} className="animate-pulse sm:hidden" />
          <ShieldAlert size={20} className="animate-pulse hidden sm:block" />
        </div>

        {/* Premium Title Block */}
        <h1 className="mb-2 text-base xs:text-lg sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
          Access Restrictions Enforced
        </h1>

        <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto font-sans px-0.5 mb-4">
          Your account status profile indicates an active administrative restriction, request rejection, or structural access blockade on this workspace platform cluster.
        </p>

        {/* Informational Context Nodes */}
        <div className="space-y-2.5 text-left my-4 sm:my-6">
          <div className="rounded-lg bg-red-500/[0.01] border border-red-500/10 p-3 sm:p-4 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <MailX size={14} className="text-red-400 mt-0.5 shrink-0 sm:w-[16px] sm:h-[16px]" />
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-200 uppercase tracking-wide font-mono">
                  Crucial: Check Mail Folders
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal font-sans">
                  A comprehensive structural rejection or account status lock notification breakdown dispatch has been processed. Due to systemic routing filters, this message might reside inside your <strong className="text-zinc-200 font-medium">Spam</strong>, <strong className="text-zinc-200 font-medium">Junk</strong>, or <strong className="text-zinc-200 font-medium">Promotions</strong> directories.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-500/[0.01] border border-amber-500/10 p-3 sm:p-4 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0 sm:w-[16px] sm:h-[16px]" />
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wide font-mono">
                  Mark as Not Spam
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal font-sans">
                  To secure crucial delivery pipelines and allow direct appeals to reach your inbox safely, open the status email inside your mail engine and explicitly tap <strong className="text-amber-400 font-medium">"Report Not Spam"</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 sm:p-4 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <HelpCircle size={14} className="text-zinc-400 mt-0.5 shrink-0 sm:w-[16px] sm:h-[16px]" />
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-300 font-sans">
                  System Administration Appeal
                </p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-normal font-sans">
                  If you firmly believe this security status flags an erroneous baseline calculation or data mistake, please reply directly to the system support mail coordinate referenced in our status dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Panel Container */}
        <div className="mt-5 sm:mt-8 space-y-2.5 font-mono text-[11px] xs:text-xs font-bold uppercase tracking-wider">
          <Link
            href="/dashboard"
            className="block w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-3 sm:py-3.5 transition-all duration-200 border border-blue-400/10 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_16px_-4px_rgba(59,130,246,0.3)] active:scale-[0.98] sm:hover:-translate-y-0.5 text-center truncate"
          >
            Go To Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full rounded-lg bg-[#171717] hover:bg-[#1f1f1f] border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white px-3 sm:px-4 py-3 sm:py-3.5 transition-all duration-200 shadow-sm active:scale-[0.98] text-center truncate"
          >
            Return Home Base
          </Link>
        </div>
      </div>
    </main>
  );
}