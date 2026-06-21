"use client";

import React, { useState } from "react";
import { Sparkles, Edit3, Trash2, Loader2, AlertTriangle } from "lucide-react";

interface Props {
  id: string;
  authorName: string;
  authorRole?: string | null;
  company?: string | null;
  testimonial: string;
  profileImage?: string | null;
  linkedinUrl?: string | null;
  companyLogo?: string | null;
  featured?: boolean;
  viewMode?: "grid" | "list";

  onEdit?: (data: any) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function TestimonialCard({
  id,
  authorName,
  authorRole,
  company,
  testimonial,
  profileImage,
  linkedinUrl,
  companyLogo,
  featured,
  viewMode = "grid",
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove endorsement. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isListView = viewMode === "list";

  // --- LIST VIEW PRESET ---
  if (isListView) {
    return (
      <div className={`transition-all duration-200 border border-zinc-800 bg-[#0C0C0E] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-zinc-700/60 w-full ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover border border-zinc-800 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-semibold text-xs shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-200 truncate text-sm">{authorName}</h3>
              {featured && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                  Featured
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate">
              {authorRole}{company ? ` at ${company}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-2.5 py-1 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-md transition inline-flex items-center gap-1"
              >
                {isDeleting && <Loader2 size={10} className="animate-spin" />}
                Confirm
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-xs font-medium border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  onEdit?.({ id, authorName, authorRole, company, testimonial, profileImage, linkedinUrl, companyLogo, featured })
                }
                className="px-2.5 py-1.5 text-xs font-medium border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 rounded-md transition"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2.5 py-1.5 text-xs font-medium border border-red-900/30 hover:bg-red-950/20 text-red-400 rounded-md transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- GRID VIEW PRESET ---
  return (
    <div className={`group/testimonial-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] w-full max-w-sm mx-auto ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {profileImage ? (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-zinc-800 bg-zinc-950 shadow-inner">
                <img
                  src={profileImage}
                  alt={authorName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/testimonial-card:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-300 font-bold text-sm uppercase shadow-md">
                {authorName?.charAt(0) || "?"}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-bold text-zinc-100 text-sm sm:text-base tracking-tight truncate group-hover/testimonial-card:text-white transition-colors">
                {authorName}
              </h3>
              {(authorRole || company) && (
                <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">
                  {authorRole}
                  {authorRole && company ? " @ " : ""}
                  {company}
                </p>
              )}
            </div>
          </div>

          {featured && (
            <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md shadow-sm shrink-0">
              <Sparkles size={9} className="animate-pulse" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {companyLogo && (
          <div className="pt-0.5 flex items-center min-h-[1.5rem]">
            <img
              src={companyLogo}
              alt={`${company || "Company"} identity asset`}
              className="h-5 max-w-[120px] object-contain opacity-40 group-hover/testimonial-card:opacity-70 transition-opacity duration-300"
            />
          </div>
        )}

        <div className="relative pt-1">
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans italic pl-3 border-l border-zinc-800 group-hover/testimonial-card:text-zinc-300 transition-colors duration-300 selection:bg-blue-500/30">
            “{testimonial}”
          </p>
        </div>

        {linkedinUrl && (
          <div className="pt-1 pl-3">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-[11px] w-[11px] text-zinc-600 shrink-0 group-hover/testimonial-card:text-blue-500 transition-colors"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>Verify Recommendation</span>
            </a>
          </div>
        )}
      </div>

      <div className="mt-5">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={12} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2 animate-fadeIn">
            <p className="text-[11px] font-medium text-zinc-400 px-1 text-center">Confirm record deletion pipeline?</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1 text-xs font-medium shadow-sm transition-colors focus:outline-none select-none"
              >
                {isDeleting ? <Loader2 size={11} className="animate-spin" /> : null}
                <span>{isDeleting ? "Purging..." : "Yes, Purge"}</span>
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
          <div className="flex gap-2 border-t border-zinc-900 pt-3.5">
            <button
              type="button"
              onClick={() =>
                onEdit?.({ id, authorName, authorRole, company, testimonial, profileImage, linkedinUrl, companyLogo, featured })
              }
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none select-none"
            >
              <Edit3 size={11} className="text-zinc-500" />
              <span>Modify</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none"
              title="Delete Testimonial"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}