"use client";

import { useState, useEffect } from "react";
import { Loader2, Terminal, Layers, FileText, Image as ImageIcon, Link as LinkIcon, Globe, ShieldAlert, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createCustomSectionItem,
  updateCustomSectionItem,
} from "@/actions/custom-section-item";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";

interface Props {
  customSectionId: string;

  item?: {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    iconUrl?: string | null;
    attachmentUrl?: string | null;
    externalUrl?: string | null;
  };

  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CustomSectionItemForm({
  customSectionId,
  item,
  onSuccess,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [iconUrl, setIconUrl] = useState(item?.iconUrl ?? "");
  const [attachmentUrl, setAttachmentUrl] = useState(item?.attachmentUrl ?? "");
  const [externalUrl, setExternalUrl] = useState(item?.externalUrl ?? "");
  
  const [loading, setLoading] = useState(false);
  
  // Interactive Validation & Delta State Flags
  const [hasChanges, setHasChanges] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const { upload } = useUpload();

  // Monitors state parameters for deep delta mismatch evaluation
  useEffect(() => {
    const isTitleChanged = title.trim() !== (item?.title ?? "");
    const isSubtitleChanged = subtitle.trim() !== (item?.subtitle ?? "");
    const isDescChanged = description.trim() !== (item?.description ?? "");
    const isImageChanged = imageUrl.trim() !== (item?.imageUrl ?? "");
    const isIconChanged = iconUrl.trim() !== (item?.iconUrl ?? "");
    const isAttachmentChanged = attachmentUrl.trim() !== (item?.attachmentUrl ?? "");
    const isExternalChanged = externalUrl.trim() !== (item?.externalUrl ?? "");

    setHasChanges(
      isTitleChanged || isSubtitleChanged || isDescChanged || isImageChanged ||
      isIconChanged || isAttachmentChanged || isExternalChanged
    );
  }, [title, subtitle, description, imageUrl, iconUrl, attachmentUrl, externalUrl, item]);

  // Reactive Custom Form Constraint Evaluation Flags
  const isTitleInvalid = title.trim() === "";
  const isExternalUrlInvalid = externalUrl.trim() !== "" && !externalUrl.trim().startsWith("http://") && !externalUrl.trim().startsWith("https://");
  
  const isFormInvalid = isTitleInvalid || isExternalUrlInvalid;

  async function uploadImage(file: File) {
    const result = await upload(
      file,
      CLOUDINARY_FOLDERS.customSections,
      "image"
    );
    return result.url;
  }

  async function uploadDocument(file: File) {
    const result = await upload(
      file,
      CLOUDINARY_FOLDERS.customSections,
      "document"
    );
    return result.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && item?.id !== undefined) return;

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        iconUrl: iconUrl.trim() || undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
        externalUrl: externalUrl.trim() || undefined,
      };

      if (item?.id) {
        await updateCustomSectionItem(item.id, payload);
      } else {
        await createCustomSectionItem(customSectionId, payload);

        setTitle("");
        setSubtitle("");
        setDescription("");
        setImageUrl("");
        setIconUrl("");
        setAttachmentUrl("");
        setExternalUrl("");
        setIsTouched(false);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit custom section item updates:", error);
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
      {/* HEADER SECTION CONTEXT INFO */}
      <div className="bg-[#121214] border border-white/5 rounded-lg p-3 sm:p-4 mb-1">
        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Layers size={13} className="text-blue-400" />
          <span>Custom Block Component Workspace Layer</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Dynamically mount an active schema node item within this customized area container. Configure your item context blocks efficiently below. Only input files or parameters required for this node layer.
        </p>
      </div>

      {/* Input Group: Title */}
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Item Title / Heading <span className="text-red-400 font-sans font-bold">*(Required)</span>
          </span>
          <div className="flex items-center gap-1.5">
            {isTouched && isTitleInvalid ? (
              <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                <AlertCircle size={10} /> missing_title
              </span>
            ) : title.trim() ? (
              <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                <CheckCircle2 size={10} /> item_ready
              </span>
            ) : null}
            {hasChanges && (
              <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">edited</span>
            )}
            <Terminal size={10} className="text-zinc-700 hidden sm:block" />
          </div>
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="Example: Senior Software Engineer"
          disabled={loading}
          className={`${inputStyle} ${isTouched && isTitleInvalid ? "border-red-500/30 focus:border-red-500/50 bg-red-500/[0.01]" : ""}`}
        />
        {isTouched && isTitleInvalid && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
            ⚠️ Validation Error: Component heading element criteria not satisfied. Entry string can not be left empty.
          </p>
        )}
        <span className={descriptionStyle}>The main operational header identity mapping string for this data component. Displays as the primary card title layout field.</span>
      </div>

      {/* Input Group: Subtitle */}
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">Subtitle Node <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
        </label>

        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Example: Google • 2023 - Present"
          disabled={loading}
          className={inputStyle}
        />
        <span className={descriptionStyle}>Small supporting descriptive metric string metadata rendered directly below the prime header level.</span>
      </div>

      {/* Input Group: Description */}
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">Body Description Summary <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Write details, achievements, responsibilities, project information, etc."
          disabled={loading}
          className={`${inputStyle} resize-none`}
        />
        <span className={descriptionStyle}>The principal text segment core content payload users will parse inside your public matrix layout section views.</span>
      </div>

      {/* Main Image Segment */}
      <div className="border-t border-white/5 pt-4 sm:pt-5 space-y-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1">
            <ImageIcon size={12} className="text-blue-400" />
            <span>Focal Presentation Graphics</span>
          </h3>
          <span className={descriptionStyle}>Mount a prominent structural image layer payload to represent this system node block item.</span>
        </div>

        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span>Upload Main Image <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
          </label>

          <div className={scrapeRecommendationStyle}>
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Item Banner Scope:</strong> Displays as a full landscape display block image inside custom showcase nodes.
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadImage(file);
                setImageUrl(url);
              } catch {
                console.error("Image asset file upload pipeline exception.");
              }
              e.target.value = "";
            }}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />

          {imageUrl && (
            <div className="mt-2 p-1 rounded-lg border border-white/5 bg-[#0A0A0B] max-w-xs animate-fadeIn">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-28 sm:h-36 w-full rounded-md object-cover opacity-80"
              />
            </div>
          )}
        </div>
      </div>

      {/* Logo / Icon Segment */}
      <div className="border-t border-white/5 pt-4 sm:pt-5 space-y-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1">
            <Terminal size={12} className="text-blue-400" />
            <span>Logo Graphic Emblem Asset</span>
          </h3>
          <span className={descriptionStyle}>Provide an identity marker emblem, tool icon vector, or brand insignia node payload reference.</span>
        </div>

        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span>Upload Icon Vector File <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
          </label>

          <div className={scrapeRecommendationStyle}>
            <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Emblem Scrape Advice:</strong> If your asset resides on a remote channel network environment, find the logo via Google Images, execute <strong>&quot;Copy Image Address / URL&quot;</strong>, and paste the parameters string token directly down here.
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadImage(file);
                setIconUrl(url);
              } catch {
                console.error("Icon logo element file upload failure.");
              }
              e.target.value = "";
            }}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />

          {iconUrl && (
            <div className="mt-2 p-1 rounded-lg border border-white/5 bg-[#0A0A0B] w-fit shadow-sm animate-fadeIn">
              <img
                src={iconUrl}
                alt="Icon Preview"
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-md object-contain bg-zinc-950 p-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Links & Attachments Segment */}
      <div className="border-t border-white/5 pt-4 sm:pt-5 space-y-3.5 sm:space-y-4">
        <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1">
          <LinkIcon size={12} className="text-blue-400" />
          <span>External Hypermedia links & Document Attachments</span>
        </h3>

        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span>External Production Website URL <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            {isTouched && isExternalUrlInvalid && (
              <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">syntax_invalid</span>
            )}
          </label>

          <input
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="https://github.com/..."
            disabled={loading}
            className={`${inputStyle} ${isTouched && isExternalUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          />
          {isTouched && isExternalUrlInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Protocol warning: Link node path must resolve using an absolute formatting configuration header (http:// or https://).
            </p>
          )}
          <span className={descriptionStyle}>Link nodes leading out to active production environments, repositories, target certificate registries, or live sub-applications.</span>
        </div>

        <div className="space-y-1 group/input pt-1">
          <label className={labelStyle}>
            <span>Upload Supplementary Document Blob Attachment <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadDocument(file);
                setAttachmentUrl(url);
              } catch {
                console.error("Document asset context file pipeline upload failure.");
              }
              e.target.value = "";
            }}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />
          <span className={descriptionStyle}>Upload complementary context files (e.g. project reports, presentations, slide decks, whitepapers, or alternative resume documents).</span>

          {attachmentUrl && (
            <div className="mt-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
              <span>Attachment binary stream array uploaded successfully ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Button Configuration Desk */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white py-3 px-4 rounded-lg text-center focus:outline-none transition-all duration-200 order-2 sm:order-1 border border-white/5"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || isFormInvalid || (!hasChanges && item?.id !== undefined)}
          className="w-full sm:flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] focus:outline-none order-1 sm:order-2 h-11 text-center"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Syncing Node Layer...</span>
            </>
          ) : !hasChanges && item?.id !== undefined ? (
            "No Changes Detected"
          ) : item ? (
            "Update Item"
          ) : (
            "Add Item"
          )}
        </button>
      </div>
    </form>
  );
}