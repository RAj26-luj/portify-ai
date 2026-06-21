"use client";

import { useState } from "react";
import NextLink from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Menu, X, Sparkles, Terminal } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Open Source", href: "#opensource" },
    { label: "Experience", href: "#timeline" },
    { label: "Profiles", href: "#coding-profiles" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* =========================================================================
          1. PREMIUM COMPRESSION DEMO ANNOUNCEMENT BANNER
          ========================================================================= */}
      <div className="fixed top-0 left-0 w-full z-50 h-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center px-4 shadow-lg shadow-emerald-950/20 font-mono text-[11px] md:text-xs">
        <div className="max-w-7xl w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-black font-bold uppercase tracking-wider">
            <Sparkles size={12} className="animate-pulse" />
            <span>Demo Portfolio Generated with Portify AI</span>
          </div>

          <NextLink
            href="/register"
            className="bg-black/80 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200"
          >
            Claim This Node
          </NextLink>
        </div>
      </div>

      {/* =========================================================================
          2. CORE INTERACTIVE NAVIGATION HEADER (OFFSET TO ACCOUNT FOR BANNER)
          ========================================================================= */}
      <header className="fixed top-10 left-0 w-full z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mt-4 h-16 rounded-full border border-white/10 bg-[#07070a]/75 backdrop-blur-md flex items-center justify-between px-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-white/15 transition-colors">
            
            {/* Logo Signature */}
            <a
              href="#"
              className="text-md font-black tracking-widest text-white hover:opacity-80 transition-opacity font-mono"
            >
              BIANCA<span className="text-emerald-400 animate-pulse">.</span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-mono text-[11px] tracking-wide font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Context Hub Tools */}
            <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-4">
              <a
                href="https://github.com/biancasilva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="GitHub Target Node"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="https://linkedin.com/in/biancasilva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-sky-400 transition-colors p-1"
                aria-label="LinkedIn Target Node"
              >
                <FaLinkedin size={18} />
              </a>
            </div>

            {/* Mobile Sidebar Flyout Switch Actuator */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white transition-colors p-2"
              aria-label="Deploy Operations Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. DRAWER OVERLAY MATRIX MODULE (MOBILE LINK INTERACTIVE SCREEN)
          ========================================================================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-lg z-[60] flex flex-col items-center justify-center animate-in fade-in duration-200">
          
          <div className="absolute top-4 left-6 font-mono text-[10px] text-zinc-600 tracking-wider uppercase select-none flex items-center gap-2">
            <Terminal size={12} className="text-emerald-500 animate-pulse" />
            <span>SYS_NAV_MENU_HUB</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-6 text-zinc-500 hover:text-white border border-white/5 bg-white/5 p-2 rounded-xl transition-colors"
            aria-label="Terminate Subsystem Menu"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-6 text-center">
            <nav className="flex flex-col gap-4 font-mono">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold tracking-widest text-zinc-400 hover:text-emerald-400 uppercase transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-6 pt-6 border-t border-white/5 w-40 justify-center mt-4">
              <a
                href="https://github.com/biancasilva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="Mobile GitHub Link"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://linkedin.com/in/biancasilva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-sky-400 transition-colors"
                aria-label="Mobile LinkedIn Link"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}