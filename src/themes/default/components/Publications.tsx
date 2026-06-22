"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Calendar, 
  User, 
  Bookmark, 
  X, 
  Workflow, 
  Award
} from "lucide-react";
import { trackProjectClick } from "@/actions/analytics"; // Imported atomic click tracking counter hook

const DEFAULT_PUB_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
];

interface PublicationsProps {
  publications?: any[];
  portfolioId?: string; // Enhanced to safely bind the targeted context instance
}

export default function Publications({ publications = [], portfolioId = "" }: PublicationsProps) {
  const sortedPubs = React.useMemo(() => {
    if (!publications || publications.length === 0) return [];
    return [...publications].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [publications]);

  const isMobileScrollable = sortedPubs.length > 1;

  // Duplicate raw entries to populate uniform animation cycles on mobile rails
  const mobileMarqueeItems = React.useMemo(() => {
    if (sortedPubs.length === 0) return [];
    if (!isMobileScrollable) return sortedPubs;
    let items = [...sortedPubs];
    while (items.length < 9) {
      items = [...items, ...sortedPubs];
    }
    return items;
  }, [sortedPubs, isMobileScrollable]);

  const validPubs = React.useMemo(() => {
    if (sortedPubs.length === 0) return [];
    let items = [...sortedPubs];
    while (items.length < 3) {
      items = [...items, ...sortedPubs];
    }
    return items;
  }, [sortedPubs]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedPub, setSelectedProjectPub] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Animation Controls & Refs for Mobile Interactive Infinite Marquee Track
  const mobileControls = useAnimation();
  const currentMobileY = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activePub = validPubs[activeIndex] || null;

  // Constant speed calculation for uniform velocity on mobile tracking
  const MOBILE_SPEED = 400 / 25; // Target distance over duration (Y-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedPub || !isMountedRef.current) return;

    let targetY = -400;
    // Boundary structural safety verification logic
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

    if (!isDraggingMobile.current && !selectedPub && isMountedRef.current) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isMobileScrollable && !selectedPub) {
      startMobileMarquee(currentMobileY.current);
    } else {
      mobileControls.stop();
    }
    return () => {
      mobileControls.stop();
      isMountedRef.current = false;
    };
  }, [isMobileScrollable, selectedPub]);

  useEffect(() => {
    if (validPubs.length <= 1 || isPaused || selectedPub) {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
      return;
    }

    autoScrollTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % validPubs.length;

        if (verticalScrollContainerRef.current) {
          const itemElement = verticalScrollContainerRef.current.children[nextIndex] as HTMLElement;
          if (itemElement) {
            verticalScrollContainerRef.current.scrollTo({
              top: itemElement.offsetTop - verticalScrollContainerRef.current.offsetTop - 12,
              behavior: "smooth"
            });
          }
        }
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [validPubs, isPaused, selectedPub]);

  if (!sortedPubs.length) return null;

  const getPubCover = (pub: any, idx: number) => {
    return pub?.publicationCover || DEFAULT_PUB_COVERS[idx % DEFAULT_PUB_COVERS.length];
  };

  const getYear = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).getFullYear();
  };

  // Safe client-facing invocation mapping click telemetry to atomic metrics update path
  const handleInteractionTrack = async (publicationId: string) => {
    try {
      await trackProjectClick(portfolioId, publicationId);
    } catch (err) {
      console.warn("Telemetry click registration silently bypassed error boundary:", err);
    }
  };

  return (
    <section
      id="publications"
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      {/* Background Micro Ambiance Flares */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5" />
              Research Index
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Publications.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW */}
      {/* ========================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-2.5 touch-none"
          drag={isMobileScrollable ? "y" : false}
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
          {mobileMarqueeItems.map((pub: any, idx: number) => (
            <div
              key={`mob-${pub.id || idx}-${idx}`}
              onClick={() => setSelectedProjectPub(pub)}
              className="w-full h-[70px] bg-[#07070b] border border-white/5 active:border-purple-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center font-mono text-[10px] text-purple-400">
                {String((sortedPubs.indexOf(pub) % sortedPubs.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-xs text-white truncate">{pub.title}</h3>
                <p className="text-[10px] font-sans text-neutral-500 truncate mt-0.5">
                  {pub.journal || pub.conference || pub.publisher || "Research Literature Record"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT DUAL PANELS SLIDER */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand List */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-neutral-500 tracking-wider font-mono uppercase">
            <span>Dossier Registry ({sortedPubs.length})</span>
            <span className="flex items-center gap-1 text-purple-400/80 animate-pulse">
              <Workflow className="w-3 h-3" /> Auto-Cycle Active
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[380px] overflow-y-auto pr-3 space-y-3 scrollbar-none border border-white/5 bg-white/[0.01] p-3 rounded-2xl backdrop-blur-xl transition-all duration-300"
            style={{ scrollSnapType: "y mandatory" }}
          >
            {validPubs.map((pub: any, idx: number) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={`desk-${pub.id}-${idx}`}
                  onClick={() => {
                    setActiveIndex(idx);
                    setSelectedProjectPub(pub);
                  }}
                  style={{ scrollSnapAlign: "start" }}
                  className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-300 relative border group h-[100px] flex flex-col justify-center ${
                    isCurrent
                      ? "bg-gradient-to-r from-purple-950/20 to-white/[0.03] border-purple-500/40 shadow-xl shadow-purple-500/5"
                      : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="pubIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 rounded-l-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 truncate w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono ${isCurrent ? "text-purple-400" : "text-neutral-600"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-semibold text-base tracking-wide truncate ${isCurrent ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}>
                          {pub.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 truncate max-w-[90%] font-light">
                        {pub.journal || pub.conference || pub.publisher || "Scientific Research Publication Node."}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono shrink-0 group-hover:text-purple-400 transition-colors">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand Dynamic Preview Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[480px]">
          <AnimatePresence mode="wait">
            {activePub && (
              <motion.div
                key={activePub.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedProjectPub(activePub)}
                className="w-full bg-neutral-950 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[480px] cursor-pointer group"
              >
                <div>
                  <div className="w-full h-64 rounded-2xl overflow-hidden bg-neutral-900 relative mb-6 border border-white/5">
                    <img
                      src={getPubCover(activePub, activeIndex)}
                      alt={activePub.title}
                      className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    
                    {activePub.featured && (
                      <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500 text-white tracking-wider uppercase shadow-md shadow-purple-500/10">
                        Featured Printing
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md max-w-[80%] line-clamp-1 text-left">
                        {activePub.title}
                      </h3>
                      <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-400 bg-black/60 border border-white/10 rounded px-2 py-0.5 backdrop-blur-md shrink-0">
                        <Calendar className="w-3 h-3" /> {getYear(activePub.publicationDate)}
                      </span>
                    </div>
                  </div>

                  {(activePub.journal || activePub.conference || activePub.publisher) && (
                    <div className="space-y-2 text-left">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Distribution Channel Node</div>
                      <div className="flex flex-wrap gap-2">
                        {activePub.journal && (
                          <span className="px-2.5 py-1 rounded bg-purple-950/20 border border-purple-500/20 text-xs text-purple-400 font-mono">
                            Journal: {activePub.journal}
                          </span>
                        )}
                        {activePub.conference && (
                          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-neutral-300 font-mono">
                            Conference: {activePub.conference}
                          </span>
                        )}
                        {activePub.publisher && (
                          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-neutral-400 font-mono">
                            {activePub.publisher}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  {activePub.pdfUrl && (
                    <a
                      href={activePub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleInteractionTrack(activePub.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <FileText className="w-4 h-4" /> Source PDF
                    </a>
                  )}
                  {activePub.publicationUrl && (
                    <a
                      href={activePub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleInteractionTrack(activePub.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all"
                    >
                      View Publication <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Details Pop-up Modal Frame Layer */}
      <AnimatePresence>
        {selectedPub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedProjectPub(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-3xl bg-neutral-950 border border-white/10 rounded-2xl overflow-y-auto max-h-[90vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProjectPub(null)}
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
                aria-label="Close publication panel view"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-44 sm:h-64 bg-neutral-900 relative">
                <img
                  src={getPubCover(selectedPub, sortedPubs.indexOf(selectedPub))}
                  alt={selectedPub.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold tracking-wider uppercase mb-1 inline-block font-mono">
                    Scientific Literature Ledger Node
                  </span>
                  <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    {selectedPub.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 font-sans">
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Document Date</div>
                    <div className="text-xs font-medium text-neutral-200 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> 
                      {getYear(selectedPub.publicationDate)} Release
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Digital DOI</div>
                    <div className="text-xs font-mono text-neutral-300 mt-0.5 flex items-center gap-1.5 truncate" title={selectedPub.doi || "No registered identifier Token"}>
                      <Bookmark className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{selectedPub.doi || "Generic Identifier"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Citations Index</div>
                    <div className="text-xs font-medium text-purple-400 mt-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>{typeof selectedPub.citations === "number" && selectedPub.citations > 0 ? `${selectedPub.citations} Citations` : "0 Citations"}</span>
                    </div>
                  </div>
                </div>

                {selectedPub.abstract && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Document Abstract Dossier</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light whitespace-pre-line bg-white/[0.01] p-4 rounded-xl border border-white/5 max-h-[180px] overflow-y-auto scrollbar-none">
                      {selectedPub.abstract}
                    </p>
                  </div>
                )}

                {selectedPub.authors?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Co-Authors Array</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPub.authors.map((author: string, i: number) => (
                        <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-neutral-300 font-sans">
                          <User className="w-3 h-3 text-neutral-500" />
                          <span>{author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedPub.journal || selectedPub.conference || selectedPub.publisher) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-500 font-mono pt-2 border-t border-white/5">
                    {selectedPub.journal && <span>Journal: <span className="text-neutral-300">{selectedPub.journal}</span></span>}
                    {selectedPub.conference && <span>Conference: <span className="text-neutral-300">{selectedPub.conference}</span></span>}
                    {selectedPub.publisher && <span>Publisher: <span className="text-neutral-400">{selectedPub.publisher}</span></span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-white/5">
                  {selectedPub.publicationUrl && (
                    <a
                      href={selectedPub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleInteractionTrack(selectedPub.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Global Publication Hub
                    </a>
                  )}
                  {selectedPub.pdfUrl && (
                    <a
                      href={selectedPub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleInteractionTrack(selectedPub.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium tracking-wide transition-all active:scale-[0.98] text-neutral-300"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" /> Download PDF
                    </a>
                  )}
                  
                  <span className="opacity-30 hidden sm:flex items-center gap-1 ml-auto font-mono text-xs">
                    <Workflow className="w-3 h-3" /> PUB_SYNC
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}