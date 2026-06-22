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
  Award,
  Terminal,
  Cpu,
  GitBranch
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

  return (
    <section
      id="publications"
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Background Matrix Mesh Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* IDE Header Interface Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Research Index</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">technical-publications.md</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> cat citations.json | grep --color=always "abstract"
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL LOOP MARQUEE */}
      {/* ========================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto px-4 h-[240px] overflow-hidden relative border-x border-b border-[#30363D] bg-[#161B22]/20 rounded-b-lg">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0D1117] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0D1117] to-transparent z-20 pointer-events-none" />

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
              className="w-full h-[70px] bg-[#161B22] border border-[#30363D] active:border-[#58A6FF] rounded-lg p-3 flex items-center gap-3 shadow-md shrink-0 cursor-pointer"
            >
              <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] shrink-0 flex items-center justify-center text-[10px] text-[#58A6FF]">
                #{String((sortedPubs.indexOf(pub) % sortedPubs.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-bold text-xs text-white truncate">{pub.title}</h3>
                <p className="text-[10px] text-neutral-500 truncate mt-0.5">
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
      <div className="hidden md:grid relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Continuous Automated Tracking List Scroller */}
        <div className="lg:col-span-5 w-full space-y-3">
          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500 tracking-tight">
            <span>index: documents ({sortedPubs.length})</span>
            <span className="flex items-center gap-1 text-[#7EE787]">
              <Workflow className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> live_buffer
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[380px] overflow-y-auto pr-2 space-y-2 border border-[#30363D] bg-[#161B22]/30 p-2 rounded-lg"
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
                  className={`w-full text-left p-3.5 rounded border transition-all duration-150 relative group h-[90px] flex flex-col justify-center ${
                    isCurrent
                      ? "bg-[#1C2128] border-[#58A6FF] shadow-sm"
                      : "bg-transparent border-[#30363D]/60 hover:border-[#30363D] hover:bg-[#161B22]/40"
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
                        <span className={`text-[10px] ${isCurrent ? "text-[#58A6FF] font-bold" : "text-neutral-600"}`}>
                          0{idx + 1}
                        </span>
                        <h3 className={`font-bold text-sm tracking-tight truncate ${isCurrent ? "text-white" : "text-[#C9D1D9] group-hover:text-white"}`}>
                          {pub.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 truncate max-w-[92%] font-sans">
                        {pub.journal || pub.conference || pub.publisher || "Scientific Research Publication Node."}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 shrink-0 group-hover:text-[#58A6FF]">
                      cat →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Live Dynamic Preview Panel Frame */}
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
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-5 relative flex flex-col justify-between overflow-hidden shadow-md min-h-[440px] cursor-pointer hover:bg-[#1C2128]"
              >
                <div>
                  <div className="w-full h-56 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] relative mb-4">
                    <img
                      src={getPubCover(activePub, activeIndex)}
                      alt={activePub.title}
                      className="w-full h-full object-cover select-none filter opacity-70 contrast-125 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />
                    
                    {activePub.featured && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7EE787] text-[#0D1117] uppercase tracking-wider shadow">
                        PEER_REVIEWED
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight drop-shadow-md max-w-[75%] truncate text-left">
                        {activePub.title}
                      </h3>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400 bg-[#0D1117] border border-[#30363D] px-1.5 py-0.5 rounded shrink-0">
                        <Calendar className="w-3 h-3 text-neutral-500" /> {getYear(activePub.publicationDate)}
                      </span>
                    </div>
                  </div>

                  {/* Context Blueprint Framework Tags */}
                  {(activePub.journal || activePub.conference || activePub.publisher) && (
                    <div className="space-y-1.5 text-left">
                      <div className="text-[9px] text-neutral-500 uppercase font-bold">Distribution Channel Node</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activePub.journal && (
                          <span className="px-2 py-0.5 rounded bg-[#58A6FF]/5 border border-[#58A6FF]/10 text-[11px] text-[#58A6FF]">
                            journal:{activePub.journal.toLowerCase().replace(/\s+/g, "-")}
                          </span>
                        )}
                        {activePub.conference && (
                          <span className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                            conf:{activePub.conference.toLowerCase().replace(/\s+/g, "-")}
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

                <div className="pt-4 mt-4 border-t border-[#30363D] flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                  {activePub.pdfUrl && (
                    <a
                      href={activePub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-xs text-neutral-400 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" /> Source PDF
                    </a>
                  )}
                  {activePub.publicationUrl && (
                    <a
                      href={activePub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-white transition-colors"
                    >
                      View Publication <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" />
                    </a>
                  )}
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
            className="fixed inset-0 bg-[#0D1117]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedProjectPub(null)}
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
                  <span className="text-neutral-400 font-bold">document_inspector.sh</span>
                </div>
                <button
                  onClick={() => setSelectedProjectPub(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close publication panel view"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-full h-36 bg-[#0D1117] relative border-b border-[#30363D]">
                <img
                  src={getPubCover(selectedPub, sortedPubs.indexOf(selectedPub))}
                  alt={selectedPub.title}
                  className="w-full h-full object-cover filter opacity-30 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                    Scientific Literature Ledger Node
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                    {selectedPub.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Document Date</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" /> 
                      {getYear(selectedPub.publicationDate)} Release
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Digital DOI</div>
                    <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5 truncate font-mono" title={selectedPub.doi || "No registered identifier Token"}>
                      <Bookmark className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{selectedPub.doi || "Generic DOI"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Citations Index</div>
                    <div className="text-xs text-[#7EE787] mt-0.5 flex items-center gap-1.5 font-bold">
                      <Award className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{typeof selectedPub.citations === "number" && selectedPub.citations > 0 ? `${selectedPub.citations} Citations` : "0 Citations"}</span>
                    </div>
                  </div>
                </div>

                {selectedPub.abstract && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <GitBranch size={10} className="text-[#F78166]" /> Document Abstract Dossier
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#C9D1D9] bg-[#0D1117] p-3 rounded border border-[#30363D] font-sans whitespace-pre-line max-h-[180px] overflow-y-auto scrollbar-none">
                      {selectedPub.abstract}
                    </p>
                  </div>
                )}

                {selectedPub.authors?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold">Co-Authors Array</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPub.authors.map((author: string, i: number) => (
                        <div key={i} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                          <User className="w-3 h-3 text-neutral-500" />
                          <span>{author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedPub.journal || selectedPub.conference || selectedPub.publisher) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500 border-t border-[#30363D] pt-2">
                    {selectedPub.journal && <span>Journal: <span className="text-white font-bold">{selectedPub.journal}</span></span>}
                    {selectedPub.conference && <span>Conference: <span className="text-white font-bold">{selectedPub.conference}</span></span>}
                    {selectedPub.publisher && <span>Publisher: <span className="text-neutral-400">{selectedPub.publisher}</span></span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-[#30363D]">
                  {selectedPub.publicationUrl && (
                    <a
                      href={selectedPub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] font-bold text-white transition-colors text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" /> Global Publication Hub
                    </a>
                  )}
                  {selectedPub.pdfUrl && (
                    <a
                      href={selectedPub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-neutral-300 transition-colors text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" /> Download PDF
                    </a>
                  )}
                  
                  <span className="text-neutral-500 hidden sm:flex items-center gap-1 ml-auto">
                    <GitBranch className="w-3 h-3 text-neutral-600" /> references_sync
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