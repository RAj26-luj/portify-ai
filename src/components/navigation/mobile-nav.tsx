"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function MobileNav() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-4 text-sm">
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
          className="text-left hover:opacity-70"
        >
          Logout
        </button>
      ) : (
        <>
          <Link href="/login" className="hover:opacity-70">
            Login
          </Link>

          <Link href="/register" className="hover:opacity-70">
            Register
          </Link>
        </>
      )}
    </div>
  );
}