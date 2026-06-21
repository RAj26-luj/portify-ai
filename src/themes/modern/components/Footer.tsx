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
    <footer className="relative w-full bg-[#0A0A0B] text-white py-10 md:py-14 mt-16 md:mt-28 border-t border-[#18181B] overflow-hidden select-none">
      {/* Premium Ambient Lighting Overlays */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-[#6366F1]/5 via-[#8B5CF6]/2 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10 flex flex-col gap-8">
        
        {/* Top Floating Row: Jump Action Portal */}
        <div className="flex justify-center border-b border-[#18181B] pb-6 md:pb-8">
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl border border-[#18181B] bg-[#111113]/80 text-[#71717A] hover:text-white hover:border-[#6366F1]/40 hover:bg-[#111113] transition-all duration-300 font-sans text-xs font-bold tracking-wide relative cursor-pointer active:scale-[0.99] shadow-sm shadow-black"
            aria-label="Scroll compilation frame to top anchor"
          >
            <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 text-[#6366F1]" />
            <span>Return to Core</span>
          </button>
        </div>

        {/* Bottom Metrics Content Row Layout Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left Side: System Core Tag */}
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-semibold text-[#71717A] tracking-wider order-2 sm:order-1">
            <Terminal className="w-4 h-4 text-[#6366F1]" />
            <span>{name.toUpperCase()}_SYS // ACTIVE</span>
          </div>

          {/* Center Side: Copyright Information */}
          <div className="text-center font-sans text-sm text-[#71717A] font-medium order-1 sm:order-2">
            © {year} <span className="text-white font-bold">{name}</span>. All rights reserved.
          </div>

          {/* Right Side: Operational Ledger Parameters */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#71717A] font-semibold order-3">
            <span className="flex items-center gap-1.5 bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#18181B]">
              <Workflow className="w-3.5 h-3.5 text-[#8B5CF6]" /> {name.toUpperCase()}_V2.6
            </span>
            <span className="flex items-center gap-1.5 bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#18181B]">
              <Binary className="w-3.5 h-3.5 text-[#06B6D4]" /> SEC // OK
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}