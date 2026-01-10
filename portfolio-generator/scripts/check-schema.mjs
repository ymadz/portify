
import { getPool } from '../lib/db.js';

async function checkSchema() {
    try {
        const pool = await getPool();

        console.log('--- Checking Users Table Columns ---');
        const result = await pool.request().query(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH, 
        IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Users'
    `);

        console.table(result.recordset);

        console.log('--- Checking for other relevant tables ---');
        const tables = await pool.request().query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
    `);
        console.table(tables.recordset);


    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit(0);
    }
}

checkSchema();
