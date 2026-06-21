"use client";

import React from "react";
import { Terminal, Workflow, Binary, ArrowUp, Radio, Activity } from "lucide-react";

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
    <footer className="relative w-full bg-[#050816] text-[#F8FAFC] py-10 md:py-16 border-t border-[#00E5FF]/10 overflow-hidden select-none">
      <style jsx global>{`
        .cyber-footer-grid {
          background-image: linear-gradient(rgba(0, 229, 255, 0.01) 1px, transparent 1px);
          background-size: 100% 2rem;
        }
      `}</style>

      {/* Cyberpunk Environment Grid Layout & Flare */}
      <div className="absolute inset-0 cyber-footer-grid pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 flex flex-col gap-8 md:gap-10">
        
        {/* Top Floating Row: Return to Core Uplink */}
        <div className="flex justify-center border-b border-neutral-900 pb-6 md:pb-8">
          <button
            onClick={scrollToTop}
            className="group relative flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-none bg-[#0B1120] border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 text-[#00E5FF] hover:text-[#00FF9D] transition-all font-mono text-xs font-bold tracking-[0.2em] cursor-pointer active:scale-[0.98] shadow-[0_0_15px_rgba(0,229,255,0.05)]"
            aria-label="Scroll compilation frame to top anchor"
          >
            {/* Tech Corner Trims */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00E5FF]" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#00E5FF]" />
            
            <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 text-[#00E5FF]" />
            <span>RETURN_TO_CORE</span>
          </button>
        </div>

        {/* Bottom Metrics Content Row Layout Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left Side: System Core Tag */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 tracking-[0.15em] order-2 sm:order-1">
            <Terminal className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <span>{name.toUpperCase().replace(/\s+/g, "_")}_SYS // <span className="text-[#00FF9D]">ONLINE</span></span>
          </div>

          {/* Center Side: Copyright Information */}
          <div className="text-center font-mono text-xs text-neutral-400 order-1 sm:order-2 uppercase tracking-wider">
            © {year} [ <span className="text-white font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">{name}</span> ] // ALL_RIGHTS_RESERVED
          </div>

          {/* Right Side: Operational Ledger Parameters */}
          <div className="flex items-center gap-5 text-[10px] font-mono text-neutral-500 order-3 tracking-widest">
            <span className="flex items-center gap-1.5 text-neutral-400 bg-[#0B1120] px-2.5 py-1 border border-neutral-900">
              <Workflow className="w-3.5 h-3.5 text-[#7C3AED]" /> MODEL: CORE_v4.2.6
            </span>
            <span className="flex items-center gap-1.5 text-[#00FF9D] bg-[#00FF9D]/5 px-2.5 py-1 border border-[#00FF9D]/20">
              <Radio className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" /> LINK: SECURE
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}