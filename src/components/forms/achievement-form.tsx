"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Terminal,
  Calendar,
  Award,
  FileText,
  Image as ImageIcon,
  Globe,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createAchievement, updateAchievement } from "@/actions/achievement";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";
import { deleteCloudinaryUrl } from "@/actions/upload";

type Props = {
  portfolioId: string;
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    issuer?: string;
    featured?: boolean;
    achievementDate?: string | Date | null;
    certificateUrl?: string;
    imageUrl?: string;
    rank?: string;
    position?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function AchievementForm({ portfolioId, initialData, onSuccess, onCancel }: Props) {
  const { upload } = useUpload();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [issuer, setIssuer] = useState(initialData?.issuer ?? "");
  const [achievementDate, setAchievementDate] = useState(
    initialData?.achievementDate
      ? new Date(initialData.achievementDate).toISOString().split("T")[0]
      : ""
  );
  const [certificateUrl, setCertificateUrl] = useState(initialData?.certificateUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [rank, setRank] = useState(initialData?.rank ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  const [loading, setLoading] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const isTitleChanged = title.trim() !== (initialData?.title ?? "");
    const isDescChanged = description.trim() !== (initialData?.description ?? "");
    const isIssuerChanged = issuer.trim() !== (initialData?.issuer ?? "");
    const isCertificateChanged = certificateUrl.trim() !== (initialData?.certificateUrl ?? "");
    const isImageChanged = imageUrl.trim() !== (initialData?.imageUrl ?? "");
    const isRankChanged = rank.trim() !== (initialData?.rank ?? "");
    const isPositionChanged = position.trim() !== (initialData?.position ?? "");
    const isFeaturedChanged = featured !== (initialData?.featured ?? false);

    const initialDateStr = initialData?.achievementDate
      ? new Date(initialData.achievementDate).toISOString().split("T")[0]
      : "";
    const isDateChanged = achievementDate !== initialDateStr;

    setHasChanges(
      isTitleChanged ||
        isDescChanged ||
        isIssuerChanged ||
        isDateChanged ||
        isCertificateChanged ||
        isImageChanged ||
        isRankChanged ||
        isPositionChanged ||
        isFeaturedChanged
    );
  }, [
    title,
    description,
    issuer,
    achievementDate,
    certificateUrl,
    imageUrl,
    rank,
    position,
    featured,
    initialData,
  ]);

  const isTitleInvalid = title.trim() === "";
  const isFormInvalid = isTitleInvalid;

  async function handleImageUpload(file: File) {
    if (imageUrl) {
      // Replace
      await deleteCloudinaryUrl(imageUrl, "image");
    }

    // Upload
    const result = await upload(file, CLOUDINARY_FOLDERS.gallery, "image");

    setImageUrl(result.url);
  }

  async function handleCertificateUpload(file: File) {
    if (certificateUrl) {
      // Replace
      await deleteCloudinaryUrl(certificateUrl, "raw");
    }

    // Upload
    const result = await upload(file, CLOUDINARY_FOLDERS.certificates, "document");

    setCertificateUrl(result.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        issuer: issuer.trim() || undefined,
        achievementDate: achievementDate ? new Date(achievementDate) : undefined,
        certificateUrl: certificateUrl.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        rank: rank.trim() || undefined,
        position: position.trim() || undefined,
        featured,
      };

      if (initialData?.id) {
        await updateAchievement(initialData.id, payload);
      } else {
        await createAchievement({
          portfolioId,
          ...payload,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit achievement configuration:", error);
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
      className="space-y-4 sm:space-y-6 text-zinc-300 bg-[#0C0C0E] p-4 sm:p-6 rounded-none sm:rounded-xl max-w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans select-none animate-fadeIn"
    >
      <div className="bg-[#121214] border border-white/5 rounded-lg p-3 sm:p-4 mb-1">
        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Award size={13} className="text-blue-400" />
          <span>Achievement Node Context Configuration</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Configure an achievement item record to populate your live public portfolio showcase graph
          workspace layer.
        </p>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Achievement Title
            <span className="text-red-400 font-sans font-bold">*(Required)</span>
          </span>
          <div className="flex items-center gap-1">
            {isTouched && isTitleInvalid ? (
              <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                <AlertCircle size={10} /> missing_title_index
              </span>
            ) : title.trim() ? (
              <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                <CheckCircle2 size={10} /> ready
              </span>
            ) : null}
            {hasChanges && (
              <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">
                edited
              </span>
            )}
            <Terminal size={10} className="text-zinc-700 hidden sm:block" />
          </div>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="Google Hackathon Winner"
          className={`${inputStyle} ${isTouched && isTitleInvalid ? "border-red-500/30 focus:border-red-500/50 bg-red-500/[0.01]" : ""}`}
          disabled={loading}
        />
        {isTouched && isTitleInvalid && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5 flex items-center gap-1">
            ⚠️ Validation Exception: Focal title schema cannot be initialized as an empty element
            payload string.
          </p>
        )}
        <span className={descriptionStyle}>
          Provide the absolute focal identifier index designation string of your victory or honor
          stack item milestone record. Displays as primary header title text on cards.
        </span>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Description Summary{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </span>
          <span className="text-[9px] font-mono text-zinc-600 font-normal normal-case">
            {description.length} chars uploaded
          </span>
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe achievement parameters and technological schema benchmarks..."
          className={`${inputStyle} resize-none`}
          disabled={loading}
        />
        <span className={descriptionStyle}>
          Detail competitive environment parameters, tech stack schemas, and execution team scale
          configurations. Shows up under content preview segments on public pages.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span className="flex items-center gap-1">
              Issuer Agency{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            {issuer.trim() && (
              <span className="text-[8px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1 rounded">
                tracked
              </span>
            )}
          </label>
          <input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="Google"
            className={inputStyle}
            disabled={loading}
          />
        </div>
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span className="flex items-center gap-1">
              Achievement Date{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            <Calendar size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <input
            type="date"
            value={achievementDate}
            onChange={(e) => setAchievementDate(e.target.value)}
            className={`${inputStyle} text-zinc-400 h-10 sm:h-auto`}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span>
              Competitive Rank{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <input
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="e.g., Global Rank: 24,748"
            className={inputStyle}
            disabled={loading}
          />
        </div>
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span>
              Placement Position{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Winner / 1st Place"
            className={inputStyle}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
          Verification Assets Layer
        </h3>

        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span className="flex items-center gap-1">
              Credential Certificate File{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            <div className="flex items-center gap-1">
              {certificateUrl && (
                <span className="text-[9px] font-mono text-emerald-400 lowercase bg-emerald-500/5 border border-emerald-500/10 px-1 py-0.5 rounded">
                  file_active
                </span>
              )}
              <FileText size={10} className="text-zinc-700" />
            </div>
          </label>
          <input
            type="file"
            accept=".pdf,image/*"
            disabled={loading}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleCertificateUpload(file);
            }}
          />
          {certificateUrl && (
            <a
              href={certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 text-xs font-mono underline block mt-1"
            >
              // view_uploaded_certificate_payload
            </a>
          )}
        </div>

        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span className="flex items-center gap-1">
              Achievement Graphic Badge Asset{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            <ImageIcon size={10} className="text-zinc-700 hidden sm:block" />
          </label>

          <div className={scrapeRecommendationStyle}>
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Badge Image Scope:</strong> Renders as an illustrative brand logo overlay
              inside the main item cards grid component views. To grab asset layouts dynamically
              without device disk storage pipelines, find the issuer entity logo on Google Images,
              execute <strong>&quot;Copy Image Address / URL&quot;</strong>, and pass the string
              parameter right here.
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleImageUpload(file);
            }}
          />
          {imageUrl && (
            <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
              <img
                src={imageUrl}
                alt="Badge Preview"
                className="h-12 w-12 rounded object-contain opacity-80"
              />
            </div>
          )}
        </div>
      </div>

      <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 rounded-lg border border-white/5 bg-[#0A0A0B]/60 p-3 transition-colors hover:bg-[#0A0A0B] cursor-pointer group">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          disabled={loading}
          className="rounded border-white/10 bg-zinc-900 text-blue-600 w-4 h-4 mt-0.5 sm:mt-0 cursor-pointer"
        />
        <span className="font-mono text-[10px] sm:text-[12px] font-bold uppercase text-zinc-400 group-hover:text-zinc-300 transition-colors">
          Promote as Featured Core Asset Node
        </span>
      </label>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:flex-1 bg-[#121214] hover:bg-[#161619] border border-white/5 text-zinc-400 hover:text-white py-3 px-4 rounded-lg text-center focus:outline-none transition-all duration-200 order-2 sm:order-1"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
          className="w-full sm:flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md text-center flex items-center justify-center h-11 focus:outline-none order-1 sm:order-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 className="animate-spin shrink-0" size={13} />
              <span>Syncing Node Instance...</span>
            </span>
          ) : !hasChanges && initialData?.id !== undefined ? (
            "No Changes Detected"
          ) : initialData?.id ? (
            "Update Achievement"
          ) : (
            "Commit Node Instance"
          )}
        </button>
      </div>
    </form>
  );
}
