"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  UploadCloud, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  Trash2, 
  Sparkles, 
  Info, 
  History, 
  Lightbulb, 
  Puzzle,
  Rocket,
  AlertCircle,
  Check
} from "lucide-react";
import ResumeUploader from "@/components/uploaders/resume-uploader";

import {
  getResume,
  getResumeVersions,
  saveResume,
  deleteResumeVersion,
} from "@/actions/resume";

import { getMyPortfolioId } from "@/actions/portfolio";

type Resume = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

type ResumeVersion = {
  id: string;
  portfolioId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
};

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced SaaS Operations States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Tracks which historical version string id is actively presenting the inline deletion confirmation banner
  const [activeConfirmDeleteId, setActiveConfirmDeleteId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Resolve asynchronous data collections concurrently
      const [resumeResult, versionsResult] = await Promise.all([
        getResume(),
        getResumeVersions(),
      ]);

      // 2. Structural safety checks enforcing the actions discriminated union contracts
      if (!resumeResult.success) {
        throw new Error(resumeResult.error || "Failed to load active resume specification profiles.");
      }

      if (!versionsResult.success) {
        throw new Error(versionsResult.error || "Failed to compile background resume history stacks.");
      }

      // 3. Unpack and normalize values safely into explicit state models
      setResume(
        resumeResult.data
          ? {
              id: resumeResult.data.id,
              fileName: resumeResult.data.fileName,
              fileUrl: resumeResult.data.fileUrl,
              uploadedAt: new Date(resumeResult.data.uploadedAt).toISOString(),
            }
          : null
      );

      setVersions(
        resumeResult.success && "data" in versionsResult && Array.isArray(versionsResult.data)
          ? versionsResult.data.map((version: any) => ({
              id: version.id,
              portfolioId: version.portfolioId,
              fileName: version.fileName,
              fileUrl: version.fileUrl,
              uploadedAt: new Date(version.uploadedAt),
            }))
          : []
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resume document database reference logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDeleteVersion(id: string) {
    try {
      setDeletingId(id);
      setActionError(null);
      
      const result = await deleteResumeVersion(id);

      if (!result.success) {
        throw new Error("error" in result && typeof result.error === "string" ? result.error : "Failed to clear document snapshot.");
      }

      setVersions((prev) => prev.filter((v) => v.id !== id));
      if (resume?.id === id) {
        setResume(null);
      }
      setActiveConfirmDeleteId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to purge selected database file reference version node safely.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
        <p className="text-[10px] sm:text-xs uppercase tracking-widest">// Synchronizing secure parsing repositories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-8 text-white font-sans antialiased relative">
      
      {/* FULL PAGE INGESTION PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none text-center text-white">
          <div className="bg-[#0C0C0E] border border-zinc-800 p-5 sm:p-8 rounded-xl sm:rounded-2xl max-w-md w-full space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 animate-pulse" />
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-500" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-100">Deep Content Structure Extraction In Progress</h3>
              <p className="text-[11px] sm:text-xs text-blue-400 font-mono font-medium animate-pulse">{processingStatus}</p>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg sm:rounded-xl text-left">
              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200">⚠️ System Pipeline Guard:</strong> Our text processing models are deconstructing, indexing, and mapping token values. Kindly do not panic, exit, or execute duplicate clicks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER ROW DESCRIPTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400">
              <FileText size={14} className="sm:w-[15px] sm:h-[15px]" />
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-zinc-100">Resume Ingestion Matrix</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-normal">
            Upload, update, and manage historical document versions mapping extracted portfolio layout sections.
          </p>
        </div>
      </div>

      {/* OPERATIONAL ERROR DOCK */}
      {(error || actionError) && (
        <div className="p-3 sm:p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-[11px] sm:text-xs text-red-400 flex items-start gap-2.5 sm:gap-3 animate-fadeIn">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5 sm:space-y-1 flex-1">
            <p className="font-bold">System Processing Mismatch Identified</p>
            <p className="text-red-400/80 leading-relaxed">{error || actionError}</p>
          </div>
          <button onClick={() => { setError(null); setActionError(null); }} className="text-zinc-600 hover:text-zinc-400 text-[10px] font-mono p-0.5">✕</button>
        </div>
      )}

      {/* OPERATIONAL SUCCESS NOTIFICATION BLOCK */}
      {successMessage && (
        <div className="p-3 sm:p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-[11px] sm:text-xs text-emerald-400 flex items-start gap-2.5 sm:gap-3 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5 sm:space-y-1 flex-1">
            <p className="font-bold">Resume Imported Successfully!</p>
            <p className="text-emerald-400/80 leading-relaxed">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-zinc-600 hover:text-emerald-400 text-[10px] font-mono p-0.5">✕</button>
        </div>
      )}

      {/* WARNING INTERFACE BOX */}
      <div className="rounded-xl border border-amber-500/10 bg-gradient-to-r from-amber-500/[0.02] to-transparent p-3 sm:p-4 flex gap-2.5 sm:gap-3.5 items-start animate-fadeIn">
        <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
          <p className="font-bold tracking-wide text-amber-400 uppercase font-mono text-[9px] sm:text-[10px]">
            CRITICAL INGESTION NOTICE &amp; EXTRACTION PARSING PERFORMANCE LIMITATIONS:
          </p>
          <div className="text-zinc-400 space-y-1 sm:space-y-1.5 leading-relaxed font-sans hidden sm:block">
            <p>
              • <strong className="text-zinc-200">Parsing Limitations:</strong> Structural document processing algorithms may experience validation drift depending on complex multi-column styling. <span className="text-amber-400/90 font-medium">This parser will intentionally omit graphic links, image assets, and missing asset icons.</span>
            </p>
            <p>
              • <strong className="text-zinc-200">Recommended Next Steps:</strong> Do not deploy your website immediately without checking it. We highly recommend navigation routing to each dashboard module independently (<span className="text-zinc-300 italic font-mono">Projects, Work Experience, Skills</span>) to verify content, supplement missing elements, and organize your fields manually.
            </p>
            <p>
              • <strong className="text-zinc-200">Custom Infrastructure Architecture:</strong> If your resume structure outlines specialized fields not tracked by default data containers, you can easily map them manually using our flexible <strong className="text-zinc-300">Custom Sections</strong> engine inside your layout builder base deck.
            </p>
          </div>
          <div className="text-zinc-400 leading-relaxed font-sans sm:hidden">
            <p>Document processing algorithms may experience validation drift depending on multi-column layouts. Please independently check dashboard modules (<span className="text-zinc-300 italic font-mono text-[10px]">Projects, Experience, Skills</span>) to verify data mapping validation structures manually before site deployment.</p>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!resume && (
        <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 p-5 sm:p-12 text-center max-w-2xl mx-auto animate-fadeIn transition-all hover:border-zinc-700/60">
          <div className="p-2 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl mb-3 sm:mb-4 text-zinc-400">
            <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-200 tracking-tight">Your Resume Processing Vector Is Unpopulated</h3>
          <p className="text-[11px] sm:text-sm text-zinc-500 mt-1 sm:mt-2 max-w-sm leading-relaxed">
            No document index found! Simply drag and drop your primary file down below, and watch our processing engines parse, map, and scaffold your portfolio!
          </p>
          
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-left w-full space-y-2 sm:space-y-3 font-sans">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-zinc-300">
              <Rocket className="w-3.5 h-3.5 text-blue-400" />
              <span>Instant Launch Sequence:</span>
            </div>
            <ul className="text-[11px] sm:text-xs text-zinc-500 space-y-1.5 sm:space-y-2 list-none pl-0.5">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-mono font-bold">1.</span>
                <span>Complete file drop matrix upload tracking rules via module interface below.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-mono font-bold">2.</span>
                <span>Watch structured parameters extract live into matching records.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* UPLOADER CONTAINER */}
      <div className="border border-zinc-800 rounded-xl p-4 sm:p-6 bg-[#0C0C0E] space-y-3 sm:space-y-4 shadow-sm group hover:border-zinc-700 transition-colors">
        <div className="flex items-center gap-2">
          <UploadCloud size={14} className="text-zinc-400 sm:w-[16px] sm:h-[16px]" />
          <h2 className="text-xs sm:text-sm font-bold text-zinc-200 uppercase font-mono tracking-wide">
            {resume ? "Replace Document Showcases" : "Ingest Source Resume"}
          </h2>
        </div>

        <ResumeUploader
          onUpload={async (fileUrl, fileName, file) => {
            if (isProcessing) return; // Strict concurrent submission lock
            setIsProcessing(true);
            setProcessingStatus("Uploading static resource files to Cloudinary repository...");
            try {
              // 4. Fire mutation saving file references
              const saveResult = await saveResume(fileName, fileUrl);
              
              if (!saveResult.success) {
                throw new Error("error" in saveResult && typeof saveResult.error === "string" ? saveResult.error : "Failed mapping cloud layout metrics.");
              }

              setProcessingStatus("Initializing text vector extraction models (Analyzing components)...");
              const formData = new FormData();
              formData.append("file", file);

              const parseResponse = await fetch("/api/resume/parse", {
                method: "POST",
                body: formData,
              });

              const parseResult = await parseResponse.json();

              if (!parseResponse.ok || !parseResult.success) {
                throw new Error(parseResult.error || "Static resource content indexing model failed.");
              }

              setProcessingStatus("Mapping properties and resolving content section overlaps...");
              
              // 5. Unwrap getMyPortfolioId envelope correctly
              const portfolioResult = await getMyPortfolioId();

              if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
                throw new Error("error" in portfolioResult && typeof portfolioResult.error === "string" ? portfolioResult.error : "Active user workspace lookup context rejected.");
              }

              const importResponse = await fetch("/api/resume/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  portfolioId: portfolioResult.data,
                  resume: parseResult.data,
                  fileName,
                  fileUrl,
                }),
              });

              const importResult = await importResponse.json();

              if (!importResult.success) {
                throw new Error(importResult.error || "Portfolio structural node importing dropped.");
              }

              setSuccessMessage("Your document fields have been converted, matched, and preserved without overwriting pre-existing structural sections.");
              await loadData();
            } catch (err) {
              setActionError(err instanceof Error ? err.message : "Inbound asynchronous extraction gateway failure occurred.");
            } finally {
              setIsProcessing(false);
              setProcessingStatus("");
            }
          }}
        />
      </div>

      {/* ACTIVE RESUME ROW CARD */}
      {resume && (
        <div className="border border-zinc-800 rounded-xl p-4 sm:p-6 bg-[#0C0C0E] animate-fadeIn group hover:border-zinc-700 transition-colors">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Sparkles size={12} className="text-blue-400 sm:w-[14px] sm:h-[14px]" />
            <h2 className="text-xs sm:text-sm font-bold text-zinc-200 uppercase font-mono tracking-wide">Active Resource Index</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-xl border border-zinc-900 bg-zinc-950 p-3 sm:p-4 hover:border-zinc-800 transition-colors">
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-zinc-200 truncate pr-4">{resume.fileName}</p>
                <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 mt-0.5">
                  Ingested on {new Date(resume.uploadedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 sm:h-8 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-3 sm:px-4 text-[11px] sm:text-xs font-bold transition-all active:scale-98 select-none shrink-0 w-full sm:w-auto mt-1 sm:mt-0"
            >
              <Eye size={11} className="sm:w-[12px] sm:h-[12px]" />
              <span>View Resume</span>
            </a>
          </div>
        </div>
      )}

      {/* VERSION HISTORY PIPELINE */}
      {versions.length > 0 && (
        <div className="border border-zinc-800 rounded-xl p-4 sm:p-6 bg-[#0C0C0E] animate-fadeIn group hover:border-zinc-700 transition-colors">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <History size={12} className="text-zinc-500" />
            <h2 className="text-xs sm:text-sm font-bold text-zinc-200 uppercase font-mono tracking-wide">Version Control History Stack</h2>
          </div>

          <div className="space-y-2 sm:space-y-3 max-h-[40vh] overflow-y-auto pr-0.5 custom-scrollbar">
            {versions.map((version) => {
              const isCurrentlyPurging = deletingId === version.id;

              return (
                <div
                  key={version.id}
                  className="flex flex-col rounded-xl border border-zinc-900/60 bg-zinc-950/40 p-3 sm:p-4 hover:border-zinc-800/80 hover:bg-zinc-950 transition-all gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 w-full">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 shrink-0 mt-0.5">
                        <FileText size={14} className="sm:w-[16px] sm:h-[16px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] sm:text-xs font-semibold text-zinc-300 truncate pr-2 sm:pr-4">{version.fileName}</p>
                        <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500 mt-0.5">
                          Uploaded {new Date(version.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {activeConfirmDeleteId !== version.id && (
                      <div className="flex items-center gap-2 justify-end w-full sm:w-auto shrink-0 border-t border-zinc-900/50 sm:border-t-0 pt-2 sm:pt-0">
                        <a
                          href={version.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-[26px] sm:h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors select-none flex-1 sm:flex-none"
                        >
                          View
                        </a>

                        <button
                          type="button"
                          disabled={deletingId !== null}
                          onClick={() => setActiveConfirmDeleteId(version.id)}
                          className="inline-flex h-[26px] sm:h-7 items-center justify-center gap-1 px-2.5 sm:px-3 rounded-md border border-red-950/40 bg-red-950/10 hover:bg-red-950/20 text-red-400 text-[11px] sm:text-xs font-semibold transition-colors disabled:opacity-40 select-none min-w-[65px] flex-1 sm:flex-none"
                        >
                          <Trash2 size={11} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* LOCAL DELETE OVERLAY ROW */}
                  {activeConfirmDeleteId === version.id && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5 flex items-center justify-between gap-3 animate-fadeIn w-full">
                      <div className="flex items-center gap-1.5 text-red-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                        <AlertCircle size={12} className="animate-pulse shrink-0" />
                        <span>Purge File Variant?</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveConfirmDeleteId(null)}
                          className="h-[26px] sm:h-7 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px] sm:text-xs font-bold uppercase px-3 hover:bg-zinc-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isCurrentlyPurging}
                          onClick={() => handleDeleteVersion(version.id)}
                          className="h-[26px] sm:h-7 rounded-md bg-red-600 text-white font-mono text-[10px] sm:text-xs font-bold uppercase px-3 inline-flex items-center gap-1 hover:bg-red-500 transition-colors"
                        >
                          {isCurrentlyPurging ? <Loader2 size={10} className="animate-spin" /> : <Check size={11} />}
                          <span>{isCurrentlyPurging ? "Purging" : "Purge"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FOOTER METRICS SUGGESTIONS */}
      <div className="p-3 sm:p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex gap-2 sm:gap-2.5 items-start">
          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-zinc-300 uppercase font-mono tracking-wider text-[8px] sm:text-[9px]">Recruiter Scan Optimization:</h4>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed">
              Updating your resume extracts structure while keeping manual changes safe. We store older versions to back up text parameters.
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-2.5 items-start">
          <Puzzle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-zinc-300 uppercase font-mono tracking-wider text-[8px] sm:text-[9px]">Custom Showcase Assembly:</h4>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed">
              If layout parsing acts incomplete, simply input information directly using the dashboard fields before updating your public URL.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}