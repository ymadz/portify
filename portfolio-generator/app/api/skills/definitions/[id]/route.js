import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT: Update skill definition
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { skillName, category } = body;
    const skillDefId = params.id;

    await query(
      'UPDATE SkillDefinitions SET SkillName = @skillName, Category = @category WHERE SkillDefID = @skillDefId',
      {
        skillName: { value: skillName, type: 'NVarChar' },
        category: { value: category, type: 'NVarChar' },
        skillDefId: { value: skillDefId, type: 'Int' }
      }
    );

    return NextResponse.json({ message: 'Skill definition updated successfully' });
  } catch (error) {
    console.error('Error updating skill definition:', error);
    return NextResponse.json({ error: 'Failed to update skill definition' }, { status: 500 });
  }
}

// DELETE: Remove skill definition
export async function DELETE(request, { params }) {
  try {
    const skillDefId = params.id;

    await query('DELETE FROM SkillDefinitions WHERE SkillDefID = @skillDefId', {
      skillDefId: { value: skillDefId, type: 'Int' }
    });

    return NextResponse.json({ message: 'Skill definition deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill definition:', error);
    return NextResponse.json({ error: 'Failed to delete skill definition' }, { status: 500 });
  }
}
