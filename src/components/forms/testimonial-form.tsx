"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2, Briefcase, Globe, FileText, Sparkles, Terminal } from "lucide-react";
import { createTestimonial, updateTestimonial } from "@/actions/testimonial";

interface TestimonialData {
  id: string;
  portfolioId: string;
  authorName: string;
  authorRole?: string | null;
  company?: string | null;
  testimonial: string;
  profileImage?: string | null;
  linkedinUrl?: string | null;
  companyLogo?: string | null;
  featured: boolean;
}

interface Props {
  portfolioId: string;
  initialData?: TestimonialData;
  onSuccess: () => Promise<void> | void;
  onClose: () => void;
}

export default function TestimonialForm({
  portfolioId,
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [authorRole, setAuthorRole] = useState(initialData?.authorRole || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [testimonial, setTestimonial] = useState(initialData?.testimonial || "");
  const [profileImage, setProfileImage] = useState(initialData?.profileImage || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl || "");
  const [companyLogo, setCompanyLogo] = useState(initialData?.companyLogo || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);

  // High-fidelity touch tracking and state changes flags
  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Monitors state parameters for deep delta mismatch evaluation
  useEffect(() => {
    const isNameChanged = authorName.trim() !== (initialData?.authorName || "");
    const isRoleChanged = authorRole.trim() !== (initialData?.authorRole || "");
    const isCompanyChanged = company.trim() !== (initialData?.company || "");
    const isTestimonialChanged = testimonial.trim() !== (initialData?.testimonial || "");
    const isProfileImageChanged = profileImage.trim() !== (initialData?.profileImage || "");
    const isLinkedinUrlChanged = linkedinUrl.trim() !== (initialData?.linkedinUrl || "");
    const isCompanyLogoChanged = companyLogo.trim() !== (initialData?.companyLogo || "");
    const isFeaturedChanged = featured !== (initialData?.featured || false);

    setHasChanges(
      isNameChanged || isRoleChanged || isCompanyChanged || isTestimonialChanged ||
      isProfileImageChanged || isLinkedinUrlChanged || isCompanyLogoChanged || isFeaturedChanged
    );
  }, [authorName, authorRole, company, testimonial, profileImage, linkedinUrl, companyLogo, featured, initialData]);

  // Reactive Custom Form Constraint Evaluation Flags
  const isNameInvalid = authorName.trim() === "";
  const isTestimonialInvalid = testimonial.trim() === "" || testimonial.trim().length < 10;
  const isLinkedinInvalid = linkedinUrl.trim() !== "" && !linkedinUrl.trim().startsWith("http://") && !linkedinUrl.trim().startsWith("https://");
  
  const isFormInvalid = isNameInvalid || isTestimonialInvalid || isLinkedinInvalid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);

    if (isSubmitting) return;
    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;

    setFormError(null);
    setIsSubmitting(true);
    
    try {
      const payloads = {
        portfolioId: portfolioId || initialData?.portfolioId || "",
        authorName: authorName.trim(),
        testimonial: testimonial.trim(),
        featured,
        authorRole: authorRole.trim() || undefined,
        company: company.trim() || undefined,
        profileImage: profileImage.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        companyLogo: companyLogo.trim() || undefined,
      };

      if (initialData?.id) {
        await updateTestimonial(initialData.id, payloads);
      } else {
        await createTestimonial(payloads);
      }

      await onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Operational backend submission failure encountered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-white/5 bg-[#0A0A0B] p-2.5 sm:p-3 text-zinc-200 placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] transition-all duration-200 disabled:opacity-40 shadow-inner font-sans";

  const labelStyle = 
    "mb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 group-hover/input:text-zinc-300 transition-colors";

  const descriptionStyle = 
    "text-[10px] sm:text-xs text-zinc-500 font-sans leading-normal block mt-1";

  const scrapeRecommendationStyle = 
    "text-[9px] sm:text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 mt-1 leading-normal flex items-start gap-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 text-zinc-300 bg-[#0C0C0E] p-4 sm:p-6 rounded-none sm:rounded-xl max-w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans select-none animate-fadeIn"
    >
      {/* HEADER SECTION CONTEXT INFO */}
      <div className="bg-[#121214] border border-white/5 rounded-lg p-3 sm:p-4 mb-1">
        <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Sparkles size={14} className="text-blue-400" />
          <span>Professional Endorsement Layer Configuration</span>
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          Configure peer evaluations, client testimonials, or manager recommendations here. Populating verification channels and corporate labels systematically validates your platform track records.
        </p>
      </div>

      {formError && (
        <div className="p-3 rounded-lg border border-red-500/10 bg-red-500/5 text-xs text-red-400 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Author Name */}
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span className="flex items-center gap-1">Endorser Full Name <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
            <div className="flex items-center gap-1.5">
              {isTouched && isNameInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> missing_identity</span>
              ) : authorName.trim() ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> token_resolved</span>
              ) : null}
              {hasChanges && (
                <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">edited</span>
              )}
              <Terminal size={10} className="text-zinc-700 hidden sm:block" />
            </div>
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            onBlur={() => setIsTouched(true)}
            disabled={isSubmitting}
            placeholder="e.g. Sarah Connor"
            className={`${inputStyle} ${isTouched && isNameInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          />
          {isTouched && isNameInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Identification failure: Absolute headline author name string required.</p>
          )}
          <span className={descriptionStyle}>The identity name mapping token representing the industry connection conferring this recommendation. Displays as the primary headline name.</span>
        </div>

        {/* Role & Company Layout Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <div className="space-y-1 group/input">
            <label className={labelStyle}>
              <span>Corporate Designation <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <Briefcase className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
            </label>
            <input
              type="text"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Principal Software Engineer"
              className={inputStyle}
            />
          </div>

          <div className="space-y-1 group/input">
            <label className={labelStyle}>
              <span>Organization / Company <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <Globe className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Cyberdyne Systems"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Testimonial Core Abstract Description Content */}
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span className="flex items-center gap-1">Recommendation Statement Copy <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
            <div className="flex items-center gap-1.5">
              {isTouched && isTestimonialInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> content_too_short</span>
              ) : testimonial.trim().length >= 10 ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> content_verified</span>
              ) : null}
              <FileText className="w-3.5 h-3.5 text-zinc-700 hidden sm:block" />
            </div>
          </label>
          <textarea
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            onBlur={() => setIsTouched(true)}
            disabled={isSubmitting}
            rows={4}
            placeholder="Paste verbatim recommendation feedback or assessment review blocks here directly..."
            className={`${inputStyle} resize-none ${isTouched && isTestimonialInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          />
          {isTouched && isTestimonialInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Data validation warning: Assessment copy parameter must span at least 10 character logs.</p>
          )}
          <span className={descriptionStyle}>The verified paragraph blocks mapping your architectural talents, delivery behaviors, or engineering feats. Appears as the core block description block text.</span>
        </div>

        {/* Verification Link Integration */}
        <div className="space-y-1 group/input">
          <label className={labelStyle}>
            <span>LinkedIn Reference Verification URL <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            <div className="flex items-center gap-1.5">
              {isTouched && isLinkedinInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> syntax_invalid</span>
              ) : linkedinUrl.trim() && !isLinkedinInvalid ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> syntax_clean</span>
              ) : null}
              <Globe className="w-3.5 h-3.5 text-zinc-700 hidden sm:block" />
            </div>
          </label>
          <input
            type="text"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            onBlur={() => setIsTouched(true)}
            disabled={isSubmitting}
            placeholder="https://linkedin.com/in/username"
            className={`${inputStyle} ${isTouched && isLinkedinInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          />
          {isTouched && isLinkedinInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Protocol warning: Asset verification path must resolve with valid absolute URL headers (http:// or https://).</p>
          )}
          <span className={descriptionStyle}>Absolute hyperlink pointer checking out directly to the source recommendation thread or corporate profile.</span>
        </div>

        {/* GOOGLE IMAGE REFERENCE ASSET ACQUISITION PROTOCOL INSTRUCTIONS */}
        <div className={scrapeRecommendationStyle}>
          <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
          <span>
            <strong>Asset Discovery Advice:</strong> If you are mapping endorser avatars or branding company indices from live web environments instead of local system uploads, look for the official asset on Google Images. Right-click the graphic box, select <strong>&quot;Copy Image Address / URL&quot;</strong>, and paste the clear token string into the links below.
          </span>
        </div>

        {/* Identity Resource Link Arrays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <div className="space-y-1 group/input">
            <label className={labelStyle}><span>Avatar Image Resource Link <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span></label>
            
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              disabled={isSubmitting}
              placeholder="https://example.com/avatar-asset.jpg"
              className={inputStyle}
            />
            {profileImage && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
                <img src={profileImage} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover opacity-80" />
              </div>
            )}
          </div>

          <div className="space-y-1 group/input">
            <label className={labelStyle}><span>Corporate Identity Brand Logo Link <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span></label>
            
            <input
              type="text"
              value={companyLogo}
              onChange={(e) => setCompanyLogo(e.target.value)}
              disabled={isSubmitting}
              placeholder="https://example.com/brand-logo.png"
              className={inputStyle}
            />
            {companyLogo && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
                <img src={companyLogo} alt="Logo Preview" className="w-10 h-10 rounded object-contain opacity-80" />
              </div>
            )}
          </div>
        </div>

        {/* Feature Pin Control Node Switch Box */}
        <div className="pt-1.5">
          <label className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-zinc-400 select-none cursor-pointer group">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] mt-0.5 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="group-hover:text-white transition-colors flex items-center gap-1.5">
                <Sparkles className={`w-3 h-3 ${featured ? "text-amber-400 fill-amber-400/20" : "text-zinc-500"}`} />
                Pin Entry As Featured Node
              </span>
              <span className="text-[10px] text-zinc-500 font-normal mt-0.5">Elevates visibility hierarchy directly onto the primary profile stream overview cards.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Button Operational Blocks Footer Dock */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white py-3 px-4 rounded-lg text-center focus:outline-none transition-all duration-200 order-2 sm:order-1 border border-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
          className="w-full sm:flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] focus:outline-none order-1 sm:order-2 h-11 text-center"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Saving Changes...</span>
            </span>
          ) : !hasChanges && initialData?.id !== undefined ? (
            "No Changes Detected"
          ) : initialData?.id ? (
            "Update Testimonial"
          ) : (
            "Commit Node Instance"
          )}
        </button>
      </div>
    </form>
  );
}