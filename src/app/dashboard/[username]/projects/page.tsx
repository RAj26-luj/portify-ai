"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  FolderGit2, 
  Plus, 
  Loader2, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  Search, 
  X, 
  ArrowUpDown, 
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  GitFork,
  Edit3,
  Trash2,
  Check,
  AlertCircle
} from "lucide-react";

import ProjectCard from "@/components/cards/project-card";
import ProjectForm from "@/components/forms/project-form";
import ProjectMetricsPage from "@/app/dashboard/[username]/project-metrics/page";

import {
  deleteProject,
  getProjects,
} from "@/actions/project";

import { getMyPortfolioId } from "@/actions/portfolio";

type Project = {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  problemStatement?: string;
  solution?: string;
  category?: string;
  status?: string;
  type?: string;
  role?: string;
  teamSize?: number;
  projectBanner?: string;
  coverImage?: string;
  thumbnail?: string;
  startDate?: string;
  endDate?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  images?: string[];
  featured: boolean;
  displayOrder: number;
  createdAt?: Date;
};

export default function ProjectsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"chronological" | "alphabetical">("chronological");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [mobileConfirmDeleteId, setMobileConfirmDeleteId] = useState<string | null>(null);

  async function loadProjects(pId?: string) {
    try {
      setLoading(true);
      setError(null);

      let activeId = pId || portfolioId;
      
      // 🛡️ Safe Key-In Narrowing Guard checking action envelope boundaries
      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error("error" in portfolioResult && typeof portfolioResult.error === "string" ? portfolioResult.error : "Portfolio tracking context was not resolved.");
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      const result = await getProjects(activeId);
      
      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed compiling your project arrays.");
      }

      setProjects(result.data as unknown as Project[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project database logs.");
    } finally {
      setLoading(false);
    }
  }

  // 🛡️ Mount chronological lifecycles unwrapping the portfolio identification objects safely
  useEffect(() => {
    (async () => {
      try {
        const result = await getMyPortfolioId();

        if (!result || !result.success || !result.data) {
          throw new Error("error" in result && typeof result.error === "string" ? result.error : "Portfolio lookup failure.");
        }

        setPortfolioId(result.data);
        await loadProjects(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to resolve active full-stack portfolio credentials token mapping.");
      }
    })();
  }, [username]);

  async function handleDelete(id: string, bypassPrompt = false) {
    if (processingId) return;

    const isMobile = window.innerWidth < 640;
    if (isMobile && !bypassPrompt) {
      setMobileConfirmDeleteId(id);
      return;
    }

    if (!isMobile) {
      const confirmDelete = window.confirm("Are you sure you want to remove this project showcase permanently? All nested tracking sub-metrics will be dropped.");
      if (!confirmDelete) return;
    }

    try {
      setProcessingId(id);
      setActionError(null);
      
      const result = await deleteProject(id);
      
      if (!result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Server mutation trace split.");
      }
      
      setProjects((prev) => prev.filter((item) => item.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
      setMobileConfirmDeleteId(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to safely purge selected project index node. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  const filteredProjects = projects
    .filter((project) => {
      const matchCriteria = `${project.title} ${project.shortDescription || ""} ${project.category || ""} ${project.techStack?.join(" ") || ""}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });

  const isShowcaseIncomplete = projects.length > 0 && projects.some(p => !p.githubUrl || !p.liveUrl || !p.description);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center mx-3 sm:mx-auto">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Re-indexing project showcases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-none sm:rounded-xl border-y sm:border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Showcase Data Extraction Failure</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
          <button 
            onClick={() => loadProjects(portfolioId)}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  if (selectedProjectId) {
    return (
      <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased animate-fadeIn px-0 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 gap-3 px-4 sm:px-0">
          <button
            onClick={() => setSelectedProjectId(null)}
            className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all select-none focus:outline-none"
          >
            <span>← Back To Catalog</span>
          </button>
          
          <div className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded border border-zinc-900 shrink-0">
            Telemetry Sub-Context
          </div>
        </div>

        <div className="px-4 sm:px-0">
          <ProjectMetricsPage projectId={selectedProjectId} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white w-full max-w-[1440px] mx-auto font-sans antialiased px-0 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      
      {/* PREMIUM ACTIONS CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5 px-4 sm:px-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <FolderGit2 size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Project Showcases</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Architect, configure, and manage personal, academic, or professional projects highlighted across public template canvases.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {projects.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950 p-0.5 text-zinc-500 hidden sm:flex">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Presentation Matrix"
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
            onClick={() => {
              setSelectedProject(null);
              setShowForm(true);
            }}
            disabled={processingId !== null}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0 font-mono uppercase tracking-wider"
          >
            <Plus size={13} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* COMPACT INLINE ACTION ERROR PANEL */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2">✕</button>
        </div>
      )}

      {/* RECOMMENDED FILL SYSTEM COMPLIANCE WELL */}
      {isShowcaseIncomplete && (
        <div className="rounded-none sm:rounded-xl border-y sm:border border-blue-500/10 bg-gradient-to-r from-blue-500/[0.03] to-transparent p-4 flex gap-2.5 items-start animate-fadeIn w-full mx-4 sm:mx-0">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-xs font-bold tracking-wide text-zinc-200">
              Missing Portfolio Resource Parameters Detected
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">
              We highly recommend filling all fields entirely. Adding clean code repositories, active endpoints, and full-length problem statements provides deep empirical insight that helps recruiters review capabilities contextually.
            </p>
          </div>
        </div>
      )}

      {/* FILTER CONTROL HUBS TOOLBAR */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4 px-4 sm:px-0">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search by title, stack, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-8.5 bg-[#09090b] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-sans"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-end shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("chronological")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase tracking-tight transition-all ${sortBy === "chronological" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("alphabetical")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase tracking-tight transition-all ${sortBy === "alphabetical" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Lexical</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOWCASES MAP GRID CHASSIS */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none sm:rounded-xl border-y sm:border border-dashed border-zinc-800 bg-zinc-950/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <HelpCircle size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {projects.length === 0 ? "Projects Portfolio Matrix Unpopulated" : "No classifications resolved"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {projects.length === 0 
                ? "Your portfolio currently has no standalone project entries indexed. Creating feature showcases builds immediate proof of your specialized technical ability."
                : "No matching project showcases found. Clear your active search filtering inputs to reset catalogs."
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (projects.length === 0) {
                setShowForm(true);
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
          >
            {projects.length === 0 ? "Create First Project Showcase" : "Reset Active Filters"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE CONDENSED LIST VIEW */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="rounded-none border-y border-zinc-800 bg-[#0C0C0E] p-4 space-y-3 shadow-sm relative overflow-hidden"
              >
                {project.featured && (
                  <div className="absolute top-0 right-0 border-b border-l border-amber-500/10 bg-amber-500/5 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-amber-400 rounded-bl">
                    FEATURED
                  </div>
                )}
                
                <div className="space-y-1 pr-14">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words font-sans">{project.title}</h4>
                  {project.category && (
                    <p className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wide">
                      {project.category.replace("_", " ")}
                    </p>
                  )}
                  {project.shortDescription && (
                    <p className="text-[10px] text-zinc-400 font-sans line-clamp-2 pt-0.5 break-words leading-relaxed">
                      {project.shortDescription}
                    </p>
                  )}
                  
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {project.techStack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[8px] font-mono px-1.5 py-0.5">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && <span className="text-[8px] text-zinc-600 font-mono mt-0.5">+{project.techStack.length - 3}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {mobileConfirmDeleteId === project.id ? (
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
                          disabled={processingId === project.id}
                          onClick={() => handleDelete(project.id, true)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === project.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          <span>Execute</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-[9px] font-mono text-zinc-600">
                        {project.startDate ? new Date(project.startDate).getFullYear() : "Init"} — {project.endDate ? new Date(project.endDate).getFullYear() : "Active"}
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedProjectId(project.id)}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-2 text-[10px] text-zinc-400 font-mono"
                        >
                          <Layers size={9} />
                          <span>Metrics</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowForm(true);
                          }}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-mono font-bold text-zinc-300"
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
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP ADVANCED GRID */}
          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 animate-fadeIn">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onView={() => {
                      setSelectedProject(project);
                      setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onMetrics={setSelectedProjectId}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Project Showcased Name</th>
                      <th className="py-3 px-4 font-bold">Category Scope</th>
                      <th className="py-3 px-4 font-bold">Primary Framework Tools</th>
                      <th className="py-3 px-4 font-bold">Chronology Period</th>
                      <th className="py-3 px-4 font-bold">Highlight Scope</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">{project.title}</div>
                          {project.role && <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 truncate max-w-xs">{project.role}</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-medium capitalize">
                          {project.category ? project.category.replace("_", " ").toLowerCase() : <span className="text-zinc-700 italic">Standard</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          {project.techStack && project.techStack.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {project.techStack.slice(0, 2).map((tech, i) => (
                                <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[9px] font-mono px-1 py-0.2">
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 2 && <span className="text-[9px] text-zinc-600 font-mono">+{project.techStack.length - 2}</span>}
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-zinc-700 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {project.startDate ? new Date(project.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Init"}
                              {" — "}
                              {project.endDate ? new Date(project.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Active"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                            project.featured ? "bg-amber-500/5 border-amber-500/10 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                          }`}>
                            {project.featured ? "FEATURED" : "STANDARD"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedProjectId(project.id)}
                              className="text-[11px] font-semibold text-zinc-300 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800 inline-flex items-center gap-1"
                            >
                              <Layers size={10} className="text-zinc-500" />
                              <span>Metrics</span>
                            </button>
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
                              className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-500/10 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                            >
                              {processingId === project.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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

      {/* FORM OVERLAY DIALOG */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="max-h-[100vh] sm:max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-none sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl relative">
            
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono pr-4">
                  {selectedProject ? "Modify Project Parameters" : "Initialize New Showcase Block"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedProject(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-zinc-950 border border-zinc-900 p-2.5 text-[10px] sm:text-[11px] text-zinc-400 flex gap-2 items-start hidden sm:flex mx-6 mt-4">
              <GitFork size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-normal">
                We highly recommend completing all optional resource fields entirely. Providing code repository coordinates, functional specifications, and cover captures maximizes your project evaluation rank on your active public theme canvas template.
              </p>
            </div>

            <div className="w-full overflow-x-hidden px-0 sm:px-0">
              <ProjectForm
                initialData={selectedProject ?? undefined}
                onSuccess={() => {
                  setShowForm(false);
                  setSelectedProject(null);
                  loadProjects(portfolioId);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedProject(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}