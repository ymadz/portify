// API Route: /api/skills/[id]
// PUT: Update skill proficiency
// DELETE: Remove skill from user

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { proficiencyLevel } = body;
    
    if (!proficiencyLevel) {
      return NextResponse.json(
        { error: 'Proficiency level is required' },
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
      `UPDATE UserSkills
       SET ProficiencyLevel = @proficiencyLevel
       OUTPUT INSERTED.*
       WHERE UserSkillID = @id AND UserID = @userId`,
      {
        id: parseInt(id),
        userId: user.userId,
        proficiencyLevel: parseInt(proficiencyLevel),
      }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    // Get complete skill info
    const skillInfo = await query(
      `SELECT us.UserSkillID, us.ProficiencyLevel,
              sd.SkillDefID, sd.SkillName, sd.Category
       FROM UserSkills us
       INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
       WHERE us.UserSkillID = @id`,
      { id: parseInt(id) }
    );
    
    return NextResponse.json({ skill: skillInfo.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update skill error:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const result = await query(
      `DELETE FROM UserSkills
       OUTPUT DELETED.UserSkillID
       WHERE UserSkillID = @id AND UserID = @userId`,
      { id: parseInt(id), userId: user.userId }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete skill error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
