// API Route: /api/profile
// GET: Get current user's profile
// PUT: Update current user's profile

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    
    const result = await query(
      'SELECT UserID, FullName, Email, Bio, JoinDate FROM Users WHERE UserID = @userId',
      { userId: user.userId }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ profile: result.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { fullName, bio } = body;
    
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    
    const result = await query(
      `UPDATE Users
       SET FullName = @fullName,
           Bio = @bio
       OUTPUT INSERTED.UserID, INSERTED.FullName, INSERTED.Email, INSERTED.Bio, INSERTED.JoinDate
       WHERE UserID = @userId`,
      {
        userId: user.userId,
        fullName,
        bio: bio || null,
      }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ profile: result.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
