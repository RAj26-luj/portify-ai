"use client";

import React from "react";
import { Terminal, FileText, Download, Radio, Cpu } from "lucide-react";

interface NavbarProps {
  portfolio: {
    title?: string;
    username: string;
    resume?: {
      fileUrl?: string;
    };
    user?: {
      name?: string;
    };
  };
  sectionSettings?: any[];
  socialLinks?: any;
}

export default function Navbar({ portfolio, sectionSettings = [] }: NavbarProps) {
  const name = portfolio?.title || portfolio?.user?.name || "Portfolio";

  const allowedSections = ["about", "career", "skills", "projects", "contact"];

  const dynamicLinks = React.useMemo(() => {
    if (!sectionSettings || sectionSettings.length === 0) return [];

    return sectionSettings
      .filter((s: any) => s.isEnabled && allowedSections.includes(s.sectionKey))
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((s: any) => ({
        label: s.title || s.sectionKey.charAt(0).toUpperCase() + s.sectionKey.slice(1),
        href: `#${s.sectionKey}`,
      }));
  }, [sectionSettings]);

  const sectionLinks = [{ label: "Home", href: "#home" }, ...dynamicLinks];

  return (
    <>
      <style jsx global>{`
        @keyframes line-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .cyber-nav-glow {
          animation: line-glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* ========================================== */}
      {/* GLOBAL TOP HEADER: BRANDING & UTILITY ACTION */}
      {/* ========================================== */}
      <header className="sticky top-0 left-0 right-0 w-full z-50 border-b border-[#00E5FF]/20 bg-[#050816]/70 backdrop-blur-xl text-[#F8FAFC] select-none cyber-nav-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Identity block */}
          <div className="flex-1 flex justify-start items-center">
            <a href="#home" className="group flex items-center gap-2.5 font-mono font-black tracking-wider text-base text-white">
              <Terminal className="w-4 h-4 text-[#00E5FF] group-hover:rotate-6 transition-transform" />
              <span className="text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.4)] truncate max-w-[150px] sm:max-w-[200px]">
                // {name.toUpperCase().replace(/\s+/g, "_")}
              </span>
            </a>
          </div>

          {/* DESKTOP VIEW: CENTRAL HUD INTERFACE TABS */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-1.5 bg-[#0B1120] border border-neutral-800 p-1.5 rounded-none shadow-[inset_0_1px_2px_rgba(0,229,255,0.05)]">
              {sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-none text-[11px] font-mono font-bold tracking-widest text-neutral-400 hover:text-[#00E5FF] hover:bg-[#050816] border border-transparent hover:border-[#00E5FF]/20 transition-all duration-200 uppercase"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Action Trigger Node */}
          <div className="flex-1 flex justify-end items-center">
            {portfolio?.resume?.fileUrl ? (
              <a
                href={`/api/resume/download?username=${portfolio.username}`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)] shrink-0 relative z-10 cursor-pointer active:scale-[0.97]"
              >
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#00E5FF] group-hover:border-transparent" />
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  <span className="hidden sm:inline">EXTRACT_CV</span>
                </div>
              </a>
            ) : (
              <div className="w-9 h-1" />
            )}
          </div>

        </div>
      </header>

      {/* ========================================== */}
      {/* MOBILE VIEW: ERGONOMIC HUD BOTTOM DOCK STATION */}
      {/* ========================================== */}
      <div className="block md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
        <nav className="w-full bg-[#0B1120]/95 backdrop-blur-2xl border-2 border-neutral-800 p-2 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none px-3 relative">
          {/* Neon layout trim anchors */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00E5FF]" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#7C3AED]" />
          
          {sectionLinks.map((link) => (
            <a
              key={`mob-${link.href}`}
              href={link.href}
              className="text-[10px] font-mono font-black text-neutral-400 hover:text-[#00E5FF] active:text-[#00FF9D] px-3 py-2.5 transition-all tracking-widest uppercase shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}