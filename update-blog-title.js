import { query } from './src/lib/db/client.js';

async function update() {
  await query("UPDATE settings SET value = 'Opinions\nbacked by systems' WHERE key = 'blog_title'");
  console.log('Blog title updated with bicolor newline.');
}

update().catch(console.error);

