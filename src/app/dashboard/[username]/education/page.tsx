"use client";

import { useEffect, useState } from "react";
import { 
  GraduationCap, 
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
  FolderOpen, 
  Edit3, 
  Trash2,
  AlertCircle,
  Check
} from "lucide-react";

import { getEducations, deleteEducation } from "@/actions/education";
import { getMyPortfolioId } from "@/actions/portfolio";

import EducationCard from "@/components/cards/education-card";
import EducationForm from "@/components/forms/education-form";

type Education = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  cgpa?: string;
  location?: string;
  institutionImage?: string;
  logoUrl?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  currentlyStudying: boolean;
  description?: string;
};

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Education | null>(null);

  // Advanced SaaS Layout View Mode, Filtration and Multi-Click safeguards
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
      
      // 1. Resolve workspace tracking identifier safely from union envelope
      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error("Active user portfolio tracking target was not found.");
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      // 2. Query structural lines with key-in union separation parameters checks
      const result = await getEducations(activeId);

      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result ? result.error : "Failed compiling target academic traces from servers.");
      }

      // 3. Map values explicitly matching expected layout requirements
      setEducations(
        result.data.map((edu: any) => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy ?? undefined,
          grade: edu.grade ?? undefined,
          cgpa: edu.cgpa ?? undefined,
          location: edu.location ?? undefined,
          institutionImage: edu.institutionImage ?? undefined,
          logoUrl: edu.logoUrl ?? undefined,
          startDate: edu.startDate ?? undefined,
          endDate: edu.endDate ?? undefined,
          currentlyStudying: !!edu.currentlyStudying,
          description: edu.description ?? undefined,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load academic records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    try {
      setProcessingId(id);
      setActionError(null);
      
      const result = await deleteEducation(id);
      
      if (!result.success) {
        throw new Error("error" in result ? result.error : "Downstream mutation dropped structural transaction frames.");
      }

      setEducations((prev) => prev.filter((e) => e.id !== id));
      setActiveConfirmDeleteId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to safely complete index record delete sequence.");
    } finally {
      setProcessingId(null);
    }
  }

  function handleEdit(edu: Education) {
    setEditData(edu);
    setOpenForm(true);
  }

  function handleAdd() {
    setEditData(null);
    setOpenForm(true);
  }

  // Pure functional computation filter and sort execution pipelines
  const filteredEducations = educations
    .filter((edu) => {
      const matchCriteria = `${edu.institution} ${edu.degree} ${edu.fieldOfStudy || ""} ${edu.location || ""}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.institution.localeCompare(b.institution);
      }
      // Sort newest qualifications first
      const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return timeB - timeA;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Re-indexing educational tracking timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Timeline Sync Interrupted</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
          <button 
            onClick={() => load(portfolioId)}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Timeline Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* PREMIUM ACTIONS CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <GraduationCap size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Education</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Manage your corporate training backgrounds, university degrees, secondary schools, and academic validation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {/* Layout View Mode Configuration Switches */}
          {educations.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950 p-0.5 text-zinc-500 hidden sm:flex">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Dashboard Layout"
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
            <span>Add Education</span>
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

      {/* FILTER CONTROL HUBS TOOLBAR */}
      {educations.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search by institution or degree..."
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
                <span className="text-[9px] sm:text-[10px]">Lexical</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TILES */}
      {filteredEducations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <FolderOpen size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {educations.length === 0 ? "Academic History Context Empty" : "No classifications resolved"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {educations.length === 0 
                ? "Your portfolio currently has no standalone educational data nodes mapped. Registering your collegiate history establishes immediate professional credibility."
                : "No matching institutional history found. Clear your filters to reload baseline arrays."
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (educations.length === 0) {
                handleAdd();
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
          >
            {educations.length === 0 ? "Map Core Academic History" : "Reset Structural Filters"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE SLIM STREAM LAYER */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredEducations.map((edu) => (
              <div 
                key={edu.id} 
                className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
              >
                {edu.currentlyStudying && (
                  <div className="absolute top-0 right-0 border-b border-l border-blue-500/10 bg-blue-500/5 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-blue-400 rounded-bl">
                    ACTIVE
                  </div>
                )}
                
                <div className="space-y-1 pr-12">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words">{edu.institution}</h4>
                  <p className="text-[10px] font-semibold text-zinc-400 break-words leading-tight">{edu.degree}</p>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1.5 text-[10px] font-mono text-zinc-500">
                    {edu.location && (
                      <span className="flex items-center gap-1 max-w-[150px] truncate">
                        <MapPin size={9} className="shrink-0 text-zinc-600" />
                        <span className="truncate">{edu.location}</span>
                      </span>
                    )}
                    {(edu.cgpa || edu.grade) && (
                      <span className="text-zinc-400 font-bold">
                        {edu.cgpa ? `CGPA: ${edu.cgpa}` : `Grade: ${edu.grade}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {activeConfirmDeleteId === edu.id ? (
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
                          disabled={processingId === edu.id}
                          onClick={() => handleDelete(edu.id)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === edu.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          <span>Purge</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-[9px] font-mono text-zinc-600">
                        {edu.startDate ? new Date(edu.startDate).getFullYear() : "Init"} — {edu.currentlyStudying ? "Present" : (edu.endDate ? new Date(edu.endDate).getFullYear() : "Term")}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(edu)}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-300 transition-colors"
                        >
                          <Edit3 size={10} className="text-zinc-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingId === edu.id}
                          onClick={() => setActiveConfirmDeleteId(edu.id)}
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

          {/* DESKTOP RESPONSIVE CONFIGURATIONS SYSTEM */}
          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 animate-fadeIn">
                {filteredEducations.map((edu) => (
                  <div key={edu.id} className="relative group">
                    <EducationCard
                      id={edu.id}
                      institution={edu.institution}
                      degree={edu.degree}
                      fieldOfStudy={edu.fieldOfStudy}
                      grade={edu.grade}
                      cgpa={edu.cgpa}
                      location={edu.location}
                      institutionImage={edu.institutionImage}
                      logoUrl={edu.logoUrl}
                      startDate={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : undefined}
                      endDate={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : undefined}
                      currentlyStudying={edu.currentlyStudying}
                      description={edu.description}
                      onEdit={() => handleEdit(edu)}
                      onDelete={() => setActiveConfirmDeleteId(edu.id)}
                    />

                    {/* INLINE CARD ELEMENT OVERLAY FOR GRID PRESENTATION */}
                    {activeConfirmDeleteId === edu.id && (
                      <div className="absolute inset-0 bg-black/95 border border-red-900/40 rounded-xl p-5 flex flex-col justify-between z-30 animate-fadeIn">
                        <div className="flex items-start gap-3 text-red-400">
                          <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Purge Academic Record?</h4>
                            <p className="text-[11px] text-zinc-500 leading-normal">
                              This structural change will immediately decouple this historical credential profile trace from your metrics dashboard layer.
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
                            disabled={processingId === edu.id}
                            onClick={() => handleDelete(edu.id)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md transition-all inline-flex items-center gap-1 shadow-sm"
                          >
                            {processingId === edu.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
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
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Institution & Context</th>
                      <th className="py-3 px-4 font-bold">Degree Program</th>
                      <th className="py-3 px-4 font-bold">Location</th>
                      <th className="py-3 px-4 font-bold">Chronology Period</th>
                      <th className="py-3 px-4 font-bold">Grade Metric</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredEducations.map((edu) => (
                      <tr key={edu.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">{edu.institution}</div>
                          {edu.fieldOfStudy && <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 truncate max-w-xs">{edu.fieldOfStudy}</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-medium">
                          {edu.degree}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-medium">
                          {edu.location ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={11} className="text-zinc-600 shrink-0" />
                              <span className="truncate max-w-[120px]">{edu.location}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-zinc-600 shrink-0" />
                            <span>
                              {edu.startDate ? new Date(edu.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Init"} 
                              {" — "} 
                              {edu.currentlyStudying ? (
                                <span className="text-blue-400 font-semibold text-[10px] uppercase bg-blue-500/5 border border-blue-500/10 px-1 rounded">Active</span>
                              ) : (
                                edu.endDate ? new Date(edu.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Term"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-zinc-300">
                          {edu.cgpa || edu.grade ? (
                            <span>{edu.cgpa ? `CGPA: ${edu.cgpa}` : `Grade: ${edu.grade}`}</span>
                          ) : (
                            <span className="text-zinc-700 font-normal">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            {activeConfirmDeleteId !== edu.id && (
                              <button
                                type="button"
                                onClick={() => handleEdit(edu)}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                              >
                                Modify
                              </button>
                            )}

                            {/* INLINE ROW CONTEXT ACTION ELEMENT RECONCILIATION */}
                            {activeConfirmDeleteId === edu.id ? (
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
                                  disabled={processingId === edu.id}
                                  onClick={() => handleDelete(edu.id)}
                                  className="text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 shadow-sm"
                                >
                                  {processingId === edu.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                                  <span>Purge</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={processingId === edu.id}
                                onClick={() => setActiveConfirmDeleteId(edu.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2.5 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === edu.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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

      {/* FORM MODAL INTERACTIVE SURFACE CONTROLLER */}
      {openForm && (
        <EducationForm
          initialData={editData}
          portfolioId={portfolioId}
          onClose={() => {
            setOpenForm(false);
            setEditData(null);
          }}
          onSuccess={async () => {
            setOpenForm(false);
            setEditData(null);
            await load(portfolioId);
          }}
        />
      )}
    </div>
  );
}