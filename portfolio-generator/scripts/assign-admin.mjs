
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Manually load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, ...values] = line.split('=');
            if (key && values.length) {
                process.env[key.trim()] = values.join('=').trim();
            }
        }
    });
}

// Now import db
import { getPool } from '../lib/db.js';

async function assignAdmin() {
    try {
        const pool = await getPool();
        const email = 'admin@test.com';
        const password = 'admin123';

        console.log(`Checking for user: ${email}`);

        // Check if user exists
        const checkUser = await pool.request()
            .input('email', email)
            .query('SELECT UserID FROM Users WHERE Email = @email');

        if (checkUser.recordset.length > 0) {
            // Update existing user
            console.log('User exists. Updating role to admin...');
            await pool.request()
                .input('email', email)
                .query("UPDATE Users SET Role = 'admin' WHERE Email = @email");
            console.log('✓ User updated to admin role.');
        } else {
            // Create new user
            console.log('User does not exist. Creating new admin user...');

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            const fullName = 'System Admin';
            const bio = 'System Administrator with full access.';

            await pool.request()
                .input('fullName', fullName)
                .input('email', email)
                .input('passwordHash', passwordHash)
                .input('bio', bio)
                .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, Bio, JoinDate, Role)
                VALUES (@fullName, @email, @passwordHash, @bio, GETDATE(), 'admin')
            `);
            console.log('✓ New admin user created.');
        }

    } catch (err) {
        console.error('Error assigning admin:', err);
    } finally {
        process.exit(0);
    }
}

assignAdmin();
