"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Binary, ShieldAlert, Radio, Cpu, Network, Activity } from "lucide-react";

interface IntroLoaderProps {
  children: React.ReactNode;
  portfolio?: {
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function IntroLoader({ children, portfolio }: IntroLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [statusIndex, setStatusIndex] = useState(0);
  const name = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  // System terminology altered to align with theme personality
  const bootStatuses = [
    "INITIALIZING_LAB_MATRIX...",
    "SYNCHRONIZING_SYSTEM_CAPABILITIES...",
    "DECRYPTING_EXPERIMENT_LEDGERS...",
    "STABILIZING_QUANTUM_DATA_STREAM...",
    "ESTABLISHING_SECURE_CONNECTION"
  ];

  useEffect(() => {
    const seen = sessionStorage.getItem("portfolio_intro_seen");

    if (seen) {
      setLoading(false);
      return;
    }

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < bootStatuses.length - 1 ? prev + 1 : prev));
    }, 1400);

    const timer = setTimeout(() => {
      sessionStorage.setItem("portfolio_intro_seen", "true");
      setLoading(false);
      clearInterval(statusInterval);
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(25px)", scale: 1.02 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#050816] flex flex-col items-center justify-center z-[9999] select-none overflow-hidden"
          >
            <style jsx global>{`
              @keyframes scanline-boot {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
              .boot-scanline {
                animation: scanline-boot 6s linear infinite;
              }
              .cyber-boot-grid {
                background-image: linear-gradient(rgba(0, 229, 255, 0.015) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(0, 229, 255, 0.015) 1px, transparent 1px);
                background-size: 2.5rem 2.5rem;
              }
            `}</style>

            {/* Cyberpunk Glow Background Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.08),transparent_50%)] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full filter blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 cyber-boot-grid pointer-events-none" />

            {/* Laser Scanning Line Over Core Screen */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent shadow-[0_0_10px_#00E5FF] pointer-events-none boot-scanline" />
            
            <div className="text-center relative z-10 flex flex-col items-center px-4 max-w-xl w-full">
              
              {/* 1. HUD TOP META BADGES BAR */}
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 sm:gap-4 mb-10 md:mb-12"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B1120] border border-[#00E5FF]/30 text-[8px] sm:text-[9px] font-mono tracking-[0.15em] text-[#00E5FF] uppercase">
                  <Binary size={11} className="text-[#00E5FF]" />
                  SYS_NODE // {name.toUpperCase().replace(/\s+/g, "_")}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00FF9D]/5 border border-[#00FF9D]/20 text-[8px] sm:text-[9px] font-mono tracking-[0.15em] text-[#00FF9D] uppercase">
                  <Radio size={11} className="animate-pulse text-[#00FF9D]" />
                  LINK_ESTABLISHING
                </div>
              </motion.div>

              {/* 2. CYBERPUNK LAB IDENTITY CORES */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="p-4 bg-[#0B1120] border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.15)] relative rounded-none group">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00E5FF]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#7C3AED]" />
                    
                    <Terminal className="w-8 h-8 sm:w-10 sm:h-10 text-[#00E5FF] stroke-[1.5]" />
                    <motion.div 
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-[#00E5FF]/10 blur-xl -z-10" 
                    />
                  </div>
                  
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-white uppercase font-mono drop-shadow-[0_0_10px_rgba(0,229,255,0.4)] text-center">
                    // {name}
                  </h1>
                </motion.div>
              </div>

              {/* 3. NEON CYBERPUNK PIPELINE PROGRESS TRACK */}
              <div className="mt-12 md:mt-16 w-full max-w-[240px] sm:max-w-[300px] space-y-4">
                
                {/* Custom Tech Border Layout Rails */}
                <div className="w-full h-2 bg-[#050816] border border-neutral-800 p-[1px] relative rounded-none">
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#00E5FF_2px,#00E5FF_4px)]" />
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FF9D] relative z-10"
                  />
                </div>

                {/* 4. PROGRESSIVE SYSTEM PARAMETERS */}
                <div className="h-5 flex items-center justify-center overflow-hidden relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statusIndex}
                      initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-[9px] sm:text-[10px] font-mono tracking-[0.18em] text-neutral-400 uppercase font-bold flex items-center gap-2 justify-center text-center w-full"
                    >
                      <Cpu size={11} className="text-[#00E5FF] shrink-0 animate-pulse" />
                      {bootStatuses[statusIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>

              </div>

              {/* Baseline security verification tags */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute bottom-6 text-[8px] sm:text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase flex items-center gap-1.5 text-center justify-center px-4"
              >
                <ShieldAlert size={11} className="text-[#7C3AED] shrink-0" />
                <span>SECURE_QUANTUM_CORE_UPLINK // CALIBRATED</span>
              </motion.div>

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
}