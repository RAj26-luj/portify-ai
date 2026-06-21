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

  // Terminal inspired booting sequences
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
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#0D1117] flex flex-col items-center justify-center z-[9999] select-none overflow-hidden font-mono text-[#C9D1D9]"
          >
            {/* Matrix mesh grid layout overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d08_1px,transparent_1px),linear-gradient(to_bottom,#30363d08_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            
            <div className="w-full max-w-xl px-4 relative z-10 flex flex-col items-center">
              
              {/* 1. HUD TOP META BADGES BAR */}
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161B22] border border-[#30363D] text-[10px] text-neutral-400 uppercase">
                  <Binary size={10} className="text-[#58A6FF] animate-pulse" />
                  {name.toLowerCase().replace(/\s+/g, "-")}@node
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#238636]/10 border border-[#238636]/20 text-[10px] text-[#7EE787] uppercase">
                  <Radio size={10} className="animate-pulse" />
                  ONLINE
                </div>
              </motion.div>

              {/* 2. CORE LOGO & TYPOGRAPHY TERMINAL FRAME */}
              <div className="w-full bg-[#161B22] border border-[#30363D] rounded-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#30363D] px-3 py-2 bg-[#1C2128]">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <Terminal size={12} className="text-[#58A6FF]" />
                    <span>kernel_boot.sh</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#30363D]" />
                    <span className="w-2 h-2 rounded-full bg-[#30363D]" />
                  </div>
                </div>

                <div className="p-6 flex flex-col items-center gap-4 bg-[#0D1117]/80">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="p-2.5 rounded bg-[#161B22] border border-[#30363D] shadow-sm relative">
                      <Terminal className="w-6 h-6 text-[#58A6FF]" />
                    </div>
                    
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase text-center">
                      {name}
                    </h1>
                  </motion.div>

                  {/* 3. PROGRESS BAR INTERACTIVE TRACK */}
                  <div className="w-full max-w-[240px] space-y-3 pt-2">
                    <div className="w-full h-1 bg-[#161B22] border border-[#30363D] rounded overflow-hidden relative">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "0%" }}
                        transition={{ duration: 7, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-full bg-[#58A6FF]"
                      />
                    </div>

                    {/* 4. CHAMELEON PROGRESSIVE HUD STATUS CODES */}
                    <div className="h-4 flex items-center justify-center overflow-hidden relative w-full">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={statusIndex}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="text-[10px] text-neutral-500 uppercase flex items-center gap-1.5 justify-center text-center w-full"
                        >
                          <Cpu size={10} className="text-[#F78166] shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
                          {bootStatuses[statusIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower baseline encryption tag footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-6 text-[9px] text-neutral-600 uppercase flex items-center gap-1.5 text-center justify-center px-4"
              >
                <ShieldAlert size={11} className="text-neutral-600 shrink-0" /> SECURE_LTS_CIPHER_ESTABLISHED
              </motion.div>

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
}