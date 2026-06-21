"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ExternalLink, Download, HelpCircle, X, Workflow } from "lucide-react";

const DEFAULT_CUSTOM_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop";

interface CustomSectionProps {
  sections?: any[];
}

export default function CustomSection({ sections = [] }: CustomSectionProps) {
  if (!sections?.length) return null;

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  return (
    <>
      {sections.map((section: any, sectionIdx: number) => {
        const rawItems = section?.items || [];
        if (!rawItems.length) return null;

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

        return (
          <section
            key={section.id || sectionIdx}
            id={section.title?.toLowerCase().replace(/\s+/g, "") || `custom-${sectionIdx}`}
            className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.03),transparent_50%)] pointer-events-none" />
            
            {/* Section Header */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
                    <Layers className="w-3.5 h-3.5" />
                    Extension Block // {String(sectionIdx + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                    {section.title}.
                  </h2>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL LOOP MARQUEE */}
            {/* ========================================== */}
            <div 
              className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative"
              onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
              onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
              onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
              onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
            >
              {/* Fade masks overlay to smooth scrolling edge transitions */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

              <motion.div
                className="flex flex-col gap-2.5"
                animate={isMobileScrollable && !isMobilePaused && !selectedItem ? { y: [0, -400] } : false}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear"
                  }
                }}
              >
                {mobileMarqueeItems.map((item: any, idx: number) => (
                  <div
                    key={`mob-${item.id || idx}-${idx}`}
                    onClick={() => setSelectedItem(item)}
                    className="w-full h-[70px] bg-[#07070b] border border-white/5 active:border-purple-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
                  >
                    {/* Compact Image/Icon Placement Frame */}
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                      <img 
                        src={item.iconUrl || item.imageUrl || DEFAULT_CUSTOM_IMAGE} 
                        alt="" 
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                    {/* Information Labels Text */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-semibold text-xs text-white truncate">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ========================================== */}
            {/* 2. DESKTOP VIEW: HORIZONTAL TIMELINE RIBBON */}
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
                    duration: 50,
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
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-900 mb-4 border border-white/5 relative">
                      <img
                        src={item.imageUrl || DEFAULT_CUSTOM_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="flex items-start gap-3 w-full">
                      <div className="w-10 h-10 rounded-xl border border-white/10 bg-neutral-900/60 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt="" className="w-full h-full object-cover select-none" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                        )}
                      </div>

                      <div className="truncate space-y-0.5 flex-1 text-left">
                        <h3 className="text-base font-bold text-white tracking-wide truncate">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs font-mono text-neutral-500 truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs md:text-sm text-neutral-400 font-light mt-4 whitespace-normal leading-relaxed text-wrap line-clamp-2 text-left">
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
                <img
                  src={selectedItem.imageUrl || DEFAULT_CUSTOM_IMAGE}
                  alt=""
                  className="w-full h-full object-cover blur-xs brightness-[0.35] scale-102 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-white/10 bg-neutral-900 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-purple-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-mono uppercase tracking-wider mb-1 inline-block">
                      Extension Dossier Node
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold tracking-wide text-white truncate">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.subtitle && (
                      <p className="text-xs sm:text-sm text-neutral-400 font-mono truncate">
                        {selectedItem.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-5 md:space-y-6">
                {selectedItem.description && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Registry Specifications</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light whitespace-pre-line bg-white/[0.01] p-4 rounded-xl border border-white/5 max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {selectedItem.externalUrl && (
                      <a
                        href={selectedItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold font-sans transition-all active:scale-[0.98]"
                      >
                        Launch Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedItem.attachmentUrl && (
                      <a
                        href={selectedItem.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 transition-all active:scale-[0.98]"
                      >
                        <Download className="w-3.5 h-3.5 text-neutral-400" /> Download Asset
                      </a>
                    )}
                  </div>
                  
                  <span className="opacity-30 hidden sm:flex items-center gap-1">
                    <Workflow className="w-3 h-3" /> CUST_SYNC
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