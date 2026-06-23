"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Code2,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  FolderOpen,
  ExternalLink,
  Search,
  X,
  ArrowUpDown,
  TrendingUp,
  Award,
  Edit3,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react";

import { deleteCodingProfile, getCodingProfiles } from "@/actions/coding-profile";

import { getMyPortfolioId } from "@/actions/portfolio";

import CodingProfileCard from "@/components/cards/coding-profile-card";
import CodingProfileForm from "@/components/forms/coding-profile-form";

type CodingProfile = {
  id: string;
  platform: string;
  username: string;

  profileUrl: string | null;

  iconName: string | null;
  iconUrl: string | null;

  iconSource: "LIBRARY" | "USER_UPLOAD" | "DEFAULT_ICON" | null;

  currentRating: number | null;
  maxRating: number | null;

  rank: string | null;
  globalRank: string | null;

  problemsSolved: number | null;
  contestsAttended: number | null;

  activeSince: string | null;
};

export default function CodingProfilesPage() {
  const params = useParams();
  const username = params?.username as string;

  const [profiles, setProfiles] = useState<CodingProfile[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CodingProfile | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"platform" | "rating">("platform");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [activeConfirmDeleteId, setActiveConfirmDeleteId] = useState<string | null>(null);

  async function loadProfiles(pId?: string) {
    try {
      setLoading(true);
      setError(null);

      let activeId = pId || portfolioId;

      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult.success || !portfolioResult.data) {
          setProfiles([]);
          return;
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      const result = await getCodingProfiles(activeId);

      if (result.success && Array.isArray(result.data)) {
        setProfiles(result.data);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sync your algorithm platform parameters. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteProfile = async (id: string) => {
    try {
      setProcessingId(id);
      setActionError(null);
      await deleteCodingProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      setActiveConfirmDeleteId(null);
    } catch (err) {
      setActionError("Execution failure: Unable to safely remove target node profile.");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await getMyPortfolioId();

        if (result.success && result.data) {
          setPortfolioId(result.data);
          await loadProfiles(result.data);
        }
      } catch {
        setError("Failed to resolve active portfolio schema context.");
      }
    })();
  }, [username]);

  const filteredProfiles = profiles
    .filter((profile) => {
      const matchText =
        `${profile.platform} ${profile.username} ${profile.rank || ""}`.toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.currentRating || 0) - (a.currentRating || 0);
      }
      return a.platform.localeCompare(b.platform);
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] space-y-4 p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 animate-spin z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-zinc-500 font-mono uppercase">
          Reindexing coding profile ecosystem...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            Ecosystem Decoupling Sync Defect
          </h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed font-sans break-words">
            {error}
          </p>
          <button
            onClick={() => loadProfiles(portfolioId)}
            className="w-full sm:w-auto inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Connection Sequence
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
            <div className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400">
              <Code2 size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">
              Coding Profiles
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Synchronize and display your execution scores, contest parameters, ratings and solved
            metrics across online judge platform nodes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {profiles.length > 0 && (
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
            disabled={processingId !== null}
            onClick={() => {
              setSelectedProfile(null);
              setShowForm(true);
            }}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-md transition-all active:scale-98 select-none shrink-0"
          >
            <Plus size={13} />
            <span>Add Profile</span>
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

      {profiles.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search platform handles..."
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

          <div className="flex items-center gap-2.5 justify-end shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("platform")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "platform" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Brand</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("rating")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase transition-all ${sortBy === "rating" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Tier Rating</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
            <FolderOpen size={18} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
            {profiles.length === 0
              ? "Coding Profiles Context Empty"
              : "No tracking coordinates resolved"}
          </h3>

          <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-2">
            <p>
              {profiles.length === 0
                ? "Your layout schema currently has no linked judges. Integrating platforms creates auto-updating telemetry metrics that prove problem-solving capabilities."
                : "No matching online judge tracks found. Clear your active filters to reset configurations."}
            </p>
            {profiles.length === 0 && (
              <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-2.5 text-[10px] sm:text-[11px] text-zinc-400/90 text-left space-y-1.5 font-sans">
                <span className="font-bold text-blue-400 block uppercase font-mono tracking-wider text-[9px]">
                  💡 Setup Guide Protocol:
                </span>
                <p>
                  1. Tap <strong className="text-zinc-200">Add Profile</strong> above to launch your
                  backend schema form panel.
                </p>
                <p>2. Input handle details along with specific global milestones.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (profiles.length === 0) {
                setShowForm(true);
              } else {
                setSearchQuery("");
              }
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-semibold transition-colors shadow-sm"
          >
            {profiles.length === 0 ? "Map Core Judging Profiles" : "Reset Filtering Queries"}
          </button>
        </div>
      ) : (
        <>
          <div className="block sm:hidden space-y-2.5 animate-fadeIn">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="p-3.5 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative h-6 w-6 shrink-0 rounded border border-zinc-800 bg-zinc-950 p-1 flex items-center justify-center">
                    {profile.iconUrl?.trim() ? (
                      <img
                        src={profile.iconUrl.trim()}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Code2 size={10} className="text-zinc-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <h4 className="text-xs font-bold text-zinc-100 truncate">
                        {profile.platform}
                      </h4>
                      {profile.currentRating != null && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded px-1.5">
                          ★ {profile.currentRating}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                      @{profile.username}
                    </p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] font-mono text-zinc-400">
                      {profile.problemsSolved != null && (
                        <span>
                          Solved:{" "}
                          <strong className="text-zinc-200">{profile.problemsSolved}</strong>
                        </span>
                      )}
                      {(profile.globalRank || profile.rank) && (
                        <span className="text-zinc-500 truncate max-w-[140px]">
                          Rank: {profile.globalRank || profile.rank}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-900">
                  {activeConfirmDeleteId === profile.id ? (
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
                          disabled={processingId === profile.id}
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="h-6 rounded bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 inline-flex items-center gap-1"
                        >
                          {processingId === profile.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Check size={10} />
                          )}
                          <span>Purge</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <a
                        href={profile.profileUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-6 items-center justify-center px-2 rounded border border-zinc-800 bg-zinc-950 text-[10px] text-zinc-400 hover:text-zinc-200"
                      >
                        <ExternalLink size={10} className="mr-1" />
                        <span>Link</span>
                      </a>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProfile(profile);
                            setShowForm(true);
                          }}
                          className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-300"
                        >
                          <Edit3 size={10} className="text-zinc-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingId === profile.id}
                          onClick={() => setActiveConfirmDeleteId(profile.id)}
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

          <div className="hidden sm:block">
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
                {filteredProfiles.map((profile) => (
                  <div key={profile.id} className="relative group">
                    <CodingProfileCard
                      id={profile.id}
                      platform={profile.platform}
                      username={profile.username}
                      profileUrl={profile.profileUrl ?? "#"}
                      iconUrl={profile.iconUrl ?? undefined}
                      currentRating={profile.currentRating ?? undefined}
                      maxRating={profile.maxRating ?? undefined}
                      rank={profile.rank ?? undefined}
                      globalRank={profile.globalRank ?? undefined}
                      problemsSolved={profile.problemsSolved ?? undefined}
                      contestsAttended={profile.contestsAttended ?? undefined}
                      activeSince={profile.activeSince ?? undefined}
                      onEdit={() => {
                        setSelectedProfile(profile);
                        setShowForm(true);
                      }}
                      onDelete={() => setActiveConfirmDeleteId(profile.id)}
                    />

                    {activeConfirmDeleteId === profile.id && (
                      <div className="absolute inset-0 bg-black/95 border border-red-900/40 rounded-xl p-5 flex flex-col justify-between z-30 animate-fadeIn">
                        <div className="flex items-start gap-3 text-red-400">
                          <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                              Decouple Coding Profile?
                            </h4>
                            <p className="text-[11px] text-zinc-500 leading-normal">
                              This structural change will immediately isolate this active judging
                              platform handle from your profile portfolio metrics layer.
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
                            disabled={processingId === profile.id}
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md transition-all inline-flex items-center gap-1 shadow-sm"
                          >
                            {processingId === profile.id ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Check size={10} />
                            )}
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
                      <th className="py-3 px-4 font-bold">Platform / Provider</th>
                      <th className="py-3 px-4 font-bold">Handle Target</th>
                      <th className="py-3 px-4 font-bold">Current Rating</th>
                      <th className="py-3 px-4 font-bold">Algorithmic Solved</th>
                      <th className="py-3 px-4 font-bold">Global Ranking Tier</th>
                      <th className="py-3 px-4 font-bold text-right">Operational HUD Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                    {filteredProfiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="hover:bg-zinc-900/30 transition-colors group/row"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <a
                              href={profile.profileUrl ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative h-7 w-7 shrink-0 rounded border border-zinc-800 bg-zinc-950 p-1 flex items-center justify-center transition-all hover:border-blue-500/40 hover:bg-zinc-900 group/icon cursor-pointer overflow-hidden shadow-inner"
                            >
                              {profile.iconUrl?.trim() ? (
                                <img
                                  src={profile.iconUrl.trim()}
                                  alt=""
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <Code2
                                  size={11}
                                  className="text-zinc-500 group-hover/icon:text-blue-400"
                                />
                              )}
                            </a>
                            <div>
                              <span className="font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors block">
                                {profile.platform}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px] font-semibold">
                          @{profile.username}
                        </td>
                        <td className="py-3.5 px-4">
                          {profile.currentRating != null ? (
                            <div className="flex items-center gap-1 text-zinc-300 font-mono font-bold">
                              <TrendingUp size={11} className="text-zinc-600 shrink-0" />
                              <span>{profile.currentRating}</span>
                              {profile.maxRating != null && (
                                <span className="text-[10px] text-zinc-600 font-normal">
                                  / {profile.maxRating} max
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-zinc-300">
                          {profile.problemsSolved != null ? (
                            <span>{profile.problemsSolved.toLocaleString()} tasks</span>
                          ) : (
                            <span className="text-zinc-700 font-normal">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {profile.globalRank || profile.rank ? (
                            <div className="flex items-center gap-1.5 text-zinc-400 max-w-[150px] truncate">
                              <Award size={12} className="text-zinc-600 shrink-0" />
                              <span className="truncate">{profile.globalRank || profile.rank}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-700 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right shrink-0">
                          <div className="flex items-center justify-end gap-2.5">
                            {activeConfirmDeleteId !== profile.id && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProfile(profile);
                                  setShowForm(true);
                                }}
                                className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                              >
                                Modify
                              </button>
                            )}

                            {activeConfirmDeleteId === profile.id ? (
                              <div className="flex items-center gap-1.5 animate-fadeIn">
                                <span className="text-[10px] text-red-400 font-mono mr-1 font-bold animate-pulse">
                                  Confirm Purge?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveConfirmDeleteId(null)}
                                  className="text-[11px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded border border-zinc-800 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={processingId === profile.id}
                                  onClick={() => handleDeleteProfile(profile.id)}
                                  className="text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 shadow-sm"
                                >
                                  {processingId === profile.id ? (
                                    <Loader2 size={10} className="animate-spin" />
                                  ) : (
                                    <Check size={10} />
                                  )}
                                  <span>Purge</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={processingId === profile.id}
                                onClick={() => setActiveConfirmDeleteId(profile.id)}
                                className="text-[11px] font-semibold text-red-500/90 hover:text-red-400 transition-colors bg-red-950/10 hover:bg-red-950/20 px-2.5 py-1 rounded border border-red-900/10 disabled:opacity-35 inline-flex items-center justify-center min-w-[50px]"
                              >
                                {processingId === profile.id ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  "Purge"
                                )}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-xl rounded-t-2xl sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-6 text-white shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedProfile(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 border-b border-zinc-900/80 pb-3 sticky top-0 bg-[#0C0C0E] z-10">
              <Code2 size={14} className="text-blue-400" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono">
                {selectedProfile ? "Modify Judge Parameters" : "Connect Judge Profile"}
              </h2>
            </div>

            <CodingProfileForm
              portfolioId={portfolioId}
              initialData={
                selectedProfile
                  ? {
                      id: selectedProfile.id,
                      platform: selectedProfile.platform,
                      username: selectedProfile.username,
                      profileUrl: selectedProfile.profileUrl ?? undefined,
                      iconUrl: selectedProfile.iconUrl ?? undefined,
                      currentRating: selectedProfile.currentRating ?? undefined,
                      maxRating: selectedProfile.maxRating ?? undefined,
                      rank: selectedProfile.rank ?? undefined,
                      globalRank: selectedProfile.globalRank ?? undefined,
                      problemsSolved: selectedProfile.problemsSolved ?? undefined,
                      contestsAttended: selectedProfile.contestsAttended ?? undefined,
                      activeSince: selectedProfile.activeSince ?? undefined,
                    }
                  : undefined
              }
              onSuccess={() => {
                setShowForm(false);
                setSelectedProfile(null);
                loadProfiles(portfolioId);
              }}
              onClose={() => {
                setShowForm(false);
                setSelectedProfile(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
