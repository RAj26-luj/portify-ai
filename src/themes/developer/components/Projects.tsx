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
  Compass,
  GitBranch,
  Terminal,
  Diff
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

    const targetY = -400;
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
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Matrix Mesh Pattern Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* IDE Header Interface Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Repositories</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">active-projects.json</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> find ./production-builds -type f -name "*.config"
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL LOOP MARQUEE */}
      {/* ========================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative border-x border-b border-[#30363D] bg-[#161B22]/20 rounded-b-lg">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0D1117] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0D1117] to-transparent z-20 pointer-events-none" />

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
              className="w-full h-[70px] bg-[#161B22] border border-[#30363D] active:border-[#58A6FF] rounded-lg p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
            >
              <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] shrink-0 flex items-center justify-center text-[10px] text-[#58A6FF]">
                #{String((sortedProjects.indexOf(project) % sortedProjects.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-bold text-xs text-white truncate">{project.title}</h3>
                {project.category && (
                  <p className="text-[10px] text-neutral-500 truncate mt-0.5">{project.category}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT SIDE-BY-SIDE PANELS */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Track - Automated Infinite Loop Track */}
        <div className="lg:col-span-5 w-full space-y-3">
          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500 tracking-tight">
            <span>index: repositories ({projects.length})</span>
            <span className="flex items-center gap-1 text-[#7EE787]">
              <Workflow className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> live_buffer
            </span>
          </div>

          <div 
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredImageIndex(0);
            }}
            className="w-full max-h-[380px] overflow-y-auto pr-2 space-y-2 border border-[#30363D] bg-[#161B22]/30 p-2 rounded-lg"
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
                  className={`w-full text-left p-3.5 rounded border transition-all duration-150 relative group h-[90px] flex flex-col justify-center ${
                    isCurrent 
                      ? "bg-[#1C2128] border-[#58A6FF] shadow-sm" 
                      : "bg-transparent border-[#30363D]/60 hover:border-[#30363D] hover:bg-[#161B22]/40"
                  }`}
                >
                  {isCurrent && (
                    <motion.div 
                      layoutId="verticalIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#58A6FF]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 truncate w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] ${isCurrent ? "text-[#58A6FF] font-bold" : "text-neutral-600"}`}>
                          0{idx + 1}
                        </span>
                        <h3 className={`font-bold text-sm tracking-tight truncate ${isCurrent ? "text-white" : "text-[#C9D1D9] group-hover:text-white"}`}>
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 truncate max-w-[92%] font-sans">
                        {project.shortDescription || "Hover to compile metrics or explore the source configuration blueprint."}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 shrink-0 group-hover:text-[#58A6FF]">
                      cat →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame - Preview Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[440px]">
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setHoveredImageIndex(0);
                }}
                onClick={() => {
                  setSelectedProject(activeProject);
                  handleProjectClick(activeProject.portfolioId, activeProject.id);
                }}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-5 relative flex flex-col justify-between overflow-hidden shadow-md min-h-[440px] cursor-pointer hover:bg-[#1C2128]"
              >
                <div>
                  <div className="w-full h-56 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] relative mb-4">
                    <img 
                      src={getProjectImage(activeProject, activeIndex)} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover select-none filter opacity-70 contrast-125 mix-blend-luminosity transition-all duration-150"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 flex flex-col gap-1 text-left">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {activeProject.title}
                      </h3>
                      {activeProject.images?.length > 1 && isPaused && (
                        <div className="flex gap-1 mt-1">
                          {activeProject.images.map((_: any, i: number) => (
                            <span 
                              key={i} 
                              className={`h-0.5 w-3 rounded-full transition-all ${
                                i === hoveredImageIndex ? "bg-[#58A6FF]" : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeProject.techStack?.length > 0 && (
                    <div className="space-y-1.5 text-left">
                      <div className="text-[9px] text-neutral-500 uppercase font-bold">Engine Build Tech Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#30363D] flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  {activeProject.githubUrl && (
                    <a 
                      href={activeProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-white transition-colors"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-[#58A6FF]" /> Codebase
                    </a>
                  )}
                  {activeProject.liveUrl && (
                    <a 
                      href={activeProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-xs text-neutral-400 transition-colors"
                    >
                      Deployment <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {projects.length > 6 && (
        <div className="w-full text-center mt-10 relative z-10 px-4">
          <Link
            href={`/${username}/projects`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            Open Complete Index
            <Compass className="w-3.5 h-3.5 text-[#58A6FF]" />
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
            className="fixed inset-0 bg-[#0D1117]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#161B22] border border-[#30363D] rounded-xl overflow-y-auto max-h-[90vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Title Bar Controls */}
              <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3 bg-[#1C2128]">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu size={12} className="text-[#F78166]" />
                  <span className="text-neutral-400 font-bold">repository_inspector.sh</span>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-full h-36 bg-[#0D1117] relative border-b border-[#30363D]">
                <img 
                  src={getProjectImage(selectedProject, validProjects.indexOf(selectedProject))} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover filter opacity-30 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                    {selectedProject.category || "Application Frame Infrastructure"}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Role Matrix</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 font-bold">{selectedProject.role || "Lead Engineer"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Lifecycle</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 font-bold">{selectedProject.status || "Production Release"}</div>
                  </div>
                  {selectedProject.metrics?.length > 0 && (
                    <div className="sm:col-span-2">
                      <div className="text-[9px] text-neutral-500 uppercase font-bold">
                        Key Metric Achievements
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {selectedProject.metrics.map((metric: any) => (
                          <div key={metric.id} className="text-xs text-[#7EE787] flex items-center gap-1 font-bold">
                            <Sparkles className="w-3 h-3 text-[#F78166]" />
                            {metric.label}: {metric.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.problemStatement && (
                    <div className="space-y-1 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                      <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-[#F78166]" /> Problem Domain Surface
                      </h4>
                      <p className="text-xs text-[#C9D1D9] font-sans">
                        {selectedProject.problemStatement}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="space-y-1 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                      <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-[#7EE787]" /> Resolution Architecture Matrix
                      </h4>
                      <p className="text-xs text-[#C9D1D9] font-sans">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProject.description && (
                  <div className="space-y-1">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold">Functional Engineering Context</h4>
                    <p className="text-xs text-[#C9D1D9] font-sans whitespace-pre-line leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {selectedProject.techStack?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold">Compilation Core Blueprint</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-[#30363D]">
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] font-bold text-white transition-colors text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" /> Live Deployment Hub
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-neutral-300 transition-colors text-xs"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-neutral-500" /> Source Tree Codebase
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a 
                      href={selectedProject.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-neutral-300 transition-colors text-xs"
                    >
                      Interactive Sandbox
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a 
                      href={selectedProject.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#161B22] hover:bg-[#1C2128] border border-[#30363D] text-[#7EE787] text-xs transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-neutral-500" /> Screening Walkthrough
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