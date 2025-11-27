// API Route: /api/projects/[id]
// GET: Get single project
// PUT: Update project
// DELETE: Delete project

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM Projects WHERE ProjectID = @id AND UserID = @userId`,
      { id: parseInt(id), userId: user.userId }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project: result.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { title, description, projectURL, dateCompleted } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const result = await query(
      `UPDATE Projects
       SET Title = @title,
           Description = @description,
           ProjectURL = @projectURL,
           DateCompleted = @dateCompleted
       OUTPUT INSERTED.*
       WHERE ProjectID = @id AND UserID = @userId`,
      {
        id: parseInt(id),
        userId: user.userId,
        title,
        description: description || null,
        projectURL: projectURL || null,
        dateCompleted: dateCompleted || null,
      }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project: result.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const result = await query(
      `DELETE FROM Projects
       OUTPUT DELETED.ProjectID
       WHERE ProjectID = @id AND UserID = @userId`,
      { id: parseInt(id), userId: user.userId }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
