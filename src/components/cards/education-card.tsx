"use client";

import React, { useState } from "react";
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Award, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";

interface Props {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  cgpa?: string;
  location?: string;
  institutionImage?: string;
  logoUrl?: string;
  startDate?: string;
  endDate?: string;
  currentlyStudying?: boolean;
  description?: string;
  displayOrder?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

const DEFAULT_INSTITUTION_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

export default function EducationCard({
  id,
  institution,
  degree,
  fieldOfStudy,
  grade,
  cgpa,
  location,
  institutionImage,
  logoUrl,
  startDate,
  endDate,
  currentlyStudying,
  description,
  onEdit,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasInstitutionImage = Boolean(institutionImage?.trim());
  const hasLogoUrl = Boolean(logoUrl?.trim());
  const activeHeroImage = hasInstitutionImage ? institutionImage!.trim() : DEFAULT_INSTITUTION_IMAGE;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove education card. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    /* Note: Added h-full to make card heights uniform based on the tallest sibling */
    <div className="group/edu-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] h-full">
      
      {/* Container wrapper configured with flex-1 ensures inner content fills up the remaining card space */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Premium Media Block Frame Architecture */}
          <div className="relative h-40 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/50">
            <img
              src={activeHeroImage}
              alt={institution}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/edu-card:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/30 to-transparent" />
            
            {/* Absolute High-Context Interface Elements */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-400 backdrop-blur-md shadow-sm transition-colors group-hover/edu-card:text-blue-400">
                <GraduationCap size={13} />
              </div>
              {currentlyStudying && (
                <div className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-emerald-400 backdrop-blur-md shadow-sm">
                  <span className="text-[8px] leading-none animate-pulse">●</span>
                  <span>Ongoing</span>
                </div>
              )}
            </div>

            {/* Contextual Asset Visibility Optimization Warning Prompt */}
            {!hasInstitutionImage && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 backdrop-blur-md">
                <ImageIcon size={12} className="shrink-0 text-blue-400" />
                <span className="truncate">We recommend an institution landscape layout for best visibility</span>
              </div>
            )}
          </div>

          {/* Structured Content Ecosystem Layer */}
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3 min-w-0">
              {hasLogoUrl && (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 flex items-center justify-center shadow-inner transition-colors group-hover/edu-card:border-zinc-700">
                  <img
                    src={logoUrl!.trim()}
                    alt={`${institution} brand`}
                    className="h-full w-full object-contain rounded-md"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-200 text-sm sm:text-base tracking-tight truncate group-hover/edu-card:text-white transition-colors">
                  {institution}
                </h3>
                <p className="text-xs font-medium text-zinc-400 truncate mt-0.5">
                  {degree}
                  {fieldOfStudy && (
                    <span className="text-zinc-600 font-normal"> • {fieldOfStudy}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Core Body Field Narrative Module */}
            {description && (
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-3 font-sans">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Operational Parameters Dashboard Matrix Layout placed outside description zone to lock at the bottom uniformly */}
        {(location || startDate || endDate || grade || cgpa) && (
          <div className="p-5 pt-0 grid grid-cols-2 gap-2 text-xs">
            {(startDate || endDate) && (
              <div className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/30 p-2 col-span-2">
                <Calendar size={13} className="text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Timeline</div>
                  <div className="font-medium text-zinc-300 truncate">
                    {startDate ?? "—"} → {currentlyStudying ? "Present" : endDate ?? "Present"}
                  </div>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/30 p-2">
                <MapPin size={13} className="text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Location</div>
                  <div className="font-medium text-zinc-300 truncate">{location}</div>
                </div>
              </div>
            )}

            {(grade || cgpa) && (
              <div className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/30 p-2 min-w-0">
                <Award size={13} className="text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    {cgpa ? "Academic Score" : "Grade Status"}
                  </div>
                  <div className="font-medium text-zinc-300 truncate">
                    {cgpa ? `CGPA: ${cgpa}` : grade}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Actions & Operational Errors Management Interface Base Dock */}
      <div className="p-5 pt-0 shrink-0">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="font-medium">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 animate-fadeIn">
            <p className="text-xs font-medium text-zinc-400 px-1 text-center">Confirm irreversible deletion?</p>
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
          <div className="flex gap-2 border-t border-zinc-900 pt-3.5">
            <button
              type="button"
              onClick={() => onEdit?.(id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/20 select-none"
            >
              <Edit3 size={12} className="text-zinc-500" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/10 select-none"
              title="Delete Record"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}