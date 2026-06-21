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
      className="relative w-full py-16 md:py-24 bg-white text-[#111827] selection:bg-gray-200"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-100 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 tracking-widest uppercase mb-2">
              <Zap className="w-3.5 h-3.5" />
              02 / Ecosystem Matrix
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
              Technical Arsenal.
            </h2>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Side Section: Categories List */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-none p-6 md:p-8 relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-mono font-bold">
                Architecture Layers
              </span>
              <div className="p-2 bg-white border border-gray-200 text-gray-400">
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4">
              {grouped.map((group: any) => {
                const CatIcon = getFallbackCategoryIcon(group.name);

                return (
                  <div 
                    key={group.id || group.name}
                    onClick={() => setSelectedCategory(group)}
                    className="flex items-center justify-between gap-4 group cursor-pointer border-b border-gray-200/60 pb-3 last:border-0 last:pb-0 text-left"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-2 bg-white border border-gray-200 text-gray-400 group-hover:text-[#111827] group-hover:border-gray-900 transition-colors">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm md:text-base font-extrabold tracking-tight text-gray-500 group-hover:text-[#111827] transition-colors truncate font-sans uppercase">
                        {group.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-gray-400 group-hover:text-[#111827] transition-colors shrink-0 font-bold">
                      <span>[{group.skills?.length || 0} ITEMS]</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Section: Text-Only Alternative Horizontal Marquee Tracks */}
        <div className="lg:col-span-7 w-full space-y-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

          {/* MOBILE VIEWPORTS: SINGLE UNIFIED COMPACT HORIZONTAL ROLLING TRACK */}
          <div className="block md:hidden w-full overflow-hidden py-1">
            <motion.div 
              className="flex gap-4 whitespace-nowrap w-max px-2"
              animate={{ x: [0, -1500] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
            >
              {getMarqueeItems(skills).map((skill: any, i: number) => {
                return (
                  <div key={`mob-${i}`} className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-gray-700 tracking-tight uppercase shrink-0">
                    <span className="text-gray-300">/</span>
                    <span>{skill.name}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* DESKTOP VIEWPORTS: 3-LANE ALTERNATING HORIZONTAL TEXT STRIPS */}
          {lane1.length > 0 && (
            <div className="hidden md:flex w-full overflow-hidden py-1">
              <motion.div 
                className="flex gap-6 whitespace-nowrap w-max"
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {getMarqueeItems(lane1).map((skill: any, i: number) => {
                  return (
                    <div key={`desk-1-${i}`} className="inline-flex items-center gap-2 font-mono text-sm font-bold text-[#111827] uppercase tracking-wider">
                      <span className="text-gray-300">/</span>
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
                className="flex gap-6 whitespace-nowrap w-max"
                animate={{ x: [-1200, 0] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
              >
                {getMarqueeItems(lane2).map((skill: any, i: number) => {
                  return (
                    <div key={`desk-2-${i}`} className="inline-flex items-center gap-2 font-mono text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <span className="text-gray-300">/</span>
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
                className="flex gap-6 whitespace-nowrap w-max"
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 28 }}
              >
                {getMarqueeItems(lane3).map((skill: any, i: number) => {
                  return (
                    <div key={`desk-3-${i}`} className="inline-flex items-center gap-2 font-mono text-sm font-bold text-gray-400 uppercase tracking-wider">
                      <span className="text-gray-300">/</span>
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </div>

      </div>

      {/* SWISS TYPOGRAPHY MODAL PREVIEW */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-full max-w-md bg-white border border-gray-200 rounded-none p-6 sm:p-8 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 text-left">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#111827] font-mono font-bold">
                  {selectedCategory.name.toUpperCase()} STACK
                </span>
                <div className="p-2 bg-[#FAFAFA] border border-gray-200 text-gray-400">
                  {React.createElement(getFallbackCategoryIcon(selectedCategory.name), { className: "w-4 h-4" })}
                </div>
              </div>

              {/* Text-Only Modular Progression Stack */}
              <div className="space-y-5 my-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-none">
                {selectedCategory.skills?.map((skill: any, idx: number) => {
                  const metrics = calculateDynamicSkillMetrics(skill);

                  return (
                    <div key={skill.id || idx} className="space-y-1.5 text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div className="truncate flex flex-col">
                          <h4 className="text-sm font-extrabold tracking-tight text-[#111827] font-sans uppercase">
                            {skill.name}
                          </h4>
                          {skill.yearsOfExperience && (
                            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 mt-0.5 font-bold uppercase tracking-wide">
                              <Calendar className="w-3 h-3 text-gray-300" />
                              {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'Year' : 'Years'} Track
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-mono font-bold text-[#111827] shrink-0">
                          {metrics.label}
                        </span>
                      </div>

                      {/* Pure Architectural Structural Progress Line */}
                      <div className="w-full h-1 bg-gray-100 relative rounded-none overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.percent}%` }}
                          transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.02 }}
                          className="h-full bg-[#111827]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                <span>INDEXED_STABLE</span>
                <span>{identityName.toUpperCase()} // SWISS_SYNC</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}