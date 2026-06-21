"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Quote, 
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
  UserCheck,
  Check,
  AlertCircle,
  Trash2,
  Globe,
  Info
} from "lucide-react";

import TestimonialCard from "@/components/cards/testimonial-card";
import TestimonialForm from "@/components/forms/testimonial-form";

import {
  getTestimonials,
  deleteTestimonial,
} from "@/actions/testimonial";

import { getMyPortfolioId } from "@/actions/portfolio";

type Testimonial = {
  id: string;
  portfolioId: string;
  authorName: string;
  authorRole?: string | null;
  company?: string | null;
  testimonial: string;
  profileImage?: string | null;
  linkedinUrl?: string | null;
  companyLogo?: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function TestimonialsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"chronological" | "alphabetical">("chronological");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Mobile Confirmation Workflow Safeguard State
  const [mobileConfirmDeleteId, setMobileConfirmDeleteId] = useState<string | null>(null);

  async function loadTestimonials(pId?: string) {
    try {
      setLoading(true);
      setError(null);

      let activeId = pId || portfolioId;
      
      // 1. Resolve master portfolio identifier from action return envelope safely
      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error("error" in portfolioResult && typeof portfolioResult.error === "string" ? portfolioResult.error : "Portfolio context tracing target missing.");
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      // 2. Query peer endorsement records safely using the contract wrapper parameters
      const result = await getTestimonials(activeId);

      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed to load testimonials database lines.");
      }

      // ✅ Safe Narrowing: Maps incoming row primitives strictly matching type bounds definitions
      setTestimonials(
        result.data.map((t: any) => ({
          id: t.id,
          portfolioId: t.portfolioId,
          authorName: t.authorName,
          authorRole: t.authorRole ?? null,
          company: t.company ?? null,
          testimonial: t.testimonial,
          profileImage: t.profileImage ?? null,
          linkedinUrl: t.linkedinUrl ?? null,
          companyLogo: t.companyLogo ?? null,
          featured: !!t.featured,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load testimonials database logs.");
    } finally {
      setLoading(false);
    }
  }

  // 3. Coordinate runtime assembly lifecycles checking core payload structures
  useEffect(() => {
    (async () => {
      try {
        const result = await getMyPortfolioId();

        if (!result || !result.success || !result.data) {
          throw new Error("error" in result && typeof result.error === "string" ? result.error : "Portfolio credential alignment failure.");
        }

        const id = result.data;
        setPortfolioId(id);
        await loadTestimonials(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to resolve active full-stack portfolio credentials token mapping.");
        setLoading(false);
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
      const confirmDelete = window.confirm("Are you sure you want to remove this testimonial recommendation permanently?");
      if (!confirmDelete) return;
    }

    try {
      setProcessingId(id);
      setActionError(null);
      
      const result = await deleteTestimonial(id);

      if (!result || !result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Purge sequence frame was rejected by datastore rules.");
      }
      
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
      }
      setMobileConfirmDeleteId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to safely purge selected testimonial index node. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(data: any) {
    setEditing(data as Testimonial);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSuccess() {
    closeForm();
    await loadTestimonials(portfolioId);
  }

  const filteredTestimonials = testimonials
    .filter((t) => {
      const matchCriteria = `${t.authorName} ${t.authorRole || ""} ${t.company || ""} ${t.testimonial}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.authorName.localeCompare(b.authorName);
      }
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

  const isShowcaseIncomplete = testimonials.length > 0 && testimonials.some(t => !t.linkedinUrl || !t.profileImage || !t.authorRole);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center mx-3 sm:mx-auto">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Synchronizing peer testimonials section...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 rounded-none sm:rounded-xl border-y sm:border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3.5 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Testimonial Data Extraction Failure</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
          <button 
            onClick={() => loadTestimonials(portfolioId)}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white w-full max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      
      {/* PREMIUM ACTIONS CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm shrink-0">
              <Quote size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Testimonials</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Manage external recommendations, client reviews, and peer endorsements to build professional credibility across public themes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {testimonials.length > 0 && (
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
            onClick={handleAdd}
            disabled={processingId !== null}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0 font-mono uppercase tracking-wider"
          >
            <Plus size={13} />
            <span>Add Testimonial</span>
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
        <div className="rounded-xl border border-blue-500/10 bg-gradient-to-r from-blue-500/[0.03] to-transparent p-4 flex gap-2.5 items-start animate-fadeIn w-full">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-xs font-bold tracking-wide text-zinc-200">
              Missing Testimonial Verification Parameters Detected
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">
              We highly recommend filling all fields entirely. Adding valid reference targets (<span className="text-zinc-400 font-mono text-[10px]">LinkedIn Reference URLs</span>), avatars (<span className="text-zinc-400 font-mono text-[10px]">Profile Images</span>), and specific corporate descriptions ensures a higher authenticity layer that helps recruiters validate entries.
            </p>
          </div>
        </div>
      )}

      {/* FILTER CONTROL HUBS TOOLBAR */}
      {testimonials.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search by author name, corporate role, or commentary text..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
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

      {/* MAIN LAYOUT DATA MATRIX CONTAINER */}
      <div className="space-y-8">
        {filteredTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
              <HelpCircle size={18} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
              {testimonials.length === 0 ? "Testimonials Section Unpopulated" : "No classifications resolved"}
            </h3>
            
            <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
              <p>
                {testimonials.length === 0 
                  ? "Your portfolio currently has no external client recommendations or peer endorsements recorded. Populate this section manually to build trust and validate your technical background skill set."
                  : "No matching testimonial logs found. Clear or adjust your text token criteria to reload default catalogs."
                }
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (testimonials.length === 0) {
                  setFormOpen(true);
                } else {
                  setSearchQuery("");
                }
              }}
              className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
            >
              {testimonials.length === 0 ? "Create First Testimonial Log" : "Reset Active Filters"}
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE COMPACT LIST LAYOUT */}
            <div className="block sm:hidden space-y-2.5 animate-fadeIn">
              {filteredTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 space-y-3 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {testimonial.profileImage ? (
                        <img 
                          src={testimonial.profileImage} 
                          alt={testimonial.authorName} 
                          className="w-6 h-6 rounded-full object-cover border border-zinc-800 shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold font-mono shrink-0">
                          {testimonial.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-zinc-200 truncate font-sans">{testimonial.authorName}</p>
                        <p className="text-[10px] text-zinc-500 truncate font-sans">
                          {testimonial.authorRole}{testimonial.company ? ` @ ${testimonial.company}` : ""}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-mono font-bold border shrink-0 ${
                      testimonial.featured ? "bg-amber-500/5 border-amber-500/10 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    }`}>
                      {testimonial.featured ? "FEATURED" : "STANDARD"}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 italic line-clamp-2 px-0.5 leading-relaxed font-sans">
                    “{testimonial.testimonial}”
                  </p>

                  <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900/60">
                    {mobileConfirmDeleteId === testimonial.id ? (
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
                            disabled={processingId === testimonial.id}
                            onClick={() => handleDelete(testimonial.id, true)}
                            className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                          >
                            {processingId === testimonial.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                            <span>Execute</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div>
                          {testimonial.linkedinUrl ? (
                            <a href={testimonial.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[10px]">
                              <Globe size={10} />
                              <span>Verified</span>
                            </a>
                          ) : (
                            <span className="text-zinc-700 italic font-mono text-[10px]">Unlinked</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEdit(testimonial)}
                            className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-mono font-bold text-zinc-300"
                          >
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            disabled={processingId === testimonial.id}
                            onClick={() => handleDelete(testimonial.id)}
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

            {/* DESKTOP ADVANCED MATRIX GRID DISPLAY LAYOUT */}
            <div className="hidden sm:block">
              {viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 animate-fadeIn">
                  {filteredTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      {...testimonial}
                      viewMode={viewMode}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                        <th className="py-3 px-4 font-bold">Endorsement Author Name</th>
                        <th className="py-3 px-4 font-bold">Designation / Corporate Node</th>
                        <th className="py-3 px-4 font-bold">Verbatim Snippet Abstract</th>
                        <th className="py-3 px-4 font-bold">Verification Path</th>
                        <th className="py-3 px-4 font-bold">Highlight Scope</th>
                        <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                      {filteredTestimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                          <td className="py-3.5 px-4 min-w-[180px]">
                            <div className="flex items-center gap-3">
                              {testimonial.profileImage ? (
                                <img 
                                  src={testimonial.profileImage} 
                                  alt={testimonial.authorName} 
                                  className="w-6 h-6 rounded-full object-cover border border-zinc-800"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold font-mono">
                                  {testimonial.authorName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-[140px]">{testimonial.authorName}</div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 font-medium max-w-[150px] truncate">
                            {testimonial.authorRole || <span className="text-zinc-700 italic">No Title</span>}
                            {testimonial.company && <span className="text-zinc-500 block text-[11px] truncate">@ {testimonial.company}</span>}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 italic max-w-[220px] truncate">
                            “{testimonial.testimonial}”
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                            {testimonial.linkedinUrl ? (
                              <a href={testimonial.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                <Globe size={11} />
                                <span>Verified</span>
                              </a>
                            ) : (
                              <span className="text-zinc-700 italic">Unlinked</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                              testimonial.featured ? "bg-amber-500/5 border-amber-500/10 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            }`}>
                              {testimonial.featured ? "FEATURED" : "STANDARD"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right shrink-0">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleEdit(testimonial)}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                              >
                                Modify
                              </button>
                              <button
                                type="button"
                                disabled={processingId === testimonial.id}
                                onClick={() => handleDelete(testimonial.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === testimonial.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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
      </div>

      {/* FORM HANDLER POPUP MODAL ARCHITECTURE CONTROLLER */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="max-h-[100vh] sm:max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-none sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl relative">
            
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono pr-4">
                  {editing ? "Modify Testimonial Parameters" : "Initialize New Testimonial Node Parameter Block"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-zinc-950 border border-zinc-900 p-3 text-[10px] sm:text-[11px] text-zinc-400 flex gap-2 items-start hidden sm:flex mx-6 mt-4">
              <UserCheck size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-normal">
                We highly recommend completing all optional resource fields entirely. Providing code repository credentials, functional specifications, and cover captures maximizes your verification status score.
              </p>
            </div>

            <div className="w-full overflow-x-hidden px-0 sm:px-0">
              <TestimonialForm
                portfolioId={portfolioId}
                initialData={editing ?? undefined}
                onSuccess={handleSuccess}
                onClose={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}