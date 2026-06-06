import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4">
      <Link href="/">
        Home
      </Link>

      <Link href="/dashboard">
        Dashboard
      </Link>

      <Link href="/admin">
        Admin
      </Link>
    </nav>
  );
}