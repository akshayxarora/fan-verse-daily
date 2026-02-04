// Setup users script for FanverseDaily
// Run with: node scripts/setup-users.js

import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

// Users to create
const users = [
  {
    email: 'admin@fanversedaily.com',
    name: 'Admin',
    role: 'admin',
    password: 'FanverseAdmin2024!' // Change this after first login!
  },
  {
    email: 'vishesh@fanversedaily.com',
    name: 'Vishesh',
    role: 'editor',
    password: 'FanverseEditor2024!' // Change this after first login!
  },
  {
    email: 'chaht@fanversedaily.com',
    name: 'Chaht',
    role: 'editor',
    password: 'FanverseEditor2024!' // Change this after first login!
  }
];

async function setupUsers() {
  console.log('Setting up users for FanverseDaily...\n');

  for (const user of users) {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(user.password, 10);

      // Insert or update user
      await sql`
        INSERT INTO users (email, name, role, password_hash)
        VALUES (${user.email}, ${user.name}, ${user.role}, ${passwordHash})
        ON CONFLICT (email)
        DO UPDATE SET
          name = ${user.name},
          role = ${user.role},
          password_hash = ${passwordHash},
          updated_at = NOW()
      `;

      console.log(`✓ Created/updated user: ${user.email} (${user.role})`);
    } catch (error) {
      console.error(`✗ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log('\n--- User Setup Complete ---');
  console.log('\nDefault passwords (CHANGE AFTER FIRST LOGIN):');
  console.log('  Admin: FanverseAdmin2024!');
  console.log('  Editors: FanverseEditor2024!');
  console.log('\nLogin at: /login');
}

setupUsers().catch(console.error);
