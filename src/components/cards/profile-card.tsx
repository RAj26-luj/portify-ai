"use client";

import React from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Briefcase, 
  FileText, 
  Edit3,
  Compass,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Link2
} from "lucide-react";

// Default administrative workspace visual backdrop configuration constant
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop";

type Profile = {
  name: string;
  username: string;

  phone?: string;
  website?: string;
  country?: string;
  state?: string;
  city?: string;

  image?: string;
  coverImage?: string;

  email?: string;

  portfolio?: {
    title?: string;
    tagline?: string;
    bio?: string;
    currentRole?: string;
    currentFocus?: string;
    availabilityStatus?: string;
    resumeHeadline?: string;

    email?: string;
    phone?: string;
    website?: string;
  };

  allowContactForm: boolean;
  allowResumeDownload: boolean;
};

export default function ProfileCard({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
  return (
    <div className="group/profile-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0C0C0E] shadow-xl transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] w-full max-w-4xl mx-auto">
      
      {/* Decorative Top Ambient Glow Flare */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      
      <div>
        {/* COVER IMAGE BACKGROUND LAYER WITH AUTOMATIC FALLBACK CONSTANT */}
        <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900/60">
          <img
            src={profile.coverImage || DEFAULT_COVER_IMAGE}
            alt="Cover background"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/profile-card:scale-[1.03]"
            loading="lazy"
          />
          
          {/* Subtle overlay gradients for rich depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
          
          {/* Top Floating Utility HUD Row */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between pointer-events-none">
            <div className="flex h-6 sm:h-7 px-2 sm:px-2.5 items-center gap-1 sm:gap-1.5 rounded-md border border-zinc-700/30 bg-zinc-900/80 text-zinc-300 backdrop-blur-md shadow-lg">
              <Sparkles size={10} className="text-blue-400 animate-pulse shrink-0" />
              <span className="text-[8px] sm:text-[10px] font-mono uppercase font-bold tracking-wider truncate max-w-[100px] sm:max-w-none">Verified Identity</span>
            </div>

            <button
              type="button"
              onClick={onEdit}
              className="pointer-events-auto inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-md backdrop-blur-sm transition-all active:scale-95 select-none"
            >
              <Edit3 size={11} className="text-zinc-400 group-hover/profile-card:text-blue-400 transition-colors shrink-0" />
              <span>Modify</span>
            </button>
          </div>

          {/* MASTER AVATAR INTEGRATION COMPONENT */}
          <div className="absolute left-4 sm:left-6 bottom-0 transform translate-y-1/4 z-10">
            {profile.image ? (
              <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl border-2 border-zinc-700 bg-zinc-950 p-1 sm:p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-md group-hover/profile-card:border-blue-500/40 transition-colors duration-300">
                <img
                  src={profile.image}
                  alt={`${profile.name}'s avatar`}
                  className="h-full w-full rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-2 border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-200 font-bold text-2xl sm:text-3xl uppercase shadow-[0_12px_40px_rgba(0,0,0,0.9)] group-hover/profile-card:border-blue-500/40 transition-colors duration-300">
                {profile.name?.charAt(0) || "?"}
              </div>
            )}
          </div>
        </div>

        {/* SPACING BUFFER ADJUSTED FOR OVERLAY WEIGHT BALANCE */}
        <div className="h-10 sm:h-14" />

        {/* MAIN BODY DETAILS */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* PRIMARY ACCOUNT TITLE AND HANDLE SEGMENT */}
          <div className="space-y-1 pl-1 border-l-2 border-blue-500/50">
            <h2 className="text-lg sm:text-2xl font-black text-zinc-100 tracking-tight truncate">
              {profile.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-[10px] font-mono text-zinc-500">
              <span className="truncate">@{profile.username}</span>
              {profile.portfolio?.currentRole && (
                <>
                  <span className="text-zinc-700 hidden sm:inline">•</span>
                  <span className="text-zinc-400 font-sans font-medium w-full sm:w-auto block sm:inline mt-0.5 sm:mt-0">{profile.portfolio.currentRole}</span>
                </>
              )}
            </div>
          </div>

          {/* SYSTEM PROFILE RECONCILIATION IMAGE VISIBILITY WARNING BLOCKS */}
          <div className="space-y-3">
            {!profile.image && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-amber-300 text-xs leading-relaxed font-sans">
                ⚠️ Profile image visibility warning. Your portfolio profile image may not appear correctly until you manually upload and save a profile image at least once. Please update your profile image manually for proper portfolio visibility.
              </div>
            )}
            
            {profile.image && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-blue-300 text-xs leading-relaxed font-sans">
                ℹ️ If this profile image was imported automatically, we recommend uploading and saving it once manually to ensure maximum compatibility across all portfolio themes.
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            
            {/* PANEL: CORPORATE CARD DETAILS */}
            <div className="space-y-2.5">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase block pl-1 font-mono">Account Registry Info</span>
              <div className="rounded-xl border border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-zinc-900/5 p-3 sm:p-4.5 space-y-3 sm:space-y-3.5 text-xs sm:text-sm shadow-inner">
                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row border-b border-zinc-900/40 sm:border-0 pb-2 sm:pb-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Mail size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Registry Email</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium font-mono text-[11px] sm:text-xs sm:pl-0 pl-5">{profile.email || "—"}</div>
                </div>

                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row border-b border-zinc-900/40 sm:border-0 pb-2 sm:pb-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Phone size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Direct Line</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium text-[11px] sm:text-xs sm:pl-0 pl-5">{profile.phone || "—"}</div>
                </div>

                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row border-b border-zinc-900/40 sm:border-0 pb-2 sm:pb-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Globe size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Web Node</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium text-[11px] sm:text-xs sm:pl-0 pl-5">
                    {profile.website ? (
                      <a href={profile.website} target="_blank" rel="noreferrer" className="truncate text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 font-medium">
                        <span className="truncate max-w-[180px] sm:max-w-none">{profile.website}</span>
                        <Link2 size={10} className="text-zinc-600 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-zinc-500 font-medium">—</span>
                    )}
                  </div>
                </div>

                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row">
                  <div className="flex items-center gap-2 shrink-0">
                    <MapPin size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Geoloc</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium text-[11px] sm:text-xs sm:pl-0 pl-5">
                    {profile.city || profile.state || profile.country 
                      ? [profile.city, profile.state, profile.country].filter(Boolean).join(", ")
                      : "—"
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL: DYNAMIC INTERACTIVE DISPLAY CONTACT SPECIFICATIONS */}
            <div className="space-y-2.5">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase block pl-1 font-mono">Public Routing Parameters</span>
              <div className="rounded-xl border border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-zinc-900/5 p-3 sm:p-4.5 space-y-3 sm:space-y-3.5 text-xs sm:text-sm shadow-inner">
                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row border-b border-zinc-900/40 sm:border-0 pb-2 sm:pb-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Mail size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Display Mail</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium font-mono text-[11px] sm:text-xs sm:pl-0 pl-5">{profile.portfolio?.email || "—"}</div>
                </div>

                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row border-b border-zinc-900/40 sm:border-0 pb-2 sm:pb-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Phone size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Display Tel</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium text-[11px] sm:text-xs sm:pl-0 pl-5">{profile.portfolio?.phone || "—"}</div>
                </div>

                <div className="flex sm:items-center gap-2.5 sm:gap-3 text-zinc-400 min-w-0 flex-col sm:flex-row">
                  <div className="flex items-center gap-2 shrink-0">
                    <Globe size={13} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-500 font-medium text-[11px] sm:text-xs sm:w-16">Display Web</span>
                  </div>
                  <div className="truncate text-zinc-300 font-medium text-[11px] sm:text-xs sm:pl-0 pl-5">{profile.portfolio?.website || "—"}</div>
                </div>
              </div>
            </div>

            {/* PANEL: STRATEGY AND OBJECTIVE INDICES PLATFORM LAYOUT MAP */}
            <div className="space-y-2.5 md:col-span-2">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase block pl-1 font-mono">Portfolio Layout Index</span>
              <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/10 via-transparent to-transparent p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
                  <div className="flex gap-2.5 min-w-0">
                    <Compass size={14} className="text-blue-500/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Display Headline</div>
                      <div className="font-semibold text-zinc-200 mt-0.5 text-xs sm:text-sm break-words">{profile.portfolio?.title || "—"}</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 min-w-0 border-t border-zinc-900/60 pt-3 sm:pt-0 sm:border-0">
                    <Briefcase size={14} className="text-purple-500/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Target Designation Role</div>
                      <div className="font-semibold text-zinc-200 mt-0.5 text-xs sm:text-sm break-words">{profile.portfolio?.currentRole || "—"}</div>
                    </div>
                  </div>

                  {/* MODIFICATION 1: AVAILABILITY STATUS BLOCK */}
                  <div className="flex gap-2.5 min-w-0 border-t border-zinc-900/60 pt-3 sm:pt-0 sm:border-0">
                    <Sparkles size={14} className="text-emerald-500/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                        Availability Status
                      </div>
                      <div className="font-semibold text-zinc-200 mt-0.5 text-xs sm:text-sm break-words">
                        {profile.portfolio?.availabilityStatus || "—"}
                      </div>
                    </div>
                  </div>

                  {/* MODIFICATION 2: CURRENT FOCUS BLOCK */}
                  <div className="flex gap-2.5 min-w-0 border-t border-zinc-900 pt-3 sm:col-span-2">
                    <Compass size={14} className="text-cyan-500/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                        Current Focus
                      </div>
                      <div className="font-semibold text-zinc-200 mt-0.5 text-xs sm:text-sm break-words">
                        {profile.portfolio?.currentFocus || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 min-w-0 sm:col-span-2 border-t border-zinc-900 pt-3">
                    <FileText size={14} className="text-zinc-600 shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Dynamic Subtitle Axioms</div>
                      <div className="font-medium text-zinc-300 mt-1 leading-relaxed text-xs sm:text-sm">{profile.portfolio?.tagline || "—"}</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 min-w-0 sm:col-span-2 border-t border-zinc-900 pt-3">
                    <ShieldCheck size={14} className="text-emerald-500/60 shrink-0 mt-0.5 sm:mt-1" />
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Executive Objective Parameter</div>
                      <div className="font-medium text-zinc-300 mt-1 leading-relaxed text-xs sm:text-sm">{profile.portfolio?.resumeHeadline || "—"}</div>
                    </div>
                  </div>
                </div>

                {profile.portfolio?.bio && (
                  <div className="border-t border-zinc-900 pt-3 sm:pt-4.5 space-y-2">
                    <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-mono">
                      <MessageSquare size={11} className="text-zinc-600 shrink-0" />
                      <span>Biography Core Narrative</span>
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed break-words whitespace-pre-wrap font-sans pl-0.5">
                      {profile.portfolio.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}