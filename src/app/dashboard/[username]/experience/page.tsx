"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Briefcase, 
  Plus, 
  Loader2, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  Search, 
  X, 
  ArrowUpDown, 
  Calendar,
  MapPin,
  Building2,
  Edit3,
  Trash2,
  AlertCircle,
  Check
} from "lucide-react";

import { getExperiences, deleteExperience } from "@/actions/experience";
import { getMyPortfolioId } from "@/actions/portfolio";

import ExperienceForm from "@/components/forms/experience-form";
import ExperienceCard from "@/components/cards/experience-card";

type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "FREELANCE"
  | "CONTRACT";

type Experience = {
  id: string;
  company: string;
  position: string;
  employmentType?: EmploymentType;
  location?: string;
  companyWebsite?: string;
  companyLogo?: string;
  companyBanner?: string;
  startDate?: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string;
  responsibilities: string[];
  technologies: string[];
};

export default function ExperiencePage() {
  const params = useParams();
  const username = params?.username as string;

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Experience | null>(null);

  // Premium SaaS Interface Layout & Interaction States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"chronological" | "alphabetical">("chronological");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Tracks which component row/card/node is actively staging its confirmation wrapper
  const [activeConfirmDeleteId, setActiveConfirmDeleteId] = useState<string | null>(null);

  const load = async (pId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let activeId = pId || portfolioId;
      
      // 1. Resolve active user workspace context using key-in type bounds
      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error("Active profile credential mapping identifier was not found.");
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      // 2. Query relative work experience matrices with strict object resolution checks
      const result = await getExperiences(activeId);

      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed compiling target experience records from server.");
      }

      // 3. Populate component state arrays mapping dynamic optional parameters fields safely
      setExperiences(
        result.data.map((exp: any) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          employmentType: exp.employmentType ?? undefined,
          location: exp.location ?? undefined,
          companyWebsite: exp.companyWebsite ?? undefined,
          companyLogo: exp.companyLogo ?? undefined,
          companyBanner: exp.companyBanner ?? undefined,
          startDate: exp.startDate ? new Date(exp.startDate) : undefined,
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          currentlyWorking: !!exp.currentlyWorking,
          description: exp.description ?? undefined,
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load professional history records");
    } finally {
      setLoading(false);
    }
  };

  // 4. Mount chronological lifecycle bindings matching the active target namespace identifier
  useEffect(() => {
    (async () => {
      try {
        const result = await getMyPortfolioId();

        if (!result || !result.success || !result.data) {
          throw new Error("Portfolio lookup context mismatch.");
        }

        setPortfolioId(result.data);
        await load(result.data);
      } catch {
        setError("Failed to resolve active portfolio credentials token mapping.");
      }
    })();
  }, [username]);

  async function handleDelete(id: string) {
    try {
      setProcessingId(id);
      setActionError(null);
      
      const result = await deleteExperience(id);
      
      if (!result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Server action mutation failed.");
      }

      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      setActiveConfirmDeleteId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Execution failure: Unable to drop experience index node safely.");
    } finally {
      setProcessingId(null);
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditData(exp);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
    setEditData(null);
  };

  // Pure functional sorting & search criteria matching arrays 
  const filteredExperiences = experiences
    .filter((exp) => {
      const matchCriteria = `${exp.company} ${exp.position} ${exp.location || ""} ${exp.technologies.join(" ")}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.company.localeCompare(b.company);
      }
      const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return timeB - timeA; // Newest occupational events surface first
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Mapping professional experience matrices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Timeline Mapping Sync Defect</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
          <button 
            onClick={() => load(portfolioId)}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Extraction Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <Briefcase size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Experience</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Manage your corporate work history, full-time milestones, contracts, freelancing operations, and internship records.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {/* Layout Configuration Switching Toggles */}
          {experiences.length > 0 && (
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
            onClick={handleAdd}
            disabled={processingId !== null}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0"
          >
            <Plus size={13} />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* INLINE ACTION ERROR PANEL */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2">✕</button>
        </div>
      )}

      {/* FILTER CONTROLS TOOLBAR */}
      {experiences.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search by company, position or stack tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-8.5 bg-[#09090b] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
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
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "chronological" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("alphabetical")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "alphabetical" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Corporate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIENCE RENDER BLOCKS */}
      {filteredExperiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <Building2 size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {experiences.length === 0 ? "Experience Section Empty" : "No classifications resolved"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {experiences.length === 0 
                ? "Your layout profile has no corporate work history tracked. Populating full-time parameters or internship achievements forms a foundational segment."
                : "No matching registered employment tracks found. Clear your text query search inputs to reset the indexing frame."
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (experiences.length === 0) {
                handleAdd();
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
          >
            {experiences.length === 0 ? "Map Core Professional Track" : "Reset Structural Filters"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE LIST DISPLAY */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredExperiences.map((exp) => (
              <div 
                key={exp.id} 
                className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
              >
                {exp.currentlyWorking && (
                  <div className="absolute top-0 right-0 border-b border-l border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-emerald-400 rounded-bl">
                    CURRENT
                  </div>
                )}
                
                <div className="space-y-1 pr-12">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words">{exp.company}</h4>
                  <p className="text-[10px] font-semibold text-zinc-400 break-words leading-tight">{exp.position}</p>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1.5 text-[10px] font-mono text-zinc-500">
                    {exp.location && (
                      <span className="flex items-center gap-1 max-w-[140px] truncate">
                        <MapPin size={9} className="shrink-0 text-zinc-600" />
                        <span className="truncate">{exp.location}</span>
                      </span>
                    )}
                    {exp.employmentType && (
                      <span className="text-blue-400 font-medium text-[9px] uppercase">
                        {exp.employmentType.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {exp.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[8px] font-mono px-1.5 py-0.5">
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 3 && <span className="text-[8px] text-zinc-600 font-mono mt-0.5">+{exp.technologies.length - 3}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {activeConfirmDeleteId === exp.id ? (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 flex items-center justify-between gap-3 animate-fadeIn w-full">
                      <div className="flex items-center gap-1 text-red-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                        <AlertCircle size={11} className="animate-pulse" />
                        <span>Confirm Delete?</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveConfirmDeleteId(null)}
                          className="h-6 rounded bg-zinc-800 text-zinc-300 font-mono text-[9px] font-bold uppercase tracking-wider px-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={processingId === exp.id}
                          onClick={() => handleDelete(exp.id)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          <span>Purge</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-[9px] font-mono text-zinc-600">
                        {exp.startDate ? new Date(exp.startDate).getFullYear() : "Init"} — {exp.currentlyWorking ? "Present" : (exp.endDate ? new Date(exp.endDate).getFullYear() : "Term")}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(exp)}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-300 transition-colors"
                        >
                          <Edit3 size={10} className="text-zinc-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingId === exp.id}
                          onClick={() => setActiveConfirmDeleteId(exp.id)}
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

          {/* DESKTOP MATRIX ADAPTER VIEWS */}
          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1xl xl:grid-cols-2 animate-fadeIn">
                {filteredExperiences.map((exp) => (
                  <div key={exp.id} className="relative group">
                    <ExperienceCard
                      id={exp.id}
                      company={exp.company}
                      position={exp.position}
                      employmentType={exp.employmentType as any}
                      location={exp.location}
                      companyWebsite={exp.companyWebsite}
                      companyLogo={exp.companyLogo}
                      startDate={exp.startDate ? exp.startDate.toISOString().split("T")[0] : undefined}
                      endDate={exp.endDate ? exp.endDate.toISOString().split("T")[0] : undefined}
                      currentlyWorking={exp.currentlyWorking}
                      description={exp.description}
                      responsibilities={exp.responsibilities}
                      technologies={exp.technologies}
                      onEdit={() => handleEdit(exp)}
                      onDelete={() => setActiveConfirmDeleteId(exp.id)}
                    />

                    {/* GRID CONFIRMATION OVERLAY */}
                    {activeConfirmDeleteId === exp.id && (
                      <div className="absolute inset-0 bg-black/95 border border-red-900/40 rounded-xl p-5 flex flex-col justify-between z-30 animate-fadeIn">
                        <div className="flex items-start gap-3 text-red-400">
                          <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Purge Experience Record?</h4>
                            <p className="text-[11px] text-zinc-500 leading-normal">
                              This structural change will immediately drop this professional placement profile segment trace from your profile layout.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-3">
                          <button
                            type="button"
                            onClick={() => setActiveConfirmDeleteId(null)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-md transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={processingId === exp.id}
                            onClick={() => handleDelete(exp.id)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md transition-all inline-flex items-center gap-1 shadow-sm"
                          >
                            {processingId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                            <span>Confirm Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Company & Identity</th>
                      <th className="py-3 px-4 font-bold">Position Role</th>
                      <th className="py-3 px-4 font-bold">Location</th>
                      <th className="py-3 px-4 font-bold">Chronology Tenure</th>
                      <th className="py-3 px-4 font-bold">Core Stack Scope</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredExperiences.map((exp) => (
                      <tr key={exp.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">{exp.company}</div>
                          {exp.employmentType && (
                            <span className="text-[9px] text-zinc-500 font-mono font-bold block mt-0.5 uppercase tracking-wide">
                              {exp.employmentType.replace("_", " ")}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-medium">
                          {exp.position}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-medium">
                          {exp.location ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={11} className="text-zinc-600 shrink-0" />
                              <span className="truncate max-w-[120px]">{exp.location}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-zinc-600 shrink-0" />
                            <span>
                              {exp.startDate ? new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Init"} 
                              {" — "} 
                              {exp.currentlyWorking ? (
                                <span className="text-emerald-400 font-semibold text-[10px] uppercase bg-emerald-500/5 border border-emerald-500/10 px-1 rounded">Present</span>
                              ) : (
                                exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Term"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {exp.technologies && exp.technologies.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {exp.technologies.slice(0, 2).map((tech, i) => (
                                <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[9px] font-mono px-1 py-0.2">
                                  {tech}
                                </span>
                              ))}
                              {exp.technologies.length > 2 && <span className="text-[9px] text-zinc-600 font-mono">+{exp.technologies.length - 2}</span>}
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            {activeConfirmDeleteId !== exp.id && (
                              <button
                                type="button"
                                onClick={() => handleEdit(exp)}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                              >
                                Modify
                              </button>
                            )}

                            {/* TABLE CONTEXT CONFIRMATION */}
                            {activeConfirmDeleteId === exp.id ? (
                              <div className="flex items-center gap-1.5 animate-fadeIn">
                                <span className="text-[10px] text-red-400 font-mono mr-1 font-bold animate-pulse">Confirm Purge?</span>
                                <button
                                  type="button"
                                  onClick={() => setActiveConfirmDeleteId(null)}
                                  className="text-[11px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded border border-zinc-800 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={processingId === exp.id}
                                  onClick={() => handleDelete(exp.id)}
                                  className="text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 shadow-sm"
                                >
                                  {processingId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                                  <span>Purge</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={processingId === exp.id}
                                onClick={() => setActiveConfirmDeleteId(exp.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-500/10 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === exp.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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

      {/* FORM MANAGEMENT WORKFLOW OVERLAY SURFACE */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-4xl rounded-t-2xl sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 text-white shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={handleClose}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded"
              >
                ✕
              </button>
            </div>
            <ExperienceForm
              initialData={editData}
              portfolioId={portfolioId}
              onClose={handleClose}
              onSuccess={async () => {
                handleClose();
                await load(portfolioId);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}