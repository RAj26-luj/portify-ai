"use client";

import React, { useState, useRef } from "react";
import { MapPin, Target, Clock, Cpu, Binary, ShieldAlert, Radio, Terminal } from "lucide-react";

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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30 perspective-[1200px]"
    >
      {/* Global CSS Injection for Custom Animations */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .cyber-scanline {
          animation: scan 6s linear infinite;
        }
      `}</style>

      {/* Cyberpunk Glitch & Neon Matrix Architecture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E5FF08_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF08_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(124,58,237,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00E5FF]/5 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#7C3AED]/5 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Cyberpunk Scanner Scanline Bar */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent shadow-[0_0_12px_#00E5FF] pointer-events-none cyber-scanline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Cyberpunk HUD Lab Section Header */}
        <div className="flex items-center justify-between mb-12 md:mb-20 border-b border-[#00E5FF]/10 pb-4 select-none">
          <div className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded border border-[#00E5FF]/30 bg-[#0B1120] text-[#00E5FF] font-mono text-xs shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              <span className="absolute inset-0 bg-[#00E5FF]/5 animate-ping rounded" />
              01
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-mono font-black tracking-[0.25em] text-[#00E5FF] uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                // SYSTEM_DOSSIER
              </h2>
              <p className="text-[10px] text-neutral-500 font-mono tracking-wider mt-0.5">CORE_SPECIFICATION_V4.2.6</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#00FF9D]/70 bg-[#0B1120] border border-[#00FF9D]/20 px-3 py-1 rounded">
            <Radio size={12} className="animate-pulse" />
            <span>LINK_ESTABLISHED</span>
          </div>
        </div>

        {/* Cyberpunk Layout - Reordered and Redesigned Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          
          {/* COLUMN 1: INTEL & CORE DECRYPT (Fluid Narrative Content Canvas) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left order-2 lg:order-1">
            <div className="space-y-6">
              {tagline && (
                <div className="relative group">
                  <div className="absolute -left-4 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#00E5FF] to-[#7C3AED]" />
                  <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC] font-mono uppercase leading-none pl-2">
                    {tagline}
                  </h4>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF9D]" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#00FF9D] uppercase">ACCESS_GRANTED_DECRYPTED</span>
                <div className="h-[1px] bg-gradient-to-r from-[#00FF9D]/30 to-transparent flex-grow" />
              </div>

              {bio && (
                <div className="relative p-6 bg-[#0B1120]/80 border border-neutral-800 rounded-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-md">
                  <Terminal size={16} className="absolute top-3 right-3 text-neutral-600" />
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-mono whitespace-pre-line">
                    {bio}
                  </p>
                </div>
              )}

              {description && (
                <div className="relative p-5 bg-[#0B1120]/30 border-l-2 border-dashed border-[#7C3AED]/40 bg-gradient-to-r from-[#7C3AED]/5 to-transparent rounded-r-xl overflow-hidden mt-4">
                  <div className="flex items-center gap-2 mb-2 text-[#7C3AED] text-xs font-mono">
                    <ShieldAlert size={14} />
                    <span>ADDITIONAL_DATA_STREAM:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-neutral-900 flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>MEM_BLOCK_OVR: OK</span>
              <span>COMPILER_TARGET: WEBKIT</span>
              <span>SYS_IDENTITY: {identityName.toUpperCase()}</span>
            </div>
          </div>
          
          {/* COLUMN 2: CYBERPUNK LAB HOLO CARD (Executive Identity Compact Blueprint) */}
          <div className="lg:col-span-5 w-full [transform-style:preserve-3d] order-1 lg:order-2 flex items-center justify-center">
            
            {/* DESKTOP VIEW: Holographic Interactive 3D Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block relative w-full bg-[#0B1120]/90 border border-[#00E5FF]/20 rounded-xl p-8 transition-all duration-200 ease-out [transform-style:preserve-3d] overflow-hidden backdrop-blur-xl"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                boxShadow: isHovered 
                  ? "0 25px 60px -15px rgba(0,229,255,0.15), inset 0 0 20px rgba(0,229,255,0.1)" 
                  : "0 20px 40px -20px rgba(0,0,0,0.7), inset 0 0 10px rgba(255,255,255,0.02)",
                borderColor: isHovered ? "#00E5FF" : "rgba(0, 229, 255, 0.2)"
              }}
            >
              {/* Cyberpunk Card Decorative Corners */}
              <span className="absolute top-0 left-0 w-4 h-[2px] bg-[#00E5FF]" />
              <span className="absolute top-0 left-0 w-[2px] h-4 bg-[#00E5FF]" />
              <span className="absolute top-0 right-0 w-4 h-[2px] bg-[#00E5FF]" />
              <span className="absolute top-0 right-0 w-[2px] h-4 bg-[#00E5FF]" />
              <span className="absolute bottom-0 left-0 w-4 h-[2px] bg-[#7C3AED]" />
              <span className="absolute bottom-0 left-0 w-[2px] h-4 bg-[#7C3AED]" />
              <span className="absolute bottom-0 right-0 w-4 h-[2px] bg-[#7C3AED]" />
              <span className="absolute bottom-0 right-0 w-[2px] h-4 bg-[#7C3AED]" />

              {/* Glowing Ambient Light Backing Inside Card */}
              <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-[#7C3AED]/10 rounded-full filter blur-xl pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-48 h-48 bg-[#00E5FF]/10 rounded-full filter blur-xl pointer-events-none" />

              <div className="space-y-6 [transform-style:preserve-3d]">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D]"></span>
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.15em] text-[#00FF9D] uppercase">LAB_OPERATOR_ACTIVE</span>
                  </div>
                  <Cpu size={14} className="text-[#00E5FF] animate-spin duration-3000" />
                </div>

                <div className="space-y-2 text-left" style={{ transform: "translateZ(40px)" }}>
                  {heroIntroduction && (
                    <span className="text-[10px] font-mono tracking-[0.3em] text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/30 px-2 py-0.5 rounded uppercase inline-block">
                      {heroIntroduction}
                    </span>
                  )}
                  {currentRole && (
                    <h3 className="text-2xl font-black tracking-wide text-white font-mono uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {currentRole}
                    </h3>
                  )}
                </div>

                <div className="space-y-3 pt-2 text-left" style={{ transform: "translateZ(30px)" }}>
                  {currentFocus && (
                    <div className="flex items-center gap-3 text-xs bg-[#050816]/60 border border-neutral-800 hover:border-[#00E5FF]/40 transition-colors p-3 rounded-lg group/item">
                      <Target size={14} className="text-[#00E5FF] group-hover/item:rotate-45 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">OBJECTIVE_FOCUS</span>
                        <span className="text-neutral-200 font-mono text-xs">{currentFocus}</span>
                      </div>
                    </div>
                  )}

                  {availabilityStatus && (
                    <div className="flex items-center gap-3 text-xs bg-[#050816]/60 border border-neutral-800 hover:border-[#00FF9D]/40 transition-colors p-3 rounded-lg group/item">
                      <Clock size={14} className="text-[#00FF9D] animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">RUNTIME_STATUS</span>
                        <span className="text-neutral-200 font-mono text-xs">{availabilityStatus}</span>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-3 text-xs bg-[#050816]/60 border border-neutral-800 hover:border-[#7C3AED]/40 transition-colors p-3 rounded-lg group/item">
                      <MapPin size={14} className="text-[#7C3AED]" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">SECTOR_COORD</span>
                        <span className="text-neutral-200 font-mono text-xs uppercase">{location}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest" style={{ transform: "translateZ(15px)" }}>
                  <span className="flex items-center gap-1.5"><Binary size={11} className="text-[#00E5FF]" /> NETWORK: SECURE</span>
                  <span className="text-[#7C3AED]">NODE_#{identityName.slice(0,3).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* MOBILE VIEW: Grid HUD Stack with Cyberpunk Trim */}
            <div className="block md:hidden w-full bg-[#0B1120] border-2 border-neutral-800 rounded-xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#00E5FF]/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9D]" />
                  <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">LAB_OPERATOR_ACTIVE</span>
                </div>
                <Cpu size={12} className="text-[#00E5FF]" />
              </div>

              <div className="space-y-1 text-left">
                {heroIntroduction && (
                  <span className="text-[9px] font-mono tracking-widest text-[#7C3AED] uppercase block">
                    {heroIntroduction}
                  </span>
                )}
                {currentRole && (
                  <h3 className="text-xl font-bold tracking-wide text-white font-mono uppercase">
                    {currentRole}
                  </h3>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1 text-left">
                {currentFocus && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#050816] border border-neutral-800 text-xs font-mono">
                    <Target size={12} className="text-[#00E5FF] shrink-0" />
                    <span className="text-neutral-300 truncate">{currentFocus}</span>
                  </div>
                )}
                {availabilityStatus && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#050816] border border-neutral-800 text-xs font-mono">
                    <Clock size={12} className="text-[#00FF9D] shrink-0" />
                    <span className="text-neutral-300 truncate">{availabilityStatus}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#050816] border border-neutral-800 text-xs font-mono">
                    <MapPin size={12} className="text-[#7C3AED] shrink-0" />
                    <span className="text-neutral-300 truncate uppercase">{location}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}