"use client";

import React, { useState } from "react";
import { 
  FolderHeart, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Layers,
  Sparkles
} from "lucide-react";

interface SkillCategoryCardProps {
  category: {
    id: string;
    name: string;
    displayOrder: number;
    skills?: {
      id: string;
      name: string;
    }[];
  };
  onView?: (id: string) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function SkillCategoryCard({
  category,
  onView,
  onDelete,
}: SkillCategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(category.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove skill category. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group/category-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] w-full max-w-sm mx-auto">
      
      <div className="space-y-4">
        {/* Header Branding Module */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block font-mono">
              Taxonomy Classification
            </span>
            <h3 className="font-bold text-zinc-200 text-sm sm:text-base tracking-tight truncate group-hover/category-card:text-white transition-colors">
              {category.name}
            </h3>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-colors group-hover/category-card:text-blue-400 shadow-inner">
            <FolderHeart size={14} />
          </div>
        </div>

        {/* Unified Meta Information Counters */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono font-medium">
          <div className="flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 border border-zinc-800 text-zinc-400">
            <Layers size={11} className="text-zinc-600" />
            <span>Display Sequence: {category.displayOrder}</span>
          </div>
          
          <div className="flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 border border-zinc-800 text-zinc-400">
            <Sparkles size={11} className="text-zinc-600" />
            <span>Total Entities: {category.skills?.length ?? 0}</span>
          </div>
        </div>

        {/* Embedded Children Token Badges Map Layer */}
        {category.skills && category.skills.length > 0 ? (
          <div className="space-y-2 border-t border-zinc-900/80 pt-3">
            <div className="flex flex-wrap gap-1.5 pl-0.5">
              {category.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center rounded bg-zinc-900/30 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-800/80 shadow-sm transition-colors group-hover/category-card:text-zinc-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs italic text-zinc-600 pl-0.5 pt-1">
            No technical skills cataloged inside this branch context.
          </p>
        )}
      </div>

      {/* Control Actions & Operational Error Management Interface Base Dock */}
      <div className="mt-5">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={12} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2 animate-fadeIn">
            <p className="text-[11px] font-medium text-zinc-400 px-1 text-center">Confirm dropping index architecture branch?</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1 text-xs font-medium shadow-sm transition-colors focus:outline-none select-none"
              >
                {isDeleting ? <Loader2 size={11} className="animate-spin" /> : null}
                <span>{isDeleting ? "Purging..." : "Yes, Purge"}</span>
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 py-1 text-xs font-medium transition-colors focus:outline-none select-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 border-t border-zinc-900 pt-3.5">
            <button
              type="button"
              onClick={() => onView?.(category.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none select-none"
            >
              <Edit3 size={11} className="text-zinc-500" />
              <span>Modify</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none"
              title="Delete Skill Category"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}