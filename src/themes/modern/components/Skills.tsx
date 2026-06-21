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
      className="relative w-full py-20 md:py-40 bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 overflow-hidden"
    >
      {/* Background Micro-Grid & Ambient Lighting Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/5 to-[#06B6D4]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <Zap className="w-3.5 h-3.5 text-[#6366F1]" />
              Ecosystem matrix
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Technical Arsenal<span className="text-[#8B5CF6]">.</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Side Section: Premium SaaS Stack Directory Panel */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#111113]/70 backdrop-blur-xl border border-[#18181B] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.02)] group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#6366F1]/5 to-transparent rounded-bl-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#18181B]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A] font-mono">
                Architecture Layers
              </span>
              <div className="p-2 rounded-xl bg-[#18181B]/60 border border-[#18181B] text-[#6366F1] shadow-inner">
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              {grouped.map((group: any) => {
                const CatIcon = getFallbackCategoryIcon(group.name);

                return (
                  <div 
                    key={group.id || group.name}
                    onClick={() => setSelectedCategory(group)}
                    className="flex items-center justify-between gap-4 group/item cursor-pointer border border-[#18181B]/40 bg-[#18181B]/20 hover:bg-[#18181B]/60 hover:border-[#6366F1]/30 p-3.5 rounded-xl transition-all duration-300 active:scale-[0.99] text-left"
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <div className="p-2.5 rounded-lg bg-[#111113] border border-[#18181B] text-[#71717A] group-hover/item:text-[#6366F1] group-hover/item:border-[#6366F1]/20 transition-all shadow-sm">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm md:text-base font-bold tracking-tight text-[#D4D4D8] group-hover/item:text-white transition-colors truncate font-sans">
                        {group.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#71717A] group-hover/item:text-[#06B6D4] transition-colors shrink-0 font-semibold">
                      <span>{group.skills?.length || 0} MODULES</span>
                      <span className="transform group-hover/item:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Section: Premium SaaS Moving Visual Pipeline Tracks */}
        <div className="lg:col-span-7 w-full space-y-5 relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0B] to-transparent z-20 pointer-events-none" />

          {/* MOBILE VIEWPORTS: SINGLE UNIFIED TRACK */}
          <div className="block md:hidden w-full overflow-hidden py-1">
            <motion.div 
              className="flex gap-3 whitespace-nowrap w-max px-2"
              animate={{ x: [0, -1500] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
            >
              {getMarqueeItems(skills).map((skill: any, i: number) => {
                const MobileIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                return (
                  <div key={`mob-${i}`} className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#18181B] bg-[#111113]/90 backdrop-blur-md shadow-lg font-sans text-xs font-medium text-[#D4D4D8] shrink-0">
                    {skill.iconUrl ? (
                      <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                    ) : (
                      <MobileIcon className="w-3.5 h-3.5 text-[#6366F1]/60" />
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
                transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
              >
                {getMarqueeItems(lane1).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-1-${i}`} className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-[#18181B] bg-[#111113]/80 backdrop-blur-xl shadow-md font-sans text-sm font-semibold text-[#D4D4D8] transition-all hover:border-[#6366F1]/30 hover:bg-[#111113]">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <LaneFallbackIcon className="w-4 h-4 text-[#6366F1]/50" />
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
                transition={{ repeat: Infinity, ease: "linear", duration: 38 }}
              >
                {getMarqueeItems(lane2).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 1) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-2-${i}`} className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-[#18181B] bg-[#111113]/80 backdrop-blur-xl shadow-md font-sans text-sm font-semibold text-[#D4D4D8] transition-all hover:border-[#8B5CF6]/30 hover:bg-[#111113]">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <LaneFallbackIcon className="w-4 h-4 text-[#8B5CF6]/50" />
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
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {getMarqueeItems(lane3).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 2) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-3-${i}`} className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-[#18181B] bg-[#111113]/80 backdrop-blur-xl shadow-md font-sans text-sm font-semibold text-[#D4D4D8] transition-all hover:border-[#06B6D4]/30 hover:bg-[#111113]">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <LaneFallbackIcon className="w-4 h-4 text-[#06B6D4]/50" />
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

      {/* MODAL REDESIGN: PREMIUM EXPANDED MODAL OVERLAY */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-lg bg-[#111113] border border-[#18181B] rounded-2xl p-6 sm:p-8 relative shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 p-2 rounded-xl border border-[#18181B] bg-[#0A0A0B] text-[#71717A] hover:text-white transition-colors active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#18181B]">
                <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                  {selectedCategory.name.toUpperCase()} STACK
                </span>
                <div className="p-2 rounded-xl bg-[#18181B] border border-[#18181B] text-[#06B6D4] shadow-sm">
                  {React.createElement(getFallbackCategoryIcon(selectedCategory.name), { className: "w-4 h-4" })}
                </div>
              </div>

              {/* Dynamic Metric Grid Layout Stack */}
              <div className="space-y-4 my-4 max-h-[360px] overflow-y-auto pr-2 scrollbar-none">
                {selectedCategory.skills?.map((skill: any, idx: number) => {
                  const metrics = calculateDynamicSkillMetrics(skill);
                  const CardFallbackIcon = SKILL_FALLBACK_ICONS[idx % SKILL_FALLBACK_ICONS.length];

                  return (
                    <div key={skill.id || idx} className="p-3.5 bg-[#0A0A0B]/60 border border-[#18181B] rounded-xl space-y-3 relative text-left transition-colors hover:bg-[#0A0A0B]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-8 h-8 rounded-lg bg-[#111113] border border-[#18181B] p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                            {skill.iconUrl ? (
                              <img src={skill.iconUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <CardFallbackIcon className="w-4 h-4 text-[#8B5CF6]/70" />
                            )}
                          </div>
                          <div className="truncate flex flex-col">
                            <h4 className="text-sm font-bold tracking-tight text-white font-sans">
                              {skill.name}
                            </h4>
                            {skill.yearsOfExperience && (
                              <span className="text-[10px] font-mono font-medium text-[#71717A] flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-[#71717A]/80" />
                                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'Year' : 'Years'} Track
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-[#06B6D4] shrink-0 mt-0.5 bg-[#06B6D4]/5 border border-[#06B6D4]/10 px-2 py-0.5 rounded-md">
                          {metrics.label}
                        </span>
                      </div>

                      {/* Continuous Progress Bar Slider */}
                      <div className="w-full h-1.5 bg-[#111113] rounded-full overflow-hidden relative border border-[#18181B]/40 shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.percent}%` }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.02 }}
                          className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-[#18181B] flex items-center justify-between text-[11px] font-mono text-[#71717A] tracking-wider font-semibold">
                <span>SYS_VAL_STABLE</span>
                <span>{identityName} // SYNC_OK</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}