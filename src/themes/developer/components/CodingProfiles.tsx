"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Terminal,
  ExternalLink,
  Flame,
  Trophy,
  Award,
  X,
  Cpu,
  Code,
  GitBranch,
} from "lucide-react";

const DEFAULT_PLATFORM_ICON =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop";

interface CodingProfilesProps {
  codingProfiles?: any[];
}

export default function CodingProfiles({ codingProfiles = [] }: CodingProfilesProps) {
  // State hooks declared unconditionally at the top level
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // React 19 State Bounds for Drag Constraints
  const [mobileMaxScroll, setMobileMaxScroll] = useState<number>(0);
  const [desktopMaxScroll, setDesktopMaxScroll] = useState<number>(0);

  // Dynamic layout dimension tracking nodes
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const deskTrackRef = useRef<HTMLDivElement>(null);

  // Animation Controls & Refs for Mobile and Desktop Interactive Infinite Marquee Tracks
  const mobileControls = useAnimation();
  const currentMobileX = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);

  const deskControls = useAnimation();
  const currentDeskX = useRef<number>(0);
  const isDraggingDesk = useRef<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  // Perform all derivations inside top-level, unconditional useMemo hooks
  const sortedProfiles = React.useMemo(() => {
    if (!codingProfiles?.length) return [];
    return [...codingProfiles].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [codingProfiles]);

  // Distinct responsive visibility thresholds
  const mobileShouldAutoScroll = sortedProfiles.length > 1;
  const desktopShouldAutoScroll = sortedProfiles.length > 3;

  // Duplicate mobile items to maintain smooth rolling bounds on loop tracks
  const mobileMarqueeItems = React.useMemo(() => {
    if (sortedProfiles.length === 0) return [];
    if (!mobileShouldAutoScroll) return sortedProfiles;
    let items = [...sortedProfiles];
    while (items.length < 8) {
      items = [...items, ...sortedProfiles];
    }
    return items;
  }, [sortedProfiles, mobileShouldAutoScroll]);

  // Derive desk marquee items inside a top-level useMemo unconditionally
  const marqueeItems = React.useMemo(() => {
    if (sortedProfiles.length === 0) return [];
    if (!desktopShouldAutoScroll) return sortedProfiles;
    let items = [...sortedProfiles];
    while (items.length < 5) {
      items = [...items, ...sortedProfiles];
    }
    return items;
  }, [sortedProfiles, desktopShouldAutoScroll]);

  // --- Track Dimension Synchronizer (ResizeObserver Equipped) ---
  useLayoutEffect(() => {
    const updateBounds = () => {
      if (mobileTrackRef.current) {
        setMobileMaxScroll(-(mobileTrackRef.current.scrollWidth / 2));
      }

      if (deskTrackRef.current) {
        setDesktopMaxScroll(-(deskTrackRef.current.scrollWidth / 2));
      }
    };

    updateBounds();

    const observer = new ResizeObserver(updateBounds);

    if (mobileTrackRef.current) observer.observe(mobileTrackRef.current);
    if (deskTrackRef.current) observer.observe(deskTrackRef.current);

    return () => observer.disconnect();
  }, [marqueeItems, mobileMarqueeItems]);

  // Constant speed ratios for uniform velocity tracking
  const MOBILE_SPEED = 1000 / 45;
  const DESK_SPEED = 2000 / 55;

  const startMobileMarquee = async (fromX: number) => {
    if (
      isDraggingMobile.current ||
      selectedItem ||
      !isMountedRef.current ||
      !mobileShouldAutoScroll
    )
      return;

    // Dynamically derive wrap threshold based on half of total duplicate track content size
    const targetX = -((mobileTrackRef.current?.scrollWidth || 0) / 2);
    if (targetX >= 0) return;

    if (fromX <= targetX || fromX > 0) {
      fromX = 0;
      await mobileControls.set({ x: 0 });
    }

    const remainingDistance = Math.abs(targetX - fromX);
    const dynamicDuration = remainingDistance / MOBILE_SPEED;

    await mobileControls.start({
      x: targetX,
      transition: {
        duration: dynamicDuration,
        ease: "linear",
      },
    });

    if (
      !isDraggingMobile.current &&
      !selectedItem &&
      isMountedRef.current &&
      mobileShouldAutoScroll
    ) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  const startDeskMarquee = async (fromX: number) => {
    if (isDraggingDesk.current || selectedItem || !isMountedRef.current || !desktopShouldAutoScroll)
      return;

    // Dynamically derive wrap threshold based on half of total duplicate track content size
    const targetX = -((deskTrackRef.current?.scrollWidth || 0) / 2);
    if (targetX >= 0) return;

    if (fromX <= targetX || fromX > 0) {
      fromX = 0;
      await deskControls.set({ x: 0 });
    }

    const remainingDistance = Math.abs(targetX - fromX);
    const dynamicDuration = remainingDistance / DESK_SPEED;

    await deskControls.start({
      x: targetX,
      transition: {
        duration: dynamicDuration,
        ease: "linear",
      },
    });

    if (
      !isDraggingDesk.current &&
      !selectedItem &&
      isMountedRef.current &&
      desktopShouldAutoScroll
    ) {
      requestAnimationFrame(() => {
        startDeskMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Execution delay window allows layout engine processing calculations to settle smoothly
    const timer = setTimeout(() => {
      if (mobileShouldAutoScroll && !selectedItem) {
        startMobileMarquee(currentMobileX.current);
      } else {
        mobileControls.stop();
      }

      if (desktopShouldAutoScroll && !selectedItem) {
        startDeskMarquee(currentDeskX.current);
      } else {
        deskControls.stop();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      mobileControls.stop();
      deskControls.stop();
      isMountedRef.current = false;
    };
  }, [mobileShouldAutoScroll, desktopShouldAutoScroll, selectedItem, sortedProfiles]);

  // Move early returns safely AFTER all Hook declarations
  if (!codingProfiles?.length) return null;

  return (
    <>
      <section
        id="codingprofiles"
        className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

        {/* IDE Header Component */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
          <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#58A6FF]" />
              <span className="font-bold text-[#C9D1D9]">Coding Profiles</span>
              <span className="text-neutral-600">/</span>
              <span className="text-[11px] text-[#7EE787]">telemetry-metrics.log</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3FB950]" />
              <span className="text-[10px] text-neutral-500 hidden sm:inline">LIVE_BUFFER</span>
            </div>
          </div>

          <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
            <p className="text-[11px] text-neutral-400">
              <span className="text-[#F78166]">$</span> cat profiles.json | grep --color=always
              "statistics"
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* 1. MOBILE RESPONSIVE VIEW */}
        {/* ========================================== */}
        <div
          className={`block md:hidden w-full overflow-hidden py-2 ${!mobileShouldAutoScroll ? "flex justify-center" : ""}`}
        >
          <motion.div
            ref={mobileTrackRef}
            className="flex gap-3 px-4 w-max touch-none"
            drag={mobileShouldAutoScroll ? "x" : false}
            dragConstraints={{
              left: mobileMaxScroll,
              right: 0,
            }}
            animate={mobileShouldAutoScroll ? mobileControls : undefined}
            onUpdate={(latest) => {
              currentMobileX.current = typeof latest.x === "number" ? latest.x : 0;
            }}
            onDragStart={() => {
              if (!mobileShouldAutoScroll) return;
              isDraggingMobile.current = true;
              mobileControls.stop();
            }}
            onDragEnd={() => {
              if (!mobileShouldAutoScroll) return;
              isDraggingMobile.current = false;
              startMobileMarquee(currentMobileX.current);
            }}
            onMouseEnter={() => {
              if (!mobileShouldAutoScroll) return;
              isDraggingMobile.current = true;
              mobileControls.stop();
            }}
            onMouseLeave={() => {
              if (!mobileShouldAutoScroll) return;
              isDraggingMobile.current = false;
              startMobileMarquee(currentMobileX.current);
            }}
          >
            {(mobileShouldAutoScroll
              ? [...mobileMarqueeItems, ...mobileMarqueeItems]
              : mobileMarqueeItems
            ).map((item: any, idx: number) => (
              <div
                key={`mob-${item.id || idx}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="w-[240px] bg-[#161B22] border border-[#30363D] active:border-[#58A6FF] rounded-lg p-3 flex items-center gap-3 shadow-md cursor-pointer shrink-0"
              >
                <div className="w-9 h-9 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                  {item.iconUrl ? (
                    <img
                      src={item.iconUrl}
                      alt=""
                      className="w-full h-full object-contain select-none filter opacity-80"
                    />
                  ) : (
                    <Code className="w-4 h-4 text-neutral-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-bold text-xs text-white truncate">{item.platform}</h3>
                  <p className="text-[10px] text-neutral-500 truncate">@{item.username}</p>
                </div>
                {item.currentRating !== undefined && item.currentRating !== null && (
                  <div className="text-[10px] font-bold text-[#7EE787] bg-[#7EE787]/5 px-1.5 py-0.5 rounded border border-[#7EE787]/10">
                    {item.currentRating}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* 2. DESKTOP VIEW */}
        {/* ========================================== */}
        <div className="hidden md:block relative w-full overflow-hidden py-2">
          {desktopShouldAutoScroll && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0D1117] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0D1117] to-transparent z-20 pointer-events-none" />
            </>
          )}

          <motion.div
            ref={deskTrackRef}
            className={
              desktopShouldAutoScroll
                ? "flex gap-4 whitespace-nowrap min-w-full w-max px-4 touch-none"
                : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-wrap gap-4 justify-center"
            }
            drag={desktopShouldAutoScroll ? "x" : false}
            dragConstraints={{
              left: desktopMaxScroll,
              right: 0,
            }}
            animate={desktopShouldAutoScroll ? deskControls : undefined}
            onUpdate={(latest) => {
              currentDeskX.current = typeof latest.x === "number" ? latest.x : 0;
            }}
            onDragStart={() => {
              if (!desktopShouldAutoScroll) return;
              isDraggingDesk.current = true;
              deskControls.stop();
            }}
            onDragEnd={() => {
              if (!desktopShouldAutoScroll) return;
              isDraggingDesk.current = false;
              startDeskMarquee(currentDeskX.current);
            }}
            onMouseEnter={() => {
              if (!desktopShouldAutoScroll) return;
              isDraggingDesk.current = true;
              deskControls.stop();
            }}
            onMouseLeave={() => {
              if (!desktopShouldAutoScroll) return;
              isDraggingDesk.current = false;
              startDeskMarquee(currentDeskX.current);
            }}
          >
            {(desktopShouldAutoScroll ? [...marqueeItems, ...marqueeItems] : marqueeItems).map(
              (item: any, idx: number) => (
                <div
                  key={`desk-${item.id || idx}-${idx}`}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] p-4 rounded-lg transition-all duration-200 shadow-md cursor-pointer hover:bg-[#1C2128] overflow-hidden w-[340px] shrink-0 ${
                    desktopShouldAutoScroll ? "inline-block" : "mx-auto"
                  }`}
                >
                  <div className="w-full h-36 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] mb-4 relative flex items-center justify-center p-6">
                    <img
                      src={item.iconUrl || DEFAULT_PLATFORM_ICON}
                      alt={item.platform}
                      className={`select-none max-h-16 object-contain ${
                        item.iconUrl
                          ? "w-auto opacity-70 filter brightness-90"
                          : "w-full h-full object-cover opacity-10 blur-xs"
                      }`}
                    />
                    {!item.iconUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code className="w-8 h-8 text-neutral-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-40" />
                  </div>

                  <div className="flex items-center justify-between gap-4 w-full">
                    <div className="truncate text-left space-y-0.5">
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">
                        {item.platform}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate">@{item.username}</p>
                    </div>

                    {item.currentRating !== undefined && item.currentRating !== null && (
                      <span className="text-[11px] font-bold text-[#7EE787] bg-[#7EE787]/5 border border-[#7EE787]/10 px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#F78166]" /> {item.currentRating}
                      </span>
                    )}
                  </div>

                  {(item.problemsSolved !== undefined || item.globalRank || item.rank) && (
                    <div className="flex flex-wrap gap-2 pt-2.5 mt-2.5 border-t border-[#30363D] text-[11px] justify-start">
                      {item.problemsSolved !== undefined && item.problemsSolved !== null && (
                        <span className="text-neutral-400 bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded">
                          solved:{item.problemsSolved}
                        </span>
                      )}
                      {(item.globalRank || item.rank) && (
                        <span className="text-[#58A6FF] bg-[#58A6FF]/5 border border-[#58A6FF]/10 px-2 py-0.5 rounded">
                          rank:{item.globalRank || item.rank}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* Pop-up Modal Viewport */}
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
              {/* Terminal Title Bar Controls */}
              <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3 bg-[#1C2128]">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu size={12} className="text-[#F78166]" />
                  <span className="text-neutral-400 font-bold">profile_telemetry.sh</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Minimal Cover Panel */}
              <div className="relative h-32 bg-[#0D1117] overflow-hidden border-b border-[#30363D]">
                <img
                  src={selectedItem.iconUrl || DEFAULT_PLATFORM_ICON}
                  alt=""
                  className="w-full h-full object-cover blur-lg brightness-[0.2] absolute inset-0 z-0 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent z-10" />

                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded border border-[#30363D] bg-[#0D1117] flex items-center justify-center shrink-0 p-1.5">
                    {selectedItem.iconUrl ? (
                      <img
                        src={selectedItem.iconUrl}
                        alt={selectedItem.platform}
                        className="w-full h-full object-contain filter brightness-90 opacity-90"
                      />
                    ) : (
                      <Terminal className="w-4 h-4 text-[#58A6FF]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate z-20">
                    <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                      TELEMETRY_NODE
                    </span>
                    <h3 className="text-base font-bold text-white truncate">
                      {selectedItem.platform}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">@{selectedItem.username}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  {selectedItem.currentRating !== undefined &&
                    selectedItem.currentRating !== null && (
                      <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-[#F78166] shrink-0" />
                        <div>
                          <div className="text-[9px] text-neutral-500 uppercase font-bold">
                            Rating
                          </div>
                          <div className="text-sm font-bold text-neutral-200 mt-0.5">
                            {selectedItem.currentRating}
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedItem.maxRating !== undefined && selectedItem.maxRating !== null && (
                    <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-[#7EE787] shrink-0" />
                      <div>
                        <div className="text-[9px] text-neutral-500 uppercase font-bold">
                          Peak Tier
                        </div>
                        <div className="text-sm font-bold text-[#7EE787] mt-0.5">
                          {selectedItem.maxRating}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedItem.problemsSolved !== undefined &&
                    selectedItem.problemsSolved !== null && (
                      <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] flex items-center gap-2.5">
                        <Code className="w-4 h-4 text-[#58A6FF] shrink-0" />
                        <div>
                          <div className="text-[9px] text-neutral-500 uppercase font-bold">
                            Submissions
                          </div>
                          <div className="text-sm font-bold text-neutral-200 mt-0.5">
                            {selectedItem.problemsSolved}
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedItem.contestsAttended !== undefined &&
                    selectedItem.contestsAttended !== null && (
                      <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-[#7EE787] shrink-0" />
                        <div>
                          <div className="text-[9px] text-neutral-500 uppercase font-bold">
                            Contests
                          </div>
                          <div className="text-sm font-bold text-neutral-200 mt-0.5">
                            {selectedItem.contestsAttended}
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {(selectedItem.globalRank || selectedItem.rank || selectedItem.activeSince) && (
                  <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] divide-y divide-[#30363D] text-[11px] space-y-2">
                    {selectedItem.globalRank && (
                      <div className="flex items-center justify-between text-neutral-400 pt-0">
                        <span>GLOBAL_RANK_INDEX:</span>
                        <span className="text-white font-bold">{selectedItem.globalRank}</span>
                      </div>
                    )}
                    {selectedItem.rank && (
                      <div className="flex items-center justify-between text-neutral-400 pt-2">
                        <span>LOCAL_RANK:</span>
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

                <div className="pt-4 border-t border-[#30363D] flex items-center justify-between text-xs">
                  <div onClick={(e) => e.stopPropagation()}>
                    {selectedItem.profileUrl && (
                      <a
                        href={selectedItem.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] font-bold text-white transition-colors"
                      >
                        Launch Endpoint <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" />
                      </a>
                    )}
                  </div>
                  <span className="text-neutral-500 flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-neutral-600" /> remote_sync
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
