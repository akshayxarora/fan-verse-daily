// Migration script to add send_newsletter column to posts table
// Run with: npx tsx scripts/migrate-send-newsletter.ts
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set.');
  console.error('Please make sure you have a .env file with DATABASE_URL set.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  try {
    console.log('🔄 Running migration: Add send_newsletter column to posts table...');

    // Check if column already exists
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'posts' AND column_name = 'send_newsletter'
    `;

    if (checkColumn.length > 0) {
      console.log('✅ Column send_newsletter already exists. Migration skipped.');
      return;
    }

    // Add the column
    await sql`
      ALTER TABLE posts 
      ADD COLUMN send_newsletter BOOLEAN DEFAULT TRUE
    `;

    console.log('✅ Migration completed successfully!');
    console.log('   Added send_newsletter column to posts table with default value TRUE');
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();

