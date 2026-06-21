"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ExternalLink, Flame, Trophy, Award, X, Workflow, Code } from "lucide-react";

const DEFAULT_PLATFORM_ICON = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop";

interface CodingProfilesProps {
  codingProfiles?: any[];
}

export default function CodingProfiles({ codingProfiles = [] }: CodingProfilesProps) {
  // 1. Declare all Hooks unconditionally at the top level
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  // 2. Perform all sorting and structure arrays unconditionally using top-level useMemo Hooks
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

  // Handle marquee logic safely inside a top-level useMemo Hook
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

  // 3. Early conditional return statements placed safely AFTER all Hook declarations
  if (!codingProfiles?.length) return null;

  return (
    <>
      <section
        id="codingprofiles"
        className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200"
      >
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
                <Terminal className="w-3.5 h-3.5" />
                07 / Telemetry
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
                Coding Profiles.
              </h2>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
        {/* ========================================== */}
        <div 
          className="block md:hidden w-full overflow-hidden py-1"
          onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
          onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
          onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
          onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
        >
          <motion.div 
            className="flex gap-4 px-6 w-max"
            animate={isMobileScrollable && !isMobilePaused && !selectedItem ? { x: [0, -1000] } : false}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45,
                ease: "linear"
              }
            }}
          >
            {mobileMarqueeItems.map((item: any, idx: number) => (
              <div
                key={`mob-${item.id || idx}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="w-[250px] bg-[#FAFAFA] border border-gray-200 rounded-none p-4 flex items-center gap-4 cursor-pointer shrink-0 text-left transition-colors hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-none overflow-hidden bg-white border border-gray-200 flex items-center justify-center p-1.5 shrink-0">
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className="w-full h-full object-contain select-none" />
                  ) : (
                    <Code className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-[#111827] truncate font-sans uppercase">{item.platform}</h3>
                  <p className="text-[11px] font-mono text-gray-500 truncate font-semibold">@{item.username}</p>
                </div>
                {item.currentRating !== undefined && item.currentRating !== null && (
                  <div className="text-xs font-mono font-bold text-[#111827] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-none">
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
          className={`hidden md:block relative w-full overflow-hidden py-2 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
          onMouseEnter={() => isScrollable && setIsPaused(true)}
          onMouseLeave={() => isScrollable && setIsPaused(false)}
        >
          <motion.div
            className={
              isScrollable 
                ? "flex gap-8 whitespace-nowrap min-w-full w-max px-6" 
                : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
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
                className={`bg-white border-b-2 border-gray-100 hover:border-[#111827] p-5 rounded-none transition-all duration-300 cursor-pointer text-left ${
                  isScrollable ? "w-[340px] shrink-0 inline-block" : "w-full"
                }`}
              >
                <div className="w-full h-32 rounded-none bg-[#FAFAFA] mb-4 border border-gray-100 relative flex items-center justify-center p-6">
                  <img
                    src={item.iconUrl || DEFAULT_PLATFORM_ICON}
                    alt={item.platform}
                    className={`select-none max-h-16 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
                      item.iconUrl ? "w-auto" : "w-full h-full object-cover opacity-5"
                    }`}
                  />
                  {!item.iconUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-10 h-10 text-gray-200" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 w-full px-1">
                  <div className="truncate space-y-0.5">
                    <h3 className="text-base font-extrabold text-[#111827] font-sans uppercase truncate">
                      {item.platform}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 font-semibold truncate">
                      @{item.username}
                    </p>
                  </div>

                  {item.currentRating !== undefined && item.currentRating !== null && (
                    <span className="text-xs font-mono font-bold text-[#111827] bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-none shrink-0 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-gray-400" /> {item.currentRating}
                    </span>
                  )}
                </div>

                {(item.problemsSolved !== undefined || item.globalRank || item.rank) && (
                  <div className="flex flex-wrap gap-2 pt-3 mt-4 border-t border-gray-100 text-[11px] font-mono font-bold justify-start px-1">
                    {item.problemsSolved !== undefined && item.problemsSolved !== null && (
                      <span className="text-gray-600 bg-[#FAFAFA] border border-gray-200 px-2 py-0.5 rounded-none">
                        SOLVED: {item.problemsSolved}
                      </span>
                    )}
                    {(item.globalRank || item.rank) && (
                      <span className="text-[#111827] bg-[#FAFAFA] border border-gray-200 px-2 py-0.5 rounded-none">
                        RANK: {item.globalRank || item.rank}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

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
              className="w-full max-w-xl bg-white border border-gray-200 rounded-none overflow-y-auto max-h-[85vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-6 sm:p-8 bg-[#FAFAFA] border-b border-gray-200">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-none border border-gray-200 bg-white flex items-center justify-center shrink-0 p-2 shadow-sm">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.platform} className="w-full h-full object-contain grayscale" />
                    ) : (
                      <Terminal className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2 py-0.5 rounded-none bg-gray-100 text-gray-600 border border-gray-200 text-[9px] font-mono font-bold uppercase tracking-wider mb-1 inline-block">
                      Identity Node
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-[#111827] font-sans uppercase">
                      {selectedItem.platform}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono font-semibold truncate">
                      @{selectedItem.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 font-sans">
                  {selectedItem.currentRating !== undefined && selectedItem.currentRating !== null && (
                    <div className="p-4 bg-[#FAFAFA] border border-gray-200 flex items-center gap-3 text-left">
                      <Flame className="w-5 h-5 text-gray-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Rating</div>
                        <div className="text-sm font-extrabold text-[#111827] mt-0.5">{selectedItem.currentRating}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.maxRating !== undefined && selectedItem.maxRating !== null && (
                    <div className="p-4 bg-[#FAFAFA] border border-gray-200 flex items-center gap-3 text-left">
                      <Trophy className="w-5 h-5 text-gray-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Peak</div>
                        <div className="text-sm font-extrabold text-[#111827] mt-0.5">{selectedItem.maxRating}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.problemsSolved !== undefined && selectedItem.problemsSolved !== null && (
                    <div className="p-4 bg-[#FAFAFA] border border-gray-200 flex items-center gap-3 text-left">
                      <Terminal className="w-5 h-5 text-gray-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Solved</div>
                        <div className="text-sm font-extrabold text-[#111827] mt-0.5">{selectedItem.problemsSolved}</div>
                      </div>
                    </div>
                  )}

                  {selectedItem.contestsAttended !== undefined && selectedItem.contestsAttended !== null && (
                    <div className="p-4 bg-[#FAFAFA] border border-gray-200 flex items-center gap-3 text-left">
                      <Award className="w-5 h-5 text-gray-400 shrink-0" />
                      <div>
                        <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Contests</div>
                        <div className="text-sm font-extrabold text-[#111827] mt-0.5">{selectedItem.contestsAttended}</div>
                      </div>
                    </div>
                  )}
                </div>

                {(selectedItem.globalRank || selectedItem.rank || selectedItem.activeSince) && (
                  <div className="p-4 bg-[#FAFAFA] border border-gray-200 divide-y divide-gray-200 font-mono text-xs space-y-3 text-left font-bold">
                    {selectedItem.globalRank && (
                      <div className="flex items-center justify-between text-gray-400 pt-0">
                        <span>GLOBAL_RANK_INDEX:</span>
                        <span className="text-[#111827]">{selectedItem.globalRank}</span>
                      </div>
                    )}
                    {selectedItem.rank && (
                      <div className="flex items-center justify-between text-gray-400 pt-3">
                        <span>CLASS_RANK:</span>
                        <span className="text-[#111827]">{selectedItem.rank}</span>
                      </div>
                    )}
                    {selectedItem.activeSince && (
                      <div className="flex items-center justify-between text-gray-400 pt-3">
                        <span>ACTIVE_SINCE:</span>
                        <span className="text-gray-600">{selectedItem.activeSince}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-mono text-gray-400">
                  <div onClick={(e) => e.stopPropagation()}>
                    {selectedItem.profileUrl && (
                      <a 
                        href={selectedItem.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-[#111827] text-white hover:bg-black text-xs font-bold font-sans transition-all active:scale-[0.98]"
                      >
                        Inspect Profile <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="opacity-40 flex items-center gap-1.5 font-semibold text-[10px]">
                    <Workflow className="w-3.5 h-3.5" /> CODE_SYNC_OK
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