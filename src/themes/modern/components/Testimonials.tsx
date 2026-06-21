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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
    >
      {/* Premium SaaS Tech Grid and Ambient Glow Backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#6366F1]/5 to-[#06B6D4]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <MessageSquare className="w-3.5 h-3.5 text-[#6366F1]" />
              Recommendations
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Endorsements<span className="text-[#8B5CF6]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. MOBILE RESPONSIVE VIEW: AUTOMATED SWIPE TRACKS */}
      {/* ========================================== */}
      <div 
        className="block md:hidden w-full overflow-hidden py-2"
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
              className="w-[290px] shrink-0 bg-[#111113] border border-[#18181B] rounded-2xl p-5 flex flex-col justify-between shadow-xl relative text-left"
            >
              {t.companyLogo && (
                <div className="absolute top-5 right-5 h-4 w-16 flex items-center justify-end select-none pointer-events-none opacity-20 filter brightness-200">
                  <img src={t.companyLogo} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-4">
                <p className="text-xs text-[#D4D4D8] font-normal leading-relaxed italic break-words line-clamp-4 pr-4 font-sans">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-[#18181B] pt-4">
                  <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-[#18181B] bg-[#0A0A0B] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt="" className="w-full h-full object-cover select-none" />
                      ) : (
                        <User2 className="w-3.5 h-3.5 text-[#71717A]" />
                      )}
                    </div>
                    <div className="truncate">
                      <strong className="text-xs font-bold tracking-tight text-white block truncate font-sans">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[10px] font-mono font-medium text-[#71717A] truncate mt-0.5">
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
                        className="p-1.5 rounded-lg border border-[#18181B] bg-[#18181B]/40 text-[#71717A] hover:text-white transition-all shadow-sm"
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
      {/* 2. DESKTOP VIEW: PREMIUM SAAS FLOATING SCROLLER */}
      {/* ========================================== */}
      <div
        className={`hidden md:block relative w-full overflow-hidden py-4 ${isScrollable ? "group/marquee cursor-grab active:cursor-grabbing" : ""}`}
        onMouseEnter={() => isScrollable && setIsDeskPaused(true)}
        onMouseLeave={() => isScrollable && setIsDeskPaused(false)}
      >
        {isScrollable && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
          </>
        )}

        <motion.div
          className={
            isScrollable
              ? "flex gap-6 whitespace-nowrap min-w-full w-max px-6"
              : "max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
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
              className={`shrink-0 bg-[#111113]/80 border border-[#18181B] hover:border-[#6366F1]/30 rounded-2xl p-6 relative backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.02)] flex flex-col justify-between group/card text-left ${
                isScrollable ? "w-[460px] inline-block" : "w-full"
              }`}
            >
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {t.companyLogo && (
                <div className="absolute top-6 right-6 h-6 w-20 flex items-center justify-end select-none pointer-events-none z-10 opacity-25 group-hover/card:opacity-40 transition-opacity filter brightness-200">
                  <img 
                    src={t.companyLogo} 
                    alt="" 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-6 relative z-0">
                <p className="text-sm md:text-base text-[#D4D4D8] font-normal leading-relaxed text-wrap break-words italic pr-12 font-sans [text-wrap:balance]">
                  "{t.testimonial}"
                </p>

                <div className="flex items-center justify-between border-t border-[#18181B] pt-4">
                  <div className="flex items-center gap-3.5 truncate flex-1 mr-2">
                    <div className="w-11 h-11 rounded-full border border-[#18181B] bg-[#0A0A0B] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {t.profileImage ? (
                        <img src={t.profileImage} alt={t.authorName} className="w-full h-full object-cover select-none" />
                      ) : (
                        <User2 className="w-4 h-4 text-[#71717A]" />
                      )}
                    </div>

                    <div className="truncate space-y-0.5">
                      <strong className="text-sm font-bold tracking-tight text-white block truncate font-sans">
                        {t.authorName}
                      </strong>
                      {(t.authorRole || t.company) && (
                        <p className="text-[11px] font-mono font-semibold text-[#71717A] truncate">
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
                        className="p-2 rounded-xl border border-[#18181B] bg-[#18181B]/40 text-[#71717A] hover:text-[#6366F1] hover:bg-[#6366F1]/5 hover:border-[#6366F1]/20 transition-all shadow-sm"
                      >
                        <FontAwesomeIcon icon={Linkedin} className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {t.featured && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/5 border border-[#06B6D4]/10 uppercase tracking-wider select-none shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#06B6D4]" /> Core
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