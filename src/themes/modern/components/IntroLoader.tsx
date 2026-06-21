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
            exit={{ opacity: 0, filter: "blur(25px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center z-[9999] select-none overflow-hidden"
          >
            {/* Premium SaaS Grid Overlay & Ambient Lighting */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#6366F1]/10 to-[#8B5CF6]/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="text-center relative z-10 flex flex-col items-center px-6 max-w-xl w-full">
              
              {/* 1. HUD TOP META BADGES BAR - REDESIGNED FOR SAAS AESTHETIC */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-10 shadow-sm"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#18181B] bg-[#111113]/80 text-[10px] font-mono font-bold tracking-wider text-[#71717A] uppercase backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                  <Binary size={12} className="text-[#6366F1]" />
                  {name.toUpperCase()}_CORE_LINK
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#18181B] bg-[#111113]/80 text-[10px] font-mono font-bold tracking-wider text-[#06B6D4] uppercase backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                  <Radio size={12} className="animate-pulse text-[#06B6D4]" />
                  ONLINE
                </div>
              </motion.div>

              {/* 2. CORE LOGO & TYPOGRAPHY LAYOUT CANVAS - PREMIUM HERO ALIGNMENT */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="p-4 rounded-2xl bg-[#111113] border border-[#18181B] shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.03)] relative group">
                    <Terminal className="w-8 h-8 text-[#6366F1] stroke-[1.5]" />
                    <div className="absolute inset-0 bg-[#6366F1]/10 blur-2xl rounded-2xl -z-10" />
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-[#D4D4D8] to-[#71717A] bg-clip-text text-transparent uppercase font-sans text-center leading-none">
                    {name}
                  </h1>
                </motion.div>
              </div>

              {/* 3. PREMIUM HARDWARE ACCELERATED METER MESH - PREMIUM LOADER OVERHAUL */}
              <div className="mt-12 w-full max-w-[240px] sm:max-w-[300px] space-y-5">
                
                {/* Loader track vector line bar layout */}
                <div className="w-full h-1.5 bg-[#0A0A0B] border border-[#18181B] rounded-full overflow-hidden relative shadow-inner">
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "0%" }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-[#6366F1] to-[#06B6D4] rounded-full"
                  />
                </div>

                {/* 4. CHAMELEON PROGRESSIVE HUD STATUS CODES */}
                <div className="h-5 flex items-center justify-center overflow-hidden relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statusIndex}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="text-[10px] font-mono tracking-widest text-[#71717A] uppercase font-bold flex items-center gap-2 justify-center text-center w-full"
                    >
                      <Cpu size={12} className="text-[#6366F1] shrink-0" />
                      {bootStatuses[statusIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>

              </div>

              {/* Lower baseline encryption tag footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute bottom-8 text-[9px] font-mono font-bold tracking-widest text-[#71717A] uppercase flex items-center gap-1.5 text-center justify-center px-6"
              >
                <ShieldAlert size={12} className="shrink-0 text-[#8B5CF6]" /> SECURE_TLS_CORE_CONNECTION
              </motion.div>

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
}