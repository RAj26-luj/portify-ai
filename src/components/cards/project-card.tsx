"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  Edit3,
  BarChart3,
  Trash2,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Globe,
  PlayCircle,
  Video,
} from "lucide-react";

interface Props {
  id: string;

  title: string;
  shortDescription?: string;
  description?: string;
  problemStatement?: string;
  solution?: string;

  category?: string;
  status?: string;
  type?: string;

  role?: string;
  teamSize?: number;

  projectBanner?: string;
  coverImage?: string;
  thumbnail?: string;

  startDate?: string | Date;
  endDate?: string | Date;

  techStack?: string[];

  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  videoUrl?: string;

  images?: string[];

  featured?: boolean;

  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMetrics?: (projectId: string) => void;
}

const DEFAULT_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

export default function ProjectCard({
  id,
  title,
  shortDescription,
  description,
  problemStatement,
  solution,
  category,
  status,
  type,
  role,
  teamSize,
  projectBanner,
  coverImage,
  thumbnail,
  startDate,
  endDate,
  techStack,
  githubUrl,
  liveUrl,
  demoUrl,
  videoUrl,
  images = [],
  featured,
  onView,
  onDelete,
  onMetrics,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const slideImages = [
    ...(thumbnail?.trim() ? [thumbnail.trim()] : []),
    ...(coverImage?.trim() ? [coverImage.trim()] : []),
    ...(projectBanner?.trim() ? [projectBanner.trim()] : []),
    ...images.filter((img) => img?.trim()),
  ];

  if (slideImages.length === 0) {
    slideImages.push(DEFAULT_BANNER_IMAGE);
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4500);
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

  const formatDate = (date?: string | Date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove entry. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusStyle = (statusStr?: string) => {
    switch (statusStr?.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "PLANNING":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700/60";
    }
  };

  return (
    <div className="group/project-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] shadow-sm transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] w-full max-w-xl mx-auto">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/60">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${title} project capture ${index + 1}`}
                className="h-full w-full flex-shrink-0 object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/40 to-transparent pointer-events-none" />

          <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700/40 bg-zinc-900/80 text-zinc-300 backdrop-blur-sm shadow-md pointer-events-none">
            <Layers size={13} />
          </div>

          {!thumbnail?.trim() &&
            !coverImage?.trim() &&
            !projectBanner?.trim() &&
            images.length === 0 && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 backdrop-blur-md pointer-events-none">
                <ImageIcon size={12} className="shrink-0 text-blue-400" />
                <span className="truncate">
                  We recommend linking interface captures for optimal rendering
                </span>
              </div>
            )}

          {slideImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-sm opacity-0 group-hover/project-card:opacity-100 transition-opacity hover:text-white hover:bg-zinc-800"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-sm opacity-0 group-hover/project-card:opacity-100 transition-opacity hover:text-white hover:bg-zinc-800"
              >
                <ChevronRight size={13} />
              </button>

              <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                {slideImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? "w-3 bg-blue-400" : "w-1 bg-zinc-600"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2 pl-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight break-all group-hover/project-card:text-blue-400 transition-colors">
                {title}
              </h3>
              {featured && (
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 shadow-sm">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>Featured</span>
                </span>
              )}
              {status && (
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusStyle(status)}`}
                >
                  {status}
                </span>
              )}
            </div>
            {category && (
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                {category} <span className="text-zinc-700">•</span> {type || "Engineering Module"}
              </p>
            )}
          </div>

          {(shortDescription || description) && (
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans line-clamp-3">
              {shortDescription || description}
            </p>
          )}

          {(problemStatement || solution) && (
            <div className="grid gap-3 rounded-xl border border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-zinc-900/5 p-4 text-xs">
              {problemStatement && (
                <div className="space-y-1">
                  <div className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px] text-amber-500/80">
                    🛑 Problem Scope
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-sans">{problemStatement}</p>
                </div>
              )}
              {solution && (
                <div className="space-y-1 pt-2.5 border-t border-zinc-900/60">
                  <div className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px] text-emerald-500/80">
                    Engineering Solution
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-sans">{solution}</p>
                </div>
              )}
            </div>
          )}

          {(role || teamSize !== undefined || startDate || endDate) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-zinc-900 pt-4 text-xs">
              {role && (
                <div className="min-w-0">
                  <span className="text-zinc-600 block uppercase font-mono tracking-wider text-[9px] mb-0.5">
                    My Position
                  </span>
                  <div className="font-medium text-zinc-300 truncate">{role}</div>
                </div>
              )}
              {teamSize !== undefined && (
                <div className="min-w-0">
                  <span className="text-zinc-600 block uppercase font-mono tracking-wider text-[9px] mb-0.5">
                    Ecosystem Team
                  </span>
                  <div className="font-medium text-zinc-300 truncate">
                    {teamSize === 1 ? "Solo Protocol" : `${teamSize} Contributors`}
                  </div>
                </div>
              )}
              {(startDate || endDate) && (
                <div className="min-w-0 col-span-2 sm:col-span-1">
                  <span className="text-zinc-600 block uppercase font-mono tracking-wider text-[9px] mb-0.5">
                    Timeline Log
                  </span>
                  <div className="font-medium text-zinc-300 truncate font-mono text-[11px]">
                    {formatDate(startDate) || "Init"} — {formatDate(endDate) || "Active"}
                  </div>
                </div>
              )}
            </div>
          )}

          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-800 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {(githubUrl || liveUrl || demoUrl || videoUrl) && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-900 pt-3.5 text-xs font-semibold">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-zinc-200 inline-flex items-center gap-1 transition-colors"
                >
                  <GitBranch size={12} className="text-zinc-600" />
                  <span>Source Code</span>
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <Globe size={12} className="text-emerald-600/80" />
                  <span>Live Deployment</span>
                </a>
              )}
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
                >
                  <PlayCircle size={12} className="text-blue-600/80" />
                  <span>Video Demo</span>
                </a>
              )}
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-500 hover:text-purple-400 inline-flex items-center gap-1 transition-colors"
                >
                  <Video size={12} className="text-purple-600/80" />
                  <span>Walkthrough</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-0">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="font-medium">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 animate-fadeIn">
            <p className="text-xs font-medium text-zinc-400 px-1 text-center">
              Confirm irreversible record purge sequence?
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
            <button
              type="button"
              onClick={() => onView?.(id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
            >
              <Edit3 size={12} className="text-zinc-500" />
              <span>Modify</span>
            </button>

            <button
              type="button"
              onClick={() => onMetrics?.(id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
            >
              <BarChart3 size={12} className="text-zinc-500" />
              <span>Metrics</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/10 select-none"
              title="Delete Project Record"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
