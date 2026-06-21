"use client";

import { useEffect, useState } from "react";
import AchievementCard from "@/components/cards/achievement-card";
import AchievementForm from "@/components/forms/achievement-form";
import { 
  Loader2, 
  Trophy, 
  Award, 
  Sparkles, 
  Plus, 
  X, 
  Terminal, 
  Grid, 
  List, 
  Search, 
  ArrowUpDown,
  AlertTriangle,
  Edit3,
  Trash2,
  Check,
  AlertCircle
} from "lucide-react";
import {
  getAchievements,
  deleteAchievement,
} from "@/actions/achievement";

type Achievement = {
  id: string;
  portfolioId: string;
  title: string;
  description?: string | null;
  issuer?: string | null;
  featured: boolean;
  achievementDate?: Date | null;
  certificateUrl?: string | null;
  imageUrl?: string | null;
  rank?: string | null;
  position?: string | null;
  displayOrder: number;
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Mobile Confirmation Workflow Safeguard State
  const [mobileConfirmDeleteId, setMobileConfirmDeleteId] = useState<string | null>(null);

  async function loadAchievements() {
    try {
      setLoading(true);
      const id = localStorage.getItem("portfolioId") ?? "";
      setPortfolioId(id);

      type GetAchievementsSuccess = {
  success: true;
  data: Achievement[];
};

const result = await getAchievements(id);

if (result.success) {
  setAchievements((result as GetAchievementsSuccess).data);
} else {
  setAchievements([]);
}
    } catch (error) {
      setActionError("Failed to pull achievement matrices from client scope.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, bypassPrompt = false) {
    if (processingId) return;
    
    const isMobile = window.innerWidth < 640;
    if (isMobile && !bypassPrompt) {
      setMobileConfirmDeleteId(id);
      return;
    }

    if (!isMobile) {
      const confirmDelete = window.confirm("Are you sure you want to delete this achievement record permanently?");
      if (!confirmDelete) return;
    }

    try {
      setProcessingId(id);
      setActionError(null);
      await deleteAchievement(id);
      setAchievements((prev) => prev.filter((item) => item.id !== id));
      setMobileConfirmDeleteId(null);
    } catch (error) {
      setActionError("Unable to safely purge the selected record. Please retry.");
    } finally {
      setProcessingId(null);
    }
  }

  useEffect(() => {
    loadAchievements();
  }, []);

  const filteredAchievements = achievements
    .filter((item) => {
      const targetQuery = `${item.title} ${item.issuer || ""} ${item.description || ""}`.toLowerCase();
      return targetQuery.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      const dateA = a.achievementDate ? new Date(a.achievementDate).getTime() : 0;
      const dateB = b.achievementDate ? new Date(b.achievementDate).getTime() : 0;
      return dateB - dateA;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 font-mono border border-white/5 rounded-2xl select-none p-4 text-center mx-3 sm:mx-auto">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Compiling achievement collections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-6 text-zinc-300 antialiased font-sans w-full overflow-x-hidden">
      
      {/* HEADER SECTION CHASSIS */}
      <div className="border-b border-zinc-900 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-0">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 font-mono text-[9px] uppercase tracking-widest mb-0.5">
            <Trophy size={9} className="text-blue-400" />
            <span>Honors Registry</span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
            Achievements
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium max-w-2xl leading-relaxed">
            Manage your verified competitive metrics, hackathon wins, honors, awards, and structural system recognitions.
          </p>
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          disabled={processingId !== null}
          className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-98 select-none shrink-0"
        >
          <Plus size={13} />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* ERROR HANDLER CONTEXT ACTION HUB BANNER */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-none sm:rounded-lg border-y sm:border border-red-500/10 bg-red-500/5 p-4 sm:p-3 text-xs text-red-400 animate-fadeIn w-full">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2">✕</button>
        </div>
      )}

      {/* SEARCH AND VIEW GRID TOOLBAR CONTROLS FILTER HUB */}
      {achievements.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4 px-4 sm:px-0">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input 
              type="text"
              placeholder="Search awards, issuers, or notes..."
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

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs shrink-0 mt-1 sm:mt-0">
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
                onClick={() => setSortBy("title")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded transition-all font-bold uppercase ${sortBy === "title" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
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
                title="Grid Presentation Matrix"
              >
                <Grid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Dense List Mapping"
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER STACK ROUTING HOOKS INTERFACES */}
      {filteredAchievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none sm:rounded-xl border-y sm:border border-dashed border-zinc-800 bg-zinc-950/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <Award size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {achievements.length === 0 ? "Achievements Section Empty" : "No tracking indices resolved"}
          </h3>
          
          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2">
            <p>
              {achievements.length === 0 
                ? "Your layout profile has no registered competitive honors, validation badges, or certification markers. Displaying your historical performance vectors builds immense authority context for recruiters."
                : "No matching registered award paths discovered. Clear your active search queries to reset grid matrices."
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (achievements.length === 0) {
                setOpenCreateModal(true);
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-3.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
          >
            {achievements.length === 0 ? "Map Core Honors Node" : "Clear Query Selection"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE SPECIFIC CONDENSED ITERATOR */}
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredAchievements.map((item) => (
              <div 
                key={item.id} 
                className="rounded-none border-y border-zinc-800 bg-[#0C0C0E] p-4 space-y-3 shadow-sm relative overflow-hidden"
              >
                {item.featured && (
                  <div className="absolute top-0 right-0 border-b border-l border-amber-500/10 bg-amber-500/5 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-amber-400 rounded-bl">
                    FEATURED
                  </div>
                )}
                
                <div className="space-y-1 pr-12">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug tracking-tight break-words">{item.title}</h4>
                  {item.issuer && (
                    <p className="text-[10px] font-medium text-zinc-500 truncate">{item.issuer}</p>
                  )}
                  {(item.rank || item.position) && (
                    <p className="text-[10px] font-mono font-semibold text-blue-400/90 truncate mt-0.5">
                      {[item.rank, item.position].filter(Boolean).join(" • ")}
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
                          disabled={processingId === item.id}
                          onClick={() => handleDelete(item.id, true)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === item.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          <span>Execute</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-[9px] font-mono text-zinc-600">
                        {item.achievementDate ? new Date(item.achievementDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "—"}
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedAchievement(item)}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-mono font-bold text-zinc-300 transition-colors"
                        >
                          <Edit3 size={10} className="text-zinc-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingId === item.id}
                          onClick={() => handleDelete(item.id)}
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

          {/* DESKTOP MATRIX DISPATCH VIEWER */}
          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
                {filteredAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    {...achievement}
                    description={achievement.description ?? undefined}
                    issuer={achievement.issuer ?? undefined}
                    achievementDate={achievement.achievementDate ?? undefined}
                    certificateUrl={achievement.certificateUrl ?? undefined}
                    imageUrl={achievement.imageUrl ?? undefined}
                    rank={achievement.rank ?? undefined}
                    position={achievement.position ?? undefined}
                    onEdit={() => setSelectedAchievement(achievement)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                      <th className="py-3 px-4 font-bold">Honor / Award Title</th>
                      <th className="py-3 px-4 font-bold">Issuer System</th>
                      <th className="py-3 px-4 font-bold">Rank / Placement</th>
                      <th className="py-3 px-4 font-bold">Chronology Log</th>
                      <th className="py-3 px-4 font-bold">Visibility Scope</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredAchievements.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors group/row">
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors truncate max-w-xs">{item.title}</div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 truncate max-w-xs font-medium">
                          {item.issuer || <span className="text-zinc-700 font-normal italic">Unset</span>}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px] font-semibold">
                          {item.rank || item.position ? (
                            <span className="truncate block max-w-[150px]">{[item.rank, item.position].filter(Boolean).join(" • ")}</span>
                          ) : (
                            <span className="text-zinc-700 font-normal">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          {item.achievementDate ? (
                            new Date(item.achievementDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                          ) : (
                            <span className="text-zinc-700">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                            item.featured ? "bg-amber-500/5 border-amber-500/10 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                          }`}>
                            {item.featured ? "FEATURED" : "STANDARD"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => setSelectedAchievement(item)}
                              className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                            >
                              Modify
                            </button>
                            <button
                              type="button"
                              disabled={processingId === item.id}
                              onClick={() => handleDelete(item.id)}
                              className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                            >
                              {processingId === item.id ? <Loader2 size={10} className="animate-spin" /> : "Purge"}
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

      {/* CREATE MODAL INTERACTIVE SURFACE CONTROLLER */}
      {openCreateModal && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full sm:max-w-3xl rounded-none sm:rounded-xl bg-[#0C0C0E] border-t sm:border border-zinc-800 p-0 text-white shadow-2xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto relative">
            
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" />
                <h2 className="text-xs sm:text-sm font-mono font-black uppercase text-white tracking-tight pr-4">
                  Create Achievement Node
                </h2>
              </div>
              <button
                onClick={() => setOpenCreateModal(false)}
                className="inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors font-mono text-xs focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="w-full overflow-x-hidden px-0 sm:px-0">
              <AchievementForm
                portfolioId={portfolioId}
                onSuccess={() => {
                  setOpenCreateModal(false);
                  loadAchievements();
                }}
                onCancel={() => setOpenCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL INTERACTIVE SURFACE CONTROLLER */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full sm:max-w-3xl rounded-none sm:rounded-xl bg-[#0C0C0E] border-t sm:border border-zinc-800 p-0 text-white shadow-2xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto relative">
            
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Terminal size={13} className="text-blue-400 shrink-0" />
                <h2 className="text-xs sm:text-sm font-mono font-black uppercase text-white tracking-tight truncate pr-4">
                  Edit Achievement Node: {selectedAchievement.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors font-mono text-xs shrink-0 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="w-full overflow-x-hidden px-0 sm:px-0">
              <AchievementForm
                portfolioId={portfolioId}
                initialData={{
                  id: selectedAchievement.id,
                  title: selectedAchievement.title,
                  description: selectedAchievement.description ?? undefined,
                  issuer: selectedAchievement.issuer ?? undefined,
                  featured: selectedAchievement.featured,
                  achievementDate: selectedAchievement.achievementDate ?? undefined,
                  certificateUrl: selectedAchievement.certificateUrl ?? undefined,
                  imageUrl: selectedAchievement.imageUrl ?? undefined,
                  rank: selectedAchievement.rank ?? undefined,
                  position: selectedAchievement.position ?? undefined,
                }}
                onSuccess={() => {
                  setSelectedAchievement(null);
                  loadAchievements();
                }}
                onCancel={() => setSelectedAchievement(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}