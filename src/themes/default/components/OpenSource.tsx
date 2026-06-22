"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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

  // Animation Controls & Refs for Mobile Interactive Infinite Marquee Track
  const mobileControls = useAnimation();
  const currentMobileY = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeOS = validOS[activeIndex] || null;

  // Constant speed calculation for uniform velocity on mobile tracking
  const MOBILE_SPEED = 400 / 25; // Target distance over duration (Y-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedItem || !isMountedRef.current) return;

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

    if (!isDraggingMobile.current && !selectedItem && isMountedRef.current) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isMobileScrollable && !selectedItem) {
      startMobileMarquee(currentMobileY.current);
    } else {
      mobileControls.stop();
    }
    return () => {
      mobileControls.stop();
      isMountedRef.current = false;
    };
  }, [isMobileScrollable, selectedItem]);

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
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      {/* Background Matrix Flare Aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(139,92,246,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <GitPullRequest className="w-3.5 h-3.5" />
              Public Ledger Contributions
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Open Source.
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
          {mobileMarqueeItems.map((item: any, idx: number) => (
            <div
              key={`mob-${item.id || idx}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className="w-full h-[70px] bg-[#07070b] border border-white/5 active:border-purple-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center font-mono text-[10px] text-purple-400">
                {String((sortedOS.indexOf(item) % sortedOS.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-xs text-white truncate">{item.repositoryName}</h3>
                <p className="text-[10px] font-sans text-neutral-500 truncate mt-0.5">
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
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Track: Programmatic List Scroller Loop */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-neutral-500 tracking-wider font-mono uppercase">
            <span>Repository Array ({sortedOS.length})</span>
            <span className="flex items-center gap-1 text-purple-400/80 animate-pulse">
              <Workflow className="w-3 h-3" /> Auto-Cycle Syncing
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[380px] overflow-y-auto pr-3 space-y-3 scrollbar-none border border-white/5 bg-white/[0.01] p-3 rounded-2xl backdrop-blur-xl transition-all duration-300"
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
                  className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-300 relative border group h-[100px] flex flex-col justify-center ${
                    isCurrent
                      ? "bg-gradient-to-r from-purple-950/20 to-white/[0.03] border-purple-500/40 shadow-xl shadow-purple-500/5"
                      : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="osIndicatorLine"
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
                          {item.repositoryName}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 truncate max-w-[90%] font-light">
                        {item.contributionTitle || item.pullRequestTitle || "Core Upstream Addition Log."}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono shrink-0 group-hover:text-purple-400 transition-colors">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame: Uncluttered Normal Preview Base Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[480px]">
          <AnimatePresence mode="wait">
            {activeOS && (
              <motion.div
                key={activeOS.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedItem(activeOS)}
                className="w-full bg-neutral-950 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[480px] cursor-pointer group"
              >
                <div>
                  <div className="w-full h-64 rounded-2xl overflow-hidden bg-neutral-900 relative mb-6 border border-white/5">
                    <img
                      src={getCoverImage(activeOS, activeIndex)}
                      alt={activeOS.repositoryName}
                      className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div className="space-y-0.5 truncate max-w-[70%] text-left">
                        <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md truncate">
                          {activeOS.repositoryName}
                        </h3>
                        {activeOS.contributionType && (
                          <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                            Type: {activeOS.contributionType}
                          </p>
                        )}
                      </div>
                      
                      {activeOS.status && (
                        <span className="text-[10px] font-mono font-medium text-neutral-300 bg-neutral-900/90 border border-white/10 rounded px-2.5 py-0.5 backdrop-blur-md shrink-0">
                          STATUS: {activeOS.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeOS.description && (
                    <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-3 font-sans text-left">
                      {activeOS.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  {activeOS.linesChanged && (
                    <span className="text-xs text-neutral-500 font-mono mr-auto flex items-center gap-1">
                      <Diff className="w-3.5 h-3.5 text-neutral-600" /> {activeOS.linesChanged}
                    </span>
                  )}
                  {activeOS.repositoryUrl && (
                    <a
                      href={activeOS.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all shadow-md shadow-white/5"
                    >
                      Repository <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {openSource.length > 6 && (
        <div className="w-full text-center mt-12 md:mt-16 relative z-10 px-4">
          <Link
            href={`/${username}/opensource`}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-white/10 text-[10px] sm:text-xs font-medium font-mono tracking-widest uppercase text-neutral-400 hover:text-white transition-all duration-300 backdrop-blur-md"
          >
            Open Complete Ledger Index
            <Compass className="w-4 h-4 text-purple-400" />
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
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-3xl bg-neutral-950 border border-white/10 rounded-2xl overflow-y-auto max-h-[90vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-44 sm:h-64 bg-neutral-900 relative">
                <img
                  src={getCoverImage(selectedItem, sortedOS.indexOf(selectedItem))}
                  alt={selectedItem.repositoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold tracking-wider uppercase mb-1.5 inline-block font-mono">
                    {selectedItem.contributionType || "Ecosystem Kernel Contribution"}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    {selectedItem.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Telemetry Status</div>
                    <div className="text-xs font-medium text-neutral-200 mt-0.5 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-purple-400" /> 
                      {selectedItem.status || "Merged Pipeline"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">System Footprint</div>
                    <div className="text-xs font-medium text-neutral-200 mt-0.5 flex items-center gap-1.5 truncate">
                      <Diff className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{selectedItem.linesChanged || "0 Lines Adjusted"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Display Pipeline</div>
                    <div className="text-xs font-medium text-purple-400 mt-0.5 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      IDX_NODE_#0{selectedItem.displayOrder ?? 0}
                    </div>
                  </div>
                </div>

                {(selectedItem.contributionTitle || selectedItem.pullRequestTitle || selectedItem.issueTitle) && (
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 font-mono text-[11px]">
                    {selectedItem.contributionTitle && (
                      <div className="flex items-start gap-2 text-neutral-200">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500">OBJECTIVE:</span> {selectedItem.contributionTitle}</span>
                      </div>
                    )}
                    {selectedItem.pullRequestTitle && (
                      <div className="flex items-start gap-2 text-neutral-300">
                        <GitPullRequest className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500">PR_TARGET:</span> {selectedItem.pullRequestTitle}</span>
                      </div>
                    )}
                    {selectedItem.issueTitle && (
                      <div className="flex items-start gap-2 text-neutral-300">
                        <CircleDot className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500">RESOLVES_ISSUE:</span> {selectedItem.issueTitle}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.description && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Functional Engineering Breakdown</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light whitespace-pre-line bg-white/[0.01] p-4 rounded-xl border border-white/5">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.impactMetrics?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Telemetry Impact Analytics</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.impactMetrics.map((metric: string, index: number) => (
                        <span key={index} className="px-2.5 py-1 rounded-md bg-purple-950/20 border border-purple-500/20 text-xs text-purple-400 font-mono">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.timeline?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Development Trace Progress</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedItem.timeline.map((item: any, index: number) => (
                        <div key={item.id || index} className="border border-white/5 bg-white/[0.01] p-3 rounded-xl space-y-1 font-sans">
                          <div className="flex items-center justify-between gap-4">
                            <strong className="text-xs sm:text-sm font-semibold text-neutral-200 truncate">{item.milestone}</strong>
                            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/20">{item.progress}%</span>
                          </div>
                          {item.description && <p className="text-[11px] text-neutral-400 font-light leading-normal line-clamp-2">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.architectureDiagrams?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono flex items-center gap-1">
                      <Workflow className="w-3.5 h-3.5 text-neutral-600" /> Architecture Diagrams
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedItem.architectureDiagrams.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-white/5 bg-neutral-900 overflow-hidden relative group/img shadow-md">
                          <img src={image} alt="" className="w-full h-full object-cover select-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.contributionScreenshots?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-600" /> Upstream Screenshots
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedItem.contributionScreenshots.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-white/5 bg-neutral-900 overflow-hidden relative group/img shadow-md">
                          <img src={image} alt="" className="w-full h-full object-cover select-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-white/5">
                  {selectedItem.repositoryUrl && (
                    <a
                      href={selectedItem.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Global Repository Trees
                    </a>
                  )}
                  {selectedItem.pullRequestUrl && (
                    <a
                      href={selectedItem.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium tracking-wide transition-all active:scale-[0.98] text-neutral-300"
                    >
                      <GitPullRequest className="w-3.5 h-3.5 text-neutral-400" /> Pull Request Commit
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