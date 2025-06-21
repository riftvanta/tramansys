import { NextRequest, NextResponse } from 'next/server';
import { hasValidTokenFormat, getTokenPayload } from '@/lib/auth-middleware';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/admin', '/exchange', '/orders', '/profile'];

// Public routes that don't require authentication
const publicRoutes = ['/login', '/', '/about'];

// Admin-only routes (will be used in Phase 3)
// const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // If it's a public route, allow access
  if (isPublicRoute && !token) {
    return NextResponse.next();
  }
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token if present
  if (token) {
    const payload = getTokenPayload(token);
    
    // If token is invalid, clear cookie and redirect to login
    if (!payload || !hasValidTokenFormat(token)) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
    
    // For Phase 2, we skip admin route checking since we can't validate JWT in middleware
    // This will be properly implemented in Phase 3 with API-based validation
    
    // If authenticated user tries to access login page, redirect to dashboard
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Add user info to request headers for server components
    const requestHeaders = new Headers(request.headers);
    if (payload.userId) requestHeaders.set('x-user-id', payload.userId);
    if (payload.role) requestHeaders.set('x-user-role', payload.role);
    if (payload.username) requestHeaders.set('x-username', payload.username);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|apple-touch-icon\\.png).*)',
  ],
}; 