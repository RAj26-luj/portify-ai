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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "linear" }}
            className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999] select-none overflow-hidden text-[#111827]"
          >
            <div className="text-center relative z-10 flex flex-col items-center px-6 max-w-xl w-full">
              
              {/* 1. HUD TOP META BADGES BAR */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3 mb-12 select-none"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAFAFA] border border-gray-200 text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
                  <Binary size={11} className="text-gray-500" />
                  {name.toUpperCase()}_CORE_LINK
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAFAFA] border border-gray-200 text-[10px] font-mono font-bold tracking-widest text-gray-900 uppercase">
                  <Radio size={11} className="animate-pulse" />
                  ONLINE
                </div>
              </motion.div>

              {/* 2. CORE LOGO & TYPOGRAPHY LAYOUT CANVAS */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="p-3 bg-[#FAFAFA] border border-gray-200 shadow-sm relative">
                    <Terminal className="w-8 h-8 text-[#111827] stroke-[1.5]" />
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111827] uppercase font-sans text-center leading-none">
                    {name}.
                  </h1>
                </motion.div>
              </div>

              {/* 3. PREMIUM HARDWARE ACCELERATED METER MESH */}
              <div className="mt-12 w-full max-w-[240px] sm:max-w-[280px] space-y-4">
                
                {/* Loader track vector line bar layout */}
                <div className="w-full h-[2px] bg-gray-100 overflow-hidden relative">
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "0%" }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-full bg-[#111827]"
                  />
                </div>

                {/* 4. CHAMELEON PROGRESSIVE HUD STATUS CODES */}
                <div className="h-5 flex items-center justify-center overflow-hidden relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statusIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold flex items-center gap-1.5 justify-center text-center w-full"
                    >
                      <Cpu size={11} className="text-gray-400 shrink-0" />
                      {bootStatuses[statusIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>

              </div>

              {/* Lower baseline encryption tag footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-8 text-[9px] font-mono tracking-widest text-gray-400 font-bold uppercase flex items-center gap-1.5 text-center justify-center px-6"
              >
                <ShieldAlert size={11} className="shrink-0 text-gray-500" /> SECURE_TLS_CORE_CONNECTION
              </motion.div>

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
}