"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Terminal,
  Calendar,
  Users,
  Layers,
  ImageIcon,
  Link as LinkIcon,
  Globe,
  CheckSquare,
  Plus,
  X,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createProject, updateProject } from "@/actions/project";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";
import { deleteCloudinaryUrl } from "@/actions/upload";

type ProjectFormProps = {
  initialData?: {
    id?: string;
    title?: string;
    shortDescription?: string;
    description?: string;
    problemStatement?: string;
    solution?: string;
    category?: string;
    status?: string;
    type?: string;
    role?: string;
    teamSize?: number;
    projectBanner?: string;
    startDate?: string;
    endDate?: string;
    techStack?: string[];
    githubUrl?: string;
    liveUrl?: string;
    demoUrl?: string;
    videoUrl?: string;
    coverImage?: string;
    thumbnail?: string;
    images?: string[];
    featured?: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
  const { upload } = useUpload();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [problemStatement, setProblemStatement] = useState(initialData?.problemStatement || "");
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [teamSize, setTeamSize] = useState(initialData?.teamSize || 1);

  const [status, setStatus] = useState(initialData?.status || "COMPLETED");
  const [type, setType] = useState(initialData?.type || "PERSONAL");

  const [projectBanner, setProjectBanner] = useState(initialData?.projectBanner || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");

  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const [startDate, setStartDate] = useState(formatDate(initialData?.startDate));
  const [endDate, setEndDate] = useState(formatDate(initialData?.endDate));

  const [skillsList, setSkillsList] = useState<string[]>(initialData?.techStack || []);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [featured, setFeatured] = useState(initialData?.featured || false);

  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isTitleChanged = title.trim() !== (initialData?.title || "");
    const isShortDescChanged = shortDescription.trim() !== (initialData?.shortDescription || "");
    const isDescChanged = description.trim() !== (initialData?.description || "");
    const isProblemChanged = problemStatement.trim() !== (initialData?.problemStatement || "");
    const isSolutionChanged = solution.trim() !== (initialData?.solution || "");
    const isCategoryChanged = category.trim() !== (initialData?.category || "");
    const isRoleChanged = role.trim() !== (initialData?.role || "");
    const isTeamChanged = teamSize !== (initialData?.teamSize || 1);
    const isStatusChanged = status !== (initialData?.status || "COMPLETED");
    const isTypeChanged = type !== (initialData?.type || "PERSONAL");
    const isBannerChanged = projectBanner.trim() !== (initialData?.projectBanner || "");
    const isCoverChanged = coverImage.trim() !== (initialData?.coverImage || "");
    const isThumbChanged = thumbnail.trim() !== (initialData?.thumbnail || "");
    const isGithubChanged = githubUrl.trim() !== (initialData?.githubUrl || "");
    const isLiveChanged = liveUrl.trim() !== (initialData?.liveUrl || "");
    const isDemoChanged = demoUrl.trim() !== (initialData?.demoUrl || "");
    const isVideoChanged = videoUrl.trim() !== (initialData?.videoUrl || "");
    const isStartChanged = startDate !== formatDate(initialData?.startDate);
    const isEndChanged = endDate !== formatDate(initialData?.endDate);
    const isFeaturedChanged = featured !== (initialData?.featured || false);

    const isSkillsChanged =
      JSON.stringify(skillsList) !== JSON.stringify(initialData?.techStack || []);
    const isImagesChanged = JSON.stringify(images) !== JSON.stringify(initialData?.images || []);

    setHasChanges(
      isTitleChanged ||
        isShortDescChanged ||
        isDescChanged ||
        isProblemChanged ||
        isSolutionChanged ||
        isCategoryChanged ||
        isRoleChanged ||
        isTeamChanged ||
        isStatusChanged ||
        isTypeChanged ||
        isBannerChanged ||
        isCoverChanged ||
        isThumbChanged ||
        isGithubChanged ||
        isLiveChanged ||
        isDemoChanged ||
        isVideoChanged ||
        isStartChanged ||
        isEndChanged ||
        isFeaturedChanged ||
        isSkillsChanged ||
        isImagesChanged
    );
  }, [
    title,
    shortDescription,
    description,
    problemStatement,
    solution,
    category,
    role,
    teamSize,
    status,
    type,
    projectBanner,
    coverImage,
    thumbnail,
    githubUrl,
    liveUrl,
    demoUrl,
    videoUrl,
    startDate,
    endDate,
    skillsList,
    images,
    featured,
    initialData,
  ]);

  const isTitleInvalid = title.trim() === "";
  const isStatusInvalid = !status;
  const isTypeInvalid = !type;
  const isEndDateInvalid = !!(startDate && endDate && new Date(endDate) < new Date(startDate));

  const isGithubUrlInvalid =
    githubUrl.trim() !== "" &&
    !githubUrl.trim().startsWith("http://") &&
    !githubUrl.trim().startsWith("https://");
  const isLiveUrlInvalid =
    liveUrl.trim() !== "" &&
    !liveUrl.trim().startsWith("http://") &&
    !liveUrl.trim().startsWith("https://");
  const isDemoUrlInvalid =
    demoUrl.trim() !== "" &&
    !demoUrl.trim().startsWith("http://") &&
    !demoUrl.trim().startsWith("https://");
  const isVideoUrlInvalid =
    videoUrl.trim() !== "" &&
    !videoUrl.trim().startsWith("http://") &&
    !videoUrl.trim().startsWith("https://");

  const isFormInvalid =
    isTitleInvalid ||
    isStatusInvalid ||
    isTypeInvalid ||
    isEndDateInvalid ||
    isGithubUrlInvalid ||
    isLiveUrlInvalid ||
    isDemoUrlInvalid ||
    isVideoUrlInvalid;

  const handleAddSkill = () => {
    const cleanedSkill = newSkillInput.trim();
    if (!cleanedSkill) return;

    if (!skillsList.includes(cleanedSkill)) {
      setSkillsList((prev) => [...prev, cleanedSkill]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  async function handleMediaUpload(file: File) {
    const folder = CLOUDINARY_FOLDERS.projects || "projects";
    const res = await upload(file, folder, "image");
    return res.url;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsTouched(true);

    if (isFormInvalid) return;
    if (!hasChanges && initialData?.id) return;

    try {
      const portfolioId = await getPortfolioId();
      setLoading(true);

      const payload = {
        portfolioId,
        title: title.trim(),
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        problemStatement: problemStatement.trim() || undefined,
        solution: solution.trim() || undefined,
        category: category.trim() || undefined,
        role: role.trim() || undefined,
        teamSize: Number(teamSize) || 1,
        status: status as "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTAINED",
        type: type as "PERSONAL" | "ACADEMIC" | "PROFESSIONAL" | "RESEARCH" | "OPEN_SOURCE",
        projectBanner: projectBanner.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        thumbnail: thumbnail.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        techStack: skillsList,
        images,
        featured,
      };

      if (initialData?.id) {
        await updateProject(initialData.id, payload);
      } else {
        await createProject(payload);
      }

      if (!initialData?.id) {
        setTitle("");
        setShortDescription("");
        setDescription("");
        setProblemStatement("");
        setSolution("");
        setCategory("");
        setRole("");
        setTeamSize(1);
        setProjectBanner("");
        setCoverImage("");
        setThumbnail("");
        setGithubUrl("");
        setLiveUrl("");
        setDemoUrl("");
        setVideoUrl("");
        setStartDate("");
        setEndDate("");
        setSkillsList([]);
        setImages([]);
        setFeatured(false);
        setIsTouched(false);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to commit project updates:", error);
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
    <form
      onSubmit={handleSave}
      className="space-y-4 sm:space-y-6 text-zinc-300 bg-[#0C0C0E] p-4 sm:p-6 rounded-none sm:rounded-xl max-w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white font-sans select-none animate-fadeIn"
    >
      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span className="flex items-center gap-1">
            Project Title <span className="text-red-400 font-sans font-bold">*(Required)</span>
          </span>
          <div className="flex items-center gap-1.5">
            {isTouched && isTitleInvalid ? (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                <AlertCircle size={9} /> missing_title
              </span>
            ) : title.trim() ? (
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                <CheckCircle2 size={9} /> name_ready
              </span>
            ) : null}
            {hasChanges && (
              <span className="text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-normal">
                edited
              </span>
            )}
            <Terminal size={10} className="text-zinc-700 hidden sm:block" />
          </div>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder="e.g., Airbnb Marketplace Clone"
          className={`${inputStyle} ${isTouched && isTitleInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
          disabled={loading}
        />
        {isTouched && isTitleInvalid && (
          <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
            ⚠️ Workspace Error: Unique project title designation cannot look like an empty payload.
          </p>
        )}
        <span className={descriptionStyle}>
          The structural system identity namespace tracker of this code build.
        </span>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span>
            Short Summary Description{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </span>
        </label>
        <input
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="A quick high-level programmatic one-liner timeline summary..."
          className={inputStyle}
          disabled={loading}
        />
        <span className={descriptionStyle}>
          Highly recommended. Summary node featured inside lightweight item rows or browsing view
          grids. Shows as subtext summary under project catalog view layers.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Category Classification{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Full-Stack, Robotics, Frontend"
            className={inputStyle}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Individual Role Allocation{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Full-Stack Architect"
            className={inputStyle}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Team Scale Size{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            <Users size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className={inputStyle}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Runtime Project Status{" "}
              <span className="text-red-400 font-sans font-bold">*(Required)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isTouched && isStatusInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                  missing_status
                </span>
              ) : status ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase">
                  configured
                </span>
              ) : null}
            </div>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onBlur={() => setIsTouched(true)}
            className={`${inputStyle} text-zinc-400 color-scheme-dark ${isTouched && isStatusInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          >
            <option value="PLANNING" className="bg-[#0C0C0E]">
              PLANNING
            </option>
            <option value="IN_PROGRESS" className="bg-[#0C0C0E]">
              IN_PROGRESS
            </option>
            <option value="COMPLETED" className="bg-[#0C0C0E]">
              COMPLETED
            </option>
            <option value="MAINTAINED" className="bg-[#0C0C0E]">
              MAINTAINED
            </option>
          </select>
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Development Architecture Class{" "}
              <span className="text-red-400 font-sans font-bold">*(Required)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isTouched && isTypeInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                  missing_type
                </span>
              ) : type ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase">
                  classified
                </span>
              ) : null}
            </div>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            onBlur={() => setIsTouched(true)}
            className={`${inputStyle} text-zinc-400 color-scheme-dark ${isTouched && isTypeInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          >
            <option value="PERSONAL" className="bg-[#0C0C0E]">
              PERSONAL
            </option>
            <option value="ACADEMIC" className="bg-[#0C0C0E]">
              ACADEMIC
            </option>
            <option value="PROFESSIONAL" className="bg-[#0C0C0E]">
              PROFESSIONAL
            </option>
            <option value="RESEARCH" className="bg-[#0C0C0E]">
              RESEARCH
            </option>
            <option value="OPEN_SOURCE" className="bg-[#0C0C0E]">
              OPEN_SOURCE
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-1 group/input">
        <label className={labelStyle}>
          <span>
            Deep Dive System Description{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Break down your features, technical goals, architecture decisions, database patterns, API structures, etc..."
          className={`${inputStyle} resize-none`}
          disabled={loading}
        />
        <span className={descriptionStyle}>
          The principal architectural review read block node context. Displays full description
          overview data blocks on detail view overlays.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Target Problem Statement{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <textarea
            rows={3}
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="What specific problem environment parameters triggered this full engineering loop?"
            className={`${inputStyle} resize-none`}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Engineered Technical Solution{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <textarea
            rows={3}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="How did your structural code execution strategy and packages bypass this bottleneck?"
            className={`${inputStyle} resize-none`}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Timeline Development Start{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            <Calendar size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`${inputStyle} text-zinc-400 color-scheme-dark h-10 sm:h-auto`}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Timeline Development Terminus{" "}
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
            onChange={(e) => setEndDate(e.target.value)}
            onBlur={() => setIsTouched(true)}
            className={`${inputStyle} text-zinc-400 color-scheme-dark h-10 sm:h-auto ${isTouched && isEndDateInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          />
          {isTouched && isEndDateInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Chronological failure: Terminus date cannot scale before initialization milestone.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              GitHub Repository URL Link{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            {isTouched && isGithubUrlInvalid && (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                syntax_invalid
              </span>
            )}
          </label>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="https://github.com/username/repository"
            className={`${inputStyle} ${isTouched && isGithubUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          />
          {isTouched && isGithubUrlInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Protocol Exception: Link node path must utilize an absolute header configuration
              (http:// or https://).
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Live System Deployment URL{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            {isTouched && isLiveUrlInvalid && (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                syntax_invalid
              </span>
            )}
            <Globe size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <input
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="https://production-build.domain.com"
            className={`${inputStyle} ${isTouched && isLiveUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          />
          {isTouched && isLiveUrlInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Protocol Exception: Link node path must utilize an absolute header configuration
              (http:// or https://).
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Interactive Hub Demo URL{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            {isTouched && isDemoUrlInvalid && (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                syntax_invalid
              </span>
            )}
          </label>
          <input
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="Playground sandbox node environment path..."
            className={`${inputStyle} ${isTouched && isDemoUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          />
          {isTouched && isDemoUrlInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Protocol Exception: Link node path must utilize an absolute header configuration
              (http:// or https://).
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Video Presentation Walkthrough URL{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
            {isTouched && isVideoUrlInvalid && (
              <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase">
                syntax_invalid
              </span>
            )}
            <LinkIcon size={10} className="text-zinc-700 hidden sm:block" />
          </label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="e.g. YouTube loom engineering asset streams..."
            className={`${inputStyle} ${isTouched && isVideoUrlInvalid ? "border-red-500/30 bg-red-500/[0.01]" : ""}`}
            disabled={loading}
          />
          {isTouched && isVideoUrlInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Protocol Exception: Link node path must utilize an absolute header configuration
              (http:// or https://).
            </p>
          )}
        </div>
      </div>

      <div className={scrapeRecommendationStyle}>
        <Globe size={11} className="shrink-0 mt-0.5 text-amber-400" />
        <span>
          <strong>Media Asset Scrape Protocol Notice:</strong> If you are looking to pull
          third-party vectors, tech badges, or platform splash covers from corporate network spaces
          instead of local device storage, search for the target entity logo on Google Images,
          right-click, choose <strong>&quot;Copy Image Address / URL&quot;</strong>, and pass the
          clean text parameter right into backend scripts.
        </span>
      </div>

      <div className="space-y-4 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <h3 className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
          System Core Graphics Layer
        </h3>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Workspace Landscape Project Banner{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>

          <div className={scrapeRecommendationStyle}>
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Project Banner Scope:</strong> Displays as a full-bleed background splash
              layer inside your deep details overview drawer nodes. To scrape target covers directly
              without manual uploads, fetch remote address strings from public web search index
              mappings.
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const oldUrl = projectBanner;
                const url = await handleMediaUpload(file);
                setProjectBanner(url);
                if (oldUrl && oldUrl !== url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
              } catch (err) {
                console.error(err);
              }
              e.target.value = "";
            }}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />
          {projectBanner && (
            <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
              <img
                src={projectBanner}
                alt="Banner Preview"
                className="h-12 w-20 object-cover rounded opacity-80"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Presentation Cover Image Asset{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>

          <div className={scrapeRecommendationStyle}>
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Cover Image Scope:</strong> Renders directly as the primary aesthetic card
              graphic interface across display blocks. Leaving this completely unpopulated defaults
              to missing placeholder boxes on your public catalog nodes.
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const oldUrl = coverImage;
                const url = await handleMediaUpload(file);
                setCoverImage(url);
                if (oldUrl && oldUrl !== url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
              } catch (err) {
                console.error(err);
              }
              e.target.value = "";
            }}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />
          {coverImage && (
            <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="h-12 w-20 object-cover rounded opacity-80"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Light Navigation Thumbnail{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>

          <div className={scrapeRecommendationStyle}>
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Thumbnail Scope:</strong> Feeds smaller system icon placeholders displayed
              across compact row listings or timeline tables. Grab explicit company insignias via
              public search tools if device storage assets are missing.
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const oldUrl = thumbnail;
                const url = await handleMediaUpload(file);
                setThumbnail(url);
                if (oldUrl && oldUrl !== url) {
                  await deleteCloudinaryUrl(oldUrl, "image");
                }
              } catch (err) {
                console.error(err);
              }
              e.target.value = "";
            }}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />
          {thumbnail && (
            <div className="mt-1.5 p-1 bg-zinc-950 border border-white/5 rounded w-fit animate-fadeIn">
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
                className="h-12 w-20 object-cover rounded opacity-80"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <label className={labelStyle}>
          <span>
            Engineered Tech Stack Modules{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </span>
        </label>

        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 bg-[#0A0A0B] border border-white/5 rounded-lg max-h-24 overflow-y-auto">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-400/60 hover:text-blue-300 font-bold focus:outline-none"
                  disabled={loading}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Type technology token (e.g., Material UI, Glassmorphism, OpenWeatherMap API)"
            className={inputStyle}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={loading}
            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-mono font-bold px-4 text-xs transition shrink-0 border border-white/5 h-10 sm:h-auto flex items-center justify-center"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border border-white/5 p-3 sm:p-4 rounded-xl bg-[#070708]">
        <label className={labelStyle}>
          <span>
            Runtime Component Screenshot Gallery{" "}
            <span className="text-zinc-600 font-sans font-normal lowercase italic">
              *(Optional)
            </span>
          </span>
        </label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#0A0A0B] border border-white/5 rounded-lg max-h-24 overflow-y-auto">
            {images.map((url, idx) => (
              <div key={idx} className="relative group shrink-0 animate-fadeIn">
                <img
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  className="w-12 h-12 object-cover rounded-md border border-white/5 opacity-80"
                />
                <button
                  type="button"
                  onClick={async () => {
                    setImages((prev) => prev.filter((_, i) => i !== idx));
                    await deleteCloudinaryUrl(url, "image");
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500/80 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold shadow hover:bg-red-600 transition"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await handleMediaUpload(file);
                setImages((prev) => [...prev, url]);
              } catch (err) {
                console.error("Gallery frame file push failure context.");
              } finally {
                e.target.value = "";
              }
            }}
            disabled={loading}
            className="w-full text-[11px] font-mono text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B]"
          />
        </div>
      </div>

      <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 rounded-lg border border-white/5 bg-[#0A0A0B]/60 p-3 sm:p-4 transition-colors hover:bg-[#0A0A0B] cursor-pointer group/check">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] cursor-pointer mt-0.5 sm:mt-0"
        />
        <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover/check:text-zinc-200 transition-colors flex items-center gap-1.5">
          <CheckSquare size={11} className="text-zinc-600 hidden sm:block" />
          <span>Promote as Highlighted/Featured Project</span>
        </div>
      </label>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:flex-1 bg-[#121214] hover:bg-[#161619] border border-white/5 text-zinc-400 hover:text-white py-3 px-4 rounded-lg text-center focus:outline-none transition-all duration-200 order-2 sm:order-1"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || isFormInvalid || (!hasChanges && initialData?.id !== undefined)}
          className="w-full sm:flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_12px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] text-center flex items-center justify-center h-11 focus:outline-none order-1 sm:order-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Processing Data Asset Framework...</span>
            </span>
          ) : !hasChanges && initialData?.id !== undefined ? (
            "No Changes Detected"
          ) : initialData?.id ? (
            "Update Project Details"
          ) : (
            "Publish Project Portfolio"
          )}
        </button>
      </div>
    </form>
  );
}
