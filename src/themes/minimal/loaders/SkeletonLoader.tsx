"use client";

import React from "react";

export default function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-white w-full overflow-hidden select-none text-[#111827]">
      {/* 1. NAV BAR FRAME */}
      <div className="w-full h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 sm:px-8 lg:px-16 flex items-center justify-between animate-pulse">
        {/* Left Side */}
        <div className="h-4 w-28 bg-gray-200 rounded-none" />

        {/* Center Menu Links - Laptop Only */}
        <div className="hidden md:flex items-center gap-6">
          <div className="h-3 w-12 bg-gray-200 rounded-none" />
          <div className="h-3 w-14 bg-gray-200 rounded-none" />
          <div className="h-3 w-12 bg-gray-200 rounded-none" />
          <div className="h-3 w-14 bg-gray-200 rounded-none" />
        </div>

        {/* Center Menu Links - Mobile Dock Replicate */}
        <div className="flex md:hidden items-center gap-4 bg-white border border-gray-200 px-4 py-1.5 rounded-none shadow-sm">
          <div className="h-2.5 w-8 bg-gray-200 rounded-none" />
          <div className="h-2.5 w-10 bg-gray-200 rounded-none" />
          <div className="h-2.5 w-8 bg-gray-200 rounded-none" />
        </div>

        {/* Right Side */}
        <div className="h-8 w-16 sm:w-20 bg-gray-900 rounded-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-24 space-y-24 md:space-y-36">
        {/* 2. PROFILE BIOGRAPHY ROW */}
        <div className="space-y-12 animate-pulse">
          <div className="flex flex-col items-start gap-2 border-b border-gray-100 pb-6 w-full">
            <div className="h-3 w-32 bg-gray-200 rounded-none" />
            <div className="h-4 w-40 bg-gray-300 rounded-none mt-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left Blueprint Side Panel */}
            <div className="lg:col-span-4 w-full h-[240px] md:h-[260px] bg-[#FAFAFA] border border-gray-200 rounded-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="h-3 w-20 bg-gray-200 rounded-none" />
                <div className="w-4 h-4 bg-gray-200 rounded-none" />
              </div>
              <div className="space-y-3">
                <div className="h-5 w-4/5 bg-gray-300 rounded-none" />
                <div className="h-3 w-1/2 bg-gray-200 rounded-none" />
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="h-3 w-full bg-gray-200 rounded-none" />
                <div className="h-3 w-2/3 bg-gray-200 rounded-none" />
              </div>
            </div>

            {/* Right Typography Narrative Canvas */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="h-7 sm:h-9 w-11/12 bg-gray-900 rounded-none" />
              <div className="h-7 sm:h-9 w-7/12 bg-gray-900 rounded-none" />
              <div className="w-16 h-[1px] bg-gray-900 my-4" />
              <div className="space-y-3 pt-2">
                <div className="h-3.5 w-full bg-gray-400 rounded-none" />
                <div className="h-3.5 w-full bg-gray-400 rounded-none" />
                <div className="h-3.5 w-4/5 bg-gray-400 rounded-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWIN MATRIX TIMELINES */}
        <div className="space-y-12 animate-pulse">
          <div className="flex flex-col items-start text-left border-b border-gray-100 pb-6 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded-none" />
            <div className="h-6 w-56 bg-gray-900 rounded-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Panel Array */}
            <div className="lg:col-span-5 bg-[#FAFAFA] border border-gray-200 rounded-none p-6 space-y-6">
              <div className="h-3 w-1/3 bg-gray-300 rounded-none border-b border-gray-200 pb-4 w-full" />
              <div className="space-y-4 pt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 border-b border-gray-200/60 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded-none" />
                        <div className="h-3.5 w-24 bg-gray-300 rounded-none" />
                      </div>
                      <div className="h-3 w-12 bg-gray-200 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Infinite Text Lanes Track */}
            <div className="lg:col-span-7 space-y-4 w-full">
              {/* Mobile Viewport: Single Unified Stack Track Replicate */}
              <div className="flex md:hidden gap-4 overflow-hidden w-full">
                <div className="h-4 w-20 bg-gray-300 rounded-none shrink-0" />
                <div className="h-4 w-24 bg-gray-200 rounded-none shrink-0" />
                <div className="h-4 w-16 bg-gray-300 rounded-none shrink-0" />
              </div>

              {/* Desktop Viewports Lanes */}
              <div className="hidden md:flex gap-6 w-full overflow-hidden">
                <div className="h-4 w-24 bg-gray-300 rounded-none shrink-0" />
                <div className="h-4 w-32 bg-gray-200 rounded-none shrink-0" />
                <div className="h-4 w-28 bg-gray-300 rounded-none shrink-0" />
              </div>
              <div className="hidden md:flex gap-6 w-full overflow-hidden opacity-50 pl-8">
                <div className="h-4 w-32 bg-gray-200 rounded-none shrink-0" />
                <div className="h-4 w-20 bg-gray-300 rounded-none shrink-0" />
                <div className="h-4 w-28 bg-gray-200 rounded-none shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. CHRONO AXIS LAYERED LEDGER */}
        <div className="space-y-12 max-w-4xl mx-auto relative animate-pulse text-left">
          {/* Continuous Editorial Streamline Center Line */}
          <div className="absolute left-6 sm:left-40 top-0 bottom-0 w-[1px] bg-gray-200 hidden sm:block" />

          {[1, 2].map((item, idx) => (
            <div
              key={item}
              className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start w-full"
            >
              {/* Left Column: Large Chrono Date Index */}
              <div className="sm:col-span-3 sm:text-right pr-0 sm:pr-8 pt-0.5">
                <div className="h-6 w-16 bg-gray-900 rounded-none sm:ml-auto" />
                <div className="h-3 w-12 bg-gray-200 rounded-none mt-1.5 sm:ml-auto" />
              </div>

              {/* Central Structural Pin Axis Marker Overlay */}
              <div className="absolute left-4 sm:left-40 top-2 w-2 h-2 rounded-full bg-white border-2 border-[#111827] z-10 -translate-x-1/2 hidden sm:block" />

              {/* Right Column: Clean Content Area */}
              <div className="sm:col-span-9 space-y-3 pl-0 sm:pl-4">
                <div className="space-y-2">
                  <div className="h-5 w-2/3 bg-gray-900 rounded-none" />
                  <div className="h-3.5 w-1/3 bg-gray-400 rounded-none" />
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <div className="h-5 w-20 bg-[#FAFAFA] border border-gray-200 rounded-none" />
                  <div className="h-5 w-24 bg-[#FAFAFA] border border-gray-200 rounded-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
