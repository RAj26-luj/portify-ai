import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard } from "lucide-react";

export default async function Navbar() {
  const session = await auth();

  const portfolio = session?.user
    ? await prisma.portfolio.findUnique({
        where: {
          userId: (session.user as any).id,
        },
        select: {
          isPublic: true,
        },
      })
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/[0.06] select-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          <Link
            href="/"
            className="font-bold text-base sm:text-lg tracking-tight text-white hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          >
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] shrink-0">
              P
            </div>
            <span className="tracking-tight whitespace-nowrap">Portify AI</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-150"
          >
            Home
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {session?.user ? (
            <>
              <span className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-500 font-mono">
                // authenticated:
                <span className="text-zinc-300 font-sans font-semibold truncate max-w-[120px]">
                  {session.user.name}
                </span>
                {portfolio?.isPublic ? (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-semibold text-[10px]">
                    PUBLIC
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-semibold text-[10px]">
                    PRIVATE
                  </span>
                )}
              </span>

              {!portfolio?.isPublic && (
                <span className="md:hidden flex px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono font-bold tracking-tight shrink-0 uppercase">
                  Priv
                </span>
              )}
              {portfolio?.isPublic && (
                <span className="md:hidden flex px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-mono font-bold tracking-tight shrink-0 uppercase">
                  Pub
                </span>
              )}

              <Link
                href={`/dashboard/${(session.user as any).username}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 sm:px-3.5 bg-[#111111] hover:bg-[#171717] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 hover:text-white rounded-lg border border-white/5 hover:border-white/10 shadow-sm transition-all duration-150 active:scale-[0.98] shrink-0"
              >
                <LayoutDashboard
                  size={12}
                  className="text-blue-400 shrink-0 sm:w-[13px] sm:h-[13px]"
                />
                <span>Dashboard</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-150 px-2 py-2 shrink-0"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-2.5 py-2 sm:px-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_16px_-4px_rgba(59,130,246,0.3)] border border-blue-400/10 active:scale-[0.98] shrink-0"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
