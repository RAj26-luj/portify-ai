"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  Award, 
  ExternalLink, 
  FileText, 
  Calendar, 
  X, 
  Sparkles
} from "lucide-react";

const DEFAULT_CERT_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
];

interface CertificationsProps {
  certifications?: any[];
}

export default function Certifications({ certifications = [] }: CertificationsProps) {
  const rawCerts = certifications && certifications.length > 0 ? certifications : [];
  const isScrollable = rawCerts.length >= 4;
  const isMobileScrollable = rawCerts.length > 1;

  // Duplicate mobile items to fill loop track without snapping gaps
  const mobileMarqueeCerts = React.useMemo(() => {
    if (rawCerts.length === 0) return [];
    if (!isMobileScrollable) return rawCerts;
    let items = [...rawCerts];
    while (items.length < 8) {
      items = [...items, ...rawCerts];
    }
    return items;
  }, [rawCerts, isMobileScrollable]);

  const marqueeCerts = React.useMemo(() => {
    if (rawCerts.length === 0) return [];
    if (!isScrollable) return rawCerts;
    let items = [...rawCerts];
    while (items.length < 6) {
      items = [...items, ...rawCerts];
    }
    return items;
  }, [rawCerts, isScrollable]);

  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  // Dynamic constraints calculation for fluid mobile dragging
  const mobileConstraintsRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [mobileDragLeftConstraint, setMobileDragLeftConstraint] = useState<number>(0);
  
  // Advanced Animation Controller for Resume-from-Current behavior
  const mobileControls = useAnimation();
  const currentX = useRef(0);

  // Core function to handle infinite loop translation seamlessly
  const startMobileMarquee = async (fromX: number) => {
    if (!isMobileScrollable || selectedCert) return;
    
    // Total distance the loop covers before snapping cleanly
    const targetDistance = -1000;
    
    // If the loop reaches past the threshold, reset coordinates seamlessly
    let startX = fromX;
    if (startX <= targetDistance) {
      startX = 0;
    }

    // Calculate dynamic time remaining based on speed factor
    const remainingDistance = targetDistance - startX;
    const totalDuration = 45; 
    const calculatedDuration = Math.abs(remainingDistance / (targetDistance / totalDuration));

    await mobileControls.start({
      x: [startX, targetDistance],
      transition: {
        duration: calculatedDuration,
        ease: "linear",
      }
    });

    // Recursively handle the clean looping sequence
    if (!isMobilePaused) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  // Triggers the animation cycle or tracks modal view updates
  useEffect(() => {
    if (isMobileScrollable && !isMobilePaused && !selectedCert) {
      startMobileMarquee(currentX.current);
    } else {
      mobileControls.stop();
    }
  }, [isMobileScrollable, isMobilePaused, selectedCert]);

  useEffect(() => {
    if (mobileConstraintsRef.current && mobileTrackRef.current) {
      const containerWidth = mobileConstraintsRef.current.offsetWidth;
      const trackWidth = mobileTrackRef.current.scrollWidth;
      setMobileDragLeftConstraint(containerWidth - trackWidth);
    }
  }, [mobileMarqueeCerts]);

  if (!rawCerts.length) return null;

  const getCertImage = (cert: any, idx: number) => {
    return cert?.certificateImage || DEFAULT_CERT_IMAGES[idx % DEFAULT_CERT_IMAGES.length];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section
      id="certifications"
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      {/* Background Ambient Glow Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <Award className="w-3.5 h-3.5" />
              Verifications
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Credentials Index.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SWIPE MINIBARS */}
      {/* ========================================== */}
      <div 
        ref={mobileConstraintsRef}
        className="block md:hidden w-full overflow-hidden py-2 touch-pan-y"
      >
        <motion.div 
          ref={mobileTrackRef}
          drag={isMobileScrollable ? "x" : false}
          dragConstraints={{ left: mobileDragLeftConstraint, right: 0 }}
          dragElastic={0.2}
          animate={mobileControls}
          onUpdate={(latest: any) => {
            if (latest.x !== undefined) {
              currentX.current = latest.x;
            }
          }}
          onDragStart={() => {
            if (isMobileScrollable) {
              setIsMobilePaused(true);
              mobileControls.stop();
            }
          }}
          onDragEnd={(event, info) => {
            if (isMobileScrollable) {
              setIsMobilePaused(false);
              startMobileMarquee(currentX.current);
            }
          }}
          className={
            isMobileScrollable
              ? "flex gap-3 px-4 w-max cursor-grab active:cursor-grabbing"
              : "flex gap-3 px-4 justify-center w-full"
          }
        >
          {mobileMarqueeCerts.map((cert: any, idx: number) => {
            const certTitle = cert?.name || cert?.title || "Credential Item";
            return (
              <div
                key={`mob-${cert.id || idx}-${idx}`}
                onClick={() => setSelectedCert(cert)}
                className="w-[250px] bg-[#07070b] border border-white/5 active:border-purple-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md cursor-pointer shrink-0 select-none"
              >
                {/* Micro Icon Thumbnail Frame */}
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 shrink-0 relative border border-white/10 pointer-events-none">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt="" 
                    className="w-full h-full object-cover select-none"
                  />
                </div>

                {/* Title & Metadata Lines */}
                <div className="flex-1 min-w-0 text-left space-y-0.5 pointer-events-none">
                  <h3 className="font-semibold text-xs text-white truncate">
                    {certTitle}
                  </h3>
                  <p className="text-[10px] font-mono text-purple-400 truncate">
                    {cert?.issuer || "Authority Issuer"}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: INFINITE SCROLLING MARQUEE */}
      {/* ========================================== */}
      <div 
        className={`hidden md:block relative w-full overflow-hidden py-4 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
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
          animate={isScrollable && !isPaused && !selectedCert ? { x: [0, -2000] } : false}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 55, // Adjusted slightly slower for desktop as well to maintain uniformity
              ease: "linear"
            }
          }}
        >
          {marqueeCerts.map((cert: any, idx: number) => {
            const certTitle = cert?.name || cert?.title || "Credential Item";
            return (
              <div
                key={`desk-${cert.id || idx}-${idx}`}
                onClick={() => setSelectedCert(cert)}
                className="w-[380px] shrink-0 inline-block bg-white/[0.01] border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 cursor-pointer relative backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.02] shadow-lg"
              >
                <div className="w-full h-52 rounded-xl overflow-hidden bg-neutral-900 relative mb-4 border border-white/5">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt={certTitle} 
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  
                  {cert?.featured && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500 text-white uppercase tracking-wider shadow-md">
                      Featured Badge
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between truncate">
                    <span className="text-[11px] font-mono font-medium text-purple-400 bg-black/60 px-2 py-0.5 rounded border border-white/5 backdrop-blur-md truncate max-w-[70%] text-left">
                      {cert?.issuer || "Authority Issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full truncate text-left">
                  <h3 className="font-semibold text-base tracking-wide text-white line-clamp-1">
                    {certTitle}
                  </h3>
                  <span className="text-xs text-neutral-500 group-hover:text-purple-400 transition-colors flex items-center gap-1 font-mono">
                    Inspect verification details →
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Cinematic Details Pop-up Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dismiss Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Graphic Framing Canvas */}
              <div className="w-full h-44 sm:h-64 bg-neutral-900 relative">
                <img
                  src={getCertImage(selectedCert, rawCerts.indexOf(selectedCert))}
                  alt={selectedCert?.name || selectedCert?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold tracking-wider uppercase mb-1 inline-block font-mono">
                    Official Verification Node
                  </span>
                  <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    {selectedCert?.name || selectedCert?.title || "Credential Item"}
                  </h3>
                </div>
              </div>

              {/* Core Attributes Panel Block Matrix */}
              <div className="p-4 sm:p-6 md:p-8 space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Authority</div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-200 mt-0.5">{selectedCert?.issuer || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Credential ID</div>
                    <div className="text-xs font-mono text-neutral-300 mt-0.5 truncate max-w-[95%]" title={selectedCert?.credentialId}>
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">Lifespan</div>
                    <div className="text-xs font-medium text-purple-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {formatDate(selectedCert?.issueDate)} {selectedCert?.expiryDate ? `- ${formatDate(selectedCert.expiryDate)}` : " (No Expiration)"}
                    </div>
                  </div>
                </div>

                {/* Technical Targets Covered */}
                {selectedCert?.skillsCovered?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">Skills Metrics</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skillsCovered.map((skill: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] text-neutral-300 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Parameters */}
                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono pt-1">
                    <span className="flex items-center gap-1 text-amber-400/80 bg-amber-400/5 px-1.5 py-0.5 rounded border border-amber-400/10">
                      <Sparkles className="w-2.5 h-2.5" /> Featured Highlight
                    </span>
                  </div>
                )}

                {/* Anchor Navigation Target Dock Access Rows */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-white/5">
                  {selectedCert?.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Secure Verification Center
                    </a>
                  )}
                  {selectedCert?.certificatePdf && (
                    <a
                      href={selectedCert.certificatePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium tracking-wide transition-all active:scale-[0.98]"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" /> Source PDF Ledger
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}