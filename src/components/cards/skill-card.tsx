"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Award,
  Zap,
  Tag,
  Image as ImageIcon,
  Code2,
  Terminal,
  Layers,
  Database,
  Globe
} from "lucide-react";
import { deleteSkill } from "@/actions/skill";

interface Props {
  id?: string;
  name: string;
  proficiency?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsOfExperience?: number;
  iconName?: string;
  iconUrl?: string;
  description?: string;
  tag?: string;
  categoryName?: string;
  categoryId?: string;

  onRefresh?: () => void;
  onEditClick?: () => void; 
}

export default function SkillCard({
  id,
  name,
  proficiency,
  yearsOfExperience,
  iconUrl,
  description,
  tag,
  categoryName,
  onEditClick,
  onRefresh,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasCustomLogo = Boolean(iconUrl?.trim());

  const getDynamicFallbackIcon = () => {
    const checkString = `${name} ${categoryName || ""}`.toLowerCase();
    
    if (checkString.includes("db") || checkString.includes("sql") || checkString.includes("data")) {
      return <Database size={16} className="sm:w-[18px] sm:h-[18px] text-blue-400" />;
    }
    if (checkString.includes("web") || checkString.includes("front") || checkString.includes("api") || checkString.includes("cloud")) {
      return <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />;
    }
    if (checkString.includes("script") || checkString.includes("code") || checkString.includes("lang")) {
      return <Code2 size={16} className="sm:w-[18px] sm:h-[18px] text-purple-400" />;
    }
    if (checkString.includes("style") || checkString.includes("design") || checkString.includes("css")) {
      return <Layers size={16} className="sm:w-[18px] sm:h-[18px] text-pink-400" />;
    }
    if (checkString.includes("devops") || checkString.includes("linux") || checkString.includes("bash")) {
      return <Terminal size={16} className="sm:w-[18px] sm:h-[18px] text-amber-400" />;
    }
    
    const alternatingIndex = name.length % 3;
    if (alternatingIndex === 1) return <Code2 size={16} className="sm:w-[18px] sm:h-[18px] text-blue-400/80" />;
    if (alternatingIndex === 2) return <Terminal size={16} className="sm:w-[18px] sm:h-[18px] text-zinc-400" />;
    return <Cpu size={16} className="sm:w-[18px] sm:h-[18px] text-purple-400/80" />;
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await deleteSkill(id);
      onRefresh?.();
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove skill entry.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getProficiencyStyle = (level?: string) => {
    switch (level?.toUpperCase()) {
      case "EXPERT":
        return "border-purple-500/20 bg-purple-500/10 text-purple-400";
      case "ADVANCED":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";
      case "INTERMEDIATE":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      default:
        return "border-zinc-800 bg-zinc-900 text-zinc-400";
    }
  };

  return (
    /* Note: Applied h-full wrapper targeting consistent matching sizes based on the largest card contents */
    <div className="group/skill-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-5 shadow-sm transition-all duration-300 sm:hover:-translate-y-[2px] sm:hover:border-zinc-700 sm:hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] w-full max-w-sm mx-auto h-full">
      
      {/* Container wrapper configured with flex-1 ensures inner content blocks distribute uniformly to push footer low */}
      <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-start">
        {/* Core Header Brand Architecture */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {hasCustomLogo ? (
              <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 sm:p-2 flex items-center justify-center shadow-inner transition-colors group-hover/skill-card:border-zinc-700">
                <img
                  src={iconUrl!.trim()}
                  alt={`${name} icon`}
                  className="h-full w-full object-contain rounded-md"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-md transition-all duration-300 group-hover/skill-card:border-zinc-700">
                {getDynamicFallbackIcon()}
              </div>
            )}
            
            <div className="min-w-0">
              <h3 className="font-bold text-zinc-100 text-xs sm:text-base tracking-tight truncate group-hover/skill-card:text-white transition-colors">
                {name}
              </h3>
              {categoryName && (
                <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mt-0.5 truncate">
                  {categoryName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Optimization Prompt - Hidden on mobile to clean up layout cards density rules */}
        {!hasCustomLogo && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 animate-fadeIn select-none shrink-0">
            <ImageIcon size={12} className="shrink-0 text-blue-400" />
            <span className="truncate">Assign vector logo file for cleaner indexing</span>
          </div>
        )}

        {/* Technical Competency Matrix Badge Row */}
        {(proficiency || yearsOfExperience !== undefined || tag) && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono shrink-0">
            {proficiency && (
              <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-semibold ${getProficiencyStyle(proficiency)}`}>
                <Zap size={9} className="shrink-0 sm:w-[10px] sm:h-[10px]" />
                <span>{proficiency}</span>
              </span>
            )}

            {yearsOfExperience !== undefined && (
              <span className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-semibold text-zinc-300">
                <Award size={9} className="text-zinc-500 shrink-0 sm:w-[10px] sm:h-[10px]" />
                <span>{yearsOfExperience}y exp</span>
              </span>
            )}

            {tag && (
              <span className="inline-flex items-center gap-1 rounded border border-zinc-800/60 bg-zinc-900/20 px-1.5 py-0.5 font-medium text-zinc-500 max-w-[80px] truncate">
                <span>#{tag}</span>
              </span>
            )}
          </div>
        )}

        {/* Mobile descriptive text container override block - set with mt-auto context to absorb baseline variation */}
        {description && (
          <p className="text-[11px] sm:text-sm leading-relaxed text-zinc-400 font-sans line-clamp-2 sm:line-clamp-3 border-t border-zinc-900/80 pt-2 sm:pt-3 pl-0.5 xs-compact-desc mt-auto">
            {description}
          </p>
        )}
      </div>

      {/* Control Action Hub Configuration Footer Dock */}
      <div className="mt-3 sm:mt-4 shrink-0">
        {errorFeedback && (
          <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-red-500/10 bg-red-500/5 p-1.5 text-[10px] sm:text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 animate-fadeIn">
            <p className="text-[10px] font-medium text-zinc-500 px-1 text-center">Purge entry matrix?</p>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1 text-[11px] font-medium shadow-sm transition-colors select-none"
              >
                {isDeleting ? <Loader2 size={10} className="animate-spin" /> : null}
                <span>Confirm</span>
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 py-1 text-[11px] font-medium text-zinc-400 transition-colors select-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-1.5 border-t border-zinc-900 pt-2.5 sm:pt-3.5">
            <button
              type="button"
              onClick={onEditClick}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium transition-colors shadow-sm select-none"
            >
              <Edit3 size={10} className="text-zinc-500 sm:w-[11px] sm:h-[11px]" />
              <span>Modify</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none shrink-0"
            >
              <Trash2 size={11} className="sm:w-[12px] sm:h-[12px]" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}