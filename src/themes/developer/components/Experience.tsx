"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Layers, 
  X, 
  ExternalLink,
  Terminal,
  Cpu,
  GitBranch
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

export default function Experience({ experiences = [], portfolio }: ExperienceProps) {
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
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Git Timeline Grid Mesh Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* IDE Terminal Control Top Bar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Commit History</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">professional_experience.json</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> git log --branch-graph --oneline --decorate
          </p>
        </div>
      </div>

      {/* Interactive Commit History Graph Layout Container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Unified Git Tree Structural Column Stem */}
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[2px] bg-[#30363D] -translate-x-1/2 hidden sm:block" />
        <div className="absolute left-8 top-2 bottom-2 w-[2px] bg-[#30363D] block sm:hidden" />

        <div className="space-y-6 sm:space-y-12">
          {sortedExperiences.map((item: any, idx: number) => {
            const isEven = idx % 2 === 0;
            const logo = item.companyLogo;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isEven ? -25 : 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full group cursor-pointer"
              >
                {/* Repository Card Element Block */}
                <div className="w-full sm:w-[46%] order-2 sm:text-right flex flex-col">
                  
                  <div className="w-full bg-[#161B22] border border-[#30363D] group-hover:border-[#58A6FF] p-4 rounded-lg transition-all duration-200 relative pl-14 sm:pl-4 space-y-2.5 shadow-sm hover:bg-[#1C2128]">
                    
                    {/* Compact Micro-indicator Tag */}
                    <div className="text-[9px] text-neutral-500 font-bold tracking-wider uppercase block sm:hidden">
                      NODE_ENTRY_0{idx + 1}
                    </div>

                    {/* Mobile Absolute Layout Brand Override Frame */}
                    <div className="absolute left-3 top-4 w-8 h-8 rounded bg-[#0D1117] border border-[#30363D] overflow-hidden flex items-center justify-center sm:hidden shrink-0">
                      {logo ? (
                        <img src={logo} alt="" className="w-full h-full object-cover filter brightness-90 contrast-110" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                      )}
                    </div>

                    <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 ${isEven ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                      <div className="flex flex-col truncate text-left sm:text-inherit">
                        <h3 className="text-sm font-bold text-white tracking-tight truncate">
                          {item.position}
                        </h3>
                        <p className="text-xs text-[#58A6FF] font-sans mt-0.5 truncate">
                          {item.company}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold text-[#7EE787] bg-[#7EE787]/5 border border-[#7EE787]/10 px-1.5 py-0.5 rounded shrink-0 self-start sm:self-auto font-mono">
                        {getYear(item.startDate)} — {item.currentlyWorking ? "RUNNING" : getYear(item.endDate)}
                      </span>
                    </div>

                    {/* Upfront Key Commit Attributes Fields */}
                    {(item.employmentType || item.location) && (
                      <div className={`flex flex-wrap gap-1.5 pt-2 border-t border-[#30363D] text-[10px] font-mono ${isEven ? "sm:justify-end" : "sm:justify-start"}`}>
                        {item.employmentType && (
                          <span className="text-neutral-400 flex items-center gap-1 bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded">
                            <Layers className="w-3 h-3 text-neutral-500" />
                            {item.employmentType}
                          </span>
                        )}
                        {item.location && (
                          <span className="text-neutral-400 bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Central Cryptographic Pipeline Node Axis Dot */}
                <div className="absolute left-4 sm:left-1/2 top-6 sm:top-6 w-3 h-3 rounded-full bg-[#0D1117] border-2 border-[#58A6FF] shadow-[0_0_6px_#58A6FF] z-20 -translate-x-1/2 scale-100 sm:group-hover:scale-125 transition-transform duration-150" />

                {/* Alternating Layout Empty Spacer Side Column (Desktop Only) */}
                <div className={`hidden sm:block w-[46%] ${isEven ? "order-3" : "order-1"}`} />

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* COMPREHENSIVE POPUP DETAILS PANEL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D1117]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#161B22] border border-[#30363D] rounded-xl overflow-y-auto max-h-[90vh] text-left shadow-2xl relative scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Inspector Control Bar Buttons */}
              <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3 bg-[#1C2128]">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu size={12} className="text-[#F78166]" />
                  <span className="text-neutral-400 font-bold">commit_inspector.sh</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cover Layout Banner Frame */}
              <div className="relative h-36 bg-[#0D1117] overflow-hidden border-b border-[#30363D]">
                <img 
                  src={selectedItem.companyBanner || DEFAULT_CORP_BANNER} 
                  alt="" 
                  className="w-full h-full object-cover filter brightness-[0.2] blur-xs opacity-50 mix-blend-luminosity" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-[#30363D] bg-[#0D1117] overflow-hidden flex items-center justify-center shrink-0 p-1 bg-neutral-950">
                    {selectedItem.companyLogo ? (
                      <img 
                        src={selectedItem.companyLogo} 
                        alt={selectedItem.company} 
                        className="w-full h-full object-contain filter brightness-90 opacity-90" 
                      />
                    ) : (
                      <Briefcase className="w-4 h-4 text-[#58A6FF]" />
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                      VERIFIED_COMMIT_NODE
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight truncate">
                      {selectedItem.position}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate font-sans">
                      {selectedItem.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Structural Metric Parameters Frame Matrix */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Active Tenure</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {getYear(selectedItem.startDate)} — {selectedItem.currentlyWorking ? "RUNNING" : getYear(selectedItem.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Branch Classification</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 truncate font-bold">
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="truncate">{selectedItem.employmentType || "Full-Time Deployment"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Node Geolocation</div>
                    <div className="text-xs text-[#7EE787] mt-0.5 flex items-center gap-1.5 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{selectedItem.location || "Remote Node"}</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Summary Description Block Field */}
                {selectedItem.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <GitBranch size={10} className="text-[#F78166]" /> Operational Summary Focus
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#C9D1D9] font-sans whitespace-pre-line bg-[#0D1117] p-3 rounded border border-[#30363D] max-h-[160px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Substantive Task Lines Deliverables Rows */}
                {selectedItem.responsibilities?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <Terminal size={10} className="text-[#7EE787]" /> Production Deliverables Log
                    </h4>
                    <ul className="space-y-1 text-xs text-[#C9D1D9] font-sans max-h-[180px] overflow-y-auto pr-1 scrollbar-none text-left">
                      {selectedItem.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-[#7EE787] select-none mt-0.5 font-mono">+$</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cryptographic Technology Clusters Mapping Row */}
                {selectedItem.technologies?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <Cpu size={10} className="text-[#58A6FF]" /> Verified Engine Blueprint Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secondary Action Link Rows Panel */}
                <div className="pt-4 border-t border-[#30363D] flex items-center justify-between text-xs">
                  <div>
                    {selectedItem.companyWebsite && (
                      <a 
                        href={selectedItem.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] font-bold text-white transition-colors"
                      >
                        Launch Endpoint <ExternalLink className="w-3.5 h-3.5 text-[#58A6FF]" />
                      </a>
                    )}
                  </div>
                  <span className="text-neutral-500 flex items-center gap-1 font-mono">
                    <GitBranch className="w-3 h-3 text-neutral-600" /> operations_sync
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