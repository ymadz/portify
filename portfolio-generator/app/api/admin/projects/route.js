
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function checkAdmin() {
  const user = await requireAuth();
  const dbUser = await query('SELECT Role FROM Users WHERE UserID = @id', { id: user.userId });
  if (!dbUser.recordset[0] || dbUser.recordset[0].Role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function GET(request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId') || '';
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };

    if (search) {
      whereClause += ' AND (p.Title LIKE @search OR u.FullName LIKE @search)';
      params.search = `%${search}%`;
    }

    if (userId && userId !== 'all') {
      whereClause += ' AND p.UserID = @userId';
      params.userId = userId;
    }

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM Projects p
      JOIN Users u ON p.UserID = u.UserID
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = countResult.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    const dataQuery = `
            SELECT p.*, u.FullName as UserName 
            FROM Projects p
            JOIN Users u ON p.UserID = u.UserID
            ${whereClause}
            ORDER BY p.DateCompleted DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;
    const result = await query(dataQuery, params);

    return NextResponse.json({
      items: result.recordset,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await checkAdmin();
    const body = await request.json();
    const { userId, title, description, projectUrl, dateCompleted } = body;

    await query(`
            INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted)
            VALUES (@userId, @title, @description, @projectUrl, @dateCompleted)
        `, { userId, title, description, projectUrl, dateCompleted });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await checkAdmin();
    const body = await request.json();
    const { id, title, description, projectUrl, dateCompleted } = body;

    await query(`
            UPDATE Projects 
            SET Title = @title, Description = @description, ProjectURL = @projectUrl, DateCompleted = @dateCompleted
            WHERE ProjectID = @id
        `, { id, title, description, projectUrl, dateCompleted });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await query('DELETE FROM Projects WHERE ProjectID = @id', { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
