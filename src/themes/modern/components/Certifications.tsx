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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 select-none"
    >
      {/* Declarative CSS keyframe loop layer running completely on GPU threads */}
      <style>{`
        @keyframes premium-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-run {
          animation: premium-marquee 45s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

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

      {/* Unified Drag-Supportive Track Canvas Wrapper Container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden py-4 relative group/container touch-pan-y"
      >
        {/* Blended horizontal edge gradients - Only activated when auto-scroll triggers */}
        {shouldAutoScroll && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-64 bg-gradient-to-r from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-64 bg-gradient-to-l from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
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
          className={`flex gap-4 md:gap-6 px-6 mx-auto w-max ${
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
                className="w-[280px] md:w-[390px] shrink-0 inline-block bg-[#111113]/80 border border-[#18181B] hover:border-[#6366F1]/30 rounded-2xl p-4 cursor-pointer relative backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#111113] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.02)] group/card text-left"
              >
                <div className="w-full h-44 md:h-56 rounded-xl overflow-hidden bg-[#18181B] relative mb-4 border border-[#18181B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] pointer-events-none">
                  <img
                    src={getCertImage(cert)}
                    alt={`Verification asset representing ${certTitle}`}
                    loading="lazy"
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

                <div className="space-y-1 w-full truncate text-left px-1 pointer-events-none">
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

      {/* FULL SPEC VERIFICATION HUB LIGHTBOX OVERLAY */}
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
              <button
                onClick={() => setSelectedCert(null)}
                aria-label="Dismiss certification details lightbox"
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-52 sm:h-72 bg-[#18181B] relative border-b border-[#18181B]">
                <img
                  src={getCertImage(selectedCert)}
                  alt={`Validation credential asset backdrop artwork representing ${selectedCert?.name || selectedCert?.title}`}
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

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0A0A0B]/60 border border-[#18181B] shadow-inner text-left font-sans">
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                      Authority
                    </div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1">
                      {selectedCert?.issuer || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                      Credential ID
                    </div>
                    <div
                      className="text-sm font-semibold font-mono text-[#D4D4D8] mt-1 truncate max-w-[95%]"
                      title={selectedCert?.credentialId}
                    >
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">
                      Lifespan
                    </div>
                    <div className="text-sm font-bold text-[#6366F1] mt-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#6366F1]" />
                      {formatDate(selectedCert?.issueDate)}{" "}
                      {selectedCert?.expiryDate
                        ? `- ${formatDate(selectedCert.expiryDate)}`
                        : " (No Expiration)"}
                    </div>
                  </div>
                </div>

                {selectedCert?.skillsCovered && selectedCert.skillsCovered.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">
                      Skills Metrics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skillsCovered.map((skill, i) => (
                        <span
                          key={`skill-${i}`}
                          className="px-2.5 py-1 rounded-md bg-[#0A0A0B] border border-[#18181B] text-xs font-medium text-[#D4D4D8] font-mono shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-[#71717A] font-mono pt-1 text-left">
                    <span className="flex items-center gap-1.5 text-[#06B6D4] bg-[#06B6D4]/5 px-2.5 py-1 rounded-lg border border-[#06B6D4]/10 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> Featured Highlight
                    </span>
                  </div>
                )}

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
