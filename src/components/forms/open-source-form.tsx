"use client";

import { useEffect, useState } from "react";
import { Loader2, Terminal, Calendar, Award, GitPullRequest, Layers, Image as ImageIcon, Globe, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createOpenSourceProject,
  updateOpenSourceProject,
} from "@/actions/open-source";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";

type TimelineItem = {
  id?: string;
  milestone: string;
  progress: number;
  description?: string;
};

type Props = {
  portfolioId: string;

  initialData?: {
    id?: string;
    repositoryName?: string;
    repositoryUrl?: string;
    pullRequestUrl?: string;
    pullRequestTitle?: string;
    issueTitle?: string;
    contributionTitle?: string;
    contributionType?: string;
    description?: string;
    impactMetrics?: string[];
    linesChanged?: string;
    coverImage?: string;
    architectureDiagrams?: string[];
    contributionScreenshots?: string[];
    status?:
      | "PLANNING"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "MAINTAINED";
    timeline?: TimelineItem[];
  };

  onSuccess?: () => void;
  onClose?: () => void;
};

export default function OpenSourceForm({
  portfolioId,
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { upload } = useUpload();

  const [repositoryName, setRepositoryName] = useState(initialData?.repositoryName ?? "");
  const [repositoryUrl, setRepositoryUrl] = useState(initialData?.repositoryUrl ?? "");
  const [pullRequestUrl, setPullRequestUrl] = useState(initialData?.pullRequestUrl ?? "");
  const [pullRequestTitle, setPullRequestTitle] = useState(initialData?.pullRequestTitle ?? "");
  const [issueTitle, setIssueTitle] = useState(initialData?.issueTitle ?? "");
  const [contributionTitle, setContributionTitle] = useState(initialData?.contributionTitle ?? "");
  const [contributionType, setContributionType] = useState(initialData?.contributionType ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [linesChanged, setLinesChanged] = useState(initialData?.linesChanged ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");

  const [impactMetrics, setImpactMetrics] = useState(
    initialData?.impactMetrics?.join("\n") ?? ""
  );

  const [architectureDiagrams, setArchitectureDiagrams] = useState<string[]>(
    initialData?.architectureDiagrams ?? []
  );

  const [contributionScreenshots, setContributionScreenshots] = useState<string[]>(
    initialData?.contributionScreenshots ?? []
  );

  const [status, setStatus] = useState<
    "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTAINED"
  >(initialData?.status ?? "PLANNING");

  // --- Timeline State Management ---
  const [timeline, setTimeline] = useState<TimelineItem[]>(
    initialData?.timeline ?? []
  );
  const [newMilestone, setNewMilestone] = useState("");
  const [newProgress, setNewProgress] = useState(0);
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");

  // High-fidelity validation interaction mapping states
  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Monitors state parameters for complete delta change evaluation
  useEffect(() => {
    const isRepoNameChanged = repositoryName.trim() !== (initialData?.repositoryName ?? "");
    const isRepoUrlChanged = repositoryUrl.trim() !== (initialData?.repositoryUrl ?? "");
    const isPrUrlChanged = pullRequestUrl.trim() !== (initialData?.pullRequestUrl ?? "");
    const isPrTitleChanged = pullRequestTitle.trim() !== (initialData?.pullRequestTitle ?? "");
    const isIssueChanged = issueTitle.trim() !== (initialData?.issueTitle ?? "");
    const isContribTitleChanged = contributionTitle.trim() !== (initialData?.contributionTitle ?? "");
    const isContribTypeChanged = contributionType.trim() !== (initialData?.contributionType ?? "");
    const isDescChanged = description.trim() !== (initialData?.description ?? "");
    const isLinesChanged = linesChanged.trim() !== (initialData?.linesChanged ?? "");
    const isCoverChanged = coverImage.trim() !== (initialData?.coverImage ?? "");
    const isMetricsChanged = impactMetrics.trim() !== (initialData?.impactMetrics?.join("\n") ?? "");
    const isStatusChanged = status !== (initialData?.status ?? "PLANNING");

    const areDiagramsChanged = JSON.stringify(architectureDiagrams) !== JSON.stringify(initialData?.architectureDiagrams ?? []);
    const areScreenshotsChanged = JSON.stringify(contributionScreenshots) !== JSON.stringify(initialData?.contributionScreenshots ?? []);
    const isTimelineChanged = JSON.stringify(timeline) !== JSON.stringify(initialData?.timeline ?? []);

    setHasChanges(
      isRepoNameChanged || isRepoUrlChanged || isPrUrlChanged || isPrTitleChanged ||
      isIssueChanged || isContribTitleChanged || isContribTypeChanged || isDescChanged ||
      isLinesChanged || isCoverChanged || isMetricsChanged || isStatusChanged ||
      areDiagramsChanged || areScreenshotsChanged || isTimelineChanged
    );
  }, [repositoryName, repositoryUrl, pullRequestUrl, pullRequestTitle, issueTitle, contributionTitle, contributionType, description, linesChanged, coverImage, impactMetrics, architectureDiagrams, contributionScreenshots, status, timeline, initialData]);

  // Reactive Custom Form Constraint Evaluation Flags
  const isRepoNameInvalid = repositoryName.trim() === "";
  const isRepoUrlInvalid = repositoryUrl.trim() !== "" && !repositoryUrl.trim().startsWith("http");
  const isPrUrlInvalid = pullRequestUrl.trim() !== "" && !pullRequestUrl.trim().startsWith("http");
  
  const isFormInvalid = isRepoNameInvalid || isRepoUrlInvalid || isPrUrlInvalid;

  const addTimelineItem = () => {
    if (!newMilestone.trim()) return;
    
    setTimeline((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        milestone: newMilestone.trim(),
        progress: Math.min(Math.max(Number(newProgress) || 0, 0), 100),
        description: newMilestoneDesc.trim() || undefined,
      },
    ]);

    setNewMilestone("");
    setNewProgress(0);
    setNewMilestoneDesc("");
  };

  const removeTimelineItem = (indexToRemove: number) => {
    setTimeline((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  async function handleMediaUpload(file: File, type: "image" | "document") {
    const res = await upload(
      file,
      CLOUDINARY_FOLDERS.openSource,
      type
    );
    return res.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        repositoryName: repositoryName.trim(),
        repositoryUrl: repositoryUrl.trim() || undefined,
        pullRequestUrl: pullRequestUrl.trim() || undefined,
        pullRequestTitle: pullRequestTitle.trim() || undefined,
        issueTitle: issueTitle.trim() || undefined,
        contributionTitle: contributionTitle.trim() || undefined,
        contributionType: contributionType.trim() || undefined,
        description: description.trim() || undefined,
        linesChanged: linesChanged.trim() || undefined,
        coverImage: coverImage.trim() || undefined,

        impactMetrics: impactMetrics
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),

        architectureDiagrams,
        contributionScreenshots,
        status,
        timeline,
      };

      if (initialData?.id) {
        await updateOpenSourceProject(initialData.id, payload);
      } else {
        await createOpenSourceProject({
          portfolioId,
          ...payload,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit open source upstream telemetry parameters:", error);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-lg border border-white/5 bg-[#0A0A0B] p-2.5 sm:p-3 text-zinc-200 placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] transition-all duration-200 disabled:opacity-40 shadow-inner font-sans";

  const labelStyle = 
    "mb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 group-hover/input:text-zinc-300 transition-colors";

  const descriptionStyle = 
    "text-[10px] sm:text-xs text-zinc-500 font-sans leading-normal block mt-1";

  const scrapeRecommendationStyle = 
    "text-[9px] sm:text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 mt-1 leading-normal flex items-start gap-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 select-none animate-fadeIn">
      
      {/* ELITE CYBERPUNK PREMIUM DARK SURFACED CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-xl space-y-4 sm:space-y-5 bg-[#0C0C0E] p-4 sm:p-6 text-zinc-300 rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/10 max-h-[92vh] overflow-y-auto font-sans selection:bg-blue-500/30 selection:text-white"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5 sm:pb-3">
          <div>
            <h2 className="font-black text-base sm:text-xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 tracking-tight flex items-center gap-1.5">
              <GitPullRequest size={18} className="text-blue-400 shrink-0" />
              <span>{initialData?.id ? "Edit Upstream Node" : "Register Upstream Node"}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 font-medium leading-tight font-mono uppercase tracking-wider">
              Log public open-source contributions telemetry
              {hasChanges && (
                <span className="ml-2 text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-normal">upstream_deltas</span>
              )}
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-zinc-500 hover:text-white transition-colors p-1 text-base sm:text-xl font-bold focus:outline-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* GUIDANCE INFO BLOCK */}
        <div className="bg-[#121214] border border-white/5 rounded-lg p-3 text-[11px] text-zinc-400 leading-relaxed font-sans">
          <strong className="text-zinc-200">Open-Source Upstream Matrix Node:</strong> Register pull requests, upstream core feature overrides, or subsystem refactors here. Document code mutations accurately to update your profile metrics graph.
        </div>

        {/* CORE PLATFORM IDENTIFIERS */}
        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Upstream Coordinates</h3>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Repository Identifier Namespace <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
              <div className="flex items-center gap-1.5">
                {isTouched && isRepoNameInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> missing_namespace</span>
                ) : repositoryName.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> linked</span>
                ) : null}
                <Terminal size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              value={repositoryName}
              onChange={(e) => setRepositoryName(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g., react, node, kubernetes"
              className={`w-full rounded-lg border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] text-xs sm:text-sm font-medium shadow-inner transition-all duration-200 ${isTouched && isRepoNameInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
              disabled={loading}
            />
            {isTouched && isRepoNameInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Field missing: Core repository tracking string token parameter must be provided.</p>
            )}
            <span className={descriptionStyle}>Provide the absolute focal workspace core framework directory token name string.</span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Target Repository Host Link <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <div className="flex items-center gap-1.5">
                {isTouched && isRepoUrlInvalid && (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> syntax_invalid</span>
                )}
                <Globe size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="https://github.com/facebook/react"
              className={`${inputStyle} ${isTouched && isRepoUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
              disabled={loading}
            />
            {isTouched && isRepoUrlInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Protocol failure: Target route must resolve using an absolute formatting configuration header (http:// or https://).</p>
            )}
          </div>
        </div>

        {/* RESTRUCTURING PATCH DATA METADATA */}
        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Patch Set Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Pull Request Title <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={pullRequestTitle}
                onChange={(e) => setPullRequestTitle(e.target.value)}
                placeholder="e.g., fix: resolve memory leak in engine"
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Pull Request URL Path <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
                {isTouched && isPrUrlInvalid && (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> syntax_invalid</span>
                )}
              </label>
              <input
                value={pullRequestUrl}
                onChange={(e) => setPullRequestUrl(e.target.value)}
                onBlur={() => setIsTouched(true)}
                placeholder="https://github.com/org/repo/pull/1"
                className={`${inputStyle} ${isTouched && isPrUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
                disabled={loading}
              />
              {isTouched && isPrUrlInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Protocol failure: Link vector must utilize an absolute http/https protocol header.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Upstream Issue Title <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="e.g., Lifecycle high memory consumption"
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Contribution Header <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={contributionTitle}
                onChange={(e) => setContributionTitle(e.target.value)}
                placeholder="e.g., Hydration Engine Patch"
                className={inputStyle}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Contribution Architecture Class <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={contributionType}
                onChange={(e) => setContributionType(e.target.value)}
                placeholder="e.g., Core Refactor, Feature, Bug Fix"
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Delta Code Lines Mutation <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={linesChanged}
                onChange={(e) => setLinesChanged(e.target.value)}
                placeholder="e.g., +142, -38"
                className={inputStyle}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Analytical Text Summary Description <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe mutation implications, technical constraints bypassed, and package dependency trees altered..."
              className={`${inputStyle} resize-none`}
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        {/* TIMELINE TRACKING WORKSPACE BLOCK */}
        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Upstream Pipeline Timeline Milestones <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></h3>
          
          {timeline.length > 0 && (
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {timeline.map((item, index) => (
                <div key={index} className="flex justify-between items-start bg-[#0A0A0B] border border-white/5 p-2 rounded-lg text-xs font-sans animate-fadeIn">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-zinc-200">{item.milestone}</span>
                    <span className="ml-1.5 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                      {item.progress}%
                    </span>
                    {item.description && <p className="text-[11px] text-zinc-500 font-sans leading-tight mt-0.5">{item.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTimelineItem(index)}
                    className="text-zinc-600 hover:text-red-400 p-0.5 transition"
                    disabled={loading}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="Step name (e.g., Code Review complete)"
                className="w-full text-xs rounded-lg border border-white/5 p-2 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none"
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="100"
                value={newProgress || ""}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                placeholder="Progress %"
                className="w-full text-xs rounded-lg border border-white/5 p-2 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <input
              value={newMilestoneDesc}
              onChange={(e) => setNewMilestoneDesc(e.target.value)}
              placeholder="Optional logs, notes, block status description..."
              className="flex-1 text-xs rounded-lg border border-white/5 p-2 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={addTimelineItem}
              className="bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-white rounded-lg text-xs font-mono font-bold px-3 py-2 shrink-0 h-8 flex items-center justify-center"
              disabled={loading}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* FILE PACK PAYLOAD MOUNT GRAPHICS */}
        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Upstream Media Assets</h3>

          {/* GOOGLE IMAGE ACQUISITION SCRAPER NOTIFICATION */}
          <div className={scrapeRecommendationStyle}>
            <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Emblem Mapping Advice:</strong> To render project logos or upstream repository cover blocks without manual file system arrays, perform a Google Image discovery query for the asset framework logo, execute <strong>&quot;Copy Image Address / URL&quot;</strong>, and link endpoints as needed.
            </span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Upstream System Cover Image <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await handleMediaUpload(file, "image");
                setCoverImage(url);
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {coverImage && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
                <img src={coverImage} alt="Project Cover" className="w-20 h-12 rounded object-cover opacity-80" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Architecture Diagrams <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <Layers size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await handleMediaUpload(file, "image");
                setArchitectureDiagrams((prev) => [...prev, url]);
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {architectureDiagrams.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-20 overflow-y-auto bg-[#0A0A0B] border border-white/5 p-1.5 rounded-lg">
                {architectureDiagrams.map((url, idx) => (
                  <div key={idx} className="relative shrink-0 animate-fadeIn">
                    <img src={url} alt="Diagram" className="w-12 h-12 object-cover rounded-md border border-white/5" />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setArchitectureDiagrams((p) => p.filter((_, i) => i !== idx))}
                      className="absolute -top-1.5 -right-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Contribution Verification Screenshots <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <ImageIcon size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await handleMediaUpload(file, "image");
                setContributionScreenshots((prev) => [...prev, url]);
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {contributionScreenshots.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-20 overflow-y-auto bg-[#0A0A0B] border border-white/5 p-1.5 rounded-lg">
                {contributionScreenshots.map((url, idx) => (
                  <div key={idx} className="relative shrink-0 animate-fadeIn">
                    <img src={url} alt="Screenshot" className="w-12 h-12 object-cover rounded-md border border-white/5" />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setContributionScreenshots((p) => p.filter((_, i) => i !== idx))}
                      className="absolute -top-1.5 -right-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* IMPACT PERFORMANCE MEASUREMENT MATRICES */}
        <div className="flex flex-col gap-1 border-t border-white/5 pt-4 group/input">
          <label className={labelStyle}>
            <span>Core Analytical Impact Metrics <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            <Award size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <textarea
            value={impactMetrics}
            onChange={(e) => setImpactMetrics(e.target.value)}
            rows={3}
            placeholder="e.g. Reduced payload package hydration response times by 15.4%&#10;Closed active infrastructure critical issue #402"
            className={`${inputStyle} resize-none`}
            disabled={loading}
          />
          <span className={descriptionStyle}>Log clear statements separated by newlines. (e.g. Architected full-stack validation logic reducing data errors).</span>
        </div>

        {/* PROJECT STATUS RUNTIME SECTOR */}
        <div className="flex flex-col gap-1 border-t border-white/5 pt-4 group/input">
          <label className={labelStyle}>
            <span>Upstream Component Operation Status <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className={`${inputStyle} text-zinc-400 color-scheme-dark`}
            disabled={loading}
          >
            <option value="PLANNING" className="bg-[#0C0C0E]">PLANNING</option>
            <option value="IN_PROGRESS" className="bg-[#0C0C0E]">IN_PROGRESS</option>
            <option value="COMPLETED" className="bg-[#0C0C0E]">COMPLETED</option>
            <option value="MAINTAINED" className="bg-[#0C0C0E]">MAINTAINED</option>
          </select>
        </div>

        {/* OPERATIONS DISPATCH TRIGGER DRAWERS */}
        <div className="pt-2 flex gap-2 border-t border-white/5">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white font-mono font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm transition-colors focus:outline-none border border-white/5"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold py-2.5 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_12px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] text-xs sm:text-sm focus:outline-none uppercase tracking-wider text-center"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin shrink-0" />
                <span>Syncing Open-Source Upstream Node...</span>
              </>
            ) : !hasChanges && initialData?.id !== undefined ? (
              "No Changes Detected"
            ) : initialData?.id ? (
              "Update Project Node"
            ) : (
              "Commit Upstream Project"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}