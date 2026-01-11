// Middleware for protecting routes
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const token = request.cookies.get('portfolio_session')?.value;

  console.log('🟡 Middleware:', { pathname, hasToken: !!token, tokenPreview: token?.substring(0, 10) });

  // Check if route requires authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      console.log('⚠️ No token found, redirecting to login');
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control for Admin routes
    if (pathname.startsWith('/admin')) {
      const isAdmin = token.endsWith(':admin');
      if (!isAdmin) {
        console.log('⛔ Non-admin user attempted to access admin route, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    console.log(`✅ Token found, allowing access to ${pathname}`);
    // If token exists, allow access (validation happens in API routes)
    return NextResponse.next();
  }

  // Allow access to login/register pages regardless of auth status
  // (client-side will handle redirects after successful auth)

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
