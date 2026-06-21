"use client";

import { useState, useRef } from "react";
import { Loader2, FileText, UploadCloud, X, AlertCircle, CheckCircle2, Terminal } from "lucide-react";

interface ResumeUploaderProps {
  onUpload?: (
    fileUrl: string,
    fileName: string,
    file: File
  ) => Promise<void> | void;
}

type UploadState = "IDLE" | "CONVERTING" | "SYNCING" | "FINALIZING" | "ERROR";

export default function ResumeUploader({
  onUpload,
}: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("IDLE");
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleFileSelection = (selectedFile: File | null) => {
    setErrorMessage(null);
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("Format error: System pipeline explicitly restricts ingestion to .pdf formats.");
      setUploadState("ERROR");
      return;
    }

    setFile(selectedFile);
    setUploadState("IDLE");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  async function handleUpload() {
    if (!file) return;

    try {
      setErrorMessage(null);
      setUploadState("CONVERTING");
      const base64File = await fileToBase64(file);

      setUploadState("SYNCING");
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64File,
          folder: "resumes",
          type: "document",
        }),
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(uploadResult.message || "Upstream pipeline upload failed.");
      }

      setUploadState("FINALIZING");
      const fileUrl = uploadResult.data.url;
      const fileName = uploadResult.data.name || file.name;

      await onUpload?.(fileUrl, fileName, file);
      setFile(null);
      setUploadState("IDLE");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Operational backend transmission failure encountered.");
      setUploadState("ERROR");
    }
  }

  const isProcessing = uploadState === "CONVERTING" || uploadState === "SYNCING" || uploadState === "FINALIZING";

  return (
    <div className="space-y-4 max-w-full font-sans antialiased selection:bg-blue-500/30 select-none animate-fadeIn">
      
      {/* DRAG AND DROP MATRIX AREA */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative w-full rounded-xl border border-dashed p-6 sm:p-8 text-center transition-all duration-300 group flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] cursor-pointer ${
          isDragActive 
            ? "border-blue-500/50 bg-blue-500/[0.02] shadow-[0_0_25px_rgba(59,130,246,0.06)] scale-[0.99]" 
            : file 
            ? "border-emerald-500/20 bg-emerald-500/[0.01]" 
            : "border-white/5 bg-[#070709] hover:border-white/10 hover:bg-[#0A0A0C]"
        } ${isProcessing ? "opacity-40 pointer-events-none cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          disabled={isProcessing}
          onChange={(e) => handleFileSelection(e.target.files?.[0] ?? null)}
          className="hidden"
        />

        {file ? (
          /* SELECTED FILE INTERFACE MATRIX */
          <div className="space-y-3 sm:space-y-4 w-full max-w-sm sm:max-w-md animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 mx-auto shadow-inner">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-zinc-200 truncate px-4">{file.name}</p>
              <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document Layer
              </p>
            </div>
            
            {!isProcessing && (
              <button
                type="button"
                onClick={() => { setFile(null); setUploadState("IDLE"); }}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 rounded-lg border border-white/5 bg-zinc-950 text-zinc-500 hover:text-white transition-colors focus:outline-none"
              >
                <X size={13} />
              </button>
            )}
          </div>
        ) : (
          /* IDLE INGESTION PLACEHOLDER INTERFACE */
          <div className="space-y-3 sm:space-y-4 pointer-events-none">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/5 bg-zinc-950 text-zinc-500 group-hover:text-zinc-300 group-hover:border-white/10 transition-colors shadow-inner mx-auto">
              <UploadCloud className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-zinc-300 tracking-tight flex items-center justify-center gap-1">
                <span>Drag and drop resume payload or</span>
                <span className="text-blue-400 font-extrabold group-hover:text-blue-300 transition-colors underline decoration-blue-500/30">browse files</span>
              </p>
              <p className="text-[10px] text-zinc-500 font-medium font-sans">
                Supported framework parameters explicitly limited to <span className="text-zinc-400 font-mono">.pdf</span> binaries
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ERROR FEEDBACK DIAGNOSTICS */}
      {uploadState === "ERROR" && errorMessage && (
        <div className="p-3 rounded-lg border border-red-500/10 bg-red-500/5 text-[11px] sm:text-xs text-red-400 flex items-start gap-2 animate-fadeIn font-mono">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* REACTION SYSTEM TELEMETRY PROGRESS FOOTER */}
      {isProcessing && (
        <div className="p-3 rounded-lg border border-zinc-900 bg-zinc-950/60 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest flex items-center justify-between gap-4 animate-pulse select-none">
          <div className="flex items-center gap-2">
            <Terminal size={11} className="text-blue-500 shrink-0" />
            <span className="text-zinc-400 font-bold">
              {uploadState === "CONVERTING" && "Converting file parameters..."}
              {uploadState === "SYNCING" && "Syncing cloud cluster database layers..."}
              {uploadState === "FINALIZING" && "Finalizing extraction triggers..."}
            </span>
          </div>
          <span className="text-[10px] text-zinc-600 font-extrabold lowercase">
            {uploadState === "CONVERTING" && "[base64_mapping]"}
            {uploadState === "SYNCING" && "[cloud_transfer_active]"}
            {uploadState === "FINALIZING" && "[refresh_layer_init]"}
          </span>
        </div>
      )}

      {/* SUBMISSION CONTROL TERMINAL BUTTON */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || isProcessing}
        className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] focus:outline-none"
      >
        {isProcessing ? (
          <>
            <Loader2 size={13} className="animate-spin shrink-0" />
            <span>Processing Resume Data Node...</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={13} className={file ? "text-white" : "text-white/40"} />
            <span>Initialize Resume Extraction</span>
          </>
        )}
      </button>

    </div>
  );
}