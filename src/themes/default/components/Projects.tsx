"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number>(0);
  
  // Animation Controls & Refs for Mobile Interactive Infinite Marquee Track
  const mobileControls = useAnimation();
  const currentMobileY = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProject = validProjects[activeIndex] || null;

  // Constant speed calculation for uniform velocity on mobile tracking
  const MOBILE_SPEED = 400 / 25; // Target distance over duration (Y-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedProject || !isMountedRef.current) return;

    let targetY = -400;
    // Boundary structural safety verification logic
    if (fromY <= targetY || fromY > 0) {
      fromY = 0;
      await mobileControls.set({ y: 0 });
    }

    const remainingDistance = Math.abs(targetY - fromY);
    const dynamicDuration = remainingDistance / MOBILE_SPEED;

    await mobileControls.start({
      y: targetY,
      transition: {
        duration: dynamicDuration,
        ease: "linear"
      }
    });

    if (!isDraggingMobile.current && !selectedProject && isMountedRef.current) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isMobileScrollable && !selectedProject) {
      startMobileMarquee(currentMobileY.current);
    } else {
      mobileControls.stop();
    }
    return () => {
      mobileControls.stop();
      isMountedRef.current = false;
    };
  }, [isMobileScrollable, selectedProject]);

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
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,51,234,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <FolderGit2 className="w-3.5 h-3.5" />
              Engine Showcase
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Selected Creations.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL LOOP MARQUEE */}
      {/* ========================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-2.5 touch-none"
          drag={isMobileScrollable ? "y" : false}
          dragConstraints={{ top: -400, bottom: 0 }}
          animate={mobileControls}
          onUpdate={(latest) => {
            currentMobileY.current = typeof latest.y === "number" ? latest.y : 0;
          }}
          onDragStart={() => {
            isDraggingMobile.current = true;
            mobileControls.stop();
          }}
          onDragEnd={() => {
            isDraggingMobile.current = false;
            startMobileMarquee(currentMobileY.current);
          }}
          onMouseEnter={() => {
            isDraggingMobile.current = true;
            mobileControls.stop();
          }}
          onMouseLeave={() => {
            isDraggingMobile.current = false;
            startMobileMarquee(currentMobileY.current);
          }}
        >
          {mobileMarqueeItems.map((project: any, idx: number) => (
            <div
              key={`mob-${project.id || idx}-${idx}`}
              onClick={() => {
                setSelectedProject(project);
                handleProjectClick(project.portfolioId, project.id);
              }}
              className="w-full h-[70px] bg-[#07070b] border border-white/5 active:border-purple-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center font-mono text-[10px] text-purple-400">
                {String((sortedProjects.indexOf(project) % sortedProjects.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-xs text-white truncate">{project.title}</h3>
                {project.category && (
                  <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{project.category}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT SIDE-BY-SIDE PANELS */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Track - Automated Infinite Loop Track */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-neutral-500 tracking-wider font-mono uppercase">
            <span>Index Registry ({projects.length})</span>
            <span className="flex items-center gap-1 text-purple-400/80 animate-pulse">
              <Workflow className="w-3 h-3" /> Auto-Cycle Active
            </span>
          </div>

          <div 
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredImageIndex(0);
            }}
            className="w-full max-h-[380px] overflow-y-auto pr-3 space-y-3 scrollbar-none border border-white/5 bg-white/[0.01] p-3 rounded-2xl backdrop-blur-xl transition-all duration-300"
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
                  className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-300 relative border group h-[100px] flex flex-col justify-center ${
                    isCurrent 
                      ? "bg-gradient-to-r from-purple-950/20 to-white/[0.03] border-purple-500/40 shadow-xl shadow-purple-500/5" 
                      : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {isCurrent && (
                    <motion.div 
                      layoutId="verticalIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 rounded-l-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 truncate w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono ${isCurrent ? "text-purple-400" : "text-neutral-600"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-semibold text-base tracking-wide truncate ${isCurrent ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}>
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 truncate max-w-[90%] font-light">
                        {project.shortDescription || "Hover to loop preview metrics or click to expand context."}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono shrink-0 group-hover:text-purple-400 transition-colors">
                      Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame - Preview Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[480px]">
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setHoveredImageIndex(0);
                }}
                onClick={() => {
                  setSelectedProject(activeProject);
                  handleProjectClick(activeProject.portfolioId, activeProject.id);
                }}
                className="w-full bg-neutral-950 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[480px] cursor-pointer group"
              >
                <div>
                  <div className="w-full h-64 rounded-2xl overflow-hidden bg-neutral-900 relative mb-6 border border-white/5">
                    <img 
                      src={getProjectImage(activeProject, activeIndex)} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover select-none transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-left">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {activeProject.title}
                      </h3>
                      {activeProject.images?.length > 1 && isPaused && (
                        <div className="flex gap-1 mt-1">
                          {activeProject.images.map((_: any, i: number) => (
                            <span 
                              key={i} 
                              className={`h-1 w-4 rounded-full transition-all ${
                                i === hoveredImageIndex ? "bg-purple-500" : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeProject.techStack?.length > 0 && (
                    <div className="space-y-2 text-left">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Engine Build Specs</div>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-neutral-300 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  {activeProject.githubUrl && (
                    <a 
                      href={activeProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <FolderGit2 className="w-4 h-4" /> Codebase
                    </a>
                  )}
                  {activeProject.liveUrl && (
                    <a 
                      href={activeProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all"
                    >
                      Deployment <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {projects.length > 6 && (
        <div className="w-full text-center mt-12 md:mt-16 relative z-10 px-4">
          <Link
            href={`/${username}/projects`}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-white/10 text-[10px] sm:text-xs font-medium font-mono tracking-widest uppercase text-neutral-400 hover:text-white transition-all duration-300 backdrop-blur-md"
          >
            Open Complete Index
            <Compass className="w-4 h-4 text-purple-400" />
          </Link>
        </div>
      )}

      {/* Pop-up Details Modal Layer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-3xl bg-neutral-950 border border-white/10 rounded-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-44 sm:h-72 bg-neutral-900 relative">
                <img 
                  src={getProjectImage(selectedProject, validProjects.indexOf(selectedProject))} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold tracking-wider uppercase mb-1.5 inline-block">
                    {selectedProject.category || "Application Frame Infrastructure"}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider">Role Matrix</div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-300 mt-0.5">{selectedProject.role || "Lead Engineer"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider">Lifecycle</div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-300 mt-0.5">{selectedProject.status || "Production Release"}</div>
                  </div>
                  {selectedProject.metrics?.length > 0 && (
                    <div className="sm:col-span-2">
                      <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider">
                        Key Metric Achievements
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {selectedProject.metrics.map((metric: any) => (
                          <div key={metric.id} className="text-xs font-medium text-purple-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {metric.label}: {metric.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.problemStatement && (
                    <div className="space-y-1.5 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                      <h4 className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-red-400" /> Problem Domain Surface
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light">
                        {selectedProject.problemStatement}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="space-y-1.5 p-4 rounded-xl border border-purple-500/10 bg-purple-500/[0.01]">
                      <h4 className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" /> Resolution Architecture Matrix
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProject.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase">Functional Engineering Context</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {selectedProject.techStack?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase">Compilation Core Blueprint</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-neutral-300 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-white/5">
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Deployment Hub
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium tracking-wide transition-all active:scale-[0.98] text-neutral-300"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-neutral-400" /> Source Tree Codebase
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a 
                      href={selectedProject.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium tracking-wide transition-all active:scale-[0.98] text-neutral-300"
                    >
                      Interactive Sandbox
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a 
                      href={selectedProject.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs font-medium tracking-wide transition-all active:scale-[0.98]"
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