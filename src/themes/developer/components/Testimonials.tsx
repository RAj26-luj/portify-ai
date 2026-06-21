"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, User2, Sparkles, Terminal, Cpu, GitBranch, ExternalLink } from "lucide-react";
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
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  if (!sortedTestimonials.length) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Background Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* IDE Interface Window Header Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Peer Reviews</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">endorsements.json</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> cat peer_reviews.json | grep -A 2 "sign-off"
          </p>
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
              duration: 45,
              ease: "linear"
            }
          }}
        >
          {mobileMarqueeItems.map((t: any, idx: number) => (
            <div
              key={`mob-${t.id || idx}-${idx}`}
              className="w-[290px] shrink-0 bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col justify-between shadow-md relative"
            >
              {t.companyLogo && (
                <div className="absolute top-3 right-3 h-4 w-12 flex items-center justify-end select-none pointer-events-none opacity-10 filter mix-blend-luminosity">
                  <img src={t.companyLogo} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-4">
                <p className="text-xs text-neutral-300 font-sans leading-relaxed italic text-left break-words line-clamp-4 pr-4">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-[#30363D] pt-3">
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <div className="w-8 h-8 rounded bg-[#0D1117] border border-[#30363D] overflow-hidden flex items-center justify-center shrink-0">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt="" className="w-full h-full object-cover filter brightness-90" />
                      ) : (
                        <User2 className="w-3 h-3 text-neutral-500" />
                      )}
                    </div>
                    <div className="truncate text-left">
                      <strong className="text-xs font-bold text-white block truncate">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[10px] text-neutral-500 truncate">
                          {t.authorRole || t.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center shrink-0 pl-1">
                    {t.linkedinUrl && (
                      <a
                        href={t.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-500 hover:text-[#58A6FF] transition-colors"
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
      {/* 2. DESKTOP VIEW: STANDARD TERMINAL CELL GRID / SCROLLER */}
      {/* ========================================== */}
      <div
        className={`hidden md:block relative w-full overflow-hidden py-2 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
        onMouseEnter={() => isScrollable && setIsDeskPaused(true)}
        onMouseLeave={() => isScrollable && setIsDeskPaused(false)}
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
              ? "flex gap-4 whitespace-nowrap min-w-full w-max px-4"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center"
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
              className={`shrink-0 bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] rounded-lg p-5 relative transition-all duration-200 shadow-md flex flex-col justify-between hover:bg-[#1C2128] ${
                isScrollable ? "w-[440px] inline-block" : "w-full"
              }`}
            >
              {t.companyLogo && (
                <div className="absolute top-4 right-4 h-5 w-16 flex items-center justify-end select-none pointer-events-none z-10 opacity-10 filter mix-blend-luminosity">
                  <img 
                    src={t.companyLogo} 
                    alt="" 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-4 relative z-0">
                <p className="text-xs md:text-sm text-[#C9D1D9] font-sans leading-relaxed text-wrap break-words italic text-left pr-6">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-[#30363D] pt-4">
                  <div className="flex items-center gap-3 truncate flex-1 mr-2">
                    <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt={t.authorName} className="w-full h-full object-cover select-none filter brightness-90" />
                      ) : (
                        <User2 className="w-4 h-4 text-neutral-600" />
                      )}
                    </div>

                    <div className="truncate text-left">
                      <strong className="text-sm font-bold text-white block truncate">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[11px] text-neutral-500 truncate font-mono mt-0.5">
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
                        className="p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-neutral-500 hover:text-[#58A6FF] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {t.featured && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#7EE787] bg-[#7EE787]/5 border border-[#7EE787]/10 uppercase tracking-wider select-none">
                        <Sparkles className="w-2.5 h-2.5 text-[#F78166]" /> SIGNED
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