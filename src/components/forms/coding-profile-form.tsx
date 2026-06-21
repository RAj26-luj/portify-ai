"use client";

import { useState, useEffect } from "react";
import { Loader2, Terminal, Trophy, Award, BarChart2, Globe, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createCodingProfile,
  updateCodingProfile,
} from "@/actions/coding-profile";

type Props = {
  portfolioId: string;
  initialData?: {
    id?: string;
    platform?: string;
    username?: string;
    profileUrl?: string;
    iconUrl?: string;
    currentRating?: number;
    maxRating?: number;
    rank?: string;
    globalRank?: string;
    problemsSolved?: number;
    contestsAttended?: number;
    activeSince?: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export default function CodingProfileForm({
  portfolioId,
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const [platform, setPlatform] = useState(initialData?.platform ?? "");
  const [username, setUsername] = useState(initialData?.username ?? "");
  const [profileUrl, setProfileUrl] = useState(initialData?.profileUrl ?? "");
  const [iconUrl, setIconUrl] = useState(initialData?.iconUrl ?? "");
  const [currentRating, setCurrentRating] = useState(initialData?.currentRating?.toString() ?? "");
  const [maxRating, setMaxRating] = useState(initialData?.maxRating?.toString() ?? "");
  const [rank, setRank] = useState(initialData?.rank ?? "");
  const [globalRank, setGlobalRank] = useState(initialData?.globalRank ?? "");
  const [problemsSolved, setProblemsSolved] = useState(initialData?.problemsSolved?.toString() ?? "");
  const [contestsAttended, setContestsAttended] = useState(initialData?.contestsAttended?.toString() ?? "");
  const [activeSince, setActiveSince] = useState(initialData?.activeSince ?? "");
  
  const [loading, setLoading] = useState(false);

  // Validation Tracker State Flags
  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setPlatform(initialData.platform ?? "");
    setUsername(initialData.username ?? "");
    setProfileUrl(initialData.profileUrl ?? "");
    setIconUrl(initialData.iconUrl ?? "");
    setCurrentRating(initialData.currentRating?.toString() ?? "");
    setMaxRating(initialData.maxRating?.toString() ?? "");
    setRank(initialData.rank ?? "");
    setGlobalRank(initialData.globalRank ?? "");
    setProblemsSolved(initialData.problemsSolved?.toString() ?? "");
    setContestsAttended(initialData.contestsAttended?.toString() ?? "");
    setActiveSince(initialData.activeSince ?? "");
  }, [initialData]);

  // Deep delta structural variance tracking engine
  useEffect(() => {
    const isPlatformChanged = platform.trim() !== (initialData?.platform ?? "");
    const isUsernameChanged = username.trim() !== (initialData?.username ?? "");
    const isProfileUrlChanged = profileUrl.trim() !== (initialData?.profileUrl ?? "");
    const isIconUrlChanged = iconUrl.trim() !== (initialData?.iconUrl ?? "");
    const isCurrentRatingChanged = currentRating !== (initialData?.currentRating?.toString() ?? "");
    const isMaxRatingChanged = maxRating !== (initialData?.maxRating?.toString() ?? "");
    const isRankChanged = rank.trim() !== (initialData?.rank ?? "");
    const isGlobalRankChanged = globalRank.trim() !== (initialData?.globalRank ?? "");
    const isProblemsChanged = problemsSolved !== (initialData?.problemsSolved?.toString() ?? "");
    const isContestsChanged = contestsAttended !== (initialData?.contestsAttended?.toString() ?? "");
    const isAoSChanged = activeSince.trim() !== (initialData?.activeSince ?? "");

    setHasChanges(
      isPlatformChanged || isUsernameChanged || isProfileUrlChanged || isIconUrlChanged ||
      isCurrentRatingChanged || isMaxRatingChanged || isRankChanged || isGlobalRankChanged ||
      isProblemsChanged || isContestsChanged || isAoSChanged
    );
  }, [platform, username, profileUrl, iconUrl, currentRating, maxRating, rank, globalRank, problemsSolved, contestsAttended, activeSince, initialData]);

  // Reactive Custom Input Constraint Evaluation Flags
  const isPlatformInvalid = platform.trim() === "";
  const isUsernameInvalid = username.trim() === "";
  const isProfileUrlInvalid = profileUrl.trim() === "" || !profileUrl.trim().startsWith("http");
  
  const isRatingInvalid = (currentRating !== "" && Number(currentRating) < 0) || (maxRating !== "" && Number(maxRating) < 0);
  const isMetricsInvalid = (problemsSolved !== "" && Number(problemsSolved) < 0) || (contestsAttended !== "" && Number(contestsAttended) < 0);

  const isFormInvalid = isPlatformInvalid || isUsernameInvalid || isProfileUrlInvalid || isRatingInvalid || isMetricsInvalid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        platform: platform.trim(),
        username: username.trim(),
        profileUrl: profileUrl.trim(),
        iconUrl: iconUrl.trim() || undefined,
        currentRating: currentRating ? Number(currentRating) : undefined,
        maxRating: maxRating ? Number(maxRating) : undefined,
        rank: rank.trim() || undefined,
        globalRank: globalRank.trim() || undefined,
        problemsSolved: problemsSolved ? Number(problemsSolved) : undefined,
        contestsAttended: contestsAttended ? Number(contestsAttended) : undefined,
        activeSince: activeSince.trim() || undefined,
      };

      if (initialData?.id) {
        await updateCodingProfile(initialData.id, payload);
      } else {
        await createCodingProfile({
          portfolioId,
          ...payload,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit profile changes:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 select-none animate-fadeIn">
      
      {/* ELITE CYBERPUNK PREMIUM DARK SURFACED CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-xl space-y-4 sm:space-y-5 bg-[#0C0C0E] p-4 sm:p-6 text-zinc-300 rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/10 max-h-[92vh] overflow-y-auto font-sans selection:bg-blue-500/30 selection:text-white"
      >
        {/* HEADER BLOCK */}
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5 sm:pb-3">
          <div>
            <h2 className="font-black text-base sm:text-xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 tracking-tight flex items-center gap-1.5">
              <Trophy size={16} className="text-blue-400 shrink-0 sm:w-5 sm:h-5" />
              <span>{initialData?.id ? "Edit Coding Profile" : "Add Coding Profile"}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 font-medium leading-tight font-mono uppercase tracking-wider">Keep track of your competitive programming metrics</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 text-base sm:text-xl font-bold focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* GUIDANCE INFO BLOCK */}
        <div className="bg-[#121214] border border-white/5 rounded-lg p-3 text-[11px] text-zinc-400 leading-relaxed font-sans">
          <strong className="text-zinc-200">Coding Profile Node Framework:</strong> Connect algorithmic judge nodes (e.g. CodeChef, LeetCode, Codeforces) to build dynamic metric telemetry layout structures on your dashboard.
        </div>

        {/* INPUT LAYOUT GROUPS */}
        <div className="space-y-3.5 sm:space-y-4">
          
          {/* SYSTEM IDENTIFIERS (REQUIRED BLOCK) */}
          <div className="space-y-3 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span>Platform Name <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
                <div className="flex items-center gap-1.5">
                  {isTouched && isPlatformInvalid ? (
                    <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                      <AlertCircle size={10} /> missing_platform
                    </span>
                  ) : platform.trim() ? (
                    <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                      <CheckCircle2 size={10} /> set
                    </span>
                  ) : null}
                  {hasChanges && (
                    <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">edited</span>
                  )}
                  <Terminal size={10} className="text-zinc-700 hidden sm:block" />
                </div>
              </label>
              <input
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                onBlur={() => setIsTouched(true)}
                placeholder="e.g. LeetCode, CodeChef"
                className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] text-xs sm:text-sm font-medium shadow-inner transition-all duration-200 ${isTouched && isPlatformInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                disabled={loading}
              />
              {isTouched && isPlatformInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                  ⚠️ Validation Alert: Platform identifier mapping required.
                </p>
              )}
              <span className="text-[10px] text-zinc-500 leading-tight">Specify the platform entity namespace accurately to establish a structural identifier index.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span>Handle / Username <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
                <div className="flex items-center gap-1">
                  {isTouched && isUsernameInvalid ? (
                    <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                      <AlertCircle size={10} /> missing_username
                    </span>
                  ) : username.trim() ? (
                    <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                      <CheckCircle2 size={10} /> linked
                    </span>
                  ) : null}
                </div>
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setIsTouched(true)}
                placeholder="e.g. competitive_programmer"
                className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] text-xs sm:text-sm font-medium shadow-inner transition-all duration-200 ${isTouched && isUsernameInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                disabled={loading}
              />
              {isTouched && isUsernameInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                  ⚠️ Validation Alert: Account reference handle string must be defined.
                </p>
              )}
              <span className="text-[10px] text-zinc-500 leading-tight">Your specific cryptographic verification identification nickname on this coding system.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span>Profile Address Link <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
                <div className="flex items-center gap-1">
                  {isTouched && isProfileUrlInvalid ? (
                    <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                      <AlertCircle size={10} /> invalid_url
                    </span>
                  ) : profileUrl.trim() && !isProfileUrlInvalid ? (
                    <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                      <CheckCircle2 size={10} /> valid_route
                    </span>
                  ) : null}
                </div>
              </label>
              <input
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                onBlur={() => setIsTouched(true)}
                placeholder="https://leetcode.com/username"
                className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] text-xs sm:text-sm font-medium shadow-inner transition-all duration-200 ${isTouched && isProfileUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                disabled={loading}
              />
              {isTouched && isProfileUrlInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                  ⚠️ Validation Alert: Profile link must resolve to a valid absolute URI address (http:// or https://).
                </p>
              )}
              <span className="text-[10px] text-zinc-500 leading-tight">The absolute source hypermedia target URL path linking directly to your verified coding account.</span>
            </div>
          </div>

          {/* PERFORMANCE RANKINGS (OPTIONAL BLOCK) */}
          <div className="space-y-3 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1">
              <Award size={11} className="shrink-0 text-zinc-600" />
              <span>Rankings & Ratings <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                  <span>Current Rating</span>
                  {isTouched && currentRating !== "" && Number(currentRating) < 0 && (
                    <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">bound_error</span>
                  )}
                </label>
                <input
                  type="number"
                  value={currentRating}
                  onChange={(e) => setCurrentRating(e.target.value)}
                  onBlur={() => setIsTouched(true)}
                  placeholder="e.g. 1520"
                  className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] text-xs sm:text-sm font-medium transition-all duration-200 ${isTouched && currentRating !== "" && Number(currentRating) < 0 ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                  <span>Peak Rating</span>
                  {isTouched && maxRating !== "" && Number(maxRating) < 0 && (
                    <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">bound_error</span>
                  )}
                </label>
                <input
                  type="number"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  onBlur={() => setIsTouched(true)}
                  placeholder="e.g. 1600"
                  className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] text-xs sm:text-sm font-medium transition-all duration-200 ${isTouched && maxRating !== "" && Number(maxRating) < 0 ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                  disabled={loading}
                />
              </div>
            </div>
            {isTouched && isRatingInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Arithmetic Warning: Performance metrics and competitive rating indexes cannot scale into negative integers.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Tier / Rank Name</label>
                <input
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g. Expert, 3-Star"
                  className="w-full rounded-lg border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 text-xs sm:text-sm font-medium transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Global Standings Rank</label>
                <input
                  value={globalRank}
                  onChange={(e) => setGlobalRank(e.target.value)}
                  placeholder="e.g. 24748"
                  className="w-full rounded-lg border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 text-xs sm:text-sm font-medium transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* ACTIVITY TRACKING (OPTIONAL BLOCK) */}
          <div className="space-y-3 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1">
              <BarChart2 size={11} className="shrink-0 text-zinc-600" />
              <span>Solved Counts & History <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                  <span>Problems Solved</span>
                  {isTouched && problemsSolved !== "" && Number(problemsSolved) < 0 && (
                    <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">bound_error</span>
                  )}
                </label>
                <input
                  type="number"
                  value={problemsSolved}
                  onChange={(e) => setProblemsSolved(e.target.value)}
                  onBlur={() => setIsTouched(true)}
                  placeholder="e.g. 300"
                  className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] text-xs sm:text-sm font-medium transition-all duration-200 ${isTouched && problemsSolved !== "" && Number(problemsSolved) < 0 ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                  <span>Contests Attended</span>
                  {isTouched && contestsAttended !== "" && Number(contestsAttended) < 0 && (
                    <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">bound_error</span>
                  )}
                </label>
                <input
                  type="number"
                  value={contestsAttended}
                  onChange={(e) => setContestsAttended(e.target.value)}
                  onBlur={() => setIsTouched(true)}
                  placeholder="e.g. 25"
                  className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 text-xs sm:text-sm font-medium transition-all duration-200 ${isTouched && contestsAttended !== "" && Number(contestsAttended) < 0 ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                  disabled={loading}
                />
              </div>
            </div>
            {isTouched && isMetricsInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Structural Validation Failure: Activity counters and competitive test metrics cannot host negative values.
              </p>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Active Since</label>
              <input
                value={activeSince}
                onChange={(e) => setActiveSince(e.target.value)}
                placeholder="e.g. January 2024"
                className="w-full rounded-lg border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 text-xs sm:text-sm font-medium transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* PLATFORM BRANDING PREFERENCES */}
          <div className="space-y-3 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1">
              <Globe size={11} className="shrink-0 text-zinc-600" />
              <span>Platform Icon Preferences</span>
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                Platform Icon Image URL <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span>
              </label>

              <input
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 text-xs sm:text-sm font-medium transition-all duration-200"
                disabled={loading}
              />

              {/* ASSET ACQUISITION HINT FOR ICON UPLOADS */}
              <p className="text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 leading-normal">
                <strong>Icon Address Acquisition Protocol:</strong> We highly recommend searching for the specific brand vector logo (e.g. Codeforces logo, LeetCode SVG) on Google Images, Wikipedia, or Simple Icons. Right-click the element and select <strong>&quot;Copy Image Address / URL&quot;</strong>, then paste the clean string token into this input box.
              </p>

              {iconUrl && (
                <div className="mt-1.5 p-1 bg-white border border-white/10 rounded w-fit shadow-sm animate-fadeIn">
                  <img
                    src={iconUrl}
                    alt="Platform Icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded"
                  />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CONTROLS SAVE ACTION TRIGGER BAR */}
        <div className="pt-2 flex gap-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white font-mono font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm transition-colors focus:outline-none border border-white/5"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-[0_4px_12px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] text-xs sm:text-sm focus:outline-none uppercase tracking-wider font-mono text-center"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin shrink-0" />
                <span>Syncing Metrics...</span>
              </>
            ) : !hasChanges && initialData?.id !== undefined ? (
              "No Changes Detected"
            ) : initialData?.id ? (
              "Update Profile"
            ) : (
              "Save Profile Details"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}