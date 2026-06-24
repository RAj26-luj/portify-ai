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
  id: string | number;
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

  const [isMounted, setIsMounted] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [isDragged, setIsDragged] = useState(false);
  const [dragX, setDragX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Handle responsive viewport evaluation and hydration fencing safely
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

  // Unified final composition engine mapping array sets down onto UI tracks
  const displayCerts = useMemo(() => {
    return shouldAutoScroll ? [...paddedCerts, ...paddedCerts] : rawCerts;
  }, [paddedCerts, shouldAutoScroll, rawCerts]);

  // Layout calculations handler
  useEffect(() => {
    if (!isMounted || displayCerts.length === 0) return;

    const calculateBounds = () => {
      if (!containerRef.current || !trackRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;

      // If we are auto-scrolling, track is fully duplicated. If static, evaluate true layout bounds.
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
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      <style>{`
        @keyframes marquee-infinite {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-run {
          animation: marquee-infinite 45s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

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

      {/* Track Canvas Wrapper Container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden py-4 relative group/container touch-pan-y"
      >
        {/* Blended horizontal edge gradients - Only visible if the element actually scrolls */}
        {shouldAutoScroll && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
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
          className={`flex gap-4 md:gap-6 px-4 mx-auto w-max ${
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
                className="w-[260px] md:w-[380px] shrink-0 bg-white/[0.01] border border-white/5 hover:border-purple-500/30 rounded-xl md:rounded-2xl p-3 md:p-4 cursor-pointer relative backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.02] shadow-lg text-left"
              >
                <div className="w-full h-36 md:h-52 rounded-lg md:rounded-xl overflow-hidden bg-neutral-900 relative mb-3 md:mb-4 border border-white/5 pointer-events-none">
                  <img
                    src={getCertImage(cert)}
                    alt={`Verification token display artwork representing ${certTitle}`}
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {cert?.featured && (
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 rounded text-[8px] md:text-[9px] font-mono font-bold bg-purple-500 text-white uppercase tracking-wider shadow-md">
                      Featured Badge
                    </span>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 flex items-end justify-between truncate">
                    <span className="text-[10px] md:text-[11px] font-mono font-medium text-purple-400 bg-black/60 px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-md truncate max-w-[65%]">
                      {cert?.issuer || "Authority Issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[9px] md:text-[10px] font-mono text-neutral-400 shrink-0">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-0.5 md:space-y-1 w-full truncate pointer-events-none">
                  <h3 className="font-semibold text-xs md:text-base tracking-wide text-white line-clamp-1">
                    {certTitle}
                  </h3>
                  <span className="text-[10px] md:text-xs text-neutral-500 group-hover:text-purple-400 transition-colors flex items-center gap-1 font-mono">
                    Inspect verification details →
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Cinematic Details Modal Pop-up Layer */}
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
              <button
                onClick={() => setSelectedCert(null)}
                aria-label="Dismiss asset credential layer"
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-44 sm:h-64 bg-neutral-900 relative">
                <img
                  src={getCertImage(selectedCert)}
                  alt={`Sourced validation credential artwork image backing ${selectedCert?.name || selectedCert?.title}`}
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

              <div className="p-4 sm:p-6 md:p-8 space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">
                      Authority
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-200 mt-0.5">
                      {selectedCert?.issuer || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">
                      Credential ID
                    </div>
                    <div
                      className="text-xs font-mono text-neutral-300 mt-0.5 truncate max-w-[95%]"
                      title={selectedCert?.credentialId}
                    >
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">
                      Lifespan
                    </div>
                    <div className="text-xs font-medium text-purple-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(selectedCert?.issueDate)}{" "}
                      {selectedCert?.expiryDate
                        ? `- ${formatDate(selectedCert.expiryDate)}`
                        : " (No Expiration)"}
                    </div>
                  </div>
                </div>

                {selectedCert?.skillsCovered && selectedCert.skillsCovered.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">
                      Skills Metrics
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skillsCovered.map((skill, i) => (
                        <span
                          key={`skill-${i}`}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] text-neutral-300 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono pt-1">
                    <span className="flex items-center gap-1 text-amber-400/80 bg-amber-400/5 px-1.5 py-0.5 rounded border border-amber-400/10">
                      <Sparkles className="w-2.5 h-2.5" /> Featured Highlight
                    </span>
                  </div>
                )}

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
