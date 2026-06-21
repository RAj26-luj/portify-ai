"use client";

import { useEffect, useState } from "react";
import { 
  Award, 
  Plus, 
  Loader2, 
  AlertTriangle, 
  HelpCircle, 
  Grid, 
  List, 
  Search, 
  X, 
  ArrowUpDown,
  Edit3,
  Trash2,
  Check,
  AlertCircle
} from "lucide-react";

import {
  getCertifications,
  deleteCertification,
} from "@/actions/certification";

import CertificationForm from "@/components/forms/certification-form";
import CertificationCard from "@/components/cards/certification-card";

type Certification = {
  id: string;
  portfolioId: string;

  name: string;
  issuer?: string | null;

  featured: boolean;

  credentialId?: string | null;
  issueDate?: Date | null;
  expiryDate?: Date | null;

  credentialUrl?: string | null;
  certificateImage?: string | null;
  certificatePdf?: string | null;

  skillsCovered: string[];

  createdAt: Date;
  updatedAt: Date;
};

export default function CertificatesPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);

  // Modern Enterprise Navigation, Filtering and Multi-Click Safeguards
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Tracks which card/row/mobile node is actively displaying its local inline confirmation state
  const [activeConfirmDeleteId, setActiveConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
const portfolioId = "";

      const result = await getCertifications(portfolioId);

if (result.success) {
  setCertifications(result.data as Certification[]);
} else {
  setCertifications([]);
}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load verification indexes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setProcessingId(id);
      setActionError(null);
      await deleteCertification(id);
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      setActiveConfirmDeleteId(null);
    } catch (error) {
      setActionError("Unable to safely purge credential record. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  function handleEdit(cert: Certification) {
    setEditing(cert);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleSuccess() {
    setFormOpen(false);
    setEditing(null);
    await load();
  }

  // Pure functional computation filter layout pipeline
  const filteredLetters = certifications
    .filter((cert) => {
      const matchCriteria = `${cert.name} ${cert.issuer || ""} ${cert.skillsCovered.join(" ")}`.toLowerCase();
      return matchCriteria.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      const dateA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
      const dateB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
      return dateB - dateA;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Re-indexing verification parameters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Index Synchronization Failure</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* HEADER SECTION HUB */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <Award size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Certifications</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Manage your verified external credentials, academic achievements, and industry badges inside your profile structure.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={processingId !== null}
          className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0"
        >
          <Plus size={13} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* ERROR HANDLER NOTIFICATION SURFACE */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2">✕</button>
        </div>
      )}

      {/* FILTERS AND VIEW SWITCH CONTROLLER GRID */}
      {certifications.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search by name, authority, or skills..."
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

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("date")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded transition-all font-bold uppercase ${sortBy === "date" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("name")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded transition-all font-bold uppercase ${sortBy === "name" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Lexical</span>
              </button>
            </div>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-zinc-500 hidden sm:flex">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Matrix Layout"
              >
                <Grid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="High-Density Compact Rows"
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MODAL ARCHITECTURE GRIDS OR INTERACTIVE EMPTY MECHANISMS */}
      {filteredLetters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <HelpCircle size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {certifications.length === 0 ? "Certifications Repository Unpopulated" : "No tracking tracks verified"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2">
            <p>
              {certifications.length === 0 
                ? "Your validation indices are clear. Registering corporate vendor certs provides immutable competency parameters that build strong enterprise validation layers."
                : "No matching registered credentials discovered. Clear your active filters to reset the baseline grid."
              }
            </p>
            {certifications.length === 0 && (
              <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-2.5 text-[10px] sm:text-[11px] text-zinc-400/90 text-left space-y-1.5 font-sans">
                <span className="font-bold text-blue-400 block uppercase font-mono tracking-wider text-[9px]">💡 Setup Framework Action Steps:</span>
                <p>1. Engage <strong className="text-zinc-200">Add Certificate</strong> above to mount the data schema interface overlay.</p>
                <p>2. Fill the verification key details along with the precise issuing platform node source coordinates.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (certifications.length === 0) {
                handleAdd();
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
          >
            {certifications.length === 0 ? "Map Core Verification Node" : "Clear Query Selection"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE CONDENSED ITERATOR INTERFACE LAYER */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredLetters.map((cert) => (
              <div 
                key={cert.id} 
                className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-2.5 shadow-sm relative overflow-hidden"
              >
                {cert.featured && (
                  <div className="absolute top-0 right-0 border-b border-l border-amber-500/10 bg-amber-500/5 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-amber-400 rounded-bl">
                    FEATURED
                  </div>
                )}
                
                <div className="space-y-1 pr-16">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words">{cert.name}</h4>
                  {cert.issuer && (
                    <p className="text-[10px] font-medium text-zinc-500 truncate">{cert.issuer}</p>
                  )}
                  {cert.skillsCovered.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skillsCovered.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[8px] font-mono">
                          {skill}
                        </span>
                      ))}
                      {cert.skillsCovered.length > 3 && <span className="text-[8px] text-zinc-600 font-mono mt-0.5">+{cert.skillsCovered.length - 3}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {activeConfirmDeleteId === cert.id ? (
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
                          disabled={processingId === cert.id}
                          onClick={() => handleDelete(cert.id)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === cert.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          <span>Purge</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-[9px] font-mono text-zinc-600">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "—"}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(cert)}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-300 transition-colors"
                        >
                          <Edit3 size={10} className="text-zinc-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingId === cert.id}
                          onClick={() => setActiveConfirmDeleteId(cert.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-red-950/20 bg-red-950/10 text-red-400 disabled:opacity-35 transition-colors"
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

          {/* DESKTOP METRIC LAYOUT COMPILATION INTERFACE LAYER */}
          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
                {filteredLetters.map((cert) => (
                  <div key={cert.id} className="relative group">
                    <CertificationCard
                      id={cert.id}
                      name={cert.name}
                      issuer={cert.issuer ?? undefined}
                      credentialId={cert.credentialId ?? undefined}
                      credentialUrl={cert.credentialUrl ?? undefined}
                      issueDate={cert.issueDate}
                      expiryDate={cert.expiryDate}
                      certificateImage={cert.certificateImage ?? undefined}
                      certificatePdf={cert.certificatePdf ?? undefined}
                      skillsCovered={cert.skillsCovered}
                      featured={cert.featured}
                      onEdit={handleEdit}
                      onDelete={(id) => setActiveConfirmDeleteId(id)}
                    />

                    {/* INLINE CARD ELEMENT OVERLAY FOR GRID PRESENTATION */}
                    {activeConfirmDeleteId === cert.id && (
                      <div className="absolute inset-0 bg-black/95 border border-red-900/40 rounded-xl p-5 flex flex-col justify-between z-30 animate-fadeIn">
                        <div className="flex items-start gap-3 text-red-400">
                          <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Purge Credential Parameter?</h4>
                            <p className="text-[11px] text-zinc-500 leading-normal">
                              This structural change will immediately erase this validated verification trace from your ecosystem metrics.
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
                            disabled={processingId === cert.id}
                            onClick={() => handleDelete(cert.id)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md transition-all inline-flex items-center gap-1 shadow-sm"
                          >
                            {processingId === cert.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
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
                      <th className="py-3 px-4 font-bold">Certification Module</th>
                      <th className="py-3 px-4 font-bold">Authority / Issuer</th>
                      <th className="py-3 px-4 font-bold">Credential Key Index</th>
                      <th className="py-3 px-4 font-bold">Chronology Period</th>
                      <th className="py-3 px-4 font-bold">Scope Parameters</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredLetters.map((cert) => (
                      <tr key={cert.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">{cert.name}</div>
                          {cert.skillsCovered.length > 0 && (
                            <span className="text-[10px] text-zinc-500 font-mono block truncate max-w-xs mt-0.5">
                              Skills: {cert.skillsCovered.slice(0, 3).join(", ")}{cert.skillsCovered.length > 3 ? "..." : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 truncate max-w-xs font-medium">
                          {cert.issuer || <span className="text-zinc-700 italic">Unset</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px] truncate max-w-[120px]">
                          {cert.credentialId || <span className="text-zinc-700">—</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          {cert.issueDate ? (
                            new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                          ) : (
                            <span className="text-zinc-700">Init</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                            cert.featured ? "bg-amber-500/5 border-amber-500/10 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                          }`}>
                            {cert.featured ? "FEATURED" : "STANDARD"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            {activeConfirmDeleteId !== cert.id && (
                              <button
                                type="button"
                                onClick={() => handleEdit(cert)}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                              >
                                Modify
                              </button>
                            )}

                            {/* INLINE ROW CONTEXT ACTION ELEMENT RECONCILIATION */}
                            {activeConfirmDeleteId === cert.id ? (
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
                                  disabled={processingId === cert.id}
                                  onClick={() => handleDelete(cert.id)}
                                  className="text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 shadow-sm"
                                >
                                  {processingId === cert.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                                  <span>Purge</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={processingId === cert.id}
                                onClick={() => setActiveConfirmDeleteId(cert.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2.5 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === cert.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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

      {/* FORM HANDLER POPUP MATRIX */}
      {formOpen && (
        <CertificationForm
          portfolioId=""
          initialData={editing}
          onSuccess={handleSuccess}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}