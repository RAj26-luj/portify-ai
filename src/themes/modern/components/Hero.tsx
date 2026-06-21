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
      className="relative min-h-screen flex items-center pt-24 md:pt-36 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
      id="home"
    >
      {/* Premium SaaS Tech Grid and Ambient Mesh Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#6366F1]/10 to-[#8B5CF6]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#06B6D4]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* ========================================== */}
          {/* 1. MOBILE ONLY PROFILE EMBED - REDESIGNED */}
          {/* ========================================== */}
          <div className="block lg:hidden w-full flex justify-center select-none mb-4">
            <div className="relative w-48 h-48 rounded-2xl p-[1px] bg-gradient-to-b from-[#6366F1]/40 to-transparent shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/10 to-[#06B6D4]/10 opacity-30" />
              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#111113] border border-[#18181B] relative">
                <img
                  src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                  className="w-full h-full object-cover select-none"
                  alt={name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 right-3 font-mono text-[9px] text-white bg-[#111113]/80 border border-[#18181B] backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                  <Sparkles size={10} className="text-[#06B6D4] animate-pulse" />
                  <span className="font-semibold text-[#D4D4D8]">LIVE_NODE</span>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT COLUMN: Split Modern SaaS Dashboard Headline & Content Block */}
          <div className="space-y-6 md:space-y-8 lg:col-span-7 relative z-10 text-left">
            
            {/* Inline Dashboard Telemetry Capsule */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#8B5CF6] tracking-wider uppercase backdrop-blur-md select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4]" />
              </span>
              <span className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent font-mono">
                {availabilityStatus ? availabilityStatus.toUpperCase().replace(/\s+/g, "_") : "ENGINE_UPLINK_ACTIVE"}
              </span>
            </div>

            {/* Micro Intercept / Dynamic Branding Elements */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent leading-[0.95]">
                {name}<span className="text-[#6366F1] inline-block">.</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {role && (
                  <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight font-sans">
                    {role}
                  </h3>
                )}
                {heroIntroduction && (
                  <>
                    <span className="text-[#18181B] text-xl hidden sm:inline">|</span>
                    <span className="font-mono text-[10px] text-[#71717A] tracking-widest bg-[#111113] border border-[#18181B] px-2.5 py-1 rounded-md uppercase hidden sm:inline-block font-medium shadow-inner">
                      {heroIntroduction}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Layout Canvas Abstract Cards */}
            {(tagline || description || location) && (
              <div className="space-y-4 max-w-2xl">
                {tagline && (
                  <h4 className="text-[#D4D4D8] font-sans text-base sm:text-lg md:text-xl font-normal leading-relaxed text-justify md:text-left">
                    {tagline}
                  </h4>
                )}
                {description && (
                  <p className="text-[#71717A] font-sans text-xs sm:text-sm md:text-base font-normal leading-relaxed text-justify md:text-left">
                    {description}
                  </p>
                )}
                {location && (
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-[#71717A] font-mono border border-[#18181B] bg-[#111113]/40 px-3 py-1.5 rounded-lg shadow-sm">
                    <MapPin size={12} className="text-[#71717A]" />
                    <span className="tracking-wider font-medium">{location.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Active Control Matrix Badge */}
            {currentFocus && (
              <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl border border-[#18181B] bg-[#111113]/80 font-mono text-xs text-[#D4D4D8] backdrop-blur-md shadow-inner">
                <Terminal size={14} className="text-[#6366F1]" />
                <span className="text-[#71717A] font-semibold tracking-wider text-[10px]">ACTIVE_FOCUS:</span>
                <span className="text-white font-medium">{currentFocus}</span>
              </div>
            )}

            {/* Redesigned Premium Action Dashboard Cluster */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
              
              {portfolio?.resume?.fileUrl && (
                <a
                  href={portfolio.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6366F1] text-white font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.35)] active:scale-[0.98] cursor-pointer border border-white/10"
                >
                  <FileText size={15} />
                  <span>View Resume</span>
                  <Eye size={15} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              )}

              <a
                href="#contact"
                className="group/btn px-6 py-3 bg-[#111113] border border-[#18181B] hover:border-[#71717A]/40 hover:bg-[#18181B]/40 text-[#D4D4D8] hover:text-white font-medium text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm shadow-black"
              >
                <span>Contact Me</span>
                <Compass
                  size={15}
                  className="text-[#71717A] group-hover/btn:text-[#06B6D4] transform group-hover/btn:rotate-45 transition-all duration-300"
                />
              </a>

            </div>
          </div>

          {/* ========================================== */}
          {/* 2. LAPTOP / DESKTOP VIEW: PREMIUM SAAS FLOATING APPLICATION DASHBOARD */}
          {/* ========================================== */}
          <div className="hidden lg:flex justify-center lg:col-span-5 relative select-none">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="group relative w-full max-w-[360px] aspect-[3/4] [perspective:2000px] cursor-crosshair"
            >
              {/* Glassmorphic Application Dashboard Chassis Container */}
              <div 
                className="relative w-full h-full bg-[#111113]/80 backdrop-blur-xl border border-[#18181B] rounded-3xl p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out flex flex-col justify-between overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? "20px" : "0px"})`,
                  boxShadow: isHovered 
                    ? "0 35px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.04), 0 0 50px -10px rgba(99, 102, 241, 0.2)" 
                    : "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.02)",
                  borderColor: isHovered ? "rgba(99, 102, 241, 0.3)" : "#18181B"
                }}
              >
                {/* Premium Gradient Backing Ring */}
                <div className="absolute -right-20 -top-20 w-52 h-52 bg-gradient-to-br from-[#6366F1]/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-[#6366F1]/25 transition-all duration-500" />
                
                {/* Corner Accents */}
                <span className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-[#6366F1]/40 to-transparent" />
                <span className="absolute top-0 left-0 w-[1px] h-8 bg-gradient-to-b from-[#6366F1]/40 to-transparent" />

                {/* Dashboard Control Panel Bar */}
                <div 
                  className="flex items-center justify-between font-mono text-[10px] text-[#71717A] tracking-wider"
                  style={{ transform: "translateZ(15px)" }}
                >
                  <div className="flex items-center gap-2">
                    <Cpu size={13} className={isHovered ? "text-[#06B6D4] animate-pulse" : "text-[#71717A]"} />
                    <span className="font-medium text-[#71717A]">DASHBOARD.ACTIVE</span>
                  </div>
                  <span className="text-[#71717A] flex items-center gap-1 font-medium bg-[#18181B] px-2 py-0.5 rounded border border-[#18181B]">
                    <Workflow size={10} className="text-[#8B5CF6]" /> BUILD_v2.0
                  </span>
                </div>

                {/* Main Dynamic Graphic Container Node */}
                <div 
                  className="relative flex-1 my-5 rounded-2xl overflow-hidden bg-[#18181B] border border-[#18181B] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <img
                    src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                    className="w-full h-full object-cover transition-all duration-700 select-none group-hover:scale-[1.04]"
                    alt={name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* Inside Dashboard Metric Telemetry Tag */}
                  <div className="absolute bottom-4 left-4 font-mono text-[9px] text-white bg-[#111113]/90 border border-[#18181B] backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xl">
                    <Sparkles size={10} className="text-[#6366F1] animate-pulse" />
                    <span className="tracking-widest font-bold bg-gradient-to-r from-white to-[#D4D4D8] bg-clip-text text-transparent">SECURE_PROFILE_OK</span>
                  </div>
                </div>

                {/* Footer Telemetry Metrics info row */}
                <div 
                  className="flex justify-between font-mono text-[9px] text-[#71717A] items-center pt-1 border-t border-[#18181B]"
                  style={{ transform: "translateZ(15px)" }}
                >
                  <span className="tracking-wider">MATRIX_SCALE: 100%</span>
                  <div className="flex items-center gap-1.5">
                    <Binary size={11} className="text-[#6366F1]" />
                    <span className="text-[#D4D4D8]">REF_#00249</span>
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