"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Layers, 
  X, 
  Workflow,
  ExternalLink
} from "lucide-react";

const DEFAULT_CORP_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";

interface ExperienceProps {
  experiences?: any[];
  portfolio?: {
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function Experience({ experiences = [] , portfolio}: ExperienceProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  const sortedExperiences = React.useMemo(() => {
    if (!experiences || experiences.length === 0) return [];
    return [...experiences].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [experiences]);

  if (!sortedExperiences.length) return null;

  const getYear = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).getFullYear();
  };

  return (
    <section 
      id="experience" 
      className="relative w-full py-12 md:py-24 bg-white text-[#111827] selection:bg-gray-200"
    >
      {/* Swiss Editorial Linear Layout Container */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Continuous Clean Vertical Split Accent Spine */}
        <div className="absolute left-6 sm:left-40 top-0 bottom-0 w-[1px] bg-gray-200 hidden sm:block" />

        <div className="space-y-12 md:space-y-20">
          {sortedExperiences.map((item: any, idx: number) => {
            const logo = item.companyLogo;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.2) }}
                onClick={() => setSelectedItem(item)}
                className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start group cursor-pointer text-left"
              >
                {/* COLUMN 1: EDITORIAL IMMENSE DATE TEXT */}
                <div className="sm:col-span-3 sm:text-right pr-0 sm:pr-8 pt-0.5">
                  <span className="text-xl md:text-2xl font-black font-sans tracking-tight text-[#111827] block">
                    {getYear(item.startDate)}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-400 block mt-0.5 tracking-wider">
                    — {item.currentlyWorking ? "PRESENT" : getYear(item.endDate)}
                  </span>
                </div>

                {/* Central Structural Interlocking Vector Node Pin */}
                <div className="absolute left-4 sm:left-40 top-2 w-2 h-2 rounded-full bg-white border-2 border-[#111827] z-20 -translate-x-1/2 hidden sm:block group-hover:bg-[#111113] transition-colors duration-200" />

                {/* COLUMN 2: CLEAN CONTENT AREA DESIGN */}
                <div className="sm:col-span-9 space-y-3 pl-0 sm:pl-4">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-extrabold text-[#111827] tracking-tight group-hover:text-gray-600 transition-colors font-sans">
                      {item.position}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold font-sans">
                      {item.company}
                    </p>
                  </div>

                  {/* upfront context tag rows */}
                  {(item.employmentType || item.location) && (
                    <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono font-bold">
                      {item.employmentType && (
                        <span className="text-gray-600 bg-[#FAFAFA] border border-gray-200/60 px-2.5 py-1 rounded-none flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          {item.employmentType}
                        </span>
                      )}
                      {item.location && (
                        <span className="text-gray-500 bg-[#FAFAFA] border border-gray-200/60 px-2.5 py-1 rounded-none flex items-center gap-1.5 uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  )}

                  <span className="text-[11px] font-mono font-bold text-gray-400 tracking-wider inline-block uppercase transition-colors group-hover:text-[#111827]">
                    Read objective context →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* COMPREHENSIVE SWISS TYPOGRAPHY POPUP DIALOG */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-full max-w-xl bg-white border border-gray-200 rounded-none overflow-y-auto max-h-[85vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-none bg-[#FAFAFA] border border-gray-200 text-gray-400 hover:text-[#111827] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Header Context Typography Block */}
                <div className="border-b border-gray-100 pb-5 text-left">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 block mb-2">
                    Verified Employment Record
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111827] font-sans uppercase leading-snug">
                    {selectedItem.position}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 font-semibold font-sans mt-1">
                    {selectedItem.company}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAFAFA] border border-gray-200 font-sans">
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Tenure</div>
                    <div className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {getYear(selectedItem.startDate)} — {selectedItem.currentlyWorking ? "Present" : getYear(selectedItem.endDate)}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Type</div>
                    <div className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1.5 truncate">
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{selectedItem.employmentType || "Full-Time"}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Location</div>
                    <div className="text-xs font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedItem.location || "Remote"}</span>
                    </div>
                  </div>
                </div>

                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Operational Focus</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal font-sans bg-[#FAFAFA] p-4 border border-gray-200/60 max-h-[160px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.responsibilities?.length > 0 && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">System Deliverables</h4>
                    <ul className="space-y-2.5 text-xs sm:text-sm font-normal text-gray-600 max-h-[200px] overflow-y-auto pr-2 scrollbar-none font-sans">
                      {selectedItem.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.technologies?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Engine Blueprint</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-none bg-[#FAFAFA] border border-gray-200 text-xs font-medium text-gray-700 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
                  <div>
                    {selectedItem.companyWebsite && (
                      <a 
                        href={selectedItem.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#111827] transition-all font-sans font-bold"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <span>Corporate Gateway</span>
                      </a>
                    )}
                  </div>
                  <span className="opacity-40 flex items-center gap-1 font-semibold text-[10px]">
                    <Workflow className="w-3.5 h-3.5" /> {identityName.toUpperCase()} // SWISS_EXP_SYNC_OK
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}