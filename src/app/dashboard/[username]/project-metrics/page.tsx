"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Plus,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  Search,
  X,
  ArrowUpDown,
  TrendingUp,
  Info,
  Sparkles,
  FolderOpen,
  Edit3,
  Trash2,
} from "lucide-react";
import ProjectMetricCard from "@/components/cards/project-metric-card";
import ProjectMetricForm from "@/components/forms/project-metric-form";
import { getProjectMetrics, deleteProjectMetric } from "@/actions/project-metric";

type ProjectMetric = {
  id: string;
  projectId: string;
  label: string;
  value: string;
  description?: string;
  displayOrder: number;
};

export default function ProjectMetricsPage({ projectId }: { projectId: string }) {
  const [metrics, setMetrics] = useState<ProjectMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<ProjectMetric | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"lexical" | "impact">("lexical");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadMetrics() {
    try {
      setLoading(true);
      setError(null);

      const result = await getProjectMetrics(projectId);

      if (!result.success) {
        throw new Error(result.error || "Failed to compile metric tracks from the data warehouse.");
      }

      setMetrics(
        result.data.map((metric: any) => ({
          id: metric.id,
          projectId: metric.projectId,
          label: metric.label,
          value: metric.value,
          description: metric.description ?? undefined,
          displayOrder: metric.displayOrder,
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sync project performance telemetry markers."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (processingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to drop this performance impact metric from the project record?"
    );
    if (!confirmDelete) return;

    try {
      setProcessingId(id);
      setActionError(null);

      const result = await deleteProjectMetric(id);

      if (!result.success) {
        throw new Error(
          "error" in result
            ? result.error
            : "Server transaction rejected deletion sequence lifecycle."
        );
      }

      await loadMetrics();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to safely delete the selected entry node. Please retry."
      );
    } finally {
      setProcessingId(null);
    }
  }

  function handleView(id: string) {
    const metric = metrics.find((item) => item.id === id) ?? null;
    setSelectedMetric(metric);
    setShowForm(true);
  }

  function handleCreate() {
    setSelectedMetric(null);
    setShowForm(true);
  }

  useEffect(() => {
    if (projectId) {
      loadMetrics();
    }
  }, [projectId]);

  const filteredMetrics = metrics
    .filter((metric) => {
      const matchCriteria =
        `${metric.label} ${metric.value} ${metric.description || ""}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "impact") {
        const valA = parseFloat(a.value.replace(/[^0-9.]/g, "")) || 0;
        const valB = parseFloat(b.value.replace(/[^0-9.]/g, "")) || 0;
        return valB - valA;
      }
      return a.label.localeCompare(b.label);
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-8 w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-xs uppercase tracking-widest">
          // Re-indexing project impact benchmarks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-sm font-bold text-zinc-200 tracking-tight">
            Telemetry Pull Interrupted
          </h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">
            {error}
          </p>
          <button
            onClick={loadMetrics}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Telemetry Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <BarChart3 size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">
              Project Metrics
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Exhibit explicit engineering performance figures, latency drops, query scaling
            optimizations, or active user growth matrices.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {metrics.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950 p-0.5 text-zinc-500 hidden sm:flex">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Presentation Layout"
              >
                <LayoutGrid size={13} />
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
          )}

          <button
            type="button"
            onClick={handleCreate}
            disabled={processingId !== null || showForm}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0"
          >
            <Plus size={13} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn">
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

      {metrics.length > 0 && !showForm && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search by metric label..."
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

          <div className="flex items-center gap-2.5 justify-end shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("lexical")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "lexical" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Lexical</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("impact")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "impact" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Scale</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 shadow-sm relative overflow-hidden animate-fadeIn w-full">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          <div className="mb-4 sm:mb-5 flex items-center justify-between border-b border-zinc-900 pb-3 sm:pb-4 sticky top-0 bg-[#0C0C0E] z-10">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={14} className="text-blue-400 shrink-0" />
              <h2 className="text-[10px] sm:text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest truncate">
                {selectedMetric ? "Modify Metric Log Node" : "Configure New Telemetry Token"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedMetric(null);
              }}
              className="inline-flex h-7 items-center justify-center gap-1 px-2.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-[10px] sm:text-xs font-mono font-medium text-zinc-400 hover:text-zinc-200 transition-colors shrink-0 ml-2"
            >
              <X size={11} />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          </div>

          <div className="mb-4 rounded-lg bg-zinc-950 border border-zinc-900 p-2.5 text-[10px] sm:text-[11px] text-zinc-400 flex gap-2 items-start">
            <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Attaching absolute value tokens accompanied by crisp structural descriptions builds
              undeniable technical context for tech leads reviewing this project module.
            </p>
          </div>

          <div className="w-full overflow-x-hidden">
            <ProjectMetricForm
              projectId={projectId}
              metric={selectedMetric ?? undefined}
              onSuccess={async () => {
                setShowForm(false);
                setSelectedMetric(null);
                await loadMetrics();
              }}
              onCancel={() => {
                setShowForm(false);
                setSelectedMetric(null);
              }}
            />
          </div>
        </div>
      )}

      {!showForm &&
        (filteredMetrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
              <FolderOpen size={18} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
              {metrics.length === 0
                ? "Project Metrics Sub-Section Empty"
                : "No classifications resolved"}
            </h3>

            <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
              <p>
                {metrics.length === 0
                  ? "This project profile currently houses no direct numerical proof markers. Providing discrete quantities introduces heavy technical verification that validates execution scale."
                  : "No matching metrics records matched your filters. Clear your query token sequence to reset boundaries."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (metrics.length === 0) {
                  handleCreate();
                } else {
                  setSearchQuery("");
                }
              }}
              className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-dashed border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
            >
              {metrics.length === 0 ? "Map Core Metrics Node" : "Reset Structural Filters"}
            </button>
          </div>
        ) : (
          <>
            <div className="block sm:hidden space-y-2.5 animate-fadeIn">
              {filteredMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-1.5 justify-between">
                      <h4 className="text-xs font-bold text-zinc-100 truncate">{metric.label}</h4>
                      <span className="text-[11px] font-mono font-black text-blue-400 bg-blue-500/5 border border-blue-500/10 rounded px-1.5 py-0.2 shrink-0">
                        {metric.value}
                      </span>
                    </div>
                    {metric.description && (
                      <p className="text-[10px] text-zinc-400 font-sans line-clamp-2 pt-1 leading-relaxed break-words">
                        {metric.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => handleView(metric.id)}
                      className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-300 transition-colors"
                    >
                      <Edit3 size={10} className="text-zinc-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={processingId === metric.id}
                      onClick={() => handleDelete(metric.id)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-red-950/20 bg-red-950/10 text-red-400 disabled:opacity-35"
                    >
                      {processingId === metric.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Trash2 size={10} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block">
              {viewMode === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
                  {filteredMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.8)] group/card"
                    >
                      <div className="space-y-3.5">
                        <ProjectMetricCard
                          metric={metric}
                          onView={handleView}
                          onDelete={handleDelete}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                        <th className="py-3 px-4 font-bold">Metric Identifier Label</th>
                        <th className="py-3 px-4 font-bold">Data Token Value</th>
                        <th className="py-3 px-4 font-bold">Context Parameter Abstract</th>
                        <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                      {filteredMetrics.map((metric) => (
                        <tr
                          key={metric.id}
                          className="hover:bg-zinc-900/30 transition-colors group/row"
                        >
                          <td className="py-3.5 px-4 min-w-[180px]">
                            <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">
                              {metric.label}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-zinc-100 font-mono font-bold text-[13px]">
                              <TrendingUp size={12} className="text-zinc-600 shrink-0" />
                              <span>{metric.value}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 max-sm truncate font-medium">
                            {metric.description ? (
                              <span>{metric.description}</span>
                            ) : (
                              <span className="text-zinc-700 font-normal italic">
                                No baseline descriptive summary attached
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right shrink-0">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleView(metric.id)}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                              >
                                Modify
                              </button>
                              <button
                                type="button"
                                disabled={processingId === metric.id}
                                onClick={() => handleDelete(metric.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === metric.id ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  "Purge"
                                )}
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
        ))}
    </div>
  );
}
