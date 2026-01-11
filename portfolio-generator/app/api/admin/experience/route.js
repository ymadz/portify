
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
      whereClause += ' AND (e.JobTitle LIKE @search OR e.Company LIKE @search OR u.FullName LIKE @search)';
      params.search = `%${search}%`;
    }

    if (userId && userId !== 'all') {
      whereClause += ' AND e.UserID = @userId';
      params.userId = userId;
    }

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM Experience e 
      JOIN Users u ON e.UserID = u.UserID
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = countResult.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    const dataQuery = `
            SELECT e.*, u.FullName as UserName 
            FROM Experience e
            JOIN Users u ON e.UserID = u.UserID
            ${whereClause}
            ORDER BY e.StartDate DESC
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
    const { userId, jobTitle, company, startDate, endDate } = body;

    await query(`
            INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate)
            VALUES (@userId, @jobTitle, @company, @startDate, @endDate)
        `, { userId, jobTitle, company, startDate, endDate: endDate || null });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await checkAdmin();
    const body = await request.json();
    const { id, jobTitle, company, startDate, endDate } = body;

    await query(`
            UPDATE Experience 
            SET JobTitle = @jobTitle, Company = @company, StartDate = @startDate, EndDate = @endDate
            WHERE ExpID = @id
        `, { id, jobTitle, company, startDate, endDate: endDate || null });

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

    await query('DELETE FROM Experience WHERE ExpID = @id', { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
