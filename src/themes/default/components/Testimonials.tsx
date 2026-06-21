"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, User2, Sparkles } from "lucide-react";
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

  const [setIsPaused] = useState<boolean>(false);
  const [isDeskPaused, setIsDeskPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  if (!sortedTestimonials.length) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <MessageSquare className="w-3.5 h-3.5" />
              Recommendations
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Endorsements.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SLOW MINI-MARQUEE */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full overflow-hidden py-2"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <motion.div 
          className="flex gap-4 px-4 w-max"
          animate={isMobileScrollable && !isMobilePaused ? { x: [0, -1200] } : false}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 45, // Premium slow-motion glide speed
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((t: any, idx: number) => (
            <div
              key={`mob-${t.id || idx}-${idx}`}
              className="w-[280px] shrink-0 bg-[#07070b]/90 border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-md relative"
            >
              {t.companyLogo && (
                <div className="absolute top-4 right-4 h-4 w-16 flex items-center justify-end select-none pointer-events-none opacity-20">
                  <img src={t.companyLogo} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-4">
                <p className="text-xs text-neutral-300 font-light leading-relaxed italic text-left break-words line-clamp-4 pr-6">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-white/10 bg-neutral-900 overflow-hidden flex items-center justify-center shrink-0">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt="" className="w-full h-full object-cover select-none" />
                      ) : (
                        <User2 className="w-3 h-3 text-neutral-600" />
                      )}
                    </div>
                    <div className="truncate text-left">
                      <strong className="text-xs font-semibold tracking-wide text-white block truncate">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[9px] font-mono text-neutral-500 truncate">
                          {t.authorRole || t.company}
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
                        className="p-1.5 rounded-md border border-white/5 bg-white/[0.02] text-neutral-500 hover:text-[#0a66c2] transition-all"
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
      {/* 2. DESKTOP VIEW: STANDARD MATRIX / MARQUEE SCROLLER */}
      {/* ========================================== */}
      <div
        className={`hidden md:block relative w-full overflow-hidden py-4 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
        onMouseEnter={() => isScrollable && setIsDeskPaused(true)}
        onMouseLeave={() => isScrollable && setIsDeskPaused(false)}
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
          animate={isScrollable && !isDeskPaused ? { x: [0, -2500] } : false}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 55,
              ease: "linear"
            }
          }}
        >
          {marqueeItems.map((t: any, idx: number) => (
            <div
              key={`desk-${t.id}-${idx}`}
              className={`shrink-0 bg-[#07070b]/90 border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 relative backdrop-blur-xl transition-all duration-300 shadow-xl flex flex-col justify-between ${
                isScrollable ? "w-[450px] inline-block" : "w-full"
              }`}
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

              {t.companyLogo && (
                <div className="absolute top-5 right-5 h-6 w-20 flex items-center justify-end select-none pointer-events-none z-10">
                  <img 
                    src={t.companyLogo} 
                    alt="" 
                    className="max-h-full max-w-full object-contain brightness-90 opacity-25 contrast-125 transition-opacity group-hover/marquee:opacity-40" 
                  />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-6 relative z-0">
                <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed text-wrap break-words italic text-left pr-12">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3 truncate flex-1 mr-2">
                    <div className="w-11 h-11 rounded-full border border-white/10 bg-neutral-900 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt={t.authorName} className="w-full h-full object-cover select-none" />
                      ) : (
                        <User2 className="w-4 h-4 text-neutral-600" />
                      )}
                    </div>

                    <div className="truncate space-y-0.5 text-left">
                      <strong className="text-sm font-semibold tracking-wide text-white block truncate">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[11px] font-mono text-neutral-500 truncate">
                          {t.authorRole} {t.authorRole && t.company ? " @ " : ""} {t.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    {t.linkedinUrl && (
                      <a
                        href={t.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-white/5 bg-white/[0.02] text-neutral-500 hover:text-[#0a66c2] hover:bg-[#0a66c2]/5 hover:border-[#0a66c2]/20 transition-all shadow-sm"
                      >
                        <FontAwesomeIcon icon={Linkedin} className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {t.featured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-amber-400 bg-amber-400/5 border border-amber-400/10 uppercase tracking-wider select-none">
                        <Sparkles className="w-2.5 h-2.5" /> Core
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