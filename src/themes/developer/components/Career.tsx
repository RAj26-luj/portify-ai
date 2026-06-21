"use client";

import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Zap, Terminal } from "lucide-react";

import Experience from "./Experience";
import Education from "./Education";

interface CareerProps {
  experiences?: any[];
  educations?: any[];
  portfolio?: {
    title?: string;
    user?: {
      name?: string;
    };
  };
  showExperience?: boolean;
  showEducation?: boolean;
}

export default function Career({ 
  experiences = [], 
  educations = [], 
  portfolio,
  showExperience = true,
  showEducation = true
}: CareerProps) {
  // Determine default active tab based on explicit visibility configurations
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    showExperience ? "experience" : "education"
  );
  
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  // Critical visibility guard rule: if both are disabled, do not render at all
  if (!showExperience && !showEducation) {
    return null;
  }

  return (
    <section
      id="career"
      className="relative w-full bg-[#0D1117] text-[#C9D1D9] font-mono border-b border-[#30363D] select-none overflow-hidden"
    >
      {/* Matrix Mesh Grid Overlay Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d12_1px,transparent_1px),linear-gradient(to_bottom,#30363d12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* IDE Tab Header Control Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-lg px-4 py-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">Commit Log</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-[#7EE787]">history_stream.sh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#58A6FF]" />
          </div>
        </div>
        
        <div className="p-4 bg-[#161B22]/40 border-x border-b border-[#30363D] rounded-b-lg text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-[11px] text-neutral-400">
            <span className="text-[#F78166]">$</span> trace-history --node={identityName.toLowerCase().replace(/\s+/g, "-")}
          </div>

          {/* Premium Ergonomic Tab Switcher Bar Docks - Rendered only when both views are active */}
          {showExperience && showEducation && (
            <div className="flex p-0.5 rounded bg-[#0D1117] border border-[#30363D] relative shrink-0">
              {/* Experience Tab Button */}
              <button
                onClick={() => setActiveTab("experience")}
                className={`relative px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-colors select-none z-10 flex items-center gap-1.5 ${
                  activeTab === "experience" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                commit_history
                {activeTab === "experience" && (
                  <motion.div
                    layoutId="activeCareerTabBg"
                    className="absolute inset-0 bg-[#21262D] border border-[#30363D] rounded -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* Education Tab Button */}
              <button
                onClick={() => setActiveTab("education")}
                className={`relative px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-colors select-none z-10 flex items-center gap-1.5 ${
                  activeTab === "education" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                academic_tree
                {activeTab === "education" && (
                  <motion.div
                    layoutId="activeCareerTabBg"
                    className="absolute inset-0 bg-[#21262D] border border-[#30363D] rounded -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Stream Display Sub-Canvas */}
      <div className="relative w-full z-10 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "experience" && showExperience ? (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Experience experiences={experiences} />
            </motion.div>
          ) : activeTab === "education" && showEducation ? (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Education educations={educations} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}