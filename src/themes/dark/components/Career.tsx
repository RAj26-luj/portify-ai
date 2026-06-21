"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Zap, Activity } from "lucide-react";

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
      className="relative w-full bg-[#050816] text-[#F8FAFC] selection:bg-[#00E5FF]/30 overflow-hidden"
    >
      <style jsx global>{`
        .cyber-grid-career {
          background-image: linear-gradient(rgba(0, 229, 255, 0.01) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.01) 1px, transparent 1px);
          background-size: 3rem 3rem;
        }
      `}</style>

      {/* Cyberpunk Environment Decorative Grid & Flares */}
      <div className="absolute inset-0 cyber-grid-career pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7C3AED]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10 pt-20 md:pt-40">
        
        {/* Core Modern Header Typography Layout Block */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B1120] border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <Zap className="w-3.5 h-3.5 text-[#00FF9D] animate-pulse" />
            // {identityName.toUpperCase().replace(/\s+/g, "_")}_TIMELINE
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            // TIMELINE_REGISTRY
          </h2>
        </div>

        {/* Premium Ergonomic Centered Tab Switcher Bar Docks */}
        <div className="flex justify-center mb-12 md:mb-16 relative z-20">
          <div className="flex sm:inline-flex w-full sm:w-auto p-1.5 bg-[#0B1120] border border-neutral-800 relative rounded-none shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            {/* HUD Corner Tech Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-700" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-700" />
            
            {/* Experience Tab Selection Node Anchor */}
            <button
              onClick={() => setActiveTab("experience")}
              className={`relative flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-none flex items-center justify-center gap-2.5 text-xs font-mono font-bold tracking-[0.15em] transition-all select-none z-10 ${
                activeTab === "experience" ? "text-[#050816]" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              MISSION_HISTORY
              {activeTab === "experience" && (
                <motion.div
                  layoutId="activeCareerTabBg"
                  className="absolute inset-0 bg-[#00E5FF] rounded-none shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            {/* Education Tab Selection Node Anchor */}
            <button
              onClick={() => setActiveTab("education")}
              className={`relative flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-none flex items-center justify-center gap-2.5 text-xs font-mono font-bold tracking-[0.15em] transition-all select-none z-10 ${
                activeTab === "education" ? "text-[#050816]" : "text-neutral-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              TRAINING_LOG
              {activeTab === "education" && (
                <motion.div
                  layoutId="activeCareerTabBg"
                  className="absolute inset-0 bg-[#00E5FF] rounded-none shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Frame Sub-Canvas Target Rendering Block using Cross-Fading Animation Anchors */}
      <div className="relative w-full z-10 pb-16 md:pb-24 px-4 sm:px-0">
        <AnimatePresence mode="wait">
          {activeTab === "experience" ? (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0, filter: "blur(6px)", y: 15 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Experience experiences={experiences} />
            </motion.div>
          ) : (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0, filter: "blur(6px)", y: 15 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Education educations={educations} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}