"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Award,
  Plus,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  Search,
  X,
  ArrowUpDown,
  HelpCircle,
  Sparkles,
  Info,
  FolderOpen,
  FolderPlus,
  Layers,
} from "lucide-react";

import { getSkills } from "@/actions/skill";
import { getSkillCategories } from "@/actions/skill-category";
import SkillCard from "@/components/cards/skill-card";
import SkillForm from "@/components/forms/skill-form";
import SkillCategoryForm from "@/components/forms/skill-category-form";
import { getMyPortfolioId } from "@/actions/portfolio";

type Skill = {
  id: string;
  name: string;
  category?: { id: string; name: string } | null;
  proficiency?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsOfExperience?: number | null;
  iconName?: string | null;
  iconUrl?: string | null;
  description?: string | null;
  tag?: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type Category = {
  id: string;
  name: string;
  displayOrder: number;
};

export default function SkillsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedSkillToEdit, setSelectedSkillToEdit] = useState<Skill | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"lexical" | "proficiency">("lexical");
  const [isSyncing, setIsSyncing] = useState(false);

  async function loadSkills(pId?: string) {
    try {
      if (skills.length === 0) setLoading(true);
      else setIsSyncing(true);
      setError(null);

      let activeId = pId || portfolioId;

      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error(
            "error" in portfolioResult && typeof portfolioResult.error === "string"
              ? portfolioResult.error
              : "Portfolio context tracing target missing."
          );
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      const [skillsResult, categoriesResult] = await Promise.all([
        getSkills(activeId),
        getSkillCategories(activeId),
      ]);

      if (
        !skillsResult ||
        !skillsResult.success ||
        !("data" in skillsResult) ||
        !Array.isArray(skillsResult.data)
      ) {
        throw new Error(
          "error" in skillsResult && typeof skillsResult.error === "string"
            ? skillsResult.error
            : "Failed to compile background skills matrix markers."
        );
      }

      if (
        !categoriesResult ||
        !categoriesResult.success ||
        !("data" in categoriesResult) ||
        !Array.isArray(categoriesResult.data)
      ) {
        throw new Error(
          "error" in categoriesResult && typeof categoriesResult.error === "string"
            ? categoriesResult.error
            : "Failed to compile custom sorting categories."
        );
      }

      const skillsData = skillsResult.data;
      const categoriesData = categoriesResult.data;

      setCategories(
        categoriesData.map((c: any) => ({
          id: c.id,
          name: c.name,
          displayOrder: typeof c.displayOrder === "number" ? c.displayOrder : 0,
        }))
      );

      const map = new Map<string, Skill>();

      for (const item of skillsData) {
        map.set(item.id, {
          id: item.id,
          name: item.name,
          category: item.category ?? null,
          proficiency: item.proficiency ?? undefined,
          yearsOfExperience: item.yearsOfExperience ?? null,
          iconName: item.iconName ?? null,
          iconUrl: item.iconUrl ?? null,
          description: item.description ?? null,
          tag: item.tag ?? null,
          displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : 0,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        });
      }
      setSkills(Array.from(map.values()));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load skills matrix profile elements."
      );
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error(
            "error" in portfolioResult && typeof portfolioResult.error === "string"
              ? portfolioResult.error
              : "Portfolio identifier trace failure."
          );
        }

        const id = portfolioResult.data;
        setPortfolioId(id);
        await loadSkills(id);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to resolve active full-stack portfolio credentials token mapping."
        );
        setLoading(false);
      }
    })();
  }, [username]);

  const filteredSkills = skills.filter((skill) => {
    const matchCriteria =
      `${skill.name} ${skill.tag || ""} ${skill.description || ""} ${skill.category?.name || ""}`.toLowerCase();
    return matchCriteria.includes(searchQuery.toLowerCase());
  });

  const orderedCategories = [...categories].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const isShowcaseIncomplete =
    skills.length > 0 && skills.some((s) => !s.proficiency || !s.description || !s.category);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono p-4 text-center mx-3 sm:mx-auto">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-xs uppercase tracking-widest">
          // Synchronizing skill capabilities matrices...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 rounded-none sm:rounded-xl border-y sm:border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3.5 items-start text-white font-sans w-full">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-sm font-bold text-zinc-200 tracking-tight">
            Showcase Data Extraction Failure
          </h4>
          <p className="text-xs text-red-400/90 leading-relaxed">{error}</p>
          <button
            onClick={() => loadSkills(portfolioId)}
            className="w-full inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-white w-full max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5 px-4 sm:px-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm shrink-0">
              <Award size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">
              Skills Matrix
            </h1>
            {isSyncing && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500 mt-1" />}
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Configure technical stacks, proficiency clusters, and classification groups visible on
            your target home presentation canvas.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-end shrink-0">
          {skills.length > 0 && (
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-zinc-500 hidden sm:flex mr-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Grid Presentation Layout"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
                title="Compact List Rows View"
              >
                <List size={13} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
            <button
              onClick={() => setOpenCategoryModal(true)}
              className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all select-none"
            >
              <FolderPlus size={13} />
              <span>Category</span>
            </button>

            <button
              onClick={() => setOpenAddModal(true)}
              className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider shadow-md transition-all select-none"
            >
              <Plus size={14} />
              <span>Add Skill</span>
            </button>
          </div>
        </div>
      </div>

      {isShowcaseIncomplete && (
        <div className="rounded-xl border border-blue-500/10 bg-gradient-to-r from-blue-500/[0.03] to-transparent p-4 flex gap-2.5 items-start animate-fadeIn w-full mx-4 sm:mx-0">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-xs font-bold tracking-wide text-zinc-200">
              Missing Portfolio Resource Parameters Detected
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">
              We highly recommend formatting all capability vectors neatly. Associating clean
              clusters (
              <span className="text-zinc-400 font-mono text-[10px]">Skill Categories</span>), target
              values (
              <span className="text-zinc-400 font-mono text-[10px]">Proficiency Levels</span>), and
              descriptive logs ensures full high-fidelity validation blocks appear correctly on your
              public theme layer.
            </p>
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/50 pb-4 px-4 sm:px-0">
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search framework name, tags, description copy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-8.5 bg-[#09090b] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-end shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
            <div className="flex items-center gap-0.5 bg-zinc-950 border border-zinc-900 p-0.5 rounded-lg text-[11px] font-mono w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSortBy("lexical")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase tracking-tight transition-all ${sortBy === "lexical" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Lexical</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("proficiency")}
                className={`flex-1 sm:flex-none inline-flex h-6 items-center justify-center gap-1 px-2.5 rounded-md font-bold uppercase tracking-tight transition-all ${sortBy === "proficiency" ? "bg-zinc-900 text-zinc-200 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <ArrowUpDown size={9} />
                <span className="text-[9px] sm:text-[10px]">Tier Metrics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 sm:space-y-10">
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-fadeIn w-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 shadow-inner">
              <HelpCircle size={18} />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">
              Capabilities Dashboard Matrix Empty
            </h3>

            <div className="text-[11px] sm:text-xs text-zinc-500 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-sans space-y-3 text-left bg-zinc-950 border border-zinc-900 p-4 rounded-xl">
              <span className="font-bold text-blue-400 block uppercase font-mono tracking-wider text-[9px]">
                💡 Setup Instructions Protocol:
              </span>
              <p>
                1. Mount categorization containers first via the{" "}
                <strong className="text-zinc-300 font-semibold">Category</strong> action trigger
                located above.
              </p>
              <p>
                2. Insert technology logs using{" "}
                <strong className="text-zinc-300 font-semibold">Add Skill</strong>, choosing
                framework titles (e.g.{" "}
                <span className="text-zinc-400 font-mono text-[10px]">TypeScript, PostgreSQL</span>
                ).
              </p>
              <p>
                3. Bind experience chronology values alongside proficiency indicators to format
                highly contextual showcase vectors.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpenAddModal(true)}
              className="mt-6 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
            >
              Populate This Section
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-10">
            {orderedCategories.map((category) => {
              const categorySkills = filteredSkills
                .filter((skill) => skill.category?.id === category.id)
                .sort((a, b) => {
                  if (sortBy === "proficiency") {
                    const weight = { EXPERT: 4, ADVANCED: 3, INTERMEDIATE: 2, BEGINNER: 1 };
                    return (
                      (weight[b.proficiency || "BEGINNER"] || 0) -
                      (weight[a.proficiency || "BEGINNER"] || 0)
                    );
                  }
                  return a.name.localeCompare(b.name);
                });

              if (categorySkills.length === 0) return null;

              return (
                <div key={category.id} className="space-y-3 sm:space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 px-4 sm:px-0">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-zinc-500" />
                      <h2 className="text-sm font-bold tracking-tight text-zinc-200 uppercase font-mono">
                        {category.name}
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-zinc-500 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded">
                      {categorySkills.length}{" "}
                      <span className="hidden sm:inline">Framework entries</span>
                      <span className="inline sm:hidden">Items</span>
                    </span>
                  </div>

                  <div className="block sm:hidden space-y-2.5">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex flex-col p-4 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2.5 min-w-0 w-full pr-14">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {skill.iconUrl && (
                              <img
                                src={skill.iconUrl}
                                alt=""
                                className="w-4 h-4 object-contain shrink-0"
                              />
                            )}
                            <p className="font-bold text-xs text-zinc-200 truncate font-sans">
                              {skill.name}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-mono font-bold border shrink-0 ${
                              skill.proficiency === "EXPERT"
                                ? "bg-purple-500/5 border-purple-500/10 text-purple-400"
                                : skill.proficiency === "ADVANCED"
                                  ? "bg-blue-500/5 border-blue-500/10 text-blue-400"
                                  : skill.proficiency === "INTERMEDIATE"
                                    ? "bg-amber-500/5 border-amber-500/10 text-amber-400"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            }`}
                          >
                            {skill.proficiency || "BEGINNER"}
                          </span>
                        </div>

                        {skill.description && (
                          <p className="text-[10px] text-zinc-400 font-sans line-clamp-2 px-0.5 break-words leading-relaxed">
                            {skill.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
                          <span className="text-[9px] font-mono text-zinc-600">
                            {skill.yearsOfExperience
                              ? `${skill.yearsOfExperience} Yrs Exp`
                              : "Experience Unset"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedSkillToEdit(skill)}
                            className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-3 text-[10px] font-mono font-bold text-zinc-300 focus:outline-none"
                          >
                            Modify
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden sm:block">
                    {viewMode === "grid" ? (
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {categorySkills.map((skill) => (
                          <SkillCard
                            key={skill.id}
                            id={skill.id}
                            name={skill.name}
                            proficiency={skill.proficiency}
                            yearsOfExperience={skill.yearsOfExperience ?? undefined}
                            description={skill.description ?? undefined}
                            iconUrl={skill.iconUrl ?? undefined}
                            categoryName={skill.category?.name}
                            categoryId={skill.category?.id}
                            onRefresh={loadSkills}
                            onEditClick={() => setSelectedSkillToEdit(skill)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-zinc-900 bg-[#070709] shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                            {categorySkills.map((skill) => (
                              <tr
                                key={skill.id}
                                className="hover:bg-zinc-900/30 transition-colors group/row"
                              >
                                <td className="py-3 px-4 font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors min-w-[180px]">
                                  <div className="flex items-center gap-2.5">
                                    {skill.iconUrl && (
                                      <img
                                        src={skill.iconUrl}
                                        alt=""
                                        className="w-4 h-4 object-contain shrink-0"
                                      />
                                    )}
                                    <span>{skill.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-mono font-bold border uppercase ${
                                      skill.proficiency === "EXPERT"
                                        ? "bg-purple-500/5 border-purple-500/10 text-purple-400"
                                        : skill.proficiency === "ADVANCED"
                                          ? "bg-blue-500/5 border-blue-500/10 text-blue-400"
                                          : skill.proficiency === "INTERMEDIATE"
                                            ? "bg-amber-500/5 border-amber-500/10 text-amber-400"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                    }`}
                                  >
                                    {skill.proficiency || "BEGINNER"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                                  {skill.yearsOfExperience ? (
                                    `${skill.yearsOfExperience} Yrs Experience`
                                  ) : (
                                    <span className="text-zinc-700 italic">Unspecified</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-zinc-400 max-w-xs truncate italic">
                                  {skill.description || <span className="text-zinc-800">—</span>}
                                </td>
                                <td className="py-3 px-4 text-right shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSkillToEdit(skill)}
                                    className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded"
                                  >
                                    Modify
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredSkills.some((s) => !s.category?.id) && (
              <div className="space-y-3 sm:space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 px-4 sm:px-0">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-500" />
                    <h2 className="text-sm font-bold tracking-tight text-zinc-400 uppercase font-mono">
                      Uncategorized Capabilities
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-zinc-500 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded">
                    {filteredSkills.filter((s) => !s.category?.id).length} Standalone items
                  </span>
                </div>

                <div className="block sm:hidden space-y-2.5">
                  {filteredSkills
                    .filter((s) => !s.category?.id)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((skill) => (
                      <div
                        key={skill.id}
                        className="flex flex-col p-4 rounded-xl border border-zinc-800 bg-[#0C0C0E] space-y-3 shadow-sm relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2.5 min-w-0 w-full pr-14">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {skill.iconUrl && (
                              <img
                                src={skill.iconUrl}
                                alt=""
                                className="w-4 h-4 object-contain shrink-0"
                              />
                            )}
                            <p className="font-bold text-xs text-zinc-200 truncate font-sans">
                              {skill.name}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-mono font-bold border shrink-0 ${
                              skill.proficiency === "EXPERT"
                                ? "bg-purple-500/5 border-purple-500/10 text-purple-400"
                                : skill.proficiency === "ADVANCED"
                                  ? "bg-blue-500/5 border-blue-500/10 text-blue-400"
                                  : skill.proficiency === "INTERMEDIATE"
                                    ? "bg-amber-500/5 border-amber-500/10 text-amber-400"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            }`}
                          >
                            {skill.proficiency || "BEGINNER"}
                          </span>
                        </div>

                        {skill.description && (
                          <p className="text-[10px] text-zinc-400 font-sans line-clamp-2 px-0.5 break-words leading-relaxed">
                            {skill.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
                          <span className="text-[9px] font-mono text-zinc-600">
                            {skill.yearsOfExperience
                              ? `${skill.yearsOfExperience} Yrs Exp`
                              : "Experience Unset"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedSkillToEdit(skill)}
                            className="inline-flex h-6 items-center justify-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-3 text-[10px] font-mono font-bold text-zinc-300 focus:outline-none"
                          >
                            Modify
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="hidden sm:block">
                  {viewMode === "grid" ? (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {filteredSkills
                        .filter((s) => !s.category?.id)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((skill) => (
                          <SkillCard
                            key={skill.id}
                            id={skill.id}
                            name={skill.name}
                            proficiency={skill.proficiency}
                            yearsOfExperience={skill.yearsOfExperience ?? undefined}
                            description={skill.description ?? undefined}
                            iconUrl={skill.iconUrl ?? undefined}
                            categoryName={skill.category?.name}
                            categoryId={skill.category?.id}
                            onRefresh={loadSkills}
                            onEditClick={() => setSelectedSkillToEdit(skill)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-zinc-900 bg-[#070709] shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-zinc-900 text-xs font-sans">
                          {filteredSkills
                            .filter((s) => !s.category?.id)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((skill) => (
                              <tr
                                key={skill.id}
                                className="hover:bg-zinc-900/30 transition-colors group/row"
                              >
                                <td className="py-3 px-4 font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors min-w-[180px]">
                                  <div className="flex items-center gap-2.5">
                                    {skill.iconUrl && (
                                      <img
                                        src={skill.iconUrl}
                                        alt=""
                                        className="w-4 h-4 object-contain shrink-0"
                                      />
                                    )}
                                    <span>{skill.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-mono font-bold border uppercase ${
                                      skill.proficiency === "EXPERT"
                                        ? "bg-purple-500/5 border-purple-500/10 text-purple-400"
                                        : skill.proficiency === "ADVANCED"
                                          ? "bg-blue-500/5 border-blue-500/10 text-blue-400"
                                          : skill.proficiency === "INTERMEDIATE"
                                            ? "bg-amber-500/5 border-amber-500/10 text-amber-400"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                    }`}
                                  >
                                    {skill.proficiency || "BEGINNER"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                                  {skill.yearsOfExperience ? (
                                    `${skill.yearsOfExperience} Yrs Experience`
                                  ) : (
                                    <span className="text-zinc-700 italic">Unspecified</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-zinc-400 max-w-xs truncate italic">
                                  {skill.description || <span className="text-zinc-800">—</span>}
                                </td>
                                <td className="py-3 px-4 text-right shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSkillToEdit(skill)}
                                    className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded"
                                  >
                                    Modify
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {openAddModal && (
        <div className="fixed inset-0 bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn">
          <div className="max-h-[100vh] sm:max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-none sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl relative">
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono pr-4">
                  Initialize New Capability Showcase Entry
                </h2>
              </div>
              <button
                onClick={() => setOpenAddModal(false)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="w-full overflow-x-hidden">
              <SkillForm
                onSuccess={() => {
                  setOpenAddModal(false);
                  loadSkills(portfolioId);
                }}
                onCancel={() => setOpenAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {openCategoryModal && (
        <div className="fixed inset-0 bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn">
          <div className="max-h-[100vh] sm:max-h-[90vh] w-full max-w-md overflow-y-auto rounded-none sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl relative">
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono pr-4">
                  Create Stack Categorization Group
                </h2>
              </div>
              <button
                onClick={() => setOpenCategoryModal(false)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="w-full overflow-x-hidden">
              <SkillCategoryForm
                portfolioId={portfolioId}
                onSuccess={() => {
                  setOpenCategoryModal(false);
                  loadSkills(portfolioId);
                }}
                onCancel={() => setOpenCategoryModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {selectedSkillToEdit && (
        <div className="fixed inset-0 bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn">
          <div className="max-h-[100vh] sm:max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-none sm:rounded-xl border-t sm:border border-zinc-800 bg-[#0C0C0E] p-0 text-white shadow-2xl relative">
            <div className="w-full sticky top-0 bg-[#0C0C0E] z-20 flex items-center justify-between border-b border-zinc-900/80 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Sparkles size={14} className="text-blue-400 animate-pulse shrink-0" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono truncate pr-4">
                  Modify Capability Parameters: {selectedSkillToEdit.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSkillToEdit(null)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs bg-zinc-950 border border-zinc-900 px-2.5 py-1 rounded focus:outline-none shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="w-full overflow-x-hidden">
              <SkillForm
                initialData={{
                  id: selectedSkillToEdit.id,
                  name: selectedSkillToEdit.name,
                  proficiency: selectedSkillToEdit.proficiency,
                  yearsOfExperience: selectedSkillToEdit.yearsOfExperience ?? undefined,
                  iconName: selectedSkillToEdit.iconName ?? undefined,
                  iconUrl: selectedSkillToEdit.iconUrl ?? undefined,
                  description: selectedSkillToEdit.description ?? undefined,
                  tag: selectedSkillToEdit.tag ?? undefined,
                  categoryId: selectedSkillToEdit.category?.id,
                }}
                onSuccess={() => {
                  setSelectedSkillToEdit(null);
                  loadSkills(portfolioId);
                }}
                onCancel={() => setSelectedSkillToEdit(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
