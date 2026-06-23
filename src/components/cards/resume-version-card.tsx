"use client";

import React, { useState } from "react";
import {
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  Loader2,
  AlertTriangle,
  History,
} from "lucide-react";

interface ResumeChangeLog {
  id: string;
  section: string;
  fieldName: string;
  oldValue?: string | null;
  newValue?: string | null;
}

interface ResumeVersionCardProps {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date | string;
  changeLogs?: ResumeChangeLog[];
  onDelete?: (id: string) => Promise<void> | void;
}

export function ResumeVersionCard({
  id,
  fileName,
  fileUrl,
  uploadedAt,
  changeLogs = [],
  onDelete,
}: ResumeVersionCardProps) {
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
      setErrorFeedback("Unable to remove resume version. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="block sm:hidden p-3.5 rounded-xl border border-zinc-950 bg-[#070709] hover:bg-zinc-900/10 transition-all duration-200 w-full relative overflow-hidden">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-blue-400 mt-0.5">
              <FileText size={13} />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="text-xs font-bold text-zinc-200 truncate">{fileName}</h3>
              <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <Calendar size={10} className="shrink-0" />
                <span>
                  {new Date(uploadedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {changeLogs.length > 0 && (
                  <span className="text-zinc-600 bg-zinc-900 px-1 rounded border border-zinc-800 text-[8px] font-mono ml-1.5 uppercase font-bold shrink-0">
                    +{changeLogs.length} Delta
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="View Artifact"
            >
              <ExternalLink size={12} />
            </a>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
              title="Delete Version"
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
              Purge Version?
            </span>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex h-6 px-2.5 items-center justify-center bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white text-[10px] font-bold rounded shadow-sm transition-colors"
              >
                {isDeleting ? "..." : "Purge"}
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

      <div className="hidden sm:flex group/resume-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0C0C0E] p-5 shadow-sm transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] w-full max-w-xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-11 h-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-400 shadow-md group-hover/resume-card:text-blue-400 group-hover/resume-card:border-blue-500/30 transition-all duration-300">
                <FileText size={20} />
              </div>

              <div className="min-w-0 space-y-0.5">
                <h3 className="font-bold text-zinc-100 text-sm sm:text-base tracking-tight truncate group-hover/resume-card:text-white transition-colors">
                  {fileName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                  <Calendar size={12} className="text-zinc-600 shrink-0" />
                  <span className="font-mono">
                    {new Date(uploadedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {changeLogs.length > 0 && (
            <div className="space-y-3 rounded-xl border border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-zinc-900/5 p-4 shadow-inner">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-mono pl-0.5">
                <History size={11} className="text-zinc-600" />
                <span>Version Modification Tracking Log</span>
              </div>

              <div className="relative pl-3 border-l border-zinc-800 space-y-3.5">
                {changeLogs.map((log) => (
                  <div key={log.id} className="relative text-xs space-y-2 group/node">
                    <div className="absolute -left-[16.5px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">
                      <div className="h-1 w-1 rounded-full bg-zinc-500 group-hover/resume-card:bg-blue-400 transition-colors" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono">
                      <span className="text-zinc-500">Section:</span>
                      <span className="text-zinc-300 font-semibold bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                        {log.section}
                      </span>
                      <span className="text-zinc-600 font-sans font-bold">→</span>
                      <span className="text-zinc-500">Field:</span>
                      <span className="text-zinc-400 font-medium">{log.fieldName}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-zinc-955 p-2 rounded border border-zinc-900/40">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[9px] text-zinc-600 uppercase tracking-wider font-sans">
                          Previous Value
                        </div>
                        <div className="text-red-400/90 truncate bg-red-950/10 border border-red-900/20 px-1.5 py-0.5 rounded-md min-h-[1.5rem] flex items-center">
                          {log.oldValue ?? "—"}
                        </div>
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[9px] text-zinc-600 uppercase tracking-wider font-sans">
                          Updated Entry
                        </div>
                        <div className="text-emerald-400/90 truncate bg-emerald-950/10 border border-emerald-900/20 px-1.5 py-0.5 rounded-md min-h-[1.5rem] flex items-center">
                          {log.newValue ?? "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5">
          {errorFeedback && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400 animate-fadeIn">
              <AlertTriangle size={13} className="shrink-0" />
              <span className="font-medium">{errorFeedback}</span>
            </div>
          )}

          {showDeleteConfirm ? (
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-955 p-2.5 animate-fadeIn">
              <p className="text-xs font-medium text-zinc-400 px-1 text-center">
                Confirm irreversible version purge code sequence?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1.5 text-xs font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 select-none"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : null}
                  <span>{isDeleting ? "Purging..." : "Yes, Purge"}</span>
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
            <div className="flex gap-2 border-t border-zinc-900 pt-4">
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
              >
                <ExternalLink size={12} className="text-zinc-500" />
                <span>View Artifact</span>
              </a>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/10 select-none"
                title="Delete Version Record"
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
