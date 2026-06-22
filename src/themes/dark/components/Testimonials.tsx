"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { MessageSquare, User2, Sparkles, Radio, Activity, Terminal } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin as Linkedin } from "@fortawesome/free-brands-svg-icons";

interface TestimonialsProps {
  testimonials?: any[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const rawTestimonials = testimonials && testimonials.length > 0 ? testimonials : [];

  const sortedTestimonials = React.useMemo(() => {
    return [...rawTestimonials].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [rawTestimonials]);

  const isScrollable = sortedTestimonials.length >= 4;
  const isMobileScrollable = sortedTestimonials.length > 1;

  // Duplicate mobile items to fill loop tracks without visual snapping gaps
  const mobileMarqueeItems = React.useMemo(() => {
    if (sortedTestimonials.length === 0) return [];
    if (!isMobileScrollable) return sortedTestimonials;
    let items = [...sortedTestimonials];
    while (items.length < 8) {
      items = [...items, ...sortedTestimonials];
    }
    return items;
  }, [sortedTestimonials, isMobileScrollable]);

  const marqueeItems = React.useMemo(() => {
    if (sortedTestimonials.length === 0) return [];
    if (!isScrollable) return sortedTestimonials;
    
    let items = [...sortedTestimonials];
    while (items.length < 5) {
      items = [...items, ...sortedTestimonials];
    }
    return items;
  }, [sortedTestimonials, isScrollable]);

  const [isDeskPaused, setIsDeskPaused] = useState<boolean>(false);

  // --- MOBILE MARQUEE ANIMATION CONTROLLER ENGINE ---
  const mobileControls = useAnimation();
  const currentMobileX = useRef(0);
  const isDraggingMobile = useRef(false);
  const isMounted = useRef(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Marquee Loop System Life Cycle
  useEffect(() => {
    isMounted.current = true;

    if (isMobileScrollable) {
      startMobileMarquee(currentMobileX.current);
    } else {
      mobileControls.stop();
    }

    return () => {
      isMounted.current = false;
      mobileControls.stop();
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [isMobileScrollable]);

  const startMobileMarquee = async (fromX: number) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    if (!isMounted.current || isDraggingMobile.current || !isMobileScrollable) {
      return;
    }

    const totalDistance = -1200;
    let targetX = totalDistance;
    let baseFromX = fromX;

    if (baseFromX <= totalDistance) {
      baseFromX = 0;
    }

    const remainingDistance = Math.abs(targetX - baseFromX);
    const totalDuration = 35; // Constant velocity matched to original 35s cycle layout specifications
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
      // Gracefully capture layout timeline alterations or lifecycle teardowns cleanly
    }
  };

  if (!sortedTestimonials.length) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      <style jsx global>{`
        @keyframes scan-testimonials {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .testimonial-scanline {
          animation: scan-testimonials 8s linear infinite;
        }
        .cyber-grid-testimonials {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 3.5rem 3.5rem;
        }
      `}</style>

      {/* Cyberpunk Environment Decorative Grid & Auroras */}
      <div className="absolute inset-0 cyber-grid-testimonials pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(0,229,255,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#7C3AED]/3 rounded-full filter blur-[120px] pointer-events-none" />

      {/* HUD Section Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00FF9D] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <MessageSquare className="w-3.5 h-3.5 text-[#00FF9D]" />
              ENDORSEMENTS_FEED
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
              // SYSTEM_ENDORSEMENTS
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#00FF9D] animate-pulse" />
            <span>METRIC_STREAM: SECURE</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED CONDUIT PIPELINE */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full overflow-hidden py-4 bg-[#0B1120]/40 border-y border-neutral-800/80 relative select-none"
      >
        <motion.div 
          className="flex gap-4 px-4 w-max touch-pan-x"
          animate={mobileControls}
          drag={isMobileScrollable ? "x" : false}
          dragConstraints={{
            left: -1200,
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
          {mobileMarqueeItems.map((t: any, idx: number) => (
            <div
              key={`mob-${t.id || idx}-${idx}`}
              className="w-[300px] shrink-0 bg-[#0B1120] border border-neutral-800 rounded-none p-5 flex flex-col justify-between shadow-xl relative"
            >
              {/* Tech Trim Corner */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00E5FF]" />

              {t.companyLogo && (
                <div className="absolute top-4 right-4 h-4 w-16 flex items-center justify-end select-none pointer-events-none opacity-10 mix-blend-screen">
                  <img src={t.companyLogo} alt="" className="max-h-full max-w-full object-contain filter brightness-125" />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-4">
                <p className="text-xs text-neutral-400 font-mono leading-relaxed text-left break-words line-clamp-4 pr-4">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-neutral-900 pt-3">
                  <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-none border border-neutral-800 bg-[#050816] overflow-hidden flex items-center justify-center shrink-0 mix-blend-luminosity">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt="" className="w-full h-full object-cover select-none filter contrast-125" />
                      ) : (
                        <User2 className="w-3.5 h-3.5 text-neutral-600" />
                      )}
                    </div>
                    <div className="truncate text-left">
                      <strong className="text-xs font-bold font-mono uppercase tracking-wide text-white block truncate">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[9px] font-mono text-neutral-500 truncate">
                          // {t.authorRole || t.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    {t.linkedinUrl && (
                      <a
                        href={t.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#050816] border border-neutral-800 text-neutral-500 hover:text-[#00E5FF] transition-colors"
                      >
                        <FontAwesomeIcon icon={Linkedin} className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP VIEW: HOLOGRAPHIC TILES SCROLLER */}
      {/* ========================================== */}
      <div
        className={`hidden md:block relative w-full overflow-hidden py-6 ${isScrollable ? "group/track cursor-none" : ""}`}
        onMouseEnter={() => isScrollable && setIsDeskPaused(true)}
        onMouseLeave={() => isScrollable && setIsDeskPaused(false)}
      >
        {isScrollable && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050816] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050816] to-transparent z-20 pointer-events-none" />
          </>
        )}

        <motion.div
          className={
            isScrollable
              ? "flex gap-8 whitespace-nowrap min-w-full w-max px-4"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
          }
          animate={isScrollable && !isDeskPaused ? { x: [0, -2500] } : false}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 45,
              ease: "linear"
            }
          }}
        >
          {marqueeItems.map((t: any, idx: number) => (
            <div
              key={`desk-${t.id}-${idx}`}
              className={`shrink-0 bg-[#0B1120] border border-neutral-800 hover:border-[#00E5FF]/40 rounded-none p-6 relative backdrop-blur-xl transition-all duration-300 shadow-[0_20px_45px_rgba(0,0,0,0.5)] flex flex-col justify-between group/card relative overflow-hidden ${
                isScrollable ? "w-[460px] inline-block" : "w-full"
              }`}
            >
              {/* Tech Laser Scanline over card */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] testimonial-scanline pointer-events-none opacity-0 group-hover/card:opacity-100" />
              
              {/* HUD Frame Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-700 group-hover/card:border-[#00E5FF] transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-700 group-hover/card:border-[#7C3AED] transition-colors" />
              <div className="absolute -right-12 -top-12 w-24 h-24 bg-[#00E5FF]/3 rounded-full blur-xl pointer-events-none" />

              {t.companyLogo && (
                <div className="absolute top-6 right-6 h-6 w-20 flex items-center justify-end select-none pointer-events-none z-10 opacity-15 group-hover/card:opacity-25 transition-opacity mix-blend-screen">
                  <img 
                    src={t.companyLogo} 
                    alt="" 
                    className="max-h-full max-w-full object-contain filter brightness-125" 
                  />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-6 relative z-0">
                <p className="text-sm md:text-base text-neutral-300 font-mono leading-relaxed text-wrap break-words italic text-left pr-12">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-neutral-900 pt-4">
                  <div className="flex items-center gap-3.5 truncate flex-1 mr-2">
                    <div className="w-12 h-12 rounded-none border border-neutral-800 bg-[#050816] overflow-hidden flex items-center justify-center shrink-0 shadow-xl mix-blend-luminosity group-hover/card:mix-blend-normal transition-all duration-300">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt={t.authorName} className="w-full h-full object-cover select-none filter contrast-110" />
                      ) : (
                        <User2 className="w-4 h-4 text-neutral-600" />
                      )}
                    </div>

                    <div className="truncate space-y-1 text-left">
                      <strong className="text-sm font-black font-mono uppercase tracking-wider text-white block truncate group-hover/card:text-[#00E5FF] transition-colors">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[11px] font-mono text-neutral-400 truncate">
                          // {t.authorRole} {t.authorRole && t.company ? " [at] " : ""} {t.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pl-2">
                    {t.linkedinUrl && (
                      <a
                        href={t.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#050816] border border-neutral-800 text-neutral-500 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all shadow-md"
                      >
                        <FontAwesomeIcon icon={Linkedin} className="w-4 h-4" />
                      </a>
                    )}

                    {t.featured && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-[#00FF9D]/5 border border-[#00FF9D]/20 text-[9px] font-mono font-bold text-[#00FF9D] uppercase tracking-widest select-none shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                        <Terminal className="w-3 h-3 animate-pulse" /> CORE_SYS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}