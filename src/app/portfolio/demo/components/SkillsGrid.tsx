"use client";
import { useState } from "react";
import {
  Cpu,
  Binary,
  Activity,
  X,
  Sliders,
  Terminal,
} from "lucide-react";

import {
  SiCplusplus,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGo,
  SiRust,
  SiTypescript,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiPostgresql,
  SiGraphql,
  SiDocker,
  SiRedis,
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa";

interface Skill {
  name: string;
  value: number;
  tag: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  iconColor: string;
}

const initialProgramming: Skill[] = [
  { name: "C++", value: 90, tag: "CORE_SYSTEMS", icon: SiCplusplus, iconColor: "text-blue-500" },
  { name: "Java", value: 85, tag: "RUNTIME_VM", icon: FaJava, iconColor: "text-red-500" },
  { name: "Python", value: 88, tag: "AI_DATA_ENG", icon: SiPython, iconColor: "text-yellow-400" },
  { name: "TypeScript", value: 92, tag: "TYPED_JS", icon: SiTypescript, iconColor: "text-blue-400" },
  { name: "Go", value: 80, tag: "CONCURRENCY", icon: SiGo, iconColor: "text-cyan-400" },
  { name: "Rust", value: 78, tag: "MEMORY_SAFE", icon: SiRust, iconColor: "text-orange-500" },
  { name: "C#", value: 82, tag: "NET_FRAMEWORK", icon: FaAws, iconColor: "text-purple-500" },
];

const initialFrontend: Skill[] = [
  { name: "React", value: 94, tag: "VDOM_ENG", icon: SiReact, iconColor: "text-cyan-400" },
  { name: "Next.js", value: 92, tag: "SSR_PIPELINE", icon: SiNextdotjs, iconColor: "text-white" },
  { name: "Tailwind", value: 95, tag: "UTILITY_CORE", icon: SiTailwindcss, iconColor: "text-sky-400" },
  { name: "Vue.js", value: 86, tag: "REACTIVE_DOM", icon: SiVuedotjs, iconColor: "text-emerald-400" },
  { name: "Angular", value: 80, tag: "MVC_FRAMEWORK", icon: SiAngular, iconColor: "text-red-600" },
  { name: "Svelte", value: 84, tag: "COMPILER_UI", icon: SiSvelte, iconColor: "text-orange-600" },
];

const initialBackend: Skill[] = [
  { name: "Node.js", value: 88, tag: "ASYNC_I/O", icon: SiNodedotjs, iconColor: "text-green-500" },
  { name: "Express", value: 84, tag: "REST_ROUTER", icon: SiExpress, iconColor: "text-zinc-400" },
  { name: "MongoDB", value: 82, tag: "BSON_STORE", icon: SiMongodb, iconColor: "text-emerald-500" },
  { name: "PostgreSQL", value: 86, tag: "RELATIONAL_SQL", icon: SiPostgresql, iconColor: "text-blue-400" },
  { name: "GraphQL", value: 85, tag: "QUERY_LANG", icon: SiGraphql, iconColor: "text-pink-500" },
  { name: "Docker", value: 80, tag: "CONTAINER_APP", icon: SiDocker, iconColor: "text-sky-500" },
  { name: "Redis", value: 83, tag: "IN_MEMORY_CACHE", icon: SiRedis, iconColor: "text-red-500" },
  { name: "AWS", value: 78, tag: "CLOUD_INFRA", icon: FaAws, iconColor: "text-orange-400" },
];

interface SkillCardProps {
  title: string;
  skills: Skill[];
  colorClass: string;
  glowClass: string;
  bgGradient: string;
  hoverX: string;
  hoverY: string;
  onManageClick: () => void;
}

function SkillCard({
  title,
  skills,
  colorClass,
  glowClass,
  bgGradient,
  hoverX,
  hoverY,
  onManageClick,
}: SkillCardProps) {
  // Main view limits the display to the first 5 entries dynamically for aesthetic sizing
  const displaySkills = skills.slice(0, 5);

  return (
    <div 
      className="group [perspective:1200px] w-full h-full [--rx:0deg] [--ry:0deg] [--tz:0px]"
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
      <div
        className={`relative h-full flex flex-col justify-between bg-[#08080d]/90 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${glowClass}`}
        style={{
          transform: "rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz))"
        }}
      >
        <div>
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          
          <div className="flex items-center justify-between mb-8 [transform:translateZ(15px)] pointer-events-none">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
              {title}
            </h3>
            <div className={`p-2 border rounded-xl ${colorClass}`}>
              <Cpu size={14} />
            </div>
          </div>

          <div className="space-y-5 [transform:translateZ(40px)]">
            {displaySkills.map((skill) => {
              const SkillIcon = skill.icon;
              return (
                <div key={skill.name} className="group/item space-y-2 [transform-style:preserve-3d]">
                  <div className="flex justify-between items-end font-mono text-xs pointer-events-none">
                    <div className="flex items-center gap-2.5">
                      <SkillIcon size={16} className={`${skill.iconColor}`} />
                      <span className="font-bold text-zinc-200 group-hover/item:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    <span className={`font-bold ${colorClass.split(" ")[0]}`}>
                      {skill.value}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-black/50 border border-white/5 rounded-full overflow-hidden relative p-[1px]">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r
                        ${title.includes("Programming") ? "from-emerald-600 to-cyan-400" : ""}
                        ${title.includes("Frontend") ? "from-cyan-500 to-blue-500" : ""}
                        ${title.includes("Backend") ? "from-purple-500 to-indigo-500" : ""}
                      `}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-zinc-600 [transform:translateZ(15px)]">
          <div className="flex items-center gap-1">
            <Activity size={10} className="animate-pulse" />
            <span>SYS_VAL_STABLE</span>
          </div>
          
          <button
            onClick={onManageClick}
            className="flex items-center gap-1 text-zinc-400 hover:text-white uppercase tracking-wider font-bold transition-colors cursor-pointer"
          >
            <Sliders size={10} />
            <span>See All Architecture</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [manageTarget, setManageTarget] = useState<"programming" | "frontend" | "backend" | null>(null);

  const getTargetData = () => {
    if (manageTarget === "programming") return { label: "Programming Stack", total: initialProgramming };
    if (manageTarget === "frontend") return { label: "Frontend Stack", total: initialFrontend };
    if (manageTarget === "backend") return { label: "Backend Stack", total: initialBackend };
    return null;
  };

  const targetPayload = getTargetData();

  return (
    <section id="skills" className="relative py-24 bg-[#030306] overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Module Header Core */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest select-none">
            <Binary size={12} className="text-emerald-400 animate-spin-[spin_8s_linear_infinite]" />
            Core Architecture Competency Matrix
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
            Technical Matrix
          </h2>
        </div>

        {/* 3D Viewport Deck Grid Matrix */}
        <div className="grid lg:grid-cols-3 gap-8 [perspective:1200px] items-stretch">
          <SkillCard
            title="Programming Stack"
            skills={initialProgramming}
            colorClass="text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
            glowClass="hover:shadow-[0_25px_50px_rgba(16,185,129,0.12)]"
            bgGradient="from-emerald-500/10 via-transparent to-transparent"
            hoverX="8deg"
            hoverY="4deg"
            onManageClick={() => setManageTarget("programming")}
          />

          <SkillCard
            title="Frontend Stack"
            skills={initialFrontend}
            colorClass="text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
            glowClass="hover:shadow-[0_25px_50px_rgba(6,182,212,0.12)]"
            bgGradient="from-cyan-500/10 via-transparent to-transparent"
            hoverX="8deg"
            hoverY="0deg"
            onManageClick={() => setManageTarget("frontend")}
          />

          <SkillCard
            title="Backend Stack"
            skills={initialBackend}
            colorClass="text-purple-400 border-purple-500/20 bg-purple-500/5"
            glowClass="hover:shadow-[0_25px_50px_rgba(168,85,247,0.12)]"
            bgGradient="from-purple-500/10 via-transparent to-transparent"
            hoverX="8deg"
            hoverY="-4deg"
            onManageClick={() => setManageTarget("backend")}
          />
        </div>
      </div>

      {/* --- READ-ONLY METRICS DISPLAY DRAWER CONSOLE MODAL --- */}
      {targetPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#07070c] border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Top Navigation Control Frame */}
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <Sliders size={14} className="text-zinc-500" />
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                  System Viewport // <span className="text-white font-bold">{targetPayload.label}</span>
                </div>
              </div>
              <button 
                onClick={() => setManageTarget(null)}
                className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Matrix Full List Area */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-1 select-none">
                <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase block">Telemetry Logs</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Comprehensive performance and architecture parameters validated for this operational runtime environment stack.
                </p>
              </div>

              {/* Read Only Full Performance Metrics Display */}
              <div className="space-y-4 font-mono">
                {targetPayload.total.map((skill) => {
                  const SkillIcon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border bg-white/[0.02] border-white/5 rounded-xl select-none gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <SkillIcon size={18} className={skill.iconColor} />
                        <div>
                          <span className="text-xs font-bold tracking-tight text-white block">{skill.name}</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider">{skill.tag}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-1 sm:max-w-[200px]">
                        <div className="h-1 flex-1 bg-black/50 border border-white/5 rounded-full overflow-hidden p-[1px]">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r
                              ${targetPayload.label.includes("Programming") ? "from-emerald-600 to-cyan-400" : ""}
                              ${targetPayload.label.includes("Frontend") ? "from-cyan-500 to-blue-500" : ""}
                              ${targetPayload.label.includes("Backend") ? "from-purple-500 to-indigo-500" : ""}
                            `}
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 shrink-0 w-8 text-right">
                          {skill.value}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Console Control Action Footer */}
            <div className="p-4 bg-white/[0.01] border-t border-white/10 flex items-center justify-between font-mono text-[10px] select-none">
              <div className="text-zinc-500 flex items-center gap-1.5">
                <Terminal size={12} />
                <span>INDEX_COUNT: {targetPayload.total.length} TOTAL PARAMETERS</span>
              </div>
              <button
                onClick={() => setManageTarget(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider rounded-lg text-[10px] border border-white/10 transition-colors cursor-pointer"
              >
                Close Viewport
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}