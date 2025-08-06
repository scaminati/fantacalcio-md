import { NextRequest, NextResponse } from "next/server";

import { isAuthenticated } from "./lib/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get is authenticated
  const isAuth = await isAuthenticated();

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to / if the user is authenticated
  if (isPublicRoute && isAuth && req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
