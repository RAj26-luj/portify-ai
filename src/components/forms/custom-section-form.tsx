"use client";

import { useState } from "react";
import { Loader2, AlertCircle, AlertTriangle, CheckCircle2, Type, Save } from "lucide-react";
import { updateCustomSection } from "@/actions/custom-section";

interface Props {
  sectionId: string;
  initialTitle: string;
}

export default function CustomSectionForm({
  sectionId,
  initialTitle,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  
  // High-Grade SaaS Validation & Operational Feedback states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Evaluates state delta directly against initial parameter properties
  const hasChanges = title !== initialTitle;

  async function handleSave() {
    if (loading || !hasChanges) return; // Strict Multi-click defense matrix protection

    setValidationError(null);
    setFeedback(null);

    // Form validation block
    if (!title.trim()) {
      setValidationError("Section title is highly critical and cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await updateCustomSection(sectionId, {
        title: title.trim(),
      });
      setFeedback({
        message: "Custom section naming scheme committed successfully.",
        type: "success",
      });
    } catch (err) {
      setFeedback({
        message: err instanceof Error ? err.message : "Operational backend database serialization error.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto text-zinc-200 antialiased font-sans">
      
      {/* EXPLICIT INTERACTION FEEDBACK DOCK */}
      {feedback && (
        <div className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs animate-fadeIn ${
          feedback.type === "error" 
            ? "border-red-500/10 bg-red-500/5 text-red-400" 
            : "border-emerald-500/10 bg-emerald-500/5 text-emerald-400"
        }`}>
          {feedback.type === "error" ? (
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
          )}
          <span className="font-medium leading-relaxed">{feedback.message}</span>
        </div>
      )}

      {/* INPUT CONTAINER CLUSTER */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 select-none">
          <Type className="w-3.5 h-3.5 text-zinc-500" />
          <span>
            Custom Section Title <span className="text-red-400">*</span>
            {hasChanges && (
              <span className="ml-2 text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1.5 py-0.5 rounded">
                unsaved_changes
              </span>
            )}
          </span>
        </label>
        
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError(null);
          }}
          disabled={loading}
          placeholder="e.g. Research Publications, Side Hustles, Open Source"
          className={`w-full text-xs px-3 py-2 bg-zinc-900 border ${
            validationError ? "border-red-500/50 focus:border-red-500" : "border-zinc-800 focus:border-zinc-700"
          } rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition disabled:opacity-50`}
        />
        
        <p className="text-[10px] text-zinc-500 leading-relaxed font-sans mt-1">
          This title represents the visual header tag deployed onto your public template canvas structure.
        </p>

        {validationError && (
          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <AlertCircle className="w-3 h-3 shrink-0" /> {validationError}
          </p>
        )}
      </div>

      {/* ACTION BLOCK DOCK LAYER */}
      <div className="flex items-center justify-end pt-2 border-t border-zinc-900/60">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !hasChanges}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-4 text-xs font-bold shadow-sm transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed select-none font-sans"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          <span>
            {loading ? "Committing Updates..." : !hasChanges ? "No Changes Detected" : "Save Modifications"}
          </span>
        </button>
      </div>

    </div>
  );
}