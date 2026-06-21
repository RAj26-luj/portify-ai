"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Award, 
  X, 
  BookOpen,
  Terminal,
  Cpu,
  GitBranch
} from "lucide-react";

const DEFAULT_CAMPUS_IMAGE = "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop";

interface EducationProps {
  educations?: any[];
  portfolio?: {
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function Education({ educations = [], portfolio }: EducationProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  const sortedEducations = React.useMemo(() => {
    if (!educations || educations.length === 0) return [];
    return [...educations].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [educations]);

  if (!sortedEducations.length) return null;

  const getYear = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).getFullYear();
  };

  return (
    <section 
      id="education" 
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none"
    >
      {/* Git Graph Visual Matrix Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* Terminal View Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Academic Architecture</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">education_history.md</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg">
          <p className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> graph --timeline path/to/academics
          </p>
        </div>
      </div>

      {/* Git Timeline Core Mapping Infrastructure */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Core Architectural Git Tree Spine Line */}
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[2px] bg-[#30363D] -translate-x-1/2 hidden sm:block" />
        <div className="absolute left-8 top-2 bottom-2 w-[2px] bg-[#30363D] block sm:hidden" />

        <div className="space-y-6 sm:space-y-12">
          {sortedEducations.map((item: any, idx: number) => {
            const isEven = idx % 2 === 0;
            const logo = item.logoUrl || item.institutionImage;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full group cursor-pointer"
              >
                {/* Information Card Container Block */}
                <div className={`w-full sm:w-[46%] order-2 ${isEven ? "sm:order-1 sm:text-right" : "sm:order-3 sm:text-left"} flex flex-col`}>
                  
                  <div className="w-full bg-[#161B22] border border-[#30363D] group-hover:border-[#58A6FF] p-4 rounded-lg transition-all duration-200 relative pl-14 sm:pl-4 space-y-2.5 shadow-sm hover:bg-[#1C2128]">
                    
                    {/* Corner Identifier Tag */}
                    <div className="text-[9px] text-neutral-500 font-bold tracking-wider uppercase block sm:hidden">
                      COMMIT_0{idx + 1}
                    </div>

                    {/* Mobile Logo Block Element */}
                    <div className="absolute left-3 top-4 w-8 h-8 rounded bg-[#0D1117] border border-[#30363D] overflow-hidden flex items-center justify-center sm:hidden shrink-0">
                      <img src={logo || DEFAULT_CAMPUS_IMAGE} alt="" className="w-full h-full object-cover filter brightness-90 contrast-110" />
                    </div>

                    <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 ${isEven ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                      <div className="flex flex-col truncate text-left sm:text-inherit">
                        <h3 className="text-sm font-bold text-white tracking-tight truncate">
                          {item.degree}
                        </h3>
                        <p className="text-xs text-[#58A6FF] font-sans mt-0.5 truncate">
                          {item.institution}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold text-[#7EE787] bg-[#7EE787]/5 border border-[#7EE787]/10 px-1.5 py-0.5 rounded shrink-0 self-start sm:self-auto font-mono">
                        {getYear(item.startDate)} — {item.currentlyStudying ? "LTS" : getYear(item.endDate)}
                      </span>
                    </div>

                    {/* Field of Study & Performance Indexes */}
                    {(item.fieldOfStudy || item.cgpa || item.grade) && (
                      <div className={`flex flex-wrap gap-1.5 pt-2 border-t border-[#30363D] text-[10px] font-mono ${isEven ? "sm:justify-end" : "sm:justify-start"}`}>
                        {item.fieldOfStudy && (
                          <span className="text-neutral-400 flex items-center gap-1 bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded">
                            <BookOpen className="w-3 h-3 text-neutral-500" />
                            {item.fieldOfStudy}
                          </span>
                        )}
                        {(item.cgpa || item.grade) && (
                          <span className="text-[#F78166] bg-[#F78166]/5 border border-[#F78166]/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <Award className="w-3 h-3 text-[#F78166]/70" />
                            {item.cgpa ? `CGPA:${item.cgpa}` : `Grade:${item.grade}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Git Log Axis Terminal Ring Node Indicator */}
                <div className="absolute left-4 sm:left-1/2 top-6 sm:top-6 w-3 h-3 rounded-full bg-[#0D1117] border-2 border-[#58A6FF] shadow-[0_0_6px_#58A6FF] z-20 -translate-x-1/2 scale-100 sm:group-hover:scale-125 transition-transform duration-150" />

                {/* Alternating Architectural Spacer Canvas (Desktop Only) */}
                <div className={`hidden sm:block w-[46%] ${isEven ? "order-3" : "order-1"}`} />

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* POPUP MODAL CANVAS */}
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
              {/* Terminal Header Control Elements */}
              <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3 bg-[#1C2128]">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu size={12} className="text-[#F78166]" />
                  <span className="text-neutral-400 font-bold">inspect_credential.sh</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded bg-[#0D1117] border border-[#30363D] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cover Layout Panel Frame */}
              <div className="relative h-36 bg-[#0D1117] overflow-hidden border-b border-[#30363D]">
                <img 
                  src={selectedItem.logoUrl || selectedItem.institutionImage || DEFAULT_CAMPUS_IMAGE} 
                  alt="" 
                  className="w-full h-full object-cover filter brightness-[0.2] blur-xs opacity-50 mix-blend-luminosity" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-[#30363D] bg-[#0D1117] overflow-hidden flex items-center justify-center shrink-0 p-1 bg-neutral-950">
                    <img 
                      src={selectedItem.logoUrl || selectedItem.institutionImage || DEFAULT_CAMPUS_IMAGE} 
                      alt={selectedItem.institution} 
                      className="w-full h-full object-contain filter brightness-90 opacity-90" 
                    />
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 text-[9px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                      ACADEMIC_REGISTRY_NODE
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight truncate">
                      {selectedItem.degree}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate font-sans">
                      {selectedItem.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specification Block Panel Rows */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded bg-[#0D1117] border border-[#30363D]">
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Tenure Frame</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {getYear(selectedItem.startDate)} — {selectedItem.currentlyStudying ? "LTS" : getYear(selectedItem.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Field Matrix</div>
                    <div className="text-xs text-[#C9D1D9] mt-0.5 flex items-center gap-1.5 truncate font-bold" title={selectedItem.fieldOfStudy || "General"}>
                      <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="truncate">{selectedItem.fieldOfStudy || "General Spec"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500 uppercase font-bold">Performance Value</div>
                    <div className="text-xs text-[#7EE787] mt-0.5 flex items-center gap-1.5 font-bold">
                      <Award className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{selectedItem.cgpa ? `CGPA: ${selectedItem.cgpa}` : selectedItem.grade ? `Grade: ${selectedItem.grade}` : "Passed Cluster"}</span>
                    </div>
                  </div>
                </div>

                {selectedItem.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                      <GitBranch size={10} className="text-[#F78166]" /> Syllabus Scope Context
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#C9D1D9] font-sans whitespace-pre-line bg-[#0D1117] p-3 rounded border border-[#30363D] max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.location && (
                  <div className="pt-4 border-t border-[#30363D] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{selectedItem.location.toUpperCase()}</span>
                    </div>
                    <span className="text-neutral-500 flex items-center gap-1 font-mono">
                      <GitBranch className="w-3 h-3 text-neutral-600" /> academic_sync
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}