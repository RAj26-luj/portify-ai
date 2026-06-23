import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import SettingsForm from "@/components/forms/settings-form";
import { Settings, ShieldAlert, Info, ExternalLink, Lock, Globe, Eye } from "lucide-react";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const session = await auth();

  const { username } = await params;

  if (!session?.user || (session.user as any).username !== username) {
    return (
      <div className="p-3 sm:p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-[11px] sm:text-xs text-red-400 max-w-xl mx-auto my-6 sm:my-8 font-mono flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span>Unauthorized action context. Mismatch identified.</span>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: (session.user as any).id,
    },
    include: {
      portfolio: {
        select: {
          isPublic: true,
        },
      },
    },
  });

  if (!dbUser) {
    notFound();
  }

  const isPublic = dbUser.portfolio?.isPublic ?? false;
  const publicPortfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${username}`;

  return (
    <div className="space-y-4 sm:space-y-6 text-white max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 font-sans antialiased animate-fadeIn overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 shadow-sm shrink-0">
              <Settings size={14} className="sm:w-[15px] sm:h-[15px]" />
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-zinc-100">
              Global Account Settings
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-medium leading-normal">
            Manage your account configurations, profile visibility options, and endpoints.
          </p>
        </div>

        {dbUser.portfolio && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto border-t border-zinc-900/50 sm:border-t-0 pt-3 sm:pt-0">
            <a
              href={`/portfolio/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none inline-flex h-8.5 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 text-xs font-semibold transition-all select-none"
            >
              <span>View Portfolio</span>
              <ExternalLink size={12} className="text-zinc-500" />
            </a>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 rounded-xl border border-zinc-800 bg-[#0C0C0E] flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 w-full">
          <div
            className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${isPublic ? "bg-emerald-500/5 border border-emerald-500/10 text-emerald-400" : "bg-amber-500/5 border border-amber-500/10 text-amber-400"}`}
          >
            {isPublic ? (
              <Globe size={14} className="sm:w-[16px] sm:h-[16px]" />
            ) : (
              <Lock size={14} className="sm:w-[16px] sm:h-[16px]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <span>Portfolio Visibility:</span>
              <span className={isPublic ? "text-emerald-400" : "text-amber-400"}>
                {isPublic ? "Live & Published" : "Private Draft"}
              </span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 font-mono truncate mt-0.5">
              {publicPortfolioUrl}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 rounded-xl border border-zinc-900 bg-[#070709] space-y-3.5 shadow-md">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Eye size={14} className="text-blue-400 shrink-0" />
          <span>Security Routing & Privacy Encryption Protocols</span>
        </h3>

        <div className="text-[11px] sm:text-xs text-zinc-400 space-y-2.5 leading-relaxed font-sans">
          <p>
            When toggled live, your target platform identifier route (
            <span className="text-zinc-300 font-mono">{publicPortfolioUrl}</span>) is completely
            accessible to global search indexing bots, corporate parsers, and public traffic nodes.
          </p>

          <div className="p-3 rounded-lg bg-[#0E0E11] border border-white/5 flex flex-col xs:flex-row gap-2 items-start font-mono text-[10px] sm:text-[11px] text-zinc-500">
            <span className="text-blue-500 font-bold shrink-0">// STEALTH_PROTOCOL_AGREEMENT:</span>
            <span>
              Your partnership with Portify AI remains absolutely zero-knowledge. The platform
              injects no dynamic metadata badges, watermarks, or relational source tags onto your
              published theme. Outside vectors looking at your app will see an elite, hand-crafted
              web framework built completely by you.
            </span>
          </div>

          <p>
            For maximum operational tracking security, masking your custom address domain behind
            professional privacy-oriented cloaking pipelines is highly recommended. This wraps your
            target metrics in an encrypted presentation shell.
          </p>
        </div>

        <div className="pt-2 border-t border-zinc-900/60">
          <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Recommended Stealth Free Domain Cloakers:</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono text-[10px] sm:text-[11px]">
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900/60">
              <span className="text-zinc-300 font-bold block mb-0.5">1. Dub.co</span>
              <span className="text-zinc-600 leading-tight block">
                Open-source link infrastructure providing high-grade redirect analytics & completely
                custom meta tags.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900/60">
              <span className="text-zinc-300 font-bold block mb-0.5">2. TinyURL cloaking</span>
              <span className="text-zinc-600 leading-tight block">
                Standard programmatic redirection shielding that keeps your root server variables
                completely hidden from query parameters.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900/60">
              <span className="text-zinc-300 font-bold block mb-0.5">3. Bitly Stealth alias</span>
              <span className="text-zinc-600 leading-tight block">
                Deploys quick structural target link overlays to completely obscure downstream
                platform host vectors.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/10 bg-gradient-to-r from-red-500/[0.01] to-transparent p-3 sm:p-4 flex gap-2.5 sm:gap-3.5 items-start">
        <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1 sm:space-y-2 text-[11px] sm:text-xs flex-1">
          <p className="font-bold tracking-wide text-red-400 uppercase font-mono text-[9px] sm:text-[10px]">
            Destructive System Warnings:
          </p>
          <div className="text-zinc-400 space-y-1 sm:space-y-1.5 leading-relaxed font-sans hidden sm:block">
            <p>
              • <strong className="text-zinc-200">Visibility Mutability:</strong> Flipping your
              portfolio toggle option to Private cleanly drops outside ingress routing. Public
              visitors or recruiter indexing bots will receive standardized system errors until
              flipped back.
            </p>
            <p>
              • <strong className="text-zinc-200">Permanent Database Deletion Pipeline:</strong>{" "}
              Executing account purge sequences drops all nested information parameters permanently
              from the database clusters. Relational data arrays, parsed resume logs, theme
              assignments, and message logs are cleanly deleted.{" "}
              <span className="text-red-400 font-medium">
                This sequence is completely non-reversible.
              </span>
            </p>
            <p>
              • <strong className="text-zinc-200">Continuous Delivery Pipeline:</strong> Changes
              saved to fields or credential parameters execute instantly. Your published theme layer
              reflects changes immediately without needing manual compilation loops.
            </p>
          </div>
          <div className="text-zinc-400 leading-normal font-sans sm:hidden space-y-1.5">
            <p>• Private mode suspends outside traffic visibility nodes.</p>
            <p>
              • Account purging sequence deletes information arrays permanently from the database
              clusters. Relational logs and configurations are completely non-reversible once
              triggered.
            </p>
            <p>• Portfolio updates execute immediately without manual compilation delay cycles.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-3 flex gap-2 items-start">
        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-normal font-sans">
          Authentication updates rely on securely signed active sessions. Updating endpoint
          parameters triggers relational database restructuring instantly.
        </p>
      </div>

      <div className="bg-[#09090B] border border-zinc-900 rounded-xl p-3 sm:p-6 shadow-sm">
        <SettingsForm userId={dbUser.id} username={username} initialIsPublic={isPublic} />
      </div>
    </div>
  );
}
