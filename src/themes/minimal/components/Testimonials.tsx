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

  const [isDeskPaused, setIsDeskPaused] = useState<boolean>(false);
  const [isMobilePaused, setIsMobilePaused] = useState<boolean>(false);

  if (!sortedTestimonials.length) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full py-16 md:py-24 overflow-hidden bg-white text-[#111827] selection:bg-gray-200"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              08 / Recommendations
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
              Endorsements.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: SWISS MINIMAL LIST ROWS */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full overflow-hidden py-1"
        onTouchStart={() => isMobileScrollable && setIsMobilePaused(true)}
        onTouchEnd={() => isMobileScrollable && setIsMobilePaused(false)}
        onMouseEnter={() => isMobileScrollable && setIsMobilePaused(true)}
        onMouseLeave={() => isMobileScrollable && setIsMobilePaused(false)}
      >
        <motion.div 
          className="flex gap-4 px-6 w-max"
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
              className="w-[300px] shrink-0 bg-[#FAFAFA] border border-gray-200 rounded-none p-5 flex flex-col justify-between text-left"
            >
              <div className="flex flex-col justify-between h-full space-y-4 relative">
                {t.companyLogo && (
                  <div className="absolute top-0 right-0 h-4 w-14 flex items-center justify-end select-none pointer-events-none opacity-40 grayscale">
                    <img src={t.companyLogo} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <p className="text-xs text-gray-600 font-normal leading-relaxed font-sans pr-6 [text-wrap:balance]">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
                  <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-none border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt="" className="w-full h-full object-cover select-none grayscale" />
                      ) : (
                        <User2 className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <strong className="text-xs font-extrabold tracking-tight text-[#111827] block truncate font-sans uppercase">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wide truncate mt-0.5">
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
                        className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors rounded-none"
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
      {/* 2. DESKTOP VIEW: INFINITE SCROLLING MARQUEE STRIP */}
      {/* ========================================== */}
      <div
        className={`hidden md:block relative w-full overflow-hidden py-2 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
        onMouseEnter={() => isScrollable && setIsDeskPaused(true)}
        onMouseLeave={() => isScrollable && setIsDeskPaused(false)}
      >
        <motion.div
          className={
            isScrollable
              ? "flex gap-8 whitespace-nowrap min-w-full w-max px-6"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
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
              className={`shrink-0 bg-white border-b-2 border-gray-100 hover:border-[#111827] p-6 relative transition-all duration-300 flex flex-col justify-between text-left ${
                isScrollable ? "w-[440px] inline-block" : "w-full"
              }`}
            >
              <div className="flex flex-col justify-between h-full space-y-6 relative">
                {t.companyLogo && (
                  <div className="absolute top-0 right-0 h-5 w-16 flex items-center justify-end select-none pointer-events-none opacity-50 grayscale transition-opacity group-hover/marquee:opacity-80">
                    <img 
                      src={t.companyLogo} 
                      alt="" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  </div>
                )}

                <p className="text-sm text-gray-600 font-normal leading-relaxed text-wrap break-words font-sans pr-12">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                  <div className="flex items-center gap-3.5 truncate flex-1 mr-3">
                    <div className="w-10 h-11 border border-gray-200 bg-[#FAFAFA] overflow-hidden flex items-center justify-center shrink-0 rounded-none">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt={t.authorName} className="w-full h-full object-cover select-none grayscale" />
                      ) : (
                        <User2 className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    <div className="truncate text-left space-y-0.5">
                      <strong className="text-sm font-extrabold tracking-tight text-[#111827] block truncate font-sans uppercase">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-wider truncate">
                          {t.authorRole} {t.authorRole && t.company ? " / " : ""} {t.company}
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
                        className="p-2 bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] hover:border-gray-400 transition-colors rounded-none"
                      >
                        <FontAwesomeIcon icon={Linkedin} className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {t.featured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold text-[#111827] bg-gray-100 border border-gray-200 uppercase tracking-widest rounded-none">
                        <Sparkles className="w-2.5 h-2.5 text-gray-400" /> CORE
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