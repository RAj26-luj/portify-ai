"use client";

import React from "react";
import { Terminal, FileText, Download } from "lucide-react";

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
      {/* ========================================== */}
      {/* GLOBAL TOP HEADER: BRANDING & UTILITY ACTION */}
      {/* ========================================== */}
      <header className="sticky top-0 left-0 right-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-md text-white select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Identity block */}
          <div className="flex-1 flex justify-start items-center">
            <a href="#home" className="flex items-center gap-2 font-bold font-sans tracking-tight text-base sm:text-lg text-white hover:opacity-90 transition-opacity">
              <Terminal className="w-4 h-4 text-purple-500 shrink-0" />
              <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-[200px]">
                {name.toUpperCase()}
              </span>
            </a>
          </div>

          {/* DESKTOP VIEW: CENTRAL MENU BAR */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
              {sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  {link.label.toUpperCase()}
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500 text-white hover:bg-purple-400 text-xs font-medium tracking-wide transition-all duration-200 shadow-md shadow-purple-500/10 shrink-0 relative z-10 cursor-pointer active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CV</span>
                </div>
              </a>
            ) : (
              <div className="w-9 h-1" />
            )}
          </div>

        </div>
      </header>

      {/* ========================================== */}
      {/* MOBILE VIEW: ERGONOMIC HUD BOTTOM MENU DOCK */}
      {/* ========================================== */}
      <div className="block md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
        <nav className="w-full bg-[#050508]/80 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none px-2.5">
          {sectionLinks.map((link) => (
            <a
              key={`mob-${link.href}`}
              href={link.href}
              className="text-[10px] font-mono font-medium text-neutral-500 hover:text-white active:text-purple-400 px-2.5 py-2 transition-all tracking-wider uppercase shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}