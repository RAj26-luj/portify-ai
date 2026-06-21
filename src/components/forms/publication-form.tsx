"use client";

import { useState, useEffect } from "react";
import { Loader2, Terminal, BookOpen, Calendar, Award, FileText, Image as ImageIcon, Globe, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createPublication,
  updatePublication,
} from "@/actions/publication";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";

type Props = {
  portfolioId: string;
  initialData?: {
    id?: string;
    title?: string;
    journal?: string | null;
    featured?: boolean;
    publisher?: string | null;
    publicationDate?: string | Date | null;
    doi?: string | null;
    citations?: number | null;
    abstract?: string | null;
    publicationUrl?: string | null;
    pdfUrl?: string | null;
    conference?: string | null;
    publicationCover?: string | null;
    authors?: string[] | string; // ✨ FIXED: Allowed string type along with string[]
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export default function PublicationForm({
  portfolioId,
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [journal, setJournal] = useState(initialData?.journal ?? "");
  const [publisher, setPublisher] = useState(initialData?.publisher ?? "");
  const [doi, setDoi] = useState(initialData?.doi ?? "");
  const [citations, setCitations] = useState<number>(
    initialData?.citations ?? 0
  );
  const [abstract, setAbstract] = useState(initialData?.abstract ?? "");
  const [publicationUrl, setPublicationUrl] = useState(
    initialData?.publicationUrl ?? ""
  );
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl ?? "");
  const [conference, setConference] = useState(
    initialData?.conference ?? ""
  );
  const [publicationCover, setPublicationCover] = useState(
    initialData?.publicationCover ?? ""
  );

  // Dynamic state management for Authors array
  const [authorsList, setAuthorsList] = useState<string[]>([]);
  const [currentAuthorInput, setCurrentAuthorInput] = useState("");

  const [publicationDate, setPublicationDate] = useState(
    initialData?.publicationDate
      ? new Date(initialData.publicationDate)
          .toISOString()
          .split("T")[0]
      : ""
  );

  const [featured, setFeatured] = useState(
    initialData?.featured ?? false
  );

  const [loading, setLoading] = useState(false);
  const { upload } = useUpload();

  // High-fidelity validation interaction mapping states
  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Load and cleanly split editing strings or array blocks into state
  useEffect(() => {
    if (!initialData) return;
    
    if (Array.isArray(initialData.authors)) {
      setAuthorsList(initialData.authors);
    } else if (typeof initialData.authors === "string" && initialData.authors.trim() !== "") {
      setAuthorsList(initialData.authors.split(",").map((a) => a.trim()));
    } else {
      setAuthorsList([]);
    }
  }, [initialData]);

  // Track global dataset property deltas to safely configure form interaction buttons
  useEffect(() => {
    const isTitleChanged = title.trim() !== (initialData?.title ?? "");
    const isJournalChanged = journal.trim() !== (initialData?.journal ?? "");
    const isPublisherChanged = publisher.trim() !== (initialData?.publisher ?? "");
    const isDoiChanged = doi.trim() !== (initialData?.doi ?? "");
    const isCitationsChanged = citations !== (initialData?.citations ?? 0);
    const isAbstractChanged = abstract.trim() !== (initialData?.abstract ?? "");
    const isUrlChanged = publicationUrl.trim() !== (initialData?.publicationUrl ?? "");
    const isPdfChanged = pdfUrl.trim() !== (initialData?.pdfUrl ?? "");
    const isConferenceChanged = conference.trim() !== (initialData?.conference ?? "");
    const isCoverChanged = publicationCover.trim() !== (initialData?.publicationCover ?? "");
    const isFeaturedChanged = featured !== (initialData?.featured ?? false);

    const initialDateStr = initialData?.publicationDate
      ? new Date(initialData.publicationDate).toISOString().split("T")[0]
      : "";
    const isDateChanged = publicationDate !== initialDateStr;

    const initialAuthors = Array.isArray(initialData?.authors)
      ? initialData.authors
      : typeof initialData?.authors === "string" && initialData.authors.trim() !== ""
      ? initialData.authors.split(",").map((a) => a.trim())
      : [];
    const areAuthorsChanged = JSON.stringify(authorsList) !== JSON.stringify(initialAuthors);

    setHasChanges(
      isTitleChanged || isJournalChanged || isPublisherChanged || isDoiChanged ||
      isCitationsChanged || isAbstractChanged || isUrlChanged || isPdfChanged ||
      isConferenceChanged || isCoverChanged || isDateChanged || isFeaturedChanged || areAuthorsChanged
    );
  }, [title, journal, publisher, doi, citations, abstract, publicationUrl, pdfUrl, conference, publicationCover, publicationDate, featured, authorsList, initialData]);

  // Reactive Custom Form Constraint Evaluation Flags
  const isTitleInvalid = title.trim() === "";
  const isCitationsInvalid = citations < 0;
  const isPublicationUrlInvalid = publicationUrl.trim() !== "" && !publicationUrl.trim().startsWith("http://") && !publicationUrl.trim().startsWith("https://");
  
  const isFormInvalid = isTitleInvalid || isCitationsInvalid || isPublicationUrlInvalid;

  // Push an author into the list array
  function handleAddAuthor() {
    const trimmed = currentAuthorInput.trim();
    if (trimmed && !authorsList.includes(trimmed)) {
      setAuthorsList((prev) => [...prev, trimmed]);
    }
    setCurrentAuthorInput("");
  }

  // Drop a specific author out of the list array
  function handleRemoveAuthor(authorToRemove: string) {
    setAuthorsList((prev) => prev.filter((a) => a !== authorToRemove));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),

        journal: journal.trim() || undefined,
        publisher: publisher.trim() || undefined,
        doi: doi.trim() || undefined,
        citations: Number(citations) || 0,
        abstract: abstract.trim() || undefined,
        publicationUrl: publicationUrl.trim() || undefined,
        pdfUrl: pdfUrl.trim() || undefined,
        conference: conference.trim() || undefined,
        publicationCover: publicationCover.trim() || undefined,

        publicationDate: publicationDate
          ? new Date(publicationDate)
          : undefined,

        authors: authorsList.map((a) => a.trim()).filter(Boolean),

        featured,
      };

      if (initialData?.id) {
        await updatePublication(initialData.id, payload);
      } else {
        await createPublication({
          portfolioId,
          ...payload,
        });

        setTitle("");
        setJournal("");
        setPublisher("");
        setDoi("");
        setCitations(0);
        setAbstract("");
        setPublicationUrl("");
        setPdfUrl("");
        setConference("");
        setPublicationCover("");
        setAuthorsList([]);
        setPublicationDate("");
        setFeatured(false);
        setIsTouched(false);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit publication entry node updates:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCoverUpload(file: File) {
    const res = await upload(
      file,
      CLOUDINARY_FOLDERS.publications,
      "image"
    );
    return res.url;
  }

  async function handlePdfUpload(file: File) {
    const res = await upload(
      file,
      CLOUDINARY_FOLDERS.publications,
      "document"
    );
    return res.url;
  }

  const inputStyle =
    "w-full rounded-lg border border-white/5 bg-[#0A0A0B] p-2.5 sm:p-3 text-zinc-200 placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] focus:shadow-[0_0_20px_rgba(59,130,246,0.04)] transition-all duration-200 disabled:opacity-40 shadow-inner font-sans";

  const labelStyle = 
    "mb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 group-hover/input:text-zinc-300 transition-colors";

  const descriptionStyle = 
    "text-[10px] sm:text-xs text-zinc-500 font-sans leading-normal block mt-1";

  const scrapeRecommendationStyle = 
    "text-[9px] sm:text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 mt-1 leading-normal flex items-start gap-1.5";

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
            <BookOpen size={18} className="text-blue-400 shrink-0" />
            <span>{initialData?.id ? "Edit Publication Entry" : "Add Publication Entry"}</span>
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
          <strong className="text-zinc-200">Academic & Research Publication Track:</strong> Register your research papers, journal articles, or conference proceedings. Documenting DOIs, citations, and abstracts builds a high-fidelity academic history matrix.
        </div>

        {/* INPUT FIELDS AREA */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Publication Title <span className="text-red-400 font-sans font-bold">*(Required)</span></span>
              <div className="flex items-center gap-1">
                {isTouched && isTitleInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> missing_title</span>
                ) : title.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5"><CheckCircle2 size={9} /> name_ready</span>
                ) : null}
                {hasChanges && (
                  <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">edited</span>
                )}
                <Terminal size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. Attention Is All You Need"
              className={`${inputStyle} ${isTouched && isTitleInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
              disabled={loading}
            />
            {isTouched && isTitleInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Field missing: Absolute name string parameter mapping required.</p>
            )}
            <span className={descriptionStyle}>Provide the absolute official name string of your published work or paper.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Journal Name <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="e.g. Nature Biomedical Engineering"
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Publisher <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. Springer, IEEE, ACM"
                className={inputStyle}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Digital Object Identifier (DOI) <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g. 10.1002/advs.2023..."
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Verified Citations Count <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
                {isTouched && isCitationsInvalid && (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> negative_bound</span>
                )}
                <Award size={10} className="text-zinc-700 hidden sm:block" />
              </label>
              <input
                type="number"
                value={citations}
                onChange={(e) => setCitations(Number(e.target.value))}
                onBlur={() => setIsTouched(true)}
                placeholder="0"
                className={`${inputStyle} ${isTouched && isCitationsInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
                disabled={loading}
              />
              {isTouched && isCitationsInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Arithmetic failure: Citations count metric cannot resolve to negative sums.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Paper Abstract Text <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Provide a short breakdown or summary context tracking your core scientific thesis or findings..."
              className={`${inputStyle} resize-none`}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>External Publication URL Address <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              {isTouched && isPublicationUrlInvalid && (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5"><AlertCircle size={9} /> syntax_invalid</span>
              )}
              <Globe size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              value={publicationUrl}
              onChange={(e) => setPublicationUrl(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="https://journal-website.com/paper-link"
              className={`${inputStyle} ${isTouched && isPublicationUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
              disabled={loading}
            />
            {isTouched && isPublicationUrlInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">⚠️ Protocol Exception: Vector path must reference an absolute formatting header layout (http:// or https://).</p>
            )}
          </div>

          {/* DYNAMIC FILE BLOB HANDLING OVERRIDES */}
          <div className="flex flex-col gap-1 group/input border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <label className={labelStyle}>
              <span>Full Manuscript PDF Document <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <FileText size={11} className="text-zinc-600" />
            </label>

            <input
              type="file"
              accept=".pdf"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = await handlePdfUpload(file);
                setPdfUrl(url);

                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs font-mono underline block mt-1 break-all"
              >
                // link: view_uploaded_manuscript_pdf
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Conference Hosting Venue <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              </label>
              <input
                value={conference}
                onChange={(e) => setConference(e.target.value)}
                placeholder="e.g. NeurIPS 2026, CVPR"
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Cover Thumbnail Image <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
                <ImageIcon size={11} className="text-zinc-600" />
              </label>

              <input
                type="file"
                accept="image/*"
                disabled={loading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const url = await handleCoverUpload(file);
                  setPublicationCover(url);

                  e.target.value = "";
                }}
                className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
              />

              {publicationCover && (
                <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit">
                  <img
                    src={publicationCover}
                    alt="Publication Cover"
                    className="w-16 h-12 rounded object-cover opacity-80"
                  />
                </div>
              )}
            </div>
          </div>

          {/* GOOGLE IMAGE WEB REFERENCE SCRAPER INLINE INSTRUCTIONS */}
          <div className={scrapeRecommendationStyle}>
            <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Cover Graphic Advice:</strong> If your paper possesses an external cover vector or institutional publisher badge hosted online, find it on Google Images, right-click, select <strong>&quot;Copy Image Address / URL&quot;</strong>, and pass the string parameter direct here if local image files are absent.
            </span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>Chronological Publication Date <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
              <Calendar size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              disabled={loading}
              className="w-full text-xs sm:text-sm rounded border border-white/5 p-2.5 bg-[#0A0A0B] text-white focus:outline-none focus:border-blue-500/60 color-scheme-dark h-10 sm:h-auto"
            />
          </div>

          {/* DYNAMIC AUTHOR ADD BAR WITH PLUS ICON BUTTON */}
          <div className="flex flex-col gap-1 border-t border-white/5 pt-3 group/input">
            <label className={labelStyle}>
              <span>Co-Authors / Research Team <span className="text-zinc-600 font-sans font-normal lowercase italic">*(Optional)</span></span>
            </label>
            
            <div className="flex gap-2">
              <input
                value={currentAuthorInput}
                onChange={(e) => setCurrentAuthorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); 
                    handleAddAuthor();
                  }
                }}
                placeholder="Type co-author name (e.g. Alan Turing) and press Enter"
                className="flex-1 text-xs sm:text-sm rounded border border-white/5 p-2.5 bg-[#0A0A0B] text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddAuthor}
                disabled={loading}
                className="px-3 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold rounded text-xs transition duration-200 whitespace-nowrap flex items-center h-9 sm:h-auto border border-white/5"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* DYNAMIC AUTHOR CHIP PILLS CONTAINER */}
            {authorsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 bg-[#0A0A0B] border border-white/5 p-2 rounded-lg max-h-28 overflow-y-auto">
                {authorsList.map((author, index) => (
                  <div
                    key={index}
                    className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                  >
                    <span>{author}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAuthor(author)}
                      disabled={loading}
                      className="text-blue-400/60 hover:text-blue-300 font-bold focus:outline-none text-[9px]"
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
              disabled={loading}
              className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] cursor-pointer"
            />
            <span className="group-hover:text-white transition-colors">Feature this publication on my main profile dashboard</span>
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-[#121214] hover:bg-[#161619] text-zinc-400 hover:text-white py-2.5 px-4 rounded-lg text-xs sm:text-sm transition-colors focus:outline-none border border-white/5"
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
                <span>Syncing Node Layer...</span>
              </>
            ) : !hasChanges && initialData?.id !== undefined ? (
              "No Changes Detected"
            ) : initialData?.id ? (
              "Update Publication"
            ) : (
              "Create Publication"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}