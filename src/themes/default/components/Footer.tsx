"use client";

import React from "react";
import { Terminal, Workflow, Binary, ArrowUp } from "lucide-react";

interface FooterProps {
  portfolio: {
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function Footer({ portfolio }: FooterProps) {
  const name = portfolio?.title || portfolio?.user?.name || "Portfolio";
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full bg-black text-white py-8 md:py-12 mt-12 md:mt-20 border-t border-white/5 overflow-hidden select-none">
      {/* Structural Backdrop Subtle Flare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 flex flex-col gap-6 md:gap-8">
        
        {/* Top Floating Row: Jump Action Portal */}
        <div className="flex justify-center border-b border-white/[0.02] pb-5 md:pb-6">
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/5 bg-neutral-900/40 text-neutral-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300 font-mono text-[10px] sm:text-xs tracking-widest relative cursor-pointer active:scale-[0.99]"
            aria-label="Scroll compilation frame to top anchor"
          >
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span>RETURN_TO_CORE</span>
            <div className="absolute inset-0 rounded-xl border border-purple-500/0 group-hover:border-purple-500/20 blur-[2px] transition-all pointer-events-none" />
          </button>
        </div>

        {/* Bottom Metrics Content Row Layout Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
          
          {/* Left Side: System Core Tag */}
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-neutral-500 tracking-wider order-2 sm:order-1">
            <Terminal className="w-3.5 h-3.5 text-purple-500/60 animate-pulse" />
            <span>{name.toUpperCase()}_SYS // ACTIVE</span>
          </div>

          {/* Center Side: Copyright Information */}
          <div className="text-center font-sans text-xs text-neutral-400 font-light order-1 sm:order-2">
            © {year} <span className="text-neutral-200 font-medium">{name}</span>. All rights reserved.
          </div>

          {/* Right Side: Operational Ledger Parameters */}
          <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-600 order-3">
            <span className="flex items-center gap-1 opacity-60">
              <Workflow className="w-3 h-3" /> {name.toUpperCase()}_V2.6
            </span>
            <span className="flex items-center gap-1 opacity-60">
              <Binary className="w-3 h-3" /> SEC // OK
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}