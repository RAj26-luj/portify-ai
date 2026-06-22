"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Layers, ExternalLink, Download, HelpCircle, X, Workflow } from "lucide-react";

const DEFAULT_CUSTOM_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop";

interface CustomSectionProps {
  sections?: any[];
}

export default function CustomSection({ sections = [] }: CustomSectionProps) {
  // 1. Declare all React Hooks unconditionally at the top level
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Animation Controls & Refs for Mobile and Desktop Interactive Infinite Marquee Tracks
  const mobileControls = useAnimation();
  const currentMobileY = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);

  const deskControls = useAnimation();
  const currentDeskX = useRef<number>(0);
  const isDraggingDesk = useRef<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  // 2. Pre-filter and structure loop track items safely inside an unconditional useMemo block
  const processedSections = useMemo(() => {
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

  // Constant speed calculations for uniform velocity tracking
  const MOBILE_SPEED = 420 / 25; // Target distance over duration (Y-axis pixels per second)
  const DESK_SPEED = 2000 / 50; // Target distance over duration (X-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedItem || !isMountedRef.current) return;

    let targetY = -420;
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

  const startDeskMarquee = async (fromX: number) => {
    if (isDraggingDesk.current || selectedItem || !isMountedRef.current) return;

    let targetX = -2000;
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
        ease: "linear"
      }
    });

    if (!isDraggingDesk.current && !selectedItem && isMountedRef.current) {
      requestAnimationFrame(() => {
        startDeskMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const hasScrollableMobileSection = processedSections.some(s => s.isMobileScrollable);
    const hasScrollableDeskSection = processedSections.some(s => s.isScrollable);

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

    return () => {
      mobileControls.stop();
      deskControls.stop();
      isMountedRef.current = false;
    };
  }, [processedSections, isPaused, selectedItem]);

  // 3. Early conditional return statements placed safely AFTER all Hook declarations
  if (!sections?.length || processedSections.length === 0) {
    return null;
  }

  return (
    <>
      {processedSections.map((section: any) => {
        return (
          <section
            key={section.id || section.sectionIdx}
            id={section.title?.toLowerCase().replace(/\s+/g, "") || `custom-${section.sectionIdx}`}
            className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200 select-none"
          >
            {/* Section Header */}
            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    Extension Block // {String(section.sectionIdx + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
                    {section.title}.
                  </h2>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
            {/* ========================================== */}
            <div className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative">
              {/* Fade masks overlay to smooth scrolling edge transitions */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

              <motion.div
                className="flex flex-col gap-3 touch-none"
                drag={section.isMobileScrollable ? "y" : false}
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
                {section.mobileMarqueeItems.map((item: any, idx: number) => (
                  <div
                    key={`mob-${item.id || idx}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-none p-4 flex items-center gap-4 cursor-pointer shrink-0 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-none overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
                      <img 
                        src={item.iconUrl || item.imageUrl || DEFAULT_CUSTOM_IMAGE} 
                        alt="" 
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-sm text-[#111827] truncate font-sans uppercase">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-[11px] font-mono text-gray-500 truncate mt-1 uppercase tracking-wider font-semibold">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ========================================== */}
            {/* 2. DESKTOP VIEW: HORIZONTAL TIMELINE RIBBON */}
            {/* ========================================== */}
            <div className={`hidden md:block relative w-full overflow-hidden py-2 ${section.isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}>
              <motion.div
                className={
                  section.isScrollable 
                    ? "flex gap-8 whitespace-nowrap min-w-full w-max px-6 touch-none" 
                    : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
                }
                drag={section.isScrollable ? "x" : false}
                dragConstraints={{ left: -2000, right: 0 }}
                animate={deskControls}
                onUpdate={(latest) => {
                  currentDeskX.current = typeof latest.x === "number" ? latest.x : 0;
                }}
                onDragStart={() => {
                  isDraggingDesk.current = true;
                  deskControls.stop();
                }}
                onDragEnd={() => {
                  isDraggingDesk.current = false;
                  startDeskMarquee(currentDeskX.current);
                }}
                onMouseEnter={() => {
                  isDraggingDesk.current = true;
                  deskControls.stop();
                }}
                onMouseLeave={() => {
                  isDraggingDesk.current = false;
                  startDeskMarquee(currentDeskX.current);
                }}
              >
                {section.marqueeItems.map((item: any, idx: number) => (
                  <div
                    key={`desk-${item.id}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    className={`bg-white border-b-2 border-gray-100 hover:border-[#111827] p-5 rounded-none transition-all duration-300 cursor-pointer text-left ${
                      section.isScrollable ? "w-[340px] shrink-0 inline-block" : "w-full"
                    }`}
                  >
                    <div className="w-full h-44 rounded-none overflow-hidden bg-[#FAFAFA] mb-4 border border-gray-100">
                      <img
                        src={item.imageUrl || DEFAULT_CUSTOM_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </div>

                    <div className="flex items-start gap-4.5 w-full px-1">
                      <div className="w-11 h-11 rounded-none border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm p-1.5">
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt="" className="w-full h-full object-cover select-none" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <div className="truncate space-y-0.5 flex-1">
                        <h3 className="text-base font-extrabold text-[#111827] font-sans uppercase truncate">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs font-mono text-gray-500 font-semibold truncate uppercase tracking-wider">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs md:text-sm text-gray-500 font-normal mt-4 whitespace-normal leading-relaxed line-clamp-2 px-1 font-sans">
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
                  <div className="w-14 h-14 rounded-none border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0 p-2 shadow-sm">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2 py-0.5 rounded-none bg-gray-100 text-gray-600 border border-gray-200 text-[9px] font-mono font-bold uppercase tracking-wider mb-1 inline-block">
                      Extension Dossier Node
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-[#111827] font-sans uppercase">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.subtitle && (
                      <p className="text-xs sm:text-sm text-gray-500 font-mono font-semibold uppercase tracking-wider truncate mt-0.5">
                        {selectedItem.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Registry Specifications</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal font-sans bg-[#FAFAFA] p-4 border border-gray-200/60 max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-mono text-gray-400">
                  <div className="flex flex-wrap items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {selectedItem.externalUrl && (
                      <a
                        href={selectedItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-[#111827] text-white hover:bg-black text-xs font-bold font-sans transition-all active:scale-[0.98]"
                      >
                        Launch Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedItem.attachmentUrl && (
                      <a
                        href={selectedItem.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-bold tracking-wide transition-all active:scale-[0.98] text-gray-700 hover:bg-gray-100"
                      >
                        <Download className="w-3.5 h-3.5 text-gray-400" /> Download Asset
                      </a>
                    )}
                  </div>
                  
                  <span className="opacity-40 flex items-center gap-1.5 font-semibold text-[10px]">
                    <Workflow className="w-3.5 h-3.5" /> CUST_SYNC_OK
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