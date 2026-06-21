"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white px-4 py-8 text-center antialiased selection:bg-red-500/20 selection:text-white relative overflow-hidden select-none">
      {/* Background Matrix Infrastructure Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-red-500/[0.01] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      {/* Core Diagnostics UI Panel */}
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl border border-red-500/10 bg-[#0C0C0E] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] relative z-10 transition-all duration-300 hover:border-red-500/20 group">
        
        {/* Warning Indicator Shield Badge */}
        <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400 mb-4 sm:mb-5 shadow-inner group-hover:border-red-500/20 transition-colors duration-200">
          <AlertTriangle size={18} className="sm:hidden" />
          <AlertTriangle size={20} className="hidden sm:block" />
        </div>

        {/* Master Exception Status Header */}
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-100 mb-2">
          Runtime Exception Triggered
        </h1>

        {/* Sanitized UX Description Copy */}
        <p className="text-[11px] sm:text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto font-sans mb-8 px-1">
          An unexpected application stream error occurred while processing page component layouts. Core framework operations have been halted safely.
        </p>

        {/* Multi-Click Guard Re-execution Trigger Action Button */}
        <button
          onClick={() => reset()}
          className="w-full inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98] focus:outline-none"
        >
          <RefreshCw size={13} className="text-zinc-700 shrink-0" />
          <span>Re-initialize Core Cycle</span>
        </button>

        {/* Administrative Protocol Meta Data Node Tag */}
        <div className="mt-6 pt-4 border-t border-zinc-900 text-[9px] font-mono font-medium text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 shrink-0 animate-pulse" />
          <span>SYS_APPLICATION_CRASH_CATCH</span>
        </div>
      </div>
    </div>
  );
}