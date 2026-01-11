// API Route: /api/experience
// GET: List all experience for current user
// POST: Create new experience (with trigger validation)

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const result = await query(
      `SELECT ExpID, UserID, JobTitle, Company, StartDate, EndDate
       FROM Experience
       WHERE UserID = @userId
       ORDER BY StartDate DESC`,
      { userId: user.userId }
    );

    return NextResponse.json({ experience: result.recordset });

  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get experience error:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { jobTitle, company, startDate, endDate } = body;

    if (!jobTitle || !company || !startDate) {
      return NextResponse.json(
        { error: 'Job title, company, and start date are required' },
        { status: 400 }
      );
    }

    // Attempt to insert - trigger will validate dates
    const result = await query(
      `INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate)
       VALUES (@userId, @jobTitle, @company, @startDate, @endDate);
       
       SELECT * FROM Experience WHERE ExpID = SCOPE_IDENTITY();`,
      {
        userId: user.userId,
        jobTitle,
        company,
        startDate,
        endDate: endDate || null,
      }
    );

    return NextResponse.json({ experience: result.recordset[0] }, { status: 201 });

  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for trigger validation error
    if (error.message.includes('End Date cannot be before Start Date')) {
      return NextResponse.json(
        { error: 'End Date cannot be before Start Date' },
        { status: 400 }
      );
    }

    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
