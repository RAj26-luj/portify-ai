"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Zap } from "lucide-react";

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
      className="relative w-full bg-black text-white selection:bg-purple-500/30 overflow-hidden"
    >
      {/* Visual Ambient Grid and Radial Glow Flares */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 pt-16 md:pt-32">
        
        {/* Core Modern Header Typography Layout Block */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs text-purple-400 tracking-wider uppercase backdrop-blur-md">
            <Zap className="w-3 h-3 text-purple-400" />
            // {identityName.toUpperCase()}_TIMELINE
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Professional Journey.
          </h2>
        </div>

        {/* Premium Ergonomic Centered Tab Switcher Bar Docks - Rendered only when both views are active */}
        {showExperience && showEducation && (
          <div className="flex justify-center mb-10 md:mb-12 relative z-20">
            <div className="flex sm:inline-flex w-full sm:w-auto p-1.5 rounded-2xl border border-white/5 bg-[#07070b]/60 backdrop-blur-xl relative">
              
              {/* Experience Tab Selection Node Anchor */}
              <button
                onClick={() => setActiveTab("experience")}
                className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium font-mono tracking-wide transition-all duration-300 select-none z-10 ${
                  activeTab === "experience" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                EXPERIENCE
                {activeTab === "experience" && (
                  <motion.div
                    layoutId="activeCareerTabBg"
                    className="absolute inset-0 bg-purple-600 rounded-xl -z-10 shadow-lg shadow-purple-600/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              {/* Education Tab Selection Node Anchor */}
              <button
                onClick={() => setActiveTab("education")}
                className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium font-mono tracking-wide transition-all duration-300 select-none z-10 ${
                  activeTab === "education" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                EDUCATION
                {activeTab === "education" && (
                  <motion.div
                    layoutId="activeCareerTabBg"
                    className="absolute inset-0 bg-purple-600 rounded-xl -z-10 shadow-lg shadow-purple-600/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Frame Sub-Canvas Target Rendering Block using Cross-Fading Animation Anchors */}
      <div className="relative w-full z-10 pb-12 md:pb-16 px-4 sm:px-0">
        <AnimatePresence mode="wait">
          {activeTab === "experience" && showExperience ? (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Experience experiences={experiences} />
            </motion.div>
          ) : activeTab === "education" && showEducation ? (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Education educations={educations} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}