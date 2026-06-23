"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { loadDashboard } from "@/actions/dashboard";

import {
  Eye,
  MessagesSquare,
  Activity,
  Loader2,
  AlertCircle,
  Inbox,
  Upload,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Briefcase,
  Layers,
} from "lucide-react";

type DashboardData = {
  user: {
    name?: string;
    email?: string;
  } | null;

  analytics: {
    totalViews?: number;
    contactRequests?: number;
  } | null;

  unreadMessages: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  const username = typeof params?.username === "string" ? params.username : "";
  const sessionUsername = (session?.user as { username?: string })?.username ?? "";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (sessionUsername && username && sessionUsername !== username) {
      router.replace(`/dashboard/${sessionUsername}`);
    }
  }, [status, sessionUsername, username, router]);

  useEffect(() => {
    const run = async () => {
      try {
        if (!username) {
          return;
        }

        setLoading(true);
        setError(null);

        const result = await loadDashboard(username);

        if (!result || !result.success) {
          throw new Error(result?.error || "Failed to load dashboard parameters metrics cleanly.");
        }

        setData(result.data as DashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Dashboard error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [username]);

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 font-mono text-xs gap-3 px-4 text-center">
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        <span>COMPILING_METRIC_STREAM...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3 text-xs font-mono text-red-400 max-w-2xl">
        <AlertCircle size={16} className="shrink-0" />
        <span>Exception: {error}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 font-mono text-xs gap-2 px-4 text-center">
        <Inbox className="w-5 h-5 text-zinc-600" />
        <span>DATASET_EMPTY // NO_RECORDS_FOUND</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-10 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto select-none text-white antialiased">
      <div className="border-b border-zinc-900 pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 relative">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-500/5 border border-blue-500/10 w-fit mb-0.5 sm:mb-1">
            <Activity size={10} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase text-blue-400">
              Live Workspace Overview
            </span>
          </div>

          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
            Welcome back, {data.user?.name ?? "User"}
          </h1>

          <p className="text-[11px] sm:text-xs font-mono text-zinc-500 truncate max-w-xs sm:max-w-none">
            // account_node:{" "}
            <span className="text-zinc-400 underline decoration-white/10">{data.user?.email}</span>
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-blue-500/20 bg-[#070A14] bg-gradient-to-br from-blue-950/20 via-[#0C0C0E] to-[#0C0C0E] p-4 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-80" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-8 relative z-10">
          <div className="space-y-2 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 w-fit">
              <Sparkles size={10} className="animate-pulse" />
              <span>Highly Recommended Workflow</span>
            </div>

            <h2 className="text-lg sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Upload Resume or Build Manually
            </h2>

            <p className="text-[11px] sm:text-sm text-zinc-400 leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
              Drop your existing PDF resume inside our smart parsing engine to automate section
              mapping instantly. The platform extracts core profiles, skills, projects, and
              experiences directly, creating an absolute foundation you can tweak, scale, or expand
              manually.
            </p>

            <div className="flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[10px] sm:text-[11px] font-mono text-zinc-500 border-t border-zinc-900 hidden sm:flex">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-blue-400" /> Auto-extract Skills
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-purple-400" /> Parse Showcases
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" /> Preserve Edits
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-72 mt-1 sm:mt-2 lg:mt-0">
            <button
              onClick={() => router.push(`/dashboard/${username}/resume`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2.5 sm:py-3.5 text-[11px] sm:text-xs font-black shadow-md transition-all active:scale-[0.99] group/btn select-none"
            >
              <Upload size={13} className="text-zinc-700" />
              <span>Launch Resume Engine</span>
              <ArrowRight
                size={12}
                className="text-zinc-400 transition-transform group-hover/btn:translate-x-0.5"
              />
            </button>

            <button
              onClick={() => router.push(`/dashboard/${username}/profile`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 px-4 py-2.5 sm:py-3.5 text-[11px] sm:text-xs font-bold transition-all select-none"
            >
              <PlusCircle size={13} className="text-zinc-500" />
              <span>Populate Manually</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={12} className="text-zinc-500" />
          <h3 className="text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-mono">
            Platform Engagement Streams
          </h3>
        </div>

        <div className="block sm:hidden space-y-1.5">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0C0C0E] border border-zinc-900">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Eye size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Views
                </p>
                <p className="text-[9px] font-mono text-zinc-500">Total platform impressions</p>
              </div>
            </div>
            <span className="text-base font-black font-mono text-white shrink-0">
              {(data.analytics?.totalViews ?? 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0C0C0E] border border-zinc-900">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <MessagesSquare size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Requests
                </p>
                <p className="text-[9px] font-mono text-zinc-500">Total inbound inquiries</p>
              </div>
            </div>
            <span className="text-base font-black font-mono text-white shrink-0">
              {(data.analytics?.contactRequests ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="hidden sm:grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <div className="group relative rounded-xl bg-[#0C0C0E] border border-zinc-900 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors duration-150">
                Portfolio Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner group-hover:border-blue-500/20 transition-colors duration-150">
                <Eye size={14} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors duration-150 font-mono">
                {(data.analytics?.totalViews ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                Impressions
              </span>
            </div>
          </div>

          <div className="group relative rounded-xl bg-[#0C0C0E] border border-zinc-900 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors duration-150">
                Contact Requests
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner group-hover:border-emerald-500/20 transition-colors duration-150">
                <MessagesSquare size={14} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-150 font-mono">
                {(data.analytics?.contactRequests ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                Inquiries
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase size={12} className="text-zinc-500" />
          <h3 className="text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-mono">
            Relational Workspace Actions
          </h3>
        </div>

        <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <button
            onClick={() => router.push(`/dashboard/${username}/messages`)}
            className="group rounded-lg sm:rounded-xl bg-[#0C0C0E] border border-zinc-900 p-3 sm:p-5 text-left hover:border-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between gap-3 sm:gap-4 w-full"
          >
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors text-[11px] sm:text-sm truncate">
                  Message Center Hub
                </h4>

                {(data.unreadMessages ?? 0) > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[8px] sm:text-[10px] font-mono font-bold shrink-0">
                    {data.unreadMessages}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-500 truncate font-sans">
                Review visitor submissions and network requests
              </p>
            </div>

            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shrink-0">
              <MessagesSquare size={13} className="sm:w-4 sm:h-4" />
            </div>
          </button>

          <button
            onClick={() => router.push(`/dashboard/${username}/analytics`)}
            className="group rounded-lg sm:rounded-xl bg-[#0C0C0E] border border-zinc-900 p-3 sm:p-5 text-left hover:border-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between gap-3 sm:gap-4 w-full"
          >
            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors text-[11px] sm:text-sm truncate">
                Advanced Telemetry Specs
              </h4>
              <p className="text-[10px] sm:text-xs text-zinc-500 truncate font-sans">
                Inspect unique user click maps and resume metrics
              </p>
            </div>

            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10 shrink-0">
              <Activity size={13} className="sm:w-4 sm:h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
