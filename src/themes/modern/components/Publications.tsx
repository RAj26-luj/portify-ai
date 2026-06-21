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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
    >
      {/* Premium SaaS Micro-Grid & Ambient Mesh Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#6366F1]/5 to-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <BookOpen className="w-3.5 h-3.5 text-[#6366F1]" />
              Research Index
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Publications<span className="text-[#8B5CF6]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SAAS MARQUEE TRACK */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full max-w-md mx-auto px-6 h-[260px] overflow-hidden relative"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A0A0B] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-col gap-3"
          animate={isMobileScrollable && !isMobilePaused && !selectedPub ? { y: [0, -420] } : false}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((pub: any, idx: number) => (
            <div
              key={`mob-${pub.id || idx}-${idx}`}
              onClick={() => setSelectedProjectPub(pub)}
              className="w-full bg-[#111113] border border-[#18181B] active:border-[#6366F1]/50 rounded-xl p-4 flex items-center gap-4 shadow-xl shrink-0 cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#18181B] border border-[#18181B] shrink-0 flex items-center justify-center font-mono text-xs font-bold text-[#6366F1] shadow-inner">
                {String((sortedPubs.indexOf(pub) % sortedPubs.length) + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-white truncate font-sans">{pub.title}</h3>
                <p className="text-[11px] font-sans text-[#71717A] truncate mt-1">
                  {pub.journal || pub.conference || pub.publisher || "Research Literature Record"}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: PREMIUM SAAS SPLIT WORKSPACE INTERFACE */}
      {/* ========================================== */}
      <div className="hidden md:grid relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hand: Continuous Automated Registry Pipeline */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="flex items-center justify-between px-2 text-[11px] text-[#71717A] tracking-wider font-mono uppercase font-semibold">
            <span>Dossier Registry ({sortedPubs.length})</span>
            <span className="flex items-center gap-1.5 text-[#06B6D4] font-bold">
              <Workflow className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Pipeline Active
            </span>
          </div>

          <div
            ref={verticalScrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-h-[420px] overflow-y-auto pr-2 space-y-3 scrollbar-none border border-[#18181B] bg-[#111113]/40 p-3 rounded-2xl backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
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
                  className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-300 relative border group h-[105px] flex flex-col justify-center ${
                    isCurrent
                      ? "bg-[#18181B]/80 border-[#6366F1]/40 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "bg-transparent border-transparent hover:border-[#18181B] hover:bg-[#111113]/50"
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="pubIndicatorLine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#6366F1] to-[#8B5CF6]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 truncate w-full">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono font-bold ${isCurrent ? "text-[#6366F1]" : "text-[#71717A]"}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-bold text-base tracking-tight truncate font-sans ${isCurrent ? "text-white" : "text-[#71717A] group-hover:text-[#D4D4D8]"}`}>
                          {pub.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#71717A] truncate max-w-[95%] font-medium">
                        {pub.journal || pub.conference || pub.publisher || "Scientific Research Publication Node."}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#71717A] font-mono shrink-0 group-hover:text-[#06B6D4] transition-colors">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Premium Product Style Preview Dashboard Panel */}
        <div className="lg:col-span-7 w-full h-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {activePub && (
              <motion.div
                key={activePub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => setSelectedProjectPub(activePub)}
                className="w-full bg-[#111113]/80 border border-[#18181B] rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.02)] min-h-[500px] cursor-pointer group"
              >
                <div>
                  {/* Dashboard Graphic Container Box Frame */}
                  <div className="w-full h-68 rounded-2xl overflow-hidden bg-[#18181B] relative mb-6 border border-[#18181B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    <img
                      src={getPubCover(activePub, activeIndex)}
                      alt={activePub.title}
                      className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-90" />
                    
                    {activePub.featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-mono font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white tracking-wider uppercase shadow-md border border-white/10">
                        Featured Printing
                      </span>
                    )}

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md max-w-[80%] line-clamp-1 text-left font-sans">
                        {activePub.title}
                      </h3>
                      <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#6366F1] bg-[#111113]/90 border border-[#18181B] rounded-lg px-2.5 py-1 backdrop-blur-md shrink-0 shadow-sm">
                        <Calendar className="w-3.5 h-3.5" /> {getYear(activePub.publicationDate)}
                      </span>
                    </div>
                  </div>

                  {/* Distribution Metric Node Layers */}
                  {(activePub.journal || activePub.conference || activePub.publisher) && (
                    <div className="space-y-2.5 text-left">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#71717A] font-semibold">Distribution Channel Node</div>
                      <div className="flex flex-wrap gap-2">
                        {activePub.journal && (
                          <span className="px-3 py-1 rounded-lg bg-[#6366F1]/5 border border-[#6366F1]/10 text-xs font-bold text-[#6366F1] font-mono shadow-sm">
                            Journal: {activePub.journal}
                          </span>
                        )}
                        {activePub.conference && (
                          <span className="px-3 py-1 rounded-lg bg-[#06B6D4]/5 border border-[#06B6D4]/10 text-xs font-bold text-[#06B6D4] font-mono shadow-sm">
                            Conference: {activePub.conference}
                          </span>
                        )}
                        {activePub.publisher && (
                          <span className="px-3 py-1 rounded-lg bg-[#18181B] border border-[#18181B] text-xs font-medium text-[#D4D4D8] font-mono shadow-sm">
                            {activePub.publisher}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#18181B] flex items-center justify-end gap-3.5" onClick={(e) => e.stopPropagation()}>
                  {activePub.pdfUrl && (
                    <a
                      href={activePub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181B] border border-[#18181B] hover:border-[#71717A]/30 text-xs font-semibold text-[#D4D4D8] hover:text-white transition-all shadow-sm"
                    >
                      <FileText className="w-4 h-4 text-[#71717A]" /> Source PDF
                    </a>
                  )}
                  {activePub.publicationUrl && (
                    <a
                      href={activePub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(99,102,241,0.2)] border border-white/10"
                    >
                      View Publication <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL REDESIGN: FULL MODULE COMPILATION ABSTRACT PREVIEW DIALOG */}
      <AnimatePresence>
        {selectedPub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedProjectPub(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-3xl bg-[#111113] border border-[#18181B] rounded-2xl overflow-y-auto max-h-[85vh] text-left shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProjectPub(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
                aria-label="Close publication panel view"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-52 sm:h-80 bg-[#18181B] relative border-b border-[#18181B]">
                <img
                  src={getPubCover(selectedPub, sortedPubs.indexOf(selectedPub))}
                  alt={selectedPub.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                  <span className="px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold tracking-wider uppercase mb-2 inline-block font-mono">
                    Scientific Literature Ledger Node
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-sans">
                    {selectedPub.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0A0A0B]/60 border border-[#18181B] shadow-inner font-sans">
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Document Date</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6366F1]" /> 
                      {getYear(selectedPub.publicationDate)} Release
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Digital DOI</div>
                    <div className="text-sm font-semibold font-mono text-[#D4D4D8] mt-1 flex items-center gap-2 truncate" title={selectedPub.doi || "No registered identifier Token"}>
                      <Bookmark className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                      <span className="truncate">{selectedPub.doi || "Generic Identifier"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Citations Index</div>
                    <div className="text-sm font-bold text-[#06B6D4] mt-1 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#06B6D4]" />
                      <span>{typeof selectedPub.citations === "number" && selectedPub.citations > 0 ? `${selectedPub.citations} Citations` : "0 Citations"}</span>
                    </div>
                  </div>
                </div>

                {selectedPub.abstract && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Document Abstract Dossier</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans bg-[#0A0A0B]/40 p-4 rounded-xl border border-[#18181B] max-h-[180px] overflow-y-auto scrollbar-none">
                      {selectedPub.abstract}
                    </p>
                  </div>
                )}

                {selectedPub.authors?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Co-Authors Array</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPub.authors.map((author: string, i: number) => (
                        <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0A0A0B] border border-[#18181B] text-xs font-semibold text-[#D4D4D8] font-sans shadow-sm">
                          <User className="w-3.5 h-3.5 text-[#71717A]" />
                          <span>{author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedPub.journal || selectedPub.conference || selectedPub.publisher) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#71717A] font-mono pt-3 border-t border-[#18181B] text-left font-semibold">
                    {selectedPub.journal && <span>Journal: <span className="text-white">{selectedPub.journal}</span></span>}
                    {selectedPub.conference && <span>Conference: <span className="text-white">{selectedPub.conference}</span></span>}
                    {selectedPub.publisher && <span>Publisher: <span className="text-[#D4D4D8]">{selectedPub.publisher}</span></span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-5 border-t border-[#18181B]">
                  {selectedPub.publicationUrl && (
                    <a
                      href={selectedPub.publicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all active:scale-[0.98] border border-white/10 shadow-md font-sans"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Global Publication Hub
                    </a>
                  )}
                  {selectedPub.pdfUrl && (
                    <a
                      href={selectedPub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0B] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] text-[#D4D4D8]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#71717A]" /> Download PDF
                    </a>
                  )}
                  
                  <span className="opacity-40 hidden sm:flex items-center gap-1 ml-auto font-mono text-xs font-semibold">
                    <Workflow className="w-3.5 h-3.5 text-[#8B5CF6]" /> PUB_SYNC_OK
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