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
  GitBranch
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
      className="relative w-full py-12 md:py-24 bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none overflow-hidden"
    >
      {/* Matrix Mesh Grid Overlay Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
      
      {/* IDE Tab Header Control Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Tech Stack</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">dependencies.lock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg text-left">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> package-analyzer --inspect runtime_modules
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side Section: Categories List Configuration Registry */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#30363D]">
              <span className="text-[10px] uppercase font-bold text-neutral-400">
                Technology Clusters
              </span>
              <div className="p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-[#58A6FF]">
                <Sliders className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              {grouped.map((group: any) => {
                const CatIcon = getFallbackCategoryIcon(group.name);

                return (
                  <div 
                    key={group.id || group.name}
                    onClick={() => setSelectedCategory(group)}
                    className="flex items-center justify-between gap-4 group cursor-pointer border border-[#30363D]/40 hover:border-[#58A6FF] bg-[#0D1117]/30 hover:bg-[#1C2128] p-3 rounded transition-all duration-150 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-neutral-500 group-hover:text-[#58A6FF] transition-colors">
                        <CatIcon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-300 group-hover:text-white transition-colors truncate">
                        {group.name.toLowerCase()}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 group-hover:text-[#7EE787] transition-colors shrink-0">
                      <span>[{group.skills?.length || 0} modules]</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Section: Horizontal Marquee Tracks */}
        <div className="lg:col-span-7 w-full space-y-3 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0D1117] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0D1117] to-transparent z-20 pointer-events-none" />

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
                  <div key={`mob-${i}`} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded border border-[#30363D] bg-[#161B22] text-xs text-neutral-300 shrink-0">
                    {skill.iconUrl ? (
                      <img src={skill.iconUrl} alt="" className="w-3.5 h-3.5 object-contain filter brightness-90" />
                    ) : (
                      <MobileIcon className="w-3 h-3 text-neutral-500" />
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
                className="flex gap-3 whitespace-nowrap w-max"
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {getMarqueeItems(lane1).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[i % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-1-${i}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#30363D] bg-[#161B22] text-xs text-neutral-300">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-3.5 h-3.5 object-contain filter brightness-90" />
                      ) : (
                        <LaneFallbackIcon className="w-3 h-3 text-neutral-500" />
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
                className="flex gap-3 whitespace-nowrap w-max"
                animate={{ x: [-1200, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
              >
                {getMarqueeItems(lane2).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 1) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-2-${i}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#30363D] bg-[#161B22] text-xs text-neutral-300">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-3.5 h-3.5 object-contain filter brightness-90" />
                      ) : (
                        <LaneFallbackIcon className="w-3 h-3 text-neutral-500" />
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
                className="flex gap-3 whitespace-nowrap w-max"
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 28 }}
              >
                {getMarqueeItems(lane3).map((skill: any, i: number) => {
                  const LaneFallbackIcon = SKILL_FALLBACK_ICONS[(i + 2) % SKILL_FALLBACK_ICONS.length];
                  return (
                    <div key={`desk-3-${i}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#30363D] bg-[#161B22] text-xs text-neutral-300">
                      {skill.iconUrl ? (
                        <img src={skill.iconUrl} alt="" className="w-3.5 h-3.5 object-contain filter brightness-90" />
                      ) : (
                        <LaneFallbackIcon className="w-3 h-3 text-neutral-500" />
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
            className="fixed inset-0 bg-[#0D1117]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#161B22] border border-[#30363D] rounded-xl overflow-y-auto max-h-[90vh] text-left shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Control Elements Header */}
              <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3 bg-[#1C2128]">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu size={12} className="text-[#F78166]" />
                  <span className="text-neutral-400 font-bold">{selectedCategory.name.toLowerCase().replace(/\s+/g, "-")}_manifest.conf</span>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sequential Horizontal Skill Level Metric Line Rows */}
              <div className="p-4 space-y-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-none">
                {selectedCategory.skills?.map((skill: any, idx: number) => {
                  const metrics = calculateDynamicSkillMetrics(skill);
                  const CardFallbackIcon = SKILL_FALLBACK_ICONS[idx % SKILL_FALLBACK_ICONS.length];

                  return (
                    <div key={skill.id || idx} className="space-y-1.5 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-6 h-6 rounded bg-[#0D1117] border border-[#30363D] p-1 flex items-center justify-center shrink-0">
                            {skill.iconUrl ? {
                              _jsx: <img src={skill.iconUrl} alt="" className="w-full h-full object-contain filter brightness-90" />
                            }._jsx : (
                              <CardFallbackIcon className="w-3 h-3 text-neutral-500" />
                            )}
                          </div>
                          <div className="truncate flex flex-col text-left">
                            <h4 className="text-xs font-bold text-white tracking-tight truncate">
                              {skill.name}
                            </h4>
                            {skill.yearsOfExperience && (
                              <span className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5 font-mono">
                                <Calendar className="w-3 h-3 text-neutral-600" />
                                track_exp: {skill.yearsOfExperience} yrs
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#7EE787] shrink-0 mt-0.5">
                          {metrics.label}
                        </span>
                      </div>

                      {/* Continuous Progress Bar Slider */}
                      <div className="w-full h-1 bg-[#0D1117] rounded overflow-hidden relative border border-[#30363D]/40">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.percent}%` }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.02 }}
                          className="h-full rounded bg-[#58A6FF]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[#30363D] bg-[#1C2128] flex items-center justify-between text-[10px] text-neutral-500">
                <span>MODULE_STATUS: OK</span>
                <span className="flex items-center gap-1"><GitBranch size={10} className="text-[#F78166]" /> {identityName.toUpperCase()} // LOCAL_SYNC</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}