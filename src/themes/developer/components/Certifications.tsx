"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  FileText,
  Calendar,
  X,
  Terminal,
  GitBranch,
  ShieldAlert,
  Cpu,
} from "lucide-react";

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
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Hardware-accelerated CSS marquee layout variables */}
      <style>{`
        @keyframes console-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-run {
          animation: console-marquee 45s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* GitHub/Terminal Matrix Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* Terminal View Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Production Milestones</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">verified-credentials.json</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>

        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg text-left">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">git</span> log --oneline --graph --decorate --all -n 3
          </p>
          <div className="text-[11px] text-neutral-500 mt-1 space-y-0.5">
            <div>
              * <span className="text-[#7EE787]">8f3a1d9</span> (HEAD {"->"} main) feat: update
              compliance encryption credentials
            </div>
            <div>
              * <span className="text-[#58A6FF]">c2e104b</span> refactor: update verification
              cryptographic registry index
            </div>
          </div>
        </div>
      </div>

      {/* Unified Drag-Supportive Track Canvas Wrapper Container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden py-4 relative group/container cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {/* Blended horizontal edge gradients - Only activated when auto-scroll triggers */}
        {shouldAutoScroll && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-64 bg-gradient-to-r from-[#0D1117] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-64 bg-gradient-to-l from-[#0D1117] to-transparent z-20 pointer-events-none" />
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
          className={`flex gap-4 md:gap-4 px-4 mx-auto w-max ${
            shouldAutoScroll ? "" : "justify-center"
          } ${
            shouldAutoScroll && !isDragged
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
                className="w-[260px] md:w-[360px] shrink-0 inline-block bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] rounded-lg p-3 md:p-4 cursor-pointer relative transition-all duration-200 hover:bg-[#1C2128] shadow-md text-left group/card"
              >
                <div className="w-full h-36 md:h-40 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] relative mb-3 pointer-events-none">
                  <img
                    src={getCertImage(cert)}
                    alt={`Verification hash visualization representing ${certTitle}`}
                    loading="lazy"
                    className="w-full h-full object-cover select-none filter opacity-80 contrast-125 transition-transform duration-500 group-hover/card:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />

                  {cert?.featured && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7EE787] text-[#0D1117] uppercase tracking-wider shadow">
                      STABLE_RELEASE
                    </span>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between truncate">
                    <span className="text-[10px] text-[#58A6FF] bg-[#0D1117] px-1.5 py-0.5 rounded border border-[#30363D] truncate max-w-[65%] text-left">
                      auth:{cert?.issuer?.toLowerCase().replace(/\s+/g, "-") || "issuer"}
                    </span>
                    {cert?.issueDate && (
                      <span className="text-[10px] text-neutral-500 bg-[#0D1117] px-1 py-0.5 rounded border border-[#30363D]/50">
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full truncate text-left pointer-events-none">
                  <h3 className="font-bold text-xs md:text-sm tracking-tight text-[#C9D1D9] truncate font-mono">
                    {certTitle}
                  </h3>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1.5 font-mono">
                    <span className="text-[#7EE787]">$</span> cat metadata.log --inspect
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
            className="fixed inset-0 bg-[#0D1117]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedCert(null)}
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
                  <span className="text-neutral-400 font-bold">inspect_node.sh</span>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  aria-label="Dismiss asset credential node layer"
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Minimalist Tech Layout Cover */}
              <div className="w-full h-36 bg-[#0D1117] relative border-b border-[#30363D]">
                <img
                  src={getCertImage(selectedCert)}
                  alt={`Sourced log verification metadata image validation token backing ${selectedCert?.name || selectedCert?.title}`}
                  className="w-full h-full object-cover filter opacity-40 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-1 inline-block">
                    SECURE SIGNED NODE
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                    {selectedCert?.name || selectedCert?.title || "Credential Item"}
                  </h3>
                </div>
              </div>

              {/* Core Attributes Panel Block Matrix */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D] text-left">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Authority</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 font-bold">
                      {selectedCert?.issuer || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">
                      Credential SHA
                    </div>
                    <div
                      className="text-xs text-neutral-400 mt-0.5 truncate max-w-[95%]"
                      title={selectedCert?.credentialId}
                    >
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Timestamp</div>
                    <div className="text-xs text-[#7EE787] mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      {formatDate(selectedCert?.issueDate)}{" "}
                      {selectedCert?.expiryDate
                        ? `- ${formatDate(selectedCert.expiryDate)}`
                        : " (LTS)"}
                    </div>
                  </div>
                </div>

                {/* Technical Targets Covered */}
                {selectedCert?.skillsCovered && selectedCert.skillsCovered.length > 0 && (
                  <div className="space-y-1.5 text-left">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <GitBranch size={10} className="text-[#F78166]" /> Technology Clusters Covered
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skillsCovered.map((skill, i) => (
                        <span
                          key={`skill-${i}`}
                          className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Parameters */}
                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono pt-0.5 text-left">
                    <span className="flex items-center gap-1 text-[#7EE787] bg-[#7EE787]/5 px-1.5 py-0.5 rounded border border-[#7EE787]/10">
                      <ShieldAlert className="w-2.5 h-2.5" /> High Production Impact Tier
                    </span>
                  </div>
                )}

                {/* Action Rows */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-[#30363D]">
                  {selectedCert?.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" /> Live Verification
                      Endpoint
                    </a>
                  )}
                  {selectedCert?.certificatePdf && (
                    <a
                      href={selectedCert.certificatePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-xs text-neutral-400 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" /> Raw Ledger Payload PDF
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
