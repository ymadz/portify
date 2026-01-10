// API Route: /api/auth/me
// GET: Get current authenticated user

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'portfolio_session';

export async function GET() {
  try {
    // Get session token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // console.log('🔵 /api/auth/me - Token from cookie:', token ? token.substring(0, 10) + '...' : 'none');

    if (!token) {
      // console.log('❌ /api/auth/me - No token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = getSession(token);

    // console.log('🔵 /api/auth/me - Session from token:', session);

    if (!session) {
      // console.log('❌ /api/auth/me - No session found for token');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user role from database
    const result = await query(
      'SELECT Role FROM Users WHERE UserID = @userId',
      { userId: session.userId }
    );

    // console.log('🔵 /api/auth/me - Query result:', result.recordset);

    const role = result.recordset[0]?.Role || 'user';

    const response = {
      user: {
        id: session.userId,
        email: session.email,
        fullName: session.fullName,
        role: role
      }
    };

    // console.log('✅ /api/auth/me - Returning:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
