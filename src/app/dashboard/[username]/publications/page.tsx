"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  BookOpen, 
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
  User,
  Edit3,
  Trash2,
  Check,
  AlertCircle
} from "lucide-react";

import PublicationForm from "@/components/forms/publication-form";
import PublicationCard from "@/components/cards/publication-card";

import {
  getPublications,
  deletePublication,
} from "@/actions/publication";

import { getMyPortfolioId } from "@/actions/portfolio";

type Publication = {
  id: string;
  portfolioId: string;

  title: string;
  journal?: string | null;
  publisher?: string | null;
  conference?: string | null;

  doi?: string | null;
  citations?: number | null;

  abstract?: string | null;

  publicationUrl?: string | null;
  pdfUrl?: string | null;

  publicationCover?: string | null;

  publicationDate?: Date | null;

  authors: string[];

  featured: boolean;
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
};

export default function PublicationsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [publications, setSections] = useState<Publication[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Publication | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // High-Grade SaaS View Layout, Search Filter, & Operation Safeguard States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"chronological" | "alphabetical">("chronological");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Mobile Confirmation Workflow Safeguard State
  const [mobileConfirmDeleteId, setMobileConfirmDeleteId] = useState<string | null>(null);

  const load = async (pId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let activeId = pId || portfolioId;
      
      // 1. Resolve master portfolio identifier envelope
      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error("error" in portfolioResult && typeof portfolioResult.error === "string" ? portfolioResult.error : "Portfolio context missing.");
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      // 2. Query publications list checking union types safely
      const result = await getPublications(activeId);

      if (!result || !result.success || !("data" in result) || !Array.isArray(result.data)) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed to load publications.");
      }

      // ✅ Safe Narrowing: Typescript understands result.data matches the expected array structure
      setSections(
        result.data.map((publication: any) => ({
          id: publication.id,
          portfolioId: publication.portfolioId,
          title: publication.title,
          journal: publication.journal ?? null,
          publisher: publication.publisher ?? null,
          conference: publication.conference ?? null,
          doi: publication.doi ?? null,
          citations: typeof publication.citations === "number" ? publication.citations : null,
          abstract: publication.abstract ?? null,
          publicationUrl: publication.publicationUrl ?? null,
          pdfUrl: publication.pdfUrl ?? null,
          publicationCover: publication.publicationCover ?? null,
          publicationDate: publication.publicationDate ? new Date(publication.publicationDate) : null,
          authors: Array.isArray(publication.authors) ? publication.authors : [],
          featured: !!publication.featured,
          displayOrder: typeof publication.displayOrder === "number" ? publication.displayOrder : 0,
          createdAt: new Date(publication.createdAt),
          updatedAt: new Date(publication.updatedAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load peer-reviewed publication indexes.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Mount core layout tracking metrics hooks
  useEffect(() => {
    (async () => {
      try {
        const result = await getMyPortfolioId();

        if (!result || !result.success || !result.data) {
          throw new Error("error" in result && typeof result.error === "string" ? result.error : "Portfolio validation tracer split.");
        }

        setPortfolioId(result.data);
        await load(result.data);
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
      const confirmDelete = window.confirm("Are you sure you want to decouple this publication record permanently?");
      if (!confirmDelete) return;
    }

    try {
      setProcessingId(id);
      setActionError(null);
      
      const result = await deletePublication(id);

      if (!result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Action execution failed.");
      }

      setSections((prev) => prev.filter((item) => item.id !== id));
      setMobileConfirmDeleteId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to safely purge selected research index node. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(publication: Publication) {
    setEditing(publication);
    setFormOpen(true);
  }

  async function handleSuccess() {
    setFormOpen(false);
    setEditing(null);
    await load(portfolioId);
  }

  const filteredPublications = publications
    .filter((pub) => {
      const matchCriteria = `${pub.title} ${pub.journal || ""} ${pub.publisher || ""} ${pub.conference || ""} ${pub.authors?.join(" ") || ""}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
      const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
      return dateB - dateA;
    });

  const isResearchIncomplete = publications.length > 0 && publications.some(p => !p.doi || !p.abstract || !p.publicationUrl);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center mx-3 sm:mx-auto">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Re-indexing peer-reviewed research papers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-none sm:rounded-xl border-y sm:border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Ecosystem Dynamic Sync Failure</h4>
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
    <div className="space-y-4 sm:space-y-6 text-white w-full max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      
      {/* PREMIUM ACTIONS CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <BookOpen size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Publications</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Manage your research papers, conference drafts, journal logs, and academic articles highlighted across public themes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {publications.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-zinc-500 hidden sm:flex">
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
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* COMPACT INLINE ACTION ERROR PANEL */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn w-full">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2">✕</button>
        </div>
      )}

      {/* RECOMMENDED FILL SYSTEM COMPLIANCE WELL */}
      {isResearchIncomplete && (
        <div className="rounded-xl border border-blue-500/10 bg-gradient-to-r from-blue-500/[0.03] to-transparent p-4 flex gap-2.5 items-start animate-fadeIn w-full">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-xs font-bold tracking-wide text-zinc-200">
              Missing Portfolio Resource Parameters Detected
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">
              We highly recommend filling all fields entirely. Attaching DOIs, abstracts, and direct manuscript links guarantees heavy academic verification weight which upgrades credibility.
            </p>
          </div>
        </div>
      )}

      {/* FILTER CONTROL HUBS TOOLBAR */}
      {publications.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search by title, publisher, co-authors..."
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

      {/* RENDER TILES */}
      {filteredPublications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <HelpCircle size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {publications.length === 0 ? "Publications Registry Empty" : "No classifications resolved"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2 w-full">
            <p>
              {publications.length === 0 
                ? "Your research paper milestones are clear. Registering journal index blocks or conference materials provides empirical reference matrices that establish rigorous domain authority."
                : "No matching registered publications found. Clear your active search filtering inputs to reset default catalogs."
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (publications.length === 0) {
                handleAdd();
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
          >
            {publications.length === 0 ? "Map Core Publication Node" : "Reset Active Filters"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE CONDENSED LIST LAYER */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredPublications.map((pub) => (
              <div 
                key={pub.id} 
                className="rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 space-y-3 shadow-sm relative overflow-hidden"
              >
                {pub.featured && (
                  <div className="absolute top-0 right-0 border-b border-l border-amber-500/10 bg-amber-500/5 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-amber-400 rounded-bl">
                    FEATURED
                  </div>
                )}
                
                <div className="space-y-1 pr-14">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words font-sans">{pub.title}</h4>
                  {(pub.journal || pub.conference || pub.publisher) && (
                    <p className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wide truncate">
                      {pub.journal || pub.conference || pub.publisher}
                    </p>
                  )}
                  {pub.authors && pub.authors.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 truncate mt-1">
                      <User size={10} className="shrink-0 text-zinc-600" />
                      <span className="truncate">{pub.authors.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {mobileConfirmDeleteId === pub.id ? (
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
                          disabled={processingId === pub.id}
                          onClick={() => handleDelete(pub.id, true)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === pub.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          <span>Execute</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-[9px] font-mono text-zinc-600">
                        {pub.publicationDate ? new Date(pub.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "—"}
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEdit(pub)}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-mono font-bold text-zinc-300 transition-colors"
                        >
                          <Edit3 size={10} className="text-zinc-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingId === pub.id}
                          onClick={() => handleDelete(pub.id)}
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
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 animate-fadeIn">
                {filteredPublications.map((publication) => (
                  <PublicationCard
                    key={publication.id}
                    {...publication}
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
                      <th className="py-3 px-4 font-bold">Research Paper / Article Title</th>
                      <th className="py-3 px-4 font-bold">Journal or Conference Environment</th>
                      <th className="py-3 px-4 font-bold">Primary Authors Log</th>
                      <th className="py-3 px-4 font-bold">Chronology Release</th>
                      <th className="py-3 px-4 font-bold">Highlight Scope</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredPublications.map((pub) => (
                      <tr key={pub.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">{pub.title}</div>
                          {pub.doi && <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 truncate max-w-xs">DOI: {pub.doi}</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate font-medium">
                          {pub.journal || pub.conference || pub.publisher || <span className="text-zinc-700 italic">Independent manuscript</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          {pub.authors && pub.authors.length > 0 ? (
                            <div className="flex items-center gap-1 text-zinc-400">
                              <User size={11} className="text-zinc-600 shrink-0" />
                              <span className="truncate max-w-[140px] font-medium">{pub.authors.join(", ")}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          {pub.publicationDate ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-zinc-700 shrink-0" />
                              <span>{new Date(pub.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-700">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                            pub.featured ? "bg-amber-500/5 border-amber-500/10 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                          }`}>
                            {pub.featured ? "FEATURED" : "STANDARD"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(pub)}
                              className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                            >
                              Modify
                            </button>
                            <button
                              type="button"
                              disabled={processingId === pub.id}
                              onClick={() => handleDelete(pub.id)}
                              className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                            >
                              {processingId === pub.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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

      {/* FORM HANDLER POPUP MODAL ARCHITECTURE CONTROLLER */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="max-h-[100vh] sm:max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl relative">
            
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono pr-4">
                  {editing ? "Modify Publication Parameters" : "Incorporate Peer-Reviewed Paper Node"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditing(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-zinc-950 border border-zinc-900 p-2.5 text-[10px] sm:text-[11px] text-zinc-400 flex gap-2 items-start hidden sm:flex mx-6 mt-4">
              <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-normal">
                We highly recommend completing all optional resource fields entirely. Providing code repository coordinates, functional specifications, and cover captures maximizes your project evaluation rank on your active public theme canvas template.
              </p>
            </div>

            <div className="w-full overflow-x-hidden px-0 sm:px-0">
              <PublicationForm
                portfolioId={editing?.portfolioId || portfolioId}
                initialData={editing ?? undefined}
                onSuccess={handleSuccess}
                onClose={() => {
                  setFormOpen(false);
                  setEditing(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}