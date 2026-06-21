"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Palette, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  HelpCircle,
} from "lucide-react";

import {
  getThemes,
  getActiveTheme,
  activateTheme,
} from "@/actions/theme";

import { getMyPortfolioId } from "@/actions/portfolio";

type Theme = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export default function ThemesPage() {
  const params = useParams();
  const username = params?.username as string;

  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<string>("");
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safeguard state matrix
  const [processingTheme, setProcessingTheme] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadThemes(pId?: string) {
    try {
      setLoading(true);
      setError(null);

      let activeId = pId || portfolioId;
      
      // 1. Resolve master portfolio identity from envelope wrapper safely
      if (!activeId) {
        const portfolioResult = await getMyPortfolioId();

        if (!portfolioResult || !portfolioResult.success || !portfolioResult.data) {
          throw new Error(
            portfolioResult?.error || "Portfolio specification profile identification target not found."
          );
        }

        activeId = portfolioResult.data;
        setPortfolioId(activeId);
      }

      // 2. Fetch system theme configurations concurrently 
      const [themesResult, activeThemeResult] = await Promise.all([
        getThemes(),
        getActiveTheme(activeId),
      ]);

      // 🛡️ Discriminated Union Guards: Narrow type configurations to success pathways
      if (!themesResult || !themesResult.success || !("data" in themesResult) || !Array.isArray(themesResult.data)) {
        throw new Error(themesResult?.error || "Failed to load themes catalogue from the server.");
      }

      if (!activeThemeResult || !activeThemeResult.success || !("data" in activeThemeResult)) {
        throw new Error(activeThemeResult?.error || "Failed to cross-reference active presentation canvas.");
      }

      // ✅ Safe Bindings: Typescript cleanly allows array data resolution bounds
      setThemes(themesResult.data as Theme[]);
      setActiveTheme(activeThemeResult.data?.activeTheme ?? "");

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load layout theme choices from database."
      );
    } finally {
      setLoading(false);
    }
  }

  // 3. Mount chronological framework lifecycle coordinates safely unwrapping context tokens
  useEffect(() => {
    (async () => {
      try {
        const result = await getMyPortfolioId();

        if (!result || !result.success || !result.data) {
          throw new Error(result?.error || "Active user portfolio trace token signature was missing.");
        }

        const id = result.data;
        setPortfolioId(id);
        await loadThemes(id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to resolve active full-stack portfolio credentials token mapping."
        );
        setLoading(false);
      }
    })();
  }, [username]);

  async function handleActivate(themeId: string) {
    if (processingTheme || activeTheme === themeId) return; // Multi-click protection matrix

    try {
      setProcessingTheme(themeId);
      setActionError(null);
      
      // 4. Fire activation mutation checking the returned envelope contract rules
      const result = await activateTheme(portfolioId, themeId as any);

      if (!result || !result.success) {
  const errorMessage =
    result && "error" in result
      ? result.error
      : "Theme manager engine dropped system transaction configurations.";

  throw new Error(errorMessage);
}

      setActiveTheme(themeId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to safely transition theme configuration. Please verify infrastructure logs."
      );
    } finally {
      setProcessingTheme(null);
    }
  }

  // Pure-CSS static skeleton generator mapping
  const renderThemeSkeleton = (themeId: string) => {
    const target = themeId.toUpperCase();
    
    switch (target) {
   case "MODERN":
        return (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-indigo-950 to-blue-950 p-4 flex flex-col justify-between overflow-hidden">
            {/* Floating Glassmorphic Shapes - Bluish Modern Aesthetic */}
            <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
            <div className="absolute top-4 right-6 w-12 h-12 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 animate-pulse" />
            <div className="absolute bottom-5 left-1/4 w-24 h-7 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 transform -rotate-6" />
            
            {/* Structural UI Elements */}
            <div className="flex gap-1.5 relative z-10">
              <div className="w-3 h-3 rounded-full bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
              <div className="w-16 h-2 rounded-sm bg-slate-200/20 mt-0.5" />
            </div>
            <div className="w-2/3 h-3.5 rounded bg-gradient-to-r from-blue-400/30 to-cyan-400/20 border border-blue-400/10 relative z-10" />
          </div>
        );

case "MINIMAL":
        return (
          <div className="absolute inset-0 bg-zinc-50 p-4 flex flex-col justify-between border border-zinc-200/80 shadow-inner">
            {/* Clean minimalist light-mode design wireframe */}
            <div className="flex justify-between items-start">
              {/* Fake clean logo/avatar icon */}
              <div className="w-5 h-5 rounded bg-zinc-300/80" />
              {/* Minimal text navigation links */}
              <div className="flex gap-2 mt-1.5">
                <div className="w-6 h-0.5 bg-zinc-300" />
                <div className="w-6 h-0.5 bg-zinc-300" />
              </div>
            </div>
            
            {/* Main structural type elements */}
            <div className="space-y-2 pb-1">
              <div className="w-3/5 h-2 bg-zinc-800 rounded-sm" />
              <div className="w-2/5 h-1 bg-zinc-400 rounded-sm" />
            </div>
          </div>
        );

     case "DARK":
        return (
          <div className="absolute inset-0 bg-[#020204] p-4 flex flex-col justify-between border border-fuchsia-950/40 overflow-hidden">
            {/* Cyberpunk high-density technical lattice grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:0.75rem_0.75rem]" />
            {/* Neon radial glow behind content */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-fuchsia-500/10 blur-xl pointer-events-none" />
            
            {/* Upper Matrix Telemetry Header */}
            <div className="flex justify-between items-center relative z-10">
              <div className="flex gap-1 items-center">
                <div className="w-2.5 h-2.5 bg-cyan-500/30 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)] rounded-sm animate-pulse" />
                <div className="w-6 h-0.5 bg-cyan-500/40" />
              </div>
              <div className="w-10 h-1 bg-fuchsia-950/60 border border-fuchsia-500/20 rounded-none" />
            </div>
            
            {/* Bottom Stack Layout Elements */}
            <div className="space-y-1.5 relative z-10">
              <div className="w-full h-1.5 bg-fuchsia-500/20 border-l-2 border-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.3)] rounded-none" />
              <div className="w-2/3 h-1 bg-cyan-500/20 border-l border-cyan-400 rounded-none" />
            </div>
          </div>
        );

      case "DEVELOPER":
        return (
          <div className="absolute inset-0 bg-[#070b12] p-3 font-mono text-[8px] overflow-hidden select-none border border-zinc-900">
            {/* IDE layout structure setup */}
            <div className="flex items-center gap-1 border-b border-zinc-800/60 pb-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
              <span className="text-[7px] text-zinc-600 ml-1 font-mono">index.tsx</span>
            </div>
            <div className="space-y-1 font-mono tracking-tight text-zinc-500">
              <p><span className="text-pink-500">const</span> canvas = <span className="text-yellow-400">async</span> () =&gt; &#123;</p>
              <p className="pl-2.5 text-emerald-400"><span className="text-purple-400">await</span> initTheme(&apos;dev&apos;);</p>
              <p>&#125;;</p>
            </div>
          </div>
        );
case "DEFAULT":
      default:
        return (
          <div className="absolute inset-0 bg-zinc-950 p-4 flex flex-col justify-between border border-purple-950/40 bg-gradient-to-b from-purple-950/10 to-transparent">
            {/* Standard branded dashboard blueprint - Purple Theme Accent */}
            <div className="flex items-center gap-2">
              {/* Profile/Avatar highlight container */}
              <div className="w-6 h-6 rounded-full bg-purple-950/60 border border-purple-800/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-400/50" />
              </div>
              <div className="space-y-1">
                <div className="w-12 h-1.5 bg-purple-900/50 rounded" />
                <div className="w-6 h-1 bg-purple-950 rounded" />
              </div>
            </div>
            
            {/* Featured block asset wireframe */}
            <div className="space-y-2">
              <div className="w-full h-8 rounded-lg bg-purple-950/20 border border-purple-900/30 shadow-[inset_0_1px_12px_rgba(147,51,234,0.05)]" />
              <div className="w-2/3 h-1 bg-purple-900/40 rounded" />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4 bg-[#050505] text-zinc-500 border border-zinc-900 rounded-xl select-none font-mono px-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-8 w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-xs uppercase tracking-widest">// Initializing layout system canvases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 mx-4 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3.5 items-start text-white font-sans">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-bold text-zinc-200 tracking-tight">Theme Catalog Sync Error</h4>
          <p className="text-xs text-red-400/90 leading-relaxed">{error}</p>
          <button 
            onClick={() => loadThemes(portfolioId)}
            className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Retry Synchronization Sequence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm shrink-0">
              <Palette size={15} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100">Visual Theme Engines</h1>
          </div>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
            Switch your portfolio canvas instantly. Changing active themes restructures appearance components without altering underlying entry items.
          </p>
        </div>
      </div>

      {/* COMPACT INLINE ACTION ERROR PANEL */}
      {actionError && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400 animate-fadeIn">
          <AlertTriangle size={14} className="shrink-0" />
          <span className="font-medium">{actionError}</span>
          <button onClick={() => setActionError(null)} className="ml-auto text-zinc-500 hover:text-zinc-300 font-mono text-[10px]">✕</button>
        </div>
      )}

      {/* INFORMATION COMPLIANCE WELL */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900/40 to-transparent p-4 flex gap-3 items-start w-full">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wide text-zinc-200">
            How The Presentation Canvas Engine Behaves:
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Themes are cosmetic configurations only. Switching from <span className="text-zinc-300 font-medium">Minimal</span> to <span className="text-zinc-300 font-medium">Developer</span> changes presentation layout syntax, text sizing rules, and colour profiles instantly. No content entries are deleted.
          </p>
        </div>
      </div>

      {/* SYSTEM CONTROLLERS */}
      {themes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/10 p-6 sm:p-12 text-center max-w-xl mx-auto my-6 animate-fadeIn">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-4">
            <HelpCircle size={20} />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 tracking-tight">Theme Catalog Empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
            No system layout options have been resolved from the platform registry.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE COMPACT LIST LAYOUT */}
          <div className="block sm:hidden space-y-2">
            {themes.map((theme) => {
              const isCurrentlyActive = activeTheme === theme.id;
              const isThisProcessing = processingTheme === theme.id;

              return (
                <div 
                  key={theme.id}
                  className={`p-3 rounded-lg border bg-[#070709] transition-all flex items-center justify-between gap-3 ${
                    isCurrentlyActive ? "border-zinc-700 bg-zinc-900/10" : "border-zinc-900"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-zinc-200 capitalize truncate">
                        {theme.name.toLowerCase()} Theme
                      </p>
                      {isCurrentlyActive && (
                        <span className="inline-flex items-center gap-0.5 rounded border border-blue-500/20 bg-blue-500/10 px-1 py-0.2 text-[8px] font-bold uppercase tracking-wider text-blue-400 shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    {theme.description && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 truncate leading-normal">
                        {theme.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleActivate(theme.id)}
                    disabled={isCurrentlyActive || processingTheme !== null}
                    className={`h-7 px-3 rounded-md text-[10px] font-semibold transition-all shrink-0 ${
                      isCurrentlyActive
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
                    }`}
                  >
                    {isThisProcessing ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : isCurrentlyActive ? (
                      "Active"
                    ) : (
                      "Activate"
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* DESKTOP RESPONSIVE GRID LAYOUT */}
          <div className="hidden sm:grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 animate-fadeIn">
            {themes.map((theme) => {
              const isCurrentlyActive = activeTheme === theme.id;
              const isThisProcessing = processingTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 bg-[#0C0C0E] shadow-sm transition-all duration-300 ${
                    isCurrentlyActive 
                      ? "border-zinc-700 ring-1 ring-zinc-800 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)]" 
                      : "border-zinc-800 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.4)]"
                  }`}
                >
                  {/* Dynamic Inline CSS Skeleton Card Asset */}
                  <div className="relative h-40 mb-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/10 group-hover:border-zinc-700/80 transition-all duration-500">
                    {renderThemeSkeleton(theme.id)}

                    {/* Uniform brand overlay design layout context */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none z-10" />

                    <div className="absolute bottom-3 left-3 z-20">
                      <p className="text-white text-[10px] font-bold font-mono tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                        {theme.name} Scheme
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors capitalize">
                        {theme.name.toLowerCase()} Theme
                      </h2>
                      {isCurrentlyActive && (
                        <span className="inline-flex items-center gap-1 rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                          <CheckCircle2 size={9} />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {theme.description && (
                      <p className="text-xs leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors line-clamp-2">
                        {theme.description}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-zinc-900/80 pt-3.5 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleActivate(theme.id)}
                      disabled={isCurrentlyActive || processingTheme !== null}
                      className={`w-full inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all focus:outline-none select-none ${
                        isCurrentlyActive
                          ? "bg-zinc-900 border border-zinc-800 text-zinc-400 cursor-not-allowed opacity-80"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 disabled:opacity-40"
                      }`}
                    >
                      {isThisProcessing ? (
                        <>
                          <Loader2 size={11} className="animate-spin" />
                          <span>Deploying Engine...</span>
                        </>
                      ) : isCurrentlyActive ? (
                        <span>Current Active Canvas</span>
                      ) : (
                        <>
                          <Sparkles size={11} className="text-zinc-600" />
                          <span>Activate Layout</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}