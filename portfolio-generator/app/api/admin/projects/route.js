import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch all projects with user info
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        p.ProjectID,
        p.UserID,
        p.Title,
        p.Description,
        p.ProjectURL,
        p.DateCompleted,
        u.Email as UserEmail,
        u.FullName as UserName
      FROM Projects p
      INNER JOIN Users u ON p.UserID = u.UserID
      ORDER BY p.DateCompleted DESC, p.ProjectID DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
