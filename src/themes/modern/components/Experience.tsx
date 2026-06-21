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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30"
    >
      {/* Premium SaaS Micro-Grid & Gradient Mesh Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/5 to-[#06B6D4]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase mb-4 backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <Briefcase className="w-3.5 h-3.5 text-[#6366F1]" />
              Employment History
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
              Career Journey<span className="text-[#06B6D4]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Redesigned Streamlined SaaS Timeline Flow Grid */}
      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-16 z-10">
        
        {/* Central Clean Timeline Split Spine */}
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#18181B] via-[#71717A]/20 to-transparent -translate-x-1/2 hidden sm:block" />
        <div className="absolute left-8 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#18181B] via-[#71717A]/20 to-transparent block sm:hidden" />

        <div className="space-y-6 sm:space-y-12">
          {sortedExperiences.map((item: any, idx: number) => {
            const isEven = idx % 2 === 0;
            const logo = item.companyLogo;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full group cursor-pointer"
              >
                {/* Structural Grid Alignment Logic for Modern Asymmetric Flow */}
                <div className="w-full sm:w-[46%] order-2 sm:text-right flex flex-col">
                  
                  {/* Premium Glassmorphic Layout Card */}
                  <div className="w-full bg-[#111113]/70 border border-[#18181B] hover:border-[#6366F1]/30 hover:bg-[#111113] p-5 md:p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.02)] relative overflow-hidden pl-14 sm:pl-6 space-y-4 text-left">
                    
                    <div className="absolute -right-20 -top-20 w-36 h-36 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

                    {/* Left Frame Border Accent Line */}
                    <div className={`absolute top-0 bottom-0 w-[2px] bg-[#18181B] group-hover:bg-gradient-to-b group-hover:from-[#6366F1] group-hover:to-[#8B5CF6] ${isEven ? "sm:right-0 sm:left-auto" : "sm:left-0 sm:right-auto"} hidden sm:block`} />

                    {/* Mobile Logo Embed Absolute Position */}
                    <div className="absolute left-3 top-5 w-8 h-8 rounded-lg border border-[#18181B] bg-[#0A0A0B] overflow-hidden flex items-center justify-center sm:hidden shrink-0 shadow-inner p-1">
                      {logo ? (
                        <img src={logo} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-[#6366F1]" />
                      )}
                    </div>

                    <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-2 ${isEven ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                      <div className="flex flex-col truncate">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate font-sans">
                          {item.position}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#71717A] font-semibold mt-0.5 truncate font-sans">
                          {item.company}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-[#6366F1] bg-[#6366F1]/5 border border-[#6366F1]/10 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto shadow-sm">
                        {getYear(item.startDate)} — {item.currentlyWorking ? "Present" : getYear(item.endDate)}
                      </span>
                    </div>

                    {/* Upfront metadata tags */}
                    {(item.employmentType || item.location) && (
                      <div className={`flex flex-wrap gap-2 pt-3 border-t border-[#18181B] text-[11px] font-mono ${isEven ? "sm:justify-end" : "sm:justify-start"}`}>
                        {item.employmentType && (
                          <span className="text-[#D4D4D8] flex items-center gap-1.5 bg-[#18181B]/50 border border-[#18181B] px-2.5 py-1 rounded-lg font-medium">
                            <Layers className="w-3 h-3 text-[#6366F1]" />
                            {item.employmentType}
                          </span>
                        )}
                        {item.location && (
                          <span className="text-[#71717A] bg-[#0A0A0B] border border-[#18181B] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                            <MapPin className="w-3 h-3 text-[#71717A]" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Central Continuous Line Core Connection Dot */}
                <div className="absolute left-4 sm:left-1/2 top-6 sm:top-8 w-3 h-3 rounded-full bg-[#0A0A0B] border-2 border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.5)] z-20 -translate-x-1/2 scale-100 sm:group-hover:scale-125 transition-transform duration-300" />

                {/* Desktop Empty Spacer Column Track */}
                <div className={`hidden sm:block w-[46%] ${isEven ? "order-3" : "order-1"}`} />

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* POPUP MODAL REDESIGN: PREMIUM DETAILED WORKSPACE MODAL DIALOG */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-2xl bg-[#111113] border border-[#18181B] rounded-2xl overflow-y-auto max-h-[85vh] text-left shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-xl bg-[#0A0A0B] border border-[#18181B] text-[#71717A] hover:text-white transition-colors backdrop-blur-md active:scale-95 shadow-inner"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-48 bg-[#18181B] overflow-hidden border-b border-[#18181B]">
                <img 
                  src={selectedItem.companyBanner || DEFAULT_CORP_BANNER} 
                  alt="" 
                  className="w-full h-full object-cover blur-sm brightness-[0.25] scale-[1.04] select-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/40 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl border border-[#18181B] bg-[#0A0A0B] overflow-hidden flex items-center justify-center shrink-0 shadow-2xl p-2 bg-neutral-950">
                    {selectedItem.companyLogo ? (
                      <img 
                        src={selectedItem.companyLogo} 
                        alt={selectedItem.company} 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <Briefcase className="w-5 h-5 text-[#6366F1]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate text-left">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold font-mono uppercase tracking-wider mb-1 inline-block shadow-sm">
                      Verified Employment Node
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white truncate font-sans">
                      {selectedItem.position}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#71717A] font-semibold truncate font-sans">
                      {selectedItem.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0A0A0B]/60 border border-[#18181B] font-sans shadow-inner">
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Operations Tenure</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6366F1]" />
                      {getYear(selectedItem.startDate)} — {selectedItem.currentlyWorking ? "Present" : getYear(selectedItem.endDate)}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Employment Type</div>
                    <div className="text-sm font-bold text-[#D4D4D8] mt-1 flex items-center gap-2 truncate font-sans">
                      <Layers className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                      <span className="truncate">{selectedItem.employmentType || "Full-Time Track"}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider font-mono">Location Context</div>
                    <div className="text-sm font-bold text-[#06B6D4] mt-1 flex items-center gap-2 font-sans">
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                      <span>{selectedItem.location || "Remote Deployment"}</span>
                    </div>
                  </div>
                </div>

                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Operational Focus</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8] font-normal font-sans bg-[#0A0A0B]/40 p-4 rounded-xl border border-[#18181B] max-h-[160px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.responsibilities?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">System Deliverables</h4>
                    <ul className="space-y-2 text-xs sm:text-sm font-normal text-[#D4D4D8] max-h-[200px] overflow-y-auto pr-2 scrollbar-none font-sans">
                      {selectedItem.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.technologies?.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase font-mono">Engine Blueprint</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-[#0A0A0B] border border-[#18181B] text-xs font-medium text-[#D4D4D8] font-mono shadow-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-5 border-t border-[#18181B] flex items-center justify-between text-xs font-mono text-[#71717A]">
                  <div>
                    {selectedItem.companyWebsite && (
                      <a 
                        href={selectedItem.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#D4D4D8] hover:text-white transition-all font-sans font-semibold active:scale-[0.98]"
                      >
                        <ExternalLink className="w-4 h-4 text-[#6366F1]" />
                        <span>Corporate Gateway</span>
                      </a>
                    )}
                  </div>
                  <span className="opacity-40 flex items-center gap-1 font-mono text-xs font-semibold">
                    <Workflow className="w-3.5 h-3.5 text-[#8B5CF6]" /> {identityName} // EXP_SYNC_OK
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