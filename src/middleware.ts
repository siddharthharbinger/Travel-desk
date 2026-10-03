import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "traveldesk-super-secret-key-at-least-32-chars-long-2026"
);

const SESSION_COOKIE_NAME = "traveldesk_session";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "CSR" | "ADMIN";
  mustChangePassword?: boolean;
  lastActive: number;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and API auth routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/demo-login") ||
    pathname.startsWith("/api/auth/logout")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let session: JWTPayload | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const s = payload as unknown as JWTPayload;
      const now = Date.now();
      if (!s.lastActive || now - s.lastActive <= IDLE_TIMEOUT_MS) {
        session = s;
      }
    } catch {
      session = null;
    }
  }

  // 1. If user is logged in and visits /login, redirect to their home
  if (pathname === "/login" && session) {
    if (session.mustChangePassword) {
      return NextResponse.redirect(new URL("/change-password", request.url));
    }
    const dest = session.role === "CSR" || session.role === "ADMIN" ? "/review" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // 2. Forced password change rule
  if (session?.mustChangePassword) {
    const allowedForPasswordChange = [
      "/change-password",
      "/api/auth/change-password",
      "/api/auth/logout",
    ];
    const isAllowed = allowedForPasswordChange.some((p) => pathname.startsWith(p));
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/change-password", request.url));
    }
    return NextResponse.next();
  }

  // 3. Protected route definitions
  const isAuthRequired =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/change-password");

  if (isAuthRequired && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role restrictions
  if (pathname.startsWith("/review")) {
    if (session?.role !== "CSR" && session?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (session?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
