"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Sliders,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  Info,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  GripVertical,
  X,
} from "lucide-react";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import {
  getSectionSettings,
  updateSectionSetting,
  reorderSectionSettings,
  resetSectionSettings,
} from "@/actions/section-setting";
import { getCustomSections, updateCustomSection } from "@/actions/custom-section";

type SectionSetting = {
  id: string;
  sectionKey: string;
  title?: string;
  isEnabled: boolean;
  mandatory: boolean;
  displayOrder: number;
};

const LOCKED_SECTIONS = ["hero", "about", "contact"];

export default function SectionSettingsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [settings, setSettings] = useState<SectionSetting[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  async function loadSettings() {
    try {
      setLoading(true);
      setError(null);

      const pid = await getPortfolioId();

      if (!pid) {
        throw new Error("Active portfolio specifications tracing vector was not resolved.");
      }
      setPortfolioId(pid);

      const settingsResult = await getSectionSettings(pid);
      const customSectionsResult = await getCustomSections(pid);

      if (
        !settingsResult ||
        !settingsResult.success ||
        !("data" in settingsResult) ||
        !Array.isArray(settingsResult.data)
      ) {
        throw new Error(
          "error" in settingsResult && typeof settingsResult.error === "string"
            ? settingsResult.error
            : "Failed compiling default section layouts."
        );
      }

      if (
        !customSectionsResult ||
        !customSectionsResult.success ||
        !("data" in customSectionsResult) ||
        !Array.isArray(customSectionsResult.data)
      ) {
        throw new Error(
          "error" in customSectionsResult && typeof customSectionsResult.error === "string"
            ? customSectionsResult.error
            : "Failed compiling custom user layers."
        );
      }

      const unique = new Map<string, SectionSetting>();

      settingsResult.data.forEach((item: any) => {
        const key = item.sectionKey.toLowerCase();
        if (
          key === "theme" ||
          key === "resume" ||
          key === "customsections" ||
          key === "custom-sections"
        ) {
          return;
        }
        unique.set(item.sectionKey, {
          id: item.id,
          sectionKey: item.sectionKey,
          isEnabled: !!item.isEnabled,
          mandatory: !!item.mandatory,
          displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : 0,
          title: item.title ?? undefined,
        });
      });

      const items = Array.from(unique.values());

      const customSectionSettings: SectionSetting[] = customSectionsResult.data.map(
        (section: any) => ({
          id: `custom-${section.id}`,
          sectionKey: `custom_${section.id}`,
          title: section.title,
          isEnabled: !!section.isVisible,
          mandatory: false,
          displayOrder: typeof section.displayOrder === "number" ? section.displayOrder : 0,
        })
      );

      const hero = items.find((x) => x.sectionKey.toLowerCase() === "hero");
      const about = items.find((x) => x.sectionKey.toLowerCase() === "about");
      const contact = items.find((x) => x.sectionKey.toLowerCase() === "contact");
      const experience = items.find((x) => x.sectionKey.toLowerCase() === "experience");
      const education = items.find((x) => x.sectionKey.toLowerCase() === "education");

      const normalSections = items.filter((x) => {
        const key = x.sectionKey.toLowerCase();
        return ![
          "hero",
          "about",
          "contact",
          "experience",
          "education",
          "customsections",
          "custom-sections",
        ].includes(key);
      });

      const middle = [
        ...normalSections.sort((a, b) => a.displayOrder - b.displayOrder),
        ...customSectionSettings.sort((a, b) => a.displayOrder - b.displayOrder),
      ];

      const ordered = [hero, about, experience, education, ...middle, contact].filter(
        Boolean
      ) as SectionSetting[];

      if (ordered.length === 0) {
        const resetResult = await resetSectionSettings(pid);

        if (!resetResult.success) {
          throw new Error(
            "error" in resetResult && typeof resetResult.error === "string"
              ? resetResult.error
              : "Failed running template reset triggers."
          );
        }

        const refreshedResult = await getSectionSettings(pid);

        if (
          !refreshedResult.success ||
          !("data" in refreshedResult) ||
          !Array.isArray(refreshedResult.data)
        ) {
          throw new Error(
            "error" in refreshedResult && typeof refreshedResult.error === "string"
              ? refreshedResult.error
              : "Failed pulling data layers."
          );
        }

        setSettings(
          refreshedResult.data.map((item: any) => ({
            id: item.id,
            sectionKey: item.sectionKey,
            isEnabled: !!item.isEnabled,
            mandatory: !!item.mandatory,
            displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : 0,
            title: item.title ?? undefined,
          }))
        );
        return;
      }

      setSettings(ordered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading layout orchestration logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, [username]);

  async function handleResetToDefault() {
    if (!portfolioId || saving) return;

    try {
      setSaving(true);
      setError(null);
      const resetResult = await resetSectionSettings(portfolioId);

      if (!resetResult.success) {
        throw new Error(
          "error" in resetResult && typeof resetResult.error === "string"
            ? resetResult.error
            : "Failed layout reset operation."
        );
      }

      setShowResetConfirm(false);
      await loadSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset pipeline mutation exception");
    } finally {
      setSaving(false);
    }
  }

  async function toggleSection(setting: SectionSetting) {
    if (saving) return;

    if (setting.sectionKey.startsWith("custom_")) {
      const customSectionId = setting.sectionKey.replace("custom_", "");
      try {
        setSaving(true);
        const result = await updateCustomSection(customSectionId, {
          isVisible: !setting.isEnabled,
        });

        if (!result.success) {
          throw new Error(
            "error" in result && typeof result.error === "string"
              ? result.error
              : "Custom tier modification dropped."
          );
        }

        setSettings((prev) =>
          prev.map((item) =>
            item.id === setting.id ? { ...item, isEnabled: !item.isEnabled } : item
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle custom section layer.");
      } finally {
        setSaving(false);
      }
      return;
    }

    const key = setting.sectionKey.toLowerCase();
    if (LOCKED_SECTIONS.includes(key)) return;

    try {
      setSaving(true);
      const result = await updateSectionSetting(setting.id, {
        isEnabled: !setting.isEnabled,
      });

      if (!result.success) {
        throw new Error(
          "error" in result && typeof result.error === "string"
            ? result.error
            : "Core tracking tier modification dropped."
        );
      }

      setSettings((prev) =>
        prev.map((item) =>
          item.id === setting.id ? { ...item, isEnabled: !item.isEnabled } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle core layout tier.");
    } finally {
      setSaving(false);
    }
  }

  async function moveUp(index: number) {
    if (index <= 2 || saving) return;
    const updated = [...settings];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSettings(updated);
    await saveOrder(updated);
  }

  async function moveDown(index: number) {
    const contactIndex = settings.findIndex((s) => s.sectionKey.toLowerCase() === "contact");
    if (index >= contactIndex - 1 || saving) return;
    const updated = [...settings];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setSettings(updated);
    await saveOrder(updated);
  }

  async function saveOrder(items: SectionSetting[]) {
    if (!portfolioId) return;
    try {
      setSaving(true);
      const reorderResult = await reorderSectionSettings(
        portfolioId,
        items.filter((item) => item.sectionKey !== "education").map((item) => item.id)
      );

      if (!reorderResult.success) {
        throw new Error(
          "error" in reorderResult && typeof reorderResult.error === "string"
            ? reorderResult.error
            : "Reorder sequence rejected."
        );
      }

      const customUpdates = items
        .map((item, idx) => {
          if (item.sectionKey.startsWith("custom_")) {
            const customId = item.sectionKey.replace("custom_", "");
            return updateCustomSection(customId, { displayOrder: idx });
          }
          return null;
        })
        .filter(Boolean);

      if (customUpdates.length > 0) {
        const customResults = await Promise.all(customUpdates);
        const customFailed = customResults.find((r) => r && !r.success);
        if (customFailed) {
          throw new Error(
            "error" in customFailed && typeof customFailed.error === "string"
              ? customFailed.error
              : "Sub-ordering elements mapping crashed."
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving updated layout order stack.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">
          // Synchronizing structural section nodes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white">
        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            Configuration Integration Sync Failure
          </h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed">{error}</p>
          <button
            onClick={loadSettings}
            className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-[11px] font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  const contactIndex = settings.findIndex((s) => s.sectionKey.toLowerCase() === "contact");

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-4xl mx-auto font-sans antialiased px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm shrink-0">
              <Sliders size={14} className="sm:w-[15px] sm:h-[15px]" />
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-zinc-100">
              Section Orchestrator
            </h1>
            {saving && <RefreshCw className="w-3 h-3 animate-spin text-zinc-500 mt-0.5" />}
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-normal">
            Arrange your portfolio workspace elements to align layout sections matching your
            personal preferences.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto border-t border-zinc-900/50 sm:border-t-0 pt-3 sm:pt-0">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-zinc-500">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
            >
              <List size={13} />
            </button>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={saving}
              className="px-2.5 py-1.5 sm:px-3.5 rounded-lg border border-zinc-900/40 hover:bg-zinc-800 text-[11px] sm:text-xs font-semibold text-zinc-300 transition-all active:scale-[0.98] disabled:opacity-40 select-none"
            >
              Reset Order
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 rounded-lg p-0.5 animate-fadeIn">
              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={saving}
                className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-[11px] transition-all select-none tracking-wide uppercase shadow-sm"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
                className="p-1 sm:p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900/40 to-transparent p-3 sm:p-4 flex gap-2.5 sm:gap-3.5 items-start">
        <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-[11px] sm:text-xs">
          <p className="font-bold tracking-wide text-zinc-200">Visibility Constraints</p>
          <p className="text-zinc-500 leading-relaxed font-sans hidden sm:block">
            The section layout architecture has some mandatory sections that cannot be changed,
            disabled, or deleted (
            <strong className="text-zinc-400 italic">
              Hero Banner, About Narrative, and Contact Inbound Nodes
            </strong>
            ). These remain completely locked down to keep portfolio template navigation functional.
          </p>
          <p className="text-zinc-500 leading-normal font-sans sm:hidden">
            Core sections (<span className="text-zinc-400 italic">Hero, About, Contact</span>) are
            fixed to maintain essential routing mechanics.
          </p>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2"
            : "space-y-2 sm:space-y-3 max-w-3xl mx-auto"
        }
      >
        {settings.map((setting, index) => {
          const key = setting.sectionKey.toLowerCase();
          if (key === "education") return null;

          const locked = LOCKED_SECTIONS.includes(key);
          const isFixed = key === "hero" || key === "about" || key === "contact";
          const educationSection = settings.find((s) => s.sectionKey.toLowerCase() === "education");
          const isCareerBlock = key === "experience";

          if (isCareerBlock) {
            return (
              <div
                key="career-education"
                className={`border border-zinc-800 rounded-xl bg-[#0C0C0E] transition-all p-3 sm:p-5 shadow-sm hover:border-zinc-700/80 ${
                  viewMode === "grid" ? "col-span-1 sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <GripVertical className="text-zinc-600 w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 cursor-move" />
                    <div className="min-w-0">
                      <h3 className="text-[11px] sm:text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono truncate">
                        Experience &amp; Education Track
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 truncate">
                        Timeline chronology records
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {index > 2 && (
                      <button
                        onClick={() => moveUp(index)}
                        disabled={saving}
                        className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:text-white text-zinc-400 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp size={11} className="sm:w-[12px] sm:h-[12px]" />
                      </button>
                    )}

                    {index < contactIndex - 1 && (
                      <button
                        onClick={() => moveDown(index)}
                        disabled={saving}
                        className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:text-white text-zinc-400 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown size={11} className="sm:w-[12px] sm:h-[12px]" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3.5 pl-5 sm:pl-6">
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950 p-2 sm:p-3 border border-zinc-900">
                    <span className="text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                      Work History
                    </span>
                    <button
                      disabled={saving}
                      onClick={() => toggleSection(setting)}
                      className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition select-none disabled:opacity-40 shrink-0 ${
                        setting.isEnabled
                          ? "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                      }`}
                    >
                      {setting.isEnabled ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{setting.isEnabled ? "Visible" : "Hidden"}</span>
                    </button>
                  </div>

                  {educationSection && (
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950 p-2 sm:p-3 border border-zinc-900">
                      <span className="text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                        Academic Track
                      </span>
                      <button
                        disabled={saving}
                        onClick={() => toggleSection(educationSection)}
                        className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition select-none disabled:opacity-40 shrink-0 ${
                          educationSection.isEnabled
                            ? "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                        }`}
                      >
                        {educationSection.isEnabled ? <Eye size={11} /> : <EyeOff size={11} />}
                        <span>{educationSection.isEnabled ? "Visible" : "Hidden"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          const isCustom = setting.sectionKey.startsWith("custom_");

          return (
            <div
              key={setting.id}
              className={`border border-zinc-800 rounded-xl p-3 sm:p-4 bg-[#0C0C0E] flex items-center justify-between gap-3 hover:border-zinc-700/80 transition-all shadow-sm group/item ${
                isFixed ? "bg-[#09090b]/40 opacity-95" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <GripVertical
                  className={`text-zinc-700 w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isFixed ? "opacity-20 cursor-not-allowed" : "cursor-move group-hover/item:text-zinc-500 transition-colors"}`}
                />
                <div className="min-w-0 flex items-center gap-2">
                  <p className="text-[11px] sm:text-xs font-bold text-zinc-200 uppercase tracking-wider truncate font-mono">
                    {isCustom ? setting.title : setting.title || setting.sectionKey}
                  </p>
                  {isCustom && (
                    <span className="text-[8px] font-sans font-semibold border border-zinc-800 bg-zinc-900 px-1 py-0.2 rounded text-zinc-500 shrink-0 hidden xs:inline-block">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isFixed && (
                  <div className="flex items-center border border-zinc-900 bg-zinc-950 p-0.5 rounded-md">
                    {index > 2 && (
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={saving}
                        className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-20"
                      >
                        <ArrowUp size={11} />
                      </button>
                    )}

                    {index < contactIndex - 1 && key !== "contact" && (
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={saving}
                        className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-20"
                      >
                        <ArrowDown size={11} />
                      </button>
                    )}
                  </div>
                )}

                {locked ? (
                  <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/5 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400/90 font-mono shadow-sm shrink-0">
                    <Lock size={9} className="text-amber-500/70" />
                    <span>Fixed</span>
                  </span>
                ) : (
                  <button
                    disabled={saving}
                    onClick={() => toggleSection(setting)}
                    className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition select-none disabled:opacity-40 shrink-0 ${
                      setting.isEnabled
                        ? "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                    }`}
                  >
                    {setting.isEnabled ? <Eye size={11} /> : <EyeOff size={11} />}
                    <span>{setting.isEnabled ? "On" : "Off"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
