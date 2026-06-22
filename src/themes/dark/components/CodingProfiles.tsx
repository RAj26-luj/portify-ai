"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Terminal, ExternalLink, Flame, Trophy, Award, X, Workflow, Code, Radio, Cpu, Network } from "lucide-react";

const DEFAULT_PLATFORM_ICON = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop";

interface CodingProfilesProps {
  codingProfiles?: any[];
}

export default function CodingProfiles({ codingProfiles = [] }: CodingProfilesProps) {
  // 1. Declare all Hooks unconditionally at the top level
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 2. Perform all derivations inside top-level, unconditional useMemo Hooks
  const sortedProfiles = React.useMemo(() => {
    if (!codingProfiles?.length) return [];
    return [...codingProfiles].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [codingProfiles]);

  const isScrollable = sortedProfiles.length >= 4;
  const isMobileScrollable = sortedProfiles.length > 1;

  // Duplicate mobile items to maintain smooth rolling bounds on loop tracks
  const mobileMarqueeItems = React.useMemo(() => {
    if (sortedProfiles.length === 0) return [];
    if (!isMobileScrollable) return sortedProfiles;
    let items = [...sortedProfiles];
    while (items.length < 8) {
      items = [...items, ...sortedProfiles];
    }
    return items;
  }, [sortedProfiles, isMobileScrollable]);

  // Derive desktop marquee items safely inside a top-level useMemo Hook
  const marqueeItems = React.useMemo(() => {
    if (sortedProfiles.length === 0) return [];
    if (isScrollable) {
      let items = [...sortedProfiles];
      while (items.length < 5) {
        items = [...items, ...sortedProfiles];
      }
      return items;
    }
    return sortedProfiles;
  }, [sortedProfiles, isScrollable]);

  // --- MOBILE MARQUEE ANIMATION CONTROLLER ENGINE ---
  const mobileControls = useAnimation();
  const currentMobileX = useRef(0);
  const isDraggingMobile = useRef(false);
  const isMounted = useRef(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Marquee Loop System Life Cycle
  useEffect(() => {
    isMounted.current = true;

    if (isMobileScrollable && !selectedItem) {
      startMobileMarquee(currentMobileX.current);
    } else {
      mobileControls.stop();
    }

    return () => {
      isMounted.current = false;
      mobileControls.stop();
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [isMobileScrollable, selectedItem]);

  const startMobileMarquee = async (fromX: number) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    if (!isMounted.current || isDraggingMobile.current || selectedItem || !isMobileScrollable) {
      return;
    }

    const totalDistance = -1000;
    let targetX = totalDistance;
    let baseFromX = fromX;

    if (baseFromX <= totalDistance) {
      baseFromX = 0;
    }

    const remainingDistance = Math.abs(targetX - baseFromX);
    const totalDuration = 30; // Constant speed matched to original timeline design
    const dynamicDuration = (remainingDistance / Math.abs(totalDistance)) * totalDuration;

    try {
      await mobileControls.set({ x: baseFromX });

      await mobileControls.start({
        x: targetX,
        transition: {
          duration: dynamicDuration,
          ease: "linear",
        },
      });

      if (isMounted.current && !isDraggingMobile.current) {
        currentMobileX.current = 0;
        animationTimeoutRef.current = setTimeout(() => {
          startMobileMarquee(0);
        }, 0);
      }
    } catch (e) {
      // Gracefully capture execution thread stops upon unmount or interrupt flags
    }
  };

  // 3. Early conditional return clauses moved safely AFTER all Hook declarations
  if (!codingProfiles?.length) return null;

  return (
    <>
      <section
        id="codingprofiles"
        className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
      >
        <style jsx global>{`
          @keyframes cyber-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .cyber-grid-overlay {
            background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
            background-size: 3rem 3rem;
          }
          @keyframes matrix-pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.6; }
          }
          .matrix-glow {
            animation: matrix-pulse 4s ease-in-out infinite;
          }
        `}</style>

        {/* Neon Cyberpunk Background Architecture */}
        <div className="absolute inset-0 cyber-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.06),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full filter blur-[120px] pointer-events-none matrix-glow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                COMPETITIVE_TELEMETRY
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                // EXPERIMENTS_LOG
              </h2>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#00FF9D]/80">
              <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-ping" />
              <span>CORE_INDEX: ALGORITHMIC_DATABANK</span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED CONDUIT PIPELINE */}
        {/* ========================================== */}
        <div 
          className="block md:hidden w-full overflow-hidden py-4 bg-[#0B1120]/40 border-y border-neutral-800/60 select-none"
        >
          <motion.div 
            className="flex gap-4 px-4 w-max touch-pan-x"
            animate={mobileControls}
            drag={isMobileScrollable ? "x" : false}
            dragConstraints={{
              left: -1000,
              right: 0
            }}
            dragElastic={0.05}
            onUpdate={(latest) => {
              currentMobileX.current = Number(latest.x) || 0;
            }}
            onDragStart={() => {
              isDraggingMobile.current = true;
              mobileControls.stop();
              if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            }}
            onDragEnd={() => {
              isDraggingMobile.current = false;
              startMobileMarquee(currentMobileX.current);
            }}
          >
            {mobileMarqueeItems.map((item: any, idx: number) => (
              <div
                key={`mob-${item.id || idx}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="w-[260px] bg-[#0B1120] border border-neutral-800 active:border-[#00E5FF] rounded p-3.5 flex items-center gap-4 shadow-xl cursor-pointer shrink-0 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#00E5FF]" />
                
                {/* Micro logo platform block */}
                <div className="w-11 h-11 rounded bg-[#050816] border border-neutral-800 flex items-center justify-center p-2 shrink-0 mix-blend-luminosity">
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className="w-full h-full object-contain select-none" />
                  ) : (
                    <Code className="w-5 h-5 text-neutral-600" />
                  )}
                </div>

                {/* Platform info */}
                <div className="flex-1 min-w-0 text-left space-y-0.5">
                  <h3 className="font-bold font-mono text-xs text-white uppercase tracking-wider truncate">{item.platform}</h3>
                  <p className="text-[10px] font-mono text-neutral-400 truncate">@{item.username}</p>
                </div>

                {item.currentRating !== undefined && item.currentRating !== null && (
                  <div className="text-[10px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 border border-[#00E5FF]/20 rounded">
                    {item.currentRating}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* 2. DESKTOP VIEW: HOLOGRAPHIC LABORATORY TILES */}
        {/* ========================================== */}
        <div
          className={`hidden md:block relative w-full overflow-hidden py-8 ${isScrollable ? "group/track cursor-none" : ""}`}
          onMouseEnter={() => isScrollable && setIsPaused(true)}
          onMouseLeave={() => isScrollable && setIsPaused(false)}
        >
          {isScrollable && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050816] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050816] to-transparent z-20 pointer-events-none" />
            </>
          )}

          <motion.div
            className={
              isScrollable 
                ? "flex gap-8 whitespace-nowrap min-w-full w-max px-4" 
                : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            }
            animate={isScrollable && !isPaused && !selectedItem ? { x: [0, -2000] } : false}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45,
                ease: "linear"
              }
            }}
          >
            {marqueeItems.map((item: any, idx: number) => (
              <div
                key={`desk-${item.id}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className={`bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/50 p-6 rounded-none backdrop-blur-xl transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.4)] cursor-pointer hover:-translate-y-2 relative group/card ${
                  isScrollable ? "w-[360px] shrink-0 inline-block" : "w-full"
                }`}
              >
                {/* Tech Trim Framing */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-700 group-hover/card:border-[#00E5FF] transition-colors" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-700 group-hover/card:border-[#7C3AED] transition-colors" />

                <div className="w-full h-44 rounded bg-[#050816] mb-6 border border-neutral-900 group-hover/card:border-neutral-800 transition-colors relative flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  
                  {/* Hexagon Blueprint Matrix Decor */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00E5FF_1px,transparent_1px)] bg-[size:10px_10px]" />
                  
                  <img
                    src={item.iconUrl || DEFAULT_PLATFORM_ICON}
                    alt={item.platform}
                    className={`select-none transition-all duration-500 max-h-20 object-contain filter group-hover/card:brightness-110 ${
                      item.iconUrl ? "w-auto scale-100 group-hover/card:scale-110 group-hover/card:rotate-2" : "w-full h-full object-cover opacity-10"
                    }`}
                  />
                  {!item.iconUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-10 h-10 text-neutral-800" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-3 font-mono text-[9px] text-neutral-600 tracking-widest">
                    SYS_MODEL_LINK
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="truncate text-left space-y-1">
                    <h3 className="text-base font-black font-mono text-white uppercase tracking-wider truncate">
                      {item.platform}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 truncate">
                      // @{item.username}
                    </p>
                  </div>

                  {item.currentRating !== undefined && item.currentRating !== null && (
                    <span className="text-[11px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-3 py-1 rounded shrink-0 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                      <Flame className="w-3.5 h-3.5 text-[#00FF9D]" /> {item.currentRating}
                    </span>
                  )}
                </div>

                {(item.problemsSolved !== undefined || item.globalRank || item.rank) && (
                  <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-neutral-900 text-[10px] font-mono justify-start">
                    {item.problemsSolved !== undefined && item.problemsSolved !== null && (
                      <span className="text-[#F8FAFC] bg-[#050816] border border-neutral-800 px-2.5 py-1">
                        SOLVED: <span className="text-[#00FF9D] font-bold">{item.problemsSolved}</span>
                      </span>
                    )}
                    {(item.globalRank || item.rank) && (
                      <span className="text-neutral-400 bg-[#050816] border border-neutral-800 px-2.5 py-1">
                        RANK: <span className="text-[#7C3AED] font-bold">{item.globalRank || item.rank}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* IMMERSIVE POPUP DETAILS PROGRESSIVE OVERLAY MODAL */}
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
              className="w-full max-w-2xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_55px_rgba(0,229,255,0.15)] relative rounded-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Utility Frame Header */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">METRIC_READER // {selectedItem.platform?.toUpperCase()}</span>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-44 bg-[#050816] overflow-hidden flex items-center px-6 sm:px-8 border-b border-neutral-900">
                {/* Cyberpunk grid gridwork backdrop */}
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#00E5FF_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF_1px,transparent_1px)] bg-[size:1rem_1rem]" />
                
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <Network size={180} className="text-[#00E5FF]" />
                </div>

                <div className="flex items-center gap-5 relative z-10 w-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-[#0B1120] border border-neutral-800 flex items-center justify-center shrink-0 p-3 shadow-2xl">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.platform} className="w-full h-full object-contain" />
                    ) : (
                      <Terminal className="w-6 h-6 text-[#00E5FF]" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1 text-left">
                    <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[9px] font-mono uppercase tracking-[0.15em] inline-block">
                      TELEMETRY_NODE
                    </span>
                    <h3 className="text-xl sm:text-3xl font-black font-mono tracking-wide text-white uppercase truncate">
                      {selectedItem.platform}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-mono truncate">
                      // USER_ID: {selectedItem.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Blocks Grid */}
              <div className="p-6 sm:p-8 space-y-6 bg-[#0B1120]">
                <div className="grid grid-cols-2 gap-4">
                  {selectedItem.currentRating !== undefined && selectedItem.currentRating !== null && (
                    <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00E5FF] flex items-center gap-3">
                      <Flame className="w-5 h-5 text-[#00E5FF] shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">CURRENT_VAL</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">{selectedItem.currentRating}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.maxRating !== undefined && selectedItem.maxRating !== null && (
                    <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00FF9D] flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-[#00FF9D] shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">PEAK_SCORE</div>
                        <div className="text-base font-bold font-mono text-[#00FF9D] mt-0.5">{selectedItem.maxRating}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.problemsSolved !== undefined && selectedItem.problemsSolved !== null && (
                    <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#7C3AED] flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-[#7C3AED] shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">TASKS_COMPLETED</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">{selectedItem.problemsSolved}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.contestsAttended !== undefined && selectedItem.contestsAttended !== null && (
                    <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-neutral-400 flex items-center gap-3">
                      <Award className="w-5 h-5 text-neutral-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">CONTESTS_LOGGED</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">{selectedItem.contestsAttended}</div>
                      </div>
                    </div>
                  )}
                </div>

                {(selectedItem.globalRank || selectedItem.rank || selectedItem.activeSince) && (
                  <div className="p-4 bg-[#050816] border border-neutral-800 space-y-2.5 font-mono text-xs">
                    {selectedItem.globalRank && (
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>GLOBAL_METRIC_INDEX:</span>
                        <span className="text-[#00E5FF] font-bold">{selectedItem.globalRank}</span>
                      </div>
                    )}
                    {selectedItem.rank && (
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>CLASS_ASSIGNMENT_RANK:</span>
                        <span className="text-white font-bold">{selectedItem.rank}</span>
                      </div>
                    )}
                    {selectedItem.activeSince && (
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>STATION_INITIALIZED:</span>
                        <span className="text-[#7C3AED]">{selectedItem.activeSince}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Secure Uplink Button Row */}
                <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-neutral-500">
                  <div onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
                    {selectedItem.profileUrl && (
                      <a 
                        href={selectedItem.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-mono font-bold uppercase tracking-widest transition-colors"
                      >
                        LAUNCH_UPLINK_CONSOLE <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="flex items-center gap-2 justify-center sm:justify-start text-[10px] tracking-widest uppercase">
                    <Radio className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" /> SYSTEM_STREAM_SYNCHRONIZED
                  </span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}