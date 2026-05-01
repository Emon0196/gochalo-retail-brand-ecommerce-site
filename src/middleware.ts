import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protect Customer Routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")) {
    if (!session) {
      // If going to checkout, they can technically be guest, but dashboard requires login
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  // Protect Wholesale Routes
  if (pathname.startsWith("/wholesale")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Unlocked to normal users as requested
  }

  // Protect Admin Routes (if added later)
  if (pathname.startsWith("/admin")) {
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/wholesale/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
