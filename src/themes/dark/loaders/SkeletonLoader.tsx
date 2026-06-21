"use client";

import React from "react";

export default function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-[#050816] w-full overflow-hidden select-none">
      <style jsx global>{`
        .cyber-skeleton-grid {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 3rem 3rem;
        }
        .cyber-spine-pulse {
          box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);
        }
      `}</style>

      {/* Cyberpunk Environment Layout Backdrop Grid */}
      <div className="absolute inset-0 cyber-skeleton-grid pointer-events-none" />

      {/* 1. NAV BAR FRAME HUD */}
      <div className="w-full h-20 border-b border-[#00E5FF]/20 bg-[#050816]/70 backdrop-blur-xl px-4 sm:px-8 lg:px-12 flex items-center justify-between animate-pulse">
        {/* Left Side branding key */}
        <div className="h-5 w-36 bg-neutral-900 rounded-none relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00E5FF]/40" />
        </div>
        
        {/* Center Menu Links - Laptop Only Interface Tabs */}
        <div className="hidden md:flex items-center gap-2 p-1.5 bg-[#0B1120] border border-neutral-800 rounded-none">
          <div className="h-7 w-16 bg-neutral-900 rounded-none" />
          <div className="h-7 w-20 bg-neutral-900 rounded-none" />
          <div className="h-7 w-16 bg-neutral-900 rounded-none" />
          <div className="h-7 w-20 bg-neutral-900 rounded-none" />
        </div>

        {/* Center Menu Links - Mobile Dock Station Replicate */}
        <div className="flex md:hidden items-center gap-4 bg-[#0B1120] border-2 border-neutral-800 px-4 py-2 rounded-none">
          <div className="h-3.5 w-10 bg-neutral-900 rounded-none" />
          <div className="h-3.5 w-12 bg-neutral-900 rounded-none" />
          <div className="h-3.5 w-10 bg-neutral-900 rounded-none" />
        </div>

        {/* Right Side console button anchor */}
        <div className="h-9 w-24 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-24 space-y-24 md:space-y-36">
        
        {/* 2. PROFILE BIOGRAPHY ROW / CORE DOSSIER STATUS */}
        <div className="space-y-8 md:space-y-12 animate-pulse">
          <div className="flex items-center gap-3 w-full border-b border-[#00E5FF]/10 pb-4">
            <div className="w-8 h-8 rounded-none bg-[#0B1120] border border-[#00E5FF]/30 shrink-0 flex items-center justify-center font-mono text-[10px] text-[#00E5FF]" />
            <div className="h-4 w-40 bg-neutral-900 rounded-none" />
            <div className="h-[1px] bg-neutral-900 flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
            {/* Left Hologram Blueprint Card */}
            <div className="lg:col-span-5 w-full h-[240px] md:h-[260px] bg-[#0B1120] border border-neutral-800 rounded-none p-6 flex flex-col justify-between relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00E5FF]/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#7C3AED]/40" />
              
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <div className="h-3.5 w-24 bg-neutral-900 rounded-none" />
                <div className="w-4 h-4 rounded-none bg-neutral-900" />
              </div>
              <div className="space-y-2.5">
                <div className="h-5.5 w-4/5 bg-neutral-900 rounded-none" />
                <div className="h-3.5 w-1/2 bg-neutral-900 rounded-none" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-8 w-full bg-[#050816] border border-neutral-900 rounded-none" />
                <div className="h-8 w-full bg-[#050816] border border-neutral-900 rounded-none" />
              </div>
            </div>

            {/* Right Narrative Fluid Canvas */}
            <div className="lg:col-span-7 space-y-5 text-left flex flex-col justify-center">
              <div className="h-7 sm:h-9 w-11/12 bg-neutral-900 rounded-none border-l-2 border-[#7C3AED] pl-3" />
              <div className="h-7 sm:h-9 w-7/12 bg-neutral-900 rounded-none" />
              <div className="w-12 h-[1px] bg-[#00E5FF]/30 my-2" />
              <div className="space-y-3 bg-[#0B1120]/50 border border-neutral-900 p-5 rounded-none">
                <div className="h-4 w-full bg-neutral-900/80 rounded-none" />
                <div className="h-4 w-full bg-neutral-900/80 rounded-none" />
                <div className="h-4 w-5/6 bg-neutral-900/80 rounded-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWIN MATRIX TIMELINES / ARSENAL LOGS */}
        <div className="space-y-8 md:space-y-12 animate-pulse">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4 pb-4 border-b border-[#00E5FF]/10">
            <div className="h-4 w-32 bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] rounded-none px-2" />
            <div className="h-9 w-64 bg-neutral-900 rounded-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Architecture Panel Array */}
            <div className="lg:col-span-5 bg-[#0B1120] border border-neutral-800 rounded-none p-6 space-y-5 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00E5FF]" />
              <div className="h-4 w-1/3 bg-neutral-900 rounded-none mb-2" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2 border-b border-neutral-900 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-none bg-[#050816] border border-neutral-800" />
                        <div className="h-4 w-24 bg-neutral-900 rounded-none" />
                      </div>
                      <div className="h-3.5 w-14 bg-[#050816] border border-neutral-800 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Infinite Streaming Lanes Track */}
            <div className="lg:col-span-7 space-y-4 w-full relative bg-[#0B1120]/30 border-y border-neutral-900/60 py-4 px-2">
              {/* Mobile Viewport Stream Replicate */}
              <div className="flex md:hidden gap-3 overflow-hidden w-full">
                <div className="h-9 w-28 bg-[#050816] border border-neutral-800 rounded-none shrink-0" />
                <div className="h-9 w-32 bg-[#050816] border border-neutral-800 rounded-none shrink-0" />
                <div className="h-9 w-28 bg-[#050816] border border-neutral-800 rounded-none shrink-0" />
              </div>

              {/* Desktop Viewports Multilane Conduit System */}
              <div className="hidden md:flex gap-4 w-full overflow-hidden">
                <div className="h-11 w-32 bg-[#0B1120] border border-neutral-800 rounded-none shrink-0" />
                <div className="h-11 w-40 bg-[#0B1120] border border-neutral-800 rounded-none shrink-0" />
                <div className="h-11 w-36 bg-[#0B1120] border border-neutral-800 rounded-none shrink-0" />
              </div>
              <div className="hidden md:flex gap-4 w-full overflow-hidden opacity-50 pl-8">
                <div className="h-11 w-40 bg-[#0B1120] border border-neutral-800 rounded-none shrink-0" />
                <div className="h-11 w-32 bg-[#0B1120] border border-neutral-800 rounded-none shrink-0" />
                <div className="h-11 w-36 bg-[#0B1120] border border-neutral-800 rounded-none shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. CHRONO AXIS LAYERED LEDGER / MISSION TIMELINE */}
        <div className="space-y-12 max-w-4xl mx-auto px-1 animate-pulse relative">
          {/* Central Glowing Cyber Spine Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#00E5FF]/50 via-[#7C3AED]/30 to-transparent -translate-x-1/2 cyber-spine-pulse" />

          {[1, 2].map((item, idx) => (
            <div key={item} className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full pl-12 sm:pl-0">
              {/* Left/Right Hologram Tile Alternation block mapping alignment */}
              <div className={`w-full sm:w-[45%] ${idx % 2 === 0 ? "sm:order-1" : "sm:order-3"}`}>
                <div className="bg-[#0B1120] border border-neutral-800 group-hover:border-[#00E5FF]/50 rounded-none p-5 space-y-4 relative overflow-hidden shadow-xl">
                  {/* Micro corner accent */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-700" />
                  
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-16 bg-[#050816] border border-neutral-800 rounded-none" />
                    <div className="h-5 w-48 bg-neutral-900 rounded-none" />
                    <div className="h-4 w-32 bg-neutral-900 rounded-none" />
                  </div>
                  <div className="h-[1px] bg-neutral-900 w-full" />
                  <div className="flex gap-2.5">
                    <div className="h-4.5 w-20 bg-[#050816] border border-neutral-800 rounded-none" />
                    <div className="h-4.5 w-16 bg-[#050816] border border-neutral-800 rounded-none" />
                  </div>
                </div>
              </div>

              {/* Central Interlocking Target Axis Overlays */}
              <div className="absolute left-4 sm:left-1/2 top-5 sm:top-6 sm:-translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#050816] border-2 border-[#00E5FF] z-10 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#00FF9D]" />
              </div>

              <div className={`hidden sm:block w-[45%] ${idx % 2 === 0 ? "order-3" : "order-1"}`} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}