"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  User,
  Code,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  FileCheck,
  BookOpen,
  MessageSquare,
  Flame,
  Share2,
  Settings,
  PanelsTopLeft,
  LayoutGrid,
  Palette,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  BarChart3,
  Puzzle,
  Loader2,
  Menu,
  X,
} from "lucide-react";

type CustomSection = {
  id: string;
  title: string;
};

interface SidebarProps {
  customSections: CustomSection[];
}

export default function Sidebar({ customSections }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const username = session?.user?.username;

  const [activeTargetHref, setActiveTargetHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setActiveTargetHref(null);
    setMobileOpen(false);
  }, [pathname]);

  if (!username) return null;

  const iconMap: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
    profile: User,
    skills: Code,
    experience: Briefcase,
    education: GraduationCap,
    projects: FolderGit2,
    achievements: Award,
    certificates: FileCheck,
    publications: BookOpen,
    testimonials: MessageSquare,
    "open-source": Flame,
    "coding-profiles": LayoutGrid,
    "social-links": Share2,
    "custom-sections": Puzzle,
    "section-settings": PanelsTopLeft,
    themes: Palette,
    resume: FileText,
    messages: MessagesSquare,
    analytics: BarChart3,
    settings: Settings,
  };

  const portfolioSections = [
    { name: "Profile", href: "profile" },
    { name: "Skills", href: "skills" },
    { name: "Experience", href: "experience" },
    { name: "Education", href: "education" },
    { name: "Projects", href: "projects" },
    { name: "Achievements", href: "achievements" },
    { name: "Certifications", href: "certificates" },
    { name: "Publications", href: "publications" },
    { name: "Testimonials", href: "testimonials" },
    { name: "Open Source", href: "open-source" },
  ];

  const linksAndProfiles = [
    { name: "Coding Profiles", href: "coding-profiles" },
    { name: "Social Links", href: "social-links" },
  ];

  const portfolioCustomization = [
    { name: "Custom Sections", href: "custom-sections" },
    { name: "Section Settings", href: "section-settings" },
    { name: "Themes", href: "themes" },
  ];

  const documents = [{ name: "Resume", href: "resume" }];

  const management = [
    { name: "Messages", href: "messages" },
    { name: "Analytics", href: "analytics" },
    { name: "Settings", href: "settings" },
  ];

  const handleNavigationCoordination = (
    e: React.MouseEvent<HTMLAnchorElement>,
    fullPath: string
  ) => {
    if (activeTargetHref !== null) {
      e.preventDefault();
      return;
    }

    if (pathname === fullPath) {
      setMobileOpen(false);
      return;
    }

    setActiveTargetHref(fullPath);
  };

  const renderNavGroup = (title: string, items: { name: string; href: string }[]) => (
    <div className="space-y-1">
      <h3 className="px-3 mb-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-600">
        {title}
      </h3>
      <div className="space-y-0.5">
        {items.map((item) => {
          const fullPath = `/dashboard/${username}/${item.href}`;
          const isActive = pathname === fullPath;
          const isThisItemLoading = activeTargetHref === fullPath;
          const Icon = iconMap[item.href] || Puzzle;

          return (
            <Link
              key={item.href}
              href={fullPath}
              onClick={(e) => handleNavigationCoordination(e, fullPath)}
              className={`flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium font-sans transition-all duration-200 group/item active:scale-[0.99] ${
                isActive
                  ? "bg-[#1F1F1F] text-white font-semibold border border-white/5 shadow-sm"
                  : "text-zinc-400 hover:bg-[#111111] hover:text-white border border-transparent"
              } ${activeTargetHref !== null && !isActive ? "cursor-default select-none" : ""}`}
            >
              {isThisItemLoading ? (
                <Loader2 size={13} className="text-blue-400 animate-spin shrink-0" />
              ) : (
                <Icon
                  size={13}
                  className={`transition-colors duration-200 shrink-0 ${
                    isActive ? "text-blue-500" : "text-zinc-500 group-hover/item:text-zinc-300"
                  }`}
                />
              )}
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-11 h-11 bg-blue-600 border border-blue-500/20 rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform duration-200 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out"
        />
      )}

      <div
        className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? "w-64 max-w-[calc(100vw-3rem)]" : "w-0 lg:w-64"
        } ${activeTargetHref !== null ? "pointer-events-none opacity-90" : ""}`}
      >
        <aside
          className={`flex flex-col w-64 border-r border-white/[0.06] bg-[#0A0A0A] lg:bg-[#0A0A0A]/95 backdrop-blur-md h-full overflow-y-auto select-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[12px_4px_32px_rgba(0,0,0,0.8)] lg:shadow-none pt-4 shrink-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="px-5 pb-3.5 border-b border-white/[0.04] mb-4">
            <Link
              href={`/dashboard/${username}`}
              onClick={(e) => handleNavigationCoordination(e, `/dashboard/${username}`)}
              className="inline-flex items-center gap-2 font-bold text-xs tracking-tight text-zinc-400 hover:text-white transition-colors duration-200"
            >
              <div className="w-4 h-4 rounded bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 shrink-0">
                <LayoutDashboard size={9} />
              </div>
              <span className="font-mono uppercase tracking-wider text-[9px]">
                Workspace Engine
              </span>
            </Link>
          </div>

          <div className="px-3 pb-20 space-y-5">
            {renderNavGroup("Portfolio Content", portfolioSections)}
            {renderNavGroup("Customization", portfolioCustomization)}

            {customSections.length > 0 && (
              <div className="space-y-1">
                <h3 className="px-3 mb-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-600">
                  Your Custom Sections
                </h3>
                <div className="space-y-0.5">
                  {customSections.map((section) => {
                    const fullPath = `/dashboard/${username}/custom-sections/${section.id}`;
                    const isActive = pathname === fullPath;
                    const isThisItemLoading = activeTargetHref === fullPath;

                    return (
                      <Link
                        key={section.id}
                        href={fullPath}
                        onClick={(e) => handleNavigationCoordination(e, fullPath)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium font-sans transition-all duration-200 group/item active:scale-[0.99] ${
                          isActive
                            ? "bg-[#1F1F1F] text-blue-400 font-semibold border border-white/5 shadow-sm"
                            : "text-zinc-400 hover:bg-[#111111] hover:text-white border border-transparent"
                        } ${activeTargetHref !== null && !isActive ? "cursor-default select-none" : ""}`}
                      >
                        {isThisItemLoading ? (
                          <Loader2 size={13} className="text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <Puzzle
                            size={13}
                            className={`transition-colors duration-200 shrink-0 ${
                              isActive
                                ? "text-blue-400"
                                : "text-zinc-500 group-hover/item:text-zinc-300"
                            }`}
                          />
                        )}
                        <span className="truncate">{section.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {renderNavGroup("Links & Profiles", linksAndProfiles)}
            {renderNavGroup("Resume & Documents", documents)}
            {renderNavGroup("Management", management)}
          </div>
        </aside>
      </div>
    </>
  );
}
