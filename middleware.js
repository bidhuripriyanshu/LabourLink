/**
 * Phase 2 — Route protection by role
 * /dashboard/labour/*  → LABOUR only
 * /dashboard/contractor/* → CONTRACTOR only
 * /admin/* → ADMIN only
 * Post-login redirect to role-specific dashboard
 */
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_PATHS = {
  LABOUR: "/dashboard/labour",
  CONTRACTOR: "/dashboard/contractor",
  ADMIN: "/admin",
};

const PUBLIC_PATHS = ["/", "/login", "/register", "/jobs", "/signup"];
const AUTH_PATHS = ["/login", "/register", "/signup"];

function isPublic(path) {
  if (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"))) return true;
  if (path.startsWith("/api/auth")) return true;
  if (path.startsWith("/#")) return true;
  return false;
}

function getRequiredRole(path) {
  if (path.startsWith("/dashboard/labour")) return "LABOUR";
  if (path.startsWith("/dashboard/contractor")) return "CONTRACTOR";
  if (path.startsWith("/admin")) return "ADMIN";
  if (path === "/dashboard" || path.startsWith("/dashboard/")) return "ANY"; // any authenticated user
  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    // Redirect logged-in users away from login/register to their dashboard
    if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token?.role && ROLE_PATHS[token.role]) {
        const url = request.nextUrl.clone();
        url.pathname = ROLE_PATHS[token.role];
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  const requiredRole = getRequiredRole(pathname);
  if (!requiredRole) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (requiredRole !== "ANY" && token.role !== requiredRole) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_PATHS[token.role] || "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
    "/signup",
  ],
};
