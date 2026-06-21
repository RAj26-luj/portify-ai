"use client";

import React, { useState, useRef } from "react";
import { 
  Terminal, 
  Cpu, 
  Binary, 
  Sparkles, 
  MapPin,
  Workflow,
  Radio,
  FileText,
  Eye,
  ShieldAlert,
  ShieldCheck
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
    
    const rY = (mouseX / (width / 2)) * 12; 
    const rX = -(mouseY / (height / 2)) * 12; 
    
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
      className="relative min-h-screen flex items-center pt-24 md:pt-36 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30 [perspective:1500px]"
      id="home"
    >
      <style jsx global>{`
        @keyframes scanline-hero {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .hero-scanline {
          animation: scanline-hero 7s linear infinite;
        }
        .cyber-grid-hero {
          background-image: linear-gradient(rgba(0, 229, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.02) 1px, transparent 1px);
          background-size: 3rem 3rem;
        }
        @keyframes text-flicker {
          0% { opacity: 0.98; filter: drop-shadow(0 0 2px rgba(0,229,255,0.2)); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px rgba(0,229,255,0.6)); }
          100% { opacity: 0.98; filter: drop-shadow(0 0 2px rgba(0,229,255,0.2)); }
        }
        .glitch-heading {
          animation: text-flicker 3s infinite;
        }
      `}</style>

      {/* Cyberpunk Environment Layout Background Overlays */}
      <div className="absolute inset-0 cyber-grid-hero pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(0,229,255,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full filter blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full z-10 py-12 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ========================================== */}
          {/* 1. MOBILE DEVICE PORTRAIT: TOP SQUARE HOLOGRAPH */}
          {/* ========================================== */}
          <div className="block lg:hidden w-full flex justify-center select-none mb-6">
            <div className="relative w-48 h-48 border-2 border-[#00E5FF]/40 bg-[#0B1120] p-2 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              
              {/* Tech corner alignment frames */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00FF9D]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#7C3AED]" />
              
              {/* Image Frame */}
              <div className="w-full h-full overflow-hidden bg-[#050816] border border-neutral-800 relative mix-blend-luminosity">
                <img
                  src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                  className="w-full h-full object-cover select-none filter contrast-125 saturate-150"
                  alt={name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-[#00E5FF]/10 pointer-events-none" />
              </div>

              {/* Status indicator active tracking beacon */}
              <div className="absolute -bottom-2 -right-2 font-mono text-[9px] text-[#00FF9D] bg-[#050816] border border-[#00FF9D]/30 px-2 py-0.5 shadow-2xl flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-ping" />
                <span>ONLINE</span>
              </div>
            </div>
          </div>

          {/* LEFT CHASSIS: Core Descriptive Typography Terminal */}
          <div className="space-y-6 md:space-y-8 lg:col-span-7 relative z-10 text-left">
            
            {/* Dynamic Status Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#0B1120] border border-[#00FF9D]/30 text-[10px] md:text-xs font-mono font-bold text-[#00FF9D] tracking-[0.15em] uppercase shadow-[0_0_15px_rgba(0,255,157,0.1)] select-none rounded-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF9D]" />
              </span>
              {availabilityStatus ? availabilityStatus.toUpperCase().replace(/\s+/g, "_") : "SYSTEM_UPLINK_ACTIVE"}
            </div>

            {/* Typography Gradient Header */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tighter text-white uppercase leading-none glitch-heading">
                {name}<span className="text-[#00E5FF] inline-block">_</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {role && (
                  <h3 className="text-xl md:text-2xl font-mono font-bold text-[#00E5FF] uppercase tracking-wide">
                    {role}
                  </h3>
                )}
                {heroIntroduction && (
                  <>
                    <span className="text-neutral-700 font-mono text-sm hidden sm:inline">//</span>
                    <span className="font-mono text-[9px] md:text-[10px] text-neutral-400 tracking-widest bg-[#0B1120] border border-neutral-800 px-2.5 py-1 uppercase hidden sm:inline-block">
                      {heroIntroduction}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Content Abstract Description */}
            {(tagline || description || location) && (
              <div className="space-y-4 max-w-xl font-mono">
                {tagline && (
                  <h4 className="text-neutral-200 text-sm sm:text-base font-bold uppercase tracking-wide border-l-2 border-[#7C3AED] pl-3">
                    {tagline}
                  </h4>
                )}
                {description && (
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans font-light">
                    {description}
                  </p>
                )}
                {location && (
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-neutral-400 border border-neutral-800 bg-[#0B1120] px-3 py-1.5 rounded-none">
                    <MapPin size={12} className="text-[#00E5FF]" />
                    <span className="tracking-widest">{location.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )}

            {/* User Configured Core Active Focus Tag */}
            {currentFocus && (
              <div className="inline-flex items-center gap-2.5 p-3 bg-[#0B1120]/60 border border-neutral-800 font-mono text-[11px] sm:text-xs text-neutral-300 rounded-none w-full max-w-xl">
                <Terminal size={14} className="text-[#00E5FF] shrink-0" />
                <span className="text-neutral-500 uppercase tracking-wider">SYSTEM_CAPABILITIES:</span>
                <span className="text-[#F8FAFC] font-bold truncate">{currentFocus}</span>
              </div>
            )}

            {/* Premium Theme-Controlled CTA Action Cluster */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              {portfolio?.resume?.fileUrl && (
                <a
                  href={portfolio.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn relative px-6 py-3.5 bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050816] font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)] active:scale-[0.98] cursor-pointer"
                >
                  <FileText size={14} />
                  <span>EXTRACT_RESUME</span>
                  <Eye size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              )}

              <a
                href="#contact"
                className="group/btn px-6 py-3.5 bg-[#050816] border border-neutral-800 hover:border-[#7C3AED]/60 text-neutral-400 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>ESTABLISH_CONNECTION</span>
                <Radio
                  size={14}
                  className="text-neutral-500 group-hover/btn:text-[#7C3AED] animate-pulse"
                />
              </a>

            </div>
          </div>

          {/* ========================================== */}
          {/* 2. LAPTOP / DESKTOP VIEW: CYBERPUNK LAB SYSTEM CELLS */}
          {/* ========================================== */}
          <div className="hidden lg:flex justify-center lg:col-span-5 relative select-none">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="group relative w-full max-w-[350px] aspect-[3/4] [perspective:1500px] cursor-none"
            >
              <div 
                className="relative w-full h-full bg-[#0B1120]/90 border border-[#00E5FF]/20 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden backdrop-blur-xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? "20px" : "0px"})`,
                  borderColor: isHovered ? "#00E5FF" : "rgba(0, 229, 255, 0.2)",
                  boxShadow: isHovered ? "0 30px 70px -10px rgba(0,229,255,0.15), inset 0 0 20px rgba(0,229,255,0.05)" : "0 25px 60px -15px rgba(0,0,0,0.7)"
                }}
              >
                {/* Tech Glowing Underlays Inside Card */}
                <div className="absolute -right-20 -top-20 w-52 h-52 bg-[#7C3AED]/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-[#7C3AED]/15 transition-all duration-500" />
                
                {/* HUD Framing Corners */}
                <span className="absolute top-0 left-0 w-4 h-[2px] bg-[#00E5FF]" />
                <span className="absolute top-0 left-0 w-[2px] h-4 bg-[#00E5FF]" />
                <span className="absolute bottom-0 right-0 w-4 h-[2px] bg-[#7C3AED]" />
                <span className="absolute bottom-0 right-0 w-[2px] h-4 bg-[#7C3AED]" />

                <div 
                  className="flex items-center justify-between font-mono text-[9px] text-neutral-400 tracking-wider pb-3 border-b border-neutral-900"
                  style={{ transform: "translateZ(15px)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Cpu size={12} className={isHovered ? "text-[#00FF9D] animate-spin duration-3000" : "text-neutral-600"} />
                    <span className="text-neutral-500">SYS_OPERATOR_LINK: <span className="text-[#00FF9D]">OK</span></span>
                  </div>
                  <span className="text-neutral-500 flex items-center gap-1">
                    <Workflow size={10} className="text-[#7C3AED]" /> MODEL_V4.2.6
                  </span>
                </div>

                <div 
                  className="relative flex-1 my-5 bg-[#050816] border border-neutral-900 group-hover:border-[#00E5FF]/20 overflow-hidden shadow-2xl mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <img
                    src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                    className="w-full h-full object-cover transition-all duration-700 select-none group-hover:scale-105 filter contrast-125 saturate-120"
                    alt={name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#00E5FF]/5 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity" />

                  {/* Laser Scanline Bar */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF]/40 shadow-[0_0_8px_#00E5FF] hero-scanline pointer-events-none opacity-0 group-hover:opacity-100" />

                  <div className="absolute bottom-3 left-3 font-mono text-[8px] text-[#00FF9D] bg-[#050816]/90 border border-[#00FF9D]/30 backdrop-blur-md px-2.5 py-1 flex items-center gap-1.5 shadow-xl">
                    <Sparkles size={10} className="text-[#00FF9D] animate-pulse" />
                    <span className="tracking-widest font-bold">HOLOGRAPH_SCAN_RUNNING</span>
                  </div>
                </div>

                <div 
                  className="flex justify-between font-mono text-[9px] text-neutral-500 pt-3 border-t border-neutral-900"
                  style={{ transform: "translateZ(15px)" }}
                >
                  <span className="tracking-widest text-neutral-600 flex items-center gap-1"><ShieldCheck size={10} className="text-[#00FF9D]"/> INTEGRITY_SECURE</span>
                  <div className="flex items-center gap-1">
                    <Binary size={10} className="text-[#00E5FF]" />
                    <span>NODE_#{name.slice(0,3).toUpperCase()}</span>
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