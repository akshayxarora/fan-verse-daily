import { query } from '../src/lib/db/client.js';

async function migrate() {
  try {
    console.log('Running migration to add description to code_injections...');
    await query('ALTER TABLE code_injections ADD COLUMN IF NOT EXISTS description TEXT');
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();

