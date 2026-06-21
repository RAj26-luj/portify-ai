"use client";

import { useState, useEffect } from "react";
import { Loader2, Terminal, Calendar, Award, FileText, Image as ImageIcon, Globe, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createCertification,
  updateCertification,
} from "@/actions/certification";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";

type Props = {
  portfolioId?: string;
  initialData?: any;
  onSuccess?: () => void;
  onClose?: () => void;
};

export default function CertificationForm({
  portfolioId = "",
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [certificateImage, setCertificateImage] = useState("");
  const [certificatePdf, setCertificatePdf] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  // Dynamic skill tag states
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [currentSkillInput, setCurrentSkillInput] = useState("");

  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const { upload } = useUpload();

  // Interactive Validation & Delta State Flags
  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ✅ load data when editing
  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name || "");
    setIssuer(initialData.issuer || "");
    setCredentialId(initialData.credentialId || "");
    setCredentialUrl(initialData.credentialUrl || "");
    setCertificateImage(initialData.certificateImage || "");
    setCertificatePdf(initialData.certificatePdf || "");

    setIssueDate(
      initialData.issueDate
        ? new Date(initialData.issueDate).toISOString().split("T")[0]
        : ""
    );

    setExpiryDate(
      initialData.expiryDate
        ? new Date(initialData.expiryDate).toISOString().split("T")[0]
        : ""
    );

    if (Array.isArray(initialData.skillsCovered)) {
      setSkillsList(initialData.skillsCovered);
    } else if (typeof initialData.skillsCovered === "string" && initialData.skillsCovered.trim() !== "") {
      setSkillsList(initialData.skillsCovered.split(",").map((s: string) => s.trim()));
    } else {
      setSkillsList([]);
    }

    setFeatured(initialData.featured || false);
  }, [initialData]);

  // Track global dataset property deltas to safely configure form interaction buttons
  useEffect(() => {
    const isNameChanged = name.trim() !== (initialData?.name || "");
    const isIssuerChanged = issuer.trim() !== (initialData?.issuer || "");
    const isCredIdChanged = credentialId.trim() !== (initialData?.credentialId || "");
    const isCredUrlChanged = credentialUrl.trim() !== (initialData?.credentialUrl || "");
    const isImageChanged = certificateImage.trim() !== (initialData?.certificateImage || "");
    const isPdfChanged = certificatePdf.trim() !== (initialData?.certificatePdf || "");
    const isFeaturedChanged = featured !== (initialData?.featured || false);

    const initialIssueDateStr = initialData?.issueDate
      ? new Date(initialData.issueDate).toISOString().split("T")[0]
      : "";
    const isIssueDateChanged = issueDate !== initialIssueDateStr;

    const initialExpiryDateStr = initialData?.expiryDate
      ? new Date(initialData.expiryDate).toISOString().split("T")[0]
      : "";
    const isExpiryDateChanged = expiryDate !== initialExpiryDateStr;

    const initialSkills = Array.isArray(initialData?.skillsCovered)
      ? initialData.skillsCovered
      : typeof initialData?.skillsCovered === "string" && initialData.skillsCovered.trim() !== ""
      ? initialData.skillsCovered.split(",").map((s: string) => s.trim())
      : [];
    const areSkillsChanged = JSON.stringify(skillsList) !== JSON.stringify(initialSkills);

    setHasChanges(
      isNameChanged || isIssuerChanged || isCredIdChanged || isCredUrlChanged ||
      isImageChanged || isPdfChanged || isIssueDateChanged || isExpiryDateChanged ||
      isFeaturedChanged || areSkillsChanged
    );
  }, [name, issuer, credentialId, credentialUrl, certificateImage, certificatePdf, issueDate, expiryDate, featured, skillsList, initialData]);

  // Reactive Custom Form Constraint Evaluation Flags
  const isNameInvalid = name.trim() === "";
  const isIssuerInvalid = issuer.trim() === "";
  const isIssueDateInvalid = !issueDate;
  const isExpiryDateInvalid = !!(issueDate && expiryDate && new Date(expiryDate) < new Date(issueDate));
  
  const isFormInvalid = isNameInvalid || isIssuerInvalid || isIssueDateInvalid || isExpiryDateInvalid;

  function handleAddSkill() {
    const trimmed = currentSkillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList((prev) => [...prev, trimmed]);
    }
    setCurrentSkillInput("");
  }

  function handleRemoveSkill(skillToRemove: string) {
    setSkillsList((prev) => prev.filter((s) => s !== skillToRemove));
  }

  async function handleImageUpload(file: File) {
    const res = await upload(
      file,
      CLOUDINARY_FOLDERS.certificates,
      "image"
    );
    return res.url;
  }

  async function handlePdfUpload(file: File) {
    const res = await upload(
      file,
      CLOUDINARY_FOLDERS.certificates,
      "document"
    );
    return res.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        issuer: issuer.trim(),
        credentialId: credentialId.trim() || undefined,
        credentialUrl: credentialUrl.trim() || undefined,
        certificateImage: certificateImage.trim() || undefined,
        certificatePdf: certificatePdf.trim() || undefined,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        skillsCovered: skillsList.map((s) => s.trim()).filter(Boolean),
        featured,
      };

      if (initialData?.id) {
        await updateCertification(initialData.id, payload);
      } else {
        await createCertification({
          portfolioId,
          ...payload,
        });
      }

      onSuccess?.();
      onClose?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 select-none animate-fadeIn">
      
      {/* ELITE CYBERPUNK PREMIUM DARK SURFACED CONTAINER */}
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-sm sm:max-w-xl space-y-4 sm:space-y-5 rounded-xl bg-[#0C0C0E] p-4 sm:p-6 text-zinc-300 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/10 max-h-[92vh] overflow-y-auto font-sans selection:bg-blue-500/30 selection:text-white"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5 sm:pb-3">
          <h2 className="font-black text-base sm:text-xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 tracking-tight flex items-center gap-1.5">
            <Award size={16} className="text-blue-400 shrink-0" />
            <span>{initialData?.id ? "Edit Certification" : "Add Certification"}</span>
          </h2>

          <button 
            type="button" 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 text-base sm:text-xl font-bold focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* GUIDANCE INFO BLOCK */}
        <div className="bg-[#121214] border border-white/5 rounded-lg p-3 text-[11px] text-zinc-400 leading-relaxed font-sans">
          <strong className="text-zinc-200">Certification Node Mapping:</strong> Fill out the credential metadata framework fields below to register this credential within your profile dashboard context layout view. We highly recommend completing the skills sector to enhance discovery telemetry.
        </div>

        {/* INPUT FIELDS AREA */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
              <span>Certification Name <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
              <div className="flex items-center gap-1.5">
                {isTouched && isNameInvalid ? (
                  <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                    <AlertCircle size={10} /> missing_name
                  </span>
                ) : name.trim() ? (
                  <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                    <CheckCircle2 size={10} /> validated
                  </span>
                ) : null}
                {hasChanges && (
                  <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">edited</span>
                )}
                <Terminal size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. AWS Certified Solutions Architect"
              className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] shadow-inner transition-all duration-200 ${isTouched && isNameInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
              disabled={loading}
            />
            {isTouched && isNameInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5 flex items-center gap-1">
                ⚠️ Field validation missed: Name index parameters cannot remain unpopulated.
              </p>
            )}
            <span className="text-[10px] text-zinc-500 leading-tight">We highly recommend providing the precise credential name string to preserve maximum alignment metrics.</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
              <span>Issuer Entity <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
              <div className="flex items-center gap-1">
                {isTouched && isIssuerInvalid ? (
                  <span className="text-[9px] font-mono text-red-400 lowercase flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                    <AlertCircle size={10} /> missing_issuer
                  </span>
                ) : issuer.trim() ? (
                  <span className="text-[9px] font-mono text-emerald-400 lowercase flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                    <CheckCircle2 size={10} /> validated
                  </span>
                ) : null}
              </div>
            </label>
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. Amazon Web Services (AWS)"
              className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] shadow-inner transition-all duration-200 ${isTouched && isIssuerInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
              disabled={loading}
            />
            {isTouched && isIssuerInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5 flex items-center gap-1">
                ⚠️ Field validation missed: Issuer entity parameters must be defined.
              </p>
            )}
            <span className="text-[10px] text-zinc-500 leading-tight">The structural corporate authority body that verified this token (e.g. Microsoft, Google, Scrum Alliance).</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex justify-between">
                <span>Credential ID <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. AWS-SEC-12345"
                className="w-full text-xs sm:text-sm rounded border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex justify-between">
                <span>Credential URL <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="e.g. https://credly.com/verify-id"
                className="w-full text-xs sm:text-sm rounded border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* ASSET ACQUISITION HINT FOR FILE PREVIEWS */}
          <div className="text-[9px] sm:text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 leading-normal flex items-start gap-1.5">
            <Globe size={12} className="shrink-0 mt-0.5 text-amber-500" />
            <span>
              <strong>Emblem Asset Advice:</strong> For branding logos or credential icons, we recommend searching for the entity brand logo (e.g., AWS badge SVG) via Google Image Search, right-clicking to click <strong>&quot;Copy Image Address / URL&quot;</strong>, and storing it directly into live references.
            </span>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
            <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <ImageIcon size={11} className="text-zinc-600" />
              <span>Certificate Image Thumbnail <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await handleImageUpload(file);
                setCertificateImage(url);
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 file:transition-colors file:cursor-pointer border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
              disabled={loading}
            />

            {certificateImage && (
              <img
                src={certificateImage}
                alt="Certificate Preview"
                className="w-16 sm:w-24 rounded border border-white/5 mt-1.5 opacity-80 object-cover bg-zinc-950 p-1"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <FileText size={11} className="text-zinc-600" />
              <span>Certificate PDF Document <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await handlePdfUpload(file);
                setCertificatePdf(url);
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 file:transition-colors file:cursor-pointer border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
              disabled={loading}
            />

            {certificatePdf && (
              <a
                href={certificatePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs font-mono underline block mt-1 break-all"
              >
                // link: inspect_uploaded_document_blob
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border-t border-white/5 pt-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span>Issue Date <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
                <div>
                  {isTouched && isIssueDateInvalid ? (
                    <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">missing_date</span>
                  ) : issueDate ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10">ready</span>
                  ) : null}
                </div>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                onBlur={() => setIsTouched(true)}
                className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white focus:outline-none focus:border-blue-500/60 color-scheme-dark ${isTouched && isIssueDateInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span>Expiry Date <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
                {isTouched && isExpiryDateInvalid && (
                  <span className="text-[9px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10">invalid_timeline</span>
                )}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                onBlur={() => setIsTouched(true)}
                className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white focus:outline-none focus:border-blue-500/60 color-scheme-dark ${isTouched && isExpiryDateInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
                disabled={loading}
              />
              {isTouched && isExpiryDateInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                  ⚠️ Bounds failure: Expiry cannot timeline log before initialization.
                </p>
              )}
            </div>
          </div>

          {/* DYNAMIC SKILL ADD BAR COMPONENT WITH ADD ICON BUTTON */}
          <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
            <label className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Skills Covered <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></label>
            
            <div className="flex gap-2">
              <input
                value={currentSkillInput}
                onChange={(e) => setCurrentSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. React) and press Enter"
                className="flex-1 text-xs sm:text-sm rounded border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold rounded text-xs transition duration-200 whitespace-nowrap flex items-center h-9 sm:h-auto border border-white/5"
                disabled={loading}
              >
                + Add
              </button>
            </div>

            {/* DYNAMIC PILL CONTAINER */}
            {skillsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 bg-[#0A0A0B] border border-white/5 p-2 rounded-lg max-h-28 overflow-y-auto">
                {skillsList.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-400/60 hover:text-blue-300 font-bold ml-0.5 focus:outline-none text-[9px]"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FEATURED CHECKBOX */}
        <div className="pt-1.5">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 select-none cursor-pointer group">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] cursor-pointer"
              disabled={loading}
            />
            <span className="group-hover:text-white transition-colors">Feature this certification on my main profile dashboard</span>
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white font-mono font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm transition-colors focus:outline-none border border-white/5"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold py-2.5 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm text-xs sm:text-sm focus:outline-none uppercase tracking-wider text-center"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin shrink-0" />
                <span>Syncing Node...</span>
              </>
            ) : !hasChanges && initialData?.id !== undefined ? (
              "No Changes Detected"
          ) : initialData?.id ? (
              "Update Certification"
            ) : (
              "Save Certification"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}