import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getDefaultPathByRole(role?: string | null) {
  switch (role) {
    case "ADMIN":
      return "/administracion";
    case "CAJA":
      return "/caja/hamburguesas";
    case "COCINA":
      return "/cocina";
    default:
      return "/login";
  }
}

function isSupportedRole(role?: string | null) {
  return role === "ADMIN" || role === "CAJA" || role === "COCINA";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const hasSupportedRole = isSupportedRole(role);

  const isLoginRoute = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/administracion");
  const isCajaRoute = pathname.startsWith("/caja");
  const isCocinaRoute = pathname.startsWith("/cocina");
  const isProfileRoute = pathname.startsWith("/perfil");
  const isProtectedRoute =
    isAdminRoute || isCajaRoute || isCocinaRoute || isProfileRoute;

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && hasSupportedRole && isLoginRoute) {
    return NextResponse.redirect(new URL(getDefaultPathByRole(role), request.url));
  }

  if (token && !hasSupportedRole && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && role === "ADMIN" && (isCajaRoute || isCocinaRoute)) {
    return NextResponse.redirect(new URL("/administracion", request.url));
  }

  if (token && role === "CAJA" && (isAdminRoute || isCocinaRoute)) {
    return NextResponse.redirect(new URL("/caja/hamburguesas", request.url));
  }

  if (token && role === "COCINA" && (isAdminRoute || isCajaRoute)) {
    return NextResponse.redirect(new URL("/cocina", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/administracion/:path*", "/caja/:path*", "/cocina/:path*", "/perfil/:path*"],
};
