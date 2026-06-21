"use client";

import React from "react";
import { Terminal, ArrowUp, Cpu, GitBranch } from "lucide-react";

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
    <footer className="relative w-full bg-[#0D1117] text-[#C9D1D9] py-8 border-t border-[#30363D] overflow-hidden select-none font-mono">
      {/* Matrix Mesh Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d08_1px,transparent_1px),linear-gradient(to_bottom,#30363d08_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-6">
        
        {/* Top Floating Row: Jump Action Portal */}
        <div className="flex justify-center border-b border-[#30363D]/40 pb-5">
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center gap-1.5 w-full sm:w-auto px-3 py-1.5 rounded bg-[#161B22] border border-[#30363D] text-neutral-400 hover:text-white hover:border-[#58A6FF] transition-colors text-xs cursor-pointer active:scale-[0.99]"
            aria-label="Scroll compilation frame to top anchor"
          >
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 text-[#58A6FF]" />
            <span>cd ~ && clear</span>
          </button>
        </div>

        {/* Bottom Metrics Content Row Layout Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left Side: System Core Tag */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 order-2 sm:order-1">
            <Terminal className="w-3.5 h-3.5 text-[#7EE787] animate-pulse" />
            <span>{name.toLowerCase().replace(/\s+/g, "-")}@production:~$</span>
          </div>

          {/* Center Side: Copyright Information */}
          <div className="text-center text-xs text-neutral-400 order-1 sm:order-2">
            © {year} <span className="text-[#C9D1D9] font-bold">{name}</span>. lts_release
          </div>

          {/* Right Side: Operational Ledger Parameters */}
          <div className="flex items-center gap-4 text-[10px] text-neutral-500 order-3">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-[#F78166]" /> main
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#58A6FF]" /> v2.6 // secure
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}