"use client";

import { useState, useEffect } from "react";
import { Loader2, Terminal, BarChart4, AlertCircle, CheckCircle2 } from "lucide-react";
import { createProjectMetric, updateProjectMetric } from "@/actions/project-metric";

interface ProjectMetricFormProps {
  projectId: string;
  metric?: {
    id: string;
    label: string;
    value: string;
    description?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectMetricForm({
  projectId,
  metric,
  onSuccess,
  onCancel,
}: ProjectMetricFormProps) {
  const [label, setLabel] = useState(metric?.label ?? "");
  const [value, setValue] = useState(metric?.value ?? "");
  const [description, setDescription] = useState(metric?.description ?? "");
  const [loading, setLoading] = useState(false);

  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isLabelChanged = label !== (metric?.label ?? "");
    const isValueChanged = value !== (metric?.value ?? "");
    const isDescChanged = description !== (metric?.description ?? "");

    setHasChanges(isLabelChanged || isValueChanged || isDescChanged);
  }, [label, value, description, metric]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (!label.trim() || !value.trim()) return;
    if (!hasChanges && metric?.id !== undefined) return;
    setLoading(true);

    try {
      if (metric?.id) {
        await updateProjectMetric(metric.id, {
          label: label.trim(),
          value: value.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createProjectMetric(projectId, {
          label: label.trim(),
          value: value.trim(),
          description: description.trim() || undefined,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit project metric changes:", error);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-lg border border-white/5 bg-[#0A0A0B] p-2.5 sm:p-3 text-zinc-200 placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] transition-all duration-200 disabled:opacity-40 shadow-inner font-sans";

  const labelStyle =
    "mb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 group-hover/input:text-zinc-300 transition-colors";

  const descriptionStyle =
    "text-[10px] sm:text-xs text-zinc-500 font-sans leading-normal block mt-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5 text-zinc-300 bg-[#0C0C0E] p-4 sm:p-6 rounded-xl border border-white/10 max-w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans select-none"
    >
      <div className="bg-[#121214] border border-white/5 rounded-lg p-3 sm:p-4 mb-1">
        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <BarChart4 size={13} className="text-blue-400" />
          <span>Project Analytical Telemetry Metrics</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Log precise impact validation statistics (e.g. &quot;40% latency reduction&quot; or
          &quot;300+ algorithmic problems solved&quot;) to back up your core engineering
          accomplishments.
        </p>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Metric Key Label <span className="text-red-400 font-sans font-bold">*(Required)</span>
          </span>
          <div className="flex items-center gap-1">
            {isTouched && !label.trim() ? (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                <AlertCircle size={9} /> missing_label
              </span>
            ) : label.trim() ? (
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                <CheckCircle2 size={9} /> key_set
              </span>
            ) : null}
            {hasChanges && (
              <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">
                edited
              </span>
            )}
            <Terminal size={10} className="text-zinc-700 hidden sm:block" />
          </div>
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="e.g. Latency Reduction, Global Rank, Problems Solved"
          className={`${inputStyle} ${isTouched && !label.trim() ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          required
          disabled={loading}
        />
        {isTouched && !label.trim() && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
            ⚠️ Field missing: Telemetry tracker parameter key name required.
          </p>
        )}
        <span className={descriptionStyle}>
          The diagnostic structural keyword title for this tracking node.
        </span>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Telemetry Value Token{" "}
            <span className="text-red-400 font-sans font-bold">*(Required)</span>
          </span>
          <div className="flex items-center gap-1">
            {isTouched && !value.trim() ? (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                <AlertCircle size={9} /> missing_value
              </span>
            ) : value.trim() ? (
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                <CheckCircle2 size={9} /> token_ready
              </span>
            ) : null}
          </div>
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="e.g. 40%, #24,748, 300+"
          className={`${inputStyle} ${isTouched && !value.trim() ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          required
          disabled={loading}
        />
        {isTouched && !value.trim() && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
            ⚠️ Field missing: Numeric scale or outcome rank tracking value string required.
          </p>
        )}
        <span className={descriptionStyle}>
          The numeric scale scalar, scalar percentage, or rating rank outcome parameter.
        </span>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Impact Analytics Description{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detail the target calculation constraints, performance optimization profiles, or platform audit parameters..."
          rows={3}
          className={`${inputStyle} resize-none`}
          disabled={loading}
        />
        <span className={descriptionStyle}>
          Provide context explaining how you benchmarked and parsed this dataset outcome layer.
        </span>
      </div>

      <div className="flex gap-2.5 pt-2 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white py-2.5 px-4 rounded-lg transition-colors border border-white/5 focus:outline-none"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || (!hasChanges && metric?.id !== undefined)}
          className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all duration-200 focus:outline-none"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Syncing Metric Telemetry...</span>
            </>
          ) : !hasChanges && metric?.id !== undefined ? (
            "No Changes Detected"
          ) : metric ? (
            "Update Metric"
          ) : (
            "Commit Metric Node"
          )}
        </button>
      </div>
    </form>
  );
}
