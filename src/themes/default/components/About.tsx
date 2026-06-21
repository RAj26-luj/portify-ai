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

    const rY = (mouseX / (width / 2)) * 5;
    const rX = -(mouseY / (height / 2)) * 5;

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
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30 md:perspective-[1500px]"
    >
      {/* Background Matrix Architecture Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a4003_1px,transparent_1px),linear-gradient(to_bottom,#2a2a4003_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.04),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* HUD Structural Section Title */}
        <div className="flex items-center gap-3 mb-10 md:mb-16 group select-none">
          <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg border border-white/10 bg-white/5 text-purple-400 font-mono text-[10px] md:text-xs shadow-sm">
            01
          </div>
          <h2 className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            // {identityName.toUpperCase()}_DOSSIER
          </h2>
          <div className="h-[1px] bg-white/5 flex-grow ml-4" />
        </div>

        {/* Asymmetric Two-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* COLUMN 1: EXECUTIVE IDENTITY COMPACT BLUEPRINT */}
          <div className="lg:col-span-5 w-full md:[transform-style:preserve-3d]">
            
            {/* DESKTOP VIEW: Dynamic 3D Interaction Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block relative w-full bg-gradient-to-b from-[#08080d] to-[#040407] border border-white/10 rounded-2xl p-8 shadow-2xl transition-all duration-200 ease-out [transform-style:preserve-3d]"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                borderColor: isHovered ? "rgba(147, 51, 234, 0.25)" : "rgba(255, 255, 255, 0.06)"
              }}
            >
              <span className="absolute top-3 left-3 w-3 h-[1px] bg-white/5 group-hover/card:bg-purple-500/20" />
              <span className="absolute top-3 left-3 w-[1px] h-3 bg-white/5 group-hover/card:bg-purple-500/20" />
              <span className="absolute bottom-3 right-3 w-3 h-[1px] bg-white/5 group-hover/card:bg-purple-500/20" />
              <span className="absolute bottom-3 right-3 w-[1px] h-3 bg-white/5 group-hover/card:bg-purple-500/20" />

              <div className="space-y-4 [transform-style:preserve-3d]">
                <div className="flex items-center justify-between pb-4 border-b border-white/5" style={{ transform: "translateZ(15px)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">SYS_CORE_ACTIVE</span>
                  </div>
                  <Cpu size={14} className="text-neutral-600" />
                </div>

                <div className="space-y-2 text-left" style={{ transform: "translateZ(25px)" }}>
                  {heroIntroduction && (
                    <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase block">
                      {heroIntroduction}
                    </span>
                  )}
                  {currentRole && (
                    <h3 className="text-xl font-bold tracking-tight text-white font-sans">
                      {currentRole}
                    </h3>
                  )}
                </div>

                <div className="space-y-3 pt-2 text-left" style={{ transform: "translateZ(18px)" }}>
                  {currentFocus && (
                    <div className="flex items-center gap-2.5 text-xs text-neutral-400 bg-white/[0.01] border border-white/5 p-2.5 rounded-xl">
                      <Target size={13} className="text-purple-400 shrink-0" />
                      <span className="text-neutral-500 font-mono text-[11px]">FOCUS:</span>
                      <span className="text-neutral-300 truncate">{currentFocus}</span>
                    </div>
                  )}

                  {availabilityStatus && (
                    <div className="flex items-center gap-2.5 text-xs text-neutral-400 bg-white/[0.01] border border-white/5 p-2.5 rounded-xl">
                      <Clock size={13} className="text-emerald-400 shrink-0" />
                      <span className="text-neutral-500 font-mono text-[11px]">STATUS:</span>
                      <span className="text-neutral-300 truncate">{availabilityStatus}</span>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-2.5 text-xs text-neutral-400 bg-white/[0.01] border border-white/5 p-2.5 rounded-xl">
                      <MapPin size={13} className="text-cyan-400 shrink-0" />
                      <span className="text-neutral-500 font-mono text-[11px]">LOC:</span>
                      <span className="text-neutral-300 truncate">{location.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-600 uppercase tracking-widest" style={{ transform: "translateZ(10px)" }}>
                  <span className="flex items-center gap-1"><Binary size={10} /> {identityName.toUpperCase()} // #01</span>
                  <span>SECURE_UPLINK</span>
                </div>
              </div>
            </div>

            {/* MOBILE VIEW: Ultra-Slim Ergonomic HUD Parameter Stack */}
            <div className="block md:hidden w-full bg-[#050508] border border-neutral-900 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase">CORE_ACTIVE</span>
                </div>
                <Cpu size={12} className="text-neutral-600" />
              </div>

              <div className="space-y-1 text-left">
                {heroIntroduction && (
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase block">
                    {heroIntroduction}
                  </span>
                )}
                {currentRole && (
                  <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                    {currentRole}
                  </h3>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1 text-left">
                {currentFocus && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <Target size={12} className="text-purple-400 shrink-0" />
                    <span className="text-neutral-300 truncate">{currentFocus}</span>
                  </div>
                )}
                {availabilityStatus && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <Clock size={12} className="text-emerald-400 shrink-0" />
                    <span className="text-neutral-300 truncate">{availabilityStatus}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <MapPin size={12} className="text-cyan-400 shrink-0" />
                    <span className="text-neutral-300 truncate">{location.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* COLUMN 2: FLUID NARRATIVE CONTENT CANVAS */}
          <div className="lg:col-span-7 space-y-5 md:space-y-6 text-left">
            {tagline && (
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent font-sans leading-tight">
                {tagline}
              </h4>
            )}

            <div className="w-10 h-[1px] bg-purple-500/40" />

            {bio && (
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-sans font-light whitespace-pre-line">
                {bio}
              </p>
            )}

            {description && (
              <div className="relative p-4 md:p-5 bg-white/[0.01] border border-white/5 rounded-xl md:rounded-2xl overflow-hidden mt-2">
                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-purple-500/30" />
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light whitespace-pre-line pl-2">
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