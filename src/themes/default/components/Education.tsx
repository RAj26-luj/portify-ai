"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award, X, Workflow, BookOpen } from "lucide-react";

const DEFAULT_CAMPUS_IMAGE =
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop";

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
      className="relative w-full py-16 md:py-36 overflow-hidden bg-black text-white selection:bg-purple-500/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 mb-10 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-medium text-purple-400 tracking-wider uppercase mb-3 md:mb-4 backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5" />
              Qualifications
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Academic Journey.
            </h2>
          </div>
        </div>
      </div>

      {/* Timeline Core Mapping Area Container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 z-10">
        {/* Core Architectural Vertical Spine Vector Line */}
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-purple-500/40 via-neutral-800 to-transparent -translate-x-1/2 hidden sm:block" />
        <div className="absolute left-8 top-2 bottom-2 w-[1px] bg-gradient-to-b from-purple-500/40 via-neutral-800 to-transparent block sm:hidden" />

        <div className="space-y-8 sm:space-y-16">
          {sortedEducations.map((item: any, idx: number) => {
            const isEven = idx % 2 === 0;
            const logo = item.logoUrl || item.institutionImage;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col sm:flex-row items-start sm:justify-between w-full group cursor-pointer"
              >
                {/* Left Block / Right Block Alternating Structural Grid Alignment Logic */}
                <div
                  className={`w-full sm:w-[46%] order-2 ${isEven ? "sm:order-1 sm:text-right" : "sm:order-3 sm:text-left"} flex flex-col`}
                >
                  {/* Clean Card UI */}
                  <div className="w-full bg-[#07070b]/90 border border-white/5 md:hover:border-purple-500/40 p-4 md:p-5 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-xl md:hover:-translate-y-0.5 relative overflow-hidden pl-14 sm:pl-5 space-y-3">
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Left Frame Border Accent Line */}
                    <div
                      className={`absolute top-0 bottom-0 w-[2px] bg-purple-500/30 group-hover:bg-purple-500 ${isEven ? "sm:right-0 sm:left-auto" : "sm:left-0 sm:right-auto"} hidden sm:block`}
                    />

                    {/* Mobile Logo Absolute Override */}
                    <div className="absolute left-3 top-4.5 w-8 h-8 rounded-lg border border-white/10 bg-neutral-900/60 overflow-hidden flex items-center justify-center sm:hidden shrink-0 shadow-md">
                      <img
                        src={logo || DEFAULT_CAMPUS_IMAGE}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div
                      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 ${isEven ? "sm:flex-row-reverse" : "sm:flex-row"}`}
                    >
                      <div className="flex flex-col truncate text-left sm:text-inherit">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
                          {item.degree}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5 truncate">
                          {item.institution}
                        </p>
                      </div>

                      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-purple-400 bg-purple-500/5 border border-purple-500/20 px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
                        {getYear(item.startDate)} —{" "}
                        {item.currentlyStudying ? "Present" : getYear(item.endDate)}
                      </span>
                    </div>

                    {/* Field of Study & Grade Parameters */}
                    {(item.fieldOfStudy || item.cgpa || item.grade) && (
                      <div
                        className={`flex flex-wrap gap-1.5 pt-2 border-t border-white/5 text-[10px] sm:text-[11px] font-mono ${isEven ? "sm:justify-end" : "sm:justify-start"}`}
                      >
                        {item.fieldOfStudy && (
                          <span className="text-neutral-300 flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            <BookOpen className="w-3 h-3 text-purple-400" />
                            {item.fieldOfStudy}
                          </span>
                        )}
                        {(item.cgpa || item.grade) && (
                          <span className="text-purple-400 bg-purple-950/20 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {item.cgpa ? `CGPA: ${item.cgpa}` : `Grade: ${item.grade}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Central Interlocking Axis Timeline Center Dot */}
                <div className="absolute left-4 sm:left-1/2 top-5 sm:top-6 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-black border-2 border-purple-500 shadow-[0_0_10px_#8b5cf6] z-20 -translate-x-1/2 scale-100 sm:group-hover:scale-125 transition-transform duration-300" />

                {/* Alternating Empty Spacer Column Frame (Desktop Only) */}
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
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh] text-left shadow-2xl relative scrollbar-none pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 border border-white/10 text-neutral-400 hover:text-white transition-colors backdrop-blur-md active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-44 bg-neutral-900 overflow-hidden">
                <img
                  src={selectedItem.institutionImage || DEFAULT_CAMPUS_IMAGE}
                  alt=""
                  className="w-full h-full object-cover blur-xs brightness-[0.35] scale-102 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-white/10 bg-neutral-900 overflow-hidden flex items-center justify-center shrink-0 shadow-lg p-1.5 bg-neutral-950">
                    <img
                      src={
                        selectedItem.logoUrl ||
                        selectedItem.institutionImage ||
                        DEFAULT_CAMPUS_IMAGE
                      }
                      alt={selectedItem.institution}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-0.5 truncate">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-mono uppercase tracking-wider mb-1 inline-block">
                      Verified Credentials Node
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold tracking-wide text-white truncate">
                      {selectedItem.degree}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-light truncate">
                      {selectedItem.institution}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 font-sans">
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">
                      Enrollment Tenure
                    </div>
                    <div className="text-xs font-medium text-neutral-200 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {getYear(selectedItem.startDate)} —{" "}
                      {selectedItem.currentlyStudying ? "Present" : getYear(selectedItem.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">
                      Field Matrix
                    </div>
                    <div
                      className="text-xs font-medium text-neutral-200 mt-0.5 flex items-center gap-1.5 truncate"
                      title={selectedItem.fieldOfStudy || "General Spec"}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">
                        {selectedItem.fieldOfStudy || "General Spec"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider font-mono">
                      Performance Grade
                    </div>
                    <div className="text-xs font-medium text-purple-400 mt-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>
                        {selectedItem.cgpa
                          ? `CGPA: ${selectedItem.cgpa}`
                          : selectedItem.grade
                            ? `Grade: ${selectedItem.grade}`
                            : "Class Passed Status"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedItem.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono">
                      Syllabus Scope
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 font-light whitespace-pre-line bg-white/[0.01] p-4 rounded-xl border border-white/5 max-h-[220px] overflow-y-auto scrollbar-none">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.location && (
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{selectedItem.location.toUpperCase()}</span>
                    </div>
                    <span className="opacity-30 flex items-center gap-1 font-mono text-xs">
                      <Workflow className="w-3 h-3" /> {identityName.toUpperCase()} // EDU_SYNC
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
