"use client";

import React, { useState } from "react";
import {
  Edit3,
  Trash2,
  ExternalLink,
  Paperclip,
  Layers,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  FileText,
  Globe,
} from "lucide-react";

interface Props {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  attachmentUrl?: string | null;
  externalUrl?: string | null;
  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
}

export default function CustomSectionItemCard({
  title,
  subtitle,
  description,
  imageUrl,
  iconUrl,
  attachmentUrl,
  externalUrl,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasCustomImage = Boolean(imageUrl?.trim());
  const hasIcon = Boolean(iconUrl?.trim());

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group/custom-item relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)]">
      <div>
        {hasCustomImage && (
          <div className="relative h-44 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/50">
            <img
              src={imageUrl!.trim()}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/custom-item:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/10 to-transparent" />
          </div>
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {hasIcon ? (
                <div className="h-10 w-10 shrink-0 rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 flex items-center justify-center shadow-inner transition-colors group-hover/custom-item:border-zinc-700">
                  <img
                    src={iconUrl!.trim()}
                    alt=""
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ) : !hasCustomImage ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-colors group-hover/custom-item:text-blue-400 shadow-inner">
                  <Layers size={14} />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-zinc-200 text-sm sm:text-base tracking-tight break-words group-hover/custom-item:text-white transition-colors">
                  {title}
                </h3>

                {subtitle && (
                  <p className="text-xs font-semibold text-zinc-400 mt-1 break-words">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {!hasCustomImage && !hasIcon && (
            <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90">
              <ImageIcon size={12} className="shrink-0 text-blue-400" />
              <span className="truncate">
                We recommend adding an image or asset vector for layout visibility
              </span>
            </div>
          )}

          {description && (
            <div className="text-xs sm:text-sm leading-relaxed text-zinc-400 break-words whitespace-pre-wrap font-sans border-t border-zinc-900 pt-3 mt-2">
              {description}
            </div>
          )}

          {(externalUrl || attachmentUrl) && (
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900">
              <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-wider block">
                Attached Assets
              </span>

              <div className="flex flex-wrap gap-2">
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-zinc-200 text-zinc-400 px-3 py-2 text-xs font-medium transition-colors shadow-sm"
                  >
                    <Globe size={12} className="text-zinc-500" />
                    <span className="truncate max-w-[180px]">
                      {externalUrl.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                    <ExternalLink size={10} className="text-zinc-600 shrink-0" />
                  </a>
                )}

                {attachmentUrl && (
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-zinc-200 text-zinc-400 px-3 py-2 text-xs font-medium transition-colors shadow-sm"
                  >
                    <FileText size={12} className="text-emerald-500" />
                    <span>View Resource Document</span>
                    <Paperclip size={10} className="text-zinc-600 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="font-medium">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-955 p-2.5 animate-fadeIn">
            <p className="text-xs font-medium text-zinc-400 px-1 text-center">
              Confirm irreversible deletion sequence?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1.5 text-xs font-medium shadow-sm transition-colors focus:outline-none select-none"
              >
                {isDeleting ? <Loader2 size={12} className="animate-spin" /> : null}
                <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 py-1.5 text-xs font-medium transition-colors focus:outline-none select-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          (onEdit || onDelete) && (
            <div className="flex gap-2 border-t border-zinc-900/80 pt-3.5">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 text-xs font-medium transition-colors shadow-sm focus:outline-none select-none"
                >
                  <Edit3 size={12} className="text-zinc-500" />
                  <span>Edit Parameters</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none select-none"
                  title="Delete Item"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
