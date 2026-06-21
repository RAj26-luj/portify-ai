import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, ClipboardCheck, LayoutDashboard, Menu, Terminal, ChevronRight } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as any;

  if (!session?.user) {
    redirect("/login");
  }

  if (user?.isBlocked) {
    redirect("/unauthorized");
  }

  if (user?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const navLinks = [
    { name: "Metrics Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Approval Queue", href: "/admin/approvals", icon: ClipboardCheck },
    { name: "Users Registry", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-300 flex flex-col md:flex-row antialiased relative overflow-hidden">
      
      {/* BACKGROUND VECTOR ENGINE */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0" />

      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0C0C0E]/95 backdrop-blur-md border-b border-white/[0.05] relative z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Shield size={14} />
          </div>
          <span className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Admin</span>
        </div>
        <div className="text-[9px] font-mono bg-zinc-900 px-2 py-1 rounded border border-white/5 text-zinc-400 uppercase">Root Node</div>
      </header>

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 shrink-0 bg-[#0C0C0E]/50 border-r border-white/[0.05] p-4 md:p-6 flex flex-col justify-between z-30">
        <div className="space-y-8">
          {/* Identity Cluster */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-white tracking-tight">Console Core</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Authenticated</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-hidden pb-2 md:pb-0 scrollbar-hide">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-white/[0.03] transition-all whitespace-nowrap"
                >
                  <Icon size={14} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="hidden md:flex pt-6 border-t border-white/[0.03] items-center justify-between text-[10px] font-mono text-zinc-600">
          <span className="truncate">{user?.name || "Operator"}</span>
          <Terminal size={11} />
        </div>
      </aside>

      {/* WORKSPACE */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>

    </div>
  );
}