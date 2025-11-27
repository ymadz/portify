// API Route: /api/skills
// GET: List all skills for current user
// POST: Add skill to user

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    
    const result = await query(
      `SELECT us.UserSkillID, us.ProficiencyLevel,
              sd.SkillDefID, sd.SkillName, sd.Category
       FROM UserSkills us
       INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
       WHERE us.UserID = @userId
       ORDER BY us.ProficiencyLevel DESC, sd.SkillName`,
      { userId: user.userId }
    );
    
    return NextResponse.json({ skills: result.recordset });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get skills error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { skillDefID, proficiencyLevel } = body;
    
    if (!skillDefID || !proficiencyLevel) {
      return NextResponse.json(
        { error: 'Skill and proficiency level are required' },
        { status: 400 }
      );
    }
    
    if (proficiencyLevel < 1 || proficiencyLevel > 10) {
      return NextResponse.json(
        { error: 'Proficiency level must be between 1 and 10' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel)
       OUTPUT INSERTED.UserSkillID, INSERTED.SkillDefID, INSERTED.ProficiencyLevel
       VALUES (@userId, @skillDefID, @proficiencyLevel)`,
      {
        userId: user.userId,
        skillDefID: parseInt(skillDefID),
        proficiencyLevel: parseInt(proficiencyLevel),
      }
    );
    
    // Get complete skill info
    const skillInfo = await query(
      `SELECT us.UserSkillID, us.ProficiencyLevel,
              sd.SkillDefID, sd.SkillName, sd.Category
       FROM UserSkills us
       INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
       WHERE us.UserSkillID = @userSkillID`,
      { userSkillID: result.recordset[0].UserSkillID }
    );
    
    return NextResponse.json({ skill: skillInfo.recordset[0] }, { status: 201 });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check for duplicate skill
    if (error.message.includes('UQ_UserSkill') || error.message.includes('UNIQUE')) {
      return NextResponse.json(
        { error: 'You already have this skill' },
        { status: 409 }
      );
    }
    
    console.error('Add skill error:', error);
    return NextResponse.json({ error: 'Failed to add skill' }, { status: 500 });
  }
}
