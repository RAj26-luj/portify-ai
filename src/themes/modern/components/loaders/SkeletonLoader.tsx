"use client";

import React from "react";

export default function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] w-full overflow-hidden select-none">
      
      {/* 1. NAV BAR FRAME */}
      <div className="w-full h-16 border-b border-[#18181B] bg-[#0A0A0B]/70 backdrop-blur-xl px-6 sm:px-8 lg:px-16 flex items-center justify-between animate-pulse shadow-[0_1px_0_0_rgba(255,255,255,0.01)]">
        {/* Left Side */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#111113] border border-[#18181B] rounded-lg w-7 h-7" />
          <div className="h-3.5 w-24 bg-[#18181B] rounded" />
        </div>
        
        {/* Center Menu Links - Laptop Only */}
        <div className="hidden md:flex items-center gap-2 p-1 bg-[#111113]/60 border border-[#18181B] rounded-xl">
          <div className="h-6 w-14 bg-[#18181B] rounded-lg" />
          <div className="h-6 w-16 bg-[#18181B] rounded-lg" />
          <div className="h-6 w-14 bg-[#18181B] rounded-lg" />
          <div className="h-6 w-16 bg-[#18181B] rounded-lg" />
        </div>

        {/* Center Menu Links - Mobile Dock Replicate */}
        <div className="flex md:hidden items-center gap-3 bg-[#111113]/80 border border-[#18181B] px-3 py-1.5 rounded-xl">
          <div className="h-3 w-8 bg-[#18181B] rounded" />
          <div className="h-3 w-10 bg-[#18181B] rounded" />
          <div className="h-3 w-8 bg-[#18181B] rounded" />
        </div>

        {/* Right Side */}
        <div className="h-9 w-20 sm:w-24 bg-gradient-to-r from-[#6366F1]/50 to-[#8B5CF6]/50 rounded-xl border border-white/5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-24 space-y-24 md:space-y-36">
        
        {/* 2. PROFILE BIOGRAPHY ROW */}
        <div className="space-y-8 md:space-y-12 animate-pulse">
          <div className="flex items-center gap-3 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            <div className="h-3.5 w-28 bg-[#18181B] rounded font-mono" />
            <div className="h-[1px] bg-gradient-to-r from-[#18181B] via-[#71717A]/10 to-transparent flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
            {/* Left Blueprint Card */}
            <div className="lg:col-span-5 w-full h-[240px] bg-[#111113]/70 border border-[#18181B] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#6366F1]/30" />
              <div className="flex justify-between items-center border-b border-[#18181B] pb-4">
                <div className="h-3.5 w-20 bg-[#18181B] rounded" />
                <div className="w-4 h-4 rounded bg-[#18181B]" />
              </div>
              <div className="space-y-2.5">
                <div className="h-5 w-2/3 bg-[#18181B] rounded" />
                <div className="h-3.5 w-1/2 bg-[#18181B] rounded" />
              </div>
              <div className="space-y-2.5">
                <div className="h-9 w-full bg-[#18181B]/50 rounded-xl border border-[#18181B]/40" />
                <div className="h-9 w-full bg-[#18181B]/50 rounded-xl border border-[#18181B]/40" />
              </div>
            </div>

            {/* Right Narrative Canvas */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="h-7 sm:h-9 w-11/12 bg-[#18181B] rounded-lg" />
              <div className="h-7 sm:h-9 w-7/12 bg-[#18181B] rounded-lg" />
              <div className="h-[2px] w-12 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full my-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-[#18181B]/70 rounded" />
                <div className="h-4 w-full bg-[#18181B]/70 rounded" />
                <div className="h-4 w-5/6 bg-[#18181B]/70 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWIN MATRIX TIMELINES */}
        <div className="space-y-8 md:space-y-12 animate-pulse">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <div className="h-5 w-28 bg-[#18181B] rounded-full border border-[#18181B]" />
            <div className="h-9 w-64 bg-[#18181B] rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Panel Array */}
            <div className="lg:col-span-5 bg-[#111113]/70 border border-[#18181B] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="h-3.5 w-1/3 bg-[#18181B] rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2 border border-[#18181B]/40 bg-[#18181B]/20 p-3.5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#111113] border border-[#18181B]" />
                        <div className="h-4 w-24 bg-[#18181B] rounded" />
                      </div>
                      <div className="h-3.5 w-12 bg-[#18181B] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Infinite Lanes Track */}
            <div className="lg:col-span-7 space-y-4 w-full">
              {/* Mobile Viewport: Single Unified Stack Track Replicate */}
              <div className="flex md:hidden gap-3 overflow-hidden w-full">
                <div className="h-9 w-28 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
                <div className="h-9 w-32 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
                <div className="h-9 w-28 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
              </div>

              {/* Desktop Viewports Lanes */}
              <div className="hidden md:flex gap-4 w-full overflow-hidden">
                <div className="h-11 w-32 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
                <div className="h-11 w-40 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
                <div className="h-11 w-36 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
              </div>
              <div className="hidden md:flex gap-4 w-full overflow-hidden opacity-50 pl-8">
                <div className="h-11 w-40 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
                <div className="h-11 w-32 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
                <div className="h-11 w-36 bg-[#111113] border border-[#18181B] rounded-xl shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. CHRONO AXIS LAYERED LEDGER */}
        <div className="space-y-10 max-w-4xl mx-auto animate-pulse">
          <div className="h-[1px] bg-gradient-to-r from-[#18181B] via-[#71717A]/20 to-[#18181B] w-full relative">
            <div className="absolute left-4 sm:left-1/2 -top-1.5 w-3 h-3 bg-[#0A0A0B] rounded-full border-2 border-[#6366F1] sm:-translate-x-1/2 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          </div>

          {[1, 2].map((item, idx) => (
            <div key={item} className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full pl-8 sm:pl-0">
              {/* Left/Right Card Alternation block mappings */}
              <div className={`w-full sm:w-[46%] ${idx % 2 === 0 ? "sm:order-1" : "sm:order-3"}`}>
                <div className="bg-[#111113]/70 border border-[#18181B] rounded-2xl p-5 md:p-6 space-y-4 shadow-xl text-left relative">
                  <div className="absolute top-0 left-0 w-6 h-[1px] bg-[#6366F1]/30" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-14 bg-[#18181B] rounded" />
                    <div className="h-4.5 w-44 bg-[#18181B] rounded" />
                    <div className="h-3.5 w-28 bg-[#18181B] rounded" />
                  </div>
                  <div className="h-[1px] bg-[#18181B] w-full" />
                  <div className="flex gap-2.5">
                    <div className="h-4 w-20 bg-[#18181B]/60 rounded-lg" />
                    <div className="h-4 w-16 bg-[#18181B]/60 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Vertical Timeline Axis Marker Overlays */}
              <div className="absolute left-0 sm:left-1/2 top-6 sm:top-8 sm:-translate-x-1/2 w-3 h-3 rounded-full bg-[#0A0A0B] border-2 border-[#6366F1] z-10" />

              <div className={`hidden sm:block w-[46%] ${idx % 2 === 0 ? "order-3" : "order-1"}`} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}