// API Route: /api/auth/logout
// POST: Logout user and clear session

import { NextResponse } from 'next/server';
import { getCurrentUser, deleteSession, clearSessionCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('portfolio_session')?.value;
    
    if (token) {
      deleteSession(token);
    }
    
    await clearSessionCookie();
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
