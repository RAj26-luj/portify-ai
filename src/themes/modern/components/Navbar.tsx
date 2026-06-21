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
      {/* GLOBAL TOP HEADER: MODERN PREMIUM SAAS BAR */}
      {/* ========================================== */}
      <header className="sticky top-0 left-0 right-0 w-full z-50 border-b border-[#18181B] bg-[#0A0A0B]/70 backdrop-blur-xl text-white select-none shadow-[0_1px_0_0_rgba(255,255,255,0.01)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Identity block */}
          <div className="flex-1 flex justify-start items-center">
            <a href="#home" className="flex items-center gap-2.5 font-bold font-sans tracking-tight text-base sm:text-lg text-white hover:opacity-90 transition-all group">
              <div className="p-1.5 bg-[#6366F1]/10 rounded-lg border border-[#6366F1]/20 group-hover:border-[#6366F1]/40 transition-colors">
                <Terminal className="w-4 h-4 text-[#6366F1] shrink-0" />
              </div>
              <span className="bg-gradient-to-r from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans font-extrabold text-sm tracking-wider uppercase max-w-[150px] sm:max-w-[200px]">
                {name}
              </span>
            </a>
          </div>

          {/* DESKTOP VIEW: SAAS STYLED FLOATING CENTRAL LINK BAR */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-1.5 bg-[#111113]/60 border border-[#18181B] p-1 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              {sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium text-[#71717A] hover:text-white transition-all duration-200"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 text-xs font-semibold tracking-wide transition-all duration-200 shadow-[0_4px_12px_rgba(99,102,241,0.2)] shrink-0 relative z-10 cursor-pointer active:scale-95 border border-white/10"
              >
                <FileText className="w-3.5 h-3.5 shrink-0 text-white/80" />
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download CV</span>
                  <span className="inline sm:hidden">CV</span>
                </div>
              </a>
            ) : (
              <div className="w-9 h-1" />
            )}
          </div>

        </div>
      </header>

      {/* ========================================== */}
      {/* MOBILE VIEW: GLASSMORPHIC PREMIUM FLOATING NAV DOCK */}
      {/* ========================================== */}
      <div className="block md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-50">
        <nav className="w-full bg-[#111113]/80 backdrop-blur-xl border border-[#18181B] p-2 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none px-3">
          {sectionLinks.map((link) => (
            <a
              key={`mob-${link.href}`}
              href={link.href}
              className="text-[11px] font-sans font-semibold text-[#71717A] hover:text-white active:text-[#6366F1] px-3 py-2 transition-all tracking-wide shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}