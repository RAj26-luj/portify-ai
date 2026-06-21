"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

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
  
  // Critical visibility guard rule: if both are disabled, do not render at all
  if (!showExperience && !showEducation) {
    return null;
  }

  return (
    <section
      id="career"
      className="relative w-full bg-white text-[#111827] selection:bg-gray-200 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 z-10 pt-20 md:pt-40">
        
        {/* Extreme Swiss Typography Header */}
        <div className="flex flex-col items-start gap-3 mb-16 md:mb-24 select-none border-b border-gray-100 pb-6 text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
            03 / Chronological Log
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] font-sans uppercase">
            Professional Journey.
          </h2>
        </div>

        {/* Editorial Text-Only Tab Switcher Block - Rendered only when both views are active */}
        {showExperience && showEducation && (
          <div className="flex justify-start mb-12 md:mb-16 relative z-20 border-b border-gray-200">
            <div className="flex gap-8 relative">
              
              {/* Experience Tab Button Anchor */}
              <button
                onClick={() => setActiveTab("experience")}
                className={`relative pb-4 text-xs sm:text-sm font-bold tracking-wider transition-colors duration-200 select-none z-10 font-sans cursor-pointer ${
                  activeTab === "experience" ? "text-[#111827]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  EXPERIENCE
                </span>
                {activeTab === "experience" && (
                  <motion.div
                    layoutId="activeCareerTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111827]"
                    transition={{ type: "tween", duration: 0.2 }}
                  />
                )}
              </button>

              {/* Education Tab Button Anchor */}
              <button
                onClick={() => setActiveTab("education")}
                className={`relative pb-4 text-xs sm:text-sm font-bold tracking-wider transition-colors duration-200 select-none z-10 font-sans cursor-pointer ${
                  activeTab === "education" ? "text-[#111827]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  EDUCATION
                </span>
                {activeTab === "education" && (
                  <motion.div
                    layoutId="activeCareerTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111827]"
                    transition={{ type: "tween", duration: 0.2 }}
                  />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cross-Fading Animation Sub-Canvas Content Container */}
      <div className="relative w-full z-10 pb-20 md:pb-36">
        <AnimatePresence mode="wait">
          {activeTab === "experience" && showExperience ? (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Experience experiences={experiences} />
            </motion.div>
          ) : activeTab === "education" && showEducation ? (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Education educations={educations} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}