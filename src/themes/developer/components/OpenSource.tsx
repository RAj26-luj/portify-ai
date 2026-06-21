"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitPullRequest,
  ExternalLink,
  GitBranch,
  Calendar,
  Workflow,
  Sparkles,
  X,
  Compass,
  CircleDot,
  Diff,
  Terminal,
  Cpu,
  Image as ImageIcon,
} from "lucide-react";

const DEFAULT_OS_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
];

interface OpenSourceProps {
  openSource?: any[];
  username: string;
}

export default function OpenSource({ openSource = [], username }: OpenSourceProps) {
  const sortedOS = React.useMemo(() => {
    if (!openSource || openSource.length === 0) return [];
    return [...openSource].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [openSource]);

  const isMobileScrollable = sortedOS.length > 1;

  // Replicate array maps to sustain fluid looping thresholds on mobile frames
  const mobileMarqueeItems = React.useMemo(() => {
    if (sortedOS.length === 0) return [];
    if (!isMobileScrollable) return sortedOS;
    let items = [...sortedOS];
    while (items.length < 9) {
      items = [...items, ...sortedOS];
    }
    return items;
  }, [sortedOS, isMobileScrollable]);

  const validOS = React.useMemo(() => {
    if (sortedOS.length === 0) return [];
    let items = [...sortedOS];
    while (items.length < 3) {
      items = [...items, ...sortedOS];
    }
    return items;
  }, [sortedOS]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeOS = validOS[activeIndex] || null;

  useEffect(() => {
    if (validOS.length <= 1 || isPaused || selectedItem) {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
      return;
    }

    autoScrollTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % validOS.length;

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
  }, [validOS, isPaused, selectedItem]);

  if (!sortedOS.length) return null;

  const getCoverImage = (item: any, idx: number) => {
    return item?.coverImage || DEFAULT_OS_COVERS[idx % DEFAULT_OS_COVERS.length];
  };

  return (
    <section
      id="opensource"
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Background Matrix Mesh Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Terminal View Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Repositories</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">upstream-contributions.md</span>
          </div>
          <div className="flex items-center gap-1">
            <GitPullRequest className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> pull-requests --list --state=merged
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL LOOP MARQUEE */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative border-x border-b border-[#30363D] bg-[#161B22]/20 rounded-b-lg"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0D1117] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0D1117] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-2.5"
          animate={isMobileScrollable && !isMobilePaused && !selectedItem ? { y: [0, -400] } : false}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((item: any, idx: number) => (
            <div
              key={`mob-${item.id || idx}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className="w-full h-[70px] bg-[#161B22] border border-[#30363D] active:border-[#58A6FF] rounded-lg p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
            >
              <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] shrink-0 flex items-center justify-center text-[10px] text-[#58A6FF]">
                #{String((sortedOS.indexOf(item) % sortedOS.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-bold text-xs text-white truncate">{item.repositoryName}</h3>
                <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                  {item.contributionTitle || item.pullRequestTitle || "Upstream Repository Log"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT DUAL PANELS SLIDER */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Track: Programmatic List Scroller Loop */}
        <div className="lg:col-span-5 w-full space-y-3">
          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500 tracking-tight">
            <span>index: repositories ({sortedOS.length})</span>
            <span className="flex items-center gap-1 text-[#7EE787]">
              <Workflow className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> live_buffer
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[380px] overflow-y-auto pr-2 space-y-2 border border-[#30363D] bg-[#161B22]/30 p-2 rounded-lg"
            style={{ scrollSnapType: "y mandatory" }}
          >
            {validOS.slice(0, 6).map((item: any, idx: number) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    setActiveIndex(idx);
                    setSelectedItem(item);
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
                      layoutId="osIndicatorLine"
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
                          {item.repositoryName}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 truncate max-w-[92%] font-sans">
                        {item.contributionTitle || item.pullRequestTitle || "Core Upstream Addition Log."}
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

        {/* Right Side Frame: Preview Base Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[440px]">
          <AnimatePresence mode="wait">
            {activeOS && (
              <motion.div
                key={activeOS.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedItem(activeOS)}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-5 relative flex flex-col justify-between overflow-hidden shadow-md min-h-[440px] cursor-pointer hover:bg-[#1C2128]"
              >
                <div>
                  <div className="w-full h-56 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] relative mb-4">
                    <img
                      src={getCoverImage(activeOS, activeIndex)}
                      alt={activeOS.repositoryName}
                      className="w-full h-full object-cover select-none filter opacity-70 contrast-125 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div className="space-y-0.5 truncate max-w-[70%] text-left">
                        <h3 className="text-base font-bold text-white tracking-tight truncate">
                          {activeOS.repositoryName}
                        </h3>
                        {activeOS.contributionType && (
                          <p className="text-[10px] text-[#58A6FF] uppercase tracking-wider">
                            branch:{activeOS.contributionType.toLowerCase().replace(/\s+/g, "-")}
                          </p>
                        )}
                      </div>
                      
                      {activeOS.status && (
                        <span className="text-[9px] font-bold text-neutral-300 bg-[#0D1117] border border-[#30363D] rounded px-2 py-0.5 shrink-0">
                          {activeOS.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeOS.description && (
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-4 font-sans text-left">
                      {activeOS.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#30363D] flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  {activeOS.linesChanged && (
                    <span className="text-xs text-neutral-500 mr-auto flex items-center gap-1.5">
                      <Diff className="w-3.5 h-3.5 text-neutral-600" /> {activeOS.linesChanged}
                    </span>
                  )}
                  {activeOS.repositoryUrl && (
                    <a
                      href={activeOS.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-white transition-colors"
                    >
                      Repository <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {sortedOS.length > 6 && (
        <div className="w-full text-center mt-10 relative z-10 px-4">
          <Link
            href={`/${username}/opensource`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            Open Complete Ledger Index
            <Compass className="w-3.5 h-3.5 text-[#58A6FF]" />
          </Link>
        </div>
      )}

      {/* CINEMATIC PROGRESSIVE BLUR DETAIL MODAL ARRAY DISPLAY POPUP */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D1117]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#161B22] border border-[#30363D] rounded-xl overflow-y-auto max-h-[90vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Inspector Control Bar Buttons */}
              <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3 bg-[#1C2128]">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu size={12} className="text-[#F78166]" />
                  <span className="text-neutral-400 font-bold">repo_inspector.sh</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-full h-36 bg-[#0D1117] relative border-b border-[#30363D]">
                <img
                  src={getCoverImage(selectedItem, sortedOS.indexOf(selectedItem))}
                  alt={selectedItem.repositoryName}
                  className="w-full h-full object-cover filter opacity-30 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-1 inline-block">
                    {selectedItem.contributionType || "Ecosystem Kernel Contribution"}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                    {selectedItem.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Pipeline Status</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 font-bold">
                      <GitBranch className="w-3.5 h-3.5 text-neutral-500" /> 
                      {selectedItem.status || "Merged"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">System Footprint</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 truncate font-bold">
                      <Diff className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{selectedItem.linesChanged || "0 lines"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Registry Node</div>
                    <div className="text-xs text-[#7EE787] mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      IDX_0{selectedItem.displayOrder ?? 0}
                    </div>
                  </div>
                </div>

                {(selectedItem.contributionTitle || selectedItem.pullRequestTitle || selectedItem.issueTitle) && (
                  <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] space-y-2 text-[11px]">
                    {selectedItem.contributionTitle && (
                      <div className="flex items-start gap-2 text-[#C9D1D9]">
                        <Sparkles className="w-3.5 h-3.5 text-[#F78166] mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500 font-bold">OBJECTIVE:</span> {selectedItem.contributionTitle}</span>
                      </div>
                    )}
                    {selectedItem.pullRequestTitle && (
                      <div className="flex items-start gap-2 text-[#C9D1D9]">
                        <GitPullRequest className="w-3.5 h-3.5 text-[#7EE787] mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500 font-bold">PR_TARGET:</span> {selectedItem.pullRequestTitle}</span>
                      </div>
                    )}
                    {selectedItem.issueTitle && (
                      <div className="flex items-start gap-2 text-[#C9D1D9]">
                        <CircleDot className="w-3.5 h-3.5 text-[#F78166] mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500 font-bold">RESOLVES_ISSUE:</span> {selectedItem.issueTitle}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold">Functional Engineering Breakdown</h4>
                    <p className="text-xs leading-relaxed text-[#C9D1D9] bg-[#0D1117] p-3 rounded border border-[#30363D] font-sans">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.impactMetrics?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold">Telemetry Impact Analytics</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.impactMetrics.map((metric: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#7EE787]">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.timeline?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold">Development Trace Progress</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedItem.timeline.map((item: any, index: number) => (
                        <div key={item.id || index} className="border border-[#30363D] bg-[#0D1117] p-3 rounded space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <strong className="text-xs font-bold text-white truncate">{item.milestone}</strong>
                            <span className="text-[10px] text-[#58A6FF] bg-[#58A6FF]/5 px-1.5 py-0.5 rounded border border-[#58A6FF]/10">{item.progress}%</span>
                          </div>
                          {item.description && <p className="text-[11px] text-neutral-400 font-sans leading-normal line-clamp-2">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.architectureDiagrams?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <Workflow className="w-3.5 h-3.5 text-neutral-600" /> Architecture Diagrams
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.architectureDiagrams.map((image: string, index: number) => (
                        <div key={index} className="w-14 h-14 rounded border border-[#30363D] bg-[#0D1117] overflow-hidden relative shadow-sm">
                          <img src={image} alt="" className="w-full h-full object-cover select-none filter opacity-80" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.contributionScreenshots?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-600" /> Upstream Screenshots
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.contributionScreenshots.map((image: string, index: number) => (
                        <div key={index} className="w-14 h-14 rounded border border-[#30363D] bg-[#0D1117] overflow-hidden relative shadow-sm">
                          <img src={image} alt="" className="w-full h-full object-cover select-none filter opacity-80" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-[#30363D]">
                  {selectedItem.repositoryUrl && (
                    <a
                      href={selectedItem.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] font-bold text-white transition-colors text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" /> Global Repository Trees
                    </a>
                  )}
                  {selectedItem.pullRequestUrl && (
                    <a
                      href={selectedItem.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-neutral-300 transition-colors text-xs"
                    >
                      <GitPullRequest className="w-3.5 h-3.5 text-neutral-500" /> Pull Request Commit
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