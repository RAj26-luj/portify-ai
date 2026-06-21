"use client";

import { BookOpen, FileText, ArrowUpRight, Terminal, Binary, Hash, Bookmark } from "lucide-react";

interface PublicationItem {
  title: string;
  journal: string;
  date: string;
  doi: string;
  citations: string;
  abstract: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
}

export default function Publications() {
  const dispatches: PublicationItem[] = [
    {
      title: "Predictive Latency Minimization Model",
      journal: "IEEE International Conference",
      date: "PROD_2024",
      doi: "10.1109/TLM.2024.0892",
      citations: "38 Citations",
      abstract: "Mathematical profiling model optimized for sub-millisecond network state routing and dynamic packet anticipation across highly distributed cluster paradigms.",
      colorClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(6,182,212,0.12)]",
      bgGradient: "from-cyan-500/5 via-transparent to-transparent",
    },
    {
      title: "Asynchronous State Decoupling Algorithms",
      journal: "ACM Systems Journal",
      date: "PROD_2023",
      doi: "10.1145/ACM.SYS.2023.1104",
      citations: "54 Citations",
      abstract: "An architectural exploration into isolating heavy mutating transaction streams from UI render threads via localized structural matrix differentials.",
      colorClass: "text-purple-400 border-purple-500/20 bg-purple-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(168,85,247,0.12)]",
      bgGradient: "from-purple-500/5 via-transparent to-transparent",
    },
  ];

  return (
    <section className="relative py-24 bg-[#030306] overflow-hidden" id="publications">
      {/* Background Architectural Grid Matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6">
        
        {/* Module Header block */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Binary size={12} className="text-purple-400 animate-pulse" />
            Indexed Academic Index
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Scientific Dispatches
          </h2>
        </div>

        {/* 3D Viewport Wrapper Stacking Layout */}
        <div className="space-y-8 [perspective:1200px]">
          {dispatches.map((dispatch) => (
            <div
              key={dispatch.doi}
              className={`group relative bg-[#08080d]/90 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-2deg)_translateZ(15px)] shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${dispatch.glowClass}`}
            >
              {/* Internal Holographic Sheet Underlay */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${dispatch.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Geometry Structural Framework Badges */}
              <span className="absolute top-0 right-12 w-8 h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors" />
              <span className="absolute right-0 top-12 w-[1px] h-8 bg-white/5 group-hover:bg-white/20 transition-colors" />

              {/* Top Structural Information Row */}
              <div className="flex items-center justify-between gap-4 mb-6 [transform:translateZ(15px)]">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 border rounded-xl transition-all duration-300 ${dispatch.colorClass}`}>
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-zinc-200 block tracking-tight">
                      {dispatch.journal}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider block mt-0.5">
                      REF_ID: {dispatch.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 bg-white/5 border border-white/5 px-2 py-1 rounded-md">
                  <Bookmark size={10} className="text-zinc-500" />
                  <span>{dispatch.citations}</span>
                </div>
              </div>

              {/* Central Title Cluster - Maximal Spatial Z-Depth */}
              <div className="space-y-3 [transform:translateZ(40px)]">
                <h3 className="text-xl font-black text-zinc-100 group-hover:text-white tracking-tight transition-colors leading-snug">
                  {dispatch.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-2xl">
                  {dispatch.abstract}
                </p>
              </div>

              {/* Core Index Tracking Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] text-zinc-600 [transform:translateZ(15px)]">
                <div className="flex items-center gap-1.5">
                  <Hash size={11} className="text-zinc-600" />
                  <span>DOI: <span className="text-zinc-500">{dispatch.doi}</span></span>
                </div>
                
                <div className="flex items-center gap-1 text-zinc-500 group-hover:text-white transition-colors cursor-pointer self-end sm:self-auto">
                  <Terminal size={11} />
                  <span className="text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Request Manuscript</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}