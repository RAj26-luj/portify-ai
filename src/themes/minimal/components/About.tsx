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
      id="about"
      className="relative w-full py-20 md:py-40 bg-white text-[#111827] selection:bg-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
        
        {/* Swiss Structural Section Title */}
        <div className="flex flex-col items-start gap-2 mb-16 md:mb-24 select-none border-b border-gray-100 pb-6">
          <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
            01 / Profile Dossier
          </span>
          <h2 className="text-sm font-mono tracking-tight text-gray-500 lowercase">
            {identityName.toLowerCase()}.info
          </h2>
        </div>

        {/* Editorial Magazine Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* COLUMN 1: EDITORIAL SIDE PANEL */}
          <div className="lg:col-span-4 w-full">
            
            {/* DESKTOP & MOBILE INTEGRATED UNIFIED VIEW: Ultra-Clean Minimal Panel */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setIsHovered(true)}
              className="relative w-full bg-[#FAFAFA] border border-gray-200/80 rounded-none p-6 md:p-8 transition-colors duration-300 text-left"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">Registry Status</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-900 font-bold uppercase tracking-wider">Active</span>
                </div>

                <div className="space-y-2">
                  {heroIntroduction && (
                    <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">
                      {heroIntroduction}
                    </span>
                  )}
                  {currentRole && (
                    <h3 className="text-lg font-black tracking-tight text-[#111827] font-sans uppercase">
                      {currentRole}
                    </h3>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  {currentFocus && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Focus Matrix</span>
                      <p className="text-xs font-sans text-gray-800 font-medium">{currentFocus}</p>
                    </div>
                  )}

                  {availabilityStatus && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Availability</span>
                      <p className="text-xs font-sans text-gray-800 font-medium">{availabilityStatus}</p>
                    </div>
                  )}

                  {location && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Location Index</span>
                      <p className="text-xs font-sans text-gray-800 font-medium uppercase tracking-wide">{location}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[9px] font-mono text-gray-400 tracking-wider">
                  <span>{identityName.toUpperCase()} // STR_01</span>
                  <span>INDEXED</span>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 2: BLACK SWISS TYPOGRAPHY NARRATIVE CANVAS */}
          <div className="lg:col-span-8 space-y-8 text-left">
            {tagline && (
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111827] font-sans leading-tight">
                {tagline}
              </h4>
            )}

            <div className="h-[1px] w-16 bg-[#111113]" />

            {bio && (
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-sans font-normal [text-wrap:balance]">
                {bio}
              </p>
            )}

            {description && (
              <div className="p-6 bg-[#FAFAFA] border-l-2 border-gray-900 rounded-none mt-4">
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans font-normal">
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