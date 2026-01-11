
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// Removed hashPassword import to reduce dependency risks

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const companies = ['TechCorp', 'InnoSoft', 'DataSystems', 'CloudNet', 'CyberDyne', 'BlueYonder', 'Acme Inc.', 'Globex', 'Soylent Corp', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent', 'Massive Dynamic', 'Hooli', 'Ppied Piper', 'Initech', 'Intertrode', 'Vehement', 'Initrode', 'Penetrode'];
const jobTitles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Dev', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'QA Engineer', 'SysAdmin', 'CTO', 'Tech Lead', 'Junior Dev', 'Senior Dev', 'Principal Engineer'];
const skillsList = [
    { name: 'JavaScript', category: 'Language' }, { name: 'Python', category: 'Language' }, { name: 'Java', category: 'Language' }, { name: 'C#', category: 'Language' }, { name: 'C++', category: 'Language' },
    { name: 'React', category: 'Frontend' }, { name: 'Angular', category: 'Frontend' }, { name: 'Vue', category: 'Frontend' }, { name: 'Svelte', category: 'Frontend' }, { name: 'Next.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' }, { name: 'Django', category: 'Backend' }, { name: 'Spring Boot', category: 'Backend' }, { name: 'Express', category: 'Backend' }, { name: 'ASP.NET', category: 'Backend' },
    { name: 'SQL Server', category: 'Database' }, { name: 'PostgreSQL', category: 'Database' }, { name: 'MongoDB', category: 'Database' }, { name: 'Redis', category: 'Database' }, { name: 'MySQL', category: 'Database' },
    { name: 'Docker', category: 'DevOps' }, { name: 'Kubernetes', category: 'DevOps' }, { name: 'AWS', category: 'DevOps' }, { name: 'Azure', category: 'DevOps' }, { name: 'Git', category: 'Tool' }
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export async function GET() {
    console.log('🌱 Starting Data Seeding API (Robust)...');
    try {
        const pool = await getPool();
        let logs = [];

        // 1. Seed Skills
        const existingSkills = await pool.request().query('SELECT COUNT(*) as count FROM SkillDefinitions');
        if (existingSkills.recordset[0].count < 5) {
            for (const skill of skillsList) {
                // Check exist first to be safe
                const check = await pool.request().query(`SELECT 1 FROM SkillDefinitions WHERE SkillName = '${skill.name}'`);
                if (check.recordset.length === 0) {
                    await pool.request().query(`INSERT INTO SkillDefinitions (SkillName, Category) VALUES ('${skill.name}', '${skill.category}')`);
                }
            }

            // Extra procedural skills
            const cats = ['Frontend', 'Backend', 'Tool', 'Framework', 'Library'];
            const langs = ['JS', 'Py', 'Rb', 'Go', 'Rust', 'C', 'Swift'];
            let skillBatch = [];

            for (let i = 0; i < 300; i++) { // Generate 300 extra skills
                const name = `${getRandom(langs)}-Lib-${i}`;
                skillBatch.push(`('${name}', '${getRandom(cats)}')`);
                if (skillBatch.length >= 100) {
                    await pool.request().query(`INSERT INTO SkillDefinitions (SkillName, Category) VALUES ${skillBatch.join(',')}`);
                    skillBatch = [];
                }
            }
            if (skillBatch.length > 0) await pool.request().query(`INSERT INTO SkillDefinitions (SkillName, Category) VALUES ${skillBatch.join(',')}`);
            logs.push('✓ Skills seeded.');
        } else {
            logs.push('✓ Skills already exist.');
        }

        const skillIdsData = await pool.request().query('SELECT SkillDefID FROM SkillDefinitions');
        const skillIds = skillIdsData.recordset.map(s => s.SkillDefID);

        // Fetch existing users
        const usersData = await pool.request().query('SELECT TOP 1500 UserID FROM Users ORDER BY JoinDate DESC');
        const userIds = usersData.recordset.map(u => u.UserID);
        logs.push(`Found ${userIds.length} existing users.`);

        if (userIds.length === 0) throw new Error('No users found to seed data for.');

        // 4. Generate Experience
        let expCount = 0;
        let expValues = [];

        for (const uid of userIds) {
            const numExp = getRandomInt(1, 4);
            for (let k = 0; k < numExp; k++) {
                const title = getRandom(jobTitles);
                const company = getRandom(companies);
                const start = getRandomDate(new Date(2015, 0, 1), new Date(2022, 0, 1));
                const end = Math.random() > 0.3 ? getRandomDate(start, new Date()) : null;

                const startStr = start.toISOString().split('T')[0];
                const endStr = end ? `'${end.toISOString().split('T')[0]}'` : 'NULL';

                expValues.push(`(${uid}, '${title}', '${company}', '${startStr}', ${endStr})`);
                expCount++;

                if (expValues.length >= 50) { // Smaller batch
                    await pool.request().query(`INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES ${expValues.join(',')}`);
                    expValues = [];
                }
            }
        }
        if (expValues.length > 0) await pool.request().query(`INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES ${expValues.join(',')}`);
        logs.push(`✓ Experience seeded: ${expCount}`);

        // 5. Generate UserSkills
        let usCount = 0;
        let usValues = [];

        for (const uid of userIds) {
            const numSkills = getRandomInt(3, 8);
            const userSkillSet = new Set();

            for (let k = 0; k < numSkills; k++) {
                const sid = getRandom(skillIds);
                if (!sid) continue;
                if (userSkillSet.has(sid)) continue;
                userSkillSet.add(sid);

                const level = getRandomInt(20, 100);
                usValues.push(`(${uid}, ${sid}, ${level})`);
                usCount++;

                if (usValues.length >= 50) {
                    // Try-catch batch to ignore duplicates if any
                    try {
                        await pool.request().query(`INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel) VALUES ${usValues.join(',')}`);
                    } catch (e) {
                        console.warn('Batch insert error (ignoring):', e.message);
                    }
                    usValues = [];
                }
            }
        }
        if (usValues.length > 0) {
            try {
                await pool.request().query(`INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel) VALUES ${usValues.join(',')}`);
            } catch (e) { }
        }
        logs.push(`✓ UserSkills seeded: ${usCount}`);

        return NextResponse.json({ success: true, logs });

    } catch (err) {
        console.error('Error seeding data:', err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}
