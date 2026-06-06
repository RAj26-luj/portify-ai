"use client";

import Link from "next/link";

export default function MobileNav() {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/">
        Home
      </Link>

      <Link href="/dashboard">
        Dashboard
      </Link>

      <Link href="/admin">
        Admin
      </Link>
    </div>
  );
}