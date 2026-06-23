"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Loader2,
  AlertTriangle,
  List,
  FolderOpen,
  Search,
  X,
  ArrowUpDown,
  Settings,
  Grid,
  Sparkles,
  Save,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";

import { getCustomSectionById, updateCustomSection } from "@/actions/custom-section";

import CustomSectionItemForm from "@/components/forms/custom-section-item-form";
import CustomSectionItemCard from "@/components/cards/custom-section-item-card";

import { getCustomSectionItems, deleteCustomSectionItem } from "@/actions/custom-section-item";

type CustomSection = {
  id: string;
  title: string;
};

type CustomSectionItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  attachmentUrl?: string | null;
  externalUrl?: string | null;
};

export default function CustomSectionDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [section, setSection] = useState<CustomSection | null>(null);
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<CustomSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomSectionItem | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"lexical" | "default">("lexical");
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [mobileConfirmDeleteId, setMobileConfirmDeleteId] = useState<string | null>(null);

  async function loadData() {
    if (!id) return;
    try {
      setLoading(true);
      setActionError(null);

      const sectionResult = await getCustomSectionById(String(id));

      if (
        !sectionResult ||
        !sectionResult.success ||
        !("data" in sectionResult) ||
        !sectionResult.data
      ) {
        setSection(null);
        return;
      }

      const itemsResult = await getCustomSectionItems(String(id));

      setSection({
        id: sectionResult.data.id,
        title: sectionResult.data.title,
      });
      setViewMode("grid");
      setTitle(sectionResult.data.title);

      if (
        itemsResult &&
        itemsResult.success &&
        "data" in itemsResult &&
        Array.isArray(itemsResult.data)
      ) {
        setItems(itemsResult.data as CustomSectionItem[]);
      } else {
        setItems([]);
      }
    } catch (err) {
      setActionError("Failed to fetch database custom section mapping branches.");
    } finally {
      setLoading(false);
    }
  }

  async function saveTitle() {
    if (!section || isSavingTitle) return;
    if (!title.trim()) {
      setActionError("Section title content rule cannot be left unallocated.");
      return;
    }

    try {
      setIsSavingTitle(true);
      setActionError(null);

      const result = await updateCustomSection(section.id, { title: title.trim() });

      if (!result.success) {
        throw new Error(
          "error" in result && typeof result.error === "string"
            ? result.error
            : "Failed to commit database record modifications safely."
        );
      }

      setSection((prev) => (prev ? { ...prev, title: title.trim() } : null));
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to push section layout title parameters to server."
      );
    } finally {
      setIsSavingTitle(false);
    }
  }

  async function handleDeleteItem(itemId: string, bypassPrompt = false) {
    const isMobile = window.innerWidth < 640;
    if (isMobile && !bypassPrompt) {
      setMobileConfirmDeleteId(itemId);
      return;
    }

    try {
      setActionError(null);
      await deleteCustomSectionItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setMobileConfirmDeleteId(null);
    } catch {
      setActionError("Failed to safely complete index record drop sequence.");
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  const filteredItems = items
    .filter((item) => {
      const matchCriteria =
        `${item.title} ${item.subtitle || ""} ${item.description || ""}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "lexical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] space-y-4 p-4 text-center mx-3 sm:mx-auto bg-[#050505] text-zinc-500 font-mono rounded-xl border border-zinc-900 select-none">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 animate-spin z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-bold">
          // Compiling custom section matrices...
        </p>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-none sm:rounded-xl border-y sm:border border-zinc-800 bg-zinc-950/20 p-4 sm:p-6 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            Index Branch Unresolved
          </h4>
          <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed break-words">
            The targeted modular section database schema layout reference does not exist or has been
            decoupled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white w-full max-w-[1440px] mx-auto font-sans antialiased px-0 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      <div className="rounded-none sm:rounded-xl border-y sm:border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        <div className="flex items-center gap-2 px-4 sm:px-0">
          <Settings size={14} className="text-zinc-500" />
          <h2 className="text-[10px] sm:text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
            Section Blueprint Configuration
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center px-4 sm:px-0">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              disabled={isSavingTitle}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Custom Section Category Title..."
              className="w-full bg-[#070709] border border-zinc-800 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 disabled:opacity-50 transition-colors font-sans"
            />
          </div>

          <button
            type="button"
            disabled={isSavingTitle || title.trim() === section.title}
            onClick={saveTitle}
            className="inline-flex h-10 sm:h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-colors focus:outline-none select-none shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSavingTitle ? (
              <Loader2 size={12} className="animate-spin text-blue-400" />
            ) : (
              <Save size={12} />
            )}
            <span>Commit Title</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="flex items-start gap-2 rounded-none sm:rounded-lg border-y sm:border border-red-500/10 bg-red-500/5 p-4 sm:p-3 text-xs text-red-400 animate-fadeIn w-full">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 pt-2 px-4 sm:px-0">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-100 flex items-center gap-2">
            <span>{section.title} Grid Elements</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Populate custom index tracks, metrics logs, parameters, or external hyperlinks mapped
            specifically into this customized layer framework.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 sm:py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0 font-mono uppercase tracking-wider"
        >
          <Plus size={13} />
          <span>Add Custom Item</span>
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4 px-4 sm:px-0">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search custom item entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-8.5 bg-[#09090b] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-sans"
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

          <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("default")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all ${sortBy === "default" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={10} />
                <span>Default</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("lexical")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all ${sortBy === "lexical" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={10} />
                <span>Lexical</span>
              </button>
            </div>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-zinc-500 hidden sm:flex">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Dashboard Layout"
              >
                <Grid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Compact List Rows View"
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none sm:rounded-xl border-y sm:border border-dashed border-zinc-800 bg-zinc-950/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <FolderOpen size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {items.length === 0 ? "Custom Section Context Empty" : "No tracking logs found"}
          </h3>

          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {items.length === 0
                ? `Your customized layer layout index "${section.title}" currently has no nested parameters. Adding items lets you present custom work fields outside mandatory platform brackets.`
                : "No matching registered parameters found. Clear or adjust your filters to re-index defaults."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (items.length === 0) {
                setShowForm(true);
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
          >
            {items.length === 0 ? "Map Core Data Item" : "Reset Filtering Queries"}
          </button>
        </div>
      ) : (
        <>
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-none border-y border-zinc-800 bg-[#0C0C0E] p-4 space-y-3 shadow-sm relative overflow-hidden"
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words font-sans">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-[10px] font-medium text-zinc-500 truncate font-sans">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-[10px] text-zinc-400 font-sans line-clamp-2 pt-0.5 leading-relaxed break-words">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {mobileConfirmDeleteId === item.id ? (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5 flex items-center justify-between gap-3 animate-fadeIn w-full">
                      <div className="flex items-center gap-1.5 text-red-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                        <AlertCircle size={12} className="animate-pulse" />
                        <span>Confirm Purge?</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setMobileConfirmDeleteId(null)}
                          className="h-6 rounded bg-zinc-800 text-zinc-300 font-mono text-[9px] font-bold uppercase tracking-wider px-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, true)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          <Check size={10} />
                          <span>Execute</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex gap-1">
                        {item.imageUrl && (
                          <span className="text-[8px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 rounded px-1">
                            IMG
                          </span>
                        )}
                        {item.attachmentUrl && (
                          <span className="text-[8px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 rounded px-1">
                            DOC
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-mono font-bold text-zinc-300"
                        >
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-red-950/20 bg-red-950/10 text-red-400"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
                {filteredItems.map((item) => (
                  <CustomSectionItemCard
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    iconUrl={item.iconUrl}
                    attachmentUrl={item.attachmentUrl}
                    externalUrl={item.externalUrl}
                    onEdit={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Item Title Mapping</th>
                      <th className="py-3 px-4 font-bold">Subtitle Context</th>
                      <th className="py-3 px-4 font-bold">Media Artifact Hooks</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-900/30 transition-colors group/row"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">
                            {item.title}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-medium">
                          {item.subtitle || (
                            <span className="text-zinc-700 font-normal italic">Unset</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {item.imageUrl && (
                              <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 rounded px-1.5 py-0.5">
                                IMAGE
                              </span>
                            )}
                            {item.iconUrl && (
                              <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 rounded px-1.5 py-0.5">
                                GLYPH
                              </span>
                            )}
                            {item.attachmentUrl && (
                              <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 rounded px-1.5 py-0.5">
                                DOC
                              </span>
                            )}
                            {!item.imageUrl && !item.iconUrl && !item.attachmentUrl && (
                              <span className="text-zinc-700 font-mono text-[10px]">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setShowForm(true);
                              }}
                              className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                            >
                              Modify
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2 py-1 rounded border border-red-900/10 inline-flex items-center justify-center min-w-[50px]"
                            >
                              Purge
                            </button>
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

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-0 sm:p-4 flex items-end sm:items-center justify-center animate-fadeIn">
          <div className="w-full max-w-4xl rounded-t-2xl sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto relative">
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono pr-4">
                  {editingItem ? "Modify Custom Data Node" : "Incorporate Custom Data Node"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="w-full overflow-x-hidden px-0 sm:px-0">
              <CustomSectionItemForm
                customSectionId={section.id}
                item={editingItem ?? undefined}
                onSuccess={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  loadData();
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
