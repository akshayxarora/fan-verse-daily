import { query } from './src/lib/db/client.js';

async function seedSettings() {
  const defaultSettings = [
    {
      key: 'home_hero_title',
      value: 'GTM Engineering\nBlog & Resources',
      group: 'homepage'
    },
    {
      key: 'home_hero_description',
      value: 'Technical deep-dives, systems breakdowns, and real-world GTM engineering insights.',
      group: 'homepage'
    },
    {
      key: 'home_latest_posts_title',
      value: 'Latest from the blog',
      group: 'homepage'
    },
    {
      key: 'blog_title',
      value: 'Opinions backed by systems',
      group: 'blog'
    },
    {
      key: 'blog_description',
      value: 'Hot takes, technical deep-dives, and research on GTM engineering. Everything is informed by real execution, not theory.',
      group: 'blog'
    },
    {
      key: 'signup_modal_title',
      value: 'Join the newsletter',
      group: 'newsletter'
    },
    {
      key: 'signup_modal_description',
      value: 'Get the latest updates and exclusive content straight to your inbox.',
      group: 'newsletter'
    },
    {
      key: 'newsletter_cta_title',
      value: 'Stay Updated',
      group: 'newsletter'
    },
    {
      key: 'newsletter_cta_description',
      value: 'Get the latest GTM engineering insights delivered to your inbox.',
      group: 'newsletter'
    },
    {
      key: 'site_meta_description',
      value: 'Marketing With Vibes - GTM Engineering Blog and Resources for technical marketing teams.',
      group: 'seo'
    },
    {
      key: 'footer_description',
      value: 'Building reliable GTM strategies powered by AI and Data-Driven Decisions.',
      group: 'seo'
    }
  ];

  console.log('Seeding site settings...');

  for (const setting of defaultSettings) {
    await query(`
      INSERT INTO settings (key, value, group_name, type)
      VALUES ($1, $2, $3, 'string')
      ON CONFLICT (key) DO NOTHING
    `, [setting.key, setting.value, setting.group]);
  }

  console.log('Settings seeded successfully!');
}

seedSettings().catch(console.error);

