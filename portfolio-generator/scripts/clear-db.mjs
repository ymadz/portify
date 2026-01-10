
import sql from 'mssql';

const config = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_DATABASE || 'PortfolioDB',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
    },
};

async function clearDatabase() {
    let pool = null;
    try {
        console.log('Connecting to database...');
        pool = await sql.connect(config);
        console.log('Connected.');

        const query = `
      -- 1. Delete data from tables with Foreign Keys first
      DELETE FROM UserSkills;
      DELETE FROM Projects;
      DELETE FROM Experience;

      -- 2. Delete data from primary tables
      DELETE FROM Users;
      DELETE FROM SkillDefinitions;

      -- 3. Reset Identity (Auto-increment) counters to 0
      DBCC CHECKIDENT ('UserSkills', RESEED, 0);
      DBCC CHECKIDENT ('Projects', RESEED, 0);
      DBCC CHECKIDENT ('Experience', RESEED, 0);
      DBCC CHECKIDENT ('Users', RESEED, 0);
      DBCC CHECKIDENT ('SkillDefinitions', RESEED, 0);
    `;

        console.log('Executing cleanup query...');
        await pool.request().query(query);
        console.log('Database cleared and identity seeds reset successfully.');

    } catch (err) {
        console.error('Error clearing database:', err);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
            console.log('Connection closed.');
        }
    }
}

clearDatabase();
