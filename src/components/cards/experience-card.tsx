"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";

export interface ExperienceCardProps {
  id: string;
  company: string;
  position: string;
  employmentType?: string;
  location?: string;
  companyWebsite?: string;
  companyLogo?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  onEdit?: (experience: any) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

const DEFAULT_COMPANY_LOGO =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSza5rtdmLbRpVvHU34e2_GOA_5HIWl5IVy0wuFKi8c6Q&s=10";

export default function ExperienceCard({
  id,
  company,
  position,
  employmentType,
  location,
  companyWebsite,
  companyLogo,
  startDate,
  endDate,
  currentlyWorking,
  description,
  responsibilities,
  technologies,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const hasLogo = Boolean(companyLogo?.trim());
  const activeLogo = hasLogo ? companyLogo!.trim() : DEFAULT_COMPANY_LOGO;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setErrorFeedback(null);
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrorFeedback("Unable to remove experience entry. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group/exp-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-6 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] w-full h-full">
      <div className="space-y-4 flex-1 flex flex-col justify-start">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 flex items-center justify-center shadow-md group-hover/exp-card:border-zinc-500 transition-colors bg-gradient-to-b from-zinc-900 to-zinc-950">
              <img
                src={activeLogo}
                alt={`${company} logo`}
                className="h-full w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover/exp-card:scale-105"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight truncate group-hover/exp-card:text-white transition-colors">
                {company}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-zinc-400 truncate">
                {position}
                {employmentType && (
                  <span className="text-zinc-500 font-normal"> • {employmentType}</span>
                )}
              </p>
            </div>
          </div>

          {currentlyWorking && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 shrink-0 self-start sm:self-auto shadow-sm">
              <span className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
              <span>Current</span>
            </span>
          )}
        </div>

        {!hasLogo && (
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-400/90 shrink-0">
            <ImageIcon size={12} className="shrink-0 text-blue-400" />
            <span className="truncate">
              We recommend adding a company logo for better visibility
            </span>
          </div>
        )}

        {(startDate || endDate || location) && (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-900 bg-zinc-900/20 p-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar size={13} className="text-zinc-500 shrink-0" />
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-zinc-200 font-semibold">{startDate ?? "—"}</span>
                <span className="text-zinc-600 font-sans font-bold">→</span>
                <span
                  className={`font-semibold ${currentlyWorking ? "text-blue-400" : "text-zinc-200"}`}
                >
                  {currentlyWorking ? "Present" : (endDate ?? "Present")}
                </span>
              </div>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-zinc-500 pl-0.5">
                <MapPin size={13} className="text-zinc-600 shrink-0" />
                <span className="truncate font-medium">{location}</span>
              </div>
            )}
          </div>
        )}

        {description && (
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans line-clamp-3">
            {description}
          </p>
        )}

        {responsibilities && responsibilities.length > 0 && (
          <div className="space-y-1.5 border-l border-zinc-900 pl-3">
            <span className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase block font-sans">
              Key Contribution Summary
            </span>
            <ul className="space-y-1 text-xs text-zinc-400 list-none">
              {responsibilities.slice(0, 3).map((item, index) => (
                <li
                  key={index}
                  className="line-clamp-2 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-zinc-700"
                >
                  {item}
                </li>
              ))}
              {responsibilities.length > 3 && (
                <li className="text-[11px] text-zinc-600 italic font-mono pt-0.5">
                  + {responsibilities.length - 3} more entries registered
                </li>
              )}
            </ul>
          </div>
        )}

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {companyWebsite && (
          <div className="pt-0.5">
            <a
              href={companyWebsite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 text-xs transition-colors shadow-sm"
            >
              <span>Company Website</span>
              <ExternalLink size={11} className="text-zinc-600" />
            </a>
          </div>
        )}
      </div>

      <div className="mt-5 shrink-0">
        {errorFeedback && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-xs text-red-400 animate-fadeIn">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="font-medium">{errorFeedback}</span>
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-955 p-2.5 animate-fadeIn">
            <p className="text-xs font-medium text-zinc-400 px-1 text-center">
              Confirm irreversible deletion?
            </p>
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
              onClick={() =>
                onEdit?.({
                  id,
                  company,
                  position,
                  employmentType,
                  location,
                  companyWebsite,
                  companyLogo,
                  startDate,
                  endDate,
                  currentlyWorking,
                  description,
                  responsibilities,
                  technologies,
                })
              }
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
