"use client";

import { useState, useEffect } from "react";
import { Loader2, Terminal, Share2, Globe, Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createSocialLink,
  updateSocialLink,
} from "@/actions/social-link";

type Props = {
  portfolioId: string;
  initialData?: {
    id?: string;
    platform?: string;
    username?: string;
    url?: string;
    iconUrl?: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export default function SocialLinkForm({
  portfolioId,
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const [platform, setPlatform] = useState(initialData?.platform ?? "");
  const [username, setUsername] = useState(initialData?.username ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [iconUrl, setIconUrl] = useState(initialData?.iconUrl ?? "");
  
  const [loading, setLoading] = useState(false);

  // High-fidelity validation interaction mapping states
  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track global dataset property deltas to safely configure form interaction buttons
  useEffect(() => {
    const isPlatformChanged = platform.trim() !== (initialData?.platform ?? "");
    const isUsernameChanged = username.trim() !== (initialData?.username ?? "");
    const isUrlChanged = url.trim() !== (initialData?.url ?? "");
    const isIconUrlChanged = iconUrl.trim() !== (initialData?.iconUrl ?? "");

    setHasChanges(isPlatformChanged || isUsernameChanged || isUrlChanged || isIconUrlChanged);
  }, [platform, username, url, iconUrl, initialData]);

  // Reactive Custom Form Constraint Evaluation Flagging
  const isPlatformInvalid = platform.trim() === "";
  const isUrlInvalid = url.trim() === "" || !url.trim().startsWith("http");
  const isFormInvalid = isPlatformInvalid || isUrlInvalid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        platform: platform.trim(),
        username: username.trim() || undefined,
        url: url.trim(),
        iconUrl: iconUrl.trim() || undefined,
      };

      if (initialData?.id) {
        await updateSocialLink(initialData.id, payload);
      } else {
        await createSocialLink({
          portfolioId,
          ...payload,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit social gateway node configurations:", error);
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5 text-zinc-300 bg-[#0C0C0E] p-4 sm:p-6 rounded-xl border border-white/10 max-w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans select-none animate-fadeIn"
    >
      {/* HEADER SECTION CONTEXT INFO */}
      <div className="bg-[#121214] border border-white/5 rounded-lg p-3 sm:p-4 mb-1">
        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Share2 size={14} className="text-blue-400" />
          <span>Social Network Edge Node Configuration</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Mount routing links pointing outward to your community coordinates (e.g. GitHub, LinkedIn, Twitter). Register clean URLs to properly map your outward profile presentation matrix.
        </p>
      </div>

      {/* Platform */}
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">Network Platform Name <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
          <div className="flex items-center gap-1.5">
            {isTouched && isPlatformInvalid ? (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> missing_namespace</span>
            ) : platform.trim() ? (
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> brand_mapped</span>
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
          placeholder="GitHub, LinkedIn, Twitter..."
          className={`${inputStyle} ${isTouched && isPlatformInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          disabled={loading}
        />
        {isTouched && isPlatformInvalid && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Structural parameter missing: Network name mapping identity string required.</p>
        )}
        <span className={descriptionStyle}>Specify the platform namespace accurately to initialize proper identity markers.</span>
      </div>

      {/* Username */}
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span>Handle / Username <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
        </label>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. raj_kumar_sharma"
          className={inputStyle}
          disabled={loading}
        />
        <span className={descriptionStyle}>Your unique localized handle code on this network layout.</span>
      </div>

      {/* URL */}
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span>Absolute Profile URL Link <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
          <div className="flex items-center gap-1.5">
            {isTouched && isUrlInvalid ? (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> broken_vector</span>
            ) : url.trim() && !isUrlInvalid ? (
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> link_resolved</span>
            ) : null}
            <LinkIcon size={10} className="text-zinc-700 hidden sm:block" />
          </div>
        </label>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="https://github.com/username"
          className={`${inputStyle} ${isTouched && isUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          disabled={loading}
        />
        {isTouched && isUrlInvalid && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Network error: Target address string must match an absolute http/https URI layout syntax.</p>
        )}
        <span className={descriptionStyle}>The structural target hyperlink route vector directly referencing your profile account.</span>
      </div>

      {/* Unified Media Control Sector */}
      <div className="space-y-3 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div>
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Platform Insignia Asset
          </h3>
          <span className={descriptionStyle}>Configure a tool, brand vector, or networking logo layer block.</span>
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>Icon Vector Endpoint Address <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
          </label>

          <input
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://example.com/logo.svg"
            className={inputStyle}
            disabled={loading}
          />

          {/* GOOGLE IMAGE REFERENCE ASSET ACQUISITION PROTOCOL INSTRUCTIONS */}
          <div className={scrapeRecommendationStyle}>
            <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Vector Logo Acquisition Protocol:</strong> We highly recommend searching for the specific network logo (e.g. GitHub SVG, LinkedIn vector icon) on Google Images, Simple Icons, or Wikipedia. Right-click the element asset frame, execute <strong>&quot;Copy Image Address / URL&quot;</strong>, and paste the clean token path string directly inside this input block.
            </span>
          </div>

          {iconUrl && (
            <div className="mt-2.5 p-1 rounded-lg border border-white/5 bg-[#0A0A0B] w-fit shadow-inner animate-fadeIn">
              <img
                src={iconUrl}
                alt="Platform Icon"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-md object-contain bg-white p-1.5 opacity-90"
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls Save Action Trigger Bar */}
      <div className="flex gap-2.5 pt-2 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white py-2.5 px-4 rounded-lg transition-colors border border-white/5 focus:outline-none"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
          className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-600/50 disabled:shadow-none shadow-md hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all duration-200 focus:outline-none text-center"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Syncing Gateway...</span>
            </>
          ) : !hasChanges && initialData?.id !== undefined ? (
            "No Changes Detected"
          ) : initialData?.id ? (
            "Update Social Link"
          ) : (
            "Create Social Link"
          )}
        </button>
      </div>
    </form>
  );
}