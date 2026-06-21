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
    <footer className="relative w-full bg-white text-[#111827] py-10 md:py-16 mt-16 md:mt-24 border-t border-gray-100 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10 flex flex-col gap-8">
        
        {/* Top Floating Row: Jump Action Portal */}
        <div className="flex justify-start border-b border-gray-100 pb-6">
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-3 py-2 bg-[#FAFAFA] border border-gray-200 text-gray-500 hover:text-[#111827] hover:border-gray-900 transition-colors font-mono text-[11px] font-bold tracking-widest uppercase rounded-none cursor-pointer"
            aria-label="Scroll compilation frame to top anchor"
          >
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span>Return to Top</span>
          </button>
        </div>

        {/* Bottom Metrics Content Row Layout Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          {/* Left Side: System Core Tag */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400 tracking-wider order-2 sm:order-1 font-bold">
            <Terminal className="w-3.5 h-3.5 text-gray-400" />
            <span>{name.toUpperCase()}_SYS // INDEXED</span>
          </div>

          {/* Center Side: Copyright Information */}
          <div className="text-left sm:text-center font-sans text-xs text-gray-500 font-normal order-1 sm:order-2">
            © {year} <span className="text-[#111827] font-bold uppercase tracking-tight">{name}</span>. Made by {name}.
          </div>

          {/* Right Side: Operational Ledger Parameters */}
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-gray-400 order-3">
            <span className="flex items-center gap-1">
              <Workflow className="w-3.5 h-3.5" /> V2.6
            </span>
            <span className="flex items-center gap-1">
              <Binary className="w-3.5 h-3.5" /> SEC // OK
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}