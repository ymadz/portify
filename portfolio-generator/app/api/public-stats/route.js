// API Route: /api/public-stats
// GET: Get public statistics for landing page (no auth required)

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Get basic public stats
    const statsResult = await query(
      `SELECT 
        (SELECT COUNT(*) FROM Users) AS TotalUsers,
        (SELECT COUNT(*) FROM Projects) AS TotalProjects,
        (SELECT COUNT(*) FROM SkillDefinitions) AS TotalSkills,
        (SELECT COUNT(*) FROM Experience) AS TotalExperience
      `
    );

    const stats = statsResult.recordset[0];

    return NextResponse.json({
      totalUsers: stats.TotalUsers,
      totalProjects: stats.TotalProjects,
      totalSkills: stats.TotalSkills,
      totalExperience: stats.TotalExperience,
    });

  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
