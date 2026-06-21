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
  Compass
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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
    >
      {/* SaaS Visual Assets, Borders & Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#6366F1]/5 to-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#6366F1]" />
              Engine Showcase
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Selected Creations<span className="text-[#06B6D4]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED PREMIUM SAAS MARQUEE */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A0A0B] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3"
          animate={isMobileScrollable && !isMobilePaused && !selectedProject ? { y: [0, -420] } : false}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
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
              className="w-full bg-[#111113] border border-[#18181B] active:border-[#6366F1]/50 rounded-xl p-4 flex items-center gap-4 shadow-xl shrink-0 cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#18181B] border border-[#18181B] shrink-0 flex items-center justify-center font-mono text-xs font-bold text-[#6366F1] shadow-inner">
                {String((sortedProjects.indexOf(project) % sortedProjects.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-white truncate font-sans">{project.title}</h3>
                {project.category && (
                  <p className="text-[10px] font-mono font-medium text-[#71717A] truncate mt-1 uppercase tracking-wider">{project.category}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: PREMIUM SAAS SPLIT RECONSTRUCTED INTERFACE */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Track - Automated Registry System */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-2 text-[11px] text-[#71717A] tracking-wider font-mono uppercase font-semibold">
            <span>Index Registry ({projects.length})</span>
            <span className="flex items-center gap-1.5 text-[#06B6D4] font-bold">
              <Workflow className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Pipeline Active
            </span>
          </div>

          <div 
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredImageIndex(0);
            }}
            className="w-full max-h-[420px] overflow-y-auto pr-2 space-y-3 scrollbar-none border border-[#18181B] bg-[#111113]/40 p-3 rounded-2xl backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
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
                  className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-300 relative border group h-[105px] flex flex-col justify-center ${
                    isCurrent 
                      ? "bg-[#18181B]/80 border-[#6366F1]/40 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                      : "bg-transparent border-transparent hover:border-[#18181B] hover:bg-[#111113]/50"
                  }`}
                >
                  {isCurrent && (
                    <motion.div 
                      layoutId="verticalIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] rounded-l-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 truncate w-full">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono font-bold ${isCurrent ? "text-[#6366F1]" : "text-[#71717A]"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-bold text-base tracking-tight truncate font-sans ${isCurrent ? "text-white" : "text-[#71717A] group-hover:text-[#D4D4D8]"}`}>
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#71717A] truncate max-w-[95%] font-medium">
                        {project.shortDescription || "Hover to loop preview metrics or click to expand context."}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#71717A] font-mono shrink-0 group-hover:text-[#06B6D4] transition-colors">
                      View →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame - Premium Product Dashboard Preview Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setHoveredImageIndex(0);
                }}
                onClick={() => {
                  setSelectedProject(activeProject);
                  handleProjectClick(activeProject.portfolioId, activeProject.id);
                }}
                className="w-full bg-[#111113]/80 border border-[#18181B] rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.02)] min-h-[500px] cursor-pointer group"
              >
                <div>
                  {/* Dashboard Visual Frame Box */}
                  <div className="w-full h-68 rounded-2xl overflow-hidden bg-[#18181B] relative mb-6 border border-[#18181B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    <img 
                      src={getProjectImage(activeProject, activeIndex)} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-5 left-5 flex flex-col gap-1.5 text-left">
                      <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                        {activeProject.title}
                      </h3>
                      {activeProject.images?.length > 1 && isPaused && (
                        <div className="flex gap-1.5 mt-1">
                          {activeProject.images.map((_: any, i: number) => (
                            <span 
                              key={i} 
                              className={`h-1 w-5 rounded-full transition-all duration-300 ${
                                i === hoveredImageIndex ? "bg-[#6366F1]" : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeProject.techStack?.length > 0 && (
                    <div className="space-y-2.5 text-left">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#71717A] font-semibold">Engine Build Specs</div>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-[#18181B] border border-[#18181B] text-xs font-medium text-[#D4D4D8] font-mono shadow-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#18181B] flex items-center justify-end gap-3.5" onClick={(e) => e.stopPropagation()}>
                  {activeProject.githubUrl && (
                    <a 
                      href={activeProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181B] border border-[#18181B] hover:border-[#71717A]/30 text-xs font-semibold text-[#D4D4D8] hover:text-white transition-all shadow-sm"
                    >
                      <FolderGit2 className="w-4 h-4 text-[#71717A]" /> Codebase
                    </a>
                  )}
                  {activeProject.liveUrl && (
                    <a 
                      href={activeProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(99,102,241,0.2)] border border-white/10"
                    >
                      Launch SaaS <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {projects.length > 6 && (
        <div className="w-full text-center mt-16 md:mt-24 relative z-10 px-6">
          <Link
            href={`/${username}/projects`}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#111113] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold font-sans tracking-wide text-[#D4D4D8] hover:text-white transition-all duration-300 backdrop-blur-md shadow-lg"
          >
            Open Complete Index
            <Compass className="w-4 h-4 text-[#06B6D4]" />
          </Link>
        </div>
      )}

      {/* MODAL REDESIGN: FULL FEATURE PRODUCT OVERVIEW DIALOG */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-3xl bg-[#111113] border border-[#18181B] rounded-2xl overflow-y-auto max-h-[85vh] text-left shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-52 sm:h-80 bg-[#18181B] relative border-b border-[#18181B]">
                <img 
                  src={getProjectImage(selectedProject, validProjects.indexOf(selectedProject))} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                  <span className="px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold tracking-wider uppercase mb-2 inline-block font-mono">
                    {selectedProject.category || "Application Frame Infrastructure"}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-sans">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0A0A0B]/60 border border-[#18181B] shadow-inner">
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Role Matrix</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 font-sans">{selectedProject.role || "Lead Engineer"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Lifecycle</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 font-sans">{selectedProject.status || "Production Release"}</div>
                  </div>
                  {selectedProject.metrics?.length > 0 && (
                    <div className="sm:col-span-2">
                      <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                        Key Metric Achievements
                      </div>
                      <div className="flex flex-wrap gap-2.5 mt-1.5">
                        {selectedProject.metrics.map((metric: any) => (
                          <div key={metric.id} className="text-xs font-semibold text-[#06B6D4] flex items-center gap-1 bg-[#06B6D4]/5 px-2 py-0.5 rounded-md border border-[#06B6D4]/10">
                            <Sparkles className="w-3 h-3 text-[#06B6D4]" />
                            {metric.label}: {metric.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedProject.problemStatement && (
                    <div className="space-y-2 p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/30 text-left">
                      <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase flex items-center gap-1.5 font-mono">
                        <Target className="w-3.5 h-3.5 text-rose-500" /> Problem Domain Surface
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans">
                        {selectedProject.problemStatement}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="space-y-2 p-4 rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/5 text-left">
                      <h4 className="text-[11px] font-bold text-[#6366F1] tracking-wider uppercase flex items-center gap-1.5 font-mono">
                        <Cpu className="w-3.5 h-3.5 text-[#6366F1]" /> Resolution Architecture Matrix
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProject.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Functional Engineering Context</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {selectedProject.techStack?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Compilation Core Blueprint</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-[#0A0A0B] border border-[#18181B] text-xs font-medium text-[#D4D4D8] font-mono shadow-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-5 border-t border-[#18181B]">
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all active:scale-[0.98] border border-white/10 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Deployment Hub
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0B] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] text-[#D4D4D8]"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-[#71717A]" /> Source Tree Codebase
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a 
                      href={selectedProject.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0B] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] text-[#D4D4D8]"
                    >
                      Interactive Sandbox
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a 
                      href={selectedProject.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/20 text-[#06B6D4] text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Screening Walkthrough
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