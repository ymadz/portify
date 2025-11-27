// API Route: /api/auth/register
// POST: Register a new user

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password, bio } = body;
    
    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await query(
      'SELECT UserID FROM Users WHERE Email = @email',
      { email }
    );
    
    if (existingUser.recordset.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Insert new user
    const result = await query(
      `INSERT INTO Users (FullName, Email, PasswordHash, Bio)
       OUTPUT INSERTED.UserID, INSERTED.FullName, INSERTED.Email
       VALUES (@fullName, @email, @passwordHash, @bio)`,
      { 
        fullName, 
        email, 
        passwordHash, 
        bio: bio || null 
      }
    );
    
    const newUser = result.recordset[0];
    
    // Create session
    const token = createSession(newUser.UserID, newUser.Email, newUser.FullName);
    await setSessionCookie(token);
    
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.UserID,
        fullName: newUser.FullName,
        email: newUser.Email,
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
