// API Route: /api/experts
// GET: Find expert users with specific skill (using subquery)

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillName = searchParams.get('skill');
    const minProficiency = parseInt(searchParams.get('minProficiency') || '8');
    
    if (!skillName) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }
    
    // Complex query with subquery to find experts
    const result = await query(
      `SELECT DISTINCT
        u.UserID,
        u.FullName,
        u.Email,
        u.Bio,
        us.ProficiencyLevel,
        (SELECT COUNT(*) FROM Projects WHERE UserID = u.UserID) AS ProjectCount
       FROM Users u
       INNER JOIN UserSkills us ON u.UserID = us.UserID
       WHERE us.SkillDefID IN (
         SELECT SkillDefID 
         FROM SkillDefinitions 
         WHERE SkillName LIKE @skillName
       )
       AND us.ProficiencyLevel >= @minProficiency
       ORDER BY us.ProficiencyLevel DESC, ProjectCount DESC`,
      {
        skillName: `%${skillName}%`,
        minProficiency,
      }
    );
    
    return NextResponse.json({
      experts: result.recordset,
      searchCriteria: {
        skill: skillName,
        minProficiency,
      },
    });
    
  } catch (error) {
    console.error('Find experts error:', error);
    return NextResponse.json({ error: 'Failed to find experts' }, { status: 500 });
  }
}
