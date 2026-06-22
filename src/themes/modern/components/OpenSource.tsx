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

  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- MOBILE MARQUEE ANIMATION CONTROLLER ENGINE ---
  const mobileControls = useAnimation();
  const currentMobileY = useRef(0);
  const isDraggingMobile = useRef(false);
  const isMounted = useRef(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeOS = validOS[activeIndex] || null;

  // Desktop Scroll Pipeline
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

  // Mobile Marquee Loop System
  useEffect(() => {
    isMounted.current = true;

    if (isMobileScrollable && !selectedItem) {
      // Re-initiate loop from current position or starting clean
      startMobileMarquee(currentMobileY.current);
    } else {
      mobileControls.stop();
    }

    return () => {
      isMounted.current = false;
      mobileControls.stop();
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [isMobileScrollable, selectedItem]);

  const startMobileMarquee = async (fromY: number) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    
    if (!isMounted.current || isDraggingMobile.current || selectedItem || !isMobileScrollable) {
      return;
    }

    const totalDistance = -420;
    // Handle bounds cleanup gracefully
    let targetY = totalDistance;
    let baseFromY = fromY;

    if (baseFromY <= totalDistance) {
      baseFromY = 0;
    }

    const remainingDistance = Math.abs(targetY - baseFromY);
    const totalDuration = 25; // Constant speed matched to 25s for full loop length
    const dynamicDuration = (remainingDistance / Math.abs(totalDistance)) * totalDuration;

    try {
      // Force set to current layout position reference safely before sliding
      await mobileControls.set({ y: baseFromY });
      
      await mobileControls.start({
        y: targetY,
        transition: {
          duration: dynamicDuration,
          ease: "linear",
        },
      });

      if (isMounted.current && !isDraggingMobile.current) {
        currentMobileY.current = 0;
        // Recursive jump execution safely postponed out of animation promise loop stack
        animationTimeoutRef.current = setTimeout(() => {
          startMobileMarquee(0);
        }, 0);
      }
    } catch (e) {
      // Catch framework interruptions due to layout modifications or unmount cleanly
    }
  };

  if (!sortedOS.length) return null;

  const getCoverImage = (item: any, idx: number) => {
    return item?.coverImage || DEFAULT_OS_COVERS[idx % DEFAULT_OS_COVERS.length];
  };

  return (
    <section
      id="opensource"
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
    >
      {/* Premium SaaS Micro-Grid & Gradient Meshes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#8B5CF6]/5 to-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#8B5CF6] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <GitPullRequest className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Public Ledger Contributions
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Open Source<span className="text-[#06B6D4]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: SAAS MARQUEE CARD COMPONENT */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A0A0B] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3 touch-pan-y select-none"
          animate={mobileControls}
          drag={isMobileScrollable ? "y" : false}
          dragConstraints={{
            top: -420,
            bottom: 0
          }}
          dragElastic={0.05}
          onUpdate={(latest) => {
            currentMobileY.current = Number(latest.y) || 0;
          }}
          onDragStart={() => {
            isDraggingMobile.current = true;
            mobileControls.stop();
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
          }}
          onDragEnd={() => {
            isDraggingMobile.current = false;
            startMobileMarquee(currentMobileY.current);
          }}
        >
          {mobileMarqueeItems.map((item: any, idx: number) => (
            <div
              key={`mob-${item.id || idx}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className="w-full bg-[#111113] border border-[#18181B] active:border-[#8B5CF6]/50 rounded-xl p-4 flex items-center gap-4 shadow-xl shrink-0 cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#18181B] border border-[#18181B] shrink-0 flex items-center justify-center font-mono text-xs font-bold text-[#8B5CF6] shadow-inner">
                {String((sortedOS.indexOf(item) % sortedOS.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-white truncate font-sans">{item.repositoryName}</h3>
                <p className="text-[11px] font-sans text-[#71717A] truncate mt-1">
                  {item.contributionTitle || item.pullRequestTitle || "Upstream Repository Log"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: PREMIUM SAAS SPLIT WORKSPACE */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Track: Programmatic Stream Registry */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-2 text-[11px] text-[#71717A] tracking-wider font-mono uppercase font-semibold">
            <span>Repository Array ({sortedOS.length})</span>
            <span className="flex items-center gap-1.5 text-[#6366F1] font-bold">
              <Workflow className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Pipeline Synced
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[420px] overflow-y-auto pr-2 space-y-3 scrollbar-none border border-[#18181B] bg-[#111113]/40 p-3 rounded-2xl backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
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
                  className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-300 relative border group h-[105px] flex flex-col justify-center ${
                    isCurrent
                      ? "bg-[#18181B]/80 border-[#8B5CF6]/40 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "bg-transparent border-transparent hover:border-[#18181B] hover:bg-[#111113]/50"
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="osIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#8B5CF6] to-[#6366F1]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 truncate w-full">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono font-bold ${isCurrent ? "text-[#8B5CF6]" : "text-[#71717A]"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-bold text-base tracking-tight truncate font-sans ${isCurrent ? "text-white" : "text-[#71717A] group-hover:text-[#D4D4D8]"}`}>
                          {item.repositoryName}
                        </h3>
                      </div>
                      <p className="text-xs text-[#71717A] truncate max-w-[95%] font-medium">
                        {item.contributionTitle || item.pullRequestTitle || "Core Upstream Addition Log."}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#71717A] font-mono shrink-0 group-hover:text-[#06B6D4] transition-colors">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame: Premium Telemetry Display Widget */}
        <div className="lg:col-span-7 w-full h-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeOS && (
              <motion.div
                key={activeOS.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => setSelectedItem(activeOS)}
                className="w-full bg-[#111113]/80 border border-[#18181B] rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.02)] min-h-[500px] cursor-pointer group"
              >
                <div>
                  {/* Dashboard Header Banner Layout */}
                  <div className="w-full h-68 rounded-2xl overflow-hidden bg-[#18181B] relative mb-6 border border-[#18181B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    <img
                      src={getCoverImage(activeOS, activeIndex)}
                      alt={activeOS.repositoryName}
                      className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div className="space-y-1.5 truncate max-w-[75%] text-left">
                        <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                          {activeOS.repositoryName}
                        </h3>
                        {activeOS.contributionType && (
                          <p className="text-[11px] font-mono font-semibold text-[#8B5CF6] uppercase tracking-wider">
                            TYPE: {activeOS.contributionType}
                          </p>
                        )}
                      </div>
                      
                      {activeOS.status && (
                        <span className="text-[10px] font-mono font-bold text-white bg-[#111113]/90 border border-[#18181B] rounded-lg px-3 py-1 backdrop-blur-md shrink-0 uppercase tracking-wide shadow-sm">
                          {activeOS.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeOS.description && (
                    <p className="text-sm text-[#D4D4D8] font-normal leading-relaxed line-clamp-3 font-sans text-left text-justify md:text-left [text-wrap:balance]">
                      {activeOS.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#18181B] flex items-center justify-end gap-3.5" onClick={(e) => e.stopPropagation()}>
                  {activeOS.linesChanged && (
                    <span className="text-xs font-semibold text-[#71717A] font-mono mr-auto flex items-center gap-1.5 bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#18181B]">
                      <Diff className="w-3.5 h-3.5 text-[#6366F1]" /> {activeOS.linesChanged}
                    </span>
                  )}
                  {activeOS.repositoryUrl && (
                    <a
                      href={activeOS.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(99,102,241,0.2)] border border-white/10"
                    >
                      Repository <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {openSource.length > 6 && (
        <div className="w-full text-center mt-16 md:mt-24 relative z-10 px-6">
          <Link
            href={`/${username}/opensource`}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#111113] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide text-[#D4D4D8] hover:text-white transition-all duration-300 backdrop-blur-md shadow-lg font-sans"
          >
            Open Complete Ledger Index
            <Compass className="w-4 h-4 text-[#06B6D4]" />
          </Link>
        </div>
      )}

      {/* MODAL REDESIGN: FULL MODULE COMPILATION PREVIEW HUD */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
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
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-52 sm:h-80 bg-[#18181B] relative border-b border-[#18181B]">
                <img
                  src={getCoverImage(selectedItem, sortedOS.indexOf(selectedItem))}
                  alt={selectedItem.repositoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                  <span className="px-2.5 py-1 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 text-[10px] font-bold tracking-wider uppercase mb-2 inline-block font-mono">
                    {selectedItem.contributionType || "Ecosystem Kernel Contribution"}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-sans">
                    {selectedItem.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0A0A0B]/60 border border-[#18181B] shadow-inner">
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Telemetry Status</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 flex items-center gap-2 font-sans">
                      <GitBranch className="w-4 h-4 text-[#8B5CF6]" /> 
                      {selectedItem.status || "Merged Pipeline"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">System Footprint</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 flex items-center gap-2 truncate font-sans">
                      <Diff className="w-4 h-4 text-[#6366F1] shrink-0" />
                      <span className="truncate">{selectedItem.linesChanged || "0 Lines Adjusted"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Display Pipeline</div>
                    <div className="text-sm font-bold text-[#06B6D4] mt-1 flex items-center gap-2 font-mono">
                      <Calendar className="w-4 h-4" />
                      IDX_NODE_#0{selectedItem.displayOrder ?? 0}
                    </div>
                  </div>
                </div>

                {(selectedItem.contributionTitle || selectedItem.pullRequestTitle || selectedItem.issueTitle) && (
                  <div className="p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/40 space-y-2.5 font-mono text-xs">
                    {selectedItem.contributionTitle && (
                      <div className="flex items-start gap-2.5 text-[#D4D4D8]">
                        <Sparkles className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
                        <span><span className="text-[#71717A] font-semibold">OBJECTIVE:</span> {selectedItem.contributionTitle}</span>
                      </div>
                    )}
                    {selectedItem.pullRequestTitle && (
                      <div className="flex items-start gap-2.5 text-[#D4D4D8]">
                        <GitPullRequest className="w-4 h-4 text-[#06B6D4] mt-0.5 shrink-0" />
                        <span><span className="text-[#71717A] font-semibold">PR_TARGET:</span> {selectedItem.pullRequestTitle}</span>
                      </div>
                    )}
                    {selectedItem.issueTitle && (
                      <div className="flex items-start gap-2.5 text-[#D4D4D8]">
                        <CircleDot className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                        <span><span className="text-[#71717A] font-semibold">RESOLVES_ISSUE:</span> {selectedItem.issueTitle}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Functional Engineering Breakdown</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans bg-[#0A0A0B]/40 p-4 rounded-xl border border-[#18181B]">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.impactMetrics?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Telemetry Impact Analytics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.impactMetrics.map((metric: string, index: number) => (
                        <span key={index} className="px-3 py-1 rounded-md bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-xs font-semibold text-[#8B5CF6] font-mono shadow-sm">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.timeline?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Development Trace Progress</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedItem.timeline.map((item: any, index: number) => (
                        <div key={item.id || index} className="border border-[#18181B] bg-[#0A0A0B]/20 p-3.5 rounded-xl space-y-1.5 font-sans">
                          <div className="flex items-center justify-between gap-4">
                            <strong className="text-xs sm:text-sm font-bold text-white truncate">{item.milestone}</strong>
                            <span className="text-[10px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/5 px-2 py-0.5 rounded border border-[#8B5CF6]/10">{item.progress}%</span>
                          </div>
                          {item.description && <p className="text-xs text-[#71717A] font-medium leading-normal line-clamp-2">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.architectureDiagrams?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <Workflow className="w-4 h-4 text-[#71717A]" /> Architecture Diagrams
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedItem.architectureDiagrams.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#18181B] bg-[#0A0A0B] overflow-hidden relative shadow-inner group/img">
                          <img src={image} alt="" className="w-full h-full object-cover select-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.contributionScreenshots?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#71717A]" /> Upstream Screenshots
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedItem.contributionScreenshots.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#18181B] bg-[#0A0A0B] overflow-hidden relative shadow-inner group/img">
                          <img src={image} alt="" className="w-full h-full object-cover select-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-5 border-t border-[#18181B]">
                  {selectedItem.repositoryUrl && (
                    <a
                      href={selectedItem.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all active:scale-[0.98] border border-white/10 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Global Repository Trees
                    </a>
                  )}
                  {selectedItem.pullRequestUrl && (
                    <a
                      href={selectedItem.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0B] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] text-[#D4D4D8]"
                    >
                      <GitPullRequest className="w-3.5 h-3.5 text-[#71717A]" /> Pull Request Commit
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