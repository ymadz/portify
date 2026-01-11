
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
        const category = searchParams.get('category') || '';
        const offset = (page - 1) * limit;

        // Build WHERE clause
        let whereClause = 'WHERE 1=1';
        const params = { offset, limit };

        if (search) {
            whereClause += ' AND SkillName LIKE @search';
            params.search = `%${search}%`;
        }

        if (category && category !== 'all') {
            whereClause += ' AND Category = @category';
            params.category = category;
        }

        const countQuery = `SELECT COUNT(*) as total FROM SkillDefinitions ${whereClause}`;
        const countResult = await query(countQuery, params);
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);

        const dataQuery = `
            SELECT * FROM SkillDefinitions 
            ${whereClause}
            ORDER BY Category, SkillName
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
        const { skillName, category } = body;

        await query(`
            INSERT INTO SkillDefinitions (SkillName, Category)
            VALUES (@skillName, @category)
        `, { skillName, category });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await checkAdmin();
        const body = await request.json();
        const { id, skillName, category } = body;

        await query(`
            UPDATE SkillDefinitions 
            SET SkillName = @skillName, Category = @category
            WHERE SkillDefID = @id
        `, { id, skillName, category });

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

        // Check usage before delete
        const usage = await query('SELECT COUNT(*) as count FROM UserSkills WHERE SkillDefID = @id', { id });
        if (usage.recordset[0].count > 0) {
            return NextResponse.json({ error: 'Cannot delete skill: It is assigned to users.' }, { status: 400 });
        }

        await query('DELETE FROM SkillDefinitions WHERE SkillDefID = @id', { id });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
