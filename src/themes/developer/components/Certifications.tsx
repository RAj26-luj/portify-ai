"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  Award, 
  ExternalLink, 
  FileText, 
  Calendar, 
  X, 
  Terminal,
  GitBranch,
  ShieldAlert,
  Cpu
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

    let targetX = -1000;
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

    let targetX = -2000;
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
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
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
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">git</span> log --oneline --graph --decorate --all -n 3
          </p>
          <div className="text-[11px] text-neutral-500 mt-1 space-y-0.5">
            <div>* <span className="text-[#7EE787]">8f3a1d9</span> (HEAD {"->"} main) feat: update compliance encryption credentials</div>
            <div>* <span className="text-[#58A6FF]">c2e104b</span> refactor: update verification cryptographic registry index</div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SWIPE MINIBARS */}
      {/* ========================================== */}
      <div className="block md:hidden w-full overflow-hidden py-2">
        <motion.div 
          className="flex gap-3 px-4 w-max touch-none"
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
                className="w-[260px] bg-[#161B22] border border-[#30363D] active:border-[#58A6FF] rounded-lg p-3 flex items-center gap-3 shadow-md cursor-pointer shrink-0"
              >
                {/* Micro Icon Thumbnail Frame */}
                <div className="w-10 h-10 rounded bg-[#0D1117] shrink-0 relative border border-[#30363D] overflow-hidden">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt="" 
                    className="w-full h-full object-cover select-none filter brightness-90 grayscale hover:grayscale-0"
                  />
                </div>

                {/* Title & Metadata Lines */}
                <div className="flex-1 min-w-0 text-left space-y-0.5">
                  <h3 className="font-bold text-xs text-white truncate font-mono">
                    {certTitle}
                  </h3>
                  <p className="text-[10px] text-[#58A6FF] truncate font-mono">
                    @{cert?.issuer || "Authority Issuer"}
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
        className={`hidden md:block relative w-full overflow-hidden py-2 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
      >
        {isScrollable && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0D1117] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0D1117] to-transparent z-20 pointer-events-none" />
          </>
        )}

        <motion.div 
          className={
            isScrollable
              ? "flex gap-4 whitespace-nowrap min-w-full w-max px-4 touch-none"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center"
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
                className="w-[360px] shrink-0 inline-block bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] rounded-lg p-4 cursor-pointer relative transition-all duration-200 hover:bg-[#1C2128] shadow-md"
              >
                <div className="w-full h-40 rounded border border-[#30363D] overflow-hidden bg-[#0D1117] relative mb-3">
                  <img 
                    src={getCertImage(cert, idx)} 
                    alt={certTitle} 
                    className="w-full h-full object-cover select-none filter opacity-80 contrast-125"
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

                <div className="space-y-1 w-full truncate text-left">
                  <h3 className="font-bold text-sm tracking-tight text-[#C9D1D9] truncate">
                    {certTitle}
                  </h3>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
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
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Minimalist Tech Layout Cover */}
              <div className="w-full h-36 bg-[#0D1117] relative border-b border-[#30363D]">
                <img
                  src={getCertImage(selectedCert, rawCerts.indexOf(selectedCert))}
                  alt={selectedCert?.name || selectedCert?.title}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Authority</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 font-bold">{selectedCert?.issuer || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Credential SHA</div>
                    <div className="text-xs text-neutral-400 mt-0.5 truncate max-w-[95%]" title={selectedCert?.credentialId}>
                      {selectedCert?.credentialId || "Generic Token Key"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Timestamp</div>
                    <div className="text-xs text-[#7EE787] mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" /> 
                      {formatDate(selectedCert?.issueDate)} {selectedCert?.expiryDate ? `- ${formatDate(selectedCert.expiryDate)}` : " (LTS)"}
                    </div>
                  </div>
                </div>

                {/* Technical Targets Covered */}
                {selectedCert?.skillsCovered?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <GitBranch size={10} className="text-[#F78166]" /> Technology Clusters Covered
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skillsCovered.map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Parameters */}
                {selectedCert?.featured && (
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono pt-0.5">
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
                      <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" /> Live Verification Endpoint
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