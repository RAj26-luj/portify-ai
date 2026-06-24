"use client";

import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Layers, ExternalLink, Download, HelpCircle, X, Workflow } from "lucide-react";

const DEFAULT_CUSTOM_IMAGE =
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop";

interface CustomSectionProps {
  sections?: any[];
}

export default function CustomSection({ sections = [] }: CustomSectionProps) {
  // 1. Declare all React Hooks unconditionally at the top level
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
  const currentMobileY = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);

  const deskControls = useAnimation();
  const currentDeskX = useRef<number>(0);
  const isDraggingDesk = useRef<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  // 2. Pre-filter and structure loop track items safely inside an unconditional useMemo block
  const activeSections = useMemo(() => {
    if (!sections?.length) return [];

    return sections
      .filter((section: any) => section?.items && section.items.length > 0)
      .map((section: any, sectionIdx: number) => {
        const rawItems = section.items;
        const isScrollable = rawItems.length >= 4;
        const isMobileScrollable = rawItems.length > 1;

        // Loop replication mappings for continuous animation transitions
        const mobileMarqueeItems = (() => {
          if (!isMobileScrollable) return rawItems;
          let items = [...rawItems];
          while (items.length < 9) {
            items = [...items, ...rawItems];
          }
          return items;
        })();

        const marqueeItems = isScrollable
          ? (() => {
              let items = [...rawItems];
              while (items.length < 5) {
                items = [...items, ...rawItems];
              }
              return items;
            })()
          : rawItems;

        return {
          ...section,
          sectionIdx,
          isScrollable,
          isMobileScrollable,
          mobileMarqueeItems,
          marqueeItems,
        };
      });
  }, [sections]);

  // --- Track Dimension Synchronizer (ResizeObserver Equipped) ---
  useLayoutEffect(() => {
    const updateBounds = () => {
      if (mobileTrackRef.current) {
        setMobileMaxScroll(-(mobileTrackRef.current.scrollHeight / 2));
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
  }, [activeSections]);

  // Constant speed calculations for uniform velocity tracking
  const MOBILE_SPEED = 420 / 25; // Target distance over duration (Y-axis pixels per second)
  const DESK_SPEED = 2000 / 50; // Target distance over duration (X-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedItemRef.current || !isMountedRef.current) return;

    // Pull current tracking node identifier safely
    const scrollSection = activeSections.find((s) => s.isMobileScrollable);
    if (!scrollSection) return;

    // Dynamically query target wrap boundary limits from runtime layout bounds
    const targetY = -((mobileTrackRef.current?.scrollHeight || 0) / 2);
    if (targetY >= 0) return;

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
        ease: "linear",
      },
    });

    if (
      !isDraggingMobile.current &&
      !selectedItemRef.current &&
      isMountedRef.current &&
      scrollSection.isMobileScrollable
    ) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  const startDeskMarquee = async (fromX: number) => {
    if (isDraggingDesk.current || selectedItemRef.current || !isMountedRef.current) return;

    const scrollSection = activeSections.find((s) => s.isScrollable);
    if (!scrollSection) return;

    // Dynamically query target wrap boundary limits from runtime layout bounds
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
      scrollSection.isScrollable
    ) {
      requestAnimationFrame(() => {
        startDeskMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const hasScrollableMobileSection = activeSections.some((s) => s.isMobileScrollable);
    const hasScrollableDeskSection = activeSections.some((s) => s.isScrollable);

    // Yield window process timeline slice to safely parse layout dimensions cleanly
    const timer = setTimeout(() => {
      if (hasScrollableMobileSection && !selectedItem) {
        startMobileMarquee(currentMobileY.current);
      } else {
        mobileControls.stop();
      }

      if (hasScrollableDeskSection && !isPaused && !selectedItem) {
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
  }, [activeSections, isPaused, selectedItem]);

  // 3. Keep conditional returns safely AFTER all React hooks
  if (!sections?.length || activeSections.length === 0) {
    return null;
  }

  return (
    <>
      {activeSections.map((section: any) => {
        const sectionIdKey = section.id || section.sectionIdx;
        return (
          <section
            key={sectionIdKey}
            id={section.title?.toLowerCase().replace(/\s+/g, "") || `custom-${section.sectionIdx}`}
            className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 select-none"
          >
            {/* Premium SaaS Micro-Grid & Ambient Lighting Overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/5 to-[#06B6D4]/5 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#8B5CF6]/5 blur-[110px] rounded-full pointer-events-none" />

            {/* Section Header */}
            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                    <Layers className="w-3.5 h-3.5 text-[#6366F1]" />
                    Extension Block // {String(section.sectionIdx + 1).padStart(2, "0")}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
                    {section.title}
                    <span className="text-[#06B6D4]">.</span>
                  </h2>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* 1. MOBILE RESPONSIVE VIEW */}
            {/* ========================================== */}
            <div className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A0A0B] to-transparent z-20 pointer-events-none" />

              <motion.div
                ref={mobileTrackRef}
                className="flex flex-col gap-3 touch-none"
                drag={section.isMobileScrollable ? "y" : false}
                dragConstraints={{
                  top: mobileMaxScroll,
                  bottom: 0,
                }}
                animate={section.isMobileScrollable ? mobileControls : undefined}
                onUpdate={(latest) => {
                  currentMobileY.current = typeof latest.y === "number" ? latest.y : 0;
                }}
                onDragStart={() => {
                  if (!section.isMobileScrollable) return;
                  isDraggingMobile.current = true;
                  mobileControls.stop();
                }}
                onDragEnd={() => {
                  if (!section.isMobileScrollable) return;
                  isDraggingMobile.current = false;
                  startMobileMarquee(currentMobileY.current);
                }}
                onMouseEnter={() => {
                  if (!section.isMobileScrollable) return;
                  isDraggingMobile.current = true;
                  mobileControls.stop();
                }}
                onMouseLeave={() => {
                  if (!section.isMobileScrollable) return;
                  isDraggingMobile.current = false;
                  startMobileMarquee(currentMobileY.current);
                }}
              >
                {(section.isMobileScrollable
                  ? [...section.mobileMarqueeItems, ...section.mobileMarqueeItems]
                  : section.mobileMarqueeItems
                ).map((item: any, idx: number) => (
                  <div
                    key={`mob-${item.id || idx}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    className="w-full bg-[#111113] border border-[#18181B] active:border-[#6366F1]/50 rounded-xl p-4 flex items-center gap-4 shadow-xl shrink-0 cursor-pointer text-left transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#18181B] border border-[#18181B] shrink-0 flex items-center justify-center shadow-inner">
                      <img
                        src={item.iconUrl || item.imageUrl || DEFAULT_CUSTOM_IMAGE}
                        alt=""
                        className="w-full h-full object-cover select-none filter opacity-80"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-white truncate font-sans">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-[11px] font-mono font-medium text-[#71717A] truncate mt-1 uppercase tracking-wider">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ========================================== */}
            {/* 2. DESKTOP VIEW */}
            {/* ========================================== */}
            <div
              className={`hidden md:block relative w-full overflow-hidden py-6 ${section.isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
            >
              {section.isScrollable && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
                </>
              )}

              <motion.div
                ref={desktopTrackRef}
                className={
                  section.isScrollable
                    ? "flex gap-6 whitespace-nowrap min-w-full w-max px-6 touch-none"
                    : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
                }
                drag={section.isScrollable ? "x" : false}
                dragConstraints={{
                  left: desktopMaxScroll,
                  right: 0,
                }}
                animate={section.isScrollable ? deskControls : undefined}
                onUpdate={(latest) => {
                  currentDeskX.current = typeof latest.x === "number" ? latest.x : 0;
                }}
                onDragStart={() => {
                  if (!section.isScrollable) return;
                  isDraggingDesk.current = true;
                  deskControls.stop();
                }}
                onDragEnd={() => {
                  if (!section.isScrollable) return;
                  isDraggingDesk.current = false;
                  startDeskMarquee(currentDeskX.current);
                }}
                onMouseEnter={() => {
                  if (!section.isScrollable) return;
                  isDraggingDesk.current = true;
                  deskControls.stop();
                }}
                onMouseLeave={() => {
                  if (!section.isScrollable) return;
                  isDraggingDesk.current = false;
                  startDeskMarquee(currentDeskX.current);
                }}
              >
                {section.marqueeItems.map((item: any, idx: number) => (
                  <div
                    key={`desk-${item.id || idx}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    className={`bg-[#111113]/80 border border-[#18181B] hover:border-[#6366F1]/30 p-5 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.02)] cursor-pointer hover:-translate-y-1 overflow-hidden group/card text-left ${
                      section.isScrollable
                        ? "w-[330px] sm:w-[390px] shrink-0 inline-block"
                        : "w-full"
                    }`}
                  >
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-[#18181B] mb-5 border border-[#18181B] relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                      <img
                        src={item.imageUrl || DEFAULT_CUSTOM_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover select-none transition-transform duration-700 group-hover/card:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-90" />
                    </div>

                    <div className="flex items-center gap-3.5 w-full px-1">
                      <div className="w-11 h-11 rounded-xl border border-[#18181B] bg-[#0A0A0B] overflow-hidden flex items-center justify-center shrink-0 shadow-inner p-1.5 transition-colors group-hover/card:border-[#6366F1]/20">
                        {item.iconUrl ? (
                          <img
                            src={item.iconUrl}
                            alt=""
                            className="w-full h-full object-contain select-none"
                          />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-[#6366F1]" />
                        )}
                      </div>

                      <div className="truncate space-y-0.5 flex-1">
                        <h3 className="text-base font-bold text-white tracking-tight font-sans truncate">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs font-mono font-medium text-[#71717A] truncate uppercase tracking-wider">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-[#71717A] font-medium mt-4 whitespace-normal leading-relaxed line-clamp-2 px-1 font-sans">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* COMPREHENSIVE DETAIL MODAL POPUP LAYER */}
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
              className="w-full max-w-xl bg-[#111113] border border-[#18181B] rounded-2xl overflow-y-auto max-h-[85vh] text-left shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-52 sm:h-72 bg-[#18181B] overflow-hidden border-b border-[#18181B]">
                <img
                  src={selectedItem.imageUrl || DEFAULT_CUSTOM_IMAGE}
                  alt=""
                  className="w-full h-full object-cover blur-sm brightness-[0.25] scale-[1.04] select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/40 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex items-center gap-4 z-20 text-left">
                  <div className="w-14 h-14 rounded-xl border border-[#18181B] bg-[#0A0A0B] overflow-hidden flex items-center justify-center shrink-0 shadow-2xl p-2">
                    {selectedItem.iconUrl ? (
                      <img
                        src={selectedItem.iconUrl}
                        alt={selectedItem.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-[#6366F1]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold font-mono uppercase tracking-wider mb-1 inline-block shadow-sm">
                      Extension Dossier Node
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white truncate font-sans">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.subtitle && (
                      <p className="text-xs sm:text-sm text-[#71717A] font-mono font-semibold uppercase tracking-wider truncate mt-0.5">
                        {selectedItem.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">
                      Registry Specifications
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans bg-[#0A0A0B]/40 p-4 rounded-xl border border-[#18181B] max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                <div className="pt-5 border-t border-[#18181B] flex items-center justify-between text-xs font-mono text-[#71717A] font-semibold">
                  <div
                    className="flex flex-wrap items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedItem.externalUrl && (
                      <a
                        href={selectedItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all active:scale-[0.98] border border-white/10 shadow-md font-sans"
                      >
                        Launch Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedItem.attachmentUrl && (
                      <a
                        href={selectedItem.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0B] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] text-[#D4D4D8]"
                      >
                        <Download className="w-3.5 h-3.5 text-[#71717A]" /> Download Asset
                      </a>
                    )}
                  </div>

                  <span className="opacity-40 flex items-center gap-1">
                    <Workflow className="w-3.5 h-3.5 text-[#8B5CF6]" /> CUST_SYNC_OK
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
