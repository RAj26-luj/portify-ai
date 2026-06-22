"use client";

import React, { useEffect, useState, useRef } from "react";
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

const DEFAULT_PUB_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
];

interface PublicationsProps {
  publications?: any[];
}

export default function Publications({ publications = [] }: PublicationsProps) {
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
  const MOBILE_SPEED = 420 / 25; // Target distance over duration (Y-axis pixels per second)

  const startMobileMarquee = async (fromY: number) => {
    if (isDraggingMobile.current || selectedPub || !isMountedRef.current) return;

    const targetY = -420;
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

  return (
    <section
      id="publications"
      className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200 select-none"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              08 / Scientific Index
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
              Publications.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
      {/* ========================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3 touch-none"
          drag={isMobileScrollable ? "y" : false}
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
          {mobileMarqueeItems.map((pub: any, idx: number) => (
            <div
              key={`mob-${pub.id || idx}-${idx}`}
              onClick={() => setSelectedProjectPub(pub)}
              className="w-full bg-[#FAFAFA] border border-gray-200 rounded-none p-4 flex items-center gap-4 cursor-pointer shrink-0 text-left transition-colors hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 shrink-0 flex items-center justify-center font-mono text-[11px] font-bold text-gray-400">
                {String((sortedPubs.indexOf(pub) % sortedPubs.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-[#111827] truncate font-sans uppercase">{pub.title}</h3>
                <p className="text-[11px] font-sans text-gray-500 truncate mt-1">
                  {pub.journal || pub.conference || pub.publisher || "Research Literature Record"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: EDITORIAL REGISTRY SPLIT BLOCK */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Continuous Track Registry Dossier List */}
        <div className="lg:col-span-5 w-full space-y-3">
          <div className="flex items-center justify-between px-1 text-[11px] text-gray-400 tracking-wider font-mono uppercase font-bold">
            <span>Dossier Registry ({sortedPubs.length})</span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <Workflow className="w-3.5 h-3.5" /> Auto-Cycle Active
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => false}
            className="w-full max-h-[380px] overflow-y-auto space-y-2 pr-2 scrollbar-none border border-gray-200 bg-[#FAFAFA] p-2 rounded-lg text-left"
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
                  className={`w-full p-3.5 rounded border transition-all duration-150 relative group h-[90px] flex flex-col justify-center text-left ${
                    isCurrent
                      ? "bg-[#1C2128] border-[#58A6FF] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white hover:border-gray-300"
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="pubIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#58A6FF]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 truncate w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] ${isCurrent ? "text-[#58A6FF] font-bold" : "text-gray-300"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-extrabold text-sm tracking-tight font-sans uppercase truncate ${isCurrent ? "text-white" : "text-gray-500"}`}>
                          {pub.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-[92%] font-normal font-sans">
                        {pub.journal || pub.conference || pub.publisher || "Scientific Research Publication Node."}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400 shrink-0 uppercase tracking-wide">
                      View →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Editorial Exhibition Canvas Dashboard */}
        <div className="lg:col-span-7 w-full h-full min-h-[440px]">
          <AnimatePresence mode="wait">
            {activePub && (
              <motion.div
                key={activePub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedProjectPub(activePub)}
                className="w-full bg-[#FAFAFA] border-b-2 border-gray-100 hover:border-[#111827] p-5 relative flex flex-col justify-between overflow-hidden shadow-md min-h-[440px] cursor-pointer group text-left"
              >
                <div>
                  <div className="w-full h-56 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] relative mb-4">
                    <img
                      src={getPubCover(activePub, activeIndex)}
                      alt={activePub.title}
                      className="w-full h-full object-cover select-none filter opacity-70 contrast-125 mix-blend-luminosity transition-all duration-150"
                    />
                    
                    {activePub.featured && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7EE787] text-[#0D1117] uppercase tracking-wider shadow">
                        PEER_REVIEWED
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4">
                      <div className="bg-white/95 border border-gray-200 px-3 py-1.5 text-left max-w-[75%]">
                        <h3 className="text-sm font-extrabold text-[#111827] font-sans uppercase truncate tracking-tight">
                          {activePub.title}
                        </h3>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400 bg-[#0D1117] border border-[#30363D] px-1.5 py-0.5 rounded shrink-0">
                        <Calendar className="w-3 h-3 text-neutral-500" /> {getYear(activePub.publicationDate)}
                      </span>
                    </div>
                  </div>

                  {/* Context Blueprint Framework Tags */}
                  {(activePub.journal || activePub.conference || activePub.publisher) && (
                    <div className="space-y-1.5 text-left px-1">
                      <div className="text-[9px] text-neutral-500 uppercase font-bold">Distribution Channel Node</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activePub.journal && (
                          <span className="px-2 py-0.5 rounded bg-[#58A6FF]/5 border border-[#58A6FF]/10 text-[11px] text-[#58A6FF]">
                            JOURNAL: {activePub.journal}
                          </span>
                        )}
                        {activePub.conference && (
                          <span className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                            CONFERENCE: {activePub.conference}
                          </span>
                        )}
                        {activePub.publisher && (
                          <span className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-neutral-400">
                            {activePub.publisher}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between gap-3 px-1" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wide">
                    Click card to unwrap research matrix
                  </span>
                  <div className="flex gap-3">
                    {activePub.pdfUrl && (
                      <a
                        href={activePub.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-xs text-neutral-400 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gray-400" /> Source PDF
                      </a>
                    )}
                    {activePub.publicationUrl && (
                      <a
                        href={activePub.publicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-white transition-colors"
                      >
                        View Publication <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Details Pop-up Modal Box Layer */}
      <AnimatePresence>
        {selectedPub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedProjectPub(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-none overflow-y-auto max-h-[85vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProjectPub(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
                aria-label="Close publication panel view"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-48 sm:h-64 bg-[#FAFAFA] relative border-b border-gray-200">
                <img
                  src={getPubCover(selectedPub, sortedPubs.indexOf(selectedPub))}
                  alt={selectedPub.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2.5 py-0.5 rounded-none bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold tracking-widest uppercase mb-2 inline-block font-mono">
                    Scientific Literature Ledger Node
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] font-sans uppercase">
                    {selectedPub.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAFAFA] border border-gray-200 font-sans">
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Document Date</div>
                    <div className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1.5 text-left">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> 
                      {getYear(selectedPub.publicationDate)} Release
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Digital DOI</div>
                    <div className="text-xs font-mono font-bold text-gray-600 mt-1 flex items-center gap-1.5 truncate text-left" title={selectedPub.doi || "No registered identifier Token"}>
                      <Bookmark className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{selectedPub.doi || "Generic Identifier"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Citations Index</div>
                    <div className="text-xs font-bold text-[#111827] mt-1 flex items-center gap-1.5 text-left">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      <span>{typeof selectedPub.citations === "number" && selectedPub.citations > 0 ? `${selectedPub.citations} Citations` : "0 Citations"}</span>
                    </div>
                  </div>
                </div>

                {selectedPub.abstract && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Document Abstract Dossier</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal font-sans bg-[#FAFAFA] p-4 border border-gray-200/60 max-h-[160px] overflow-y-auto scrollbar-none">
                      {selectedPub.abstract}
                    </p>
                  </div>
                )}

                {selectedPub.authors?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Co-Authors Array</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPub.authors.map((author: string, i: number) => (
                        <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-semibold text-gray-700 font-sans shadow-sm">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedPub.journal || selectedPub.conference || selectedPub.publisher) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-mono pt-3 border-t border-gray-200 text-left font-bold">
                    {selectedPub.journal && <span>Journal: <span className="text-[#111827]">{selectedPub.journal}</span></span>}
                    {selectedPub.conference && <span>Conference: <span className="text-[#111827]">{selectedPub.conference}</span></span>}
                    {selectedPub.publisher && <span>Publisher: <span className="text-gray-600">{selectedPub.publisher}</span></span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-gray-100">
                  {selectedPub.publicationUrl && (
                    <a
                      href={selectedPub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white hover:bg-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Global Publication Hub
                    </a>
                  )}
                  {selectedPub.pdfUrl && (
                    <a
                      href={selectedPub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border border-gray-200 text-xs font-bold uppercase tracking-widest transition-colors text-gray-700 hover:bg-gray-100 rounded-none"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400" /> Download PDF
                    </a>
                  )}
                  
                  <span className="opacity-40 hidden sm:flex items-center gap-1.5 ml-auto font-mono text-xs font-bold text-gray-400">
                    <Workflow className="w-3.5 h-3.5" /> PUB_SYNC_OK
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