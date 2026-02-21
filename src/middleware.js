import { NextResponse } from 'next/server';

/**
 * Middleware for route protection.
 *
 * Firebase Auth uses client-side session tokens (IndexedDB), which aren't
 * directly readable in Next.js middleware (Edge Runtime). The clean pattern
 * is to use a lightweight session cookie set by a server action after login,
 * and verify that here.
 *
 * For now this middleware reads a `__session` cookie that we set on the client
 * after successful Firebase sign-in (see src/lib/session.js). The cookie
 * contains the Firebase ID token, which we verify against Firebase's public
 * keys using the firebase-admin SDK in a Route Handler.
 *
 * Route map:
 *   /           → public (landing/login)
 *   /admin/*    → admin | dev | employee only
 *   /tester/*   → any authenticated user
 *   /onboarding → any authenticated user (display name picker etc.)
 *   /privacy    → public
 *   /terms      → public
 *   /help       → public
 */

// Routes that require authentication at all
const PROTECTED = ['/admin', '/tester', '/onboarding'];

// Routes that require elevated roles (admin, dev, employee)
const ADMIN_ONLY = ['/admin'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this path needs protection
  const needsAuth  = PROTECTED.some(p  => pathname.startsWith(p));
  const needsAdmin = ADMIN_ONLY.some(p => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  // Read the session cookie (set by src/lib/session.js after login)
  const session = request.cookies.get('__session')?.value;

  if (!session) {
    // No session → redirect to landing
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // For admin routes, we also check the role cookie (set alongside __session)
  // Full token verification happens in the Route Handler / Server Component
  if (needsAdmin) {
    const role = request.cookies.get('__role')?.value;
    const elevatedRoles = ['admin', 'dev', 'employee'];
    if (!role || !elevatedRoles.includes(role)) {
      // Authenticated but wrong role → send to tester dash
      const url = request.nextUrl.clone();
      url.pathname = '/tester';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
