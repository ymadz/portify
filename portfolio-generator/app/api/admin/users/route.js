
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, requireAuth } from '@/lib/auth';

// Middleware to check if user is admin is needed, but for now assuming this route is protected or we add check
async function checkAdmin() {
  const user = await requireAuth();
  // Re-fetch role from DB to be safe
  const dbUser = await query('SELECT Role FROM Users WHERE UserID = @id', { id: user.userId });
  if (!dbUser.recordset[0] || dbUser.recordset[0].Role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function GET(request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };

    if (search) {
      whereClause += ' AND (FullName LIKE @search OR Email LIKE @search)';
      params.search = `%${search}%`;
    }

    if (role && role !== 'all') {
      whereClause += ' AND Role = @role';
      params.role = role;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Users ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = countResult.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM Users 
      ${whereClause}
      ORDER BY JoinDate DESC
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
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Unauthorized') ? 403 : 500 });
  }
}

export async function POST(request) {
  try {
    await checkAdmin();
    const body = await request.json();
    const { fullName, email, password, bio, role } = body;

    const passwordHash = await hashPassword(password);

    await query(`
            INSERT INTO Users (FullName, Email, PasswordHash, Bio, Role, JoinDate)
            VALUES (@fullName, @email, @passwordHash, @bio, @role, GETDATE())
        `, { fullName, email, passwordHash, bio, role: role || 'user' });

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

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Delete dependencies first or rely on cascade if configured (safety first: manual delete)
    await query('DELETE FROM Projects WHERE UserID = @id', { id });
    await query('DELETE FROM Experience WHERE UserID = @id', { id });
    await query('DELETE FROM UserSkills WHERE UserID = @id', { id });
    await query('DELETE FROM Users WHERE UserID = @id', { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await checkAdmin();
    const body = await request.json();
    const { id, fullName, email, bio, role } = body;

    await query(`
            UPDATE Users 
            SET FullName = @fullName, Email = @email, Bio = @bio, Role = @role
            WHERE UserID = @id
        `, { id, fullName, email, bio, role });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
