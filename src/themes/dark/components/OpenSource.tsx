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
  Image as ImageIcon,
  Cpu,
  Radio,
  Terminal,
  Activity
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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      <style jsx global>{`
        @keyframes custom-scan-os {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .os-scanline-bar {
          animation: custom-scan-os 6s linear infinite;
        }
        .cyber-grid-os {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 3.5rem 3.5rem;
        }
      `}</style>

      {/* Cyberpunk Lab Decorative Canvas Grid & Aura */}
      <div className="absolute inset-0 cyber-grid-os pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_70%,rgba(0,229,255,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#7C3AED]/4 rounded-full filter blur-[100px] pointer-events-none" />

      {/* HUD Lab Header Block */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <GitPullRequest className="w-3.5 h-3.5 text-[#00FF9D]" />
              EXPERIMENTS_INDEX
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              // OPEN_SOURCE
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#7C3AED] animate-pulse" />
            <span>STREAM_STATUS: VERIFIED_UPLINK</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL FEED MATRIX */}
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
          animate={isMobileScrollable && !isMobilePaused && !selectedItem ? { y: [0, -420] } : false}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 22,
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((item: any, idx: number) => (
            <div
              key={`mob-${item.id || idx}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className="w-full h-[76px] bg-[#050816] border border-neutral-800 active:border-[#00E5FF] p-3.5 flex items-center gap-4 shrink-0 cursor-pointer relative"
            >
              <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-[#00E5FF]" />
              <div className="w-12 h-12 rounded-none bg-[#0B1120] border border-neutral-800 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-[#00E5FF]">
                [{String((sortedOS.indexOf(item) % sortedOS.length) + 1).padStart(2, '0')}]
              </div>
              <div className="flex-1 min-w-0 text-left space-y-0.5">
                <h3 className="font-bold font-mono text-xs text-white truncate uppercase tracking-wide">{item.repositoryName}</h3>
                <p className="text-[10px] font-mono text-neutral-400 truncate">
                  // {item.contributionTitle || item.pullRequestTitle || "Upstream Repository Log"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT DUAL PANELS ASYMMETRICAL LABORATORY */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side Track: Programmatic List Scroller Loop */}
        <div className="lg:col-span-5 w-full flex flex-col justify-between space-y-4">
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between px-1 text-[10px] text-neutral-500 tracking-widest font-mono uppercase">
              <span>REPOSITORY_ARRAY ({sortedOS.length})</span>
              <span className="flex items-center gap-1.5 text-[#00FF9D] font-bold">
                <Cpu className="w-3.5 h-3.5 animate-spin duration-3000" /> AUTO_CYCLE_ACTIVE
              </span>
            </div>

            <div
              ref={verticalScrollContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-full max-h-[388px] overflow-y-auto pr-2 space-y-3 scrollbar-none border border-neutral-900 bg-[#0B1120]/40 p-3 rounded-none backdrop-blur-xl transition-all duration-300"
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
                    className={`w-full text-left p-4 rounded-none cursor-pointer transition-all duration-300 relative border h-[110px] flex flex-col justify-center ${
                      isCurrent
                        ? "bg-[#0B1120] border-[#00E5FF]/40 shadow-[0_0_25px_rgba(0,229,255,0.08)]"
                        : "bg-transparent border-neutral-900 hover:border-neutral-800 hover:bg-[#0B1120]/20"
                    }`}
                  >
                    {isCurrent && (
                      <motion.div
                        layoutId="osIndicatorLine"
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
                            {item.repositoryName}
                          </h3>
                        </div>
                        <p className="text-xs font-mono text-neutral-400 truncate max-w-[92%]">
                          {item.contributionTitle || item.pullRequestTitle || "Core Upstream Addition Log."}
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-widest shrink-0 transition-colors ${isCurrent ? "text-[#00E5FF]" : "text-neutral-600"}`}>
                        INSPECT //
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Frame: Holographic Lab Card Preview */}
        <div className="lg:col-span-7 w-full h-full min-h-[490px] flex items-stretch">
          <AnimatePresence mode="wait">
            {activeOS && (
              <motion.div
                key={activeOS.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(activeOS)}
                className="w-full bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/40 p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[490px] cursor-none group rounded-none"
              >
                {/* HUD Borders Accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7C3AED]" />

                <div>
                  <div className="w-full h-64 bg-[#050816] relative mb-6 border border-neutral-900 overflow-hidden mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500">
                    <img
                      src={getCoverImage(activeOS, activeIndex)}
                      alt={activeOS.repositoryName}
                      className="w-full h-full object-cover select-none filter contrast-125 saturate-150 transition-transform duration-700 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />
                    
                    {/* Laser Scanner Line Bar Over Image */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] os-scanline-bar pointer-events-none opacity-0 group-hover:opacity-100" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-20">
                      <div className="space-y-1 truncate max-w-[70%] text-left">
                        <h3 className="text-xl font-black font-mono text-white uppercase tracking-wider drop-shadow-md truncate">
                          {activeOS.repositoryName}
                        </h3>
                        {activeOS.contributionType && (
                          <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-widest bg-[#00E5FF]/10 px-2 py-0.5 border border-[#00E5FF]/20 inline-block">
                            TYPE: {activeOS.contributionType}
                          </span>
                        )}
                      </div>
                      
                      {activeOS.status && (
                        <span className="text-[9px] font-mono font-bold text-[#00FF9D] bg-[#050816]/90 border border-[#00FF9D]/30 px-2.5 py-1 uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                          {activeOS.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeOS.description && (
                    <p className="text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed line-clamp-4 text-left bg-[#050816] p-4 border border-neutral-900 group-hover:text-neutral-300 transition-colors">
                      // {activeOS.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-end gap-4 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                  {activeOS.linesChanged && (
                    <span className="text-[10px] text-neutral-500 mr-auto flex items-center gap-1.5 uppercase tracking-wider">
                      <Diff className="w-4 h-4 text-neutral-600" /> FOOTPRINT: <span className="text-[#7C3AED] font-bold">{activeOS.linesChanged}</span>
                    </span>
                  )}
                  {activeOS.repositoryUrl && (
                    <a
                      href={activeOS.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-mono font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                    >
                      REPOSITORY_TREE <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {openSource.length > 6 && (
        <div className="w-full text-center mt-12 md:mt-20 relative z-10 px-4">
          <Link
            href={`/${username}/opensource`}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 bg-[#0B1120] hover:bg-[#050816] border border-neutral-800 hover:border-neutral-600 text-[10px] sm:text-xs font-bold font-mono tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-all shadow-xl"
          >
            OPEN_COMPLETE_LEDGER_INDEX
            <Compass className="w-4 h-4 text-[#7C3AED]" />
          </Link>
        </div>
      )}

      {/* CINEMATIC PROGRESSIVE BLUR DETAIL MODAL ARRAY DISPLAY POPUP */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/95 z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative rounded-none overflow-y-auto max-h-[90vh] text-left scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Title Header Utility Frame */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">EXPERIMENT_INSPECTOR // CORE_FRAGMENT</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-48 sm:h-72 bg-[#050816] relative overflow-hidden flex items-end p-6 border-b border-neutral-900">
                <img
                  src={getCoverImage(selectedItem, sortedOS.indexOf(selectedItem))}
                  alt={selectedItem.repositoryName}
                  className="w-full h-full object-cover filter brightness-[0.25] saturate-150 mix-blend-luminosity absolute inset-0 z-0 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                
                {/* Panel blueprint patterns underlaid inside image header modal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

                <div className="relative z-20 w-full text-left">
                  <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[9px] font-mono uppercase tracking-[0.15em] inline-block mb-2">
                    {selectedItem.contributionType || "Ecosystem Kernel Contribution"}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black font-mono tracking-wide text-white uppercase drop-shadow-md">
                    {selectedItem.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 bg-[#0B1120]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#7C3AED]">
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5 text-[#7C3AED]" /> TELEMETRY_STATUS</div>
                    <div className="text-xs font-mono font-bold text-neutral-200 uppercase mt-0.5">
                      {selectedItem.status || "MERBED_PIPELINE"}
                    </div>
                  </div>
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00E5FF]">
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Diff className="w-3.5 h-3.5 text-[#00E5FF]" /> SYSTEM_FOOTPRINT</div>
                    <div className="text-xs font-mono font-bold text-neutral-200 mt-0.5 truncate uppercase">
                      {selectedItem.linesChanged || "0 LINES_ADJUSTED"}
                    </div>
                  </div>
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00FF9D]">
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#00FF9D]" /> PIPELINE_INDEX</div>
                    <div className="text-xs font-mono font-bold text-[#00FF9D] mt-0.5 uppercase">
                      IDX_NODE_#0{selectedItem.displayOrder ?? 0}
                    </div>
                  </div>
                </div>

                {(selectedItem.contributionTitle || selectedItem.pullRequestTitle || selectedItem.issueTitle) && (
                  <div className="p-4 bg-[#050816] border border-neutral-800 space-y-2.5 font-mono text-xs text-left">
                    {selectedItem.contributionTitle && (
                      <div className="flex items-start gap-2 text-neutral-200">
                        <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500 uppercase">OBJECTIVE:</span> {selectedItem.contributionTitle}</span>
                      </div>
                    )}
                    {selectedItem.pullRequestTitle && (
                      <div className="flex items-start gap-2 text-neutral-300">
                        <GitPullRequest className="w-3.5 h-3.5 text-[#00FF9D] mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500 uppercase">PR_TARGET:</span> {selectedItem.pullRequestTitle}</span>
                      </div>
                    )}
                    {selectedItem.issueTitle && (
                      <div className="flex items-start gap-2 text-neutral-300">
                        <CircleDot className="w-3.5 h-3.5 text-[#FF4D6D] mt-0.5 shrink-0" />
                        <span><span className="text-neutral-500 uppercase">RESOLVES_ISSUE:</span> {selectedItem.issueTitle}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> FUNCTIONAL_ENGINEERING_BREAKDOWN
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-mono whitespace-pre-line bg-[#050816] p-4 border border-neutral-800">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.impactMetrics?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> IMPACT_ANALYTICS_METRICS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.impactMetrics.map((metric: string, index: number) => (
                        <span key={index} className="px-3 py-1.5 bg-[#050816] border border-[#7C3AED]/30 text-[#7C3AED] text-[10px] font-mono uppercase tracking-wider">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.timeline?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> EXPERIMENT_TRACE_PROGRESS
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedItem.timeline.map((item: any, index: number) => (
                        <div key={item.id || index} className="border border-neutral-900 bg-[#050816] p-4 space-y-2 font-mono text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <strong className="font-bold text-[#F8FAFC] uppercase truncate">{item.milestone}</strong>
                            <span className="text-[10px] text-[#00E5FF] bg-[#00E5FF]/5 px-1.5 py-0.5 border border-[#00E5FF]/20 font-bold">{item.progress}%</span>
                          </div>
                          {item.description && <p className="text-[11px] text-neutral-400 font-sans font-light leading-normal line-clamp-2">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.architectureDiagrams?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <Workflow className="w-3.5 h-3.5 text-neutral-600" /> CORE_ARCHITECTURE_DIAGRAMS
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedItem.architectureDiagrams.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 border border-neutral-800 bg-[#050816] overflow-hidden relative group/img shadow-md">
                          <img src={image} alt="" className="w-full h-full object-cover select-none filter grayscale contrast-125 saturate-150 hover:grayscale-0 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.contributionScreenshots?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-600" /> UPSTREAM_EXECUTION_SCREENSHOTS
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedItem.contributionScreenshots.map((image: string, index: number) => (
                        <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 border border-neutral-800 bg-[#050816] overflow-hidden relative group/img shadow-md">
                          <img src={image} alt="" className="w-full h-full object-cover select-none filter grayscale contrast-125 saturate-150 hover:grayscale-0 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-neutral-900 font-mono text-xs">
                  {selectedItem.repositoryUrl && (
                    <a
                      href={selectedItem.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    >
                      <ExternalLink className="w-4 h-4" /> REPOSITORY_TREE_TUNNEL
                    </a>
                  )}
                  {selectedItem.pullRequestUrl && (
                    <a
                      href={selectedItem.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#050816] hover:bg-[#0B1120] border border-neutral-800 hover:border-neutral-600 text-neutral-300 font-bold uppercase tracking-widest transition-colors"
                    >
                      <GitPullRequest className="w-4 h-4 text-neutral-400" /> PULL_REQUEST_COMMIT
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