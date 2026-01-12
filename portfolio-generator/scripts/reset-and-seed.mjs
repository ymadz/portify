import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    if (line.trim().startsWith('#')) return;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

// Import db after env is set
const dbModule = await import('../lib/db.js');
const { query, closePool, getPool } = dbModule;

// --- Helpers ---
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
function escapeSql(str) {
  return str.replace(/'/g, "''");
}

// --- Data Arrays ---
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah', 'Frank', 'Stephanie', 'Gary', 'Rebecca', 'Stephen', 'Sharon', 'Eric', 'Laura', 'Jeffrey', 'Cynthia', 'Raymond', 'Kathleen', 'Gregory', 'Amy', 'Joshua', 'Shirley', 'Jerry', 'Angela', 'Dennis', 'Helen', 'Walter', 'Anna', 'Patrick', 'Brenda', 'Peter', 'Pamela', 'Harold', 'Nicole', 'Douglas', 'Samantha', 'Henry', 'Katherine', 'Carl', 'Emma', 'Arthur', 'Christine', 'Ryan', 'Debra', 'Roger', 'Rachel'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo'];
const companies = ['TechCorp', 'InnoSoft', 'DataSystems', 'CloudNet', 'CyberDyne', 'BlueYonder', 'Acme Inc.', 'Globex', 'Soylent Corp', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent', 'Massive Dynamic', 'Hooli', 'Pied Piper', 'Initech', 'Intertrode', 'Vehement', 'Initrode', 'Penetrode', 'Virtucon', 'Omni Corp', 'Cyberdyne Systems', 'Aperture Science', 'Black Mesa', 'Weyland-Yutani', 'Tyrell Corp', 'OCP', 'U.S. Robotics', 'LexCorp', 'Oscorp', 'Stark Industries', 'Wayne Enterprises'];
const jobTitles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Dev', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'QA Engineer', 'SysAdmin', 'CTO', 'Tech Lead', 'Junior Dev', 'Senior Dev', 'Principal Engineer', 'Cloud Architect', 'Security Analyst', 'Database Administrator', 'Network Engineer', 'AI Researcher', 'Mobile Developer', 'Game Developer', 'Site Reliability Engineer', 'Engineering Manager', 'Scrum Master', 'Technical Writer'];
const skillsList = [
  { name: 'JavaScript', category: 'Language' }, { name: 'Python', category: 'Language' }, { name: 'Java', category: 'Language' }, { name: 'C#', category: 'Language' }, { name: 'C++', category: 'Language' },
  { name: 'Ruby', category: 'Language' }, { name: 'Go', category: 'Language' }, { name: 'Swift', category: 'Language' }, { name: 'Kotlin', category: 'Language' }, { name: 'PHP', category: 'Language' },
  { name: 'TypeScript', category: 'Language' }, { name: 'Rust', category: 'Language' }, { name: 'Solidity', category: 'Language' }, { name: 'Dart', category: 'Language' }, { name: 'Scala', category: 'Language' },
  { name: 'React', category: 'Frontend' }, { name: 'Angular', category: 'Frontend' }, { name: 'Vue', category: 'Frontend' }, { name: 'Svelte', category: 'Frontend' }, { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' }, { name: 'Bootstrap', category: 'Frontend' }, { name: 'Sass', category: 'Frontend' }, { name: 'Redux', category: 'Frontend' }, { name: 'Webpack', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' }, { name: 'Django', category: 'Backend' }, { name: 'Spring Boot', category: 'Backend' }, { name: 'Express', category: 'Backend' }, { name: 'ASP.NET', category: 'Backend' },
  { name: 'Laravel', category: 'Backend' }, { name: 'Rails', category: 'Backend' }, { name: 'FastAPI', category: 'Backend' }, { name: 'Flask', category: 'Backend' }, { name: 'GraphQL', category: 'Backend' },
  { name: 'SQL Server', category: 'Database' }, { name: 'PostgreSQL', category: 'Database' }, { name: 'MongoDB', category: 'Database' }, { name: 'Redis', category: 'Database' }, { name: 'MySQL', category: 'Database' },
  { name: 'Cassandra', category: 'Database' }, { name: 'Elasticsearch', category: 'Database' }, { name: 'Oracle', category: 'Database' }, { name: 'DynamoDB', category: 'Database' }, { name: 'Firebase', category: 'Database' },
  { name: 'Docker', category: 'DevOps' }, { name: 'Kubernetes', category: 'DevOps' }, { name: 'AWS', category: 'DevOps' }, { name: 'Azure', category: 'DevOps' }, { name: 'GCP', category: 'DevOps' },
  { name: 'Jenkins', category: 'DevOps' }, { name: 'Terraform', category: 'DevOps' }, { name: 'Ansible', category: 'DevOps' }, { name: 'Git', category: 'Tool' }, { name: 'JIRA', category: 'Tool' }
]; // Approx 55 skills

const projectPrefixes = ['Smart', 'Auto', 'Cyber', 'Next', 'Hyper', 'Mega', 'Ultra', 'Giga', 'Nano', 'Quantum', 'Cloud', 'Data', 'Info', 'Tech', 'Net', 'Web', 'App', 'Soft', 'Code', 'Dev'];
const projectSuffixes = ['System', 'Platform', 'App', 'Service', 'Tool', 'Hub', 'Lab', 'Base', 'Core', 'Net', 'Work', 'Flow', 'Stream', 'Sync', 'Link', 'Connect', 'Drive', 'Box', 'Space', 'Zone'];

async function main() {
  console.log('🚀 Starting Database Reset and Seed...');

  try {
    const pool = await getPool();

    // 1. Delete Existing Data (Order matters for FK)
    console.log('🗑️  Deleting existing data...');
    await pool.request().query('DELETE FROM UserSkills');
    await pool.request().query('DELETE FROM Experience');
    await pool.request().query('DELETE FROM Projects');
    await pool.request().query('DELETE FROM Users');
    await pool.request().query('DELETE FROM SkillDefinitions');
    console.log('✅ Data deleted.');

    // 2. Create Admin Account
    console.log('👤 Creating Admin Account...');
    const adminSalt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', adminSalt);

    await pool.request().query(`
            INSERT INTO Users (FullName, Email, PasswordHash, Bio, JoinDate, Role)
            VALUES ('System Administrator', 'admin@test.com', '${adminHash}', 'I am the super admin.', GETDATE(), 'admin')
        `);
    console.log('✅ Admin account created: admin@test.com / admin123');

    // 3. Seed Skill Definitions
    console.log('📚 Seeding Skills...');
    let skillBatch = [];
    for (const skill of skillsList) {
      skillBatch.push(`('${skill.name}', '${skill.category}')`);
    }
    await pool.request().query(`INSERT INTO SkillDefinitions (SkillName, Category) VALUES ${skillBatch.join(',')}`);
    console.log(`✅ Seeded ${skillsList.length} skills.`);

    // Get Skill IDs
    const skillIdsResult = await pool.request().query('SELECT SkillDefID FROM SkillDefinitions');
    const skillIds = skillIdsResult.recordset.map(s => s.SkillDefID);

    // 4. Generate Random Users
    const TARGET_USER_COUNT = 1500; // Between 1000-2000
    console.log(`👥 Generatings ${TARGET_USER_COUNT} users...`);

    // Batch insert users
    const BATCH_SIZE = 500;
    let usersInserted = 0;

    // We'll insert in chunks
    for (let i = 0; i < TARGET_USER_COUNT; i += BATCH_SIZE) {
      let userValues = [];
      const remaining = Math.min(BATCH_SIZE, TARGET_USER_COUNT - i);
      const commonSalt = await bcrypt.genSalt(10); // Reuse salt for performance, or generate per batch if needed. For speed, reuse is fine for dummy data.
      const commonHash = await bcrypt.hash('password123', commonSalt);

      for (let j = 0; j < remaining; j++) {
        const fname = getRandom(firstNames);
        const lname = getRandom(lastNames);
        const fullName = `${fname} ${lname}`;
        const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i + j}@example.com`;
        const bio = `Hi, I am ${fullName}, a generic user.`;
        const joinDate = getRandomDate(new Date(2020, 0, 1), new Date()).toISOString().split('T')[0];

        userValues.push(`('${escapeSql(fullName)}', '${email}', '${commonHash}', '${escapeSql(bio)}', '${joinDate}', 'user')`);
      }

      await pool.request().query(`INSERT INTO Users (FullName, Email, PasswordHash, Bio, JoinDate, Role) VALUES ${userValues.join(',')}`);
      usersInserted += remaining;
      console.log(`   ...inserted ${usersInserted} users`);
    }
    console.log('✅ Users seeded.');

    // Get all User IDs (excluding admin if we want, but it's fine)
    const usersResult = await pool.request().query('SELECT UserID FROM Users WHERE Role != \'admin\'');
    const userIds = usersResult.recordset.map(u => u.UserID);

    // 5. Seed Related Data (Projects, Experience, UserSkills)
    console.log('🔗 Seeding related data (Projects, Experience, Skills)...');

    let projectValues = [];
    let expValues = [];
    let userSkillValues = [];

    // Counters for batching
    let pCount = 0, eCount = 0, sCount = 0;

    for (const uid of userIds) {
      // Projects (1-2 per user)
      const numProjects = getRandomInt(1, 2);
      for (let k = 0; k < numProjects; k++) {
        const title = `${getRandom(projectPrefixes)} ${getRandom(projectSuffixes)}`;
        const desc = `A wonderful project about ${title}.`;
        const url = `https://github.com/example/${title.toLowerCase().replace(' ', '-')}`;
        const date = getRandomDate(new Date(2021, 0, 1), new Date()).toISOString().split('T')[0];

        projectValues.push(`(${uid}, '${title}', '${desc}', '${url}', '${date}')`);
        pCount++;
      }

      // Experience (1-2 per user)
      const numExp = getRandomInt(1, 2);
      for (let k = 0; k < numExp; k++) {
        const title = getRandom(jobTitles);
        const company = getRandom(companies);
        const start = getRandomDate(new Date(2018, 0, 1), new Date(2023, 0, 1));
        const end = Math.random() > 0.4 ? getRandomDate(start, new Date()) : null;
        const startStr = start.toISOString().split('T')[0];
        const endStr = end ? `'${end.toISOString().split('T')[0]}'` : 'NULL';

        expValues.push(`(${uid}, '${escapeSql(title)}', '${escapeSql(company)}', '${startStr}', ${endStr})`);
        eCount++;
      }

      // User Skills (3-8 per user, level 1-10)
      const numSkills = getRandomInt(3, 8);
      const userSkillSet = new Set();
      for (let k = 0; k < numSkills; k++) {
        const sid = getRandom(skillIds);
        if (userSkillSet.has(sid)) continue;
        userSkillSet.add(sid);
        const level = getRandomInt(1, 10); // Requirement: 1-10

        userSkillValues.push(`(${uid}, ${sid}, ${level})`);
        sCount++;
      }

      // Flush batches if too large (SQL Server limit for VALUES is 1000 rows usually safe)
      if (projectValues.length >= 800) {
        await pool.request().query(`INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted) VALUES ${projectValues.join(',')}`);
        projectValues = [];
        console.log(`   ...projects flushed`);
      }
      if (expValues.length >= 800) {
        await pool.request().query(`INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES ${expValues.join(',')}`);
        expValues = [];
        console.log(`   ...experience flushed`);
      }
      if (userSkillValues.length >= 800) {
        await pool.request().query(`INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel) VALUES ${userSkillValues.join(',')}`);
        userSkillValues = [];
        console.log(`   ...user skills flushed`);
      }
    }

    // Final flush
    if (projectValues.length > 0) await pool.request().query(`INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted) VALUES ${projectValues.join(',')}`);
    if (expValues.length > 0) await pool.request().query(`INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES ${expValues.join(',')}`);
    if (userSkillValues.length > 0) await pool.request().query(`INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel) VALUES ${userSkillValues.join(',')}`);

    console.log(`
🎉 Database Reset and Seed Complete!
Stats:
- Users: ${usersInserted + 1} (including admin)
- SkillDefinitions: ${skillsList.length}
- Projects: ${pCount}
- Experience: ${eCount}
- UserSkills: ${sCount}
        `);

  } catch (error) {
    console.error('❌ Error during reset/seed:', error);
  } finally {
    await closePool();
  }
}

main();
