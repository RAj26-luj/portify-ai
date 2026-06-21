"use client";

import { useState } from "react";
import { 
  Briefcase, GraduationCap, Terminal, Binary, ArrowUpRight, 
  Cpu, CircleDot, X, Clock, MapPin, CheckCircle2, ShieldAlert 
} from "lucide-react";

interface TimelineItem {
  duration: string;
  role: string;
  org: string;
  location: string;
  focus: string;
  fullDescription: string;
  nodeId: string;
  expertise: string[];
  technologies: string[];
}

export default function Timeline() {
  const [tab, setTab] = useState<"experience" | "education">("experience");
  const [activeItem, setActiveItem] = useState<TimelineItem | null>(null);

  const experience: TimelineItem[] = [
    {
      duration: "Dec 2023 - Present",
      role: "Lead Frontend Architect",
      org: "HyperPixel UI Labs",
      location: "San Francisco, CA // REMOTE",
      focus: "Orchestrating sub-millisecond layer rendering trees and compiling highly modular, layout virtualization packages for enterprise clients.",
      fullDescription: "Spearheaded the complete overhauling of our core design compilation runtime engine. Directed a decentralized crew of UI specialists to isolate layout recalculation routines, cleanly bypassing the main window threat thread constraints during ultra-dense state stream loads.",
      nodeId: "NODE_XP_#01",
      expertise: [
        "Optimized layout paint cycles to lock steady 60fps frame pipelines under peak transaction bursts.",
        "Architected highly virtualized component trees handling datasets exceeding 50,000 recursive nodes.",
        "Authored native WebAssembly sub-modules to accelerate layout matrix calculations directly inside browser threads."
      ],
      technologies: ["TypeScript", "React 19", "Next.js 15", "WASM", "Rust", "TailwindCSS"]
    },
    {
      duration: "Jan 2022 - Nov 2023",
      role: "Senior React Engineer",
      org: "DevVibe Agency",
      location: "Austin, TX // HYBRID",
      focus: "Architected modern micro-state architecture trees and optimized contextual reactive memory patterns over heavy incoming state streams.",
      fullDescription: "Designed custom state tracking nodes for distributed dashboard configurations. Minimized memory overhead by stripping redundant state loops, ensuring deterministic client side operations across high-density real-time visualization applications.",
      nodeId: "NODE_XP_#02",
      expertise: [
        "Slashed reactive garbage collection delays by 42% through structured memory caching boundaries.",
        "Integrated dual-channel WebSocket adapters ensuring zero-drop message parsing on concurrent feeds.",
        "Refactored complex state trees into clean, single-source immutable data layers."
      ],
      technologies: ["JavaScript", "React", "Redux Toolkit", "Zustand", "WebSockets", "Node.js"]
    },
  ];

  const education: TimelineItem[] = [
    {
      duration: "2019 - 2021",
      role: "M.S. Computer Science",
      org: "Berkeley Institute",
      location: "Berkeley, CA",
      focus: "Specialized deep-dive engineering blocks centering on high-concurrency threading, distributed compiler models, and asynchronous layout structures.",
      fullDescription: "Conducted core computational exploration on automated state thread scheduling across asynchronous virtual engines. Published independent document summaries analyzing layout recalculation optimizations in browser engine core sandboxes.",
      nodeId: "NODE_ED_#01",
      expertise: [
        "Completed rigorous master thesis matching runtime code compilation metrics directly onto browser canvases.",
        "Advanced deep competency fields covering thread parsing models and distributed database clusters.",
        "Designed optimized execution compilers converting high-level abstractions to bare metal structures."
      ],
      technologies: ["C++", "Python", "Compiler Design", "Distributed Systems", "Parallel Computing"]
    },
    {
      duration: "2015 - 2019",
      role: "B.Sc Systems Engineering",
      org: "Stanford Division",
      location: "Stanford, CA",
      focus: "Acquired fundamental infrastructure metrics targeting hardware-software interfaces, bitwise compilation fields, and foundational computation proofs.",
      fullDescription: "Gained core systematic engineering qualifications focusing on lower-level hardware programming configurations, strict algorithm logic matrices, and bit-mask layout allocations.",
      nodeId: "NODE_ED_#02",
      expertise: [
        "Maintained perfect performance scoring markers on foundational logic proofs and database optimizations.",
        "Constructed custom embedded controller chips utilizing machine memory map allocation models.",
        "Mastered advanced core structures tracking computational runtime complexities ($O(n \log n)$ arrays)."
      ],
      technologies: ["C", "Assembly", "Data Structures", "Computer Architecture", "Discrete Math"]
    },
  ];

  const data = tab === "experience" ? experience : education;
  const isExperience = tab === "experience";

  return (
    <section className="relative py-24 bg-[#030306] overflow-x-hidden" id="timeline">
      {/* Background Cartography Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${isExperience ? "bg-emerald-500/5" : "bg-cyan-500/5"}`} />

      <div className="relative max-w-4xl mx-auto px-6">
        
        {/* Module Header Core */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Binary size={12} className={isExperience ? "text-emerald-400" : "text-cyan-400"} />
            Chronological State Ledger
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Professional Chronicle
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1.5 bg-[#07070c] border border-white/5 rounded-xl w-fit mb-12 backdrop-blur-sm font-mono text-xs z-30 relative">
          <button
            onClick={() => setTab("experience")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all duration-300 cursor-pointer
              ${isExperience 
                ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)]" 
                : "text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            <Briefcase size={14} />
            <span>Experience Array</span>
          </button>

          <button
            onClick={() => setTab("education")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all duration-300 cursor-pointer
              ${!isExperience 
                ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.25)]" 
                : "text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            <GraduationCap size={14} />
            <span>Education Logs</span>
          </button>
        </div>

        {/* Timeline Flow Stream */}
        <div className="relative space-y-8">
          {/* Vertical Track Conduit Line */}
          <div className="absolute left-6 top-2 bottom-2 w-px bg-white/5 z-0 pointer-events-none">
            <div className={`w-full h-1/2 rounded-full transition-all duration-500 ${isExperience ? "bg-emerald-500/30 shadow-[0_0_8px_#10b981]" : "bg-cyan-500/30 shadow-[0_0_8px_#06b6d4]"}`} />
          </div>

          {data.map((item, i) => (
            <div
              key={item.nodeId + i}
              className="relative pl-12 z-10 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Dynamic Tracking Node Pin */}
              <span className="absolute left-4 top-8 w-4 h-4 rounded-full bg-[#050508] border-2 border-zinc-700 flex items-center justify-center -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(0,0,0,1)] pointer-events-none">
                <CircleDot size={8} className={`opacity-0 transition-opacity duration-300 ${isExperience ? "text-emerald-400" : "text-cyan-400"}`} />
              </span>

              {/* STABLE ANCHOR OUTER WRAPPER */}
              <div className="group [perspective:1200px] w-full">
                
                {/* INNER 3D CARD CHASSIS */}
                <div 
                  onClick={() => setActiveItem(item)}
                  className={`relative bg-[#08080d]/90 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(0deg)_rotateY(0deg)_translateZ(0px)]
                    group-hover:[transform:rotateX(5deg)_rotateY(-2deg)_translateZ(20px)] shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer
                    ${isExperience 
                      ? "group-hover:shadow-[0_20px_45px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/20" 
                      : "group-hover:shadow-[0_20px_45px_rgba(6,182,212,0.1)] group-hover:border-cyan-500/20"
                    }
                  `}
                >
                  {/* Structural Geometry Corner Decals */}
                  <span className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/10 group-hover:border-white/30 transition-colors pointer-events-none" />

                  {/* Meta Matrix Layer Row */}
                  <div className="flex items-center justify-between gap-4 mb-4 font-mono text-[10px] [transform:translateZ(15px)] pointer-events-none">
                    <span className={`font-bold transition-colors ${isExperience ? "text-emerald-400" : "text-cyan-400"}`}>
                      {item.duration}
                    </span>
                    <span className="text-zinc-600 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                      {item.nodeId}
                    </span>
                  </div>

                  {/* Content Blocks - Maximized Z-Depth */}
                  <div className="space-y-2 [transform:translateZ(40px)] pointer-events-none">
                    <h3 className="text-xl font-black text-zinc-100 group-hover:text-white transition-colors tracking-tight flex items-center gap-2">
                      {isExperience ? (
                        <Briefcase size={16} className="text-zinc-500 group-hover:text-zinc-300" />
                      ) : (
                        <GraduationCap size={16} className="text-zinc-500 group-hover:text-zinc-300" />
                      )}
                      {item.role}
                    </h3>
                    
                    <p className="text-xs font-mono font-medium text-zinc-400">
                      @ {item.org}
                    </p>

                    <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-2 border-t border-white/5">
                      {item.focus}
                    </p>
                  </div>

                  {/* "Know More" Interactive Action Label */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-zinc-500 [transform:translateZ(20px)] pointer-events-none">
                    <span className="uppercase tracking-wider group-hover:text-zinc-300 transition-colors">Inspect Log Dossier</span>
                    <div className="flex items-center gap-1 group-hover:text-white transition-colors">
                      <span>Know More</span>
                      <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

              </div> {/* End Stable Anchor */}

            </div>
          ))}
        </div>

        {/* --- PREMIUM MATRIX CHRONICLE DOSSIER DRAWER MODAL --- */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            {/* Ambient Modal Backdrop Light */}
            <div className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none ${isExperience ? "bg-emerald-500/5" : "bg-cyan-500/5"}`} />

            <div className="relative w-full max-w-3xl bg-[#06060a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] my-auto max-h-[90vh] flex flex-col animate-in zoom-in-98 duration-200">
              
              {/* Top Operational Bar */}
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-zinc-500" />
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    Personnel Node Inspection // <span className="text-white font-bold">{activeItem.nodeId}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Inner Workdesk Space */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {/* LEFT INFO PANEL (4 Columns) */}
                <div className="md:col-span-4 space-y-4 font-mono select-none">
                  <div className="space-y-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Duration Frame</span>
                    <div className={`text-xs font-bold flex items-center gap-1.5 ${isExperience ? "text-emerald-400" : "text-cyan-400"}`}>
                      <Clock size={12} />
                      {activeItem.duration}
                    </div>
                  </div>

                  <div className="space-y-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Operational Base</span>
                    <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <MapPin size={12} className="text-zinc-500" />
                      {activeItem.location}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block px-1">Acquired Capabilities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-zinc-400 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT SYSTEM PANEL (8 Columns) */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Structural Overview Title Cluster */}
                  <div className="space-y-1 border-b border-white/5 pb-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {activeItem.role}
                    </h3>
                    <p className={`font-mono text-xs font-bold ${isExperience ? "text-emerald-500/80" : "text-cyan-500/80"}`}>
                      {activeItem.org}
                    </p>
                  </div>

                  {/* Job Abstract Paragraph */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                      Operational Objective Summary
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {activeItem.fullDescription}
                    </p>
                  </div>

                  {/* Role Expertise Performance Milestones Bulleted List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                      Role Expertise & Strategic Yields
                    </h4>
                    
                    <ul className="space-y-2.5">
                      {activeItem.expertise.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-3 text-xs text-zinc-300 font-sans leading-normal">
                          <CheckCircle2 size={13} className={`shrink-0 mt-0.5 ${isExperience ? "text-emerald-500/60" : "text-cyan-500/60"}`} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* System Handshake Footer */}
              <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-zinc-600 shrink-0 select-none">
                <div className="flex items-center gap-1">
                  <ShieldAlert size={11} className="opacity-60" />
                  <span>TRANSMISSION_SECURE // DATA_VERIFIED</span>
                </div>
                <span className={isExperience ? "text-emerald-500 animate-pulse" : "text-cyan-500 animate-pulse"}>● METRIC_READ_SUCCESS</span>
              </div>

            </div>

            {/* Backdrop click dismiss overlay trigger */}
            <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setActiveItem(null)} />
          </div>
        )}

        {/* Technical Baseline Terminal Footer */}
        <div className="mt-16 pt-4 border-t border-white/[0.03] flex items-center justify-between font-mono text-[9px] text-zinc-700 select-none pointer-events-none">
          <div className="flex items-center gap-1.5">
            <Terminal size={10} />
            <span>RECORD_STREAM_LOADED // DEEP_HITBOX_FIX_OK</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu size={10} />
            <span>SYS_CHRON_v1.1.2</span>
          </div>
        </div>

      </div>
    </section>
  );
}