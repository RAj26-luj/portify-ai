"use client";

import React, { useState, useRef } from "react";
import { 
  Terminal, 
  Cpu, 
  Binary, 
  Sparkles, 
  MapPin,
  Workflow,
  Compass,
  FileText,
  Eye
} from "lucide-react";

const DEFAULT_AVATAR_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN660u5cy6lw3z51JZxGGvrGF1_Se8ENZG0LoS8_0nGg&s=10";

interface HeroProps {
  portfolio: {
    title?: string;
    tagline?: string;
    resumeHeadline?: string;
    currentRole?: string;
    heroIntroduction?: string;
    description?: string;
    currentFocus?: string;
    availabilityStatus?: string;
    city?: string;
    state?: string;
    country?: string;
    profileImage?: string;
    updatedAt?: string;

    username?: string;

    resume?: {
      fileUrl?: string;
    };

    user?: {
      name?: string;
      image?: string;
    };
    media?: Array<{ type: string; usage: string; url: string }>;
  };
}

export default function Hero({ portfolio }: HeroProps) {
  const name = portfolio?.title || portfolio?.user?.name || "Developer Elite";
  const tagline = portfolio?.tagline || portfolio?.resumeHeadline || "";
  const role = portfolio?.currentRole || "Software Architect";
  const heroIntroduction = portfolio?.heroIntroduction || "";
  const description = portfolio?.description || "";
  const currentFocus = portfolio?.currentFocus || "";
  const availabilityStatus = portfolio?.availabilityStatus || "";

  const location = [
    portfolio?.city,
    portfolio?.state,
    portfolio?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const image =
    portfolio?.profileImage ||
    portfolio?.user?.image ||
    portfolio?.media?.find(
      (m: any) => m?.type === "IMAGE" && m?.usage === "profile"
    )?.url ||
    DEFAULT_AVATAR_IMAGE;

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    const rY = (mouseX / (width / 2)) * 6; 
    const rX = -(mouseY / (height / 2)) * 6; 
    
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
      className="relative min-h-screen flex items-center pt-20 md:pt-32 overflow-hidden bg-black text-white selection:bg-purple-500/30"
      id="home"
    >
      {/* Structural Ambient Glow Meshes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(139,92,246,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full z-10 py-12 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* ========================================== */}
          {/* 1. MOBILE DEVICE PORTRAIT: TOP CIRCLE IMAGE NODE */}
          {/* ========================================== */}
          <div className="block lg:hidden w-full flex justify-center select-none mb-2">
            <div className="relative w-44 h-44 rounded-full p-1.5 border border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-transparent shadow-[0_0_25px_rgba(139,92,246,0.15)] flex items-center justify-center">
              
              {/* Spinning framing perimeter rail track */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_80s_linear_infinite]" />
              
              {/* Core Rounded Graphic Anchor */}
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border border-white/10 relative">
                <img
                  src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                  className="w-full h-full object-cover select-none"
                  alt={name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>

              {/* Status active telemetry beacon dot */}
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-neutral-300 bg-neutral-950 border border-white/10 backdrop-blur-md p-1.5 rounded-full flex items-center justify-center shadow-xl">
                <Sparkles size={10} className="text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* LEFT CHASSIS: Core Descriptive Typography Terminal */}
          <div className="space-y-5 md:space-y-6 lg:col-span-7 relative z-10 text-left">
            
            {/* Dynamic Status Availability Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-medium text-purple-400 tracking-wider uppercase backdrop-blur-md select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500" />
              </span>
              {availabilityStatus ? availabilityStatus.toUpperCase().replace(/\s+/g, "_") : "ENGINE_UPLINK_ACTIVE"}
            </div>

            {/* Typography Gradient Header */}
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sans tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent leading-none">
                {name}<span className="text-purple-500 inline-block animate-pulse">.</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-1">
                {role && (
                  <h3 className="text-lg md:text-2xl font-mono font-semibold text-neutral-400 tracking-tight">
                    {role}
                  </h3>
                )}
                {heroIntroduction && (
                  <>
                    <span className="text-neutral-800 font-mono text-sm hidden sm:inline">//</span>
                    <span className="font-mono text-[9px] md:text-[10px] text-neutral-500 tracking-wider bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded uppercase hidden sm:inline-block">
                      {heroIntroduction}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Content Abstract Description */}
            {(tagline || description || location) && (
              <div className="space-y-2.5 max-w-xl">
                {tagline && (
                  <h4 className="text-neutral-300 font-sans text-sm sm:text-base md:text-lg font-light leading-relaxed">
                    {tagline}
                  </h4>
                )}
                {description && (
                  <p className="text-neutral-400 font-sans text-xs sm:text-sm md:text-base font-light leading-relaxed">
                    {description}
                  </p>
                )}
                {location && (
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-500 font-mono border border-white/5 bg-white/[0.01] px-2.5 py-1 rounded">
                    <MapPin size={11} className="text-zinc-600" />
                    <span>{location.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )}

            {/* User Configured Core Active Focus Tag */}
            {currentFocus && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.01] font-mono text-[11px] sm:text-xs text-neutral-400 backdrop-blur-md">
                <Terminal size={12} className="text-purple-400" />
                <span className="text-neutral-500">ACTIVE_FOCUS:</span>
                <span className="text-zinc-200">{currentFocus}</span>
              </div>
            )}

            {/* Premium Theme-Controlled CTA Action Cluster */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 md:pt-4">
              
              {portfolio?.resume?.fileUrl && (
                <a
                  href={portfolio.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn px-5 py-2.5 sm:py-3 bg-white text-black font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  <FileText size={14} />
                  <span>View Resume</span>
                  <Eye size={14} className="transform group-hover/btn:scale-105 transition-transform" />
                </a>
              )}

              <a
                href="#contact"
                className="group/btn px-5 py-2.5 sm:py-3 bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.02] text-neutral-300 hover:text-white font-mono text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>Contact Me</span>
                <Compass
                  size={14}
                  className="text-neutral-500 group-hover/btn:text-purple-400 transform group-hover/btn:translate-y-0.5 transition-all"
                />
              </a>

            </div>
          </div>

          {/* ========================================== */}
          {/* 2. LAPTOP / DESKTOP VIEW: 3D RECTANGLE DECK CHASSIS */}
          {/* ========================================== */}
          <div className="hidden lg:flex justify-center lg:col-span-5 relative select-none">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="group relative w-full max-w-[340px] aspect-[3/4] [perspective:1200px] cursor-crosshair"
            >
              <div 
                className="relative w-full h-full bg-neutral-950 border border-white/10 rounded-3xl p-5 shadow-2xl transition-transform duration-200 ease-out flex flex-col justify-between overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? "12px" : "0px"})`,
                  borderColor: isHovered ? "rgba(147, 51, 234, 0.3)" : "rgba(255, 255, 255, 0.05)"
                }}
              >
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-500" />
                
                <span className="absolute top-4 left-4 w-4 h-[1px] bg-white/5 group-hover:bg-purple-400/20 transition-colors" />
                <span className="absolute top-4 left-4 w-[1px] h-4 bg-white/5 group-hover:bg-purple-400/20 transition-colors" />
                <span className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/5 group-hover:bg-purple-400/20 transition-colors" />
                <span className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/5 group-hover:bg-purple-400/20 transition-colors" />

                <div 
                  className="flex items-center justify-between font-mono text-[9px] text-neutral-500 tracking-wider"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Cpu size={11} className={isHovered ? "text-purple-400 animate-pulse" : "text-zinc-600"} />
                    <span>SYS_MATRIX_RENDER_OK</span>
                  </div>
                  <span className="text-neutral-600 flex items-center gap-1">
                    <Workflow size={9} /> COMPILE_V26
                  </span>
                </div>

                <div 
                  className="relative flex-1 my-4 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <img
                    src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                    className="w-full h-full object-cover transition-all duration-700 select-none group-hover:scale-[1.02]"
                    alt={name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-70 pointer-events-none" />

                  <div className="absolute bottom-3 left-3 font-mono text-[8px] text-neutral-300 bg-neutral-950/90 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                    <Sparkles size={8} className="text-purple-400 animate-pulse" />
                    <span className="tracking-widest font-bold">IDENTITY_SCAN_ACTIVE</span>
                  </div>
                </div>

                <div 
                  className="flex justify-between font-mono text-[8px] text-neutral-600"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <span className="tracking-tight">RESOLUTION_MATRIX: 1.000X</span>
                  <div className="flex items-center gap-1">
                    <Binary size={9} className="text-neutral-700" />
                    <span>REF_#00249_PRTF</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}