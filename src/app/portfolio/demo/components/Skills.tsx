"use client";

import { Cpu, Binary, Activity } from "lucide-react";
import { 
  SiCplusplus, 
  SiPython, 
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb 
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

interface Skill {
  name: string;
  value: number;
  tag: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  iconColor: string;
}

const programming: Skill[] = [
  { name: "C++", value: 90, tag: "CORE_SYSTEMS", icon: SiCplusplus, iconColor: "group-hover/item:text-blue-500" },
  { name: "Java", value: 85, tag: "RUNTIME_VM", icon: FaJava, iconColor: "group-hover/item:text-red-500" },
  { name: "Python", value: 88, tag: "AI_DATA_ENG", icon: SiPython, iconColor: "group-hover/item:text-yellow-400" },
];

const frontend: Skill[] = [
  { name: "React", value: 94, tag: "VDOM_ENG", icon: SiReact, iconColor: "group-hover/item:text-cyan-400 animate-[spin_8s_linear_infinite]" },
  { name: "Next.js", value: 92, tag: "SSR_PIPELINE", icon: SiNextdotjs, iconColor: "group-hover/item:text-white" },
  { name: "Tailwind", value: 95, tag: "UTILITY_CORE", icon: SiTailwindcss, iconColor: "group-hover/item:text-sky-400" },
];

const backend: Skill[] = [
  { name: "Node.js", value: 88, tag: "ASYNC_I/O", icon: SiNodedotjs, iconColor: "group-hover/item:text-green-500" },
  { name: "Express", value: 84, tag: "REST_ROUTER", icon: SiExpress, iconColor: "group-hover/item:text-zinc-400" },
  { name: "MongoDB", value: 82, tag: "BSON_STORE", icon: SiMongodb, iconColor: "group-hover/item:text-emerald-500" },
];

interface SkillCardProps {
  title: string;
  skills: Skill[];
  colorClass: string;
  glowClass: string;
  bgGradient: string;
  hoverX: string; // Dynamic custom angle values passed to CSS variables
  hoverY: string;
}

function SkillCard({
  title,
  skills,
  colorClass,
  glowClass,
  bgGradient,
  hoverX,
  hoverY,
}: SkillCardProps) {
  return (
    /* --- STABLE ANCHOR CONTAINER --- */
    /* Enforces identical scaling layout boundaries across structural elements */
    <div 
      className="group [perspective:1200px] w-full h-full [--rx:0deg] [--ry:0deg] [--tz:0px]"
      style={
        {
          "--hover-rx": hoverX,
          "--hover-ry": hoverY,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.setProperty("--rx", hoverX);
        e.currentTarget.style.setProperty("--ry", hoverY);
        e.currentTarget.style.setProperty("--tz", "20px");
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
        e.currentTarget.style.setProperty("--tz", "0px");
      }}
    >
      {/* --- INNER 3D MOVING CARD CHASSIS --- */}
      {/* h-full and flex-col force cards to dynamically size to match the longest peer component */}
      <div
        className={`relative h-full flex flex-col justify-between bg-[#08080d]/90 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${glowClass}`}
        style={{
          transform: "rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz))"
        }}
      >
        <div>
          {/* Holographic Underlay Glow */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          
          {/* Framing Brackets */}
          <span className="absolute top-0 left-6 w-4 h-[1px] bg-white/5 group-hover:bg-white/20 transition-colors pointer-events-none" />
          <span className="absolute left-0 top-6 w-[1px] h-4 bg-white/5 group-hover:bg-white/20 transition-colors pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8 [transform:translateZ(15px)] select-none pointer-events-none">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
              {title}
            </h3>
            <div className={`p-2 border rounded-xl transition-all duration-300 ${colorClass}`}>
              <Cpu size={14} />
            </div>
          </div>

          {/* Telemetry Process Array Stack */}
          <div className="space-y-6 [transform:translateZ(40px)]">
            {skills.map((skill) => {
              const SkillIcon = skill.icon;
              return (
                <div key={skill.name} className="group/item space-y-2 [transform-style:preserve-3d]">
                  
                  {/* Meta Details Metric Label Row */}
                  <div className="flex justify-between items-end font-mono [transform:translateZ(10px)] select-none pointer-events-none">
                    <div className="flex items-center gap-2.5">
                      <SkillIcon size={16} className={`text-zinc-500 transition-colors duration-300 ${skill.iconColor}`} />
                      <span className="text-sm font-bold text-zinc-200 group-hover/item:text-white transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-[8px] text-zinc-600 uppercase tracking-tighter hidden sm:inline">
                        // {skill.tag}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${colorClass.split(" ")[0]} drop-shadow-[0_0_8px_currentColor]`}>
                      {skill.value}%
                    </span>
                  </div>

                  {/* Computation Progress Timeline Pipeline */}
                  <div className="h-1.5 bg-black/50 border border-white/5 rounded-full overflow-hidden relative p-[1px] [transform:translateZ(5px)] pointer-events-none">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r
                        ${title.includes("Programming") ? "from-emerald-600 to-cyan-400" : ""}
                        ${title.includes("Frontend") ? "from-cyan-500 to-blue-500" : ""}
                        ${title.includes("Backend") ? "from-purple-500 to-indigo-500" : ""}
                      `}
                      style={{
                        width: `${skill.value}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Localized System Diagnostics Footer */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-zinc-600 [transform:translateZ(15px)] select-none pointer-events-none">
          <div className="flex items-center gap-1">
            <Activity size={10} className="animate-pulse" />
            <span>SYS_VAL_OK</span>
          </div>
          <span className="uppercase tracking-wider">Node count: {skills.length}</span>
        </div>

      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 bg-[#030306] overflow-x-hidden">
      {/* Background Cartography Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Module Header Core */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest select-none">
            <Binary size={12} className="text-emerald-400 animate-spin-[spin_8s_linear_infinite]" />
            Core Architecture Competency
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Technical Matrix
          </h2>
        </div>

        {/* 3D Viewport Deck Grid Matrix */}
        {/* items-stretch forces all grid columns to stretch to the exact same max height */}
        <div className="grid lg:grid-cols-3 gap-8 [perspective:1200px] items-stretch">
          
          {/* Card 01: Programming */}
          <SkillCard
            title="Programming Stack"
            skills={programming}
            colorClass="text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
            glowClass="hover:shadow-[0_25px_50px_rgba(16,185,129,0.12)]"
            bgGradient="from-emerald-500/10 via-transparent to-transparent"
            hoverX="8deg"
            hoverY="4deg"
          />

          {/* Card 02: Frontend */}
          <SkillCard
            title="Frontend Stack"
            skills={frontend}
            colorClass="text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
            glowClass="hover:shadow-[0_25px_50px_rgba(6,182,212,0.12)]"
            bgGradient="from-cyan-500/10 via-transparent to-transparent"
            hoverX="8deg"
            hoverY="0deg"
          />

          {/* Card 03: Backend */}
          <SkillCard
            title="Backend Stack"
            skills={backend}
            colorClass="text-purple-400 border-purple-500/20 bg-purple-500/5"
            glowClass="hover:shadow-[0_25px_50px_rgba(168,85,247,0.12)]"
            bgGradient="from-purple-500/10 via-transparent to-transparent"
            hoverX="8deg"
            hoverY="-4deg"
          />
        </div>

      </div>
    </section>
  );
}