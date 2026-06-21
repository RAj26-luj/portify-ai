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
  Calendar
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
      className="relative w-full py-16 md:py-36 bg-black text-white selection:bg-purple-500/30 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.03),transparent_50%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <Zap className="w-3 h-3 text-purple-400" />
              Ecosystem matrix
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Technical Arsenal.
            </h2>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
        
        {/* Left Side Section: Categories List */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#050508] border border-neutral-900 rounded-2xl md:rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 md:pb-4 border-b border-white/5">
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-200 font-mono font-bold">
                Architecture Layers
              </span>
              <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 text-purple-400">
                <Sliders className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {grouped.map((group: any) => {
                const CatIcon = getFallbackCategoryIcon(group.name);

                return (
                  <div 
                    key={group.id || group.name}
                    onClick={() => setSelectedCategory(group)}
                    className="flex items-center justify-between gap-4 group cursor-pointer border-b border-white/[0.02] pb-3 last:border-0 last:pb-0 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-2 rounded-lg bg-neutral-900 border border-white/5 text-neutral-500 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm md:text-base font-semibold tracking-wide text-neutral-400 group-hover:text-white transition-colors truncate">
                        {group.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-neutral-600 group-hover:text-purple-400 transition-colors shrink-0">
                      <span>[{group.skills?.length || 0} ITEMS]</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Section: Horizontal Marquee Tracks */}
        <div className="lg:col-span-7 w-full space-y-4 md:space-y-5 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

          {/* MOBILE VIEWPORTS: SINGLE UNIFIED COMPACT HORIZONTAL ROLLING TRACK */}
          <div className="block md:hidden w-full overflow-hidden py-1">
            <motion.div 
              className="flex gap-3 whitespace-nowrap w-max px-2"
              animate={{ x: [0, -1500] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
            >
              {getMarqueeItems(skills).map((skill: any, i: number) => {
                const MobileIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                return (
                  <div key={`mob-${i}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 bg-[#050508]/80 backdrop-blur-md shadow-md font-sans text-xs text-neutral-300 shrink-0">
                    {skill.iconUrl ? (
                      <img src={skill.iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                    ) : (
                      <MobileIcon className="w-3 h-3 text-purple-500/50" />
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
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {getMarqueeItems(lane1).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-1-${i}`} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/5 bg-[#050508]/80 backdrop-blur-md shadow-lg font-sans text-sm text-neutral-300">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <LaneFallbackIcon className="w-3.5 h-3.5 text-purple-500/50" />
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
                transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
              >
                {getMarqueeItems(lane2).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 1) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-2-${i}`} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/5 bg-[#050508]/80 backdrop-blur-md shadow-lg font-sans text-sm text-neutral-300">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <LaneFallbackIcon className="w-3.5 h-3.5 text-purple-500/50" />
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
                transition={{ repeat: Infinity, ease: "linear", duration: 28 }}
              >
                {getMarqueeItems(lane3).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 2) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-3-${i}`} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/5 bg-[#050508]/80 backdrop-blur-md shadow-lg font-sans text-sm text-neutral-300">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <LaneFallbackIcon className="w-3.5 h-3.5 text-purple-500/50" />
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

      {/* CLONE MODAL PREVIEW */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-md bg-[#06060a] border border-neutral-900 rounded-2xl p-5 sm:p-8 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-3 right-3 p-2 rounded-full border border-white/5 bg-neutral-900/40 text-neutral-500 hover:text-white transition-colors active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-200 font-mono font-bold">
                  {selectedCategory.name.toUpperCase()} STACK
                </span>
                <div className="p-2 rounded-xl bg-neutral-900/60 border border-white/5 text-emerald-400">
                  {React.createElement(getFallbackCategoryIcon(selectedCategory.name), { className: "w-4 h-4" })}
                </div>
              </div>

              {/* Sequential Horizontal Skill Level Metric Line Rows */}
              <div className="space-y-5 my-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-none">
                {selectedCategory.skills?.map((skill: any, idx: number) => {
                  const metrics = calculateDynamicSkillMetrics(skill);
                  const CardFallbackIcon = SKILL_FALLBACK_ICONS[idx % SKILL_FALLBACK_ICONS.length];

                  return (
                    <div key={skill.id || idx} className="space-y-2 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-6 h-6 rounded bg-neutral-900/40 border border-white/5 p-1 flex items-center justify-center shrink-0">
                            {skill.iconUrl ? (
                              <img src={skill.iconUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <CardFallbackIcon className="w-3 h-3 text-purple-400/70" />
                            )}
                          </div>
                          <div className="truncate flex flex-col text-left">
                            <h4 className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-200 truncate">
                              {skill.name}
                            </h4>
                            {skill.yearsOfExperience && (
                              <span className="text-[9px] font-mono text-neutral-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-2.5 h-2.5 text-neutral-600" />
                                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'Year' : 'Years'} Track
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                          {metrics.label}
                        </span>
                      </div>

                      {/* Continuous Progress Bar Slider */}
                      <div className="w-full h-[3px] bg-neutral-950 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.percent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.03 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                <span>SYS_VAL_STABLE</span>
                <span>{identityName.toUpperCase()} // SKILL_SYNC</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}