"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Terminal,
  Calendar,
  Award,
  GraduationCap,
  MapPin,
  Globe,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";
import { deleteCloudinaryUrl } from "@/actions/upload";
import { createEducation, updateEducation } from "@/actions/education";

interface Props {
  initialData?: any;
  portfolioId: string;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function EducationForm({ initialData, portfolioId, onClose, onSuccess }: Props) {
  const { upload } = useUpload();

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [grade, setGrade] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [location, setLocation] = useState("");

  const [institutionImage, setInstitutionImage] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setInstitution(initialData.institution || "");
    setDegree(initialData.degree || "");
    setFieldOfStudy(initialData.fieldOfStudy || "");
    setGrade(initialData.grade || "");
    setCgpa(initialData.cgpa || "");
    setLocation(initialData.location || "");

    setInstitutionImage(initialData.institutionImage || "");
    setLogoUrl(initialData.logoUrl || "");

    setDescription(initialData.description || "");

    setStartDate(
      initialData.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : ""
    );

    setEndDate(
      initialData.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : ""
    );

    setCurrentlyStudying(initialData.currentlyStudying || false);
  }, [initialData]);

  useEffect(() => {
    const isInstitutionChanged = institution.trim() !== (initialData?.institution || "");
    const isDegreeChanged = degree.trim() !== (initialData?.degree || "");
    const isFieldChanged = fieldOfStudy.trim() !== (initialData?.fieldOfStudy || "");
    const isGradeChanged = grade.trim() !== (initialData?.grade || "");
    const isCgpaChanged = cgpa.trim() !== (initialData?.cgpa || "");
    const isLocationChanged = location.trim() !== (initialData?.location || "");
    const isImageChanged = institutionImage.trim() !== (initialData?.institutionImage || "");
    const isLogoChanged = logoUrl.trim() !== (initialData?.logoUrl || "");
    const isDescChanged = description.trim() !== (initialData?.description || "");
    const isCurrentChanged = currentlyStudying !== (initialData?.currentlyStudying || false);

    const initialStartStr = initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "";
    const isStartChanged = startDate !== initialStartStr;

    const initialEndStr = initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "";
    const isEndChanged = endDate !== initialEndStr;

    setHasChanges(
      isInstitutionChanged ||
        isDegreeChanged ||
        isFieldChanged ||
        isGradeChanged ||
        isCgpaChanged ||
        isLocationChanged ||
        isImageChanged ||
        isLogoChanged ||
        isDescChanged ||
        isStartChanged ||
        isEndChanged ||
        isCurrentChanged
    );
  }, [
    institution,
    degree,
    fieldOfStudy,
    grade,
    cgpa,
    location,
    institutionImage,
    logoUrl,
    description,
    startDate,
    endDate,
    currentlyStudying,
    initialData,
  ]);

  const isInstitutionInvalid = institution.trim() === "";
  const isDegreeInvalid = degree.trim() === "";
  const isFieldInvalid = fieldOfStudy.trim() === "";
  const isStartDateInvalid = !startDate;
  const isEndDateInvalid = !!(
    !currentlyStudying &&
    startDate &&
    endDate &&
    new Date(endDate) < new Date(startDate)
  );

  const isFormInvalid =
    isInstitutionInvalid ||
    isDegreeInvalid ||
    isFieldInvalid ||
    isStartDateInvalid ||
    isEndDateInvalid;

  async function handleUpload(file: File) {
    const res = await upload(file, CLOUDINARY_FOLDERS.profile, "image");
    return res.url;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id !== undefined) return;
    setLoading(true);

    try {
      const payload = {
        portfolioId,
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        grade: grade.trim() || undefined,
        cgpa: cgpa.trim() || undefined,
        location: location.trim() || undefined,
        institutionImage: institutionImage.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        description: description.trim() || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: !currentlyStudying && endDate ? new Date(endDate) : undefined,
        currentlyStudying,
      };

      if (initialData?.id && initialData.id.trim() !== "") {
        await updateEducation(initialData.id, payload);
      } else {
        await createEducation(payload);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to commit education record node updates:", err);
    } finally {
      setLoading(false);
    }
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
      <form
        onSubmit={handleSave}
        className="w-full max-w-sm sm:max-w-xl space-y-4 sm:space-y-5 bg-[#0C0C0E] p-4 sm:p-6 text-zinc-300 rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/10 max-h-[92vh] overflow-y-auto font-sans selection:bg-blue-500/30 selection:text-white"
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5 sm:pb-3">
          <div>
            <h2 className="font-black text-base sm:text-xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 tracking-tight flex items-center gap-1.5">
              <GraduationCap size={18} className="text-blue-400 shrink-0" />
              <span>{initialData ? "Edit Education Entry" : "Add Education Entry"}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 font-medium leading-tight font-mono uppercase tracking-wider">
              Manage scholastic configuration frameworks
              {hasChanges && (
                <span className="ml-2 text-[8px] tracking-normal font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold">
                  unsaved_deltas
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-white transition-colors p-1 text-base sm:text-xl font-bold focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-lg p-3 text-[11px] text-zinc-400 leading-relaxed font-sans">
          <strong className="text-zinc-200">Education Track Telemetry Node:</strong> Log academic
          registry details below. Specifying institutional parameters and fields of study cleanly
          builds high-fidelity data matrices on your public profile sheet.
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Educational Institution{" "}
                <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1">
                {isTouched && isInstitutionInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                    <AlertCircle size={9} /> missing_registry
                  </span>
                ) : institution.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> structured
                  </span>
                ) : null}
                <Terminal size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. National Institute of Technology, Rourkela"
              disabled={loading}
              className={`${inputStyle} ${isTouched && isInstitutionInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            />
            {isTouched && isInstitutionInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Field missing: University configuration identity must be declared.
              </p>
            )}
            <span className={descriptionStyle}>
              The structural organization, university, or high school campus body name registry
              code.
            </span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Conferred Degree{" "}
                <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1">
                {isTouched && isDegreeInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                    <AlertCircle size={9} /> missing_tier
                  </span>
                ) : degree.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> validated
                  </span>
                ) : null}
              </div>
            </label>
            <input
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. Bachelor of Technology"
              disabled={loading}
              className={`${inputStyle} ${isTouched && isDegreeInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            />
            {isTouched && isDegreeInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Field missing: Degree operational mapping cannot remain unpopulated.
              </p>
            )}
            <span className={descriptionStyle}>
              The formal structural tier classification title conferred (e.g., B.Tech, M.S., High
              School).
            </span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Field of Study <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1">
                {isTouched && isFieldInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                    <AlertCircle size={9} /> missing_focus
                  </span>
                ) : fieldOfStudy.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> registered
                  </span>
                ) : null}
              </div>
            </label>
            <input
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. Electrical Engineering"
              disabled={loading}
              className={`${inputStyle} ${isTouched && isFieldInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            />
            {isTouched && isFieldInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Field missing: Specialization sector string vector required.
              </p>
            )}
            <span className={descriptionStyle}>
              Your primary specific corporate focus, industry branch, or departmental specialization
              vector.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>
                  Classification Grade{" "}
                  <span className="text-zinc-600 font-sans font-normal lowercase italic">
                    *(Optional)
                  </span>
                </span>
              </label>
              <input
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. First Class Distinction"
                disabled={loading}
                className={inputStyle}
              />
              <span className={descriptionStyle}>Honors separation tier layout.</span>
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>
                  CGPA / Percentage Score{" "}
                  <span className="text-zinc-600 font-sans font-normal lowercase italic">
                    *(Optional)
                  </span>
                </span>
                <Award size={10} className="text-zinc-700 hidden sm:block" />
              </label>
              <input
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 7.83 / 10.0"
                disabled={loading}
                className={inputStyle}
              />
              <span className={descriptionStyle}>Numerical performance metrics.</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Geographic Location{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
              <MapPin size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Odisha, India"
              disabled={loading}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 border-t border-white/5 pt-4">
          <div className={scrapeRecommendationStyle}>
            <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Campus Graphics Advice:</strong> If you prefer dynamic web asset links instead
              of direct disk uploads, we recommend searching for your university banner or campus
              emblem on Google Images, right-clicking to select{" "}
              <strong>&quot;Copy Image Address / URL&quot;</strong>, and feeding it to data
              structures.
            </span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Institution Background Cover Image{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const oldUrl = institutionImage;
                const url = await handleUpload(file);
                setInstitutionImage(url);
                if (oldUrl && oldUrl !== url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {institutionImage && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
                <img
                  src={institutionImage}
                  alt="Institution preview"
                  className="w-16 h-12 rounded object-cover opacity-80"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Institutional Insignia / Logo URL Asset{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const oldUrl = logoUrl;
                const url = await handleUpload(file);
                setLogoUrl(url);
                if (oldUrl && oldUrl !== url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {logoUrl && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-12 h-12 rounded object-contain opacity-80"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border-t border-white/5 pt-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Timeline Start Date{" "}
                <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1.5">
                {isTouched && isStartDateInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                    missing_start
                  </span>
                ) : startDate ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase">
                    initialized
                  </span>
                ) : null}
                <Calendar size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              type="date"
              value={startDate}
              disabled={loading}
              onBlur={() => setIsTouched(true)}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white focus:outline-none focus:border-blue-500/60 color-scheme-dark h-10 sm:h-auto ${isTouched && isStartDateInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Timeline Terminus Date{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
              {isTouched && isEndDateInvalid && (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                  invalid_bounds
                </span>
              )}
            </label>
            <input
              type="date"
              value={endDate}
              disabled={currentlyStudying || loading}
              onBlur={() => setIsTouched(true)}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white focus:outline-none focus:border-blue-500/60 disabled:bg-[#121214] disabled:text-zinc-600 disabled:border-white/5 color-scheme-dark h-10 sm:h-auto ${isTouched && isEndDateInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
            />
            {isTouched && isEndDateInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Chronological failure: Terminus date cannot scale before initialization.
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 select-none cursor-pointer group pt-0.5">
          <input
            type="checkbox"
            checked={currentlyStudying}
            disabled={loading}
            onChange={(e) => setCurrentlyStudying(e.target.checked)}
            className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] cursor-pointer"
          />
          <span className="group-hover:text-white transition-colors">
            Currently Studying Within This Program Matrix
          </span>
        </label>

        <div className="flex flex-col gap-1 border-t border-white/5 pt-4 group/input">
          <label className={labelStyle}>
            <span>
              Scholastic Activity Details Summary{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            <BookOpen size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your achievements, distinct core honors, relevant coursework projects, etc."
            disabled={loading}
            className={`${inputStyle} resize-none`}
          />
          <span className={descriptionStyle}>
            Highly recommended. Detail complex electrical frameworks, algorithmic achievements, or
            event organization roles (e.g., Nitrutsav coordinator logistics).
          </span>
        </div>

        <div className="pt-2 flex gap-2 border-t border-white/5">
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
            className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold py-2.5 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_12px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] text-xs sm:text-sm focus:outline-none uppercase tracking-wider text-center"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin shrink-0" />
                <span>Syncing Node Registry...</span>
              </>
            ) : !hasChanges && initialData?.id !== undefined ? (
              "No Changes Detected"
            ) : initialData ? (
              "Update Education Track"
            ) : (
              "Save Education Entry"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
