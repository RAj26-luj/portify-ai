"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Layers,
  Image as ImageIcon
} from "lucide-react";

interface ProjectMetricCardProps {
  metric: {
    id: string;
    label: string;
    value: string;
    description?: string;
    displayOrder: number;
    hasCustomImage?: boolean; // Evaluates graphical indicator status
  };
  onView?: (id: string) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function ProjectMetricCard({
  metric,
  onView,
  onDelete,
}: ProjectMetricCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasCustomImage = Boolean(metric.hasCustomImage);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(metric.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove metric track. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    /* Note: Added h-full to make card heights uniform across grid rows based on the tallest sibling */
    <div className="group/metric-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] w-full max-w-sm mx-auto h-full">
      
      {/* Structural Metric Display Fields Layer - Transformed to full flex stack to support height distribution */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-start">
        <div className="flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block font-mono">
              KPI Parameter Track
            </span>
            <h3 className="font-bold text-zinc-200 text-sm tracking-tight truncate group-hover/metric-card:text-white transition-colors">
              {metric.label}
            </h3>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-colors group-hover/metric-card:text-blue-400 shadow-inner">
            <TrendingUp size={14} />
          </div>
        </div>

        {/* Dynamic Visual Content Optimization Recommendation Prompt */}
        {!hasCustomImage && (
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 shrink-0">
            <ImageIcon size={12} className="shrink-0 text-blue-400" />
            <span className="truncate">We recommend linking a custom icon asset for specialized visibility</span>
          </div>
        )}

        {/* Primary Large Highlight Metric Data Node */}
        <div className="inline-flex items-baseline rounded-xl border border-zinc-900 bg-zinc-900/20 px-3.5 py-2 shrink-0 w-fit">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono selection:bg-blue-500/30">
            {metric.value}
          </span>
        </div>

        {/* Narrative Description Block */}
        {metric.description && (
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans line-clamp-2 pl-0.5">
            {metric.description}
          </p>
        )}

        {/* Order Identifier Tag line - Pushed to the bottom of the container body element to align cleanly */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono font-medium pl-0.5 pt-0.5 mt-auto">
          <Layers size={11} className="text-zinc-700" />
          <span>Matrix Array Display Order: {metric.displayOrder}</span>
        </div>
      </div>

      {/* Control Actions & Operational Errors Management Interface Base Dock */}
      <div className="mt-4 shrink-0">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={12} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2 animate-fadeIn">
            <p className="text-[11px] font-medium text-zinc-400 px-1 text-center">Confirm metric record removal?</p>
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
          <div className="flex gap-2 border-t border-zinc-900 pt-3">
            <button
              type="button"
              onClick={() => onView?.(metric.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none select-none"
            >
              <Edit3 size={12} className="text-zinc-500" />
              <span>Modify</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none"
              title="Delete Metric"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}