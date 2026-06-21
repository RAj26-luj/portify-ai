"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ExternalLink, Flame, Trophy, Award, X, Workflow, Code } from "lucide-react";

const DEFAULT_PLATFORM_ICON = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop";

interface CodingProfilesProps {
  codingProfiles?: any[];
}

export default function CodingProfiles({ codingProfiles = [] }: CodingProfilesProps) {
  if (!codingProfiles?.length) return null;

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  const sortedProfiles = React.useMemo(() => {
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

  const marqueeItems = isScrollable
    ? (() => {
        let items = [...sortedProfiles];
        while (items.length < 5) {
          items = [...items, ...sortedProfiles];
        }
        return items;
      })()
    : sortedProfiles;

  return (
    <>
      <section
        id="codingprofiles"
        className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.03),transparent_50%)] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
                <Terminal className="w-3.5 h-3.5" />
                Competitive Telemetry
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                Coding Profiles.
              </h2>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SLOW MINI-BARS */}
        {/* ========================================== */}
        <div 
          className="block md:hidden w-full overflow-hidden py-2"
          onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
          onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
          onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
          onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
        >
          <motion.div 
            className="flex gap-3 px-4 w-max"
            animate={isMobileScrollable && !isMobilePaused && !selectedItem ? { x: [0, -1000] } : false}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45, // Premium slow-motion glide speed
                ease: "linear"
              }
            }}
          >
            {mobileMarqueeItems.map((item: any, idx: number) => (
              <div
                key={`mob-${item.id || idx}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="w-[240px] bg-[#07070b] border border-white/5 active:border-purple-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md cursor-pointer shrink-0"
              >
                {/* Micro logo space block */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className="w-full h-full object-contain select-none" />
                  ) : (
                    <Code className="w-4 h-4 text-neutral-600" />
                  )}
                </div>
                {/* Title Context tracks */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-xs text-white truncate">{item.platform}</h3>
                  <p className="text-[10px] font-mono text-neutral-500 truncate">@{item.username}</p>
                </div>
                {item.currentRating !== undefined && item.currentRating !== null && (
                  <div className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/20 px-1.5 py-0.5 rounded border border-purple-500/10">
                    {item.currentRating}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* 2. DESKTOP VIEW: INFINITE SCROLLING MARQUEE */}
        {/* ========================================== */}
        <div
          className={`hidden md:block relative w-full overflow-hidden py-4 ${isScrollable ? "cursor-grab active:cursor-grabbing" : ""}`}
          onMouseEnter={() => isScrollable && setIsPaused(true)}
          onMouseLeave={() => isScrollable && setIsPaused(false)}
        >
          {isScrollable && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
            </>
          )}

          <motion.div
            className={
              isScrollable 
                ? "flex gap-6 whitespace-nowrap min-w-full w-max px-4" 
                : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
            }
            animate={isScrollable && !isPaused && !selectedItem ? { x: [0, -2000] } : false}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 55,
                ease: "linear"
              }
            }}
          >
            {marqueeItems.map((item: any, idx: number) => (
              <div
                key={`desk-${item.id}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className={`bg-[#07070b]/90 border border-white/5 hover:border-purple-500/40 p-5 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-xl cursor-pointer hover:-translate-y-0.5 overflow-hidden ${
                  isScrollable ? "w-[320px] sm:w-[380px] shrink-0 inline-block" : "w-full"
                }`}
              >
                <div className="w-full h-48 rounded-xl overflow-hidden bg-neutral-900 mb-5 border border-white/5 relative flex items-center justify-center p-8 bg-gradient-to-b from-white/[0.01] to-transparent">
                  <img
                    src={item.iconUrl || DEFAULT_PLATFORM_ICON}
                    alt={item.platform}
                    className={`select-none transition-transform duration-500 max-h-24 object-contain ${
                      item.iconUrl ? "w-auto scale-110" : "w-full h-full object-cover opacity-20 blur-xs"
                    }`}
                  />
                  {!item.iconUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="truncate text-left space-y-0.5">
                    <h3 className="text-base font-bold text-white tracking-wide truncate">
                      {item.platform}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 truncate">
                      @{item.username}
                    </p>
                  </div>

                  {item.currentRating !== undefined && item.currentRating !== null && (
                    <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-950/30 border border-purple-500/20 px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                      <Flame className="w-3 h-3 animate-pulse" /> {item.currentRating}
                    </span>
                  )}
                </div>

                {(item.problemsSolved !== undefined || item.globalRank || item.rank) && (
                  <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-white/5 text-[11px] font-mono justify-start">
                    {item.problemsSolved !== undefined && item.problemsSolved !== null && (
                      <span className="text-neutral-300 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-md">
                        Solved: {item.problemsSolved}
                      </span>
                    )}
                    {(item.globalRank || item.rank) && (
                      <span className="text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2.5 py-0.5 rounded-md">
                        Rank: {item.globalRank || item.rank}
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
              className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-44 sm:h-48 bg-neutral-900 overflow-hidden">
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md z-0" />
                <img
                  src={selectedItem.iconUrl || DEFAULT_PLATFORM_ICON}
                  alt=""
                  className="w-full h-full object-cover blur-md brightness-[0.2] scale-110 absolute inset-0 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-10" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center gap-4 z-20">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-white/10 bg-neutral-900/90 flex items-center justify-center shrink-0 shadow-lg p-2">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.platform} className="w-full h-full object-contain" />
                    ) : (
                      <Terminal className="w-5 h-5 text-purple-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-mono uppercase tracking-wider mb-1 inline-block">
                      Identity Node
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold tracking-wide text-white truncate">
                      {selectedItem.platform}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-mono truncate">
                      @{selectedItem.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-5 md:space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {selectedItem.currentRating !== undefined && selectedItem.currentRating !== null && (
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Rating</div>
                        <div className="text-sm font-bold text-neutral-200 mt-0.5">{selectedItem.currentRating}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.maxRating !== undefined && selectedItem.maxRating !== null && (
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Peak</div>
                        <div className="text-sm font-bold text-amber-400 mt-0.5">{selectedItem.maxRating}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.problemsSolved !== undefined && selectedItem.problemsSolved !== null && (
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-2.5">
                      <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Solved</div>
                        <div className="text-sm font-bold text-neutral-200 mt-0.5">{selectedItem.problemsSolved}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.contestsAttended !== undefined && selectedItem.contestsAttended !== null && (
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Contests</div>
                        <div className="text-sm font-bold text-neutral-200 mt-0.5">{selectedItem.contestsAttended}</div>
                      </div>
                    </div>
                  )}
                </div>

                {(selectedItem.globalRank || selectedItem.rank || selectedItem.activeSince) && (
                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] divide-y divide-white/5 font-mono text-[11px] space-y-2">
                    {selectedItem.globalRank && (
                      <div className="flex items-center justify-between text-neutral-400 pt-0">
                        <span>GLOBAL_RANK_INDEX:</span>
                        <span className="text-white font-bold">{selectedItem.globalRank}</span>
                      </div>
                    )}
                    {selectedItem.rank && (
                      <div className="flex items-center justify-between text-neutral-400 pt-2">
                        <span>CLASS_RANK:</span>
                        <span className="text-white font-bold">{selectedItem.rank}</span>
                      </div>
                    )}
                    {selectedItem.activeSince && (
                      <div className="flex items-center justify-between text-neutral-400 pt-2">
                        <span>ACTIVE_SINCE:</span>
                        <span className="text-neutral-300">{selectedItem.activeSince}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <div onClick={(e) => e.stopPropagation()}>
                    {selectedItem.profileUrl && (
                      <a 
                        href={selectedItem.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold font-sans transition-all active:scale-[0.98]"
                      >
                        Inspect Profile <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="opacity-30 flex items-center gap-1">
                    <Workflow className="w-3 h-3" /> CODE_SYNC
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