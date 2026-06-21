"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Cpu,
  Radio,
  Terminal,
  Activity
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
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activePub = validPubs[activeIndex] || null;

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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      <style jsx global>{`
        @keyframes pub-scan-lines {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .pub-scanline-rail {
          animation: pub-scan-lines 6s linear infinite;
        }
        .cyber-grid-publications {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 3.5rem 3.5rem;
        }
      `}</style>

      {/* Cyberpunk Lab Environmental Enhancements */}
      <div className="absolute inset-0 cyber-grid-publications pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,229,255,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-[#7C3AED]/4 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Lab Header HUD */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <BookOpen className="w-3.5 h-3.5 text-[#00FF9D]" />
              LITERATURE_INDEX
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              // RESEARCH_INDEX
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#00FF9D] animate-pulse" />
            <span>DATABANK: STABLE_FEED</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED VERTICAL PACKET FEED */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-4 h-[260px] overflow-hidden relative bg-[#0B1120]/40 border-y border-neutral-800/80"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#050816] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050816] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3 py-3"
          animate={isMobileScrollable && !isMobilePaused && !selectedPub ? { y: [0, -420] } : false}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 22,
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((pub: any, idx: number) => (
            <div
              key={`mob-${pub.id || idx}-${idx}`}
              onClick={() => setSelectedProjectPub(pub)}
              className="w-full h-[76px] bg-[#050816] border border-neutral-800 active:border-[#00E5FF] p-3.5 flex items-center gap-4 shrink-0 cursor-pointer relative"
            >
              <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-[#00E5FF]" />
              <div className="w-12 h-12 rounded-none bg-[#0B1120] border border-neutral-800 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-[#00E5FF]">
                [{String((sortedPubs.indexOf(pub) % sortedPubs.length) + 1).padStart(2, '0')}]
              </div>
              <div className="flex-1 min-w-0 text-left space-y-0.5">
                <h3 className="font-bold font-mono text-xs text-white truncate uppercase tracking-wide">{pub.title}</h3>
                <p className="text-[10px] font-mono text-neutral-400 truncate">
                  // {pub.journal || pub.conference || pub.publisher || "Research Literature Record"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: SPLIT DUAL PANELS ASYMMETRICAL LABORATORY */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Hand: Continuous Automated Tracking List Scroller */}
        <div className="lg:col-span-5 w-full flex flex-col justify-between space-y-4">
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between px-1 text-[10px] text-neutral-500 tracking-widest font-mono uppercase">
              <span>DOSSIER_REGISTRY ({sortedPubs.length})</span>
              <span className="flex items-center gap-1.5 text-[#00FF9D] font-bold">
                <Cpu className="w-3.5 h-3.5 animate-spin duration-3000" /> SYSTEM_TRACK_SYNC
              </span>
            </div>

            <div
              ref={verticalScrollContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-full max-h-[388px] overflow-y-auto pr-2 space-y-3 scrollbar-none border border-neutral-900 bg-[#0B1120]/40 p-3 rounded-none backdrop-blur-xl transition-all duration-300"
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
                    className={`w-full text-left p-4 rounded-none cursor-pointer transition-all duration-300 relative border h-[110px] flex flex-col justify-center ${
                      isCurrent
                        ? "bg-[#0B1120] border-[#00E5FF]/40 shadow-[0_0_25px_rgba(0,229,255,0.08)]"
                        : "bg-transparent border-neutral-900 hover:border-neutral-800 hover:bg-[#0B1120]/20"
                    }`}
                  >
                    {isCurrent && (
                      <motion.div
                        layoutId="pubIndicatorLine"
                        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00E5FF]"
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                      />
                    )}

                    {/* Tech Corner Accent */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-800 group-hover:border-[#00E5FF] transition-colors" />

                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1.5 truncate w-full">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold ${isCurrent ? "text-[#00FF9D]" : "text-neutral-600"}`}>
                            // 0{idx + 1}
                          </span>
                          <h3 className={`font-bold font-mono text-base uppercase tracking-wider truncate ${isCurrent ? "text-white" : "text-neutral-400"}`}>
                            {pub.title}
                          </h3>
                        </div>
                        <p className="text-xs font-mono text-neutral-400 truncate max-w-[92%]">
                          {pub.journal || pub.conference || pub.publisher || "Scientific Research Publication Node."}
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-widest shrink-0 transition-colors ${isCurrent ? "text-[#00E5FF]" : "text-neutral-600"}`}>
                        INSPECT //
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Hand: Live Dynamic Preview Panel Frame */}
        <div className="lg:col-span-7 w-full h-full min-h-[490px] flex items-stretch">
          <AnimatePresence mode="wait">
            {activePub && (
              <motion.div
                key={activePub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProjectPub(activePub)}
                className="w-full bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/40 p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[490px] cursor-none group rounded-none"
              >
                {/* HUD Borders Accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7C3AED]" />

                <div>
                  <div className="w-full h-64 bg-[#050816] relative mb-6 border border-neutral-900 overflow-hidden mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500">
                    <img
                      src={getPubCover(activePub, activeIndex)}
                      alt={activePub.title}
                      className="w-full h-full object-cover select-none filter grayscale contrast-125 saturate-150 transition-transform duration-700 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />
                    
                    {/* Laser Scanner Line Bar Over Image */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] pub-scanline-rail pointer-events-none opacity-0 group-hover:opacity-100" />

                    {activePub.featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-[#050816]/90 border border-[#00FF9D]/40 text-[9px] font-mono font-bold text-[#00FF9D] uppercase tracking-widest z-30 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                        [ PRIORITY_PRINT ]
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-20">
                      <h3 className="text-xl font-black font-mono text-white uppercase tracking-wider drop-shadow-md max-w-[75%] truncate text-left">
                        {activePub.title}
                      </h3>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#7C3AED] bg-[#050816]/80 border border-[#7C3AED]/30 px-2.5 py-1 shrink-0">
                        <Calendar className="w-3.5 h-3.5" /> {getYear(activePub.publicationDate)}
                      </span>
                    </div>
                  </div>

                  {/* Context Blueprint Framework Tags */}
                  {(activePub.journal || activePub.conference || activePub.publisher) && (
                    <div className="space-y-2 text-left relative z-10">
                      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500">// DISTRIBUTION_CHANNEL_NODE</div>
                      <div className="flex flex-wrap gap-2">
                        {activePub.journal && (
                          <span className="px-3 py-1.5 bg-[#050816] border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono uppercase tracking-wider">
                            JOURNAL: {activePub.journal}
                          </span>
                        )}
                        {activePub.conference && (
                          <span className="px-3 py-1.5 bg-[#050816] border border-neutral-900 text-neutral-300 text-[10px] font-mono uppercase tracking-wider">
                            CONF: {activePub.conference}
                          </span>
                        )}
                        {activePub.publisher && (
                          <span className="px-3 py-1.5 bg-[#050816] border border-neutral-900 text-neutral-400 text-[10px] font-mono uppercase tracking-wider">
                            PUB: {activePub.publisher}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-end gap-4 font-mono text-xs z-10" onClick={(e) => e.stopPropagation()}>
                  {activePub.pdfUrl && (
                    <a
                      href={activePub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#050816] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#00E5FF]" /> SOURCE_PDF
                    </a>
                  )}
                  {activePub.publicationUrl && (
                    <a
                      href={activePub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                    >
                      UPLINK_DOCUMENT <ExternalLink className="w-3.5 h-3.5" />
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
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/95 z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedProjectPub(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative rounded-none overflow-y-auto max-h-[90vh] text-left scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Title Header Utility Frame */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">DOCUMENT_INSPECTOR // METADATA_LEDGER</span>
                </div>
                <button
                  onClick={() => setSelectedProjectPub(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                  aria-label="Close publication panel view"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-44 sm:h-72 bg-[#050816] relative overflow-hidden flex items-end p-6 border-b border-neutral-900">
                <img
                  src={getPubCover(selectedPub, sortedPubs.indexOf(selectedPub))}
                  alt={selectedPub.title}
                  className="w-full h-full object-cover filter brightness-[0.25] saturate-150 mix-blend-luminosity absolute inset-0 z-0 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                
                {/* Panel blueprint grid patterns underlaid inside image header modal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

                <div className="relative z-20 w-full text-left">
                  <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[9px] font-mono uppercase tracking-[0.15em] inline-block mb-2">
                    SCIENTIFIC_LITERATURE_LEDGER_NODE
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black font-mono tracking-wide text-white uppercase drop-shadow-md">
                    {selectedPub.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 bg-[#0B1120]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#050816] border border-neutral-800 font-mono text-xs">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> DOCUMENT_DATE</div>
                    <div className="font-bold text-neutral-200 mt-0.5 uppercase">
                      {getYear(selectedPub.publicationDate)} RELEASE
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Bookmark className="w-3.5 h-3.5 text-[#00E5FF]" /> DIGITAL_DOI</div>
                    <div className="font-bold text-[#00E5FF] mt-0.5 truncate uppercase" title={selectedPub.doi || "No registered identifier Token"}>
                      {selectedPub.doi || "SYS_TOKEN_UNDEFINED"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#00FF9D]" /> CITATIONS_INDEX</div>
                    <div className="font-bold text-[#00FF9D] mt-0.5 uppercase">
                      {typeof selectedPub.citations === "number" && selectedPub.citations > 0 ? `${selectedPub.citations} CITATIONS` : "0 CITATIONS"}
                    </div>
                  </div>
                </div>

                {selectedPub.abstract && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> DOCUMENT_ABSTRACT_DOSSIER
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-mono whitespace-pre-line bg-[#050816] p-4 border border-neutral-800 max-h-[180px] overflow-y-auto scrollbar-none">
                      {selectedPub.abstract}
                    </p>
                  </div>
                )}

                {selectedPub.authors?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> CO_AUTHORS_ARRAY
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPub.authors.map((author: string, i: number) => (
                        <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#050816] border border-neutral-800 text-neutral-300 text-xs font-mono uppercase">
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedPub.journal || selectedPub.conference || selectedPub.publisher) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500 font-mono pt-3 border-t border-neutral-900 text-left">
                    {selectedPub.journal && <span>JOURNAL: <span className="text-neutral-300 font-bold uppercase">{selectedPub.journal}</span></span>}
                    {selectedPub.conference && <span>CONFERENCE: <span className="text-neutral-300 font-bold uppercase">{selectedPub.conference}</span></span>}
                    {selectedPub.publisher && <span>PUBLISHER: <span className="text-neutral-400 font-bold uppercase">{selectedPub.publisher}</span></span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-neutral-900 font-mono text-xs">
                  {selectedPub.publicationUrl && (
                    <a
                      href={selectedPub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    >
                      <ExternalLink className="w-4 h-4" /> GLOBAL_PUBLICATION_TUNNEL
                    </a>
                  )}
                  {selectedPub.pdfUrl && (
                    <a
                      href={selectedPub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#050816] hover:bg-[#0B1120] border border-neutral-800 hover:border-neutral-600 text-neutral-300 font-bold uppercase tracking-widest transition-colors"
                    >
                      <FileText className="w-4 h-4 text-neutral-400" /> EXTRACT_PDF_FRAGMENT
                    </a>
                  )}
                  
                  <span className="flex items-center gap-2 justify-center sm:justify-start text-[10px] tracking-widest uppercase ml-auto text-neutral-600">
                    <Radio className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" /> PUB_STREAM_SYNCHRONIZED
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