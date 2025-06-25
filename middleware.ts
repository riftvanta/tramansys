import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { hasValidTokenFormat, getTokenPayload } from '@/lib/auth-middleware';

// Supported locales
const locales = ['en', 'ar'];
const defaultLocale = 'en';

// Protected routes that require authentication (without locale prefix)
const protectedRoutes = ['/dashboard', '/admin', '/exchange', '/orders', '/profile'];

// Public routes that don't require authentication (without locale prefix)
const publicRoutes = ['/login', '/', '/about'];

// Admin-only routes (will be used in Phase 3)
// const adminRoutes = ['/admin'];

function getLocale(request: NextRequest): string {
  // Check if locale is already in the URL
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;
  
  // Try to detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const headers = { 'accept-language': acceptLanguage };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
  }
  
  return defaultLocale;
}

function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // If no locale in pathname, redirect to add locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
  
  // Get the pathname without locale for route checking
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if current route is protected (using pathname without locale)
  const isProtectedRoute = protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale);
  
  // If it's a public route, allow access
  if (isPublicRoute && !token) {
    return NextResponse.next();
  }
  
  // If accessing protected route without token, redirect to login with locale
  if (isProtectedRoute && !token) {
    const locale = getLocale(request);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token if present
  if (token) {
    const payload = getTokenPayload(token);
    
    // If token is invalid, clear cookie and redirect to login with locale
    if (!payload || !hasValidTokenFormat(token)) {
      const locale = getLocale(request);
      const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      response.cookies.delete('auth-token');
      return response;
    }
    
    // For Phase 2, we skip admin route checking since we can't validate JWT in middleware
    // This will be properly implemented in Phase 3 with API-based validation
    
    // If authenticated user tries to access login page, redirect to dashboard with locale
    if (pathnameWithoutLocale === '/login') {
      const locale = getLocale(request);
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
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