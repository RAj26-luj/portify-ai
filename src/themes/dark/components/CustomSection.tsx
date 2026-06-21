"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ExternalLink, Download, HelpCircle, X, Workflow, Cpu, Radio, Terminal, Box } from "lucide-react";

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
      <style jsx global>{`
        @keyframes cyber-scan-custom {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .cyber-custom-scanline {
          animation: cyber-scan-custom 8s linear infinite;
        }
        .cyber-grid-dense {
          background-image: linear-gradient(rgba(0, 229, 255, 0.01) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.01) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
      `}</style>

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
            className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
          >
            {/* Cyberpunk Decorative Underlays */}
            <div className="absolute inset-0 cyber-grid-dense pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,229,255,0.04),transparent_50%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#7C3AED]/3 rounded-full filter blur-[100px] pointer-events-none" />

            {/* Section Header HUD */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#7C3AED]/30 text-[10px] font-mono text-[#7C3AED] tracking-[0.2em] uppercase mb-4 shadow-[0_0_10px_rgba(124,58,237,0.1)]">
                    <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                    EXT_MODULE // {String(sectionIdx + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                    // {section.title?.toUpperCase().replace(/\s+/g, "_")}
                  </h2>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  <span>DATA_CONDUIT: STREAMING</span>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* 1. MOBILE RESPONSIVE VIEW: CORE HUD VERTICAL SCROLLER */}
            {/* ========================================== */}
            <div 
              className="block md:hidden w-full max-w-md mx-auto px-4 h-[260px] overflow-hidden relative bg-[#0B1120]/40 border-y border-neutral-800/80"
              onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
              onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
              onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
              onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
            >
              {/* Terminal scanline shader bars */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#050816] to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050816] to-transparent z-20 pointer-events-none" />

              <motion.div
                className="flex flex-col gap-3 py-3"
                animate={isMobileScrollable && !isMobilePaused && !selectedItem ? { y: [0, -420] } : false}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
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
                    
                    {/* Compact Image Frame */}
                    <div className="w-12 h-12 rounded bg-[#0B1120] border border-neutral-800 shrink-0 flex items-center justify-center overflow-hidden mix-blend-luminosity">
                      <img 
                        src={item.iconUrl || item.imageUrl || DEFAULT_CUSTOM_IMAGE} 
                        alt="" 
                        className="w-full h-full object-cover select-none filter contrast-125"
                      />
                    </div>
                    {/* Information Labels */}
                    <div className="flex-1 min-w-0 text-left space-y-0.5">
                      <h3 className="font-bold font-mono text-xs text-white truncate uppercase tracking-wide">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-[10px] font-mono text-neutral-400 truncate">// {item.subtitle}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ========================================== */}
            {/* 2. DESKTOP VIEW: CYBERPUNK LAB SYSTEM CELLS */}
            {/* ========================================== */}
            <div
              className={`hidden md:block relative w-full overflow-hidden py-6 ${isScrollable ? "group/track cursor-none" : ""}`}
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
                    className={`bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/50 p-6 rounded-none backdrop-blur-xl transition-all duration-300 shadow-[0_20px_45px_rgba(0,0,0,0.5)] cursor-pointer hover:-translate-y-2 overflow-hidden relative group/card ${
                      isScrollable ? "w-[360px] shrink-0 inline-block" : "w-full"
                    }`}
                  >
                    {/* Tech Trim Frame Lines */}
                    <div className="absolute top-0 left-0 w-4 h-[2px] bg-neutral-800 group-hover/card:bg-[#00E5FF] transition-colors" />
                    <div className="absolute top-0 left-0 w-[2px] h-4 bg-neutral-800 group-hover/card:bg-[#00E5FF] transition-colors" />
                    <div className="absolute bottom-0 right-0 w-4 h-[2px] bg-neutral-800 group-hover/card:bg-[#7C3AED] transition-colors" />
                    <div className="absolute bottom-0 right-0 w-[2px] h-4 bg-neutral-800 group-hover/card:bg-[#7C3AED] transition-colors" />

                    <div className="w-full h-44 rounded-none overflow-hidden bg-[#050816] mb-5 border border-neutral-900 group-hover/card:border-neutral-800 relative transition-colors">
                      <img
                        src={item.imageUrl || DEFAULT_CUSTOM_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover select-none filter grayscale contrast-125 saturate-150 group-hover/card:grayscale-0 scale-105 group-hover/card:scale-100 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-[#00E5FF]/5 mix-blend-color opacity-100 group-hover/card:opacity-0 transition-opacity" />
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] opacity-0 group-hover/card:opacity-100 cyber-custom-scanline pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-4 w-full">
                      <div className="w-11 h-11 border border-neutral-800 bg-[#050816] overflow-hidden flex items-center justify-center shrink-0 p-2 shadow-inner group-hover/card:border-[#00E5FF]/30 transition-colors">
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt="" className="w-full h-full object-contain select-none filter brightness-110" />
                        ) : (
                          <Box className="w-5 h-5 text-[#7C3AED]" />
                        )}
                      </div>

                      <div className="truncate space-y-1 flex-1 text-left">
                        <h3 className="text-base font-black font-mono text-white uppercase tracking-wider truncate group-hover:text-[#00E5FF] transition-colors">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs font-mono text-neutral-400 truncate">
                            // {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-neutral-400 font-mono mt-4 whitespace-normal leading-relaxed line-clamp-2 text-left border-t border-neutral-900 pt-3 group-hover/card:text-neutral-300 transition-colors">
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

      {/* COMPREHENSIVE CYBERPUNK DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/95 z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-2xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative rounded-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Header */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">MODULE_INSPECTOR // PARAM_RECORD</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-48 bg-[#050816] overflow-hidden flex items-end p-6 border-b border-neutral-900">
                <img
                  src={selectedItem.imageUrl || DEFAULT_CUSTOM_IMAGE}
                  alt=""
                  className="w-full h-full object-cover filter brightness-[0.25] saturate-150 mix-blend-luminosity absolute inset-0 z-0 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                
                {/* Tech grid mesh lines inside modal image background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

                <div className="flex items-center gap-4 relative z-20 w-full">
                  <div className="w-14 h-14 bg-[#0B1120] border border-neutral-800 rounded-none overflow-hidden flex items-center justify-center shrink-0 shadow-2xl p-2">
                    {selectedItem.iconUrl ? (
                      <img src={selectedItem.iconUrl} alt={selectedItem.title} className="w-full h-full object-contain filter brightness-110" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-[#00E5FF]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate flex-1 text-left">
                    <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[9px] font-mono uppercase tracking-[0.15em] inline-block mb-1">
                      EXT_LOG_NODE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white uppercase truncate">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.subtitle && (
                      <p className="text-xs sm:text-sm text-neutral-400 font-mono truncate">
                        // {selectedItem.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 bg-[#0B1120]">
                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> REGISTRY_SPECIFICATIONS
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-mono whitespace-pre-line bg-[#050816] p-4 rounded-none border border-neutral-800 max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-neutral-500">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                    {selectedItem.externalUrl && (
                      <a
                        href={selectedItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-mono font-bold uppercase tracking-widest transition-colors"
                      >
                        LAUNCH_PORTAL <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedItem.attachmentUrl && (
                      <a
                        href={selectedItem.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#050816] hover:bg-[#0B1120] border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-mono font-bold uppercase tracking-widest transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-neutral-400" /> DOWNLOAD_ASSET
                      </a>
                    )}
                  </div>
                  
                  <span className="flex items-center gap-2 justify-center sm:justify-start text-[10px] tracking-widest uppercase">
                    <Radio className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" /> MODULE_STREAM_SYNCHRONIZED
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