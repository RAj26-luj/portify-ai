"use client";

import { useState } from "react";
import { 
  GitPullRequest, ShieldCheck, Cpu, ArrowUpRight, Terminal, 
  Activity, Binary, X, ChevronLeft, ChevronRight, 
  ExternalLink, Clock, GitMerge, FileCode2, LayoutGrid, AlertCircle, CheckCircle, ArrowRight
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

interface OpenSourceContribution {
  repoName: string;
  prTitle: string;
  issueStatement: string;
  mergedSolution: string;
  scope: "CORE_KERNEL" | "ECOSYSTEM_MODULE";
  impactMetrics: string[];
  prStatus: "MERGED" | "APPROVED_STAGING";
  linesChanged: string;
  prNumber: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
  repoLink: string;
  pullRequestLink: string;
  architectureDiagrams: string[];
  patchTimeline: { milestone: string; percentage: number; log: string }[];
}

export default function OpenSourceContributions() {
  const [activeContr, setActiveContr] = useState<OpenSourceContribution | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const contributions: OpenSourceContribution[] = [
    {
      repoName: "facebook/react",
      prTitle: "fix(scheduler): resolve starvation loop in concurrent batch queues",
      issueStatement: "High-frequency microtask scheduling triggered intermittent thread priority inversion inside the Concurrent runtime, causing UI freeze frames during heavy asynchronous rendering updates.",
      mergedSolution: "Re-engineered the internal min-heap task priority balance layout. Integrated a dynamic lane expiry threshold shift mechanism to guarantee low-priority execution cycles under infinite continuous streaming overhead.",
      scope: "CORE_KERNEL",
      impactMetrics: ["Next.js 15", "React Dom", "Fiber Runtime", "Scheduler Engine"],
      prStatus: "MERGED",
      linesChanged: "+142 -28 LOC",
      prNumber: "#29482",
      colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      glowClass: "group-hover:shadow-[0_30px_60px_rgba(16,185,129,0.18)] group-hover:border-emerald-500/30",
      bgGradient: "from-emerald-500/10 via-indigo-500/0 to-transparent",
      repoLink: "https://github.com/facebook/react",
      pullRequestLink: "https://github.com/facebook/react/pulls",
      architectureDiagrams: [
        "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop"
      ],
      patchTimeline: [
        { milestone: "FORK", percentage: 20, log: "Isolate Starvation Test Failure Harness" },
        { milestone: "PATCH_V1", percentage: 55, log: "Implement Expiry Lane Balancing Arrays" },
        { milestone: "PROFILING", percentage: 85, log: "V8 Engine Heap Garbage Snapshot Validation" },
        { milestone: "PROVEN", percentage: 100, log: "CI Framework Cross-Runtime Stress Checks Green" }
      ]
    },
    {
      repoName: "tokio-rs/tokio",
      prTitle: "perf(io): optimize dynamic poll queue ring allocation bounds",
      issueStatement: "Transient epoll registration limits caused minor driver memory leaks and socket polling latency overhead under highly congested TCP connection socket pooling cycles.",
      mergedSolution: "Migrated dynamic vector storage references into structural ring buffer slices mapping direct hardware buffers via raw pointer alignments, cutting overhead allocation costs.",
      scope: "ECOSYSTEM_MODULE",
      impactMetrics: ["Rust Engine", "Async I/O", "Epoll Driver", "Network Core"],
      prStatus: "MERGED",
      linesChanged: "+89 -12 LOC",
      prNumber: "#6114",
      colorClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      glowClass: "hover:shadow-[0_30px_60px_rgba(6,182,212,0.18)] hover:border-cyan-500/30",
      bgGradient: "from-cyan-500/10 via-indigo-500/0 to-transparent",
      repoLink: "https://github.com/tokio-rs/tokio",
      pullRequestLink: "https://github.com/tokio-rs/tokio/pulls",
      architectureDiagrams: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop"
      ],
      patchTimeline: [
        { milestone: "REPRO", percentage: 30, log: "Trace Ring Buffering Registration Caps" },
        { milestone: "REFRACT", percentage: 60, log: "Enforce Unsafe Memory Fast-Path Slices" },
        { milestone: "BENCH", percentage: 90, log: "Benchmark System Execution Overhead Declines" },
        { milestone: "UPSTREAM", percentage: 100, log: "Maintainer Validation Signature Acquired" }
      ]
    },
  ];

  const nextImage = (max: number) => {
    setCurrentImgIndex((prev) => (prev === max - 1 ? 0 : prev + 1));
  };

  const prevImage = (max: number) => {
    setCurrentImgIndex((prev) => (prev === 0 ? max - 1 : prev - 1));
  };

  return (
    <section className="relative py-24 bg-[#030306] overflow-x-hidden" id="opensource">
      {/* Structural Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Binary size={12} className="text-emerald-400 animate-pulse" />
            Upstream Framework Codebase Patches
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Open Source Submissions
          </h2>
        </div>

        {/* 3D Grid Matrix Array */}
        <div className="grid md:grid-cols-2 gap-8">
          {contributions.map((c, index) => (
            <div key={c.prNumber} className="group [perspective:1200px] w-full">
              
              <div
                onClick={() => {
                  setActiveContr(c);
                  setCurrentImgIndex(0);
                }}
                className={`relative h-full bg-[#08080d]/90 border border-white/10 rounded-2xl p-8 transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(0deg)_rotateY(0deg)_translateZ(0px)]
                  ${index === 0 
                    ? "group-hover:[transform:rotateX(6deg)_rotateY(2deg)_translateZ(20px)]" 
                    : "group-hover:[transform:rotateX(6deg)_rotateY(-2deg)_translateZ(20px)]"
                  } 
                  shadow-[0_20px_45px_rgba(0,0,0,0.7)] cursor-pointer ${c.glowClass}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${c.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <span className="absolute top-4 left-4 w-3 h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors pointer-events-none" />
                <span className="absolute top-4 left-4 w-[1px] h-3 bg-white/5 group-hover:bg-white/20 transition-colors pointer-events-none" />

                <div className="flex items-center justify-between mb-8 [transform:translateZ(20px)] pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 border rounded-xl transition-all duration-300 ${c.colorClass}`}>
                      <GitPullRequest size={16} />
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      <FaGithub size={11} className="text-zinc-300" />
                      <span>{c.repoName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded-md font-bold">
                    <GitMerge size={10} />
                    {c.prStatus} {c.prNumber}
                  </div>
                </div>

                <div className="space-y-3 [transform:translateZ(45px)] pointer-events-none">
                  <h3 className="text-xl font-black text-zinc-100 group-hover:text-white transition-colors tracking-tight line-clamp-2 leading-snug">
                    {c.prTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {c.issueStatement}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 [transform:translateZ(30px)] pointer-events-none">
                  {c.impactMetrics.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono tracking-tight bg-white/[0.02] border border-white/5 text-zinc-400 px-2.5 py-1 rounded-lg group-hover:border-white/10 group-hover:text-zinc-200 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-zinc-600 [transform:translateZ(20px)] pointer-events-none">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Activity size={12} className="opacity-60" />
                    <span>{c.linesChanged}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-zinc-500 group-hover:text-white transition-colors">
                    <span className="text-[9px] uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-wider">Inspect Patch Log</span>
                    <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            ADDED ACTION INTERFACE: SEE MORE OPEN SOURCE WORK ARCHIVE
            ========================================================================= */}
        <div className="mt-16 flex justify-center animate-in fade-in duration-700">
          <Link
            href={`/portfolio/raj/opensource`}
            className="group/btn relative px-8 py-4 bg-transparent border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
          >
            {/* Ambient Background Hover Glow Underlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
            
            <Terminal size={12} className="text-zinc-500 group-hover/btn:text-emerald-400 transition-colors" />
            <span>Load Complete Contribution Log</span>
            <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform text-zinc-400 group-hover/btn:text-white" />
          </Link>
        </div>
        {/* ========================================================================= */}

        {/* --- DRAWER INSIGHT MODAL INTERACTION LAYER --- */}
        {activeContr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            <div className="absolute w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative w-full max-w-4xl bg-[#06060a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] flex flex-col animate-in zoom-in-98 duration-200">
              
              {/* Header Panel */}
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-zinc-500" />
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    Upstream Architecture Matrix // <span className="text-white font-bold">{activeContr.repoName}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveContr(null)}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Main Container Viewport Split */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {/* LEFT COLUMN: Profiling Models & Deployment Vectors */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Sliding Architecture / Trace Diagrams Panel */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <LayoutGrid size={12} />
                      Core Runtime Profile Traces
                    </h4>
                    
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 group">
                      <img 
                        src={activeContr.architectureDiagrams[currentImgIndex]} 
                        alt="Framework validation telemetry graph frame"
                        className="w-full h-full object-cover select-none opacity-80"
                      />
                      
                      {/* Laser Matrix Scanner HUD Line */}
                      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 shadow-[0_0_8px_#10b981] top-0 animate-[bounce_3s_infinite]" />

                      <button 
                        onClick={() => prevImage(activeContr.architectureDiagrams.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/80 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        onClick={() => nextImage(activeContr.architectureDiagrams.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/80 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <ChevronRight size={14} />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/70 px-2 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                        {activeContr.architectureDiagrams.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? "bg-emerald-400 w-3 shadow-[0_0_4px_#10b981]" : "bg-zinc-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Code Convergence Metrics Graph block */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <Clock size={12} />
                      Upstream Integration Sequence
                    </h4>

                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4 font-mono">
                      <div className="flex items-end justify-between gap-3 h-24 pt-2 border-b border-white/5 relative">
                        <div className="absolute inset-x-0 top-1/3 h-px border-t border-dashed border-white/[0.03]" />
                        <div className="absolute inset-x-0 top-2/3 h-px border-t border-dashed border-white/[0.03]" />
                        
                        {activeContr.patchTimeline.map((bar, i) => (
                          <div 
                            key={bar.milestone} 
                            className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar relative animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="absolute -top-7 bg-zinc-950 border border-white/15 text-[9px] px-2 py-0.5 rounded shadow-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 text-zinc-200 max-w-[180px] truncate">
                              {bar.log}
                            </div>
                            
                            <div 
                              className={`w-full max-w-[18px] rounded-t-[2px] transition-all duration-1000 origin-bottom bg-gradient-to-t shadow-[0_0_12px_rgba(0,0,0,0.5)]
                                ${activeContr.scope === "CORE_KERNEL" ? "from-emerald-500/20 to-emerald-400 group-hover/bar:from-emerald-500/40" : "from-cyan-500/20 to-cyan-400 group-hover/bar:from-cyan-500/40"}
                              `}
                              style={{ height: `${bar.percentage}%` }}
                            />
                            <span className="text-[8px] text-zinc-500 font-bold tracking-tight">{bar.milestone}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[8px] text-zinc-600 text-center uppercase tracking-widest">
                        Stages: Pipeline Traversal // Axis: Delta Convergence
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Code Infrastructure Analysis */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 font-mono text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                      <FileCode2 size={11} className="text-zinc-500" />
                      {activeContr.scope} MODULE SPEC
                    </div>
                    <div className="font-mono text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                      <CheckCircle size={10} />
                      PR {activeContr.prNumber} Verified
                    </div>
                  </div>

                  {/* Bug/Issue Payload Description */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase flex items-center gap-2">
                      <AlertCircle size={12} className="text-red-400/80" />
                      Reported Deficit / Issue Statement
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-red-950/5 border border-red-500/10 p-4 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                      {activeContr.issueStatement}
                    </p>
                  </div>

                  {/* Merged Solution Framework Description */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
                      <GitMerge size={12} className="text-emerald-400/80" />
                      Engineered Infrastructure Fix
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-emerald-950/5 border border-emerald-500/10 p-4 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                      {activeContr.mergedSolution}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <Cpu size={12} />
                      Sub-System Dependencies Impacted
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeContr.impactMetrics.map((tag) => (
                        <span key={tag} className="bg-white/[0.02] border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-xl text-xs font-mono text-zinc-300 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Remote Hyperlinks Mapping */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <a
                      href={activeContr.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      <FaGithub size={14} />
                      <span>Target Base Repo</span>
                    </a>

                    <a
                      href={activeContr.pullRequestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all text-black
                        ${activeContr.scope === "CORE_KERNEL" 
                          ? "bg-emerald-500 hover:bg-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.2)]" 
                          : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"
                        }
                      `}
                    >
                      <ExternalLink size={14} />
                      <span>View Pull Request</span>
                    </a>
                  </div>

                </div>

              </div>

              {/* Status Footer Readout Bar */}
              <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-zinc-600 shrink-0 select-none">
                <span>UPSTREAM_LOGS: INTEGRATION_STREAM_READ_ONLY</span>
                <span className="text-emerald-500 animate-pulse">● REREPOSITORY HANDSHAKE STABLE</span>
              </div>

            </div>

            {/* Click-away backdrop dismiss zone */}
            <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setActiveContr(null)} />
          </div>
        )}

      </div>
    </section>
  );
}