import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch all users with counts
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        u.UserID,
        u.FullName,
        u.Email,
        u.Bio,
        u.JoinDate,
        COUNT(DISTINCT p.ProjectID) as ProjectCount,
        COUNT(DISTINCT us.UserSkillID) as SkillCount
      FROM Users u
      LEFT JOIN Projects p ON u.UserID = p.UserID
      LEFT JOIN UserSkills us ON u.UserID = us.UserID
      GROUP BY u.UserID, u.FullName, u.Email, u.Bio, u.JoinDate
      ORDER BY u.JoinDate DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
