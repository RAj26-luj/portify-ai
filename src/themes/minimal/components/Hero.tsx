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
    
    const rY = (mouseX / (width / 2)) * 2; 
    const rX = -(mouseY / (height / 2)) * 2; 
    
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
      className="relative min-h-screen flex items-center pt-24 md:pt-40 bg-white text-[#111827] selection:bg-gray-200"
      id="home"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full z-10 py-12 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ========================================== */}
          {/* 1. MOBILE RESPONSIVE VIEW: PROFILE LAYOUT NODE */}
          {/* ========================================== */}
          <div className="block lg:hidden w-full select-none mb-4">
            <div className="relative w-40 h-44 bg-[#FAFAFA] border border-gray-200 p-2 flex items-center justify-center">
              <div className="w-full h-full overflow-hidden bg-white relative border border-gray-100">
                <img
                  src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                  className="w-full h-full object-cover select-none"
                  alt={name}
                />
              </div>
            </div>
          </div>

          {/* LEFT CHASSIS: Extreme Swiss Typography Canvas */}
          <div className="space-y-8 lg:col-span-8 relative z-10 text-left">
            
            {/* Direct Editorial Status Text Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
              {availabilityStatus ? availabilityStatus.toUpperCase().replace(/\s+/g, "_") : "SYSTEM_ONLINE"}
            </div>

            {/* Swiss Massive Structural Header Layout */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tight text-[#111827] uppercase leading-none">
                {name}.
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                {role && (
                  <h3 className="text-lg md:text-xl font-mono font-bold text-gray-500 uppercase tracking-wider">
                    {role}
                  </h3>
                )}
                {heroIntroduction && (
                  <>
                    <span className="text-gray-300 font-mono text-sm hidden sm:inline">/</span>
                    <span className="font-mono text-[10px] font-bold text-gray-400 tracking-widest uppercase hidden sm:inline-block">
                      {heroIntroduction}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Content Abstract Description Narrative */}
            {(tagline || description || location) && (
              <div className="space-y-4 max-w-2xl border-t border-gray-100 pt-6">
                {tagline && (
                  <h4 className="text-[#111827] font-sans text-base sm:text-lg md:text-xl font-extrabold leading-snug uppercase tracking-tight">
                    {tagline}
                  </h4>
                )}
            
                {location && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-mono font-bold tracking-wider uppercase bg-[#FAFAFA] border border-gray-200 px-2.5 py-1">
                    <MapPin size={12} className="text-gray-400" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            )}

            {/* Clean Focus Metadata Block */}
            {currentFocus && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAFAFA] border border-gray-200 font-mono text-xs text-gray-500 font-bold tracking-wide uppercase">
                <Terminal size={12} className="text-gray-400" />
                <span>Focus: {currentFocus}</span>
              </div>
            )}

            {/* Editorial Button Block Cluster */}
            <div className="flex flex-wrap gap-3 pt-4">
              
              {portfolio?.resume?.fileUrl && (
                <a
                  href={portfolio.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn px-5 py-3 bg-[#111827] hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                >
                  <FileText size={13} />
                  <span>View Resume</span>
                  <Eye size={13} />
                </a>
              )}

              <a
                href="#contact"
                className="group/btn px-5 py-3 bg-[#FAFAFA] border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-[#111827] font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
              >
                <span>Contact Portfolio</span>
                <Compass size={13} className="text-gray-400" />
              </a>

            </div>
          </div>

          {/* ========================================== */}
          {/* 2. DESKTOP VIEW: EDITORIAL BLUEPRINT CARD CHASSIS */}
          {/* ========================================== */}
          <div className="hidden lg:flex justify-end lg:col-span-4 relative select-none">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setIsHovered(true)}
              className="relative w-full max-w-[320px] aspect-[3/4] bg-[#FAFAFA] border border-gray-200 p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between font-mono text-[9px] text-gray-400 tracking-wider font-bold">
                <div className="flex items-center gap-1.5">
                  <Cpu size={12} className="text-gray-400" />
                  <span>MATRIX_RENDER_OK</span>
                </div>
                <span className="flex items-center gap-1">
                  <Workflow size={10} /> SYS // #002
                </span>
              </div>

              <div className="relative flex-1 my-4 bg-white border border-gray-100 overflow-hidden">
                <img
                  src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.01]"
                  alt={name}
                />

                <div className="absolute bottom-2 left-2 font-mono text-[9px] font-bold text-gray-400 bg-white px-2 py-0.5 border border-gray-200 tracking-widest uppercase">
                  Scanner Active
                </div>
              </div>

              <div className="flex justify-between font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Scale: 1.00X</span>
                <div className="flex items-center gap-1">
                  <Binary size={10} />
                  <span>REF_PRTF</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}