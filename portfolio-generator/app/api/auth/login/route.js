// API Route: /api/auth/login
// POST: Authenticate user and create session

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const result = await query(
      'SELECT UserID, FullName, Email, PasswordHash FROM Users WHERE Email = @email',
      { email }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const user = result.recordset[0];
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.PasswordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create session
    const token = createSession(user.UserID, user.Email, user.FullName);
    await setSessionCookie(token);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.UserID,
        fullName: user.FullName,
        email: user.Email,
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
