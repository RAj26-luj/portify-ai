"use client";

import React, { useState, useRef } from "react";
import { 
  Terminal, 
  Cpu, 
  Binary, 
  Sparkles, 
  MapPin,
  FileText,
  Eye,
  GitBranch,
  ShieldCheck,
  RefreshCw
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    const rY = (mouseX / (width / 2)) * 4; 
    const rX = -(mouseY / (height / 2)) * 4; 
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-16 md:pt-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] border-b border-[#30363D] font-mono select-none"
      id="home"
    >
      {/* Terminal Grid Layout Mesh Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d0c_1px,transparent_1px),linear-gradient(to_bottom,#30363d0c_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-8 md:py-0">
        
        {/* Terminal Title Bar Window Wrapper */}
        <div className="w-full bg-[#161B22] border border-[#30363D] rounded-t-xl px-4 py-3 text-xs text-neutral-400 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">whoami</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">kernel_init.sh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#30363D]" />
            <span className="w-3 h-3 rounded-full bg-[#30363D]" />
            <span className="w-3 h-3 rounded-full bg-[#30363D]" />
          </div>
        </div>

        {/* IDE Layout Workspace Chasis Panel Frame */}
        <div className="w-full border-x border-b border-[#30363D] bg-[#0D1117]/60 rounded-b-xl overflow-hidden p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center backdrop-blur-sm shadow-xl">
          
          {/* LEFT COLUMN: SOURCE TERMINAL COMMAND RUNTIME */}
          <div className="space-y-4 md:space-y-5 lg:col-span-7 relative z-10 text-left">
            
            {/* Telemetry Status Line */}
            <div className="flex flex-wrap gap-2 items-center text-[11px]">
              <span className="text-[#F78166]">guest@portify-ai:~$</span>
              <span className="text-[#C9D1D9]">./initialize_profile --verbose</span>
              <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[10px] uppercase font-bold tracking-wider">
                {availabilityStatus ? availabilityStatus.replace(/\s+/g, "_").toUpperCase() : "SYS_ACTIVE"}
              </span>
            </div>

            {/* Main Runtime Header Variable */}
            <div className="space-y-1.5">
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                {"//"} core_identity_node
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-mono leading-tight">
                {name}<span className="text-[#58A6FF]">_</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {role && (
                  <h3 className="text-sm sm:text-lg font-bold text-[#7EE787]">
                    const role = "{role}"
                  </h3>
                )}
                {heroIntroduction && (
                  <span className="text-[11px] text-neutral-400 bg-[#161B22] border border-[#30363D] px-1.5 py-0.5 rounded">
                    meta:{heroIntroduction.toLowerCase().replace(/\s+/g, "-")}
                  </span>
                )}
              </div>
            </div>

            {/* Docstring Abstract Area */}
            {(tagline || description || location) && (
              <div className="space-y-2 p-3 bg-[#161B22]/50 border border-[#30363D] rounded-lg text-xs md:text-sm leading-relaxed text-[#C9D1D9] font-sans">
                <div className="font-mono text-[10px] text-neutral-500 mb-1">/** documentation */</div>
                {tagline && <h4 className="text-white font-medium">{tagline}</h4>}
               
                {location && (
                  <div className="pt-1.5 font-mono text-[11px] text-neutral-500 flex items-center gap-1.5">
                    <MapPin size={12} className="text-neutral-600" />
                    <span>LOC: {location.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )}

            {/* System Struct State Variable Mapping */}
            {currentFocus && (
              <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded flex items-center gap-2 text-xs text-[#C9D1D9]">
                <Cpu size={14} className="text-[#F78166]" />
                <span className="text-neutral-500 font-bold">CURRENT_STACK_FOCUS:</span>
                <span className="text-[#58A6FF] truncate">{currentFocus}</span>
              </div>
            )}

            {/* Action Endpoint Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {portfolio?.resume?.fileUrl && (
                <a
                  href={portfolio.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#21262D] text-white hover:bg-[#30363D] border border-[#30363D] rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={13} className="text-[#58A6FF]" />
                  <span>fetch_resume.pdf</span>
                  <Eye size={12} className="text-neutral-500" />
                </a>
              )}

              <a
                href="#contact"
                className="px-3.5 py-1.5 bg-[#0D1117] text-neutral-400 hover:text-white border border-[#30363D] hover:border-[#58A6FF] rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>./contact_uplink</span>
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: SECURE COMPONENT RENDERING VISUAL CHASSIS */}
          <div className="w-full lg:col-span-5 flex justify-center relative">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[280px] aspect-[4/5] cursor-crosshair [transform-style:preserve-3d]"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              <div className="absolute inset-0 bg-[#161B22] border border-[#30363D] rounded-xl p-3 flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* Meta block tracking header parameters */}
                <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-[#30363D] pb-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#3FB950]" />
                    <span>SIGNED_IMAGE_NODE</span>
                  </div>
                  <RefreshCw size={10} className="animate-spin text-neutral-600" />
                </div>

                {/* Core Binary Embedded Payload Workspace Image */}
                <div className="relative flex-1 my-3 bg-[#0D1117] rounded border border-[#30363D] overflow-hidden flex items-center justify-center">
                  <img
                    src={`${image}?v=${portfolio?.updatedAt || Date.now()}`}
                    className="w-full h-full object-cover select-none filter contrast-125 brightness-90 mix-blend-luminosity"
                    alt={name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-2 left-2 text-[8px] text-[#7EE787] bg-[#0D1117] border border-[#30363D] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles size={8} className="text-[#F78166] animate-pulse" />
                    <span>STABLE_ID_SCAN</span>
                  </div>
                </div>

                {/* Object Parameters Footer Rows */}
                <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                  <span>SCALE: 1.000_LTS</span>
                  <div className="flex items-center gap-1">
                    <GitBranch size={10} className="text-[#F78166]" />
                    <span>ref:HEAD</span>
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