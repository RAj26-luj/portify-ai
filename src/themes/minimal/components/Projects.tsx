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
      className="relative w-full py-16 md:py-24 bg-white text-[#111827] selection:bg-gray-200"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              04 / Showcase
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
              Selected Creations.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

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
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-none p-4 flex items-center gap-4 cursor-pointer shrink-0 text-left transition-colors hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 shrink-0 flex items-center justify-center font-mono text-[11px] font-bold text-gray-400">
                {String((sortedProjects.indexOf(project) % sortedProjects.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-[#111827] truncate font-sans uppercase">{project.title}</h3>
                {project.category && (
                  <p className="text-[11px] font-sans text-gray-500 truncate mt-1">{project.category}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: EDITORIAL CASE-STUDY PANEL ALTERNATION */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Track - Architectural Registry Index */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-1 text-[11px] text-gray-400 tracking-wider font-mono uppercase font-bold">
            <span>Index Registry ({projects.length})</span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <Workflow className="w-3.5 h-3.5" /> Auto-Cycle Active
            </span>
          </div>

          <div 
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredImageIndex(0);
            }}
            className="w-full max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-none border border-gray-200 bg-[#FAFAFA] p-3 rounded-none text-left"
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
                  className={`w-full p-4 cursor-pointer transition-all duration-200 relative border rounded-none h-[110px] flex flex-col justify-center ${
                    isCurrent 
                      ? "bg-white border-[#111827] shadow-md" 
                      : "bg-transparent border-transparent hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 truncate w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold ${isCurrent ? "text-[#111827]" : "text-gray-300"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-extrabold text-base tracking-tight font-sans uppercase truncate ${isCurrent ? "text-[#111827]" : "text-gray-500"}`}>
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-[92%] font-normal font-sans">
                        {project.shortDescription || "Inspect layout blueprint specifications or expand full context."}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400 shrink-0 uppercase tracking-wide">
                      View →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame - Large Case Study Screen Display */}
        <div className="lg:col-span-7 w-full h-full min-h-[460px]">
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                className="w-full bg-[#FAFAFA] border-b-2 border-gray-100 hover:border-[#111827] p-6 relative flex flex-col justify-between overflow-hidden shadow-sm min-h-[460px] cursor-pointer group text-left"
              >
                <div>
                  <div className="w-full h-64 rounded-none overflow-hidden bg-white relative mb-5 border border-gray-200">
                    <img 
                      src={getProjectImage(activeProject, activeIndex)} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.01]"
                    />
                    
                    <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 text-left bg-white/95 border border-gray-200 px-3 py-1.5">
                      <h3 className="text-base font-extrabold text-[#111827] font-sans uppercase tracking-tight">
                        {activeProject.title}
                      </h3>
                      {activeProject.images?.length > 1 && isPaused && (
                        <div className="flex gap-1 mt-0.5">
                          {activeProject.images.map((_: any, i: number) => (
                            <span 
                              key={i} 
                              className={`h-0.5 w-3 rounded-none transition-all ${
                                i === hoveredImageIndex ? "bg-[#111827]" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeProject.techStack?.length > 0 && (
                    <div className="space-y-2.5 text-left px-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold">Engine Build Specs</div>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-medium text-gray-700 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-gray-200 flex items-center justify-between gap-3 px-1" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wide">
                    Click card to view blueprint metrics
                  </span>
                  <div className="flex gap-3">
                    {activeProject.githubUrl && (
                      <a 
                        href={activeProject.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-gray-400 transition-colors rounded-none"
                      >
                        <FolderGit2 className="w-4 h-4 text-gray-400" /> Codebase
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a 
                        href={activeProject.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111827] text-white hover:bg-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                      >
                        Deployment <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {projects.length > 6 && (
        <div className="w-full text-center mt-12 md:mt-16 relative z-10 px-6">
          <Link
            href={`/${username}/projects`}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#FAFAFA] border border-gray-200 hover:border-gray-900 text-xs font-mono font-bold tracking-widest uppercase text-gray-500 hover:text-[#111827] transition-colors rounded-none"
          >
            Open Complete Index
            <Compass className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      )}

      {/* SWISS TYPOGRAPHY POPUP DETAILS MODAL DIALOG */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-none overflow-y-auto max-h-[85vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-48 sm:h-64 bg-[#FAFAFA] relative border-b border-gray-200">
                <img 
                  src={getProjectImage(selectedProject, validProjects.indexOf(selectedProject))} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2.5 py-0.5 rounded-none bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold tracking-widest uppercase mb-2 inline-block font-mono">
                    {selectedProject.category || "Application Frame Infrastructure"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] font-sans uppercase">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-[#FAFAFA] border border-gray-200 font-sans">
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Role Matrix</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">{selectedProject.role || "Lead Engineer"}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Lifecycle</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">{selectedProject.status || "Production"}</div>
                  </div>
                  {selectedProject.metrics?.length > 0 && (
                    <div className="sm:col-span-2 text-left">
                      <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Key Achievements
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">
                        {selectedProject.metrics.map((metric: any) => (
                          <div key={metric.id} className="text-xs font-bold text-[#111827] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-gray-400" />
                            {metric.label}: {metric.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.problemStatement && (
                    <div className="space-y-1.5 p-4 bg-[#FAFAFA] border border-gray-200 text-left">
                      <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-gray-400" /> Problem Domain Surface
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal">
                        {selectedProject.problemStatement}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="space-y-1.5 p-4 bg-[#FAFAFA] border border-gray-900/60 text-left">
                      <h4 className="text-[10px] font-mono font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-gray-400" /> Resolution Architecture Matrix
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-gray-700 font-normal">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProject.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Functional Engineering Context</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal whitespace-pre-line bg-[#FAFAFA] p-4 border border-gray-200/60">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {selectedProject.techStack?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Compilation Core Blueprint</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-[#FAFAFA] border border-gray-200 text-xs font-medium text-gray-700 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-gray-100">
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white hover:bg-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Deployment Hub
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border border-gray-200 text-xs font-bold tracking-wide transition-all text-gray-700 hover:bg-gray-100 rounded-none"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-gray-400" /> Source Tree Codebase
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a 
                      href={selectedProject.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border border-gray-200 text-xs font-bold tracking-wide transition-all text-gray-700 hover:bg-gray-100 rounded-none"
                    >
                      Interactive Sandbox
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a 
                      href={selectedProject.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border border-gray-900 text-xs font-bold tracking-wide transition-all text-[#111827] hover:bg-gray-50 rounded-none"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-gray-400" /> Screening Walkthrough
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