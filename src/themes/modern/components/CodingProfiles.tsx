"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Terminal, ExternalLink, Flame, Trophy, Award, X, Workflow, Code } from "lucide-react";

const DEFAULT_PLATFORM_ICON =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop";

interface CodingProfilesProps {
  codingProfiles?: any[];
}

export default function CodingProfiles({ codingProfiles = [] }: CodingProfilesProps) {
  // 1. Declare all Hooks unconditionally at the top level
  const [selectedItem, setSelectedItemState] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // React 19 State Bounds for Drag Constraints
  const [mobileMaxScroll, setMobileMaxScroll] = useState<number>(0);
  const [desktopMaxScroll, setDesktopMaxScroll] = useState<number>(0);

  const selectedItemRef = useRef<any | null>(null);
  const setSelectedItem = (item: any) => {
    selectedItemRef.current = item;
    setSelectedItemState(item);
  };

  // Dynamic layout dimension tracking DOM references
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);

  // Animation Controls & Refs for Mobile and Desktop Interactive Infinite Marquee Tracks
  const mobileControls = useAnimation();
  const currentMobileX = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);

  const deskControls = useAnimation();
  const currentDeskX = useRef<number>(0);
  const isDraggingDesk = useRef<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  // 2. Perform all derivations inside top-level, unconditional useMemo Hooks
  const sortedProfiles = React.useMemo(() => {
    if (!codingProfiles?.length) return [];
    return [...codingProfiles].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [codingProfiles]);

  const isScrollable = sortedProfiles.length >= 3;
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

  // --- Track Dimension Synchronizer (ResizeObserver Equipped) ---
  useLayoutEffect(() => {
    const updateBounds = () => {
      if (mobileTrackRef.current) {
        setMobileMaxScroll(-(mobileTrackRef.current.scrollWidth / 2));
      }

      if (desktopTrackRef.current) {
        setDesktopMaxScroll(-(desktopTrackRef.current.scrollWidth / 2));
      }
    };

    updateBounds();

    const observer = new ResizeObserver(updateBounds);

    if (mobileTrackRef.current) observer.observe(mobileTrackRef.current);
    if (desktopTrackRef.current) observer.observe(desktopTrackRef.current);

    return () => observer.disconnect();
  }, [marqueeItems, mobileMarqueeItems]);

  // Constant speed calculations for uniform velocity tracking
  const MOBILE_SPEED = 1000 / 45; // Target distance over duration (X-axis pixels per second)
  const DESK_SPEED = 2000 / 55; // Target distance over duration (X-axis pixels per second)

  const startMobileMarquee = async (fromX: number) => {
    if (
      isDraggingMobile.current ||
      selectedItemRef.current ||
      !isMountedRef.current ||
      !isMobileScrollable
    )
      return;

    // Dynamically derive the wrap threshold based on half of the total duplicated track size
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
      !selectedItemRef.current &&
      isMountedRef.current &&
      isMobileScrollable
    ) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  const startDeskMarquee = async (fromX: number) => {
    if (isDraggingDesk.current || selectedItemRef.current || !isMountedRef.current || !isScrollable)
      return;

    // Dynamically derive the wrap threshold based on half of the total duplicated track size
    const targetX = -((desktopTrackRef.current?.scrollWidth || 0) / 2);
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
      !selectedItemRef.current &&
      isMountedRef.current &&
      isScrollable
    ) {
      requestAnimationFrame(() => {
        startDeskMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Yield macro task framework window to cleanly capture bounding geometry metrics
    const timer = setTimeout(() => {
      if (isMobileScrollable && !selectedItem) {
        startMobileMarquee(currentMobileX.current);
      } else {
        mobileControls.stop();
      }

      if (isScrollable && !selectedItem) {
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
  }, [isMobileScrollable, isScrollable, selectedItem, sortedProfiles]);

  // 3. Early conditional return clauses moved safely AFTER all Hook declarations
  if (!codingProfiles?.length) return null;

  return (
    <>
      <section
        id="codingprofiles"
        className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 select-none"
      >
        {/* Premium SaaS Micro-Grid & Gradient Mesh Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/5 to-[#06B6D4]/5 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#8B5CF6]/5 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                <Terminal className="w-3.5 h-3.5 text-[#6366F1]" />
                Competitive Telemetry
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
                Coding Profiles<span className="text-[#06B6D4]">.</span>
              </h2>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 1. MOBILE RESPONSIVE VIEW */}
        {/* ========================================== */}
        <div
          className={`block md:hidden w-full overflow-hidden py-2 ${!isMobileScrollable ? "flex justify-center" : ""}`}
        >
          <motion.div
            ref={mobileTrackRef}
            className="flex gap-3 px-6 w-max touch-none"
            drag={isMobileScrollable ? "x" : false}
            dragConstraints={{
              right: 0,
              left: mobileMaxScroll,
            }}
            animate={isMobileScrollable ? mobileControls : undefined}
            onUpdate={(latest) => {
              currentMobileX.current = typeof latest.x === "number" ? latest.x : 0;
            }}
            onDragStart={() => {
              if (!isMobileScrollable) return;
              isDraggingMobile.current = true;
              mobileControls.stop();
            }}
            onDragEnd={() => {
              if (!isMobileScrollable) return;
              isDraggingMobile.current = false;
              startMobileMarquee(currentMobileX.current);
            }}
            onMouseEnter={() => {
              if (!isMobileScrollable) return;
              isDraggingMobile.current = true;
              mobileControls.stop();
            }}
            onMouseLeave={() => {
              if (!isMobileScrollable) return;
              isDraggingMobile.current = false;
              startMobileMarquee(currentMobileX.current);
            }}
          >
            {(isMobileScrollable
              ? [...mobileMarqueeItems, ...mobileMarqueeItems]
              : mobileMarqueeItems
            ).map((item: any, idx: number) => (
              <div
                key={`mob-${item.id || idx}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="w-[260px] bg-[#111113] border border-[#18181B] active:border-[#6366F1]/50 rounded-xl p-3.5 flex items-center gap-4 shadow-xl cursor-pointer shrink-0 text-left"
              >
                {/* Micro logo space block */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#18181B] border border-[#18181B] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                  {item.iconUrl ? (
                    <img
                      src={item.iconUrl}
                      alt=""
                      className="w-full h-full object-contain select-none"
                    />
                  ) : (
                    <Code className="w-4 h-4 text-[#71717A]" />
                  )}
                </div>
                {/* Title Context tracks */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate font-sans">
                    {item.platform}
                  </h3>
                  <p className="text-[11px] font-mono text-[#71717A] truncate">@{item.username}</p>
                </div>
                {item.currentRating !== undefined && item.currentRating !== null && (
                  <div className="text-[11px] font-mono font-bold text-[#6366F1] bg-[#6366F1]/5 px-2 py-0.5 rounded-md border border-[#6366F1]/10">
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
        <div
          className={`hidden md:block relative w-full overflow-hidden py-6 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
        >
          {isScrollable && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
            </>
          )}

          <motion.div
            ref={desktopTrackRef}
            className={
              isScrollable
                ? "flex gap-6 whitespace-nowrap min-w-full w-max px-6 touch-none"
                : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex flex-wrap gap-6 justify-center"
            }
            drag={isScrollable ? "x" : false}
            dragConstraints={{
              right: 0,
              left: desktopMaxScroll,
            }}
            animate={isScrollable ? deskControls : undefined}
            onUpdate={(latest) => {
              currentDeskX.current = typeof latest.x === "number" ? latest.x : 0;
            }}
            onDragStart={() => {
              if (!isScrollable) return;
              isDraggingDesk.current = true;
              deskControls.stop();
            }}
            onDragEnd={() => {
              if (!isScrollable) return;
              isDraggingDesk.current = false;
              startDeskMarquee(currentDeskX.current);
            }}
            onMouseEnter={() => {
              if (!isScrollable) return;
              isDraggingDesk.current = true;
              deskControls.stop();
            }}
            onMouseLeave={() => {
              if (!isScrollable) return;
              isDraggingDesk.current = false;
              startDeskMarquee(currentDeskX.current);
            }}
          >
            {(isScrollable ? [...marqueeItems, ...marqueeItems] : marqueeItems).map(
              (item: any, idx: number) => (
                <div
                  key={`desk-${item.id || idx}-${idx}`}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-[#111113]/80 border border-[#18181B] hover:border-[#6366F1]/30 p-5 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.02)] cursor-pointer hover:-translate-y-1 overflow-hidden group/card text-left w-[330px] sm:w-[390px] shrink-0 ${
                    isScrollable ? "inline-block" : "mx-auto"
                  }`}
                >
                  <div className="w-full h-52 rounded-xl overflow-hidden bg-[#18181B] mb-5 border border-[#18181B] relative flex items-center justify-center p-8 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    <img
                      src={item.iconUrl || DEFAULT_PLATFORM_ICON}
                      alt={item.platform}
                      className={`select-none transition-transform duration-700 max-h-24 object-contain group-hover/card:scale-105 ${
                        item.iconUrl
                          ? "w-auto scale-110"
                          : "w-full h-full object-cover opacity-10 blur-xs"
                      }`}
                    />
                    {!item.iconUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code className="w-12 h-12 text-[#71717A]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="flex items-center justify-between gap-4 w-full px-1">
                    <div className="truncate space-y-0.5 text-left">
                      <h3 className="text-base font-bold text-white tracking-tight font-sans truncate">
                        {item.platform}
                      </h3>
                      <p className="text-xs font-mono text-[#71717A] truncate">@{item.username}</p>
                    </div>

                    {item.currentRating !== undefined && item.currentRating !== null && (
                      <span className="text-[11px] font-mono font-bold text-[#6366F1] bg-[#6366F1]/5 border border-[#6366F1]/10 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5 shadow-sm">
                        <Flame className="w-3.5 h-3.5 text-[#6366F1]" /> {item.currentRating}
                      </span>
                    )}
                  </div>

                  {(item.problemsSolved !== undefined || item.globalRank || item.rank) && (
                    <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#18181B] text-[11px] font-mono justify-start px-1">
                      {item.problemsSolved !== undefined && item.problemsSolved !== null && (
                        <span className="text-[#D4D4D8] bg-[#18181B] border border-[#18181B] px-2.5 py-1 rounded-lg font-medium shadow-sm">
                          Solved: {item.problemsSolved}
                        </span>
                      )}
                      {(item.globalRank || item.rank) && (
                        <span className="text-[#06B6D4] bg-[#06B6D4]/5 border border-[#06B6D4]/10 px-2.5 py-1 rounded-lg font-bold shadow-sm">
                          Rank: {item.globalRank || item.rank}
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

      {/* MODAL REDESIGN: FULL FEATURE SPEC TELEMETRY PREVIEW HUB */}
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
              className="w-full max-w-2xl bg-[#111113] border border-[#18181B] rounded-2xl overflow-y-auto max-h-[85vh] text-left shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-48 bg-[#18181B] overflow-hidden border-b border-[#18181B]">
                <div className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-md z-0" />
                <img
                  src={selectedItem.iconUrl || DEFAULT_PLATFORM_ICON}
                  alt=""
                  className="w-full h-full object-cover blur-sm brightness-[0.2] scale-[1.04] absolute inset-0 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/40 to-transparent z-10" />

                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex items-center gap-4 z-20 text-left">
                  <div className="w-14 h-14 rounded-xl border border-[#18181B] bg-[#0A0A0B] flex items-center justify-center shrink-0 shadow-2xl p-2 bg-neutral-950">
                    {selectedItem.iconUrl ? (
                      <img
                        src={selectedItem.iconUrl}
                        alt={selectedItem.platform}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Terminal className="w-5 h-5 text-[#6366F1]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold font-mono uppercase tracking-wider mb-1 inline-block shadow-sm">
                      Identity Node
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white truncate font-sans">
                      {selectedItem.platform}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#71717A] font-mono truncate">
                      @{selectedItem.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {selectedItem.currentRating !== undefined &&
                    selectedItem.currentRating !== null && (
                      <div className="p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/60 flex items-center gap-3 shadow-inner text-left">
                        <Flame className="w-5 h-5 text-[#6366F1] shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                            Rating
                          </div>
                          <div className="text-base font-extrabold text-white font-sans mt-0.5">
                            {selectedItem.currentRating}
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedItem.maxRating !== undefined && selectedItem.maxRating !== null && (
                    <div className="p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/60 flex items-center gap-3 shadow-inner text-left">
                      <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                          Peak
                        </div>
                        <div className="text-base font-extrabold text-amber-500 font-sans mt-0.5">
                          {selectedItem.maxRating}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedItem.problemsSolved !== undefined &&
                    selectedItem.problemsSolved !== null && (
                      <div className="p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/60 flex items-center gap-3 shadow-inner text-left">
                        <Terminal className="w-5 h-5 text-[#06B6D4] shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                            Solved
                          </div>
                          <div className="text-base font-extrabold text-white font-sans mt-0.5">
                            {selectedItem.problemsSolved}
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedItem.contestsAttended !== undefined &&
                    selectedItem.contestsAttended !== null && (
                      <div className="p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/60 flex items-center gap-3 shadow-inner text-left">
                        <Award className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                            Contests
                          </div>
                          <div className="text-base font-extrabold text-white font-sans mt-0.5">
                            {selectedItem.contestsAttended}
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {(selectedItem.globalRank || selectedItem.rank || selectedItem.activeSince) && (
                  <div className="p-4 rounded-xl border border-[#18181B] bg-[#0A0A0B]/60 divide-y divide-[#18181B] font-mono text-xs space-y-3 shadow-inner text-left">
                    {selectedItem.globalRank && (
                      <div className="flex items-center justify-between text-[#71717A] font-semibold pt-0">
                        <span>GLOBAL_RANK_INDEX:</span>
                        <span className="text-white font-bold">{selectedItem.globalRank}</span>
                      </div>
                    )}
                    {selectedItem.rank && (
                      <div className="flex items-center justify-between text-[#71717A] font-semibold pt-3">
                        <span>CLASS_RANK:</span>
                        <span className="text-white font-bold">{selectedItem.rank}</span>
                      </div>
                    )}
                    {selectedItem.activeSince && (
                      <div className="flex items-center justify-between text-[#71717A] font-semibold pt-3">
                        <span>ACTIVE_SINCE:</span>
                        <span className="text-[#D4D4D8]">{selectedItem.activeSince}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-5 border-t border-[#18181B] flex items-center justify-between text-xs font-mono text-[#71717A] font-semibold">
                  <div onClick={(e) => e.stopPropagation()}>
                    {selectedItem.profileUrl && (
                      <a
                        href={selectedItem.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all active:scale-[0.98] border border-white/10 shadow-md font-sans"
                      >
                        Inspect Profile <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="opacity-40 flex items-center gap-1">
                    <Workflow className="w-3.5 h-3.5 text-[#8B5CF6]" /> CODE_SYNC_OK
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
