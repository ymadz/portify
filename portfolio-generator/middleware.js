// Middleware for protecting routes
import { NextResponse } from 'next/server';
import { getSession } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get session token from cookies
  const token = request.cookies.get('portfolio_session')?.value;
  
  // Check if route requires authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate session
    const session = getSession(token);
    if (!session) {
      // Session expired or invalid
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If accessing login/register while authenticated, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    const session = getSession(token);
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
