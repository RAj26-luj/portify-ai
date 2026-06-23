"use client";

import React, { useState } from "react";
import {
  Code2,
  Trophy,
  Globe,
  CheckCircle2,
  Calendar,
  Award,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

interface Props {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
  iconName?: string;
  iconUrl?: string;
  currentRating?: number;
  maxRating?: number;
  rank?: string;
  globalRank?: string;
  problemsSolved?: number;
  contestsAttended?: number;
  activeSince?: string;
  onEdit?: () => void;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function CodingProfileCard({
  id,
  platform,
  username,
  profileUrl,
  iconName,
  iconUrl,
  currentRating,
  maxRating,
  rank,
  globalRank,
  problemsSolved,
  contestsAttended,
  activeSince,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasCustomImage = Boolean(iconUrl?.trim());
  const defaultImageIconUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPVi6Wc7FmkkBMaKOsi7xaFYHKqtpOaEB7oX-Y04flig&s=10";

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to delete profile. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="block sm:hidden p-3.5 rounded-xl border border-zinc-950 bg-[#070709] hover:bg-zinc-900/10 transition-all duration-200 w-full">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="h-8 w-8 shrink-0 rounded-lg border border-zinc-800 bg-zinc-955 p-1 flex items-center justify-center mt-0.5 overflow-hidden">
              <img
                src={hasCustomImage ? iconUrl!.trim() : defaultImageIconUrl}
                alt={`${platform} logo`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-zinc-200 truncate">{platform}</h3>
              <p className="text-[10px] font-medium text-zinc-500 truncate">@{username}</p>

              {(currentRating !== undefined || problemsSolved !== undefined) && (
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-600">
                  {currentRating !== undefined && (
                    <span className="text-amber-500/90 font-bold">★ {currentRating}</span>
                  )}
                  {currentRating !== undefined && problemsSolved !== undefined && <span>•</span>}
                  {problemsSolved !== undefined && <span>{problemsSolved} Solved</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <ExternalLink size={12} />
            </a>
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

        {errorFeedback && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md border border-red-500/10 bg-red-500/5 p-1.5 text-[10px] text-red-400">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="mt-3 p-2 rounded-lg border border-zinc-800 bg-zinc-955 flex items-center justify-between gap-3 animate-fadeIn">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
              Confirm Purge?
            </span>
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

      <div className="hidden sm:flex group/code-card relative flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.7)] max-w-sm w-full mx-auto h-full">
        <div className="space-y-3 flex-1 flex flex-col justify-start">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-10 w-10 shrink-0 rounded-lg border border-zinc-800 bg-zinc-955 p-1.5 flex items-center justify-center shadow-inner transition-colors group/code-card:border-zinc-700 overflow-hidden">
                <img
                  src={hasCustomImage ? iconUrl!.trim() : defaultImageIconUrl}
                  alt={`${platform} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-200 text-sm tracking-tight truncate group-hover/code-card:text-white transition-colors">
                  {platform}
                </h3>
                <p className="text-[11px] font-medium text-zinc-500 truncate">@{username}</p>
              </div>
            </div>

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200 group/globe-link cursor-pointer overflow-hidden"
              title={`Visit live ${platform} profile`}
            >
              <Globe size={12} className="transition-transform group-hover/globe-link:scale-90" />
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/globe-link:opacity-100 flex items-center justify-center transition-opacity">
                <ExternalLink size={8} className="text-blue-400 absolute bottom-0.5 right-0.5" />
              </div>
            </a>
          </div>

          {!hasCustomImage && (
            <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2 py-1 text-[10px] text-blue-400/90">
              <ImageIcon size={11} className="shrink-0 text-blue-400" />
              <span className="truncate">
                We recommend adding a custom platform icon for optimized visualization
              </span>
            </div>
          )}

          {(currentRating !== undefined ||
            maxRating !== undefined ||
            rank ||
            globalRank ||
            problemsSolved !== undefined ||
            contestsAttended !== undefined ||
            activeSince) && (
            <div className="grid grid-cols-2 gap-1.5 text-[11px] mt-auto">
              {currentRating !== undefined && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5">
                  <Trophy size={11} className="text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Rating
                    </div>
                    <div className="font-medium text-zinc-300 truncate">{currentRating}</div>
                  </div>
                </div>
              )}

              {maxRating !== undefined && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5">
                  <Award size={11} className="text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Peak
                    </div>
                    <div className="font-medium text-zinc-300 truncate">{maxRating}</div>
                  </div>
                </div>
              )}

              {rank && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Tier
                    </div>
                    <div className="font-medium text-zinc-300 truncate">{rank}</div>
                  </div>
                </div>
              )}

              {globalRank && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5">
                  <Globe size={11} className="text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Global
                    </div>
                    <div className="font-medium text-zinc-300 truncate">#{globalRank}</div>
                  </div>
                </div>
              )}

              {problemsSolved !== undefined && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5">
                  <CheckCircle2 size={11} className="text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Solved
                    </div>
                    <div className="font-medium text-zinc-300 truncate">{problemsSolved}</div>
                  </div>
                </div>
              )}

              {contestsAttended !== undefined && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5">
                  <Code2 size={11} className="text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Contests
                    </div>
                    <div className="font-medium text-zinc-300 truncate">{contestsAttended}</div>
                  </div>
                </div>
              )}

              {activeSince && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900/20 p-1.5 col-span-2">
                  <Calendar size={11} className="text-zinc-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                      Active Since
                    </div>
                    <div className="font-medium text-zinc-300 truncate">{activeSince}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {errorFeedback && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-red-500/10 bg-red-500/5 p-2 text-[11px] text-red-400">
            <AlertTriangle size={12} className="shrink-0" />
            <span className="font-medium">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="mt-3 flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-zinc-955 p-2 shrink-0">
            <p className="text-[11px] font-medium text-zinc-400 px-1 text-center">
              Delete this profile?
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1 text-xs font-medium shadow-sm transition-colors select-none"
              >
                {isDeleting ? <Loader2 size={10} className="animate-spin" /> : null}
                <span>Yes</span>
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-1 text-xs font-medium transition-colors select-none"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-1 border-t border-zinc-900 pt-3 shrink-0">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-2.5 py-1.5 text-xs font-medium transition-colors shadow-sm select-none"
              >
                <Edit3 size={11} className="text-zinc-500" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none"
                title="Delete Profile"
              >
                <Trash2 size={11} />
              </button>
            </div>

            {iconName && (
              <p className="text-[9px] text-zinc-600 truncate text-center font-mono mt-1">
                ID: {iconName}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
