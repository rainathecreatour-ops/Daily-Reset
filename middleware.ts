import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals + audio files + access + API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/audio") ||
    pathname.startsWith("/api/license") ||
    pathname.startsWith("/api/logout") ||
    pathname === "/access" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Gate everything else
  const session = req.cookies.get("daily_reset_session")?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/access";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
