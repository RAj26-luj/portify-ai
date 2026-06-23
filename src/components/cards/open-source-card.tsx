"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  GitPullRequest,
  AlertCircle,
  Sparkles,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
  ExternalLink,
  Code2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type TimelineItem = {
  id: string;
  milestone: string;
  progress: number;
  description?: string;
};

interface Props {
  id: string;
  repositoryName: string;
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
  status?: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTAINED";
  displayOrder?: number;
  timeline?: TimelineItem[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const DEFAULT_OS_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

export default function OpenSourceCard({
  repositoryName,
  repositoryUrl,
  pullRequestUrl,
  pullRequestTitle,
  issueTitle,
  contributionTitle,
  contributionType,
  description,
  impactMetrics,
  linesChanged,
  coverImage,
  architectureDiagrams = [],
  contributionScreenshots = [],
  status,
  timeline = [],
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const slideImages = [
    ...(coverImage?.trim() ? [coverImage.trim()] : []),
    ...architectureDiagrams.filter((img) => img?.trim()),
    ...contributionScreenshots.filter((img) => img?.trim()),
  ];

  if (slideImages.length === 0) {
    slideImages.push(DEFAULT_OS_IMAGE);
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slideImages.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove contribution. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusStyles = (statusVal?: string) => {
    switch (statusVal) {
      case "COMPLETED":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      case "IN_PROGRESS":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";
      case "MAINTAINED":
        return "border-purple-500/20 bg-purple-500/10 text-purple-400";
      default:
        return "border-zinc-800 bg-zinc-900 text-zinc-400";
    }
  };

  const hasExtraMetadata = Boolean(
    pullRequestTitle ||
    issueTitle ||
    linesChanged ||
    contributionType ||
    (timeline && timeline.length > 0)
  );

  return (
    <div className="group/os-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)] max-w-xl w-full mx-auto">
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/50">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${repositoryName} view ${index + 1}`}
                className="h-full w-full flex-shrink-0 object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/20 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-md shadow-sm">
              <GitBranch size={12} />
            </div>
            {status && (
              <span
                className={`inline-flex items-center rounded bg-zinc-900/90 px-1.5 py-0.5 text-[9px] font-semibold border backdrop-blur-md shadow-sm ${getStatusStyles(status)}`}
              >
                {status}
              </span>
            )}
          </div>

          {!coverImage?.trim() &&
            architectureDiagrams.length === 0 &&
            contributionScreenshots.length === 0 && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 rounded border border-blue-500/10 bg-blue-500/5 px-2 py-0.5 text-[9px] text-blue-400/90 backdrop-blur-md pointer-events-none">
                <ImageIcon size={10} className="shrink-0" />
                <span className="truncate">We recommend adding contribution screenshots</span>
              </div>
            )}

          {slideImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-sm opacity-0 group-hover/os-card:opacity-100 transition-opacity hover:text-white hover:bg-zinc-800"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-sm opacity-0 group-hover/os-card:opacity-100 transition-opacity hover:text-white hover:bg-zinc-800"
              >
                <ChevronRight size={12} />
              </button>

              <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                {slideImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? "w-2.5 bg-blue-400" : "w-1 bg-zinc-600"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-zinc-100 text-sm sm:text-base tracking-tight break-all truncate group-hover/os-card:text-white transition-colors">
              {repositoryName}
            </h3>
            {contributionTitle && (
              <p className="text-xs font-medium text-zinc-400 truncate">{contributionTitle}</p>
            )}
          </div>

          {description && (
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans line-clamp-2">
              {description}
            </p>
          )}

          {hasExtraMetadata && (
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="w-full flex items-center justify-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors py-1.5 bg-zinc-900/20 rounded border border-zinc-900"
            >
              <span>{showMore ? "Hide Technical Log" : "Show Technical Log"}</span>
              {showMore ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          )}

          {showMore && (
            <div className="space-y-3.5 pt-0.5 animate-fadeIn">
              {(pullRequestTitle || issueTitle || linesChanged || contributionType) && (
                <div className="flex flex-col gap-1 rounded border border-zinc-900 bg-zinc-900/20 p-2.5 text-[11px] font-mono">
                  {contributionType && (
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <span className="text-zinc-500 font-normal">Type:</span>
                      <div className="truncate text-zinc-300">{contributionType}</div>
                    </div>
                  )}
                  {pullRequestTitle && (
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <GitPullRequest size={12} className="text-purple-500 shrink-0" />
                      <div className="truncate text-zinc-300">{pullRequestTitle}</div>
                    </div>
                  )}
                  {issueTitle && (
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <AlertCircle size={12} className="text-amber-500 shrink-0" />
                      <div className="truncate text-zinc-300">{issueTitle}</div>
                    </div>
                  )}
                  {linesChanged && (
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <Code2 size={12} className="text-emerald-500 shrink-0" />
                      <div className="truncate text-zinc-300">{linesChanged}</div>
                    </div>
                  )}
                </div>
              )}

              {timeline && timeline.length > 0 && (
                <div className="space-y-2 rounded-lg border border-zinc-900 bg-zinc-950/40 p-3">
                  <span className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase block font-sans">
                    Project Milestones
                  </span>
                  <div className="relative pl-3 border-l border-zinc-800 space-y-3">
                    {timeline.map((item) => (
                      <div key={item.id} className="relative text-xs space-y-0.5 group/node">
                        <div className="absolute -left-[16.5px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">
                          <div className="h-1 w-1 rounded-full bg-zinc-500 group-hover/os-card:bg-blue-400 transition-colors" />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-zinc-300 truncate">
                            {item.milestone}
                          </div>
                          <span className="text-[10px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-400 shrink-0">
                            {item.progress}%
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {impactMetrics && impactMetrics.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider text-zinc-600 uppercase block font-sans">
                <Sparkles size={10} className="text-zinc-600" />
                <span>Impact Indicators</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {impactMetrics.slice(0, 4).map((metric, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-800 max-w-full truncate shadow-sm"
                  >
                    {metric}
                  </span>
                ))}
                {impactMetrics.length > 4 && (
                  <span className="text-[9px] text-zinc-600 font-mono font-bold self-center pl-0.5">
                    +{impactMetrics.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {(repositoryUrl || pullRequestUrl) && (
            <div className="flex gap-2 pt-0.5">
              {repositoryUrl && (
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 text-xs transition-colors shadow-sm"
                >
                  <span>Repo</span>
                  <ExternalLink size={10} className="text-zinc-600" />
                </a>
              )}

              {pullRequestUrl && (
                <a
                  href={pullRequestUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 text-xs transition-colors shadow-sm"
                >
                  <span>PR Link</span>
                  <ExternalLink size={10} className="text-zinc-600" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        {errorFeedback && (
          <div className="mb-2 flex items-center gap-1 rounded border border-red-500/10 bg-red-500/5 p-1.5 text-[10px] text-red-400">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="font-medium truncate">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-2 animate-fadeIn">
            <p className="text-[10px] font-medium text-zinc-400 text-center">
              Confirm record deletion?
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center rounded bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white py-1 text-xs font-medium transition-colors select-none"
              >
                {isDeleting ? <Loader2 size={11} className="animate-spin" /> : null}
                <span>Delete</span>
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 inline-flex items-center justify-center rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-1 text-xs font-medium transition-colors select-none"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 border-t border-zinc-900 pt-3.5">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none select-none"
            >
              <Edit3 size={11} className="text-zinc-500" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-7 w-7 rounded border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors select-none"
              title="Delete Entry"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
