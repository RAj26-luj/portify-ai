"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Code2,
  Loader2,
  AlertTriangle,
  FolderOpen,
  Grid,
  List,
  Search,
  X,
  ArrowUpDown,
  Sparkles,
  GitPullRequest,
  Edit3,
  Trash2,
} from "lucide-react";

import { getOpenSourceProjects, deleteOpenSourceProject } from "@/actions/open-source";

import { getPortfolioId } from "@/lib/get-portfolio-id";

import OpenSourceCard from "@/components/cards/open-source-card";
import OpenSourceForm from "@/components/forms/open-source-form";

type Timeline = {
  id: string;
  milestone: string;
  progress: number;
  description?: string;
};

type OpenSourceProject = {
  id: string;
  repositoryName: string;
  repositoryUrl?: string;
  pullRequestUrl?: string;
  pullRequestTitle?: string;
  issueTitle?: string;
  contributionTitle?: string;
  contributionType?: string;
  description?: string;
  impactMetrics: string[];
  linesChanged?: string;
  status?: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTAINED";
  coverImage?: string;
  architectureDiagrams?: string[];
  contributionScreenshots?: string[];
  timeline: Timeline[];
};

export default function OpenSourcePage() {
  const params = useParams();
  const username = params?.username as string;

  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [projects, setProjects] = useState<OpenSourceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OpenSourceProject | undefined>();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "lines">("name");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const id = await getPortfolioId();

        if (!id) {
          throw new Error("Active user portfolio identity context mapping was not found.");
        }

        if (isMounted) {
          setPortfolioId(id);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load portfolio specifications");
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [username]);

  useEffect(() => {
    if (!portfolioId) return;
    loadProjects();
  }, [portfolioId]);

  async function loadProjects() {
    if (!portfolioId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await getOpenSourceProjects(portfolioId);

      if (!result.success) {
        throw new Error(result.error || "Failed pulling records from server repository.");
      }

      const normalized: OpenSourceProject[] = result.data.map((p: any) => ({
        id: p.id,
        repositoryName: p.repositoryName,
        repositoryUrl: p.repositoryUrl ?? undefined,
        pullRequestUrl: p.pullRequestUrl ?? undefined,
        pullRequestTitle: p.pullRequestTitle ?? undefined,
        issueTitle: p.issueTitle ?? undefined,
        contributionTitle: p.contributionTitle ?? undefined,
        contributionType: p.contributionType ?? undefined,
        description: p.description ?? undefined,
        impactMetrics: Array.isArray(p.impactMetrics) ? p.impactMetrics : [],
        linesChanged: p.linesChanged ?? undefined,
        status: p.status ?? undefined,
        coverImage: p.coverImage ?? undefined,
        architectureDiagrams: Array.isArray(p.architectureDiagrams) ? p.architectureDiagrams : [],
        contributionScreenshots: Array.isArray(p.contributionScreenshots)
          ? p.contributionScreenshots
          : [],
        timeline: Array.isArray(p.timeline)
          ? p.timeline.map((t: any) => ({
              id: t.id,
              milestone: t.milestone,
              progress: typeof t.progress === "number" ? t.progress : 0,
              description: t.description ?? undefined,
            }))
          : [],
      }));

      setProjects(normalized);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to pull records from server repository"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (processingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this open source contribution entry permanently?"
    );
    if (!confirmDelete) return;

    try {
      setProcessingId(id);
      setActionError(null);

      const result = await deleteOpenSourceProject(id);

      if (!result.success) {
        throw new Error(
          "error" in result && typeof result.error === "string"
            ? result.error
            : "Server mutation trace split."
        );
      }

      await loadProjects();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to safely complete index record delete sequence. Please retry."
      );
    } finally {
      setProcessingId(null);
    }
  }

  const filteredProjects = projects
    .filter((project) => {
      const matchCriteria =
        `${project.repositoryName} ${project.contributionTitle || ""} ${project.description || ""}`.toLowerCase();
      const matchesSearch = matchCriteria.includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "lines") {
        const linesA = parseInt(a.linesChanged?.replace(/[^0-9]/g, "") || "0", 10);
        const linesB = parseInt(b.linesChanged?.replace(/[^0-9]/g, "") || "0", 10);
        return linesB - linesA;
      }
      return a.repositoryName.localeCompare(b.repositoryName);
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">
          // Syncing open source modules...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            Ecosystem Synchronization Failure
          </h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">
            {error}
          </p>
          <button
            onClick={loadProjects}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Synchronization Sequence
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
              <Code2 size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">
              Open Source
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Manage your upstream repositories, community packages, patches and community ecosystem
            contributions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {projects.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950 p-0.5 text-zinc-500 hidden sm:flex">
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
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedProject(undefined);
              setShowForm(true);
            }}
            disabled={processingId !== null}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0"
          >
            <Plus size={13} />
            <span>Add Project</span>
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

      {projects.length > 0 && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-zinc-900/50 pb-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 w-full lg:min-w-0">
            <div className="relative w-full sm:max-w-xs md:max-w-sm shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Search repository registry matrix..."
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

            <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-900 overflow-x-auto max-w-full justify-start scrollbar-none w-full sm:w-auto mt-1 sm:mt-0">
              <div className="flex items-center min-w-max p-px">
                {["ALL", "COMPLETED", "IN_PROGRESS", "PLANNING", "MAINTAINED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-tight rounded-md uppercase transition-all ${statusFilter === st ? "bg-zinc-900 border border-zinc-800 text-zinc-200 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end shrink-0 w-full lg:w-auto mt-1 lg:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full lg:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("name")}
                className={`flex-1 lg:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "name" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span>Lexical</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("lines")}
                className={`flex-1 lg:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "lines" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span>Impact Scale</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <FolderOpen size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {projects.length === 0 ? "Open Source Section Empty" : "No classifications resolved"}
          </h3>

          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {projects.length === 0
                ? "Your upstream contribution history tracks are clear. Registering community patches introduces powerful proof vectors verifying specialized execution capacities."
                : "No matching registered project metrics found. Clear your active filtering inputs to reset baseline arrays."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (projects.length === 0) {
                setShowForm(true);
              } else {
                setSearchQuery("");
                setStatusFilter("ALL");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-dashed border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
          >
            {projects.length === 0 ? "Map Core Upstream Track" : "Reset Structural Filters"}
          </button>
        </div>
      ) : (
        <>
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
              >
                {project.status && (
                  <div
                    className={`absolute top-0 right-0 border-b border-l px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider rounded-bl ${
                      project.status === "COMPLETED"
                        ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400"
                        : project.status === "IN_PROGRESS"
                          ? "border-blue-500/10 bg-blue-500/5 text-blue-400"
                          : project.status === "MAINTAINED"
                            ? "border-purple-500/10 bg-purple-500/5 text-purple-400"
                            : "border-zinc-800 bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    {project.status}
                  </div>
                )}

                <div className="space-y-1 pr-16">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words">
                    {project.repositoryName}
                  </h4>
                  {project.contributionTitle && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                      <GitPullRequest size={10} className="text-zinc-600 shrink-0" />
                      <span className="truncate break-all">{project.contributionTitle}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1.5 text-[10px] font-mono text-zinc-500">
                    {project.linesChanged && (
                      <span>
                        Impact: <strong className="text-zinc-300">{project.linesChanged}</strong>
                      </span>
                    )}
                    {project.contributionType && (
                      <span className="text-zinc-500 truncate max-w-[140px]">
                        {project.contributionType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowForm(true);
                    }}
                    className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-300 transition-colors"
                  >
                    <Edit3 size={10} className="text-zinc-500" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    disabled={processingId === project.id}
                    onClick={() => handleDelete(project.id)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded border border-red-950/20 bg-red-950/10 text-red-400 disabled:opacity-35"
                  >
                    {processingId === project.id ? (
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
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
                {filteredProjects.map((project) => (
                  <OpenSourceCard
                    key={project.id}
                    {...project}
                    onEdit={() => {
                      setSelectedProject(project);
                      setShowForm(true);
                    }}
                    onDelete={() => handleDelete(project.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Repository Target</th>
                      <th className="py-3 px-4 font-bold">Contribution Summary Title</th>
                      <th className="py-3 px-4 font-bold">Status Type</th>
                      <th className="py-3 px-4 font-bold">Lines Fixed</th>
                      <th className="py-3 px-4 font-bold">Milestones</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-zinc-900/30 transition-colors group/row"
                      >
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">
                            {project.repositoryName}
                          </div>
                          {project.contributionType && (
                            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                              {project.contributionType}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-medium">
                          {project.contributionTitle ? (
                            <div className="flex items-center gap-1.5">
                              <GitPullRequest size={12} className="text-zinc-600 shrink-0" />
                              <span className="truncate">{project.contributionTitle}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-normal italic">
                              No assigned patch log
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {project.status ? (
                            <span
                              className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                                project.status === "COMPLETED"
                                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                                  : project.status === "IN_PROGRESS"
                                    ? "bg-blue-500/5 border-blue-500/10 text-blue-400"
                                    : project.status === "MAINTAINED"
                                      ? "bg-purple-500/5 border-purple-500/10 text-purple-400"
                                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                              }`}
                            >
                              {project.status}
                            </span>
                          ) : (
                            <span className="text-zinc-700 font-mono text-[10px]">UNSET</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px] font-bold">
                          {project.linesChanged || (
                            <span className="text-zinc-700 font-normal">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                          {project.timeline && project.timeline.length > 0 ? (
                            <span>{project.timeline.length} metrics</span>
                          ) : (
                            <span className="text-zinc-700">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProject(project);
                                setShowForm(true);
                              }}
                              className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                            >
                              Modify
                            </button>
                            <button
                              type="button"
                              disabled={processingId === project.id}
                              onClick={() => handleDelete(project.id)}
                              className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                            >
                              {processingId === project.id ? (
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
      )}

      {showForm && portfolioId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="max-h-[92vh] sm:max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 text-white shadow-2xl relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedProject(undefined);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 border-b border-zinc-900/80 pb-3 sticky top-0 bg-[#0C0C0E] z-10">
              <Sparkles size={14} className="text-blue-400 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono">
                {selectedProject
                  ? "Modify Upstream Entry Matrix"
                  : "Integrate Upstream Module Entry"}
              </h2>
            </div>

            <OpenSourceForm
              portfolioId={portfolioId}
              initialData={selectedProject}
              onSuccess={async () => {
                await loadProjects();
                setShowForm(false);
                setSelectedProject(undefined);
              }}
              onClose={() => {
                setShowForm(false);
                setSelectedProject(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
