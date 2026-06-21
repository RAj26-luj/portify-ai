"use client";

import React from "react";
import { Terminal, FileText, Download, GitBranch } from "lucide-react";

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
      .map((s: any) => {
        let label = s.title || s.sectionKey.charAt(0).toUpperCase() + s.sectionKey.slice(1);
        if (s.sectionKey === "projects") label = "Repositories";
        if (s.sectionKey === "career") label = "Commit History";
        if (s.sectionKey === "skills") label = "Tech Stack";
        if (s.sectionKey === "contact") label = "Open Channel";
        return {
          label,
          href: `#${s.sectionKey}`,
        };
      });
  }, [sectionSettings]);

  const sectionLinks = [{ label: "Home", href: "#home" }, ...dynamicLinks];

  return (
    <>
      {/* ========================================== */}
      {/* GLOBAL TOP HEADER: BRANDING & UTILITY ACTION */}
      {/* ========================================== */}
      <header className="sticky top-0 left-0 right-0 w-full z-50 border-b border-[#30363D] bg-[#0D1117]/80 backdrop-blur-md text-[#C9D1D9] select-none font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* Logo Identity block */}
          <div className="flex-1 flex justify-start items-center">
            <a href="#home" className="flex items-center gap-2 font-bold tracking-tight text-sm text-white hover:text-[#58A6FF] transition-colors">
              <Terminal className="w-4 h-4 text-[#58A6FF] shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[180px]">
                {name.toLowerCase().replace(/\s+/g, "-")}
              </span>
            </a>
          </div>

          {/* DESKTOP VIEW: CENTRAL MENU BAR */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-0.5 bg-[#161B22] border border-[#30363D] p-1 rounded-md">
              {sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1 rounded text-xs text-neutral-400 hover:text-white hover:bg-[#21262D] transition-colors"
                >
                  {link.label.toLowerCase()}
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#21262D] text-white hover:bg-[#30363D] border border-[#30363D] text-xs font-bold transition-colors shrink-0 relative z-10 cursor-pointer active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-[#58A6FF] shrink-0" />
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3 text-neutral-400" />
                  <span className="hidden sm:inline">download_cv</span>
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
      <div className="block md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
        <nav className="w-full bg-[#161B22]/90 backdrop-blur-md border border-[#30363D] p-1 rounded-lg flex items-center justify-between gap-0.5 overflow-x-auto scrollbar-none px-2 shadow-xl">
          {sectionLinks.map((link) => (
            <a
              key={`mob-${link.href}`}
              href={link.href}
              className="text-[10px] text-neutral-400 hover:text-white active:text-[#58A6FF] px-2 py-1.5 transition-colors shrink-0"
            >
              {link.label.toLowerCase()}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}