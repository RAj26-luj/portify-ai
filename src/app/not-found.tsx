"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white px-4 py-8 text-center antialiased selection:bg-blue-500/20 selection:text-white relative overflow-hidden select-none">
      {/* Background Grid Accent Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-zinc-500/[0.02] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      {/* Main Display Matrix Container */}
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl border border-zinc-900 bg-[#0C0C0E] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] relative z-10 transition-all duration-300 hover:border-zinc-800 group">
        
        {/* Giant Status Code Indicator */}
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 mb-2 sm:mb-4 group-hover:scale-[1.01] transition-transform duration-300 font-mono">
          404
        </h1>

        {/* Header Designation Title */}
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-100 mb-2">
          Route Parameters Not Found
        </h2>

        {/* Subtitle Descriptive Log Vector */}
        <p className="text-[11px] sm:text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto font-sans mb-8 px-1">
          The requested path index does not point to an active client workspace record node or has been permanently pruned from the catalog registry.
        </p>

        {/* Go Home Navigation Control Desk */}
        <Link
          href="/"
          className="w-full inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98] focus:outline-none"
        >
          Return to Hub Console
        </Link>

        {/* Developer Spec Diagnostic Label */}
        <div className="mt-6 pt-4 border-t border-zinc-900 text-[9px] font-mono font-medium text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
          <span>ERR_ROUTE_INDEX_NULL</span>
        </div>
      </div>
    </div>
  );
}