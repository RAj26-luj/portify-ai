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
    if (isDraggingMobile.current || selectedCert || !isMountedRef.current) return;

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

    if (!isDraggingMobile.current && !selectedCert && isMountedRef.current) {
      requestAnimationFrame(() => {
        startMobileMarquee(0);
      });
    }
  };

  const startDeskMarquee = async (fromX: number) => {
    if (isDraggingDesk.current || selectedCert || !isMountedRef.current) return;

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

    if (!isDraggingDesk.current && !selectedCert && isMountedRef.current) {
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
      className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200 select-none"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
              <Award className="w-3.5 h-3.5" />
              05 / Verifications
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
              Credentials Index.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
      {/* ========================================== */}
      <div className="block md:hidden w-full overflow-hidden py-1">
        <motion.div 
          className="flex gap-4 px-6 w-max touch-none"
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
                className="w-[260px] bg-[#FAFAFA] border border-gray-200 rounded-none p-4 flex items-center gap-4 cursor-pointer shrink-0 text-left transition-colors hover:bg-gray-50"
              >
                <div className="w-12 h-12 rounded-none overflow-hidden bg-white shrink-0 relative border border-gray-200">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt="" 
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="font-extrabold text-sm text-[#111827] truncate font-sans uppercase">
                    {certTitle}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-500 truncate font-semibold">
                    {cert?.issuer || "Authority Issuer"}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: INFINITE EDITORIAL STRIP */}
      {/* ========================================== */}
      <div className="hidden md:block relative w-full overflow-hidden py-2">
        <motion.div 
          className={
            isScrollable
              ? "flex gap-8 whitespace-nowrap min-w-full w-max px-6 touch-none"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
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
                className="w-[360px] shrink-0 inline-block bg-white border-b-2 border-gray-100 hover:border-[#111827] rounded-none p-2 cursor-pointer relative transition-all duration-300"
              >
                <div className="w-full h-56 rounded-none overflow-hidden bg-[#FAFAFA] relative mb-4 border border-gray-100">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt={certTitle} 
                    className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.02]"
                  />
                  
                  {cert?.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-none text-[9px] font-mono font-bold bg-[#111827] text-white uppercase tracking-widest">
                      FEATURED
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between truncate">
                    <span className="text-[11px] font-mono font-bold text-gray-700 bg-white/95 px-2 py-0.5 border border-gray-200 max-w-[70%] text-left truncate">
                      {cert?.issuer || "Authority Issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[10px] font-mono font-bold text-gray-500 bg-white/95 px-2 py-0.5 border border-gray-200 shrink-0">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full truncate text-left px-1 pb-2">
                  <h3 className="font-extrabold text-base tracking-tight text-[#111827] truncate font-sans uppercase">
                    {certTitle}
                  </h3>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover/marquee:text-gray-600 transition-colors block">
                    INSPECT VERIFICATION LOGS →
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Pop-up Modal Canvas */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-full max-w-xl bg-white border border-gray-200 rounded-none overflow-y-auto max-h-[85vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-48 sm:h-64 bg-[#FAFAFA] relative border-b border-gray-200">
                <img
                  src={getCertImage(selectedCert, rawCerts.indexOf(selectedCert))}
                  alt={selectedCert?.name || selectedCert?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <span className="px-2.5 py-0.5 rounded-none bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold tracking-widest uppercase mb-2 inline-block font-mono">
                    Official Verification Node
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] font-sans uppercase">
                    {selectedCert?.name || selectedCert?.title || "Credential Item"}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAFAFA] border border-gray-200 font-sans">
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Authority</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">{selectedCert?.issuer || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Credential ID</div>
                    <div className="text-xs font-mono font-bold text-gray-600 mt-1 truncate max-w-[95%]" title={selectedCert?.credentialId}>
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Lifespan</div>
                    <div className="text-xs font-bold text-[#111827] mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> 
                      {formatDate(selectedCert?.issueDate)} {selectedCert?.expiryDate ? `- ${formatDate(selectedCert.expiryDate)}` : " (No Expiry)"}
                    </div>
                  </div>
                </div>

                {selectedCert?.skillsCovered?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Skills Metrics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skillsCovered.map((skill: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-medium text-gray-700 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono pt-1">
                    <span className="flex items-center gap-1 text-[#111827] bg-[#FAFAFA] px-2.5 py-1 border border-gray-200 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-gray-400" /> Featured Highlight
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-gray-100">
                  {selectedCert?.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-[#111827] text-white hover:bg-black text-xs font-bold tracking-wide transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Secure Verification Center
                    </a>
                  )}
                  {selectedCert?.certificatePdf && (
                    <a
                      href={selectedCert.certificatePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-bold tracking-wide transition-all active:scale-[0.98] text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400" /> Source PDF Ledger
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