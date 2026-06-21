"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  PlayCircle, 
  Sparkles, 
  FolderGit2, 
  X,
  Target,
  Cpu,
  Workflow,
  Compass,
  Radio,
  Terminal,
  Activity
} from "lucide-react";

import { trackProjectClick } from "@/actions/analytics";

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"  
];

interface ProjectsProps {
  projects?: any[];
  username: string;
}

export default function Projects({ projects = [], username }: ProjectsProps) {
  const sortedProjects = React.useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return [...projects].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [projects]);

  const isMobileScrollable = sortedProjects.length > 1;

  // Replicate array elements to fill vertical loop thresholds seamlessly on mobile tracks
  const mobileMarqueeItems = React.useMemo(() => {
    if (sortedProjects.length === 0) return [];
    if (!isMobileScrollable) return sortedProjects;
    let items = [...sortedProjects];
    while (items.length < 9) {
      items = [...items, ...sortedProjects];
    }
    return items;
  }, [sortedProjects, isMobileScrollable]);

  const validProjects = React.useMemo(() => {
    if (sortedProjects.length === 0) return [];
    let items = [...sortedProjects];
    while (items.length < 3) {
      items = [...items, ...sortedProjects];
    }
    return items;
  }, [sortedProjects]);
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number>(0);
  
  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProject = validProjects[activeIndex] || null;

  useEffect(() => {
    if (validProjects.length <= 1 || isPaused || selectedProject) {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
      return;
    }

    autoScrollTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % validProjects.length;
        
        if (verticalScrollContainerRef.current) {
          const itemElement = verticalScrollContainerRef.current.children[nextIndex] as HTMLElement;
          if (itemElement) {
            verticalScrollContainerRef.current.scrollTo({
              top: itemElement.offsetTop - verticalScrollContainerRef.current.offsetTop - 12,
              behavior: "smooth"
            });
          }
        }
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [validProjects, isPaused, selectedProject]);

  useEffect(() => {
    if (!isPaused || !activeProject?.images || activeProject.images.length <= 1) {
      setHoveredImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setHoveredImageIndex((prev) => (prev + 1) % activeProject.images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, activeProject]);

  if (!sortedProjects.length) return null;

  const handleProjectClick = async (portfolioId: string, projectId: string) => {
    if (portfolioId && projectId) {
      await trackProjectClick(portfolioId, projectId);
    }
  };

  const getProjectImage = (proj: any, idx: number) => {
    if (isPaused && proj?.id === activeProject?.id && proj?.images?.length > 0) {
      return proj.images[hoveredImageIndex];
    }
    return proj?.thumbnail || proj?.coverImage || proj?.projectBanner || DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length];
  };

  return (
    <section 
      id="projects" 
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      <style jsx global>{`
        @keyframes scanline-projects {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .projects-scanline-bar {
          animation: scanline-projects 6s linear infinite;
        }
        .cyber-grid-projects {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 3.5rem 3.5rem;
        }
      `}</style>

      {/* Cyberpunk Environment Layout Background Overlays */}
      <div className="absolute inset-0 cyber-grid-projects pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(0,229,255,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#7C3AED]/4 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Lab Header HUD */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#00FF9D]" />
              EXPERIMENTS_LOG
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
              // EXPERIMENTS_SHOWCASE
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#00FF9D] animate-pulse" />
            <span>STREAM_STATUS: STABLE_FEED</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED CONDUIT VECTOR FIELD */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-4 h-[260px] overflow-hidden relative bg-[#0B1120]/40 border-y border-neutral-800/80"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#050816] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050816] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3 py-3"
          animate={isMobileScrollable && !isMobilePaused && !selectedProject ? { y: [0, -420] } : false}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 22,
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((project: any, idx: number) => (
            <div
              key={`mob-${project.id || idx}-${idx}`}
              onClick={() => {
                setSelectedProject(project);
                handleProjectClick(project.portfolioId, project.id);
              }}
              className="w-full h-[76px] bg-[#050816] border border-neutral-800 active:border-[#00E5FF] p-3.5 flex items-center gap-4 shrink-0 cursor-pointer relative"
            >
              <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-[#00E5FF]" />
              <div className="w-12 h-12 rounded-none bg-[#0B1120] border border-neutral-800 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-[#00E5FF]">
                [{String((sortedProjects.indexOf(project) % sortedProjects.length) + 1).padStart(2, '0')}]
              </div>
              <div className="flex-1 min-w-0 text-left space-y-0.5">
                <h3 className="font-bold font-mono text-xs text-white truncate uppercase tracking-wide">{project.title}</h3>
                {project.category && (
                  <p className="text-[10px] font-mono text-neutral-400 truncate">// {project.category}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT SIDE-BY-SIDE INTERACTION LAB */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side Track - Programmatic Infinite Array Scroller */}
        <div className="lg:col-span-5 w-full flex flex-col justify-between space-y-4">
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between px-1 text-[10px] text-neutral-500 tracking-widest font-mono uppercase">
              <span>INDEX_REGISTRY ({projects.length})</span>
              <span className="flex items-center gap-1.5 text-[#00FF9D] font-bold">
                <Cpu className="w-3.5 h-3.5 animate-spin duration-3000" /> SYSTEM_TRACK_SYNC
              </span>
            </div>

            <div 
              ref={verticalScrollContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => {
                setIsPaused(false);
                setHoveredImageIndex(0);
              }}
              className="w-full max-h-[388px] overflow-y-auto pr-2 space-y-3 scrollbar-none border border-neutral-900 bg-[#0B1120]/40 p-3 rounded-none backdrop-blur-xl transition-all duration-300"
              style={{ scrollSnapType: "y mandatory" }}
            >
              {validProjects.map((project: any, idx: number) => {
                const isCurrent = idx === activeIndex;
                return (
                  <div
                    key={`${project.id}-${idx}`}
                    onClick={() => {
                      setActiveIndex(idx);
                      setSelectedProject(project);
                      handleProjectClick(project.portfolioId, project.id);
                    }}
                    style={{ scrollSnapAlign: "start" }}
                    className={`w-full text-left p-4 cursor-pointer transition-all duration-300 relative border h-[110px] flex flex-col justify-center rounded-none group ${
                      isCurrent 
                        ? "bg-[#0B1120] border-[#00E5FF]/40 shadow-[0_0_25px_rgba(0,229,255,0.08)]" 
                        : "bg-transparent border-neutral-900 hover:border-neutral-800 hover:bg-[#0B1120]/20"
                    }`}
                  >
                    {isCurrent && (
                      <motion.div 
                        layoutId="verticalIndicatorLine"
                        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00E5FF]"
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                      />
                    )}

                    {/* Tech Corner Accent */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-800 group-hover:border-[#00E5FF] transition-colors" />

                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1.5 truncate w-full">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold ${isCurrent ? "text-[#00FF9D]" : "text-neutral-600"}`}>
                            // 0{idx + 1}
                          </span>
                          <h3 className={`font-bold font-mono text-base uppercase tracking-wider truncate ${isCurrent ? "text-white" : "text-neutral-400"}`}>
                            {project.title}
                          </h3>
                        </div>
                        <p className="text-xs font-mono text-neutral-400 truncate max-w-[92%]">
                          {project.shortDescription || "Hover to stream active diagnostics loop or execute telemetry data structure overlay."}
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-widest shrink-0 transition-colors ${isCurrent ? "text-[#00E5FF]" : "text-neutral-600"}`}>
                        DIAG //
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Frame - Cyber Holographic Preview Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[490px] flex items-stretch">
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setHoveredImageIndex(0);
                }}
                onClick={() => {
                  setSelectedProject(activeProject);
                  handleProjectClick(activeProject.portfolioId, activeProject.id);
                }}
                className="w-full bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/40 p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[490px] cursor-none group rounded-none"
              >
                {/* Tech Trim HUD Lines */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7C3AED]" />

                <div>
                  <div className="w-full h-64 bg-[#050816] border border-neutral-900 relative mb-6 overflow-hidden mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500">
                    <img 
                      src={getProjectImage(activeProject, activeIndex)} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover select-none filter contrast-125 saturate-150 transition-transform duration-500 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />
                    
                    {/* Laser Scanning Bar */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] projects-scanline-bar pointer-events-none opacity-0 group-hover:opacity-100" />

                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-left z-20">
                      <h3 className="text-xl font-black font-mono text-white uppercase tracking-wider drop-shadow-md">
                        {activeProject.title}
                      </h3>
                      {activeProject.images?.length > 1 && isPaused && (
                        <div className="flex gap-1.5 mt-2">
                          {activeProject.images.map((_: any, i: number) => (
                            <span 
                              key={i} 
                              className={`h-1 w-5 rounded-none transition-all ${
                                i === hoveredImageIndex ? "bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeProject.techStack?.length > 0 && (
                    <div className="space-y-2 text-left relative z-10">
                      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500">// ENGINE_BUILD_SPECIFICATIONS</div>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-[#050816] border border-neutral-800 text-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider group-hover:border-[#00E5FF]/20 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-end gap-4 font-mono text-xs z-10" onClick={(e) => e.stopPropagation()}>
                  {activeProject.githubUrl && (
                    <a 
                      href={activeProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#050816] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                    >
                      <FolderGit2 className="w-4 h-4 text-[#00E5FF]" /> CODEBASE_TREE
                    </a>
                  )}
                  {activeProject.liveUrl && (
                    <a 
                      href={activeProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    >
                      LIVE_DEPLOYMENT <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {projects.length > 6 && (
        <div className="w-full text-center mt-12 md:mt-20 relative z-10 px-4">
          <Link
            href={`/${username}/projects`}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 bg-[#0B1120] hover:bg-[#050816] border border-neutral-800 hover:border-neutral-600 text-[10px] sm:text-xs font-bold font-mono tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-all shadow-xl"
          >
            OPEN_COMPLETE_PROJECT_LEDGER
            <Compass className="w-4 h-4 text-[#7C3AED]" />
          </Link>
        </div>
      )}

      {/* Pop-up Details Modal Layer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/95 z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative rounded-none overflow-y-auto max-h-[90vh] md:max-h-[85vh] text-left scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Title Bar */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">PROJECT_INSPECTOR // PARAMETER_MATRIX</span>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-44 sm:h-72 bg-[#050816] relative overflow-hidden flex items-end p-6 border-b border-neutral-900">
                <img 
                  src={getProjectImage(selectedProject, validProjects.indexOf(selectedProject))} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover filter brightness-[0.25] saturate-150 mix-blend-luminosity absolute inset-0 z-0 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                
                {/* Grid panel mesh patterns */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

                <div className="relative z-20 w-full text-left">
                  <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[9px] font-mono uppercase tracking-[0.15em] inline-block mb-2">
                    {selectedProject.category || "Application Frame Infrastructure"}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black font-mono tracking-wide text-white uppercase drop-shadow-md">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 bg-[#0B1120]">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-[#050816] border border-neutral-800 font-mono text-xs">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">ROLE_MATRIX</div>
                    <div className="font-bold text-neutral-200 uppercase">{selectedProject.role || "Lead Engineer"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">LIFECYCLE</div>
                    <div className="font-bold text-[#00E5FF] uppercase">{selectedProject.status || "Production Release"}</div>
                  </div>
                  {selectedProject.metrics?.length > 0 && (
                    <div className="sm:col-span-2">
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">
                        KEY_METRIC_ACHIEVEMENTS
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.metrics.map((metric: any) => (
                          <div key={metric.id} className="font-bold text-[#00FF9D] flex items-center gap-1.5 bg-[#00FF9D]/5 px-2 py-0.5 border border-[#00FF9D]/20 uppercase text-[11px]">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            {metric.label}: {metric.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.problemStatement && (
                    <div className="space-y-2 p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#FF4D6D] text-left">
                      <h4 className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase flex items-center gap-1.5 font-mono">
                        <Target className="w-3.5 h-3.5 text-[#FF4D6D]" /> PROBLEM_DOMAIN_SURFACE
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-sans font-light">
                        {selectedProject.problemStatement}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="space-y-2 p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00E5FF] text-left">
                      <h4 className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase flex items-center gap-1.5 font-mono">
                        <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" /> RESOLUTION_ARCHITECTURE
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-sans font-light">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProject.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> FUNCTIONAL_ENGINEERING_CONTEXT
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-mono whitespace-pre-line bg-[#050816] p-4 border border-neutral-800">
                      // {selectedProject.description}
                    </p>
                  </div>
                )}

                {selectedProject.techStack?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> COMPILATION_CORE_BLUEPRINT
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-[#050816] border border-[#00E5FF]/20 text-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-neutral-900 font-mono text-xs">
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    >
                      <ExternalLink className="w-4 h-4" /> LIVE_DEPLOYMENT_HUB
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#050816] hover:bg-[#0B1120] border border-neutral-800 hover:border-neutral-600 text-neutral-300 font-bold uppercase tracking-widest transition-colors"
                    >
                      <FolderGit2 className="w-4 h-4 text-neutral-400" /> SOURCE_TREE_CODEBASE
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a 
                      href={selectedProject.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-6 py-3 bg-[#050816] hover:bg-[#0B1120] border border-neutral-800 text-neutral-400 hover:text-white uppercase font-bold tracking-widest transition-all"
                    >
                      INTERACTIVE_SANDBOX
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a 
                      href={selectedProject.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C3AED]/10 hover:bg-[#7C3AED] hover:text-[#050816] border border-[#7C3AED]/40 text-[#7C3AED] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                    >
                      <PlayCircle className="w-4 h-4" /> SCREENING_WALKTHROUGH
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}