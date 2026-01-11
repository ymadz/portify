
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const skillsList = [
    { name: 'JavaScript', category: 'Language' }, { name: 'Python', category: 'Language' },
    { name: 'React', category: 'Frontend' }, { name: 'Node.js', category: 'Backend' },
    { name: 'SQL Server', category: 'Database' }, { name: 'Docker', category: 'DevOps' },
    { name: 'Git', category: 'Tool' }
];

export async function GET() {
    console.log('🌱 Starting Data Seeding API (Constraint Inspector)...');
    let logs = [];
    try {
        const pool = await getPool();

        // INSPECT CONSTRAINT
        try {
            const constraint = await pool.request().query("SELECT definition FROM sys.check_constraints WHERE name = 'CHK_Category'");
            if (constraint.recordset.length > 0) {
                logs.push(`CONSTRAINT DEFINITION: ${constraint.recordset[0].definition}`);
            } else {
                logs.push('CONSTRAINT NOT FOUND by name CHK_Category. Maybe different name?');
            }
        } catch (e) { logs.push(`Error inspecting constraint: ${e.message}`); }

        // Try basic inserts one by one
        for (const skill of skillsList) {
            try {
                await pool.request().query(`
                    IF NOT EXISTS (SELECT 1 FROM SkillDefinitions WHERE SkillName = '${skill.name}') 
                    INSERT INTO SkillDefinitions (SkillName, Category) VALUES ('${skill.name}', '${skill.category}')
                `);
                logs.push(`✓ Inserted ${skill.name}`);
            } catch (e) {
                logs.push(`✗ Failed ${skill.name} (${skill.category}): ${e.message}`);
            }
        }

        return NextResponse.json({ success: true, logs });

    } catch (err) {
        return NextResponse.json({ error: err.message, stack: err.stack, logs }, { status: 200 });
    }
}
