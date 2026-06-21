"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Binary, ShieldAlert, Radio, Cpu } from "lucide-react";

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

  // Premium sequential booting telemetry steps mapped across the 7-second sequence
  const bootStatuses = [
    "COMPUTING_IDENTITY_RECORDS...",
    "ESTABLISHING_SECURE_GATEWAY...",
    "FETCHING_PRODUCTION_REPOS...",
    "RENDERING_UX_CORE_ASSETS...",
    "SYSTEM_PIPELINE_READY"
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
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] select-none overflow-hidden"
          >
            {/* Visual Ambient Background Flares */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_40%)] pointer-events-none" />
            
            {/* Fine architectural grid mesh trace lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] md:bg-[size:3rem_3rem] pointer-events-none" />
            
            <div className="text-center relative z-10 flex flex-col items-center px-4 max-w-xl w-full">
              
              {/* 1. HUD TOP META BADGES BAR */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 sm:gap-4 mb-8 md:mb-10"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/5 bg-white/[0.01] text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-500 uppercase backdrop-blur-md">
                  <Binary size={10} className="text-purple-500 animate-pulse" />
                  {name.toUpperCase()}_CORE_LINK
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-500/10 bg-emerald-500/5 text-[8px] sm:text-[9px] font-mono tracking-widest text-emerald-400 uppercase backdrop-blur-md">
                  <Radio size={10} className="animate-pulse" />
                  ONLINE
                </div>
              </motion.div>

              {/* 2. CORE LOGO & TYPOGRAPHY LAYOUT CANVAS */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 shadow-xl relative group">
                    <Terminal className="w-7 h-7 sm:w-10 sm:h-10 text-purple-400 stroke-[1.25]" />
                    <motion.div 
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-purple-500/10 blur-xl rounded-2xl -z-10" 
                    />
                  </div>
                  
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent uppercase font-sans text-center">
                    {name}
                  </h1>
                </motion.div>
              </div>

              {/* 3. PREMIUM HARDWARE ACCELERATED METER MESH */}
              <div className="mt-10 md:mt-12 w-full max-w-[220px] sm:max-w-[280px] space-y-3.5 md:space-y-4">
                
                {/* Loader track vector line bar layout */}
                <div className="w-full h-[2px] bg-neutral-950 border border-white/[0.03] rounded-full overflow-hidden relative shadow-inner">
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "0%" }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-purple-500 to-cyan-400 rounded-full"
                  />
                </div>

                {/* 4. CHAMELEON PROGRESSIVE HUD STATUS CODES */}
                <div className="h-4 flex items-center justify-center overflow-hidden relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statusIndex}
                      initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-semibold flex items-center gap-1.5 justify-center text-center w-full"
                    >
                      <Cpu size={10} className="text-neutral-600 shrink-0" />
                      {bootStatuses[statusIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>

              </div>

              {/* Lower baseline encryption tag footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute bottom-6 text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-600 uppercase flex items-center gap-1 text-center justify-center px-4"
              >
                <ShieldAlert size={10} className="shrink-0" /> SECURE_TLS_CORE_CONNECTION
              </motion.div>

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
}