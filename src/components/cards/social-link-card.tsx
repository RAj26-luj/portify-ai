"use client";

import React, { useState } from "react";
import { 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";

interface Props {
  id?: string;
  platform: string;
  username?: string;
  url: string;
  iconName?: string;
  iconUrl?: string;
  iconSource?: "LIBRARY" | "USER_UPLOAD" | "DEFAULT_ICON";

  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
}

// Universal premium fallback brand network placeholder image asset
const DEFAULT_SOCIAL_LOGO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQcCsMhg-kB5Lcs7m_nDBYp4ltBjDF12AqXq1CCuR2TA&s=10";

export default function SocialLinkCard({
  platform,
  username,
  url,
  iconName,
  iconUrl,
  iconSource,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasLogo = Boolean(iconUrl?.trim());
  const activeLogo = hasLogo ? iconUrl!.trim() : DEFAULT_SOCIAL_LOGO;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove link connection. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getBrandAccentStyles = () => {
    const checkString = platform.toLowerCase();
    if (checkString.includes("github")) return "group-hover/social-card:text-white group-hover/social-card:border-zinc-700";
    if (checkString.includes("linkedin")) return "group-hover/social-card:text-blue-400 group-hover/social-card:border-blue-500/30";
    if (checkString.includes("twitter") || checkString.includes("x")) return "group-hover/social-card:text-zinc-200 group-hover/social-card:border-zinc-800";
    if (checkString.includes("youtube")) return "group-hover/social-card:text-red-500 group-hover/social-card:border-red-500/20";
    return "group-hover/social-card:text-blue-400 group-hover/social-card:border-zinc-700";
  };

  return (
    <>
      {/* MOBILE COMPACT LIST ROW VIEW */}
      <div className="block sm:hidden p-3.5 rounded-xl border border-zinc-950 bg-[#070709] hover:bg-zinc-900/10 transition-all duration-200 w-full">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-1 flex items-center justify-center mt-0.5">
              <img
                src={activeLogo}
                alt={`${platform} connection graphic`}
                className="h-full w-full object-contain rounded"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-zinc-200 truncate">
                {platform}
              </h3>
              {username ? (
                <p className="text-[10px] font-mono text-zinc-500 truncate">
                  @{username}
                </p>
              ) : (
                <p className="text-[10px] font-mono text-zinc-600 truncate">
                  {url.replace(/https?:\/\/(www\.)?/, "")}
                </p>
              )}
            </div>
          </div>

          {/* Mobile HUD Controls Action Suite */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-zinc-500 hover:text-blue-400 transition-colors"
              title="Visit External URL"
            >
              <ExternalLink size={12} />
            </a>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
              >
                <Edit3 size={12} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                title="Purge Connection"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Action Error Banner Layer for Mobile */}
        {errorFeedback && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md border border-red-500/10 bg-red-500/5 p-1.5 text-[10px] text-red-400">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {/* Mobile Deletion Shield Confirmation Dialog Drawer */}
        {showDeleteConfirm && (
          <div className="mt-3 p-2 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 animate-fadeIn">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">Sever Connection?</span>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex h-6 px-2.5 items-center justify-center bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white text-[10px] font-bold rounded shadow-sm transition-colors"
              >
                {isDeleting ? "..." : "Sever"}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex h-6 px-2.5 items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-bold rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LAPTOP & DESKTOP FULL PRESENTATION CARD RUNTIME */}
      {/* Note: Added h-full class definition to allow absolute height alignment configuration along the container grid tracks */}
      <div className="hidden sm:flex group/social-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] w-full max-w-sm mx-auto h-full">
        
        {/* Isolated flex stack layout layer splits content sections uniformly away from button footers */}
        <div className="space-y-4 flex-1 flex flex-col justify-start">
          {/* Core Header Architecture Focusing fully on immediate Recognition */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-zinc-900 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-2 flex items-center justify-center shadow-inner transition-colors group-hover/social-card:border-zinc-700">
                <img
                  src={activeLogo}
                  alt={`${platform} connection graphic`}
                  className="h-full w-full object-contain rounded-md"
                  loading="lazy"
                />
              </div>
              
              <div className="min-w-0">
                <h3 className="font-bold text-zinc-100 text-sm sm:text-base tracking-tight truncate group-hover/social-card:text-white transition-colors">
                  {platform}
                </h3>
                {username && (
                  <p className="text-xs font-mono text-zinc-500 truncate mt-0.5">
                    @{username}
                  </p>
                )}
              </div>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 text-xs font-medium transition-colors shadow-sm shrink-0"
            >
              <span>Visit</span>
              <ExternalLink size={11} className="text-zinc-600" />
            </a>
          </div>

          {/* Dynamic Visual Optimization Recommendation Prompt */}
          {!hasLogo && (
            <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 shrink-0 select-none">
              <ImageIcon size={12} className="shrink-0 text-blue-400" />
              <span className="truncate">We recommend assigning a brand asset vector icon for better visibility</span>
            </div>
          )}

          {/* Structured Data Details Panel Grid Layout - Absorbs empty baseline tracking space smoothly */}
          <div className="rounded-xl border border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-zinc-900/5 p-3.5 space-y-2.5 text-xs shadow-inner mt-auto">
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider text-zinc-600 uppercase font-mono">
                <span>Target Connection Endpoint</span>
              </span>
              <p className="break-all font-mono text-zinc-400 pl-0.5 selection:bg-blue-500/30">
                {url}
              </p>
            </div>

            {(iconName || iconSource) && (
              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-zinc-900/60 text-[10px] font-mono text-zinc-500">
                {iconName && (
                  <div className="truncate pl-0.5">
                    <span className="text-zinc-600 block text-[9px] uppercase tracking-tight font-sans">Glyph Asset</span>
                    <span className="text-zinc-400 font-medium truncate block">{iconName}</span>
                  </div>
                )}
                {iconSource && (
                  <div className="truncate pl-0.5">
                    <span className="text-zinc-600 block text-[9px] uppercase tracking-tight font-sans">System Pipeline</span>
                    <span className="text-zinc-400 font-medium truncate block">{iconSource}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Control Actions & Operational Error Dock Infrastructure base layer */}
        <div className="mt-4 shrink-0">
          {errorFeedback && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-xs text-red-400 animate-fadeIn">
              <AlertTriangle size={12} className="shrink-0" />
              <span className="font-medium truncate">{errorFeedback}</span>
            </div>
          )}

          {showDeleteConfirm ? (
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2 animate-fadeIn">
              <p className="text-[11px] font-medium text-zinc-400 px-1 text-center">Sever link graph integration?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1 text-xs font-medium shadow-sm transition-colors focus:outline-none select-none"
                >
                  {isDeleting ? <Loader2 size={11} className="animate-spin" /> : null}
                  <span>{isDeleting ? "Severing..." : "Yes, Delete"}</span>
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 py-1 text-xs font-medium transition-colors focus:outline-none select-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            (onEdit || onDelete) && (
              <div className="flex gap-2 border-t border-zinc-900 pt-3.5">
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none select-none"
                  >
                    <Edit3 size={11} className="text-zinc-500" />
                    <span>Modify</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none"
                    title="Purge Connection Record"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )
          )}
        </div>

      </div>
    </>
  );
}