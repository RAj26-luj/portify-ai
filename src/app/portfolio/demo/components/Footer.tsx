"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Terminal, Shield, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#030306] py-12 overflow-hidden [perspective:1000px]">
      {/* Background Matrix Scanning Lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293705_1px,transparent_1px)] bg-[size:3rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-3 items-center gap-8 [transform-style:preserve-3d]">
        
        {/* LEFT COMPONENT: Workspace Identity */}
        <div className="flex flex-col items-center md:items-start space-y-2 [transform:translateZ(15px)]">
          <div className="group cursor-pointer">
            <h3 className="font-mono text-2xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
              BIANCA<span className="text-emerald-500 animate-pulse">.</span>
            </h3>
            <span className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase block mt-0.5 group-hover:text-zinc-400 transition-colors">
              SYS_END_WORKSPACE // 2026
            </span>
          </div>
        </div>

        {/* CENTER COMPONENT: 3D Holographic Link Vault */}
        <div className="flex justify-center gap-4 [transform:translateZ(35px)]">
          
          {/* GitHub Node */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-[#08080d] border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:border-white/20 [transform-style:preserve-3d] hover:[transform:rotateY(-10deg)_translateZ(10px)]"
          >
            <FaGithub size={20} className="relative z-10" />
            <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* LinkedIn Node */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-[#08080d] border border-white/10 rounded-xl text-zinc-400 hover:text-sky-400 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:border-sky-500/20 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_translateZ(10px)]"
          >
            <FaLinkedin size={20} className="relative z-10" />
            <div className="absolute inset-0 rounded-xl bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Return To Top Node */}
          <button
            onClick={scrollToTop}
            className="group relative p-3 bg-[#08080d] border border-white/10 rounded-xl text-zinc-500 hover:text-emerald-400 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:border-emerald-500/20 [transform-style:preserve-3d] hover:[transform:rotateX(15deg)_translateZ(10px)] cursor-pointer"
          >
            <ArrowUp size={20} className="relative z-10 transform group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* RIGHT COMPONENT: Cryptographic Timestamp */}
        <div className="flex flex-col items-center md:items-end font-mono text-xs text-zinc-500 space-y-1.5 [transform:translateZ(15px)]">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 bg-white/[0.01] border border-white/5 px-2.5 py-1 rounded-md">
            <Shield size={10} className="text-emerald-500/60" />
            <span>SESSION_SECURE</span>
          </div>
          <div className="text-[11px] tracking-tight text-zinc-400">
            © 2026 <span className="text-zinc-200 font-bold">Bianca Silva</span>
          </div>
        </div>

      </div>

      {/* Decorative Outer Terminal Baseline */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-4 border-t border-white/[0.02] flex items-center justify-between text-[9px] font-mono text-zinc-700">
        <div className="flex items-center gap-1.5">
          <Terminal size={10} />
          <span>LOGOUT_SUCCESSFUL // DISCONNECTED</span>
        </div>
        <span>CORE_V1.0.4</span>
      </div>
    </footer>
  );
}