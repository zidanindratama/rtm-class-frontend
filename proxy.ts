import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ROLE_KEY } from "@/routes/auth-keys";
import { canAccessDashboardPath, resolveDashboardHome } from "@/routes/dashboard-routes";

const AUTH_PREFIX = "/auth";
const DASHBOARD_PREFIX = "/dashboard";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get(ACCESS_TOKEN_KEY)?.value);
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_KEY)?.value);
  const isAuthenticated = hasAccessToken || hasRefreshToken;
  const role = request.cookies.get(USER_ROLE_KEY)?.value;

  if (pathname.startsWith(DASHBOARD_PREFIX) && !isAuthenticated) {
    const redirectUrl = new URL("/auth/sign-in", request.url);
    if (pathname !== "/dashboard" || search) {
      redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/dashboard" && isAuthenticated) {
    const dashboardHome = resolveDashboardHome(role);
    if (dashboardHome !== "/dashboard") {
      return NextResponse.redirect(new URL(dashboardHome, request.url));
    }
  }

  if (pathname.startsWith(DASHBOARD_PREFIX) && isAuthenticated) {
    const canAccess = canAccessDashboardPath(pathname, role);
    if (!canAccess) {
      return NextResponse.redirect(new URL("/util-pages/access-denied", request.url));
    }
  }

  if (pathname.startsWith(AUTH_PREFIX) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
