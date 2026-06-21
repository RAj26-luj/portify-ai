"use client";

import React from "react";

export default function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-black w-full overflow-hidden select-none">
      
      {/* 1. NAV BAR FRAME */}
      <div className="w-full h-16 border-b border-white/5 bg-black/40 backdrop-blur-md px-4 sm:px-8 lg:px-12 flex items-center justify-between animate-pulse">
        {/* Left Side */}
        <div className="h-4 w-28 bg-neutral-900 rounded" />
        
        {/* Center Menu Links - Laptop Only */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="h-6 w-14 bg-neutral-900 rounded-lg" />
          <div className="h-6 w-16 bg-neutral-900 rounded-lg" />
          <div className="h-6 w-14 bg-neutral-900 rounded-lg" />
          <div className="h-6 w-16 bg-neutral-900 rounded-lg" />
        </div>

        {/* Center Menu Links - Mobile Dock Replicate */}
        <div className="flex md:hidden items-center gap-3 bg-white/[0.01] border border-white/5 px-3 py-1.5 rounded-xl">
          <div className="h-3 w-8 bg-neutral-900 rounded" />
          <div className="h-3 w-10 bg-neutral-900 rounded" />
          <div className="h-3 w-8 bg-neutral-900 rounded" />
        </div>

        {/* Right Side */}
        <div className="h-8 w-16 sm:w-20 bg-neutral-900 rounded-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 md:py-16 space-y-20 md:space-y-28">
        
        {/* 2. PROFILE BIOGRAPHY ROW */}
        <div className="space-y-6 md:space-y-10 animate-pulse">
          <div className="flex items-center gap-3 w-full">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-neutral-900 shrink-0" />
            <div className="h-3 w-32 bg-neutral-900 rounded" />
            <div className="h-[1px] bg-white/5 flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-16 items-start">
            {/* Left Blueprint Card */}
            <div className="lg:col-span-5 w-full h-[220px] md:h-[240px] bg-neutral-950 border border-neutral-900 md:border-white/5 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="h-3 w-16 bg-neutral-900 rounded" />
                <div className="w-3.5 h-3.5 rounded bg-neutral-900" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-neutral-900 rounded" />
                <div className="h-3 w-1/2 bg-neutral-900 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-7 w-full bg-neutral-900/60 rounded-xl" />
                <div className="h-7 w-full bg-neutral-900/60 rounded-xl" />
              </div>
            </div>

            {/* Right Narrative Canvas */}
            <div className="lg:col-span-7 space-y-4 text-left pt-1">
              <div className="h-6 sm:h-8 w-11/12 bg-neutral-900 rounded-lg" />
              <div className="h-6 sm:h-8 w-8/12 bg-neutral-900 rounded-lg" />
              <div className="w-10 h-[1px] bg-purple-500/20 my-3" />
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-neutral-900/80 rounded" />
                <div className="h-3.5 w-full bg-neutral-900/80 rounded" />
                <div className="h-3.5 w-4/5 bg-neutral-900/80 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWIN MATRIX TIMELINES */}
        <div className="space-y-6 md:space-y-10 animate-pulse">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-3">
            <div className="h-4 w-24 bg-neutral-900 rounded-full" />
            <div className="h-8 w-56 bg-neutral-900 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center">
            {/* Left Panel Array */}
            <div className="lg:col-span-5 bg-[#050508] border border-neutral-900 rounded-2xl md:rounded-3xl p-5 space-y-4">
              <div className="h-3.5 w-1/4 bg-neutral-900 rounded mb-3" />
              <div className="space-y-3.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2 border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-neutral-900" />
                        <div className="h-3.5 w-20 bg-neutral-900 rounded" />
                      </div>
                      <div className="h-3 w-10 bg-neutral-900 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Infinite Lanes Track */}
            <div className="lg:col-span-7 space-y-3 w-full">
              {/* Mobile Viewport: Single Unified Stack Track Replicate */}
              <div className="flex md:hidden gap-2 overflow-hidden w-full">
                <div className="h-8 w-24 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
                <div className="h-8 w-28 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
                <div className="h-8 w-24 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
              </div>

              {/* Desktop Viewports Lanes */}
              <div className="hidden md:flex gap-3 w-full overflow-hidden">
                <div className="h-10 w-28 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
                <div className="h-10 w-36 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
                <div className="h-10 w-32 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
              </div>
              <div className="hidden md:flex gap-3 w-full overflow-hidden opacity-60 pl-6">
                <div className="h-10 w-36 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
                <div className="h-10 w-28 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
                <div className="h-10 w-32 bg-neutral-900/80 border border-white/5 rounded-xl shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. CHRONO AXIS LAYERED LEDGER */}
        <div className="space-y-8 max-w-4xl mx-auto px-1 animate-pulse">
          <div className="h-[1px] bg-white/5 w-full relative">
            <div className="absolute left-4 sm:left-1/2 -top-1.5 w-3 h-3 bg-neutral-900 rounded border border-white/10 sm:-translate-x-1/2" />
          </div>

          {[1, 2].map((item, idx) => (
            <div key={item} className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full pl-8 sm:pl-0">
              {/* Left/Right Card Alternation block mappings */}
              <div className={`w-full sm:w-[45%] ${idx % 2 === 0 ? "sm:order-1" : "sm:order-3"}`}>
                <div className="bg-[#07070b]/90 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-12 bg-neutral-900 rounded" />
                    <div className="h-4 w-40 bg-neutral-900 rounded" />
                    <div className="h-3.5 w-24 bg-neutral-900 rounded" />
                  </div>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <div className="flex gap-3">
                    <div className="h-3 w-16 bg-neutral-900 rounded" />
                    <div className="h-3 w-14 bg-neutral-900 rounded" />
                  </div>
                </div>
              </div>

              {/* Vertical Timeline Axis Marker Overlays */}
              <div className="absolute left-0 sm:left-1/2 top-4 sm:top-5 sm:-translate-x-1/2 w-2 h-2 rounded-full bg-neutral-950 border border-neutral-700 z-10" />

              <div className={`hidden sm:block w-[45%] ${idx % 2 === 0 ? "order-3" : "order-1"}`} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}