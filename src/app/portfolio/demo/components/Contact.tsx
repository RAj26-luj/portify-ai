"use client";

import { Terminal, Send, Shield, Radio, Mail, Activity, ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <section className="relative py-24 bg-[#030306] overflow-hidden" id="contact">
      {/* Background Matrix Scanning Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none opacity-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <Radio size={12} className="animate-pulse" />
            Signal Routing Protocol
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Establish Uplink
          </h2>
        </div>

        {/* 3D Perspective Workspace Layout */}
        <div className="grid lg:grid-cols-12 gap-8 [perspective:1200px]">
          
          {/* LEFT CHASSIS: Connection Diagnostics (Tilted Left) */}
          <div className="lg:col-span-5 group relative bg-[#08080d]/90 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(6deg)_rotateY(10deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)_translateZ(20px)] shadow-[15px_20px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.1)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header */}
            <div className="pb-4 mb-6 border-b border-white/5 flex items-center justify-between [transform:translateZ(15px)]">
              <div className="flex items-center gap-2 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                <Terminal size={14} />
                <span className="font-mono text-xs uppercase tracking-wider">COMMS_NODE_STAT</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            </div>

            {/* Content Core */}
            <div className="space-y-6 [transform:translateZ(35px)]">
              <p className="text-sm font-mono text-zinc-400 leading-relaxed">
                Initiating standard message handshake. Fill out the terminal array matrix to forward a secure payload directly to my local directory workspace.
              </p>

              {/* Live Technical Diagnostic Readouts */}
              <div className="space-y-3 font-mono text-xs pt-4 border-t border-white/5">
                <div className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[10px]">Route Target</span>
                  <span className="text-zinc-200 flex items-center gap-1.5">
                    <Mail size={12} className="text-zinc-400" />
                    hello@bianca_workspace
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[10px]">Response Vector</span>
                  <span className="text-emerald-400 font-bold">&lt; 24 Hours</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[10px]">Encryption Layer</span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Shield size={11} className="text-zinc-500" />
                    TLS 1.3 // SECURE
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Matrix Background Watermark */}
            <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-zinc-600 [transform:translateZ(10px)]">
              <Activity size={12} className="animate-pulse" />
              <span>LISTENING FOR UPLINK PACKETS...</span>
            </div>
          </div>

          {/* RIGHT CHASSIS: Secure Form Input Matrix (Tilted Right) */}
          <form className="lg:col-span-7 group relative bg-[#08080d]/90 border border-white/10 rounded-2xl p-8 space-y-5 transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(6deg)_rotateY(-10deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)_translateZ(20px)] shadow-[-15px_20px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Input 1: Name */}
            <div className="space-y-1.5 [transform:translateZ(25px)]">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                Field 01 // Identification Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Commander Shepard"
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all"
              />
            </div>

            {/* Input 2: Email */}
            <div className="space-y-1.5 [transform:translateZ(35px)]">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                Field 02 // Return Address Array
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all"
              />
            </div>

            {/* Input 3: Message */}
            <div className="space-y-1.5 [transform:translateZ(45px)]">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                Field 03 // Message Core Payload
              </label>
              <textarea
                rows={4}
                required
                placeholder="Compile message body strings here..."
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all resize-none"
              />
            </div>

            {/* Submit Action Block */}
            <div className="pt-2 [transform:translateZ(50px)]">
              <button
                type="submit"
                className="group/btn w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <span>Transmit Payload</span>
                <Send size={12} className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}