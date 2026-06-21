"use client";

import React, { useState } from "react";
import { MapPin, Target, Clock, Terminal, Cpu, GitBranch, Shield, RefreshCw } from "lucide-react";

interface AboutProps {
  portfolio: {
    bio?: string;
    tagline?: string;
    resumeHeadline?: string;
    description?: string;
    currentRole?: string;
    currentFocus?: string;
    availabilityStatus?: string;
    heroIntroduction?: string;
    city?: string;
    state?: string;
    country?: string;
    title?: string;
    user?: {
      name?: string;
    };
  };
}

export default function About({ portfolio }: AboutProps) {
  const bio = portfolio?.bio || "";
  const tagline = portfolio?.tagline || portfolio?.resumeHeadline || "";
  const description = portfolio?.description || "";
  const currentRole = portfolio?.currentRole || "";
  const currentFocus = portfolio?.currentFocus || "";
  const availabilityStatus = portfolio?.availabilityStatus || "";
  const heroIntroduction = portfolio?.heroIntroduction || "";
  const identityName = portfolio?.title || portfolio?.user?.name || "IDENTITY_NODE";

  const location = [
    portfolio?.city,
    portfolio?.state,
    portfolio?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const [activeTab, setActiveTab] = useState<"readme" | "env" | "logs">("readme");

  if (!bio && !tagline && !description && !heroIntroduction && !currentRole) {
    return null;
  }

  return (
    <section
      id="about"
      className="relative w-full py-12 md:py-24 overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-mono select-none border-b border-[#30363D]"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d15_1px,transparent_1px),linear-gradient(to_bottom,#30363d15_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* IDE Header Interface */}
        <div className="flex items-center justify-between w-full bg-[#161B22] border border-[#30363D] rounded-t-xl px-4 py-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#58A6FF]" />
            <span className="font-bold text-[#C9D1D9]">whoami.sh</span>
            <span className="text-neutral-600">|</span>
            <span className="text-[11px] text-neutral-500 hidden sm:inline">bash - 80×24</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F78166]/40" />
            <span className="w-3 h-3 rounded-full bg-[#7EE787]/40" />
            <span className="w-3 h-3 rounded-full bg-[#58A6FF]/40" />
          </div>
        </div>

        {/* Triple Column IDE Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-b border-[#30363D] bg-[#0D1117] rounded-b-xl overflow-hidden min-h-[500px]">
          
          {/* LEFT SIDEBAR: PROFILE & TECH PARAMETERS */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#30363D] p-5 bg-[#161B22]/50 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#30363D]">
              <Cpu size={14} className="text-[#F78166]" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">System Parameters</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-[#58A6FF]" />
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Identity</div>
                <div className="text-sm font-bold text-white mt-1">{identityName}</div>
                {heroIntroduction && (
                  <div className="text-[11px] text-[#58A6FF] mt-0.5">{heroIntroduction}</div>
                )}
              </div>

              {currentRole && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-[#7EE787]" />
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Current Role</div>
                  <div className="text-xs text-[#C9D1D9] font-sans mt-1 leading-normal">{currentRole}</div>
                </div>
              )}

              {currentFocus && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg flex items-start gap-3">
                  <Target size={14} className="text-[#F78166] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Tech Stack Focus</div>
                    <div className="text-xs text-neutral-300 font-sans mt-0.5">{currentFocus}</div>
                  </div>
                </div>
              )}

              {availabilityStatus && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg flex items-start gap-3">
                  <Clock size={14} className="text-[#7EE787] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Availability Status</div>
                    <div className="text-xs text-neutral-300 font-sans mt-0.5">{availabilityStatus}</div>
                  </div>
                </div>
              )}

              {location && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg flex items-start gap-3">
                  <MapPin size={14} className="text-[#58A6FF] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Location Node</div>
                    <div className="text-xs text-neutral-300 font-sans mt-0.5">{location.toUpperCase()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER PANEL: REPOSITORY DOCUMENTATION EDITOR */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between">
            <div className="w-full space-y-4">
              {/* Terminal Tab Bar */}
              <div className="flex items-center gap-2 border-b border-[#30363D] pb-2 text-xs">
                <button 
                  onClick={() => setActiveTab("readme")}
                  className={`px-2 py-1 rounded transition-colors ${activeTab === "readme" ? "bg-[#21262D] text-white font-bold" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  README.md
                </button>
                <button 
                  onClick={() => setActiveTab("env")}
                  className={`px-2 py-1 rounded transition-colors ${activeTab === "env" ? "bg-[#21262D] text-white font-bold" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  .env.production
                </button>
                <button 
                  onClick={() => setActiveTab("logs")}
                  className={`px-2 py-1 rounded transition-colors ${activeTab === "logs" ? "bg-[#21262D] text-white font-bold" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  runtime.log
                </button>
              </div>

              {/* Dynamic Tab Workspace Viewports */}
              {activeTab === "readme" && (
                <div className="space-y-4 text-left font-sans">
                  {tagline && (
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white font-mono border-b border-[#30363D] pb-2">
                      # {tagline}
                    </h3>
                  )}
                  {bio && (
                    <p className="text-xs md:text-sm text-[#neutral-300] leading-relaxed whitespace-pre-line text-[#C9D1D9]">
                      {bio}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "env" && (
                <div className="space-y-2 text-xs text-[#7EE787] font-mono p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                  <div>NODE_ENV=production</div>
                  <div>IDENTITY_NAME="{identityName.replace(/\s+/g, "_").toUpperCase()}"</div>
                  {currentRole && <div>ROLE="{currentRole.toUpperCase()}"</div>}
                  {location && <div>GEOLOCATION="{location.replace(/\s+/g, "")}"</div>}
                  <div>SECURITY_CLEARANCE=LEVEL_ACTIVE</div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-1 text-[11px] text-[#F78166] font-mono p-3 bg-[#161B22] border border-[#30363D] rounded-lg max-h-[220px] overflow-y-auto">
                  <div>[info] Initializing portfolio pipeline kernel...</div>
                  <div>[info] Loading secure profile variables data payload</div>
                  <div>[info] Environment mapping checks finalized... [OK]</div>
                  <div>[debug] Thread pooling enabled with high concurrency</div>
                  <div className="text-[#3FB950]">[success] Application rendering cluster fully operational.</div>
                </div>
              )}
            </div>

            {description && (
              <div className="mt-6 pt-4 border-t border-[#30363D] text-left">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2 font-mono">
                  <GitBranch size={12} className="text-[#58A6FF]" />
                  <span>EXTENDED_METADATA //</span>
                </div>
                <div className="text-xs text-neutral-400 font-sans leading-relaxed italic bg-[#161B22]/40 border border-[#30363D]/60 p-3 rounded-lg">
                  {description}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: CODING SPECIFICATIONS & ANALYTICS */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#30363D] p-5 bg-[#161B22]/30 space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#30363D]">
              <Shield size={14} className="text-[#3FB950]" />
              <span className="font-bold text-neutral-400 uppercase tracking-wider">Telemetry Diagnostics</span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center py-1.5 border-b border-[#30363D]/60">
                <span className="text-neutral-500">Uptime</span>
                <span className="text-[#7EE787] flex items-center gap-1">100% <RefreshCw size={10} className="animate-spin text-neutral-600" /></span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#30363D]/60">
                <span className="text-neutral-500">Repository Cluster</span>
                <span className="text-white font-bold">Stable</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#30363D]/60">
                <span className="text-neutral-500">Protocols</span>
                <span className="text-[#58A6FF]">HTTPS/WSS</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-neutral-500">Data Compression</span>
                <span className="text-[#F78166]">Gzip / Brotli</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-center text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                SECURE INTERFACE LINK AUTHORIZED
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}