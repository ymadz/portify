import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually BEFORE importing db.js
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Skip comments
        if (line.trim().startsWith('#')) return;

        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            // Remove surrounding quotes and handle basic value parsing
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

// Now import db.js so it uses the updated process.env
const dbModule = await import('../lib/db.js');
const { query, closePool } = dbModule;

const sqlQuery = process.argv[2];

if (!sqlQuery) {
    console.error('Please provide a SQL query as an argument.');
    console.error('Usage: node scripts/query-db.mjs "SELECT * FROM Users"');
    process.exit(1);
}

async function runQuery() {
    try {
        console.log(`Executing: ${sqlQuery}`);
        const result = await query(sqlQuery);
        if (result && result.recordset) {
            console.table(result.recordset);
            console.log(`Rows affected: ${result.rowsAffected}`);
        } else {
            console.log('No records returned.');
            console.log(result);
        }
    } catch (error) {
        console.error('Error executing query:', error.message);
    } finally {
        await closePool();
    }
}

runQuery();
