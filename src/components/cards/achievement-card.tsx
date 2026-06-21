"use client";

import React, { useState } from "react";
import { 
  Trophy, 
  Calendar, 
  Award, 
  BarChart2, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  AlertTriangle
} from "lucide-react";

interface Props {
  id: string;
  title: string;
  description?: string;
  issuer?: string;
  achievementDate?: string | Date | null;
  certificateUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  rank?: string;
  position?: string;
  onEdit?: () => void;
  onDelete?: (id: string) => Promise<void> | void;
}

const DEFAULT_ACHIEVEMENT_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

export default function AchievementCard({
  id,
  title,
  description,
  issuer,
  achievementDate,
  certificateUrl,
  imageUrl,
  featured,
  rank,
  position,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasCustomImage = Boolean(imageUrl?.trim());
  const activeImageSource = hasCustomImage ? imageUrl!.trim() : DEFAULT_ACHIEVEMENT_IMAGE;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to delete achievement. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* MOBILE OPTIMIZED LIST VIEW VARIANT */}
      <div className="block sm:hidden p-3.5 rounded-xl border border-zinc-950 bg-[#070709] hover:bg-zinc-900/10 transition-all duration-200">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-blue-400 shrink-0 mt-0.5">
              <Trophy size={13} />
            </div>
            
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-xs font-bold text-zinc-100 truncate max-w-[180px]">
                  {title}
                </h3>
                {featured && (
                  <span className="inline-flex h-3.5 px-1 items-center bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-bold uppercase text-amber-400 shrink-0">
                    ★
                  </span>
                )}
              </div>
              
              {issuer && (
                <p className="text-[10px] text-zinc-500 truncate font-medium">
                  {issuer}
                </p>
              )}

              {achievementDate && (
                <p className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
                  <Calendar size={10} className="shrink-0" />
                  <span>
                    {new Date(achievementDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Quick HUD Action Suite */}
          <div className="flex items-center gap-1 shrink-0">
            {certificateUrl && (
              <a
                href={certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="View Certificate"
              >
                <ExternalLink size={12} />
              </a>
            )}
            <button
              type="button"
              onClick={onEdit}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <Edit3 size={12} />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Server Action Feedback Architecture for Mobile */}
        {errorFeedback && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-red-500/10 bg-red-500/5 p-2 text-[10px] text-red-400">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {/* Mobile Deletion Shield Confirmation Dialog Overlay */}
        {showDeleteConfirm && (
          <div className="mt-3 p-2 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 animate-fadeIn">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">Confirm Purge?</span>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex h-6 px-2.5 items-center justify-center bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white text-[10px] font-bold rounded shadow-sm transition-colors"
              >
                {isDeleting ? "..." : "Delete"}
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

      {/* DESKTOP FULL PRESENTATION CARD RUNTIME */}
      <div className="hidden sm:flex group/ach-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)]">
        
        {/* Premium Media Architecture */}
        <div className="relative h-44 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/50">
          <img
            src={activeImageSource}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/ach-card:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/20 to-transparent" />
          
          {/* Absolute High-Context Interface Elements */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-md shadow-sm transition-colors group-hover/ach-card:text-blue-400">
              <Trophy size={13} />
            </div>
            {featured && (
              <div className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-amber-400 backdrop-blur-md shadow-sm">
                <span className="text-xs leading-none">★</span>
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Dynamic Contextual Optimization Prompt */}
          {!hasCustomImage && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 backdrop-blur-md">
              <ImageIcon size={12} className="shrink-0 text-blue-400" />
              <span className="truncate">We recommend adding a custom image for better visibility</span>
            </div>
          )}
        </div>

        {/* Structured Content Architecture */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex-1 space-y-3.5">
            <div className="space-y-1">
              <h3 className="text-base font-semibold tracking-tight text-zinc-100 transition-colors group-hover/ach-card:text-white">
                {title}
              </h3>
              {issuer && (
                <p className="text-xs font-medium text-zinc-500 truncate">
                  {issuer}
                </p>
              )}
            </div>

            {description && (
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-2">
                {description}
              </p>
            )}

            {/* Operational Metrics Display Grid */}
            {(rank || position || achievementDate) && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {rank && (
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/30 p-2">
                    <Award size={13} className="text-zinc-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Rank</div>
                      <div className="font-medium text-zinc-300 truncate">{rank}</div>
                    </div>
                  </div>
                )}

                {position && (
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/30 p-2">
                    <BarChart2 size={13} className="text-zinc-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Position</div>
                      <div className="font-medium text-zinc-300 truncate">{position}</div>
                    </div>
                  </div>
                )}

                {achievementDate && (
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/30 p-2 col-span-2">
                    <Calendar size={13} className="text-zinc-500 shrink-0" />
                    <div>
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Timeline</div>
                      <div className="font-medium text-zinc-300">
                        {new Date(achievementDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* External Verification Links Layer */}
            {(certificateUrl || imageUrl) && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {certificateUrl && (
                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 text-xs transition-colors shadow-sm"
                  >
                    <span>Certificate</span>
                    <ExternalLink size={11} className="text-zinc-600" />
                  </a>
                )}

                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 text-xs transition-colors shadow-sm"
                  >
                    <span>Raw Asset</span>
                    <ExternalLink size={11} className="text-zinc-600" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Server Action Feedback Architecture */}
          {errorFeedback && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400">
              <AlertTriangle size={13} className="shrink-0" />
              <span className="font-medium">{errorFeedback}</span>
            </div>
          )}

          {/* Contextual Confirmation Inline State Panel */}
          {showDeleteConfirm ? (
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
              <p className="text-xs font-medium text-zinc-400 px-1">Confirm irreversible deletion?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1.5 text-xs font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 select-none"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : null}
                  <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* High-Integrity Standard Controls Management Dock */
            <div className="mt-4 flex gap-2 border-t border-zinc-900 pt-3.5">
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
              >
                <Edit3 size={12} className="text-zinc-500" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/10 select-none"
                title="Delete Achievement"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}