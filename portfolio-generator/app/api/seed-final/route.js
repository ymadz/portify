
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const jobs = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Architect', 'Admin', 'Officer', 'Consultant', 'Specialist'];
const companies = ['TechCorp', 'InnoSoft', 'DataSystems', 'CloudNet', 'CyberDyne', 'BlueYonder', 'Acme Inc.', 'Globex', 'Soylent Corp', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent', 'Massive Dynamic', 'Hooli', 'Ppied Piper', 'Initech', 'Intertrode', 'Vehement', 'Initrode', 'Penetrode'];
const jobTitles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Dev', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'QA Engineer', 'SysAdmin', 'CTO', 'Tech Lead', 'Junior Dev', 'Senior Dev', 'Principal Engineer'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export async function GET() {
    console.log('🌱 Starting Data Seeding API (Bypass)...');
    let logs = [];
    try {
        const pool = await getPool();

        // 1. Seed Skills (Try/Catch wrapper)
        const categories = {
            'Frontend': ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Next.js', 'Nuxt', 'Bootstrap', 'Tailwind', 'MaterialUI', 'Jest', 'Cypress', 'Webpack', 'Vite'],
            'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'ASP.NET', 'FastAPI', 'NestJS', 'GraphQL', 'Apollo', 'RabbitMQ', 'Kafka'],
            'Database': ['SQL Server', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'DynamoDB', 'Firebase', 'Supabase', 'Neo4j'],
            'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'Nginx'],
            'Mobile': ['React Native', 'Flutter', 'SwiftUI', 'Kotlin Multiplatform', 'Ionic', 'Cordova', 'Expo', 'Android SDK', 'iOS SDK'],
            'Tool': ['Git', 'VS Code', 'Jira', 'Figma', 'Sketch', 'Postman', 'Slack', 'Trello', 'Notion', 'Zoom', 'Photoshop'],
            'Language': ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin', 'PHP']
        };

        const catKeys = Object.keys(categories);
        let skillBatch = [];

        for (let i = 0; i < 1000; i++) {
            const cat = getRandom(catKeys);
            const prefix = getRandom(categories[cat]);
            const name = `${prefix} ${getRandomInt(100, 999)}`;

            skillBatch.push(`('${name}', '${cat}')`);

            if (skillBatch.length >= 100) {
                try {
                    await pool.request().query(`INSERT INTO SkillDefinitions (SkillName, Category) VALUES ${skillBatch.join(',')}`);
                } catch (e) {
                    // Log but continue
                    logs.push(`Skill batch failed: ${e.message}`);
                }
                skillBatch = [];
            }
        }
        if (skillBatch.length > 0) {
            try {
                await pool.request().query(`INSERT INTO SkillDefinitions (SkillName, Category) VALUES ${skillBatch.join(',')}`);
            } catch (e) { }
        }
        logs.push('✓ procedural skills attempted.');

        const skillIdsData = await pool.request().query('SELECT SkillDefID FROM SkillDefinitions');
        const skillIds = skillIdsData.recordset.map(s => s.SkillDefID);
        logs.push(`Found ${skillIds.length} skills via SELECT.`);

        const usersData = await pool.request().query('SELECT TOP 1500 UserID FROM Users ORDER BY JoinDate DESC');
        const userIds = usersData.recordset.map(u => u.UserID);
        logs.push(`Found ${userIds.length} existing users.`);

        if (userIds.length === 0) throw new Error('No users found.');

        // 4. Generate Experience
        let expCount = 0;
        let expValues = [];

        for (const uid of userIds) {
            const numExp = getRandomInt(1, 3);
            for (let k = 0; k < numExp; k++) {
                const title = getRandom(jobTitles);
                const company = getRandom(companies);
                const start = getRandomDate(new Date(2015, 0, 1), new Date(2022, 0, 1));
                const end = Math.random() > 0.3 ? getRandomDate(start, new Date()) : null;

                const startStr = start.toISOString().split('T')[0];
                const endStr = end ? `'${end.toISOString().split('T')[0]}'` : 'NULL';

                expValues.push(`(${uid}, '${title}', '${company}', '${startStr}', ${endStr})`);
                expCount++;

                if (expValues.length >= 50) {
                    try {
                        await pool.request().query(`INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES ${expValues.join(',')}`);
                    } catch (e) { logs.push(`Exp batch error: ${e.message}`); }
                    expValues = [];
                }
            }
        }
        if (expValues.length > 0) {
            try {
                await pool.request().query(`INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES ${expValues.join(',')}`);
            } catch (e) { }
        }
        logs.push(`✓ Experience seeded: ${expCount}`);

        // 5. Generate UserSkills
        if (skillIds.length > 0) {
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
                        try {
                            await pool.request().query(`INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel) VALUES ${usValues.join(',')}`);
                        } catch (e) { logs.push(`US Batch Error: ${e.message}`); }
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
        } else {
            logs.push('! No skills found, skipping UserSkills.');
        }

        return NextResponse.json({ success: true, logs });

    } catch (err) {
        console.error('Error seeding data:', err);
        return NextResponse.json({ error: err.message, stack: err.stack, logs }, { status: 200 });
    }
}
