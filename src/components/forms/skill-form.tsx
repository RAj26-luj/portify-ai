"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Terminal,
  Layers,
  Globe,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skill";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import { getSkillCategories } from "@/actions/skill-category";

type SkillFormProps = {
  initialData?: {
    id?: string;
    name?: string;
    proficiency?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    yearsOfExperience?: number;
    iconName?: string;
    iconUrl?: string;
    description?: string;
    tag?: string;
    categoryId?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

type Category = {
  id: string;
  name: string;
};

export default function SkillForm({ initialData, onSuccess, onCancel }: SkillFormProps) {
  const [loading, setLoading] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState(initialData?.name || "");
  const [proficiency, setProficiency] = useState(initialData?.proficiency || "BEGINNER");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">(
    initialData?.yearsOfExperience ?? ""
  );
  const [iconUrl, setIconUrl] = useState(initialData?.iconUrl || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tag, setTag] = useState(initialData?.tag || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");

  const [hasChanges, setHasChanges] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [mobileConfirmDelete, setMobileConfirmDelete] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const pId = await getPortfolioId();
        const result = await getSkillCategories(pId);

        if (!result.success) {
          setCategories([]);
          return;
        }

        setCategories(
          result.data.map((category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const isNameChanged = name.trim() !== (initialData?.name || "");
    const isProficiencyChanged = proficiency !== (initialData?.proficiency || "BEGINNER");
    const isExperienceChanged =
      (yearsOfExperience === "" ? undefined : Number(yearsOfExperience)) !==
      initialData?.yearsOfExperience;
    const isIconUrlChanged = iconUrl.trim() !== (initialData?.iconUrl || "");
    const isDescriptionChanged = description.trim() !== (initialData?.description || "");
    const isTagChanged = tag.trim() !== (initialData?.tag || "");
    const isCategoryChanged = categoryId !== (initialData?.categoryId || "");

    setHasChanges(
      isNameChanged ||
        isProficiencyChanged ||
        isExperienceChanged ||
        isIconUrlChanged ||
        isDescriptionChanged ||
        isTagChanged ||
        isCategoryChanged
    );
  }, [name, proficiency, yearsOfExperience, iconUrl, description, tag, categoryId, initialData]);

  const isNameInvalid = name.trim() === "";
  const isExperienceInvalid = yearsOfExperience !== "" && Number(yearsOfExperience) < 0;
  const isFormInvalid = isNameInvalid || isExperienceInvalid;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;

    try {
      setLoading(true);
      const activePortfolioId = await getPortfolioId();

      const payload = {
        portfolioId: activePortfolioId,
        name: name.trim(),
        proficiency: proficiency as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
        yearsOfExperience: yearsOfExperience !== "" ? Number(yearsOfExperience) : undefined,
        iconUrl: iconUrl.trim() || undefined,
        description: description.trim() || undefined,
        tag: tag.trim() || undefined,
        categoryId: categoryId || undefined,
      };

      if (initialData?.id) {
        await updateSkill(initialData.id, payload);
      } else {
        await createSkill(payload);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit skill updates:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAbsolutePurge() {
    if (!initialData?.id || processingDelete) return;
    try {
      setProcessingDelete(true);
      await deleteSkill(initialData.id);
      onSuccess?.();
    } catch (err) {
      console.error("Purge failure:", err);
    } finally {
      setProcessingDelete(false);
      setMobileConfirmDelete(false);
    }
  }

  const inputStyle =
    "w-full rounded-lg border border-white/5 bg-[#0A0A0B] p-2.5 sm:p-3 text-zinc-200 placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] transition-all duration-200 shadow-inner font-sans disabled:opacity-40";
  const labelStyle =
    "mb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 transition-colors";
  const scrapeRecommendationStyle =
    "text-[9px] sm:text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 mt-1 leading-normal flex items-start gap-1.5";

  return (
    <form
      onSubmit={handleSave}
      className="space-y-4 sm:space-y-6 text-zinc-300 bg-[#0C0C0E] p-4 sm:p-6 rounded-none sm:rounded-xl max-w-full font-sans select-none selection:bg-blue-500/30 selection:text-white"
    >
      <div className="bg-[#121214] border border-white/5 rounded-lg p-3 sm:p-4 mb-1">
        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Layers size={13} className="text-blue-400" />
          <span>Competency Parameter Registration Node</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Register technology skills to your portfolio grid matrix.
        </p>
      </div>

      <div className="space-y-1">
        <label className={labelStyle}>
          <span>
            Technology Name <span className="text-red-400">*(Required)</span>
          </span>
          <div className="flex items-center gap-1.5">
            {isTouched && isNameInvalid ? (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                <AlertCircle size={9} /> parameter_missing
              </span>
            ) : name.trim() ? (
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                <CheckCircle2 size={9} /> valid_string
              </span>
            ) : null}
            {hasChanges && (
              <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold">
                edited
              </span>
            )}
            <Terminal size={10} className="text-zinc-700 hidden sm:block" />
          </div>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="e.g., React.js"
          className={`${inputStyle} ${isTouched && isNameInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          disabled={loading}
        />
        {isTouched && isNameInvalid && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
            ⚠️ Field absolute constraint broken: String mapping value cannot be empty.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelStyle}>
            <span>
              Proficiency Tier <span className="text-red-400">*(Required)</span>
            </span>
          </label>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value as any)}
            className={inputStyle}
            disabled={loading}
          >
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
            <option value="EXPERT">EXPERT</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>
            <span>Experience (Years)</span>
            {isTouched && isExperienceInvalid && (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                <AlertCircle size={9} /> negative_bound
              </span>
            )}
          </label>
          <input
            type="number"
            value={yearsOfExperience}
            onChange={(e) =>
              setYearsOfExperience(e.target.value === "" ? "" : Number(e.target.value))
            }
            onBlur={() => setIsTouched(true)}
            className={`${inputStyle} ${isTouched && isExperienceInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          />
          {isTouched && isExperienceInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Arithmetic failure: Chronological timeline cannot span negative bounds.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelStyle}>
          Icon Image URL <span className="text-zinc-600 italic">*(Optional)</span>
        </label>
        <div className={scrapeRecommendationStyle}>
          <Globe size={11} className="shrink-0 mt-0.5" />
          <span>
            <strong>Icon Protocol:</strong> Search for your technology logo on{" "}
            <strong>Google Images</strong>. Right-click the image and select{" "}
            <strong>"Copy Image Address"</strong>. Paste that link here.
            <em> If left empty, your portfolio will display a default icon based on your theme.</em>
          </span>
        </div>
        <input
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="https://example.com/logo.png"
          className={inputStyle}
          disabled={loading}
        />
        {iconUrl && (
          <div className="mt-2 p-1 bg-zinc-950 border border-white/5 rounded w-fit">
            <img src={iconUrl} alt="Preview" className="w-10 h-10 object-contain p-1 opacity-80" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className={labelStyle}>Capability Summary</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputStyle} resize-none`}
          disabled={loading}
          placeholder="Describe your experience or specialization inside this framework/tool ecosystem..."
        />
      </div>

      {mobileConfirmDelete && (
        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 flex items-start gap-2.5 animate-fadeIn">
          <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-[11px] font-mono text-zinc-300 leading-normal">
              <strong>WARNING // UNRECOVERABLE ACTION:</strong> You are about to wipe this skill
              node entry out of the configuration database layer. Proceed?
            </p>
            <div className="flex gap-2 text-[10px] font-mono uppercase tracking-wider font-bold">
              <button
                type="button"
                onClick={handleAbsolutePurge}
                disabled={processingDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
              >
                {processingDelete ? <Loader2 size={11} className="animate-spin" /> : null}
                Confirm Destroy
              </button>
              <button
                type="button"
                onClick={() => setMobileConfirmDelete(false)}
                className="bg-zinc-850 hover:bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded transition-colors"
              >
                Abort Action
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || processingDelete}
            className="w-full sm:flex-1 bg-[#121214] hover:bg-[#161619] transition-colors border border-white/5 text-zinc-400 py-3 rounded-lg"
          >
            Cancel
          </button>
        )}
        {initialData?.id && !mobileConfirmDelete && (
          <button
            type="button"
            onClick={() => setMobileConfirmDelete(true)}
            className="w-full sm:flex-1 bg-red-955/20 hover:bg-red-900/20 text-red-400 py-3 rounded-lg border border-red-900/10 transition-colors"
          >
            Purge Node
          </button>
        )}
        <button
          type="submit"
          disabled={
            loading ||
            processingDelete ||
            isFormInvalid ||
            (!hasChanges && initialData?.id !== undefined)
          }
          className="w-full sm:flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all duration-200 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Syncing Node Layer...</span>
            </>
          ) : !hasChanges && initialData?.id !== undefined ? (
            "No Changes Detected"
          ) : initialData?.id ? (
            "Update Skill"
          ) : (
            "Publish Skill"
          )}
        </button>
      </div>
    </form>
  );
}
