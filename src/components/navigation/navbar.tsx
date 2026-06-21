"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center gap-5 text-sm">
      <Link href="/" className="hover:opacity-70">
        Home
      </Link>

      <Link href="/dashboard" className="hover:opacity-70">
        Dashboard
      </Link>

      {session?.user?.role === "ADMIN" && (
        <Link href="/admin" className="hover:opacity-70">
          Admin
        </Link>
      )}

      {session?.user ? (
        <button
          onClick={() => signOut()}
          className="hover:opacity-70"
        >
          Logout
        </button>
      ) : (
        <Link href="/login" className="hover:opacity-70">
          Login
        </Link>
      )}
    </nav>
  );
}