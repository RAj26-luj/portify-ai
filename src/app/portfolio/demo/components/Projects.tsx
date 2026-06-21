"use client";

import { useState } from "react";
import { 
  LayoutGrid, ShieldCheck, Cpu, ArrowUpRight, Terminal, 
  Activity, Binary, X, ChevronLeft, ChevronRight, 
  ExternalLink, Clock, User, Building2, AlertCircle, ArrowRight
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
// Import Link component for fast application routing transitions
import Link from "next/link";

interface ProjectItem {
  title: string;
  desc: string;
  problemStatement: string;
  type: "PERSONAL" | "ORGANISATIONAL";
  tech: string[];
  status: string;
  coverage: string;
  projectCode: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
  githubLink: string;
  deployedLink: string;
  images: string[];
  timelineMetrics: { axisLabel: string; value: number; log: string }[];
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const projects: ProjectItem[] = [
    {
      title: "Smart Financial Ledger",
      desc: "High-throughput cryptographic ledger architecture processing decentralized state transactions with microsecond optimization routines.",
      problemStatement: "Traditional financial sync chains suffer severe block serialization delays under volatile transactional spikes, leading to stale states and race-condition vulnerabilities.",
      type: "ORGANISATIONAL",
      tech: ["Next.js 15", "GoLang", "PostgreSQL", "Kafka"],
      status: "BUILD_PASSING",
      coverage: "98.4% COV",
      projectCode: "PRJ-FIN-X9",
      colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      glowClass: "group-hover:shadow-[0_30px_60px_rgba(16,185,129,0.18)] group-hover:border-emerald-500/30",
      bgGradient: "from-emerald-500/10 via-indigo-500/0 to-transparent",
      githubLink: "https://github.com",
      deployedLink: "https://vercel.app",
      images: [
        "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
      ],
      timelineMetrics: [
        { axisLabel: "PHASE_1", value: 40, log: "Core Architecture & State Init" },
        { axisLabel: "PHASE_2", value: 65, log: "Data Pipeline & Stream Active" },
        { axisLabel: "PHASE_3", value: 85, log: "Distributed Cluster Scaling Test" },
        { axisLabel: "PHASE_4", value: 98, log: "Microsecond Handshake Optimization" }
      ]
    },
    {
      title: "Cloud Encryption Portal",
      desc: "Zero-knowledge security infrastructure layer utilizing client-side WASM binary compilations and strict AWS hardware security modules.",
      problemStatement: "Server-side encryption keys remain fundamentally vulnerable to memory leak captures and internal operational sniffing arrays during transient compute operations.",
      type: "PERSONAL",
      tech: ["Rust", "WASM", "Next.js", "AWS KMS"],
      status: "LIVE_ACTIVE",
      coverage: "100% SEC",
      projectCode: "PRJ-SEC-Y2",
      colorClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      glowClass: "hover:shadow-[0_30px_60px_rgba(6,182,212,0.18)] hover:border-cyan-500/30",
      bgGradient: "from-cyan-500/10 via-indigo-500/0 to-transparent",
      githubLink: "https://github.com",
      deployedLink: "https://vercel.app",
      images: [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=800&auto=format&fit=crop"
      ],
      timelineMetrics: [
        { axisLabel: "STAGE_1", value: 25, log: "WASM Compilers Handshake Set" },
        { axisLabel: "STAGE_2", value: 50, log: "Zero-Knowledge Local Cipher Blocks" },
        { axisLabel: "STAGE_3", value: 90, log: "AWS Cryptographic Module Anchor" },
        { axisLabel: "STAGE_4", value: 100, log: "Full Structural Audit Cleared" }
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
    <section className="relative py-24 bg-[#030306] overflow-x-hidden" id="projects">
      {/* Structural Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Binary size={12} className="text-indigo-400 animate-pulse" />
            Master Production Catalog
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Featured Projects
          </h2>
        </div>

        {/* 3D Grid Layout Array */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, index) => (
            /* --- STABLE ANCHOR OUTER CONTAINER --- */
            <div key={p.title} className="group [perspective:1200px] w-full">
              
              {/* --- INNER 3D MOVING CARD CHASSIS --- */}
              <div
                onClick={() => {
                  setActiveProject(p);
                  setCurrentImgIndex(0);
                }}
                className={`relative h-full bg-[#08080d]/90 border border-white/10 rounded-2xl p-8 transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(0deg)_rotateY(0deg)_translateZ(0px)]
                  ${index === 0 
                    ? "group-hover:[transform:rotateX(7deg)_rotateY(3deg)_translateZ(24px)]" 
                    : "group-hover:[transform:rotateX(7deg)_rotateY(-3deg)_translateZ(24px)]"
                  } 
                  shadow-[0_20px_45px_rgba(0,0,0,0.7)] cursor-pointer ${p.glowClass}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${p.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <span className="absolute top-4 left-4 w-3 h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors pointer-events-none" />
                <span className="absolute top-4 left-4 w-[1px] h-3 bg-white/5 group-hover:bg-white/20 transition-colors pointer-events-none" />

                {/* Card Telemetry Meta Header */}
                <div className="flex items-center justify-between mb-8 [transform:translateZ(20px)] pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 border rounded-xl transition-all duration-300 ${p.colorClass}`}>
                      <LayoutGrid size={16} />
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded">
                      <Terminal size={10} />
                      <span>{p.projectCode}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded-md">
                    <ShieldCheck size={10} />
                    {p.status}
                  </div>
                </div>

                {/* Core Descriptive Text - Elevated Depth */}
                <div className="space-y-3 [transform:translateZ(45px)] pointer-events-none">
                  <h3 className="text-2xl font-black text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-400 font-sans leading-relaxed min-h-[72px]">
                    {p.desc}
                  </p>
                </div>

                {/* Technology Badges */}
                <div className="mt-6 flex flex-wrap gap-1.5 [transform:translateZ(30px)] pointer-events-none">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono font-medium tracking-tight bg-white/[0.02] border border-white/5 text-zinc-400 px-2.5 py-1 rounded-lg group-hover:border-white/10 group-hover:text-zinc-200 transition-all"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Card Action Footer */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-zinc-600 [transform:translateZ(20px)] pointer-events-none">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Activity size={12} className="opacity-60" />
                    <span>{p.coverage}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-zinc-500 group-hover:text-white transition-colors">
                    <span className="text-[9px] uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-wider">Inspect Blueprint</span>
                    <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            ADDED ACTION INTERFACE: SEE MORE ARCHIVE ROUTER CONTROL 
            ========================================================================= */}
        <div className="mt-16 flex justify-center animate-in fade-in duration-700">
          <Link
           href="/portfolio/raj/projects"
            className="group/btn relative px-8 py-4 bg-transparent border border-white/10 hover:border-cyan-500/30 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
          >
            {/* Ambient Background Hover Glow Underlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
            
            <Terminal size={12} className="text-zinc-500 group-hover/btn:text-cyan-400 transition-colors" />
            <span>Load Entire System Index</span>
            <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform text-zinc-400 group-hover/btn:text-white" />
          </Link>
        </div>
        {/* ========================================================================= */}

        {/* --- DYNAMIC MISSION CONTROL BLUEPRINT MODAL --- */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            <div className="absolute w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative w-full max-w-4xl bg-[#06060a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] flex flex-col animate-in zoom-in-98 duration-200">
              
              {/* Top Operational Bar */}
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-zinc-500" />
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    Project Diagnostic Matrix // <span className="text-white font-bold">{activeProject.title}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveProject(null)}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Main Content Viewport Split */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {/* LEFT WING: Visual Matrix & Velocity Engine */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Sliding Interface Carousel */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <LayoutGrid size={12} />
                      Visual Interface Modules
                    </h4>
                    
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 group">
                      <img 
                        src={activeProject.images[currentImgIndex]} 
                        alt={`${activeProject.title} application dashboard frame captures`}
                        className="w-full h-full object-cover select-none"
                      />
                      
                      {/* Laser Matrix Scanner HUD Animation */}
                      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 shadow-[0_0_8px_#22d3ee] top-0 animate-[bounce_3s_infinite]" />

                      <button 
                        onClick={() => prevImage(activeProject.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/80 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        onClick={() => nextImage(activeProject.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/80 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <ChevronRight size={14} />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/70 px-2 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                        {activeProject.images.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? "bg-cyan-400 w-3 shadow-[0_0_4px_#22d3ee]" : "bg-zinc-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Build Velocity Metrics Graph */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <Clock size={12} />
                      Development Velocity Vector Graph
                    </h4>

                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4 font-mono">
                      <div className="flex items-end justify-between gap-3 h-24 pt-2 border-b border-white/5 relative">
                        <div className="absolute inset-x-0 top-1/3 h-px border-t border-dashed border-white/[0.03]" />
                        <div className="absolute inset-x-0 top-2/3 h-px border-t border-dashed border-white/[0.03]" />
                        
                        {activeProject.timelineMetrics.map((bar, i) => (
                          <div 
                            key={bar.axisLabel} 
                            className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar relative animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="absolute -top-7 bg-zinc-950 border border-white/15 text-[9px] px-2 py-0.5 rounded shadow-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 text-zinc-200">
                              {bar.log}
                            </div>
                            
                            <div 
                              className={`w-full max-w-[20px] rounded-t-[2px] transition-all duration-1000 origin-bottom bg-gradient-to-t shadow-[0_0_12px_rgba(0,0,0,0.5)]
                                ${activeProject.type === "ORGANISATIONAL" ? "from-emerald-500/20 to-emerald-400 group-hover/bar:from-emerald-500/40" : "from-cyan-500/20 to-cyan-400 group-hover/bar:from-cyan-500/40"}
                              `}
                              style={{ height: `${bar.value}%` }}
                            />
                            <span className="text-[8px] text-zinc-500 font-bold tracking-tight">{bar.axisLabel}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[8px] text-zinc-600 text-center uppercase tracking-widest">
                        x-axis: Project Milestones // y-axis: Output Yield
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT WING: System Scope Specs */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 font-mono text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                      {activeProject.type === "ORGANISATIONAL" ? <Building2 size={11} /> : <User size={11} />}
                      {activeProject.type} SCOPE
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">
                      {activeProject.projectCode}
                    </div>
                  </div>

                  {/* Problem Statement Block */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <AlertCircle size={12} className="text-zinc-500" />
                      Problem Statement Payload
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-white/[0.01] border border-white/5 p-4 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                      {activeProject.problemStatement}
                    </p>
                  </div>

                  {/* Architectural Summary */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                      <Cpu size={12} />
                      Architectural Summary
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {activeProject.desc}
                    </p>
                  </div>

                  {/* Framework Declarations */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                      Pillar Framework Declarations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tech.map((t) => (
                        <span key={t} className="bg-white/[0.02] border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-xl text-xs font-mono text-zinc-300 transition-colors">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Live Deploy & Source Links */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <a
                      href={activeProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      <FaGithub size={14} />
                      <span>Source Code</span>
                    </a>

                    <a
                      href={activeProject.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-black font-black
                        ${activeProject.type === "ORGANISATIONAL" 
                          ? "bg-emerald-500 hover:bg-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.2)]" 
                          : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"
                        }
                      `}
                    >
                      <ExternalLink size={14} />
                      <span>Launch Node</span>
                    </a>
                  </div>

                </div>

              </div>

              {/* Secure Terminal Footer Status Readout */}
              <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-zinc-600 shrink-0 select-none">
                <span>SYSTEM_STATUS: CORE_INSPECT_STREAM_ACTIVE</span>
                <span className="text-emerald-500 animate-pulse">● SECURE HANDSHAKE COMPLETED</span>
              </div>

            </div>

            {/* Click-away backdrop dismiss shield */}
            <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setActiveProject(null)} />
          </div>
        )}

      </div>
    </section>
  );
}