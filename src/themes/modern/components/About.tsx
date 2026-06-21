"use client";

import React, { useState, useRef } from "react";
import { MapPin, Target, Clock, Cpu, Binary } from "lucide-react";

interface AboutProps {
  portfolio: {
    bio?: string;
    tagline?: string;
    resumeHeadline?: string;
    description?: string;
    currentRole?: string;
    currentFocus?: string;
    availabilityStatus?: string;
    heroIntroduction?: string;
    city?: string;
    state?: string;
    country?: string;
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function About({ portfolio }: AboutProps) {
  const bio = portfolio?.bio || "";
  const tagline = portfolio?.tagline || portfolio?.resumeHeadline || "";
  const description = portfolio?.description || "";
  const currentRole = portfolio?.currentRole || "";
  const currentFocus = portfolio?.currentFocus || "";
  const availabilityStatus = portfolio?.availabilityStatus || "";
  const heroIntroduction = portfolio?.heroIntroduction || "";
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  const location = [
    portfolio?.city,
    portfolio?.state,
    portfolio?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!bio && !tagline && !description && !heroIntroduction && !currentRole) {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rY = (mouseX / (width / 2)) * 8;
    const rX = -(mouseY / (height / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 md:perspective-[2000px]"
    >
      {/* Premium SaaS Grid Overlay & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#6366F1]/10 to-[#8B5CF6]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#06B6D4]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
        
        {/* Visual Redesign: Clean Segment Header */}
        <div className="flex items-center gap-4 mb-16 md:mb-24 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            <span className="text-xs font-semibold tracking-wider text-[#71717A] uppercase font-mono">
              01 // Overview
            </span>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-[#18181B] via-[#71717A]/20 to-transparent flex-grow" />
        </div>

        {/* Visual Redesign: Modern Split Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* COLUMN 1: PREMIUM SAAS PROFILE PANEL */}
          <div className="lg:col-span-5 w-full md:[transform-style:preserve-3d]">
            
            {/* DESKTOP VIEW: Glassmorphic Interactive Widget */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block relative w-full bg-[#111113]/70 backdrop-blur-xl border border-[#18181B] rounded-2xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out [transform-style:preserve-3d]"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                boxShadow: isHovered 
                  ? "0 30px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 0 40px -5px rgba(99, 102, 241, 0.15)" 
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.02)",
                borderColor: isHovered ? "rgba(99, 102, 241, 0.3)" : "#18181B"
              }}
            >
              {/* Decorative Corner Flairs mimicking modern SaaS platforms */}
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-[#6366F1]/50 to-transparent" />
              <div className="absolute top-0 left-0 w-[1px] h-8 bg-gradient-to-b from-[#6366F1]/50 to-transparent" />

              <div className="space-y-6 [transform-style:preserve-3d]">
                <div className="flex items-center justify-between pb-5 border-b border-[#18181B]" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4]"></span>
                    </span>
                    <span className="text-[11px] font-mono font-medium tracking-widest text-[#71717A] uppercase">Active User Node</span>
                  </div>
                  <Cpu size={16} className="text-[#71717A]" />
                </div>

                <div className="space-y-3 text-left" style={{ transform: "translateZ(35px)" }}>
                  {heroIntroduction && (
                    <span className="text-[11px] font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] uppercase block font-mono">
                      {heroIntroduction}
                    </span>
                  )}
                  {currentRole && (
                    <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
                      {currentRole}
                    </h3>
                  )}
                </div>

                {/* Statistics / Parameters Stack */}
                <div className="space-y-3 pt-3 text-left" style={{ transform: "translateZ(25px)" }}>
                  {currentFocus && (
                    <div className="flex items-center gap-3 text-sm text-[#D4D4D8] bg-[#18181B]/40 border border-[#18181B] p-3 rounded-xl transition-all duration-300 hover:bg-[#18181B]/60">
                      <div className="p-1.5 bg-[#6366F1]/10 rounded-lg border border-[#6366F1]/20">
                        <Target size={14} className="text-[#6366F1] shrink-0" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[#71717A] font-mono text-[10px] uppercase tracking-wider">Current Focus</span>
                        <span className="text-[#D4D4D8] text-xs font-medium truncate">{currentFocus}</span>
                      </div>
                    </div>
                  )}

                  {availabilityStatus && (
                    <div className="flex items-center gap-3 text-sm text-[#D4D4D8] bg-[#18181B]/40 border border-[#18181B] p-3 rounded-xl transition-all duration-300 hover:bg-[#18181B]/60">
                      <div className="p-1.5 bg-[#06B6D4]/10 rounded-lg border border-[#06B6D4]/20">
                        <Clock size={14} className="text-[#06B6D4] shrink-0" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[#71717A] font-mono text-[10px] uppercase tracking-wider">Availability</span>
                        <span className="text-[#D4D4D8] text-xs font-medium truncate">{availabilityStatus}</span>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-3 text-sm text-[#D4D4D8] bg-[#18181B]/40 border border-[#18181B] p-3 rounded-xl transition-all duration-300 hover:bg-[#18181B]/60">
                      <div className="p-1.5 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
                        <MapPin size={14} className="text-[#8B5CF6] shrink-0" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[#71717A] font-mono text-[10px] uppercase tracking-wider">Location</span>
                        <span className="text-[#D4D4D8] text-xs font-medium truncate">{location}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#18181B] flex items-center justify-between text-[11px] font-mono text-[#71717A] tracking-wider" style={{ transform: "translateZ(15px)" }}>
                  <span className="flex items-center gap-1.5"><Binary size={12} className="text-[#6366F1]" /> {identityName}</span>
                  <span className="text-[#6366F1]/70">v1.0.4</span>
                </div>
              </div>
            </div>

            {/* MOBILE VIEW: Premium Component Stack */}
            <div className="block md:hidden w-full bg-[#111113] border border-[#18181B] rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#18181B]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                  <span className="text-[10px] font-mono tracking-wider text-[#71717A] uppercase">Active User Node</span>
                </div>
                <Cpu size={14} className="text-[#71717A]" />
              </div>

              <div className="space-y-1.5 text-left">
                {heroIntroduction && (
                  <span className="text-[10px] font-semibold tracking-widest text-[#6366F1] uppercase block font-mono">
                    {heroIntroduction}
                  </span>
                )}
                {currentRole && (
                  <h3 className="text-xl font-bold tracking-tight text-white font-sans">
                    {currentRole}
                  </h3>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-1 text-left">
                {currentFocus && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#18181B]/60 border border-[#18181B] text-xs">
                    <Target size={14} className="text-[#6366F1] shrink-0" />
                    <span className="text-[#D4D4D8] truncate">{currentFocus}</span>
                  </div>
                )}
                {availabilityStatus && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#18181B]/60 border border-[#18181B] text-xs">
                    <Clock size={14} className="text-[#06B6D4] shrink-0" />
                    <span className="text-[#D4D4D8] truncate">{availabilityStatus}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#18181B]/60 border border-[#18181B] text-xs">
                    <MapPin size={14} className="text-[#8B5CF6] shrink-0" />
                    <span className="text-[#D4D4D8] truncate">{location}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* COLUMN 2: PREMIUM NARRATIVE CONTENT CANVAS */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            {tagline && (
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans leading-[1.15]">
                {tagline}
              </h4>
            )}

            <div className="h-[2px] w-12 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />

            {bio && (
              <p className="text-sm sm:text-base md:text-lg text-[#D4D4D8] leading-relaxed font-sans font-normal text-justify md:text-left [text-wrap:balance]">
                {bio}
              </p>
            )}

            {description && (
              <div className="relative p-5 md:p-6 bg-gradient-to-b from-[#111113] to-[#0A0A0B] border border-[#18181B] rounded-2xl overflow-hidden mt-4 shadow-inner group">
                <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-[#6366F1] to-[#06B6D4]" />
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed font-sans font-normal whitespace-pre-line pl-3 transition-colors duration-300 group-hover:text-[#D4D4D8]">
                  {description}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}