"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Layers, ExternalLink, Download, HelpCircle, X, Terminal, Cpu, GitBranch } from "lucide-react";

const DEFAULT_CUSTOM_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop";

interface CustomSectionProps {
  sections?: any[];
}

export default function CustomSection({ sections = [] }: CustomSectionProps) {
  // 1. Initialize all React Hooks unconditionally at the top level
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

  // 2. Compute loops and marquee tracks ahead of the rendering loops inside a useMemo hook
  const validSections = useMemo(() => {
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
  const MOBILE_SPEED = 400 / 25; // Target distance over duration (Y-axis pixels per second)
  const DESK_SPEED = 2000 / 50; // Target distance over duration (X-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedItem || !isMountedRef.current) return;

    const targetY = -400;
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

    const targetX = -2000;
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

    const hasScrollableMobileSection = validSections.some(s => s.isMobileScrollable);
    const hasScrollableDeskSection = validSections.some(s => s.isScrollable);

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
  }, [validSections, isPaused, selectedItem]);

  // 3. Early conditional return clauses moved below all top-level Hook declarations
  if (!sections?.length || validSections.length === 0) {
    return null;
  }

  return (
    <>
      {validSections.map((section: any) => {
        return (
          <section
            key={section.id || section.sectionIdx}
            id={section.title?.toLowerCase().replace(/\s+/g, "") || `custom-${section.sectionIdx}`}
            className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
          >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            
            {/* IDE Header Interface */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
              <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#58A6FF]" />
                  <span className="font-bold text-[#C9D1D9]">{section.title || "Custom Extension"}</span>
                  <span className="text-neutral-600">/</span>
                  <span className="text-[11px] text-[#7EE787]">submodule_0{section.sectionIdx + 1}.log</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-neutral-500" />
                </div>
              </div>
              <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
                <p className="text-[11px] text-neutral-400">
                  <span className="text-[#F78166]">$</span> tail -n 5 runtime_extensions.conf
                </p>
              </div>
            </div>

            {/* ========================================== */}
            {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL LOOP MARQUEE */}
            {/* ========================================== */}
            <div className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative">
              {/* Fade masks overlay to smooth scrolling edge transitions */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0D1117] to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0D1117] to-transparent z-20 pointer-events-none" />

              <motion.div
                className="flex flex-col gap-2.5 touch-none"
                drag={section.isMobileScrollable ? "y" : false}
                dragConstraints={{ top: -400, bottom: 0 }}
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
                    className="w-full h-[70px] bg-[#161B22] border border-[#30363D] active:border-[#58A6FF] rounded-lg p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
                  >
                    {/* Compact Image/Icon Placement Frame */}
                    <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] shrink-0 flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.iconUrl || item.imageUrl || DEFAULT_CUSTOM_IMAGE} 
                        alt="" 
                        className="w-full h-full object-cover select-none filter opacity-80"
                      />
                    </div>
                    {/* Information Labels Text */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-bold text-xs text-white truncate">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">{item.subtitle}</p>
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
              {section.isScrollable && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0D1117] to-transparent z-20 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0D1117] to-transparent z-20 pointer-events-none" />
                </>
              )}

              <motion.div
                className={
                  section.isScrollable 
                    ? "flex gap-4 whitespace-nowrap min-w-full w-max px-4 touch-none" 
                    : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center"
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
                    className={`bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] p-4 rounded-lg transition-all duration-200 shadow-md cursor-pointer hover:bg-[#1C2128] overflow-hidden ${
                      section.isScrollable ? "w-[340px] shrink-0 inline-block" : "w-full"
                    }`}
                  >
                    <div className="w-full h-36 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] mb-3 relative">
                      <img
                        src={item.imageUrl || DEFAULT_CUSTOM_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover select-none filter opacity-70 mix-blend-luminosity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-40" />
                    </div>

                    <div className="flex items-start gap-3 w-full">
                      <div className="w-9 h-9 rounded border border-[#30363D] bg-[#0D1117] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt="" className="w-full h-full object-cover select-none filter brightness-90" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-[#58A6FF]" />
                        )}
                      </div>

                      <div className="truncate space-y-0.5 flex-1 text-left">
                        <h3 className="text-sm font-bold text-white tracking-tight truncate">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs text-neutral-500 truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-neutral-400 mt-3 font-sans line-clamp-2 text-left whitespace-normal leading-relaxed">
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
                  <span className="text-neutral-400 font-bold">extension_inspector.sh</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative h-36 bg-[#0D1117] overflow-hidden border-b border-[#30363D]">
                <img
                  src={selectedItem.imageUrl || DEFAULT_CUSTOM_IMAGE}
                  alt=""
                  className="w-full h-full object-cover filter brightness-[0.25] blur-xs select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-[#30363D] bg-[#0D1117] overflow-hidden flex items-center justify-center shrink-0 p-1">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.title} className="w-full h-full object-cover filter brightness-90" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-[#58A6FF]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                      METADATA_NODE
                    </span>
                    <h3 className="text-base font-bold text-white truncate">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.subtitle && (
                      <p className="text-xs text-neutral-400 truncate">
                        {selectedItem.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {selectedItem.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <GitBranch size={10} className="text-[#F78166]" /> Registry Specifications
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#C9D1D9] font-sans whitespace-pre-line bg-[#0D1117] p-3 rounded border border-[#30363D] max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-[#30363D] flex items-center justify-between text-xs">
                  <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {selectedItem.externalUrl && (
                      <a
                        href={selectedItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] font-bold text-white transition-colors"
                      >
                        Launch Portal <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" />
                      </a>
                    )}
                    {selectedItem.attachmentUrl && (
                      <a
                        href={selectedItem.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-neutral-300 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-neutral-500" /> Fetch Asset
                      </a>
                    )}
                  </div>
                  
                  <span className="text-neutral-500 hidden sm:flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-neutral-600" /> structural_sync
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