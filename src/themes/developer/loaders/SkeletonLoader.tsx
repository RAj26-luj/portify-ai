"use client";

import React from "react";

export default function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-[#0D1117] w-full overflow-hidden select-none font-mono text-[#C9D1D9]">
      
      {/* 1. NAV BAR TERMINAL FRAME */}
      <div className="w-full h-14 border-b border-[#30363D] bg-[#0D1117]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between animate-pulse">
        {/* Left Side Identity */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#30363D] rounded-sm" />
          <div className="h-3 w-24 bg-[#30363D] rounded-sm" />
        </div>
        
        {/* Center Menu Links - Desktop Layout */}
        <div className="hidden md:flex items-center gap-0.5 bg-[#161B22] border border-[#30363D] p-1 rounded-md">
          <div className="h-5 w-14 bg-[#30363D] rounded-sm" />
          <div className="h-5 w-20 bg-[#30363D] rounded-sm" />
          <div className="h-5 w-16 bg-[#30363D] rounded-sm" />
          <div className="h-5 w-16 bg-[#30363D] rounded-sm" />
        </div>

        {/* Center Menu Links - Mobile Dock Layout */}
        <div className="flex md:hidden items-center gap-2 bg-[#161B22] border border-[#30363D] px-2 py-1 rounded-md">
          <div className="h-2.5 w-8 bg-[#30363D] rounded-sm" />
          <div className="h-2.5 w-12 bg-[#30363D] rounded-sm" />
          <div className="h-2.5 w-10 bg-[#30363D] rounded-sm" />
        </div>

        {/* Right Side CTA download Button */}
        <div className="h-7 w-20 bg-[#21262D] border border-[#30363D] rounded-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* IDE Window Header Mockup */}
        <div className="w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-[#30363D] rounded-sm" />
            <div className="h-3 w-36 bg-[#30363D] rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#30363D]" />
            <div className="w-2 h-2 rounded-full bg-[#30363D]" />
          </div>
        </div>

        {/* 2. REPOSITORY BIOGRAPHY CONTAINER CHASSIS */}
        <div className="w-full border-x border-b border-[#30363D] bg-[#0D1117]/40 rounded-b-lg p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse mt-[-48px] !mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Source Terminal Text Fields */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="h-3 w-40 bg-[#30363D] rounded-sm" />
              <div className="space-y-2">
                <div className="h-6 sm:h-8 w-3/4 bg-[#30363D] rounded-sm" />
                <div className="h-4 sm:h-5 w-1/2 bg-[#30363D] rounded-sm" />
              </div>
              <div className="p-3 bg-[#161B22]/50 border border-[#30363D] rounded-md space-y-2">
                <div className="h-2.5 w-full bg-[#30363D] rounded-sm" />
                <div className="h-2.5 w-11/12 bg-[#30363D] rounded-sm" />
                <div className="h-2.5 w-4/5 bg-[#30363D] rounded-sm" />
              </div>
              <div className="h-7 w-full bg-[#161B22] border border-[#30363D] rounded-sm" />
            </div>

            {/* Right Interactive Structural Media Card */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="w-full max-w-[260px] aspect-[4/5] bg-[#161B22] border border-[#30363D] rounded-lg p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
                  <div className="h-2.5 w-24 bg-[#30363D] rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-[#30363D] rounded-sm" />
                </div>
                <div className="flex-1 my-3 bg-[#0D1117] border border-[#30363D] rounded-sm" />
                <div className="flex justify-between items-center">
                  <div className="h-2 w-16 bg-[#30363D] rounded-sm" />
                  <div className="h-2 w-12 bg-[#30363D] rounded-sm" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. TWIN DEPENDENCY MATRIX NODES */}
        <div className="space-y-4 animate-pulse">
          <div className="w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 flex items-center justify-between">
            <div className="h-3 w-44 bg-[#30363D] rounded-sm" />
            <div className="w-3.5 h-3.5 bg-[#30363D] rounded-sm" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Module Panel Registry Array */}
            <div className="lg:col-span-5 bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-3">
              <div className="h-2.5 w-1/3 bg-[#30363D] rounded-sm mb-2" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center border border-[#30363D]/40 p-2.5 rounded bg-[#0D1117]/30">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded bg-[#30363D]" />
                      <div className="h-3 w-24 bg-[#30363D] rounded-sm" />
                    </div>
                    <div className="h-2.5 w-12 bg-[#30363D] rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Horizontally Aligned Dependency Lanes */}
            <div className="lg:col-span-7 space-y-2 w-full">
              <div className="flex gap-2 w-full overflow-hidden">
                <div className="h-7 w-20 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
                <div className="h-7 w-32 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
                <div className="h-7 w-24 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
                <div className="h-7 w-28 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
              </div>
              <div className="flex gap-2 w-full overflow-hidden opacity-50 pl-4">
                <div className="h-7 w-28 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
                <div className="h-7 w-20 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
                <div className="h-7 w-36 bg-[#161B22] border border-[#30363D] rounded shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. GIT BRANCH HISTORY LEDGER TIMELINE */}
        <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
          <div className="w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 flex items-center justify-between">
            <div className="h-3 w-40 bg-[#30363D] rounded-sm" />
          </div>

          <div className="relative border-l-2 border-[#30363D] ml-4 sm:ml-0 sm:left-1/2 space-y-6 sm:-translate-x-1/2 pl-6 sm:pl-0 w-full sm:w-[92%]">
            {[1, 2].map((item, idx) => (
              <div key={item} className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full">
                
                {/* Left/Right Tree Node Alternating Mapping Alignment */}
                <div className={`w-full sm:w-[46%] ${idx % 2 === 0 ? "sm:order-1" : "sm:order-3"}`}>
                  <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-2.5">
                    <div className="flex flex-col gap-1 text-left sm:text-inherit">
                      <div className="h-2 w-16 bg-[#30363D] rounded-sm" />
                      <div className="h-3.5 w-48 bg-[#30363D] rounded-sm mt-0.5" />
                      <div className="h-3 w-28 bg-[#30363D] rounded-sm" />
                    </div>
                    <div className="h-[1px] bg-[#30363D] w-full" />
                    <div className="flex gap-2">
                      <div className="h-2.5 w-14 bg-[#0D1117] border border-[#30363D] rounded-sm" />
                      <div className="h-2.5 w-14 bg-[#0D1117] border border-[#30363D] rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* Git Log Center Commit Marker Override */}
                <div className="absolute left-[-29px] sm:left-1/2 top-4 sm:top-5 sm:-translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0D1117] border-2 border-[#58A6FF] z-10" />

                <div className={`hidden sm:block w-[46%] ${idx % 2 === 0 ? "order-3" : "order-1"}`} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}