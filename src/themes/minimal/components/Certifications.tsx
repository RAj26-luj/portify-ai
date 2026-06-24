"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, FileText, Calendar, X, Sparkles } from "lucide-react";

const DEFAULT_CERT_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
];

export interface CertificationItem {
  id: string | number; // Required strict unique identification key
  name?: string;
  title?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificatePdf?: string;
  certificateImage?: string;
  featured?: boolean;
  skillsCovered?: string[];
}

interface CertificationsProps {
  certifications?: CertificationItem[];
}

export default function Certifications({ certifications = [] }: CertificationsProps) {
  const rawCerts = useMemo(
    () => (certifications && certifications.length > 0 ? certifications : []),
    [certifications]
  );

  // Absolute server hydration fence protecting runtime layout evaluation limits
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [isDragged, setIsDragged] = useState(false);
  const [dragX, setDragX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Handle cross-device viewports and mount isolation securely
  useEffect(() => {
    setIsMounted(true);
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Structural threshold rules: Scroll if > 1 item on mobile, or > 3 items on desktop
  const shouldAutoScroll = useMemo(() => {
    if (isMobileViewport) return rawCerts.length > 1;
    return rawCerts.length > 3;
  }, [rawCerts, isMobileViewport]);

  // Safeguard array allocation logic: completely bypass track cloning if item thresholds are low
  const paddedCerts = useMemo(() => {
    if (rawCerts.length === 0) return [];
    if (!shouldAutoScroll) return rawCerts;

    const targetFloor = isMobileViewport ? 6 : 10;
    if (rawCerts.length >= targetFloor) return rawCerts;

    let items: CertificationItem[] = [];
    while (items.length < targetFloor) {
      items = [...items, ...rawCerts];
    }
    return items;
  }, [rawCerts, isMobileViewport, shouldAutoScroll]);

  // Final rendering array mapping sets cleanly onto visible UI elements
  const displayCerts = useMemo(() => {
    return shouldAutoScroll ? [...paddedCerts, ...paddedCerts] : rawCerts;
  }, [paddedCerts, shouldAutoScroll, rawCerts]);

  // Throttled container layout boundaries calculating limits safely via state checkers
  useEffect(() => {
    if (!isMounted || displayCerts.length === 0) return;

    const calculateBounds = () => {
      if (!containerRef.current || !trackRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;

      const operationalTrackWidth = shouldAutoScroll
        ? trackRef.current.scrollWidth / 2
        : trackRef.current.scrollWidth;

      const maxLeftDrag = Math.min(0, containerWidth - operationalTrackWidth);

      setDragConstraints((prev) =>
        prev.left === maxLeftDrag ? prev : { left: maxLeftDrag, right: 0 }
      );
    };

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculateBounds);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    if (trackRef.current) observer.observe(trackRef.current);

    calculateBounds();
    return () => observer.disconnect();
  }, [displayCerts, isMounted, shouldAutoScroll]);

  if (!rawCerts.length || !isMounted) return null;

  // Stable numeric hashing fallback providing balanced imagery selection paths
  const getCertImage = (cert: CertificationItem) => {
    if (cert?.certificateImage) return cert.certificateImage;
    const stringId = String(cert.id);
    let hash = 0;
    for (let i = 0; i < stringId.length; i++) {
      hash = stringId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return DEFAULT_CERT_IMAGES[Math.abs(hash) % DEFAULT_CERT_IMAGES.length];
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <section
      id="certifications"
      className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200 select-none"
    >
      {/* Declarative CSS keyframe loop layer running completely on GPU threads */}
      <style>{`
        @keyframes swiss-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-run {
          animation: swiss-marquee 45s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

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

      {/* Unified Drag-Supportive Track Canvas Wrapper Container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden py-4 relative group/container touch-pan-y"
      >
        {/* Blended horizontal edge gradients - Only activated when auto-scroll triggers */}
        {shouldAutoScroll && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
          </>
        )}

        <motion.div
          ref={trackRef}
          drag={shouldAutoScroll ? "x" : false}
          dragConstraints={dragConstraints}
          dragElastic={0.15}
          style={isDragged ? { x: dragX } : undefined}
          onDragStart={() => {
            if (shouldAutoScroll) setIsDragged(true);
          }}
          onDrag={(event, info) => {
            if (!shouldAutoScroll || !trackRef.current) return;
            const halfWidth = trackRef.current.scrollWidth / 2;
            let computedX = info.point.x;

            if (computedX <= -halfWidth) {
              computedX = computedX % halfWidth;
            } else if (computedX > 0) {
              computedX = -halfWidth + (computedX % halfWidth);
            }
            setDragX(computedX);
          }}
          onDragEnd={() => setIsDragged(false)}
          className={`flex gap-6 md:gap-8 px-6 mx-auto w-max ${
            shouldAutoScroll ? "cursor-grab active:cursor-grabbing" : "justify-center"
          } ${
            shouldAutoScroll && !(selectedCert || isDragged)
              ? "animate-marquee-run group-hover/container:marquee-paused"
              : "marquee-paused"
          }`}
        >
          {displayCerts.map((cert, idx) => {
            const certTitle = cert?.name || cert?.title || "Credential Item";
            const itemKey = `track-node-${idx}-${cert.id}`;

            return (
              <div
                key={itemKey}
                onClick={() => {
                  if (!isDragged) setSelectedCert(cert);
                }}
                className="w-[260px] md:w-[360px] shrink-0 inline-block bg-white border-b-2 border-gray-100 hover:border-[#111827] rounded-none p-2 cursor-pointer relative transition-all duration-300 text-left group/card"
              >
                <div className="w-full h-36 md:h-56 rounded-none overflow-hidden bg-[#FAFAFA] relative mb-4 border border-gray-100 pointer-events-none">
                  <img
                    src={getCertImage(cert)}
                    alt={`Verification token display artwork representing ${certTitle}`}
                    loading="lazy"
                    className="w-full h-full object-cover select-none transition-transform duration-500 group-hover/card:scale-[1.02]"
                  />

                  {cert?.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-none text-[9px] font-mono font-bold bg-[#111827] text-white uppercase tracking-widest">
                      FEATURED
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between truncate">
                    <span className="text-[11px] font-mono font-bold text-gray-700 bg-white/95 px-2 py-0.5 border border-gray-200 max-w-[70%] truncate">
                      {cert?.issuer || "Authority Issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[10px] font-mono font-bold text-gray-500 bg-white/95 px-2 py-0.5 border border-gray-200 shrink-0">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full truncate px-1 pb-2 pointer-events-none">
                  <h3 className="font-extrabold text-xs md:text-base tracking-tight text-[#111827] truncate font-sans uppercase">
                    {certTitle}
                  </h3>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover/card:text-gray-600 transition-colors block">
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
                aria-label="Dismiss asset credential layer"
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-48 sm:h-64 bg-[#FAFAFA] relative border-b border-gray-200">
                <img
                  src={getCertImage(selectedCert)}
                  alt={`Sourced validation credential artwork image backing ${selectedCert?.name || selectedCert?.title}`}
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
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Authority
                    </div>
                    <div className="text-xs font-bold text-gray-800 mt-1">
                      {selectedCert?.issuer || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Credential ID
                    </div>
                    <div
                      className="text-xs font-mono font-bold text-gray-600 mt-1 truncate max-w-[95%]"
                      title={selectedCert?.credentialId}
                    >
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Lifespan
                    </div>
                    <div className="text-xs font-bold text-[#111827] mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(selectedCert?.issueDate)}{" "}
                      {selectedCert?.expiryDate
                        ? `- ${formatDate(selectedCert.expiryDate)}`
                        : " (No Expiry)"}
                    </div>
                  </div>
                </div>

                {selectedCert?.skillsCovered && selectedCert.skillsCovered.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Skills Metrics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skillsCovered.map((skill, i) => (
                        <span
                          key={`skill-${i}`}
                          className="px-2.5 py-1 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-medium text-gray-700 font-mono"
                        >
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
