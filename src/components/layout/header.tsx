import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-xl font-bold">
            Portify AI
          </h1>
        </Link>

        <nav className="flex gap-4">
          <Link href="/">
            Home
          </Link>

          <Link href="/dashboard">
            Dashboard
          </Link>

          <Link href="/login">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}