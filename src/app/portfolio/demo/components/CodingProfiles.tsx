"use client";

import { useState } from "react";
import { Code2, Trophy, Swords, BarChart3, Binary, ArrowUpRight, X, Calendar, CheckCircle2, Sliders, Globe, Zap, Target, Terminal } from "lucide-react";

interface ProfileItem {
  title: string;
  subtext: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  // Consolidated Matrix Metrics
  activeSince: string;
  problemsSolved: string;
  contestsAttended: string;
  globalRank: string;
  maxRating: string;
  currentRating: string;
}

export default function CodingProfiles() {
  const [activeProfile, setActiveProfile] = useState<ProfileItem | null>(null);

  const profiles: ProfileItem[] = [
    {
      title: "LeetCode",
      subtext: "Guardian Tier // Active Node",
      colorClass: "text-amber-500 border-amber-500/20 bg-amber-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(245,158,11,0.15)]",
      bgGradient: "from-amber-500/10 via-transparent to-transparent",
      icon: Code2,
      activeSince: "March 2023",
      problemsSolved: "1,242 Problems",
      contestsAttended: "45 Contests",
      globalRank: "Top 4.2% globally",
      maxRating: "2,150",
      currentRating: "2,080",
    },
    {
      title: "Codeforces",
      subtext: "Expert Tier // Active Node",
      colorClass: "text-sky-400 border-sky-500/20 bg-sky-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(56,189,248,0.15)]",
      bgGradient: "from-sky-500/10 via-transparent to-transparent",
      icon: Swords,
      activeSince: "January 2024",
      problemsSolved: "680 Problems",
      contestsAttended: "52 Contests",
      globalRank: "World Rank #8,912",
      maxRating: "1,650",
      currentRating: "1,592",
    },
    {
      title: "CodeChef",
      subtext: "4-Star // Active Node",
      colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(52,211,153,0.15)]",
      bgGradient: "from-emerald-500/10 via-transparent to-transparent",
      icon: Trophy,
      activeSince: "June 2023",
      problemsSolved: "410 Problems",
      contestsAttended: "28 Contests",
      globalRank: "Global Rank #4,102",
      maxRating: "1,850",
      currentRating: "1,745",
    },
    {
      title: "AtCoder",
      subtext: "Regular Contester // Active Node",
      colorClass: "text-rose-400 border-rose-500/20 bg-rose-500/5",
      glowClass: "hover:shadow-[0_25px_50px_rgba(251,113,133,0.15)]",
      bgGradient: "from-rose-500/10 via-transparent to-transparent",
      icon: BarChart3,
      activeSince: "February 2025",
      problemsSolved: "215 Problems",
      contestsAttended: "14 Contests",
      globalRank: "World Rank #11,200",
      maxRating: "1,100",
      currentRating: "1,020",
    },
  ];

  return (
    <section
  className="relative py-24 bg-[#030306] overflow-hidden"
  id="coding-profiles"
>
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Title */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Binary size={12} className="text-indigo-400 animate-spin-[spin_6s_linear_infinite]" />
            Engine Metrics Overview
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Coding Profiles
          </h2>
        </div>

        {/* 3D Dashboard Card Deck */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]">
          {profiles.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                onClick={() => setActiveProfile(item)}
                className={`group relative bg-[#08080d]/90 border border-white/10 rounded-2xl p-5 transition-all duration-500 ease-out [transform-style:preserve-3d] hover:[transform:rotateX(12deg)_rotateY(-6deg)_translateZ(20px)] shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer ${item.glowClass}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Card Top Block */}
                <div className="flex items-center justify-between mb-6 [transform:translateZ(15px)]">
                  <h3 className="font-mono text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <div className={`p-2 border rounded-xl transition-all duration-300 ${item.colorClass}`}>
                    <IconComponent size={14} />
                  </div>
                </div>

                {/* Dual Matrix Stats Frame */}
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/5 [transform:translateZ(35px)]">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Max Rating</span>
                    <span className="text-lg font-black font-mono text-white group-hover:text-cyan-400 transition-colors">
                      {item.maxRating}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Solved</span>
                    <span className="text-lg font-black font-mono text-white group-hover:text-emerald-400 transition-colors">
                      {item.problemsSolved.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Footer Subtext */}
                <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-zinc-500 [transform:translateZ(15px)]">
                  <span className="truncate text-zinc-400 text-[9px]">{item.subtext}</span>
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 text-zinc-400 group-hover:text-white transition-all">
                    <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- DYNAMIC SNAPSHOT POP-UP MODAL --- */}
        {activeProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            
            <div 
              className="relative w-full max-w-md bg-[#08080d] border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200"
              style={{ transform: "perspective(1000px) rotateX(1deg)" }}
            >
              {/* Header */}
              <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-zinc-500" />
                  <span className="font-mono text-xs text-white font-bold tracking-wider uppercase">
                    {activeProfile.title} Telemetry Record
                  </span>
                </div>
                <button 
                  onClick={() => setActiveProfile(null)}
                  className="p-1 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Precise Metrics Grid */}
              <div className="p-5 grid grid-cols-2 gap-3 font-mono text-xs">
                
                {/* Active Since */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl col-span-2 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={13} className="text-zinc-500" />
                    <span>Active Since</span>
                  </div>
                  <span className="text-zinc-200 font-bold text-right">{activeProfile.activeSince}</span>
                </div>

                {/* Questions Solved */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-wider">
                    <CheckCircle2 size={12} />
                    <span>Solved</span>
                  </div>
                  <span className="text-white font-black text-sm">{activeProfile.problemsSolved}</span>
                </div>

                {/* Contests Attended */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-wider">
                    <Sliders size={12} />
                    <span>Contests</span>
                  </div>
                  <span className="text-zinc-200 font-black text-sm">{activeProfile.contestsAttended}</span>
                </div>

                {/* Max Rating */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-wider">
                    <Zap size={12} />
                    <span>Max Rating</span>
                  </div>
                  <span className="text-cyan-400 font-black text-sm">{activeProfile.maxRating}</span>
                </div>

                {/* Current Rating */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-wider">
                    <Target size={12} />
                    <span>Current Rating</span>
                  </div>
                  <span className="text-indigo-400 font-black text-sm">{activeProfile.currentRating}</span>
                </div>

                {/* Global Rank */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl col-span-2 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Globe size={13} className="text-zinc-500" />
                    <span>Global Rank</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{activeProfile.globalRank}</span>
                </div>

              </div>

              {/* Status Footer */}
              <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                <span>SYS_NOD_OK</span>
                <span className="text-emerald-500 animate-pulse">● DATA SECURE</span>
              </div>
            </div>

            {/* Click Background to Close */}
            <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setActiveProfile(null)} />
          </div>
        )}

      </div>
    </section>
  );
}