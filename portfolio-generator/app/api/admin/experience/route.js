import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch all experience entries with user info
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        e.ExpID,
        e.UserID,
        e.JobTitle,
        e.Company,
        e.StartDate,
        e.EndDate,
        u.Email as UserEmail,
        u.FullName as UserName
      FROM Experience e
      INNER JOIN Users u ON e.UserID = u.UserID
      ORDER BY e.StartDate DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}
