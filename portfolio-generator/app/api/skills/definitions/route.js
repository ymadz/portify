// API Route: /api/skills/definitions
// GET: Get all available skill definitions for autocomplete/selection

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    let sqlQuery = 'SELECT SkillDefID, SkillName, Category FROM SkillDefinitions WHERE 1=1';
    const params = {};
    
    if (search) {
      sqlQuery += ' AND SkillName LIKE @search';
      params.search = `%${search}%`;
    }
    
    if (category) {
      sqlQuery += ' AND Category = @category';
      params.category = category;
    }
    
    sqlQuery += ' ORDER BY SkillName';
    
    const result = await query(sqlQuery, params);
    
    return NextResponse.json(result.recordset);
    
  } catch (error) {
    console.error('Get skill definitions error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

// POST: Create new skill definition
export async function POST(request) {
  try {
    const body = await request.json();
    const { skillName, category } = body;

    const result = await query(
      'INSERT INTO SkillDefinitions (SkillName, Category) OUTPUT INSERTED.* VALUES (@skillName, @category)',
      {
        skillName: { value: skillName, type: 'NVarChar' },
        category: { value: category, type: 'NVarChar' }
      }
    );

    return NextResponse.json(result.recordset[0], { status: 201 });
  } catch (error) {
    console.error('Error creating skill definition:', error);
    return NextResponse.json({ error: 'Failed to create skill definition' }, { status: 500 });
  }
}
