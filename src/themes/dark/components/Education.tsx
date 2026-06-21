"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Award, 
  X, 
  Workflow,
  BookOpen,
  Radio,
  Cpu,
  Terminal,
  Activity
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
      className="relative w-full py-20 md:py-40 overflow-hidden bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30"
    >
      <style jsx global>{`
        @keyframes cyber-pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; box-shadow: 0 0 0px rgba(0,229,255,0); }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 15px rgba(0,229,255,0.6); }
        }
        .cyber-spine-glow {
          box-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
        }
        .cyber-grid-timeline {
          background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>

      {/* Cyberpunk Lab Environmental Enhancements */}
      <div className="absolute inset-0 cyber-grid-timeline pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,229,255,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-[#7C3AED]/3 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Lab Header HUD */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-12 md:mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#00E5FF]/10 pb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <GraduationCap className="w-3.5 h-3.5 text-[#00FF9D]" />
              TRAINING_QUALIFICATIONS
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              // ACADEMIC_JOURNEY
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#7C3AED] animate-pulse" />
            <span>RECORD_INDEX: STABLE</span>
          </div>
        </div>
      </div>

      {/* Glowing Cyberpunk Vertical Timeline Section */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 z-10">
        
        {/* Glowing Cyber Spine Line */}
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#00E5FF]/50 via-[#7C3AED]/40 to-transparent -translate-x-1/2 hidden sm:block cyber-spine-glow" />
        <div className="absolute left-8 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#00E5FF]/50 via-[#7C3AED]/40 to-transparent block sm:hidden cyber-spine-glow" />

        <div className="space-y-12 sm:space-y-24">
          {sortedEducations.map((item: any, idx: number) => {
            const isEven = idx % 2 === 0;
            const logo = item.logoUrl || item.institutionImage;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full group cursor-pointer"
              >
                {/* Content Box Column Realignment Layout */}
                <div className={`w-full sm:w-[45%] order-2 ${isEven ? "sm:order-1 sm:text-right" : "sm:order-3 sm:text-left"} flex flex-col`}>
                  
                  {/* Cyber Hologram Tile Design */}
                  <div className="w-full bg-[#0B1120] border border-neutral-800 group-hover:border-[#00E5FF]/60 p-5 md:p-6 rounded-none backdrop-blur-xl transition-all duration-300 shadow-2xl group-hover:-translate-y-1 relative overflow-hidden pl-16 sm:pl-6 space-y-4">
                    
                    {/* Tech Node Corner Decorations */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 group-hover:border-[#00E5FF] transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-700 group-hover:border-[#7C3AED] transition-colors" />
                    <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-[#00E5FF]/3 rounded-full blur-2xl pointer-events-none" />

                    {/* Left Frame Border Accent Line */}
                    <div className={`absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00E5FF]/40 to-transparent group-hover:from-[#00E5FF] ${isEven ? "sm:right-0 sm:left-auto" : "sm:left-0 sm:right-auto"} hidden sm:block`} />

                    {/* Mobile View Thumbnail Placement Area */}
                    <div className="absolute left-4 top-5 w-9 h-9 border border-neutral-800 bg-[#050816] overflow-hidden flex items-center justify-center sm:hidden shrink-0 shadow-lg mix-blend-luminosity group-hover:mix-blend-normal transition-all">
                      <img src={logo || DEFAULT_CAMPUS_IMAGE} alt="" className="w-full h-full object-cover filter contrast-125" />
                    </div>

                    <div className={`flex flex-col gap-2 ${isEven ? "sm:items-end" : "sm:items-start"}`}>
                      <span className="text-[10px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2.5 py-0.5 rounded-sm self-start sm:self-auto shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                        {getYear(item.startDate)} — {item.currentlyStudying ? "PRESENT" : getYear(item.endDate)}
                      </span>

                      <div className="flex flex-col truncate text-left sm:text-inherit w-full">
                        <h3 className="text-base sm:text-lg font-black font-mono text-white uppercase tracking-wide truncate group-hover:text-[#00E5FF] transition-colors">
                          {item.degree}
                        </h3>
                        <p className="text-xs font-mono text-neutral-400 mt-0.5 truncate">
                          // {item.institution}
                        </p>
                      </div>
                    </div>

                    {/* Field of Study & Grade Parameters */}
                    {(item.fieldOfStudy || item.cgpa || item.grade) && (
                      <div className={`flex flex-wrap gap-2 pt-3.5 border-t border-neutral-900 text-[10px] font-mono ${isEven ? "sm:justify-end" : "sm:justify-start"}`}>
                        {item.fieldOfStudy && (
                          <span className="text-neutral-300 flex items-center gap-1.5 bg-[#050816] border border-neutral-800 px-2.5 py-1">
                            <BookOpen className="w-3.5 h-3.5 text-[#7C3AED]" />
                            {item.fieldOfStudy?.toUpperCase()}
                          </span>
                        )}
                        {(item.cgpa || item.grade) && (
                          <span className="text-[#00FF9D] bg-[#00FF9D]/5 border border-[#00FF9D]/20 px-2.5 py-1 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            {item.cgpa ? `CGPA: ${item.cgpa}` : `GRADE: ${item.grade}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Central Interlocking Glowing Neon Target Axis Center Dot */}
                <div className="absolute left-4 sm:left-1/2 top-6 sm:top-8 w-3.5 h-3.5 rounded-full bg-[#050816] border-2 border-[#00E5FF] z-20 -translate-x-1/2 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="absolute inset-0 border border-[#00E5FF] rounded-full opacity-0 group-hover:animate-[cyber-pulse-glow_1.5s_ease-in-out_infinite]" />
                </div>

                {/* Desktop Empty Mirror Grid Spacer Column */}
                <div className={`hidden sm:block w-[45%] ${isEven ? "order-3" : "order-1"}`} />

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* IMMERSIVE DETAILS POPUP MODAL CANVAS */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-[#050816]/95 z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-2xl bg-[#0B1120] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative rounded-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Frame Interface Bar Header */}
              <div className="bg-[#050816] border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">RECORD_INSPECTOR // QUALIFICATION_NODE</span>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-1 hover:bg-[#FF4D6D]/20 text-neutral-500 hover:text-[#FF4D6D] border border-transparent hover:border-[#FF4D6D]/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Graphic Title Box */}
              <div className="relative h-44 bg-[#050816] overflow-hidden flex items-end p-6 border-b border-neutral-900">
                <img 
                  src={selectedItem.logoUrl || selectedItem.institutionImage || DEFAULT_CAMPUS_IMAGE} 
                  alt="" 
                  className="w-full h-full object-cover filter brightness-[0.25] saturate-150 mix-blend-luminosity absolute inset-0 z-0 select-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                
                {/* Technology grid panel vector backdrop patterns */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

                <div className="flex items-center gap-4 relative z-20 w-full">
                  <div className="w-14 h-14 bg-[#0B1120] border border-neutral-800 rounded-none overflow-hidden flex items-center justify-center shrink-0 shadow-2xl p-2 bg-neutral-950">
                    <img 
                      src={selectedItem.logoUrl || selectedItem.institutionImage || DEFAULT_CAMPUS_IMAGE} 
                      alt={selectedItem.institution} 
                      className="w-full h-full object-contain filter contrast-110" 
                    />
                  </div>

                  <div className="space-y-1 truncate flex-1 text-left">
                    <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[9px] font-mono uppercase tracking-[0.15em] inline-block mb-1">
                      VERIFIED_MATRIX_UPLINK
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white uppercase truncate">
                      {selectedItem.degree}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 truncate">
                      // {selectedItem.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Profile Attributes Blocks */}
              <div className="p-6 sm:p-8 space-y-6 bg-[#0B1120]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#7C3AED]">
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> ENROLLMENT_TENURE</div>
                    <div className="text-xs font-mono font-bold text-neutral-200 mt-1">
                      {getYear(selectedItem.startDate)} — {selectedItem.currentlyStudying ? "PRESENT" : getYear(selectedItem.endDate)}
                    </div>
                  </div>
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00E5FF]">
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" /> FIELD_MATRIX</div>
                    <div className="text-xs font-mono font-bold text-neutral-200 mt-1 truncate uppercase" title={selectedItem.fieldOfStudy || "GENERAL_SPECIFICATION"}>
                      {selectedItem.fieldOfStudy || "GENERAL_SPECIFICATION"}
                    </div>
                  </div>
                  <div className="p-4 bg-[#050816] border border-neutral-800 border-l-2 border-l-[#00FF9D]">
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#00FF9D]" /> PERFORMANCE_GRADE</div>
                    <div className="text-xs font-mono font-bold text-[#00FF9D] mt-1 uppercase">
                      {selectedItem.cgpa ? `CGPA: ${selectedItem.cgpa}` : selectedItem.grade ? `GRADE: ${selectedItem.grade}` : "STATUS_PASSED"}
                    </div>
                  </div>
                </div>

                {selectedItem.description && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-neutral-700" /> SYLLABUS_SCOPE_ANALYSIS
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-mono whitespace-pre-line bg-[#050816] p-4 rounded-none border border-neutral-800 max-h-[200px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.location && (
                  <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-neutral-500">
                    <div className="flex items-center gap-2 text-neutral-400 text-xs justify-center sm:justify-start">
                      <MapPin className="w-4 h-4 text-[#7C3AED]" />
                      <span className="tracking-wider uppercase">LOCATION_SECTOR: {selectedItem.location}</span>
                    </div>
                    <span className="flex items-center gap-2 justify-center sm:justify-start text-[10px] tracking-widest uppercase">
                      <Radio className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" /> {identityName.toUpperCase()} // EDU_STREAM_SYNCHRONIZED
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