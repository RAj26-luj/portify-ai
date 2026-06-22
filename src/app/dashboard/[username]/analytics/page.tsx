"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Eye, 
  Download, 
  Mail, 
  MousePointerClick, 
  Loader2, 
  AlertTriangle, 
  RefreshCw,
  LayoutGrid,
  List,
  Info,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { getPortfolioStats } from "@/actions/analytics";

// Modified: Removed uniqueVisitors parameter completely
type Analytics = {
  totalViews: number;
  resumeDownloads: number;
  contactRequests: number;
  projectClicks: number;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function load(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const result = await getPortfolioStats("");

      if (result.success) {
        setAnalytics(result.data);
      } else {
        setAnalytics(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sync platform traffic metrics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[55vh] gap-3 bg-[#050505] border border-zinc-900 rounded-2xl select-none p-4 text-center">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-blue-500 z-10" />
          <div className="absolute h-7 w-7 sm:h-8 sm:w-8 border border-zinc-800 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-zinc-500 font-mono uppercase">
          Compiling data traffic graphs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl my-6 sm:my-12 rounded-xl border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-4 sm:p-5 shadow-2xl flex gap-3 items-start text-white font-sans">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">Analytics Sync Failure</h4>
          <p className="text-[11px] sm:text-xs text-red-400/90 leading-relaxed break-words">{error}</p>
          <button 
            onClick={() => load()}
            className="mt-1 inline-flex h-8 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white px-3.5 text-xs font-semibold transition-colors"
          >
            Retry Extraction Connection
          </button>
        </div>
      </div>
    );
  }

  // Modified: Unique visitors reference dropped out of structural zero conditions checks
  const hasNoTraffic = !analytics || (
    analytics.totalViews === 0 && 
    analytics.resumeDownloads === 0 && 
    analytics.contactRequests === 0 && 
    analytics.projectClicks === 0
  );

  if (hasNoTraffic) {
    return (
      <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
                <BarChart3 size={15} />
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Telemetry Analytics</h1>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
              Monitor real-time, privacy-focused interactions and engagement metrics mapped across your public profile vectors.
            </p>
          </div>
          <button
            type="button"
            disabled={refreshing}
            onClick={() => load(true)}
            className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-8 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-all select-none w-full sm:w-auto"
          >
            <RefreshCw size={12} className={`text-zinc-500 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/10 p-5 sm:p-12 text-center max-w-xl mx-auto my-4 sm:my-6 animate-fadeIn text-white font-sans w-full">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900 text-zinc-500 mb-3 sm:mb-4 shadow-inner">
            <TrendingUp size={18} className="text-blue-500" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200 tracking-tight">No traffic data logged yet</h3>
          <p className="text-[11px] sm:text-xs text-zinc-500 max-w-xs mt-1.5 leading-relaxed">
            The telemetry pipeline returned clean initialization metrics. Data aggregates populate dynamically in real-time as incoming professional interactions move across your public directory path.
          </p>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-left w-full space-y-2 sm:space-y-3 font-sans">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-zinc-300">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Instructions To Generate Telemetry Metrics:</span>
            </div>
            <ul className="text-[11px] sm:text-xs text-zinc-500 space-y-1.5 list-none pl-0.5">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-mono font-bold shrink-0">•</span>
                <span>Share your public portfolio hyperlink out with your professional circle, recruiters, or attach it onto resumes.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-mono font-bold shrink-0">•</span>
                <span>As external visitors load your page layouts, inspect projects, or trigger downloads, metrics record instantaneously.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="mt-5 inline-flex h-9 w-full sm:w-auto items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 px-4 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {refreshing ? <Loader2 size={12} className="animate-spin text-blue-500" /> : null}
            <span>Check Log Stream</span>
          </button>
        </div>
      </div>
    );
  }

  // Modified: Unique Visitors mapping entry deleted cleanly out of the tracking parameters stack
  const stats = [
    { 
      label: "Total Views", 
      value: analytics.totalViews, 
      icon: <Eye size={14} />, 
      color: "text-blue-400", 
      bg: "from-blue-500/10 to-transparent",
      desc: "Aggregated sum of overall hits recorded across all page modules."
    },
    { 
      label: "Resume Downloads", 
      value: analytics.resumeDownloads, 
      icon: <Download size={14} />, 
      color: "text-emerald-400", 
      bg: "from-emerald-500/10 to-transparent",
      desc: "Total file stream requests executed against the uploaded resume vault."
    },
    { 
      label: "Contact Requests", 
      value: analytics.contactRequests, 
      icon: <Mail size={14} />, 
      color: "text-amber-400", 
      bg: "from-amber-500/10 to-transparent",
      desc: "Inbound contact messages recorded inside your system Message Center."
    },
    { 
      label: "Project Clicks", 
      value: analytics.projectClicks, 
      icon: <MousePointerClick size={14} />, 
      color: "text-pink-400", 
      bg: "from-pink-500/10 to-transparent",
      desc: "Outbound hyperlink interactions dispatched to code repositories or live links."
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-[1440px] mx-auto font-sans antialiased px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* HEADER HUD CONFIGURATION PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm">
              <BarChart3 size={15} />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">Telemetry Analytics</h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-relaxed">
            Monitor real-time, privacy-focused interactions and engagement metrics mapped across your public profile vectors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-end shrink-0">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-zinc-500 w-full sm:w-auto justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex-1 sm:flex-none p-1.5 rounded-md transition-colors flex justify-center ${viewMode === "grid" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
              title="Grid View Metrics"
            >
              <LayoutGrid size={13} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none p-1.5 rounded-md transition-colors flex justify-center ${viewMode === "list" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "hover:text-zinc-300"}`}
              title="Compact Tabular List Row Map"
            >
              <List size={13} />
            </button>
          </div>

          <button
            type="button"
            disabled={refreshing}
            onClick={() => load(true)}
            className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-8 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-all select-none w-full sm:w-auto"
          >
            <RefreshCw size={12} className={`text-zinc-500 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC PRESENTATION INTERFACE ENGINE */}
      {viewMode === "grid" ? (
        <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((s) => (
            <div 
              key={s.label} 
              className="group/stat-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#0C0C0E] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-[1px]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-0 group-hover/stat-card:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="space-y-3 sm:space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-zinc-500 uppercase block font-mono">
                    {s.label}
                  </span>
                  
                  <div className={`flex h-6.5 w-6.5 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-zinc-800/80 bg-zinc-900/50 shadow-inner group-hover/stat-card:border-zinc-700 transition-colors ${s.color}`}>
                    {s.icon}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black font-mono tracking-tight text-white select-all">
                    {s.value.toLocaleString()}
                  </p>
                  <p className="text-[10px] sm:text-[11px] leading-relaxed text-zinc-500 font-medium font-sans">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#070709] shadow-sm animate-fadeIn w-full">
          <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-900 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-950/40">
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Metric Class Parameter</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Aggregated Count Log</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Telemetry Objective Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-[11px] sm:text-xs font-sans">
              {stats.map((s) => (
                <tr key={s.label} className="hover:bg-zinc-900/30 transition-colors group/row">
                  <td className="py-3 px-3 sm:px-4 font-bold text-zinc-200 group-hover/row:text-blue-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`shrink-0 scale-90 sm:scale-100 ${s.color}`}>{s.icon}</div>
                      <span className="truncate">{s.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-mono text-xs sm:text-sm font-bold text-white select-all">
                    {s.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-zinc-400 leading-relaxed text-[10px] sm:text-[11px]">
                    {s.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRIVACY AXIOM COMPLIANCE FOOTER HUD */}
      {/* Modified: True statement aligning precisely with zero storage of visitor hash identifiers */}
      <div className="rounded-xl border border-zinc-900/60 bg-zinc-950/20 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-zinc-500">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
          <span className="leading-snug">Privacy Architecture: GDPR & CCPA Compliant Tracker Data Node</span>
        </span>
        <span className="text-zinc-600 md:text-right leading-snug">No telemetry matches browser signatures, geo-coordinates, or device identifiers.</span>
      </div>

    </div>
  );
}