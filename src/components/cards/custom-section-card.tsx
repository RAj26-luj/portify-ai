"use client";

import React from "react";
import { FolderHeart, ChevronRight, Layers } from "lucide-react";

interface Props {
  title: string;
}

export default function CustomSectionCard({ title }: Props) {
  return (
    <div className="group/custom-card relative flex items-center justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.7)] max-w-sm w-full mx-auto cursor-pointer">
      
      {/* Visual Identity Grid Cluster */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-all duration-300 group-hover/custom-card:border-blue-500/30 group-hover/custom-card:bg-zinc-900 group-hover/custom-card:text-blue-400 shadow-inner">
          <Layers size={16} className="transition-transform duration-300 group-hover/custom-card:scale-110" />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="text-[10px] font-medium font-mono text-zinc-600 uppercase tracking-wider">
            Custom Module
          </div>
          <h3 className="font-semibold text-zinc-200 text-sm tracking-tight truncate transition-colors group-hover/custom-card:text-white">
            {title}
          </h3>
        </div>
      </div>

      {/* Trailing Context Chevron Indicator */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-transparent text-zinc-600 transition-all duration-300 group-hover/custom-card:border-zinc-800 group-hover/custom-card:bg-zinc-950 group-hover/custom-card:text-zinc-400">
        <ChevronRight size={14} className="transition-transform duration-300 group-hover/custom-card:translate-x-[1px]" />
      </div>

      {/* Decorative Subtle Ambient Border Accent Glow */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent transition-all duration-500 group-hover/custom-card:via-blue-500/20" />

    </div>
  );
}