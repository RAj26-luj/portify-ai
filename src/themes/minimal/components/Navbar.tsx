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
      {/* GLOBAL TOP HEADER: SWISS EDITORIAL NAVIGATION BAR */}
      {/* ========================================== */}
      <header className="sticky top-0 left-0 right-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md text-[#111827] select-none">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Identity block */}
          <div className="flex-1 flex justify-start items-center">
            <a href="#home" className="flex items-center gap-2 font-black font-sans tracking-tight text-base sm:text-lg text-[#111827] transition-opacity hover:opacity-70">
              <Terminal className="w-4 h-4 text-gray-900 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-[200px] uppercase">
                {name}
              </span>
            </a>
          </div>

          {/* DESKTOP VIEW: CENTRAL TEXT-BASED MENU */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-6">
              {sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-1 text-xs font-mono font-bold text-gray-400 hover:text-[#111827] transition-colors relative uppercase tracking-wider"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111827] text-white hover:bg-black text-xs font-bold font-sans tracking-widest uppercase transition-colors shrink-0 relative z-10 cursor-pointer rounded-none shadow-none"
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
      {/* MOBILE VIEW: IMMACULATE MINIMAL BOTTOM MENU DOCK */}
      {/* ========================================== */}
      <div className="block md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
        <nav className="w-full bg-white/95 backdrop-blur-md border border-gray-200 p-2 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none px-4 shadow-xl">
          {sectionLinks.map((link) => (
            <a
              key={`mob-${link.href}`}
              href={link.href}
              className="text-[10px] font-mono font-bold text-gray-400 hover:text-[#111827] active:text-[#111827] py-2 transition-colors tracking-widest uppercase shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}