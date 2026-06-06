import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <div className="flex flex-col gap-3">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/dashboard/profile">
          Profile
        </Link>

        <Link href="/dashboard/projects">
          Projects
        </Link>

        <Link href="/dashboard/skills">
          Skills
        </Link>

        <Link href="/dashboard/themes">
          Themes
        </Link>

        <Link href="/dashboard/settings">
          Settings
        </Link>
      </div>
    </aside>
  );
}