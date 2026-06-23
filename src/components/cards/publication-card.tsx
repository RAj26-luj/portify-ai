"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Calendar,
  Quote,
  Fingerprint,
  Award,
  ExternalLink,
  FileText,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

interface Props {
  id: string;
  title: string;
  journal?: string | null;
  publisher?: string | null;
  publicationDate?: string | Date | null;
  doi?: string | null;
  citations?: number | null;
  abstract?: string | null;
  publicationUrl?: string | null;
  pdfUrl?: string | null;
  conference?: string | null;
  publicationCover?: string | null;
  authors?: string[];
  featured?: boolean;
  displayOrder?: number;

  onEdit?: (data: any) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

export default function PublicationCard({
  id,
  title,
  journal,
  publisher,
  publicationDate,
  doi,
  citations,
  abstract,
  publicationUrl,
  pdfUrl,
  conference,
  publicationCover,
  authors = [],
  featured,
  displayOrder,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const slideImages = [...(publicationCover?.trim() ? [publicationCover.trim()] : [])];

  if (slideImages.length === 0) {
    slideImages.push(DEFAULT_COVER_IMAGE);
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
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
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove publication record. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group/pub-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0C0C0E] shadow-sm transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] w-full max-w-xl mx-auto">
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/60">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${title} cover slice ${index + 1}`}
                className="h-full w-full flex-shrink-0 object-cover opacity-90 transition-transform duration-700 ease-out group-hover/pub-card:scale-[1.02]"
                loading="lazy"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/40 to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex gap-1.5 items-center">
              {featured && (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md shadow-sm">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>Featured Release</span>
                </span>
              )}
              {citations != null && citations > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md shadow-sm">
                  <Quote size={10} />
                  <span>{citations} Citations</span>
                </span>
              )}
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700/40 bg-zinc-900/80 text-zinc-300 backdrop-blur-sm shadow-md">
              <BookOpen size={13} />
            </div>
          </div>

          {!publicationCover?.trim() && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 backdrop-blur-md pointer-events-none">
              <ImageIcon size={12} className="shrink-0 text-blue-400" />
              <span className="truncate">
                We recommend matching a graphic summary cover for optimization
              </span>
            </div>
          )}

          {slideImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-sm opacity-0 group-hover/pub-card:opacity-100 transition-opacity hover:text-white hover:bg-zinc-800"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-sm opacity-0 group-hover/pub-card:opacity-100 transition-opacity hover:text-white hover:bg-zinc-800"
              >
                <ChevronRight size={13} />
              </button>
            </>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight leading-snug break-words group-hover/pub-card:text-blue-400 transition-colors duration-300">
              {title}
            </h3>
            {(journal || conference || publisher) && (
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono truncate">
                {journal || conference || publisher}
              </p>
            )}
          </div>

          <div className="grid gap-2.5 rounded-xl border border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-zinc-900/5 p-4 text-xs">
            {publicationDate && (
              <div className="flex items-center gap-2.5 text-zinc-400 min-w-0">
                <Calendar size={13} className="text-zinc-600 shrink-0" />
                <span className="text-zinc-500 font-medium w-16 shrink-0">Release Date</span>
                <div className="truncate text-zinc-300 font-medium font-mono">
                  {new Date(publicationDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}

            {doi && (
              <div className="flex items-center gap-2.5 text-zinc-400 min-w-0 border-t border-zinc-900/60 pt-2.5">
                <Fingerprint size={13} className="text-zinc-600 shrink-0" />
                <span className="text-zinc-500 font-medium w-16 shrink-0">Digital Object ID</span>
                <div className="truncate text-zinc-400 font-mono text-[11px] hover:text-zinc-300 transition-colors select-all break-all">
                  {doi}
                </div>
              </div>
            )}

            {displayOrder != null && (
              <div className="flex items-center gap-2.5 text-zinc-400 min-w-0 border-t border-zinc-900/60 pt-2.5">
                <Award size={13} className="text-zinc-600 shrink-0" />
                <span className="text-zinc-500 font-medium w-16 shrink-0">Index Order</span>
                <div className="truncate text-zinc-300 font-medium font-mono">{displayOrder}</div>
              </div>
            )}
          </div>

          {abstract && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-wider text-zinc-600 uppercase block font-mono pl-0.5">
                Abstract Synopsis
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans line-clamp-4 pl-0.5">
                {abstract}
              </p>
            </div>
          )}

          {authors && authors.length > 0 && (
            <div className="space-y-2 border-t border-zinc-900/80 pt-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-zinc-600 uppercase font-mono pl-0.5">
                <Users size={11} className="text-zinc-600" />
                <span>Investigator Network</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-0.5">
                {authors.map((author, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-zinc-900 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-800 shadow-sm"
                  >
                    {author}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(publicationUrl || pdfUrl) && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-900 pt-3.5 text-xs font-semibold">
              {publicationUrl && (
                <a
                  href={publicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-zinc-200 inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={12} className="text-zinc-600" />
                  <span>View Publication Node</span>
                </a>
              )}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 transition-colors"
                >
                  <FileText size={12} className="text-red-900/80" />
                  <span>Download Manuscript PDF</span>
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
              onClick={() =>
                onEdit?.({
                  id,
                  title,
                  journal,
                  publisher,
                  publicationDate,
                  doi,
                  citations,
                  abstract,
                  publicationUrl,
                  pdfUrl,
                  conference,
                  publicationCover,
                  authors,
                  featured,
                  displayOrder,
                })
              }
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
            >
              <Edit3 size={12} className="text-zinc-500" />
              <span>Modify Data</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/10 select-none"
              title="Purge Publication Record"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
