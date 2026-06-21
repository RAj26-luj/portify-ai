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
}

export default function Career({ experiences = [], educations = [], portfolio }: CareerProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  return (
    <section
      id="career"
      className="relative w-full bg-[#0A0A0B] text-white selection:bg-[#6366F1]/30 overflow-hidden"
    >
      {/* Premium SaaS Micro-Grid & Gradient Mesh Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#6366F1]/10 via-[#8B5CF6]/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 pt-20 md:pt-40">
        
        {/* Core Modern Header Typography Layout Block */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18181B] bg-[#111113]/60 text-[11px] font-semibold text-[#6366F1] tracking-wider uppercase backdrop-blur-md font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
            <Zap className="w-3.5 h-3.5 text-[#6366F1]" />
            {identityName.toUpperCase()}_TIMELINE
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent font-sans">
            Professional Journey<span className="text-[#06B6D4]">.</span>
          </h2>
        </div>

        {/* Premium Ergonomic Centered Tab Switcher Bar Docks */}
        <div className="flex justify-center mb-12 md:mb-20 relative z-20">
          <div className="flex sm:inline-flex w-full sm:w-auto p-1.5 rounded-2xl border border-[#18181B] bg-[#111113]/60 backdrop-blur-xl relative shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.02)]">
            
            {/* Experience Tab Selection Node Anchor */}
            <button
              onClick={() => setActiveTab("experience")}
              className={`relative flex-1 sm:flex-none px-5 sm:px-8 py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 select-none z-10 font-sans cursor-pointer ${
                activeTab === "experience" ? "text-white" : "text-[#71717A] hover:text-[#D4D4D8]"
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              Experience
              {activeTab === "experience" && (
                <motion.div
                  layoutId="activeCareerTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl -z-10 shadow-[0_4px_15px_rgba(99,102,241,0.25)] border border-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* Education Tab Selection Node Anchor */}
            <button
              onClick={() => setActiveTab("education")}
              className={`relative flex-1 sm:flex-none px-5 sm:px-8 py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 select-none z-10 font-sans cursor-pointer ${
                activeTab === "education" ? "text-white" : "text-[#71717A] hover:text-[#D4D4D8]"
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              Education
              {activeTab === "education" && (
                <motion.div
                  layoutId="activeCareerTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl -z-10 shadow-[0_4px_15px_rgba(99,102,241,0.25)] border border-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Frame Sub-Canvas Target Rendering Block */}
      <div className="relative w-full z-10 pb-20 md:pb-32">
        <AnimatePresence mode="wait">
          {activeTab === "experience" ? (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Experience experiences={experiences} />
            </motion.div>
          ) : (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Education educations={educations} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}