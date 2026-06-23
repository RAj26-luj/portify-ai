"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  FolderOpen,
  Search,
  X,
  FolderHeart,
  Trash2,
  ExternalLink,
} from "lucide-react";

import {
  getCustomSections,
  deleteCustomSection,
  createCustomSection,
} from "@/actions/custom-section";

import { getPortfolioId } from "@/lib/get-portfolio-id";

type CustomSection = {
  id: string;
  title: string;
};

export default function CustomSectionsPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [sections, setSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"lexical" | "default">("default");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function loadSections() {
    try {
      setLoading(true);
      setActionError(null);
      const portfolioId = await getPortfolioId();

      const result = await getCustomSections(portfolioId);

      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        setSections([]);
        return;
      }

      setSections(
        result.data.map((section: CustomSection) => ({
          id: section.id,
          title: section.title,
        }))
      );
    } catch (err) {
      setActionError("Failed to synchronize your custom structural layouts.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title.trim() || creating) return;

    try {
      setCreating(true);
      setActionError(null);

      const portfolioId = await getPortfolioId();

      const result = await createCustomSection({
        portfolioId,
        title: title.trim(),
      });

      if (!result.success) {
        throw new Error(
          "error" in result && typeof result.error === "string"
            ? result.error
            : "Failed to deploy new customized category path signature."
        );
      }

      setTitle("");
      await loadSections();

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to mount new custom structural blueprint. Please try again."
      );
    } finally {
      setCreating(false);
    }
  }

  async function executeDelete(id: string) {
    try {
      setProcessingId(id);
      setConfirmDeleteId(null);
      setActionError(null);

      const result = await deleteCustomSection(id);

      if (!result.success) {
        throw new Error(
          "error" in result && typeof result.error === "string"
            ? result.error
            : "Failed to cleanly remove structural data block matrix paths."
        );
      }

      await loadSections();

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to safely delete the section block. Please retry."
      );
    } finally {
      setProcessingId(null);
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  const filteredSections = sections
    .filter((section) => section.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "lexical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] space-y-4 p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 animate-spin z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-mono font-semibold">
          // Compiling portfolio sections blueprint...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-7xl mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <FolderHeart size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">
              Custom Sections
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Formulate custom categories, case logs, and information modules outside standard
            portfolio brackets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end hidden sm:flex">
          {sections.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-zinc-500">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Browsing Mode"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Compact Tabular List Rows"
              >
                <List size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn w-full">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="space-y-0.5 sm:space-y-1">
          <label className="text-[9px] sm:text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
            Initialize New Category
          </label>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Enter a unique structural title block parameter to attach onto your schema tree layer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:grid-cols-1 md:items-center">
          <input
            type="text"
            value={title}
            disabled={creating}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advisory Boards, Research Grants..."
            className="flex-1 bg-[#070709] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors h-9"
          />

          <button
            type="button"
            disabled={creating || !title.trim()}
            onClick={handleCreate}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 sm:px-5 text-xs font-bold transition-colors shadow-sm focus:outline-none select-none shrink-0 w-full sm:w-auto"
          >
            {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            <span>{creating ? "Creating Branch..." : "Add Section"}</span>
          </button>
        </div>
      </div>

      {sections.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4 w-full">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search section titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-8.5 bg-[#09090b] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-end shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("default")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center px-2.5 rounded transition-all font-bold uppercase ${sortBy === "default" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Default
              </button>
              <button
                type="button"
                onClick={() => setSortBy("lexical")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center px-2.5 rounded transition-all font-bold uppercase ${sortBy === "lexical" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Lexical
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-2xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <FolderOpen size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {sections.length === 0
              ? "Custom Sections Blueprint Empty"
              : "No classifications resolved"}
          </h3>

          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-sm mt-1.5 leading-relaxed space-y-2 sm:space-y-3 w-full">
            <p>
              {sections.length === 0
                ? "Your portfolio currently has no standalone customized section tracks initialized. Instantiating customized grids lets you record highly personalized data sets."
                : "No matching categories found. Clear your text query parameter tokens to reload configuration defaults."}
            </p>
          </div>

          {sections.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 px-4 text-xs font-semibold transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm"
              >
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest block">
                    Active Data Layer
                  </span>
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words">
                    {section.title}
                  </h4>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => router.push(`custom-sections/${section.id}`)}
                    className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-2 text-[10px] font-bold text-zinc-400 transition-colors"
                  >
                    <span>Configure</span>
                    <ExternalLink size={10} className="text-zinc-600" />
                  </button>

                  {confirmDeleteId === section.id ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="h-6 px-2 text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => executeDelete(section.id)}
                        className="h-6 px-2 text-[10px] font-bold bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                      >
                        Purge
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={processingId === section.id}
                      onClick={() => setConfirmDeleteId(section.id)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-red-950/20 bg-red-950/10 text-red-400 disabled:opacity-35 transition-colors"
                    >
                      {processingId === section.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Trash2 size={10} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full animate-fadeIn">
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => router.push(`custom-sections/${section.id}`)}
                    className="group/section-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-[1px] cursor-pointer select-none"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest block">
                          Active Data Layer
                        </span>
                        <h3 className="font-bold text-zinc-200 text-sm group-hover/section-card:text-blue-400 transition-colors truncate">
                          {section.title}
                        </h3>
                      </div>

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-950 border border-zinc-900 group-hover/section-card:border-zinc-800 text-zinc-600 group-hover/section-card:text-zinc-400 transition-colors">
                        <ExternalLink size={11} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-zinc-900 mt-4">
                      <span className="text-[10px] font-mono font-bold text-zinc-600 group-hover/section-card:text-zinc-500 transition-colors">
                        Manage Entities →
                      </span>

                      {confirmDeleteId === section.id ? (
                        <div
                          className="flex items-center gap-1.5 animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-md transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => executeDelete(section.id)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md transition-all inline-flex items-center gap-1 shadow-sm"
                          >
                            Confirm Delete
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={processingId === section.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(section.id);
                          }}
                          className="h-6 w-6 inline-flex items-center justify-center rounded border border-zinc-855 bg-red-950/10 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 border-red-900/10 hover:border-red-500/20 transition-colors focus:outline-none"
                          title="Purge Category Branch"
                        >
                          {processingId === section.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Trash2 size={11} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm w-full animate-fadeIn">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Category Title Parameter</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredSections.map((section) => (
                      <tr
                        key={section.id}
                        onClick={() => router.push(`custom-sections/${section.id}`)}
                        className="hover:bg-zinc-900/30 transition-colors group/row cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-md">
                            {section.title}
                          </div>
                        </td>
                        <td
                          className="py-3.5 px-4 text-right shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2.5">
                            {confirmDeleteId !== section.id && (
                              <button
                                type="button"
                                onClick={() => router.push(`custom-sections/${section.id}`)}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 inline-flex items-center gap-1"
                              >
                                <span>Configure</span>
                                <ExternalLink size={10} className="text-zinc-600" />
                              </button>
                            )}

                            {confirmDeleteId === section.id ? (
                              <div className="flex items-center gap-1.5 animate-fadeIn">
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-[11px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded border border-zinc-800 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => executeDelete(section.id)}
                                  className="text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded transition-colors shadow-sm"
                                >
                                  Purge
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={processingId === section.id}
                                onClick={() => setConfirmDeleteId(section.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2.5 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === section.id ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  "Purge"
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
