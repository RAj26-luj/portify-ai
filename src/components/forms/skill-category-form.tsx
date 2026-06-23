"use client";

import { useState } from "react";
import { Loader2, Terminal, Layers } from "lucide-react";
import { createSkillCategory, updateSkillCategory } from "@/actions/skill-category";

interface SkillCategoryFormProps {
  portfolioId: string;
  category?: {
    id: string;
    name: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SkillCategoryForm({
  portfolioId,
  category,
  onSuccess,
  onCancel,
}: SkillCategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (category?.id) {
        await updateSkillCategory(category.id, {
          name,
        });
      } else {
        await createSkillCategory(portfolioId, {
          name,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit skill category structural updates:", error);
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
          <Layers size={13} className="text-blue-400" />
          <span>Skill Architecture Category Hub</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Establish or modify an analytical grouping layer (e.g. &quot;Languages&quot;,
          &quot;Full-Stack Frameworks&quot;, &quot;Robotics & Locomotion&quot;) to systematically
          partition your technological competencies array.
        </p>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Category Label Name{" "}
            <span className="text-red-400 font-sans font-bold">*(Required)</span>
          </span>
          <Terminal size={10} className="text-zinc-700 hidden sm:block" />
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Full-Stack Frameworks, Languages, Core Tech Stack"
          className={inputStyle}
          required
          disabled={loading}
        />
        <span className={descriptionStyle}>
          Provide a distinctive classification tracking title string to organize subset technical
          tokens.
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
          disabled={loading}
          className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-lg disabled:bg-blue-600/50 transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] focus:outline-none"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Syncing Component Layer...</span>
            </>
          ) : category ? (
            "Update Category"
          ) : (
            "Commit Category Node"
          )}
        </button>
      </div>
    </form>
  );
}
