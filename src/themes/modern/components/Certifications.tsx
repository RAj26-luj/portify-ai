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

  const selectedCertRef = useRef<any | null>(null);
  const [selectedCert, setSelectedCertState] = useState<any | null>(null);
  
  const setSelectedCert = (cert: any) => {
    selectedCertRef.current = cert;
    setSelectedCertState(cert);
  };

  // Animation Controls & Refs for Mobile and Desktop Interactive Infinite Marquee Tracks
  const mobileControls = useAnimation();
  const currentMobileX = useRef<number>(0);
  const isDraggingMobile = useRef<boolean>(false);

  const deskControls = useAnimation();
  const currentDeskX = useRef<number>(0);
  const isDraggingDesk = useRef<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  // Constant speed calculations for uniform velocity tracking
  const MOBILE_SPEED = 1000 / 45; // Target distance over duration (X-axis pixels per second)
  const DESK_SPEED = 2000 / 55; // Target distance over duration (X-axis pixels per second)

  const startMobileMarquee = async (fromX: number) => {
    if (isDraggingMobile.current || selectedCertRef.current || !isMountedRef.current) return;

    const targetX = -1000;
    if (fromX <= targetX || fromX > 0) {
      fromX = 0;
      await mobileControls.set({ x: 0 });
    }

    const remainingDistance = Math.abs(targetX - fromX);
    const dynamicDuration = remainingDistance / MOBILE_SPEED;

    await mobileControls.start({
      x: targetX,
      transition: {
        duration: dynamicDuration,
        ease: "linear"
      }
    });

    if (!isDraggingMobile.current && !selectedCertRef.current && isMountedRef.current) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  const startDeskMarquee = async (fromX: number) => {
    if (isDraggingDesk.current || selectedCertRef.current || !isMountedRef.current) return;

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

    if (!isDraggingDesk.current && !selectedCertRef.current && isMountedRef.current) {
      requestAnimationFrame(() => {
        startDeskMarquee(0);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    if (isMobileScrollable && !selectedCert) {
      startMobileMarquee(currentMobileX.current);
    } else {
      mobileControls.stop();
    }

    if (isScrollable && !selectedCert) {
      startDeskMarquee(currentDeskX.current);
    } else {
      deskControls.stop();
    }

    return () => {
      mobileControls.stop();
      deskControls.stop();
      isMountedRef.current = false;
    };
  }, [isMobileScrollable, isScrollable, selectedCert]);

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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 select-none"
    >
      {/* Premium SaaS Grid Overlay & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/5 to-[#06B6D4]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8B5CF6]/5 blur-[110px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <Award className="w-3.5 h-3.5 text-[#6366F1]" />
              Verifications
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Credentials Index<span className="text-[#06B6D4]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SWIPE MINIBARS */}
      {/* ========================================== */}
      <div className="block md:hidden w-full overflow-hidden py-2">
        <motion.div 
          className="flex gap-3 px-6 w-max touch-none"
          drag={isMobileScrollable ? "x" : false}
          dragConstraints={{ left: -1000, right: 0 }}
          animate={mobileControls}
          onUpdate={(latest) => {
            currentMobileX.current = typeof latest.x === "number" ? latest.x : 0;
          }}
          onDragStart={() => {
            isDraggingMobile.current = true;
            mobileControls.stop();
          }}
          onDragEnd={() => {
            isDraggingMobile.current = false;
            startMobileMarquee(currentMobileX.current);
          }}
          onMouseEnter={() => {
            isDraggingMobile.current = true;
            mobileControls.stop();
          }}
          onMouseLeave={() => {
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
                className="w-[260px] bg-[#111113] border border-[#18181B] active:border-[#6366F1]/50 rounded-xl p-3.5 flex items-center gap-4 shadow-xl cursor-pointer shrink-0 text-left"
              >
                {/* Micro Icon Thumbnail Frame */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#18181B] shrink-0 relative border border-[#18181B] shadow-inner p-0.5">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt="" 
                    className="w-full h-full object-cover select-none rounded-md"
                  />
                </div>

                {/* Title & Metadata Lines */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-sm text-white truncate font-sans">
                    {certTitle}
                  </h3>
                  <p className="text-[11px] font-mono font-semibold text-[#6366F1] truncate uppercase tracking-wider">
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
      <div className="hidden md:block relative w-full overflow-hidden py-6">
        {isScrollable && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
          </>
        )}

        <motion.div 
          className={
            isScrollable
              ? "flex gap-6 whitespace-nowrap min-w-full w-max px-6 touch-none"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
          }
          drag={isScrollable ? "x" : false}
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
          {marqueeCerts.map((cert: any, idx: number) => {
            const certTitle = cert?.name || cert?.title || "Credential Item";
            return (
              <div
                key={`desk-${cert.id || idx}-${idx}`}
                onClick={() => setSelectedCert(cert)}
                className="w-[390px] shrink-0 inline-block bg-[#111113]/80 border border-[#18181B] hover:border-[#6366F1]/30 rounded-2xl p-4 cursor-pointer relative backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#111113] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.02)] group/card"
              >
                <div className="w-full h-56 rounded-xl overflow-hidden bg-[#18181B] relative mb-4 border border-[#18181B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt={certTitle} 
                    className="w-full h-full object-cover select-none transition-transform duration-700 group-hover/card:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-90" />
                  
                  {cert?.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white uppercase tracking-wider shadow-lg border border-white/10">
                      Featured Badge
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 truncate">
                    <span className="text-[11px] font-mono font-semibold text-[#6366F1] bg-[#111113]/90 border border-[#18181B] px-2.5 py-1 rounded-lg backdrop-blur-md truncate max-w-[70%] text-left shadow-sm">
                      {cert?.issuer || "Authority Issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[11px] font-mono font-medium text-[#71717A] bg-[#0A0A0B]/80 px-2 py-0.5 rounded-md border border-[#18181B]/40 shrink-0">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full truncate text-left px-1">
                  <h3 className="font-bold text-base tracking-tight text-white line-clamp-1 font-sans">
                    {certTitle}
                  </h3>
                  <span className="text-xs font-semibold text-[#71717A] group-hover/card:text-[#06B6D4] transition-colors flex items-center gap-1 font-sans tracking-wide">
                    Inspect verification details →
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* MODAL REDESIGN: FULL SPEC VERIFICATION HUB DIALOG */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-2xl bg-[#111113] border border-[#18181B] rounded-2xl overflow-y-auto max-h-[85vh] text-left shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dismiss Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Graphic Framing Canvas */}
              <div className="w-full h-52 sm:h-72 bg-[#18181B] relative border-b border-[#18181B]">
                <img
                  src={getCertImage(selectedCert, rawCerts.indexOf(selectedCert))}
                  alt={selectedCert?.name || selectedCert?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-left">
                  <span className="px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold tracking-wider uppercase mb-2 inline-block font-mono">
                    Official Verification Node
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-sans">
                    {selectedCert?.name || selectedCert?.title || "Credential Item"}
                  </h3>
                </div>
              </div>

              {/* Core Attributes Panel Block Matrix */}
              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0A0A0B]/60 border border-[#18181B] shadow-inner text-left font-sans">
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Authority</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1">{selectedCert?.issuer || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Credential ID</div>
                    <div className="text-sm font-semibold font-mono text-[#D4D4D8] mt-1 truncate max-w-[95%]" title={selectedCert?.credentialId}>
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Lifespan</div>
                    <div className="text-sm font-bold text-[#6366F1] mt-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#6366F1]" /> 
                      {formatDate(selectedCert?.issueDate)} {selectedCert?.expiryDate ? `- ${formatDate(selectedCert.expiryDate)}` : " (No Expiration)"}
                    </div>
                  </div>
                </div>

                {/* Technical Targets Covered */}
                {selectedCert?.skillsCovered?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Skills Metrics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skillsCovered.map((skill: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-[#0A0A0B] border border-[#18181B] text-xs font-medium text-[#D4D4D8] font-mono shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Parameters */}
                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-[#71717A] font-mono pt-1 text-left">
                    <span className="flex items-center gap-1.5 text-[#06B6D4] bg-[#06B6D4]/5 px-2.5 py-1 rounded-lg border border-[#06B6D4]/10 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> Featured Highlight
                    </span>
                  </div>
                )}

                {/* Anchor Navigation Target Dock Access Rows */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-5 border-t border-[#18181B]">
                  {selectedCert?.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all active:scale-[0.98] border border-white/10 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Secure Verification Center
                    </a>
                  )}
                  {selectedCert?.certificatePdf && (
                    <a
                      href={selectedCert.certificatePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0B] border border-[#18181B] hover:border-[#71717A]/40 text-xs font-semibold tracking-wide transition-all active:scale-[0.98] text-[#D4D4D8]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#71717A]" /> Source PDF Ledger
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