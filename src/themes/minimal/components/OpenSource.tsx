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
  const MOBILE_SPEED = 420 / 25; // Target distance over duration (Y-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedItem || !isMountedRef.current) return;

    const targetY = -420;
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
      className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200 select-none"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
              <GitPullRequest className="w-3.5 h-3.5" />
              06 / Public Ledger
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
              Open Source.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
      {/* ========================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3 touch-none"
          drag={isMobileScrollable ? "y" : false}
          dragConstraints={{ top: -420, bottom: 0 }}
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
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-none p-4 flex items-center gap-4 cursor-pointer shrink-0 text-left transition-colors hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 shrink-0 flex items-center justify-center font-mono text-[11px] font-bold text-gray-400">
                {String((sortedOS.indexOf(item) % sortedOS.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-[#111827] truncate font-sans uppercase">{item.repositoryName}</h3>
                <p className="text-[11px] font-sans text-gray-500 truncate mt-1">
                  {item.contributionTitle || item.pullRequestTitle || "Upstream Repository Log"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: EDITORIAL GRID LAYOUT */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Track: Programmatic Scroller */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-1 text-[11px] text-gray-400 tracking-wider font-mono uppercase font-bold">
            <span>Repository Array ({sortedOS.length})</span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <Workflow className="w-3.5 h-3.5" /> Auto-Cycle Syncing
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-none border border-gray-200 bg-[#FAFAFA] p-3 rounded-none text-left"
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
                  className={`w-full p-4 cursor-pointer transition-all duration-200 relative border rounded-none h-[110px] flex flex-col justify-center ${
                    isCurrent
                      ? "bg-white border-[#111827] shadow-md"
                      : "bg-transparent border-gray-200/60 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 truncate w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold ${isCurrent ? "text-[#111827]" : "text-gray-300"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-extrabold text-base tracking-tight font-sans uppercase truncate ${isCurrent ? "text-[#111827]" : "text-gray-500"}`}>
                          {item.repositoryName}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-[92%] font-normal font-sans">
                        {item.contributionTitle || item.pullRequestTitle || "Core Upstream Addition Log."}
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

        {/* Right Side Frame: Large Case-Study Style Preview Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[460px]">
          <AnimatePresence mode="wait">
            {activeOS && (
              <motion.div
                key={activeOS.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedItem(activeOS)}
                className="w-full bg-[#FAFAFA] border-b-2 border-gray-100 hover:border-[#111827] p-6 relative flex flex-col justify-between overflow-hidden shadow-sm min-h-[460px] cursor-pointer group text-left"
              >
                <div>
                  <div className="w-full h-64 rounded-none overflow-hidden bg-white relative mb-5 border border-gray-200">
                    <img
                      src={getCoverImage(activeOS, activeIndex)}
                      alt={activeOS.repositoryName}
                      className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.01]"
                    />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="space-y-0.5 truncate max-w-[70%] bg-white/95 border border-gray-200 px-3 py-1.5 text-left">
                        <h3 className="text-base font-extrabold text-[#111827] font-sans uppercase truncate">
                          {activeOS.repositoryName}
                        </h3>
                        {activeOS.contributionType && (
                          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                            TYPE: {activeOS.contributionType}
                          </p>
                        )}
                      </div>
                      
                      {activeOS.status && (
                        <span className="text-[10px] font-mono font-bold text-[#111827] bg-white border border-gray-200 rounded-none px-2.5 py-1 shrink-0 uppercase tracking-wider">
                          {activeOS.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeOS.description && (
                    <p className="text-sm text-gray-600 font-normal leading-relaxed line-clamp-3 font-sans px-1">
                      {activeOS.description}
                    </p>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-gray-200 flex items-center justify-between gap-3 px-1" onClick={(e) => e.stopPropagation()}>
                  {activeOS.linesChanged && (
                    <span className="text-xs text-gray-400 font-mono font-bold flex items-center gap-1.5">
                      <Diff className="w-3.5 h-3.5 text-gray-400" /> {activeOS.linesChanged}
                    </span>
                  )}
                  {activeOS.repositoryUrl && (
                    <a
                      href={activeOS.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111827] text-white hover:bg-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
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

      {sortedOS.length > 6 && (
        <div className="w-full text-center mt-12 md:mt-16 relative z-10 px-6">
          <Link
            href={`/${username}/opensource`}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#FAFAFA] border border-gray-200 hover:border-gray-900 text-xs font-mono font-bold tracking-widest uppercase text-gray-500 hover:text-[#111827] transition-colors rounded-none"
          >
            Open Complete Ledger Index
            <Compass className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      )}

      {/* SWISS TYPOGRAPHY POPUP DETAILS OVERLAY MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
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
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-48 sm:h-64 bg-[#FAFAFA] relative border-b border-gray-200">
                <img
                  src={getCoverImage(selectedItem, sortedOS.indexOf(selectedItem))}
                  alt={selectedItem.repositoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2.5 py-0.5 rounded-none bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold tracking-widest uppercase mb-2 inline-block font-mono">
                    {selectedItem.contributionType || "Ecosystem Kernel Contribution"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] font-sans uppercase">
                    {selectedItem.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAFAFA] border border-gray-200 font-sans">
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Status</div>
                    <div className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-gray-400" /> 
                      {selectedItem.status || "Merged"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Footprint</div>
                    <div className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1.5 truncate">
                      <Diff className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{selectedItem.linesChanged || "0 Lines"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Pipeline Node</div>
                    <div className="text-xs font-bold text-[#111827] mt-1 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      IDX_#0{selectedItem.displayOrder ?? 0}
                    </div>
                  </div>
                </div>

                {(selectedItem.contributionTitle || selectedItem.pullRequestTitle || selectedItem.issueTitle) && (
                  <div className="p-4 bg-[#FAFAFA] border border-gray-200 space-y-2.5 font-mono text-xs font-bold text-left">
                    {selectedItem.contributionTitle && (
                      <div className="flex items-start gap-2 text-gray-700">
                        <Sparkles className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span><span className="text-gray-400">OBJECTIVE:</span> {selectedItem.contributionTitle}</span>
                      </div>
                    )}
                    {selectedItem.pullRequestTitle && (
                      <div className="flex items-start gap-2 text-gray-700">
                        <GitPullRequest className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span><span className="text-gray-400">PR_TARGET:</span> {selectedItem.pullRequestTitle}</span>
                      </div>
                    )}
                    {selectedItem.issueTitle && (
                      <div className="flex items-start gap-2 text-gray-700">
                        <CircleDot className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span><span className="text-gray-400">RESOLVES_ISSUE:</span> {selectedItem.issueTitle}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Functional Breakdown</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal font-sans bg-[#FAFAFA] p-4 border border-gray-200/60 max-h-[160px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.impactMetrics?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Telemetry Impact Analytics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.impactMetrics.map((metric: string, index: number) => (
                        <span key={index} className="px-2.5 py-1 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-medium text-gray-700 font-mono">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.timeline?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Development Trace</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedItem.timeline.map((item: any, index: number) => (
                        <div key={item.id || index} className="border border-gray-200 bg-[#FAFAFA] p-3 rounded-none space-y-1 font-sans">
                          <div className="flex items-center justify-between gap-4">
                            <strong className="text-xs sm:text-sm font-extrabold text-[#111827] uppercase tracking-tight">{item.milestone}</strong>
                            <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-1.5 py-0.5 border border-gray-200">{item.progress}%</span>
                          </div>
                          {item.description && <p className="text-[11px] text-gray-500 font-normal leading-normal line-clamp-2">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.architectureDiagrams?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Workflow className="w-3.5 h-3.5 text-gray-400" /> Architecture Diagrams
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.architectureDiagrams.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 border border-gray-200 bg-[#FAFAFA] overflow-hidden relative shadow-sm">
                          <img src={image} alt="" className="w-full h-full object-cover select-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.contributionScreenshots?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Upstream Screenshots
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.contributionScreenshots.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 border border-gray-200 bg-[#FAFAFA] overflow-hidden relative shadow-sm">
                          <img src={image} alt="" className="w-full h-full object-cover select-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-gray-100">
                  {selectedItem.repositoryUrl && (
                    <a
                      href={selectedItem.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white hover:bg-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Global Repository Trees
                    </a>
                  )}
                  {selectedItem.pullRequestUrl && (
                    <a
                      href={selectedItem.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border border-gray-200 text-xs font-bold uppercase tracking-widest transition-colors text-gray-700 hover:bg-gray-100 rounded-none"
                    >
                      <GitPullRequest className="w-3.5 h-3.5 text-gray-400" /> Pull Request Commit
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