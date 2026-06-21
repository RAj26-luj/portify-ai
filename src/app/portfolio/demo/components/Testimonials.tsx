"use client";

import { Quote, Terminal, Binary, UserCheck, Cpu, ArrowUpRight } from "lucide-react";

interface TestimonialItem {
  author: string;
  role: string;
  text: string;
  nodeId: string;
  timestamp: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
}

export default function Testimonials() {
  const testimonials: TestimonialItem[] = [
    {
      author: "Jason Devlin",
      role: "Principal Tech Director // HyperScale",
      text: "Outstanding frontend architecture skills. Rebuilt our core layout visualization workspace to maintain an uncompromising 60fps tracking state over extremely heavy transactional pipelines.",
      nodeId: "SIG_AUTH_#8492X",
      timestamp: "LOG_04.2026",
      colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(16,185,129,0.12)]",
      bgGradient: "from-emerald-500/5 via-transparent to-transparent",
    },
    {
      author: "Sophia Lang",
      role: "Lead Product Officer // VibeLabs",
      text: "Exceptional Next.js expertise. Masterfully isolated server components from heavy mutations while layering complex interactive glass animations across our entire user interface template.",
      nodeId: "SIG_AUTH_#1109M",
      timestamp: "LOG_05.2026",
      colorClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(6,182,212,0.12)]",
      bgGradient: "from-cyan-500/5 via-transparent to-transparent",
    },
  ];

  return (
    <section className="relative py-24 bg-[#030306] overflow-hidden" id="testimonials">
      {/* Background Cartography Telemetry Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        
        {/* Module Header Core */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Binary size={12} className="text-indigo-400" />
            Verified Endorsement Feed
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Client Attestations
          </h2>
        </div>

        {/* 3D Perspective Card Deck Grid */}
        <div className="grid md:grid-cols-2 gap-8 [perspective:1200px]">
          {testimonials.map((item, index) => (
            <div
              key={item.author}
              className={`group relative bg-[#08080d]/90 border border-white/10 rounded-2xl p-7 transition-all duration-500 ease-out [transform-style:preserve-3d] 
                ${index === 0 
                  ? "hover:[transform:rotateX(10deg)_rotateY(4deg)_translateZ(20px)]" 
                  : "hover:[transform:rotateX(10deg)_rotateY(-4deg)_translateZ(20px)]"
                } 
                shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer ${item.glowClass}`}
            >
              {/* Internal Holographic Light Underlay Sheet */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Technical Geometric Brackets */}
              <span className="absolute bottom-4 left-4 w-3 h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors" />
              <span className="absolute bottom-4 left-4 w-[1px] h-3 bg-white/5 group-hover:bg-white/20 transition-colors" />

              {/* Attestation Meta Header */}
              <div className="flex items-center justify-between gap-4 mb-6 [transform:translateZ(15px)]">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 border rounded-xl transition-all duration-300 ${item.colorClass}`}>
                    <Quote size={16} className="transform rotate-180 text-current" />
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    <span>{item.nodeId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded-md">
                  <UserCheck size={10} />
                  SIGN_VERIFIED
                </div>
              </div>

              {/* Main Endorsement Payload Text - Layered Depth */}
              <div className="space-y-6 [transform:translateZ(45px)]">
                <p className="text-sm text-zinc-300 font-sans leading-relaxed italic min-h-[72px]">
                  "{item.text}"
                </p>

                {/* Author Credentials Info Block */}
                <div className="pt-4 border-t border-white/5 flex items-start justify-between gap-4 [transform:translateZ(10px)]">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                      {item.author}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-0.5 tracking-tight">
                      {item.role}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-zinc-600 mt-1 uppercase whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Floating Signal Indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 pointer-events-none">
                <ArrowUpRight size={14} className="text-zinc-500" />
              </div>

            </div>
          ))}
        </div>

        {/* Technical Baseline Terminal Readout */}
        <div className="mt-16 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-zinc-700">
          <div className="flex items-center gap-1.5">
            <Terminal size={10} />
            <span>SECURE_FEED_STREAM_ACTIVE</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu size={10} />
            <span>SYS_ATT_v1.0.2</span>
          </div>
        </div>

      </div>
    </section>
  );
}