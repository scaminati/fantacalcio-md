import { NextRequest, NextResponse } from "next/server";
import { UserSession } from "./lib/session";

// 1. Specify protected and public routes
const protectedRoutes = ['/']
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {

    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Get user session
    const isAuthenticated = UserSession.isAuthenticated();
 
    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    
    // 5. Redirect to / if the user is authenticated
    if (
        isPublicRoute &&
        isAuthenticated &&
        !req.nextUrl.pathname.startsWith('/')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }


    return NextResponse.next();
}