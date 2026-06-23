"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Loader2,
  Terminal,
  User,
  Rocket,
  Mail,
  Globe,
  ImageIcon,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getProfile, updateProfile } from "@/actions/user";
import { useUpload } from "@/hooks/use-upload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";
import { deleteCloudinaryUrl } from "@/actions/upload";

export default function ProfileForm({ initialData, onCancel, onSuccess }: any) {
  const [isPending, startTransition] = useTransition();
  const { upload } = useUpload();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    image: "",
    coverImage: "",
    website: "",
    country: "",
    state: "",
    city: "",
    title: "",
    tagline: "",
    bio: "",
    profileImage: "",
    coverPortfolioImage: "",
    resumeHeadline: "",
    currentRole: "",
    phonePortfolio: "",
    emailPortfolio: "",
    websitePortfolio: "",
    countryPortfolio: "",
    statePortfolio: "",
    cityPortfolio: "",
    timezone: "",
    allowContactForm: true,
    allowResumeDownload: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoImage: "",
    ogTitle: "",
    ogSubtitle: "",
    ogDescription: "",
    ogImage: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    currentFocus: "",
    availabilityStatus: "",
    aboutImage: "",
    contactAvailability: "",
    twitterImage: "",
    description: "",
    heroIntroduction: "",
  });

  const [showAvatarGuide, setShowAvatarGuide] = useState(false);
  const [showCoverGuide, setShowCoverGuide] = useState(false);
  const [showBioGuide, setShowBioGuide] = useState(false);

  const [isTouched, setIsTouched] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [baselineSnapshot, setBaselineSnapshot] = useState<string>("");

  async function loadProfile() {
    const result = await getProfile();
    if (!result.success) return;
    const data = result.data;
    if (!data) return;

    const fetchedForm = {
      name: data.name || "",
      email: data.email || "",
      username: data.username || "",
      phone: data.phone || "",
      image: data.image || "",
      coverImage: data.coverImage || "",
      website: data.website || "",
      country: data.country || "",
      state: data.state || "",
      city: data.city || "",
      title: data.portfolio?.title || "",
      tagline: data.portfolio?.tagline || "",
      bio: data.portfolio?.bio || "",
      profileImage: data.portfolio?.profileImage || "",
      coverPortfolioImage: data.portfolio?.coverImage || "",
      resumeHeadline: data.portfolio?.resumeHeadline || "",
      currentRole: data.portfolio?.currentRole || "",
      phonePortfolio: data.portfolio?.phone || "",
      emailPortfolio: data.portfolio?.email || "",
      websitePortfolio: data.portfolio?.website || "",
      countryPortfolio: data.portfolio?.country || "",
      statePortfolio: data.portfolio?.state || "",
      cityPortfolio: data.portfolio?.city || "",
      timezone: data.portfolio?.timezone || "",
      allowContactForm: data.portfolio?.allowContactForm ?? true,
      allowResumeDownload: data.portfolio?.allowResumeDownload ?? true,
      seoTitle: data.portfolio?.seoTitle || "",
      seoDescription: data.portfolio?.seoDescription || "",
      seoKeywords: data.portfolio?.seoKeywords || "",
      seoImage: data.portfolio?.seoImage || "",
      ogTitle: data.portfolio?.ogTitle || "",
      ogSubtitle: data.portfolio?.ogSubtitle || "",
      ogDescription: data.portfolio?.ogDescription || "",
      ogImage: data.portfolio?.ogImage || "",
      primaryButtonText: data.portfolio?.primaryButtonText || "",
      primaryButtonUrl: data.portfolio?.primaryButtonUrl || "",
      secondaryButtonText: data.portfolio?.secondaryButtonText || "",
      secondaryButtonUrl: data.portfolio?.secondaryButtonUrl || "",
      currentFocus: data.portfolio?.currentFocus || "",
      availabilityStatus: data.portfolio?.availabilityStatus || "",
      aboutImage: data.portfolio?.aboutImage || "",
      contactAvailability: data.portfolio?.contactAvailability || "",
      twitterImage: data.portfolio?.twitterImage || "",
      description: data.portfolio?.description || "",
      heroIntroduction: data.portfolio?.heroIntroduction || "",
    };

    setForm(fetchedForm);
    setBaselineSnapshot(JSON.stringify(fetchedForm));
  }

  useEffect(() => {
    let populatedForm = { ...form };
    if (initialData) {
      populatedForm = {
        name: initialData.name || "",
        email: initialData.email || "",
        username: initialData.username || "",
        phone: initialData.phone || "",
        image: initialData.image || "",
        coverImage: initialData.coverImage || "",
        website: initialData.website || "",
        country: initialData.country || "",
        state: initialData.state || "",
        city: initialData.city || "",
        title: initialData.portfolio?.title || "",
        tagline: initialData.portfolio?.tagline || "",
        bio: initialData.portfolio?.bio || "",
        profileImage: initialData.portfolio?.profileImage || "",
        coverPortfolioImage: initialData.portfolio?.coverImage || "",
        resumeHeadline: initialData.portfolio?.resumeHeadline || "",
        currentRole: initialData.portfolio?.currentRole || "",
        phonePortfolio: initialData.portfolio?.phone || "",
        emailPortfolio: initialData.portfolio?.email || "",
        websitePortfolio: initialData.portfolio?.website || "",
        countryPortfolio: initialData.portfolio?.country || "",
        statePortfolio: initialData.portfolio?.state || "",
        cityPortfolio: initialData.portfolio?.city || "",
        timezone: initialData.portfolio?.timezone || "",
        allowContactForm: initialData.portfolio?.allowContactForm ?? true,
        allowResumeDownload: initialData.portfolio?.allowResumeDownload ?? true,
        seoTitle: initialData.portfolio?.seoTitle || "",
        seoDescription: initialData.portfolio?.seoDescription || "",
        seoKeywords: initialData.portfolio?.seoKeywords || "",
        seoImage: initialData.portfolio?.seoImage || "",
        ogTitle: initialData.portfolio?.ogTitle || "",
        ogSubtitle: initialData.portfolio?.ogSubtitle || "",
        ogDescription: initialData.portfolio?.ogDescription || "",
        ogImage: initialData.portfolio?.ogImage || "",
        primaryButtonText: initialData.portfolio?.primaryButtonText || "",
        primaryButtonUrl: initialData.portfolio?.primaryButtonUrl || "",
        secondaryButtonText: initialData.portfolio?.secondaryButtonText || "",
        secondaryButtonUrl: initialData.portfolio?.secondaryButtonUrl || "",
        currentFocus: initialData.portfolio?.currentFocus || "",
        availabilityStatus: initialData.portfolio?.availabilityStatus || "",
        aboutImage: initialData.portfolio?.aboutImage || "",
        contactAvailability: initialData.portfolio?.contactAvailability || "",
        twitterImage: initialData.portfolio?.twitterImage || "",
        description: initialData.portfolio?.description || "",
        heroIntroduction: initialData.portfolio?.heroIntroduction || "",
      };
      setForm(populatedForm);
      setBaselineSnapshot(JSON.stringify(populatedForm));
    } else {
      loadProfile();
    }
  }, [initialData]);

  useEffect(() => {
    if (!baselineSnapshot) return;
    setHasChanges(JSON.stringify(form) !== baselineSnapshot);
  }, [form, baselineSnapshot]);

  const isNameInvalid = form.name.trim() === "";
  const isTitleInvalid = form.title.trim() === "";
  const isTaglineInvalid = form.tagline.trim() === "";
  const isWebsiteInvalid = form.website.trim() !== "" && !form.website.trim().startsWith("http");

  const isFormInvalid = isNameInvalid || isTitleInvalid || isTaglineInvalid || isWebsiteInvalid;

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleCheckbox(e: any) {
    const { name, checked } = e.target;
    setForm((p) => ({ ...p, [name]: checked }));
  }

  function handleManualSubmit() {
    setIsTouched(true);
    if (isFormInvalid) return;
    if (!hasChanges) return;

    startTransition(async () => {
      try {
        await updateProfile({
          ...form,
          name: form.name.trim(),
          title: form.title.trim(),
          tagline: form.tagline.trim(),
          website: form.website.trim(),
          bio: form.bio.trim(),
          heroIntroduction: form.heroIntroduction.trim(),
          description: form.description.trim(),
          currentRole: form.currentRole.trim(),
          resumeHeadline: form.resumeHeadline.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          emailPortfolio: form.emailPortfolio.trim(),
          phonePortfolio: form.phonePortfolio.trim(),
          profileImage: form.image || form.profileImage,
          coverPortfolioImage: form.coverImage || form.coverPortfolioImage,
        });
        onSuccess?.();
      } catch (error) {
        console.error("Failed to commit profile updates:", error);
      }
    });
  }

  const inputStyle =
    "w-full rounded-lg border border-white/5 bg-[#0A0A0B] p-2.5 sm:p-3 text-zinc-200 placeholder-zinc-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500/60 focus:bg-[#0E0E10] shadow-inner font-sans transition-all duration-200 disabled:opacity-40";

  const labelStyle =
    "mb-1 flex flex-wrap items-center justify-between gap-1 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 group-hover/input:text-zinc-300 transition-colors";

  const descriptionStyle =
    "text-[10px] sm:text-xs text-zinc-500 font-sans leading-normal block mt-1";

  const scrapeRecommendationStyle =
    "text-[9px] sm:text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 rounded p-2.5 mt-1 leading-normal items-start gap-1.5 break-words overflow-hidden";

  const toggleMobileBtnStyle =
    "sm:hidden flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400/80 hover:text-blue-400 mt-1 self-start select-none bg-blue-500/5 border border-blue-500/10 px-2 py-1 rounded transition-colors";

  return (
    <div className="w-full space-y-4 sm:space-y-6 text-zinc-300 bg-transparent font-sans selection:bg-blue-500/30 selection:text-white select-none max-w-full overflow-x-hidden px-1 sm:px-0">
      <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-5 rounded-xl bg-[#070708]">
        <h2 className="font-bold text-xs sm:text-sm text-zinc-300 flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-2 font-mono uppercase tracking-wider">
          <User size={14} className="text-blue-400 shrink-0" />
          <span>User Account Registry</span>
          {hasChanges && (
            <span className="ml-0 sm:ml-2 text-[8px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-1.5 py-0.5 rounded tracking-normal uppercase font-bold animate-pulse">
              registry_modified
            </span>
          )}
        </h2>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Full Name <span className="text-red-400 font-sans font-bold">*(Required)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isTouched && isNameInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                  <AlertCircle size={9} /> missing_identity
                </span>
              ) : form.name.trim() ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                  <CheckCircle2 size={9} /> registry_set
                </span>
              ) : null}
              <Terminal size={10} className="text-zinc-700 hidden sm:block" />
            </div>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={() => setIsTouched(true)}
            placeholder="e.g. Raj Kumar Nath Sharma"
            disabled={isPending}
            className={`${inputStyle} ${isTouched && isNameInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
          />
          {isTouched && isNameInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5 break-words">
              ⚠️ Registry Exception: Full identity name assignment parameter required.
            </p>
          )}
          <span className={descriptionStyle}>
            Your primary personal or corporate system brand representation identity.
          </span>
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              System Username Node{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Immutable)
              </span>
            </span>
          </label>
          <div className="w-full rounded-lg border border-white/5 p-2.5 sm:p-3 bg-[#0A0A0B]/40 text-zinc-500 text-xs sm:text-sm font-mono font-bold select-none opacity-60 truncate">
            @{form.username || "username_node"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Phone Contact{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              disabled={isPending}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                City / Metro{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Rourkela"
              disabled={isPending}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                State / Province{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Odisha"
              disabled={isPending}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Country{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="India"
              disabled={isPending}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-white/5 group/input">
          <div className="flex justify-between items-center w-full">
            <label className={labelStyle}>
              <span>
                Avatar Profile Image{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
              <ImageIcon size={10} className="text-zinc-700 hidden sm:block" />
            </label>
            <button
              type="button"
              onClick={() => setShowAvatarGuide(!showAvatarGuide)}
              className={toggleMobileBtnStyle}
            >
              {showAvatarGuide ? (
                <>
                  Hide Guide <ChevronUp size={10} />
                </>
              ) : (
                <>
                  Read Guide <ChevronDown size={10} />
                </>
              )}
            </button>
          </div>

          <div
            className={`${scrapeRecommendationStyle} ${showAvatarGuide ? "flex" : "hidden sm:flex"}`}
          >
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400 animate-pulse" />
            <span>
              <strong>Profile Image Scope:</strong> This asset maps to your main portfolio profile
              banner card. Leaving this unpopulated leaves an empty icon placeholder on your live
              theme. If your image file is missing, search Google Images, right-click, choose{" "}
              <strong>&quot;Copy Image Address / URL&quot;</strong>, and paste the direct string
              down here.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
            <div className="flex items-center justify-center shrink-0">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover border border-white/10 bg-[#0A0A0B]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                  NULL
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={isPending}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const oldUrl = form.image;
                  const res = await upload(file, CLOUDINARY_FOLDERS.profile, "image");
                  setForm((p) => ({ ...p, image: res.url }));
                  if (oldUrl && oldUrl !== res.url) {
                    await deleteCloudinaryUrl(oldUrl, "image");
                  }
                } catch (err) {
                  console.error(err);
                }
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-2 sm:file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B] overflow-hidden"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-white/5 group/input">
          <div className="flex justify-between items-center w-full">
            <label className={labelStyle}>
              <span>
                Account Cover Canvas Banner{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowCoverGuide(!showCoverGuide)}
              className={toggleMobileBtnStyle}
            >
              {showCoverGuide ? (
                <>
                  Hide Info <ChevronUp size={10} />
                </>
              ) : (
                <>
                  Read Info <ChevronDown size={10} />
                </>
              )}
            </button>
          </div>

          <div
            className={`${scrapeRecommendationStyle} ${showCoverGuide ? "block" : "hidden sm:block"}`}
          >
            <ShieldAlert size={12} className="shrink-0 mt-0.5 inline mr-1.5 text-amber-400" />
            <span>
              <strong>Cover Image Usage:</strong> This image is used as your portfolio cover/banner
              image. It may appear in portfolio hero sections, portfolio preview cards, Open Graph
              (OG) social sharing previews, LinkedIn shares, WhatsApp previews, Twitter/X cards,
              Discord embeds, and search engine rich previews. Upload a high-quality banner image
              for the best presentation of your portfolio across the web.
            </span>
          </div>

          <div className="space-y-2 w-full">
            {form.coverImage ? (
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="w-full h-20 sm:h-24 object-cover rounded-lg border border-white/5 bg-[#0A0A0B]"
              />
            ) : (
              <div className="w-full h-12 rounded-lg bg-[#0A0A0B]/30 border border-white/5 flex items-center justify-center text-[10px] text-zinc-600 font-mono italic text-center px-2">
                No canvas layout background configured
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={isPending}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const oldUrl = form.coverImage;
                  const res = await upload(file, CLOUDINARY_FOLDERS.cover, "image");
                  setForm((p) => ({ ...p, coverImage: res.url }));
                  if (oldUrl && oldUrl !== res.url) {
                    await deleteCloudinaryUrl(oldUrl, "image");
                  }
                } catch (err) {
                  console.error(err);
                }
                e.target.value = "";
              }}
              className="w-full text-[11px] font-mono text-zinc-500 file:mr-2 sm:file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:font-bold file:uppercase file:bg-[#121214] file:text-zinc-300 hover:file:bg-zinc-800 border border-white/5 p-1 rounded-lg bg-[#0A0A0B] overflow-hidden"
            />
          </div>
        </div>

        <div
          className={`${scrapeRecommendationStyle} border-emerald-500/10 bg-emerald-500/5 text-zinc-300 ${showCoverGuide ? "block" : "hidden sm:block"}`}
        >
          <ShieldAlert size={12} className="shrink-0 mt-0.5 inline mr-1.5 text-emerald-400" />
          <span>
            <strong className="text-emerald-400">Public Portfolio Cover Image Assets:</strong>
            It appears as the hero/banner background in supported portfolio themes and handles
            public metadata display rules across chat applications, LinkedIn cards, and search
            layouts. Recommended size: <strong>1200 × 630 px</strong>.
          </span>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-5 rounded-xl bg-[#070708]">
        <h2 className="font-bold text-xs sm:text-sm text-zinc-300 flex items-center gap-1.5 border-b border-white/5 pb-2 font-mono uppercase tracking-wider">
          <Rocket size={14} className="text-blue-400 shrink-0" />
          <span>Portfolio Presentation Matrix</span>
        </h2>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Portfolio Meta Title{" "}
              <span className="text-red-400 font-sans font-bold">*(Required)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isTouched && isTitleInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                  <AlertCircle size={9} /> missing_title
                </span>
              ) : form.title.trim() ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                  <CheckCircle2 size={9} /> initialized
                </span>
              ) : null}
            </div>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={() => setIsTouched(true)}
            placeholder="e.g. Developer Portfolio Workspace"
            disabled={isPending}
            className={`${inputStyle} ${isTouched && isTitleInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
          />
          {isTouched && isTitleInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5 break-words">
              ⚠️ Field Exception: Portfolio focus tracking title must be stated.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Core Tagline Node{" "}
              <span className="text-red-400 font-sans font-bold">*(Required)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isTouched && isTaglineInvalid ? (
                <span className="text-[8px] font-mono text-red-400 bg-red-500/5 px-1 rounded border border-red-500/10 lowercase flex items-center gap-0.5">
                  <AlertCircle size={9} /> missing_tagline
                </span>
              ) : form.tagline.trim() ? (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-1 rounded border border-emerald-500/10 lowercase flex items-center gap-0.5">
                  <CheckCircle2 size={9} /> validated
                </span>
              ) : null}
            </div>
          </label>
          <input
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            onBlur={() => setIsTouched(true)}
            placeholder="e.g. Architecting Full-Stack Applications across React, Node.js & MongoDB"
            disabled={isPending}
            className={`${inputStyle} ${isTouched && isTaglineInvalid ? "border-red-500/30 bg-red-500/[0.01]" : "border-white/5"}`}
          />
          {isTouched && isTaglineInvalid && (
            <p className="text-[10px] font-mono font-medium text-red-400/90 pt-0.5">
              ⚠️ Field Exception: Showcase context sub-header baseline vector required.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 group/input">
          <div className="flex justify-between items-center w-full">
            <label className={labelStyle}>
              <span>
                Short Professional Bio{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowBioGuide(!showBioGuide)}
              className={toggleMobileBtnStyle}
            >
              {showBioGuide ? (
                <>
                  Hide Info <ChevronUp size={10} />
                </>
              ) : (
                <>
                  Read Info <ChevronDown size={10} />
                </>
              )}
            </button>
          </div>

          <div
            className={`${scrapeRecommendationStyle} ${showBioGuide ? "flex" : "hidden sm:flex"}`}
          >
            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-400 animate-pulse" />
            <span>
              <strong>Bio Section Scope:</strong> This text maps directly to your main portfolio
              **About / Bio** section on the live landing framework index. Leaving this parameter
              unpopulated prevents your public visitors from reading your professional baseline
              credentials story and core stack summary.
            </span>
          </div>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Provide a quick macro summary..."
            disabled={isPending}
            className={`${inputStyle} resize-none`}
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Hero Welcome Introduction{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <textarea
            name="heroIntroduction"
            value={form.heroIntroduction}
            onChange={handleChange}
            placeholder="Brief welcome line displayed in the landing banner hero block"
            disabled={isPending}
            className={`${inputStyle} resize-none`}
            rows={2}
          />
        </div>

        <div className="flex flex-col gap-1 group/input">
          <label className={labelStyle}>
            <span>
              Extended Summary Description{" "}
              <span className="text-zinc-600 font-sans font-normal lowercase italic">
                *(Optional)
              </span>
            </span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Comprehensive overview layout..."
            disabled={isPending}
            className={`${inputStyle} resize-none`}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Active Role Designation{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="currentRole"
              value={form.currentRole}
              onChange={handleChange}
              placeholder="e.g. Full-Stack Developer / Electrical Engineer"
              disabled={isPending}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Resume Objective Headline{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="resumeHeadline"
              value={form.resumeHeadline}
              onChange={handleChange}
              placeholder="e.g. Proficient in C++, Java, Python, and MERN stack engineering architecture"
              disabled={isPending}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 pt-3 border-t border-white/5">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            Portfolio Location Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Portfolio City</span>
              </label>
              <input
                name="cityPortfolio"
                value={form.cityPortfolio}
                onChange={handleChange}
                placeholder="Rourkela"
                disabled={isPending}
                className={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Portfolio State</span>
              </label>
              <input
                name="statePortfolio"
                value={form.statePortfolio}
                onChange={handleChange}
                placeholder="Odisha"
                disabled={isPending}
                className={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Portfolio Country</span>
              </label>
              <input
                name="countryPortfolio"
                value={form.countryPortfolio}
                onChange={handleChange}
                placeholder="India"
                disabled={isPending}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 pt-3 border-t border-white/5">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            Hero Status Trackers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Current Focus</span>
              </label>
              <input
                name="currentFocus"
                value={form.currentFocus}
                onChange={handleChange}
                placeholder="e.g. Building AI Products"
                disabled={isPending}
                className={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1 group/input">
              <label className={labelStyle}>
                <span>Availability Status</span>
              </label>
              <input
                name="availabilityStatus"
                value={form.availabilityStatus}
                onChange={handleChange}
                placeholder="e.g. Open To Opportunities"
                disabled={isPending}
                className={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-5 rounded-xl bg-[#070708]">
        <h2 className="font-bold text-xs sm:text-sm text-zinc-300 flex items-center gap-1.5 border-b border-white/5 pb-2 font-mono uppercase tracking-wider">
          <Mail size={14} className="text-blue-400 shrink-0" />
          <span>Public Communications Overrides</span>
        </h2>
        <p className="text-[11px] text-zinc-500 mt-[-4px] font-sans leading-normal">
          Public contact information displayed on your portfolio. Visitors may use these details to
          reach you directly. Leave any field empty if you do not want it shown publicly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Public Portfolio Mail Gateway{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="emailPortfolio"
              value={form.emailPortfolio}
              onChange={handleChange}
              placeholder="e.g. contact@domain.com"
              disabled={isPending}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1 group/input">
            <label className={labelStyle}>
              <span>
                Public Portfolio Phone Node{" "}
                <span className="text-zinc-600 font-sans font-normal lowercase italic">
                  *(Optional)
                </span>
              </span>
            </label>
            <input
              name="phonePortfolio"
              value={form.phonePortfolio}
              onChange={handleChange}
              placeholder="e.g. +91 XXXXX XXXXX"
              disabled={isPending}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4 border border-white/5 p-3 sm:p-5 rounded-xl bg-[#070708]">
        <h2 className="font-bold text-xs sm:text-sm text-zinc-300 flex items-center gap-1.5 border-b border-white/5 pb-2 font-mono uppercase tracking-wider">
          <Terminal size={14} className="text-blue-400 shrink-0" />
          <span>Feature Flags & Toggles</span>
        </h2>

        <div className="flex flex-col gap-3 pt-0.5">
          <label className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-zinc-400 select-none cursor-pointer group">
            <input
              type="checkbox"
              name="allowContactForm"
              checked={form.allowContactForm}
              onChange={handleCheckbox}
              disabled={isPending}
              className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] mt-0.5 shrink-0 cursor-pointer"
            />
            <span className="group-hover:text-white transition-colors leading-tight">
              Enable Interactive Public Contact Message Box Form Layout
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-zinc-400 select-none cursor-pointer group">
            <input
              type="checkbox"
              name="allowResumeDownload"
              checked={form.allowResumeDownload}
              onChange={handleCheckbox}
              disabled={isPending}
              className="w-4 h-4 border-white/10 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-[#0A0A0B] mt-0.5 shrink-0 cursor-pointer"
            />
            <span className="group-hover:text-white transition-colors leading-tight">
              Allow Anonymous Viewers to Download Attached Resume PDF Document Objects
            </span>
          </label>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/5 font-mono text-xs font-bold uppercase tracking-wider">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="w-full sm:flex-1 bg-[#121214] hover:bg-[#161619] border border-white/5 text-zinc-400 hover:text-white py-3 px-4 rounded-lg text-center focus:outline-none transition-all duration-200 order-2 sm:order-1"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleManualSubmit}
          disabled={isPending || isFormInvalid || !hasChanges}
          className="w-full sm:flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md text-center flex items-center justify-center h-11 focus:outline-none font-mono order-1 sm:order-2"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 size={13} className="animate-spin shrink-0" />
              <span>Committing Matrix Updates...</span>
            </span>
          ) : !hasChanges ? (
            "No Changes Detected"
          ) : (
            "Save Profile Configuration"
          )}
        </button>
      </div>
    </div>
  );
}
