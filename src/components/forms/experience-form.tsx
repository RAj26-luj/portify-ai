"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Terminal,
  Calendar,
  Briefcase,
  MapPin,
  Globe,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createExperience, updateExperience } from "@/actions/experience";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";
import { deleteCloudinaryUrl } from "@/actions/upload";

interface ExperienceFormProps {
  initialData?: any;
  portfolioId: string;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "FREELANCE" | "CONTRACT" | "";

export default function ExperienceForm({
  initialData,
  portfolioId,
  onClose,
  onSuccess,
}: ExperienceFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("");

  const [location, setLocation] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");

  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);

  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const { upload } = useUpload();

  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setCompany(initialData.company ?? "");
    setPosition(initialData.position ?? "");
    setEmploymentType(initialData.employmentType ?? "");

    setLocation(initialData.location ?? "");
    setCompanyWebsite(initialData.companyWebsite ?? "");
    setCompanyLogo(initialData.companyLogo ?? "");
    setCompanyBanner(initialData.companyBanner ?? "");

    setResponsibilities(initialData.responsibilities ?? []);
    setTechnologies(initialData.technologies ?? []);

    setStartDate(
      initialData.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : ""
    );

    setEndDate(
      initialData.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : ""
    );

    setCurrentlyWorking(initialData.currentlyWorking ?? false);
    setDescription(initialData.description ?? "");
  }, [initialData]);

  useEffect(() => {
    const isCompanyChanged = company.trim() !== (initialData?.company ?? "");
    const isPositionChanged = position.trim() !== (initialData?.position ?? "");
    const isTypeChanged = employmentType !== (initialData?.employmentType ?? "");
    const isLocationChanged = location.trim() !== (initialData?.location ?? "");
    const isWebsiteChanged = companyWebsite.trim() !== (initialData?.companyWebsite ?? "");
    const isLogoChanged = companyLogo.trim() !== (initialData?.companyLogo ?? "");
    const isBannerChanged = companyBanner.trim() !== (initialData?.companyBanner ?? "");
    const isDescChanged = description.trim() !== (initialData?.description ?? "");
    const isCurrentChanged = currentlyWorking !== (initialData?.currentlyWorking ?? false);

    const initialStartStr = initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "";
    const isStartChanged = startDate !== initialStartStr;

    const initialEndStr = initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "";
    const isEndChanged = endDate !== initialEndStr;

    const areResponsibilitiesChanged =
      JSON.stringify(responsibilities) !== JSON.stringify(initialData?.responsibilities ?? []);
    const areTechsChanged =
      JSON.stringify(technologies) !== JSON.stringify(initialData?.technologies ?? []);

    setHasChanges(
      isCompanyChanged ||
        isPositionChanged ||
        isTypeChanged ||
        isLocationChanged ||
        isWebsiteChanged ||
        isLogoChanged ||
        isBannerChanged ||
        isDescChanged ||
        isStartChanged ||
        isEndChanged ||
        isCurrentChanged ||
        areResponsibilitiesChanged ||
        areTechsChanged
    );
  }, [
    company,
    position,
    employmentType,
    location,
    companyWebsite,
    companyLogo,
    companyBanner,
    responsibilities,
    technologies,
    startDate,
    endDate,
    currentlyWorking,
    description,
    initialData,
  ]);

  const isCompanyInvalid = company.trim() === "";
  const isPositionInvalid = position.trim() === "";
  const isEmploymentTypeInvalid = employmentType === "";
  const isStartDateInvalid = !startDate;
  const isEndDateInvalid = !!(
    !currentlyWorking &&
    startDate &&
    endDate &&
    new Date(endDate) < new Date(startDate)
  );

  const isFormInvalid =
    isCompanyInvalid ||
    isPositionInvalid ||
    isEmploymentTypeInvalid ||
    isStartDateInvalid ||
    isEndDateInvalid;

  function addItem(value: string, setValue: any, list: string[], setList: any) {
    if (!value.trim()) return;
    if (list.includes(value.trim())) return;
    setList([...list, value.trim()]);
    setValue("");
  }

  function removeItem(index: number, list: string[], setList: any) {
    setList(list.filter((_, i) => i !== index));
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
        company: company.trim(),
        position: position.trim(),
        employmentType: employmentType || undefined,
        location: location.trim(),

        companyWebsite: companyWebsite.trim(),
        companyLogo: companyLogo.trim(),
        companyBanner: companyBanner.trim(),

        responsibilities,
        technologies,

        startDate,
        endDate: !currentlyWorking ? endDate : undefined,
        currentlyWorking,
        description: description.trim(),
      };

      if (initialData?.id) {
        await updateExperience(initialData.id, payload);
      } else {
        await createExperience(payload);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to commit experience node mapping changes:", err);
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
              <Briefcase size={18} className="text-blue-400 shrink-0" />
              <span>{initialData ? "Edit Experience" : "Add Experience"}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 font-medium leading-tight font-mono uppercase tracking-wider">
              Configure professional career workspace parameters
              {hasChanges && (
                <span className="ml-2 text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-normal">
                  edited_deltas
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
          <strong className="text-zinc-200">Employment Record Track Node:</strong> Mount an active
          industrial career block element below. Explicitly populating responsibility metrics and
          technology stack labels enhances portfolio matrix discoverability graphs.
        </div>

        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Basic Information Sector
          </h3>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Company Entity <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1">
                {isTouched && isCompanyInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                    <AlertCircle size={9} /> missing_entity
                  </span>
                ) : company.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> tracked
                  </span>
                ) : null}
                <Terminal size={10} className="text-zinc-700 hidden sm:block" />
              </div>
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. Google, Stripe"
              disabled={loading}
              className={`${inputStyle} ${isTouched && isCompanyInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            />
            {isTouched && isCompanyInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Field missing: Corporate body namespace parameter must be populated.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Position Title <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1">
                {isTouched && isPositionInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                    <AlertCircle size={9} /> missing_title
                  </span>
                ) : position.trim() ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> confirmed
                  </span>
                ) : null}
              </div>
            </label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder="e.g. Senior Frontend Engineer"
              disabled={loading}
              className={`${inputStyle} ${isTouched && isPositionInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            />
            {isTouched && isPositionInvalid && (
              <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                ⚠️ Field missing: Specific position title parameter must be established.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Employment Type{" "}
                <span className="text-red-400 font-sans font-bold">*(Required)</span>
              </span>
              <div className="flex items-center gap-1">
                {isTouched && isEmploymentTypeInvalid ? (
                  <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                    <AlertCircle size={9} /> missing_type
                  </span>
                ) : employmentType ? (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> mapped
                  </span>
                ) : null}
              </div>
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              onBlur={() => setIsTouched(true)}
              disabled={loading}
              className={`${inputStyle} text-zinc-400 color-scheme-dark ${isTouched && isEmploymentTypeInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            >
              <option value="" className="bg-[#0C0C0E]">
                Select Employment Vector
              </option>
              <option value="FULL_TIME" className="bg-[#0C0C0E]">
                Full Time
              </option>
              <option value="PART_TIME" className="bg-[#0C0C0E]">
                Part Time
              </option>
              <option value="INTERNSHIP" className="bg-[#0C0C0E]">
                Internship
              </option>
              <option value="FREELANCE" className="bg-[#0C0C0E]">
                Freelance
              </option>
              <option value="CONTRACT" className="bg-[#0C0C0E]">
                Contract
              </option>
            </select>
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Corporate Environmental Context
          </h3>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Geographic / Remote Location{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
              <MapPin size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA (Remote)"
              disabled={loading}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Company Website URL{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
              <Globe size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <input
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://stripe.com"
              disabled={loading}
              className={inputStyle}
            />
          </div>

          <div className={scrapeRecommendationStyle}>
            <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Brand Image Scraping Advice:</strong> For corporate logo indicators or branch
              cover art layers, we recommend performing a Google Image search for the emblem,
              right-clicking to click <strong>&quot;Copy Image Address / URL&quot;</strong>, and
              passing the raw string target here if local media streams are missing.
            </span>
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Company Logo Insignia{" "}
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
                const oldUrl = companyLogo;
                const res = await upload(file, CLOUDINARY_FOLDERS.profile, "image");
                setCompanyLogo(res.url);
                if (oldUrl && oldUrl !== res.url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {companyLogo && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
                <img src={companyLogo} className="w-12 h-12 rounded object-cover opacity-80" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Office / Team Background Cover Banner{" "}
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
                const oldUrl = companyBanner;
                const res = await upload(file, CLOUDINARY_FOLDERS.cover, "image");
                setCompanyBanner(res.url);
                if (oldUrl && oldUrl !== res.url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:tracking-wider file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
            />
            {companyBanner && (
              <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-full animate-fadeIn">
                <img
                  src={companyBanner}
                  className="w-full h-16 sm:h-20 object-cover rounded opacity-80"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Chronological Timeline Range
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>
                  Start Date <span className="text-red-400 font-sans font-bold">*(Required)</span>
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
                  Terminus Date{" "}
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
                disabled={currentlyWorking || loading}
                onBlur={() => setIsTouched(true)}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full text-xs sm:text-sm rounded border p-2.5 bg-[#0A0A0B] text-white focus:outline-none focus:border-blue-500/60 disabled:bg-[#121214] disabled:text-zinc-600 color-scheme-dark h-10 sm:h-auto ${isTouched && isEndDateInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
              />
              {isTouched && isEndDateInvalid && (
                <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
                  ⚠️ Chronological failure: Terminus date cannot scale before entry milestone.
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 select-none cursor-pointer group pt-0.5">
            <input
              type="checkbox"
              checked={currentlyWorking}
              disabled={loading}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
              className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] cursor-pointer"
            />
            <span className="group-hover:text-white transition-colors">
              Currently Employed Within This Domain
            </span>
          </label>
        </div>

        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Execution Milestones & Duties{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </h3>

          <div className="flex gap-2">
            <input
              value={responsibilityInput}
              onChange={(e) => setResponsibilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem(
                    responsibilityInput,
                    setResponsibilityInput,
                    responsibilities,
                    setResponsibilities
                  );
                }
              }}
              placeholder="e.g. Architected streaming data pipes driving 40% reduction in latency"
              disabled={loading}
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() =>
                addItem(
                  responsibilityInput,
                  setResponsibilityInput,
                  responsibilities,
                  setResponsibilities
                )
              }
              disabled={loading}
              className="px-3 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-white font-bold transition flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {responsibilities.map((r, i) => (
              <div
                key={i}
                className="flex items-start justify-between border border-white/5 bg-[#0A0A0B] p-2 rounded-lg text-xs font-sans text-zinc-300 gap-2 animate-fadeIn"
              >
                <span className="leading-normal break-all">{r}</span>
                <button
                  type="button"
                  onClick={() => removeItem(i, responsibilities, setResponsibilities)}
                  className="text-zinc-500 hover:text-red-400 p-0.5 shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Engineered Architecture Tech Stack{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </h3>

          <div className="flex gap-2">
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem(techInput, setTechInput, technologies, setTechnologies);
                }
              }}
              placeholder="e.g. Next.js, Go, Rust"
              disabled={loading}
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() => addItem(techInput, setTechInput, technologies, setTechnologies)}
              disabled={loading}
              className="px-3 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-white font-bold transition flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-[#0A0A0B] border border-white/5 p-2 rounded-lg">
            {technologies.map((t, i) => (
              <span
                key={i}
                className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => removeItem(i, technologies, setTechnologies)}
                  className="text-blue-400/60 hover:text-blue-300 focus:outline-none"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Core Experience Description Summary{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a macro programmatic overview mapping context objectives..."
            disabled={loading}
            className={`${inputStyle} resize-none`}
            rows={3}
          />
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
                <span>Syncing Career Matrix...</span>
              </>
            ) : !hasChanges && initialData?.id !== undefined ? (
              "No Changes Detected"
            ) : initialData ? (
              "Update Experience"
            ) : (
              "Save Experience"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
