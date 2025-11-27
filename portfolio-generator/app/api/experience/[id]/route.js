// API Route: /api/experience/[id]
// GET: Get single experience
// PUT: Update experience (with trigger validation)
// DELETE: Delete experience

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM Experience WHERE ExpID = @id AND UserID = @userId`,
      { id: parseInt(id), userId: user.userId }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json({ experience: result.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get experience error:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { jobTitle, company, startDate, endDate } = body;
    
    if (!jobTitle || !company || !startDate) {
      return NextResponse.json(
        { error: 'Job title, company, and start date are required' },
        { status: 400 }
      );
    }
    
    // Attempt to update - trigger will validate dates
    const result = await query(
      `UPDATE Experience
       SET JobTitle = @jobTitle,
           Company = @company,
           StartDate = @startDate,
           EndDate = @endDate
       OUTPUT INSERTED.*
       WHERE ExpID = @id AND UserID = @userId`,
      {
        id: parseInt(id),
        userId: user.userId,
        jobTitle,
        company,
        startDate,
        endDate: endDate || null,
      }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json({ experience: result.recordset[0] });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check for trigger validation error
    if (error.message.includes('End Date cannot be before Start Date')) {
      return NextResponse.json(
        { error: 'End Date cannot be before Start Date' },
        { status: 400 }
      );
    }
    
    console.error('Update experience error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const result = await query(
      `DELETE FROM Experience
       OUTPUT DELETED.ExpID
       WHERE ExpID = @id AND UserID = @userId`,
      { id: parseInt(id), userId: user.userId }
    );
    
    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
