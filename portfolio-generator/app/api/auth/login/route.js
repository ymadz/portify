// API Route: /api/auth/login
// POST: Authenticate user and create session

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

const SESSION_COOKIE_NAME = 'portfolio_session';

export async function POST(request) {
  try {
    console.log('🟢 Login API called');
    const body = await request.json();
    const { email, password } = body;
    console.log('🟢 Login attempt for:', email);
    
    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    console.log('🟢 Querying database for user...');
    const result = await query(
      'SELECT UserID, FullName, Email, PasswordHash, Role FROM Users WHERE Email = @email',
      { email }
    );
    
    if (result.recordset.length === 0) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const user = result.recordset[0];
    console.log('🟢 User found:', { id: user.UserID, name: user.FullName, role: user.Role });
    
    // Verify password
    console.log('🟢 Verifying password...');
    const isValidPassword = await verifyPassword(password, user.PasswordHash);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('✅ Password verified');
    
    // Create session and set cookie
    console.log('🟢 Creating session...');
    const token = createSession(user.UserID, user.Email, user.FullName);
    console.log('🟢 Session token created:', token.substring(0, 10) + '...');
    
    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        role: user.Role || 'user'
      },
      redirectTo: user.Role === 'admin' ? '/dashboard/admin' : '/dashboard',
    });
    
    // Set session cookie on response
    console.log('🟢 Setting session cookie...');
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/',
    });
    
    console.log('✅ Login successful, returning response');
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
