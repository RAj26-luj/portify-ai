"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User2, Sparkles, Terminal, ExternalLink } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin as Linkedin } from "@fortawesome/free-brands-svg-icons";

export interface TestimonialItem {
  id: string | number; // Required strict unique identification key
  testimonial: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  profileImage?: string;
  companyLogo?: string;
  linkedinUrl?: string;
  featured?: boolean;
  displayOrder?: number;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const rawTestimonials = useMemo(
    () => (testimonials && testimonials.length > 0 ? testimonials : []),
    [testimonials]
  );

  const sortedTestimonials = useMemo(() => {
    return [...rawTestimonials].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [rawTestimonials]);

  // Absolute server hydration fence protecting runtime layout evaluation limits
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

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

  // Gating thresholds: Scroll only if > 1 item on mobile, or > 3 items on desktop
  const shouldAutoScroll = useMemo(() => {
    if (isMobileViewport) return sortedTestimonials.length > 1;
    return sortedTestimonials.length > 3;
  }, [sortedTestimonials, isMobileViewport]);

  // Safeguard array allocation logic: prevent excessive repeating if item thresholds are low
  const paddedTestimonials = useMemo(() => {
    if (sortedTestimonials.length === 0) return [];
    if (!shouldAutoScroll) return sortedTestimonials;

    const targetFloor = isMobileViewport ? 6 : 10;
    if (sortedTestimonials.length >= targetFloor) return sortedTestimonials;

    let items: TestimonialItem[] = [];
    while (items.length < targetFloor) {
      items = [...items, ...sortedTestimonials];
    }
    return items;
  }, [sortedTestimonials, isMobileViewport, shouldAutoScroll]);

  // Final layout array composition mapping nodes dynamically onto UI tracks
  const displayItems = useMemo(() => {
    return shouldAutoScroll ? [...paddedTestimonials, ...paddedTestimonials] : sortedTestimonials;
  }, [paddedTestimonials, shouldAutoScroll, sortedTestimonials]);

  // Throttled container layout boundaries calculating limits safely via state checkers
  useEffect(() => {
    if (!isMounted || displayItems.length === 0) return;

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
  }, [displayItems, isMounted, shouldAutoScroll]);

  if (!sortedTestimonials.length || !isMounted) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Declarative CSS keyframe loop running completely on hardware threads */}
      <style>{`
        @keyframes terminal-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-run {
          animation: terminal-marquee 50s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

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

        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg text-left">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> cat peer_reviews.json | grep -A 2 "sign-off"
          </p>
        </div>
      </div>

      {/* Unified Track Wrapper Canvas Container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden py-4 relative group/container touch-pan-y"
      >
        {/* Blended horizontal edge gradients - Only visible during active scrolling tracks */}
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
            shouldAutoScroll ? "cursor-grab active:cursor-grabbing" : "justify-center"
          } ${
            shouldAutoScroll && !isDragged
              ? "animate-marquee-run group-hover/container:marquee-paused"
              : "marquee-paused"
          }`}
        >
          {displayItems.map((t, idx) => {
            const itemKey = `testimonial-node-${idx}-${t.id}`;

            return (
              <div
                key={itemKey}
                className={`shrink-0 bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF] rounded-lg p-4 md:p-5 relative transition-all duration-200 shadow-md flex flex-col justify-between hover:bg-[#1C2128] text-left ${
                  shouldAutoScroll ? "w-[290px] md:w-[440px]" : "w-[290px] md:w-[360px]"
                }`}
              >
                {t.companyLogo && (
                  <div className="absolute top-4 right-4 h-4 md:h-5 w-12 md:w-16 flex items-center justify-end select-none pointer-events-none z-10 opacity-10 filter mix-blend-luminosity">
                    <img
                      src={t.companyLogo}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between h-full space-y-4 relative z-0">
                  <p className="text-xs md:text-sm text-[#C9D1D9] font-sans leading-relaxed text-wrap break-words italic text-left pr-6">
                    "{t.testimonial}"
                  </p>

                  <div className="flex items-center justify-between border-t border-[#30363D] pt-4">
                    <div className="flex items-center gap-2 md:grid-cols-3 truncate flex-1 mr-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-[#0D1117] border border-[#30363D] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        {t.profileImage ? (
                          <img
                            src={t.profileImage}
                            alt={`Profile photograph of ${t.authorName}`}
                            loading="lazy"
                            className="w-full h-full object-cover select-none filter brightness-90"
                          />
                        ) : (
                          <User2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-600" />
                        )}
                      </div>

                      <div className="truncate text-left pointer-events-none">
                        <strong className="text-xs md:text-sm font-bold text-white block truncate font-sans">
                          {t.authorName}
                        </strong>
                        {(t.authorRole || t.company) && (
                          <p className="text-[10px] md:text-[11px] text-neutral-500 truncate font-mono mt-0.5">
                            {t.authorRole} {t.authorRole && t.company ? " @ " : ""} {t.company}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {t.linkedinUrl && (
                        <a
                          href={t.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open LinkedIn profile vector for ${t.authorName}`}
                          className="p-1 md:p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-neutral-500 hover:text-[#58A6FF] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
