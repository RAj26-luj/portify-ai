"use client";

import { useState, useRef } from "react";
import { FileText, Terminal, ArrowUpRight, Cpu, Binary, Sparkles, Download, Eye } from "lucide-react";

export default function Hero() {
  // 3D Matrix Transform States for the Visual Chassis
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate cursor location relative to the center of the viewport card
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Map absolute values to severe tilt rotational angles
    const rY = (mouseX / (width / 2)) * 15; // Max 15 deg horizontal axis shift
    const rX = -(mouseY / (height / 2)) * 15; // Max 15 deg vertical axis shift
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-28 md:pt-36 bg-[#030306] overflow-hidden z-20"
      id="home"
    >
      {/* Background Matrix Architecture Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98103_1px,transparent_1px),linear-gradient(to_bottom,#10b98103_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT CHASSIS: Terminal Command Core */}
          <div className="space-y-6 lg:col-span-7 relative z-10">
            
            {/* Dynamic Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.05)] select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              TERMINAL_UPLINK_DEPLOYED // CORE_V1.2
            </div>

            {/* Typography Gradient Header */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Bianca Silva<span className="text-emerald-500 inline-block animate-pulse">.</span>
              </h1>
              
              <div className="flex items-center gap-3 pt-1">
                <h3 className="text-2xl md:text-3xl font-mono font-bold text-zinc-400 tracking-tight">
                  Frontend Architect
                </h3>
                <span className="text-zinc-700 font-mono text-sm hidden sm:inline">//</span>
                <span className="font-mono text-[10px] text-zinc-500 tracking-wider bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded uppercase hidden sm:inline-block">
                  SYS_EXEC_MODE
                </span>
              </div>
            </div>

            {/* Content Abstract Description */}
            <p className="text-zinc-400 font-sans text-base md:text-lg leading-relaxed max-w-xl">
              Engineering high-throughput user interfaces, sub-millisecond layout orchestration trees, and fluid visual design mechanics.
            </p>

            {/* Premium CTA Action Cluster */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="group/btn px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>View Ledger Array</span>
                <Eye size={14} className="transform group-hover/btn:scale-110 transition-transform" />
              </a>

              {/* Explicit CV Download Engine Vector */}
              <a
                href="/resume.pdf"
                download="Bianca_Silva_CV.pdf"
                className="group/btn px-6 py-3.5 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-zinc-200 hover:text-emerald-400 font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              >
                <span>Download CV</span>
                <Download size={14} className="text-zinc-500 group-hover/btn:text-emerald-400 transform group-hover/btn:translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* RIGHT CHASSIS: Live 3D Computated Frame Matrix */}
          <div className="flex justify-center lg:col-span-5 relative select-none">
            
            {/* Stable Geometric Guideline Bounds */}
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="group relative w-full max-w-[350px] aspect-[3/4] [perspective:1200px] cursor-crosshair"
            >
              
              {/* Main Moving Core Deck Panel Component */}
              <div 
                className="relative w-full h-full bg-[#07070b]/95 border border-white/10 rounded-2xl p-5 shadow-[0_30px_70px_rgba(0,0,0,0.85)] transition-transform duration-150 ease-out flex flex-col justify-between"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? "30px" : "0px"})`,
                  borderColor: isHovered ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Internal High-Tech Coordinate Underlays */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Tech Framing Corner Alignments */}
                <span className="absolute top-4 left-4 w-4 h-[1px] bg-white/10 group-hover:bg-emerald-400/40 transition-colors" />
                <span className="absolute top-4 left-4 w-[1px] h-4 bg-white/10 group-hover:bg-emerald-400/40 transition-colors" />
                <span className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/10 group-hover:bg-emerald-400/40 transition-colors" />
                <span className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/10 group-hover:bg-emerald-400/40 transition-colors" />

                {/* Grid HUD Meta Data Title */}
                <div 
                  className="flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-wider"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Cpu size={11} className={isHovered ? "text-emerald-400 animate-pulse" : "text-zinc-600"} />
                    <span>SYS_MATRIX_RENDER_OK</span>
                  </div>
                  <span className="text-zinc-600 font-bold">MODE://3D_ROT</span>
                </div>

                {/* Main Visual Node Asset Container Frame */}
                <div 
                  className="relative flex-1 my-4 rounded-xl overflow-hidden bg-zinc-950 border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)]"
                  style={{ transform: "translateZ(45px)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                    className="w-full h-full object-cover grayscale contrast-125 brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                    alt="Biometric Identity profile node"
                  />
                  
                  {/* Cyber Hologram CRT Raster Line Overlays */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_4px] opacity-25 pointer-events-none" />
                  
                  {/* Horizontal Matrix Scanning Target line */}
                  <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent shadow-[0_0_10px_#10b981] top-0 animate-[bounce_4s_infinite] pointer-events-none" />
                  
                  {/* Outer Frame Shading Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040408] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Micro Floating Core Watermark label */}
                  <div className="absolute bottom-3 left-3 font-mono text-[8px] text-zinc-300 bg-[#07070b]/90 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                    <Sparkles size={8} className="text-emerald-400 animate-spin-[spin_3s_linear_infinite]" />
                    <span className="tracking-widest font-bold">BIOMETRIC_SCAN_ACTIVE</span>
                  </div>

                  {/* Operational Target crosshairs overlay */}
                  <div className="absolute top-3 right-3 font-mono text-[7px] text-zinc-500 flex flex-col items-end opacity-40 group-hover:opacity-90 transition-opacity">
                    <span>X: {rotateY.toFixed(1)}°</span>
                    <span>Y: {rotateX.toFixed(1)}°</span>
                  </div>
                </div>

                {/* Bottom Frame Metric Line */}
                <div 
                  className="flex justify-between font-mono text-[8px] text-zinc-600"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span className="tracking-tight">RESOLUTION_DECK: 1.000X</span>
                  <div className="flex items-center gap-1">
                    <Binary size={9} className="text-zinc-600" />
                    <span>REF_#00249_BS</span>
                  </div>
                </div>

              </div> {/* End Inner Core Deck Chassis */}
              
            </div> {/* End Interactive Guideline Matrix Wrapper */}
            
          </div>
          
        </div>
      </div>
    </section>
  );
}