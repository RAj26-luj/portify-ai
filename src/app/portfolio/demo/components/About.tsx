"use client";

import { Cpu, Terminal, Disc, Sparkles, Briefcase, MapPin, Radio } from "lucide-react";

export default function About() {
  return (
    <section className="relative py-24 bg-[#030306] overflow-x-hidden" id="about">
      {/* Background 3D Perspective Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Module Header Core with LinkedIn Style Professional Headline */}
        <div className="mb-16 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest select-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Core Architecture
          </div>
          
          <div className="space-y-3">
            <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              Diagnostic Bio
            </h2>
            
            {/* LinkedIn Professional Tagline Headline */}
            <p className="text-base md:text-lg font-mono text-zinc-300 leading-relaxed border-l-2 border-cyan-500/30 pl-4 py-1">
              Frontend Architect specializing in <span className="text-cyan-400 font-bold">high-throughput reactive subsystems</span>, sub-millisecond layout orchestration trees, and engineering <span className="text-purple-400 font-bold">enterprise-grade user interfaces</span>.
            </p>
          </div>
        </div>

        {/* 3D Perspective Grid Engine Wrapper */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT CHASSIS: Terminal Package (Stable Anchor Container) */}
          <div 
            className="group [perspective:1200px] lg:col-span-7 w-full [--rx:6deg] [--ry:8deg] [--tz:0px] hover:[--rx:0deg] hover:[--ry:0deg] hover:[--tz:20px] transition-all duration-300"
          >
            {/* Inner Moving Card Board */}
            <div 
              className="relative h-full bg-[#09090f]/90 border border-white/10 rounded-2xl transition-all duration-500 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] shadow-[15px_20px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_60px_rgba(6,182,212,0.12)] hover:border-cyan-500/20"
              style={{
                transform: "rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz))"
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Terminal Frame Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/5 [transform:translateZ(15px)] pointer-events-none select-none">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 group-hover:bg-red-500 transition-colors" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 group-hover:bg-yellow-500 transition-colors" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 group-hover:bg-green-500 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 ml-2 text-zinc-500 group-hover:text-cyan-400 transition-colors">
                    <Terminal size={12} />
                    <span className="font-mono text-xs tracking-tight">
                      guest@bianca_workspace:~
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded">SH-3X</span>
              </div>

              {/* Terminal Compilation Content Text - Elevated Z-Depth */}
              <div className="p-8 text-zinc-300 font-mono text-sm leading-relaxed space-y-4 [transform:translateZ(40px)] pointer-events-none">
                <div className="text-zinc-600 text-xs">&gt; initialize developer_profile.pkg</div>
                
                <p className="text-zinc-200 font-sans text-base">
                  I combine advanced <span className="text-cyan-400 font-bold font-mono">visual design mechanics</span> with strict, deterministic browser rendering rules. My engineering process prioritizes minimizing layout calculation runtimes to secure steady execution pipelines.
                </p>
                
                <p className="text-zinc-400 font-sans text-xs leading-relaxed border-t border-white/5 pt-4">
                  By building lightweight virtualization matrices and balancing data load streams outside the main render frame, I bridge the gap between pixel-perfect aesthetics and performance metrics.
                </p>
                
                <div className="pt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span>CORE_STATUS: OPTIMAL // READY_FOR_CONTRACT</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CHASSIS: System Telemetry (Stable Anchor Container) */}
          <div 
            className="group [perspective:1200px] lg:col-span-5 w-full [--rx:6deg] [--ry:-8deg] [--tz:0px] hover:[--rx:0deg] hover:[--ry:0deg] hover:[--tz:20px] transition-all duration-300"
          >
            {/* Inner Moving Card Board */}
            <div 
              className="relative h-full bg-[#09090f]/90 border border-white/10 rounded-2xl transition-all duration-500 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] shadow-[-15px_20px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_60px_rgba(168,85,247,0.12)] hover:border-purple-500/20"
              style={{
                transform: "rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz))"
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Status Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between [transform:translateZ(15px)] pointer-events-none select-none">
                <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 group-hover:text-purple-400 transition-colors">
                  <Cpu size={14} className="text-zinc-500" />
                  Recruiter Metrics Deck
                </h4>
                <Disc size={12} className="text-zinc-600 animate-spin-[spin_10s_linear_infinite]" />
              </div>

              {/* Status Content - Elevated Z-Depth */}
              <div className="p-6 space-y-4 [transform:translateZ(40px)] pointer-events-none">
                
                {/* Metric 1: System Availability State */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl transition-all font-mono">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio size={12} className="text-emerald-400 animate-pulse" />
                      Availability State
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-tight">
                      OPEN_TO_OFFERS
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden p-[0.5px]">
                    <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_0_4px_#10b981]" />
                  </div>
                </div>

                {/* Metric 2: Core Engineering Yield */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl transition-all font-mono">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={12} className="text-zinc-500" />
                      Core Focus Yield
                    </span>
                    <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                      UI_PERF_ENGINEERING
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                  </div>
                </div>

                {/* Metric 3: Clearance Parameters Location */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl transition-all font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={12} className="text-zinc-500" />
                      Clearance Params
                    </span>
                    <span className="text-xs text-zinc-300 tracking-tight font-bold">
                      San Francisco // REMOTE
                    </span>
                  </div>
                </div>

              </div>
              
              {/* Micro diagnostic framework baseline accent */}
              <div className="absolute bottom-4 right-4 left-4 flex justify-between font-mono text-[8px] text-zinc-700 [transform:translateZ(15px)] pointer-events-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
                <span>INDEX_SYS_V24</span>
                <div className="flex items-center gap-1">
                  <Sparkles size={8} />
                  <span>BIOMETRIC_STABLE</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}