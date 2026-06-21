"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Layers, 
  Terminal, 
  Globe, 
  Database, 
  Sparkles,
  Zap,
  X,
  Sliders,
  Calendar,
  Radio,
  Activity
} from "lucide-react";

const getFallbackCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("front") || normalized.includes("web") || normalized.includes("ui")) return Globe;
  if (normalized.includes("back") || normalized.includes("api") || normalized.includes("server")) return Terminal;
  if (normalized.includes("data") || normalized.includes("db") || normalized.includes("sql")) return Database;
  if (normalized.includes("cloud") || normalized.includes("devops")) return Layers;
  if (normalized.includes("ai") || normalized.includes("ml") || normalized.includes("intel")) return Sparkles;
  return Cpu;
};

const SKILL_FALLBACK_ICONS = [Cpu, Terminal, Database];

const PROFICIENCY_MAP: Record<string, { basePercent: number }> = {
  BEGINNER: { basePercent: 65 },
  INTERMEDIATE: { basePercent: 78 },
  ADVANCED: { basePercent: 88 },
  EXPERT: { basePercent: 96 },
};

interface SkillsProps {
  portfolio: {
    skills?: any[];
    skillCategories?: any[];
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function Skills({ portfolio }: SkillsProps) {
  const skills = portfolio?.skills || [];
  const categories = portfolio?.skillCategories || [];
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";
  
  const grouped = React.useMemo(() => {
    if (categories?.length > 0) {
      return categories.map((cat: any) => ({
        ...cat,
        skills: skills.filter((s: any) => s.categoryId === cat.id),
      })).filter((group: any) => group.skills.length > 0);
    }
    return [{ name: "Core Stack", id: "all-skills", description: "Primary technical competencies", skills }];
  }, [categories, skills]);

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  if (!skills?.length) return null;

  const lane1 = skills.filter((_: any, i: number) => i % 3 === 0);
  const lane2 = skills.filter((_: any, i: number) => i % 3 === 1);
  const lane3 = skills.filter((_: any, i: number) => i % 3 === 2);

  const getMarqueeItems = (laneArray: any[]) => {
    if (!laneArray.length) return [];
    let items = [...laneArray];
    while (items.length < 15) {
      items = [...items, ...laneArray];
    }
    return items;
  };

  const calculateDynamicSkillMetrics = (skill: any) => {
    const config = PROFICIENCY_MAP[skill.proficiency] || PROFICIENCY_MAP.INTERMEDIATE;
    const years = Number(skill.yearsOfExperience) || 0;
    
    const experienceBonus = Math.min(years * 1.5, 4);
    const totalPercent = Math.min(Math.round(config.basePercent + experienceBonus), 100);
    
    return {
      percent: totalPercent,
      label: `${totalPercent}%`
    };
  };

  return (
    <section 
      id="skills" 
      className="relative w-full py-20 md:py-40 bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30 overflow-hidden"
    >
      <style jsx global>{`
        @keyframes scan-matrix-vertical {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .skills-scanline {
          animation: scan-matrix-vertical 6s linear infinite;
        }
        .cyber-skills-grid {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 3rem 3rem;
        }
      `}</style>

      {/* Cyberpunk Environment Canvas Overlays */}
      <div className="absolute inset-0 cyber-skills-grid pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#7C3AED]/3 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Lab HUD Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <Zap className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" />
              SYSTEM_CAPABILITIES
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
              // TECHNICAL_ARSENAL
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <span>METRIC_UPLINK: SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
        
        {/* Left Side Section: Interactive Network Layers */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#0B1120] border border-neutral-800 rounded-none p-6 md:p-8 relative overflow-hidden shadow-2xl">
            {/* HUD Corner Trims */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00E5FF]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#7C3AED]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/3 rounded-bl-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold">
                // ARCHITECTURE_LAYERS
              </span>
              <div className="p-2 bg-[#050816] border border-neutral-800 text-[#00E5FF]">
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {grouped.map((group: any) => {
                const CatIcon = getFallbackCategoryIcon(group.name);

                return (
                  <div 
                    key={group.id || group.name}
                    onClick={() => setSelectedCategory(group)}
                    className="flex items-center justify-between gap-4 group cursor-none border-b border-neutral-900 pb-3.5 last:border-0 last:pb-0 transition-all"
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <div className="p-2.5 bg-[#050816] border border-neutral-800 text-neutral-500 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/40 transition-colors">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm md:text-base font-bold font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors truncate">
                        {group.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-neutral-600 group-hover:text-[#00FF9D] transition-colors shrink-0">
                      <span>[{group.skills?.length || 0} CONDUITS]</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Section: Cyber Streaming Marquee Ribbons */}
        <div className="lg:col-span-7 w-full space-y-4 md:space-y-6 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050816] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050816] to-transparent z-20 pointer-events-none" />

          {/* MOBILE VIEWPORTS: SINGLE UNIFIED COMPACT HORIZONTAL ROLLING TRACK */}
          <div className="block md:hidden w-full overflow-hidden py-1 border-y border-neutral-900 bg-[#0B1120]/40">
            <motion.div 
              className="flex gap-3 whitespace-nowrap w-max px-2"
              animate={{ x: [0, -1500] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            >
              {getMarqueeItems(skills).map((skill: any, i: number) => {
                const MobileIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                return (
                  <div key={`mob-${i}`} className="inline-flex items-center gap-2 px-3 py-2 bg-[#050816] border border-neutral-800 text-neutral-300 font-mono text-xs uppercase shrink-0">
                    {skill.iconUrl ? (
                      <img src={skill.iconUrl} alt="" className="w-3.5 h-3.5 object-contain mix-blend-luminosity filter brightness-110" />
                    ) : (
                      <MobileIcon className="w-3 h-3 text-[#00E5FF]/40" />
                    )}
                    <span>{skill.name}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* DESKTOP VIEWPORTS: 3-LANE ALTERNATING HORIZONTAL TRACKS */}
          {lane1.length > 0 && (
            <div className="hidden md:flex w-full overflow-hidden py-1">
              <motion.div 
                className="flex gap-4 whitespace-nowrap w-max"
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              >
                {getMarqueeItems(lane1).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-1-${i}`} className="inline-flex items-center gap-3 px-5 py-3 bg-[#0B1120] border border-neutral-800 shadow-xl font-mono text-sm uppercase tracking-wide text-neutral-200 hover:border-[#00E5FF]/40 transition-colors">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain mix-blend-luminosity filter brightness-110" />
                      ) : (
                        <LaneFallbackIcon className="w-4 h-4 text-[#00E5FF]/40" />
                      )}
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {lane2.length > 0 && (
            <div className="hidden md:flex w-full overflow-hidden py-1">
              <motion.div 
                className="flex gap-4 whitespace-nowrap w-max"
                animate={{ x: [-1200, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {getMarqueeItems(lane2).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 1) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-2-${i}`} className="inline-flex items-center gap-3 px-5 py-3 bg-[#0B1120] border border-neutral-800 shadow-xl font-mono text-sm uppercase tracking-wide text-neutral-200 hover:border-[#7C3AED]/40 transition-colors">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain mix-blend-luminosity filter brightness-110" />
                      ) : (
                        <LaneFallbackIcon className="w-4 h-4 text-[#7C3AED]/40" />
                      )}
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {lane3.length > 0 && (
            <div className="hidden md:flex w-full overflow-hidden py-1">
              <motion.div 
                className="flex gap-4 whitespace-nowrap w-max"
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
              >
                {getMarqueeItems(lane3).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 2) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-3-${i}`} className="inline-flex items-center gap-3 px-5 py-3 bg-[#0B1120] border border-neutral-800 shadow-xl font-mono text-sm uppercase tracking-wide text-neutral-200 hover:border-[#00FF9D]/40 transition-colors">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain mix-blend-luminosity filter brightness-110" />
                      ) : (
                        <LaneFallbackIcon className="w-4 h-4 text-[#00FF9D]/40" />
                      )}
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </div>

      </div>

      {/* SYSTEM CELL PARAMETER MODAL */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/95 z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Frame Interface Bar Header */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">LAYER_INSPECTOR // CONDUIT_STREAM</span>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-200 font-mono font-bold">
                    {selectedCategory.name.toUpperCase()} // SYSTEM_STACK
                  </span>
                  <div className="p-2 bg-[#050816] border border-neutral-800 text-[#00FF9D] shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                    {React.createElement(getFallbackCategoryIcon(selectedCategory.name), { className: "w-4 h-4" })}
                  </div>
                </div>

                {/* Sequential Horizontal Skill Level Metric Line Rows */}
                <div className="space-y-5 my-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-none">
                  {selectedCategory.skills?.map((skill: any, idx: number) => {
                    const metrics = calculateDynamicSkillMetrics(skill);
                    const CardFallbackIcon = SKILL_FALLBACK_ICONS[idx % SKILL_FALLBACK_ICONS.length];

                    return (
                      <div key={skill.id || idx} className="space-y-2 relative text-left">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-7 h-7 bg-[#050816] border border-neutral-800 p-1 flex items-center justify-center shrink-0">
                              {skill.iconUrl ? (
                                <img src={skill.iconUrl} alt="" className="w-full h-full object-contain filter brightness-110" />
                              ) : (
                                <CardFallbackIcon className="w-3.5 h-3.5 text-[#00E5FF]/70" />
                              )}
                            </div>
                            <div className="truncate flex flex-col">
                              <h4 className="text-xs sm:text-sm font-bold font-mono tracking-wider text-neutral-200 uppercase truncate">
                                {skill.name}
                              </h4>
                              {skill.yearsOfExperience && (
                                <span className="text-[9px] font-mono text-neutral-500 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                  <Calendar className="w-2.5 h-2.5 text-neutral-600" />
                                  EXP: {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'YEAR' : 'YEARS'}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-xs font-mono font-bold text-[#00FF9D] shrink-0 mt-0.5">
                            {metrics.label}
                          </span>
                        </div>

                        {/* Continuous Progress Bar Slider */}
                        <div className="w-full h-1.5 bg-[#050816] border border-neutral-900 rounded-none overflow-hidden relative">
                          <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-30 pointer-events-none" />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metrics.percent}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.03 }}
                            className="h-full bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FF9D] relative shadow-[0_0_8px_#00E5FF]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Radio size={11} className="text-[#00FF9D] animate-pulse" /> CONDUIT_OK</span>
                  <span>{identityName.toUpperCase()} // SKILL_MATRIX</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}