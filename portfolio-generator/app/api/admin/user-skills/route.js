
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
            whereClause += ' AND (sd.SkillName LIKE @search OR u.FullName LIKE @search)';
            params.search = `%${search}%`;
        }

        if (userId && userId !== 'all') {
            whereClause += ' AND us.UserID = @userId';
            params.userId = userId;
        }

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM UserSkills us 
            JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID 
            JOIN Users u ON us.UserID = u.UserID
            ${whereClause}
        `;
        const countResult = await query(countQuery, params);
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);

        const dataQuery = `
            SELECT us.*, u.FullName as UserName, sd.SkillName 
            FROM UserSkills us
            JOIN Users u ON us.UserID = u.UserID
            JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
            ${whereClause}
            ORDER BY u.FullName, sd.SkillName
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
        const { userId, skillDefId, proficiencyLevel } = body;

        // Prevent duplicates
        const existing = await query(
            'SELECT UserSkillID FROM UserSkills WHERE UserID = @userId AND SkillDefID = @skillDefId',
            { userId, skillDefId }
        );

        if (existing.recordset.length > 0) {
            return NextResponse.json({ error: 'User already has this skill assigned.' }, { status: 409 });
        }

        await query(`
            INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel)
            VALUES (@userId, @skillDefId, @proficiencyLevel)
        `, { userId, skillDefId, proficiencyLevel: proficiencyLevel || 1 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await checkAdmin();
        const body = await request.json();
        const { id, proficiencyLevel } = body;

        await query(`
            UPDATE UserSkills 
            SET ProficiencyLevel = @proficiencyLevel
            WHERE UserSkillID = @id
        `, { id, proficiencyLevel });

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

        await query('DELETE FROM UserSkills WHERE UserSkillID = @id', { id });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
