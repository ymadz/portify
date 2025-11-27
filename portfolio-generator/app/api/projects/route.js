// API Route: /api/projects
// GET: List all projects for current user
// POST: Create new project

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    
    const result = await query(
      `SELECT ProjectID, UserID, Title, Description, ProjectURL, DateCompleted
       FROM Projects
       WHERE UserID = @userId
       ORDER BY DateCompleted DESC`,
      { userId: user.userId }
    );
    
    return NextResponse.json({ projects: result.recordset });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { title, description, projectURL, dateCompleted } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const result = await query(
      `INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted)
       OUTPUT INSERTED.*
       VALUES (@userId, @title, @description, @projectURL, @dateCompleted)`,
      {
        userId: user.userId,
        title,
        description: description || null,
        projectURL: projectURL || null,
        dateCompleted: dateCompleted || null,
      }
    );
    
    return NextResponse.json({ project: result.recordset[0] }, { status: 201 });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
