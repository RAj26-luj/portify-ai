"use client";

import { Cpu, Layers, Disc, Terminal, Boxes } from "lucide-react";

export default function Marquee() {
  const items = [
    { name: "NEXT.JS", version: "v15", color: "text-white group-hover:text-cyan-400" },
    { name: "TYPESCRIPT", version: "v5.5", color: "text-zinc-300 group-hover:text-blue-400" },
    { name: "TAILWIND", version: "v4.0", color: "text-zinc-300 group-hover:text-sky-400" },
    { name: "MERN STACK", version: "CORE", color: "text-zinc-300 group-hover:text-emerald-400" },
    { name: "DOCKER", version: "v26.0", color: "text-zinc-300 group-hover:text-indigo-400" },
    { name: "PRISMA", version: "v6.2", color: "text-zinc-300 group-hover:text-teal-400" },
    { name: "NODE.JS", version: "v22", color: "text-zinc-300 group-hover:text-green-400" },
    { name: "AI SYSTEMS", version: "LLM", color: "text-white group-hover:text-purple-400" },
  ];

  // Tripled to ensure seamless, infinite edge-to-edge rendering loop
  const loopPool = [...items, ...items, ...items];

  return (
    <section className="relative py-20 bg-[#030306] overflow-hidden [perspective:1200px]" id="engine-marquee">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px)] bg-[size:4rem] pointer-events-none" />
      
      {/* Left and Right Alpha Blurs to mask edge pop-ins */}
      <div className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#030306] via-[#030306]/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-[#030306] via-[#030306]/70 to-transparent z-10 pointer-events-none" />
      
      {/* Central Ambient Projector Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 3D Isometric Projection Alignment Track */}
      <div 
        className="w-full flex flex-col gap-2 [transform-style:preserve-3d] [transform:rotateX(24deg)_rotateY(-12deg)_rotateZ(-4deg)] transition-transform duration-700 hover:[transform:rotateX(15deg)_rotateY(-5deg)_rotateZ(-1deg)]"
      >
        {/* Upper Diagnostic Ledger Rail */}
        <div className="max-w-7xl mx-auto w-full px-12 flex justify-between font-mono text-[9px] text-zinc-600 tracking-widest uppercase mb-2 [transform:translateZ(10px)]">
          <div className="flex items-center gap-1.5">
            <Terminal size={10} className="text-zinc-500 animate-pulse" />
            <span>CORE_COMPUTATIONAL_MATRIX</span>
          </div>
          <div className="flex items-center gap-1">
            <span>ENGINE_SPEED: 40Hz</span>
            <Disc size={8} className="animate-spin text-zinc-500" />
          </div>
        </div>

        {/* The Animated Infinite Marquee Conveyor */}
        <div className="w-full overflow-hidden border-y border-white/5 bg-[#07070b]/40 backdrop-blur-sm py-4 [transform:translateZ(25px)] shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
          <div className="animate-marquee flex gap-8 whitespace-nowrap w-max will-change-transform">
            {loopPool.map((item, index) => (
              <div
                key={index}
                className="group relative flex items-center gap-4 bg-[#0a0a10] border border-white/10 rounded-xl px-5 py-3 transition-all duration-300 ease-out [transform-style:preserve-3d] hover:border-white/20 hover:bg-[#0e0e17] shadow-[4px_6px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_25px_rgba(99,102,241,0.1)] hover:-translate-y-1 cursor-pointer"
              >
                {/* Internal Holographic Glow Sheet */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-white/[0.02] to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Tech Geometry Indicators */}
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-indigo-400 group-hover:shadow-[0_0_8px_#6366f1] transition-all duration-300 [transform:translateZ(10px)]" />
                
                {/* Main Text Content */}
                <div className="flex flex-col [transform:translateZ(20px)]">
                  <span className={`text-sm font-mono font-black tracking-widest transition-colors ${item.color} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
                    {item.name}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-600 tracking-tighter group-hover:text-zinc-400 transition-colors mt-0.5">
                    {item.version}
                  </span>
                </div>

                {/* Micro Grid Graphic Corner */}
                <Boxes size={10} className="text-zinc-700 group-hover:text-zinc-500 transition-colors ml-2 [transform:translateZ(5px)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Lower Structural Baseline */}
        <div className="max-w-7xl mx-auto w-full px-12 flex justify-between font-mono text-[8px] text-zinc-700 tracking-widest mt-2 [transform:translateZ(10px)]">
          <span>PIPELINE_STATUS // EXECUTING_STATE_OK</span>
          <div className="flex items-center gap-1">
            <Cpu size={10} />
            <span>SYS_MEM_LOAD: 12.4%</span>
          </div>
        </div>

      </div>
    </section>
  );
}