import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req: NextRequest & { auth: any }) => {
  const pathname = req.nextUrl.pathname;
  const user = req.auth?.user;

  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    if (user.isBlocked) {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    if (user.status === "REJECTED") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.status !== "APPROVED"
    ) {
      return NextResponse.redirect(
        new URL(
          "/pending-approval",
          req.url
        )
      );
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    if (user.isBlocked) {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};