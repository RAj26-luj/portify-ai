"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  ExternalLink, 
  FileText, 
  Calendar, 
  X, 
  Sparkles,
  ShieldCheck,
  Terminal,
  Cpu,
  Fingerprint
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

  // --- MOBILE MARQUEE ANIMATION CONTROLLER ENGINE ---
  const mobileControls = useAnimation();
  const currentMobileX = useRef(0);
  const isDraggingMobile = useRef(false);
  const isMounted = useRef(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Marquee Loop System Life Cycle
  useEffect(() => {
    isMounted.current = true;

    if (isMobileScrollable && !selectedCert) {
      startMobileMarquee(currentMobileX.current);
    } else {
      mobileControls.stop();
    }

    return () => {
      isMounted.current = false;
      mobileControls.stop();
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [isMobileScrollable, selectedCert]);

  const startMobileMarquee = async (fromX: number) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    if (!isMounted.current || isDraggingMobile.current || selectedCert || !isMobileScrollable) {
      return;
    }

    const totalDistance = -1000;
    let targetX = totalDistance;
    let baseFromX = fromX;

    if (baseFromX <= totalDistance) {
      baseFromX = 0;
    }

    const remainingDistance = Math.abs(targetX - baseFromX);
    const totalDuration = 35; // Constant speed matching original timing criteria
    const dynamicDuration = (remainingDistance / Math.abs(totalDistance)) * totalDuration;

    try {
      await mobileControls.set({ x: baseFromX });

      await mobileControls.start({
        x: targetX,
        transition: {
          duration: dynamicDuration,
          ease: "linear",
        },
      });

      if (isMounted.current && !isDraggingMobile.current) {
        currentMobileX.current = 0;
        animationTimeoutRef.current = setTimeout(() => {
          startMobileMarquee(0);
        }, 0);
      }
    } catch (e) {
      // Gracefully prevent operational execution crash on thread interruption
    }
  };

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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      <style jsx global>{`
        @keyframes scan-vertical {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        @keyframes glitch-anim {
          0% { clip-path: inset(80% 0 0 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(20% 0 80% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 2px); }
          100% { clip-path: inset(0% 0 0 0); transform: translate(0); }
        }
        .cyber-scan-vertical {
          animation: scan-vertical 8s linear infinite;
        }
        .glitch-hover:hover .glitch-text {
          animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
          color: #00E5FF;
        }
      `}</style>

      {/* Cyberpunk Environment Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(60deg)] origin-bottom opacity-30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/20 pb-6">
          <div className="group">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00FF9D]/30 text-[10px] font-mono text-[#00FF9D] tracking-[0.2em] uppercase mb-4 shadow-[0_0_10px_rgba(0,255,157,0.1)] relative overflow-hidden">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              <span>Sys_Verifications</span>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00FF9D]/50 cyber-scan-vertical" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                // SECURE_LOG_UPLINK
              </h2>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col text-right font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>PACKET_STREAM_STATUS: <span className="text-[#00E5FF]">ACTIVE</span></span>
            <span>DATA_NODES: {rawCerts.length.toString().padStart(3, '0')}</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED DATA STREAM */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full overflow-hidden py-4 relative bg-[#0B1120]/50 border-y border-[#00E5FF]/10 select-none"
      >
        {/* Terminal Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
        
        <motion.div 
          className="flex gap-4 px-4 w-max touch-pan-x"
          animate={mobileControls}
          drag={isMobileScrollable ? "x" : false}
          dragConstraints={{
            left: -1000,
            right: 0
          }}
          dragElastic={0.05}
          onUpdate={(latest) => {
            currentMobileX.current = Number(latest.x) || 0;
          }}
          onDragStart={() => {
            isDraggingMobile.current = true;
            mobileControls.stop();
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
          }}
          onDragEnd={() => {
            isDraggingMobile.current = false;
            startMobileMarquee(currentMobileX.current);
          }}
        >
          {mobileMarqueeCerts.map((cert: any, idx: number) => {
            const certTitle = cert?.name || cert?.title || "Credential Item";
            return (
              <div
                key={`mob-${cert.id || idx}-${idx}`}
                onClick={() => setSelectedCert(cert)}
                className="w-[280px] bg-[#050816] border border-[#7C3AED]/30 rounded p-3 flex items-center gap-4 shadow-lg cursor-pointer shrink-0 relative overflow-hidden active:border-[#00E5FF]"
              >
                {/* Cyberpunk corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00E5FF]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#7C3AED]" />

                <div className="w-12 h-12 rounded overflow-hidden bg-neutral-900 shrink-0 relative border border-[#00E5FF]/20 mix-blend-luminosity">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt="" 
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-[#00E5FF]/10" />
                </div>

                <div className="flex-1 min-w-0 text-left space-y-1">
                  <h3 className="font-bold text-xs text-white truncate font-mono uppercase">
                    {certTitle}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-[#7C3AED]" />
                    <p className="text-[9px] font-mono text-neutral-400 truncate uppercase tracking-widest">
                      {cert?.issuer || "Authority Issuer"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: FIBER-OPTIC DATA TRACK */}
      {/* ========================================== */}
      <div 
        className={`hidden md:block relative w-full overflow-hidden py-8 ${isScrollable ? "group/marquee cursor-crosshair" : ""}`}
        onMouseEnter={() => isScrollable && setIsPaused(true)}
        onMouseLeave={() => isScrollable && setIsPaused(false)}
      >
        {isScrollable && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-[#050816] via-[#050816]/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-[#050816] via-[#050816]/80 to-transparent z-20 pointer-events-none" />
          </>
        )}

        {/* Data Track Rails */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00E5FF]/5 -translate-y-1/2 pointer-events-none" />

        <motion.div 
          className={
            isScrollable
              ? "flex gap-8 whitespace-nowrap min-w-full w-max px-4 items-center"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
          }
          animate={isScrollable && !isPaused && !selectedCert ? { x: [0, -2000] } : false}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
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
                className="w-[420px] shrink-0 inline-block bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/60 p-5 cursor-pointer relative transition-all duration-300 hover:-translate-y-2 group/card shadow-2xl glitch-hover"
              >
                {/* Cyberpunk HUD Frame Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00E5FF] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00E5FF] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00E5FF] opacity-0 group-hover/card:opacity-100 transition-opacity" />

                <div className="w-full h-48 overflow-hidden bg-[#050816] relative mb-5 border border-neutral-800 group-hover/card:border-[#00E5FF]/30 transition-colors">
                  <div className="absolute inset-0 bg-[#00E5FF]/10 mix-blend-color z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt={certTitle} 
                    className="w-full h-full object-cover select-none filter grayscale group-hover/card:grayscale-0 contrast-125 transition-all duration-700 scale-105 group-hover/card:scale-100"
                  />
                  {/* Holographic Scanline over image */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] z-20 opacity-0 group-hover/card:opacity-100 cyber-scan-vertical" />
                  
                  {cert?.featured && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-[#050816]/90 border border-[#00FF9D]/40 text-[9px] font-mono font-bold text-[#00FF9D] uppercase tracking-widest z-30 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                      [ PRIORITY_OVERRIDE ]
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#050816] to-transparent h-1/2 z-10" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-20">
                    <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider truncate max-w-[65%] flex items-center gap-1.5 bg-[#050816]/80 px-2 py-1 border-l-2 border-[#00E5FF]">
                      <Terminal className="w-3 h-3" />
                      {cert?.issuer || "Authority Issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[9px] font-mono text-[#7C3AED] bg-[#050816]/80 px-2 py-1 border border-[#7C3AED]/30">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-full text-left relative z-10">
                  <h3 className="font-bold text-lg tracking-wide text-[#F8FAFC] font-mono uppercase line-clamp-1 glitch-text">
                    {certTitle}
                  </h3>
                  <span className="text-[10px] text-neutral-500 group-hover/card:text-[#00E5FF] transition-colors flex items-center gap-1.5 font-mono uppercase tracking-widest">
                    <Cpu className="w-3 h-3" /> Execute Validation Sequence →
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Cinematic / Cyberpunk Details Pop-up Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/90 z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedCert(null)}
          >
            {/* Modal Matrix Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.98, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.15)] overflow-y-auto max-h-[90vh] sm:max-h-[85vh] text-left relative scrollbar-none rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Title Bar */}
              <div className="sticky top-0 z-50 flex justify-between items-center bg-[#050816] border-b border-[#00E5FF]/30 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF4D6D] rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Sys_Inspect // Process_ID: {Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] transition-colors border border-transparent hover:border-[#FF4D6D]/50 rounded-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Holographic Framing Canvas */}
              <div className="w-full h-48 sm:h-72 bg-[#050816] relative overflow-hidden group/modalimg">
                <img
                  src={getCertImage(selectedCert, rawCerts.indexOf(selectedCert))}
                  alt={selectedCert?.name || selectedCert?.title}
                  className="w-full h-full object-cover filter contrast-125 saturate-150 mix-blend-luminosity opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent" />
                <div className="absolute inset-0 bg-[#00E5FF]/10 mix-blend-color" />
                
                {/* HUD Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-2 py-1 bg-[#050816]/80 border-l-2 border-[#00FF9D] text-[#00FF9D] text-[10px] font-mono tracking-widest uppercase mb-3">
                    <ShieldCheck className="w-3 h-3" /> Authenticated Node
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-white uppercase font-mono drop-shadow-md">
                    {selectedCert?.name || selectedCert?.title || "Credential Item"}
                  </h3>
                </div>
              </div>

              {/* Data Blocks */}
              <div className="p-6 md:p-8 space-y-8 bg-[#0B1120] relative">
                {/* Corner Accents */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#7C3AED]/5 pointer-events-none" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-t-[#00E5FF]/50 relative">
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mb-1.5 flex items-center gap-1.5"><Terminal className="w-3 h-3"/> ISSUING_NODE</div>
                    <div className="text-xs sm:text-sm font-mono text-[#00E5FF] font-bold uppercase">{selectedCert?.issuer || "N/A"}</div>
                  </div>
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-t-[#7C3AED]/50 relative">
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mb-1.5 flex items-center gap-1.5"><Fingerprint className="w-3 h-3"/> DECRYPTION_KEY</div>
                    <div className="text-xs font-mono text-[#7C3AED] truncate max-w-[95%] uppercase" title={selectedCert?.credentialId}>
                      {selectedCert?.credentialId || "SYS_TOKEN_UNDEFINED"}
                    </div>
                  </div>
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-t-[#00FF9D]/50 relative">
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mb-1.5 flex items-center gap-1.5"><Calendar className="w-3 h-3"/> TIMESTAMP_VALIDITY</div>
                    <div className="text-xs font-mono text-[#00FF9D] flex flex-col gap-0.5 uppercase">
                      <span>INIT: {formatDate(selectedCert?.issueDate) || "UNKNOWN"}</span>
                      <span className="text-neutral-500">TERM: {selectedCert?.expiryDate ? formatDate(selectedCert.expiryDate) : "INDEFINITE"}</span>
                    </div>
                  </div>
                </div>

                {/* Technical Targets Covered */}
                {selectedCert?.skillsCovered?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-neutral-700" />
                      SYS_CAPABILITIES_MAPPED
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skillsCovered.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-[#050816] border border-[#00E5FF]/20 text-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Parameters */}
                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono pt-2">
                    <span className="flex items-center gap-1.5 text-[#00FF9D] bg-[#00FF9D]/10 px-2 py-1 border border-[#00FF9D]/30 uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                      <Sparkles className="w-3 h-3 animate-pulse" /> PRIORITY_CLASSIFICATION
                    </span>
                  </div>
                )}

                {/* Anchor Navigation Target Dock Access Rows */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 mt-6 border-t border-neutral-800">
                  {selectedCert?.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] text-xs font-mono font-bold uppercase tracking-widest transition-all active:scale-[0.98] overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent group-hover/btn:animate-[scan-vertical_1s_ease-in-out_infinite]" />
                      <ExternalLink className="w-4 h-4" /> Uplink to Core Ledger
                    </a>
                  )}
                  {selectedCert?.certificatePdf && (
                    <a
                      href={selectedCert.certificatePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#050816] hover:bg-[#0B1120] border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-mono font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
                    >
                      <FileText className="w-4 h-4 text-neutral-400" /> Extract PDF Fragment
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