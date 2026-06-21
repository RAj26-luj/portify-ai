"use client";

import { Binary } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  systemCode?: string; // Optional sci-fi technical code string (e.g., "SYS_MOD_01")
}

export default function SectionHeader({
  title,
  subtitle,
  systemCode = "SYS_NODE_PRT",
}: SectionHeaderProps) {
  return (
    <div 
      className="group relative mb-16 space-y-3 select-none [perspective:1000px] max-w-fit"
      id={`header-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Structural Geometry Corner Brackets */}
      <span className="absolute -top-2 -left-2 w-2 h-2 border-t-2 border-l-2 border-emerald-500/20 group-hover:border-emerald-400 transition-colors duration-500" />
      <span className="absolute -bottom-2 -left-2 w-2 h-2 border-b-2 border-l-2 border-white/5 group-hover:border-white/20 transition-colors duration-500" />

      {/* Subtitle / Telemetry Tracker Row */}
      <div className="flex items-center gap-2.5 [transform-style:preserve-3d] [transform:translateZ(15px)]">
        {/* Pulsing Active Beacon */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
          {subtitle}
        </p>
        
        <span className="text-zinc-700 font-mono text-[9px]">//</span>
        
        <span className="font-mono text-[9px] text-zinc-600 tracking-wider bg-white/[0.02] border border-white/5 px-1.5 py-0.5 rounded uppercase">
          {systemCode}
        </span>
      </div>

      {/* Main Layered Gradient Title */}
      <div className="relative [transform-style:preserve-3d] [transform:translateZ(30px)]">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {title}
        </h2>
      </div>

      {/* Tech Interface Baseline Accent */}
      <div className="relative w-24 h-px bg-gradient-to-r from-emerald-500/50 via-white/10 to-transparent mt-4 overflow-hidden [transform:translateZ(10px)]">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-marquee absolute inset-0 opacity-40" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
}