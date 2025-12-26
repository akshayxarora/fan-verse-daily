// Seed script for database - creates admin user and sample blog posts
// Run with: npm run seed
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set.');
  console.error('Please make sure you have a .env file with DATABASE_URL set.');
  console.error('You can copy env.example to .env: cp env.example .env');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminEmail = 'admin@marketingwithvibes.com';
    const adminPassword = 'admin123'; // Change this after first login!
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log('Creating admin user...');
    await sql`
      INSERT INTO users (email, name, role, password_hash)
      VALUES (${adminEmail}, 'Admin User', 'admin', ${hashedPassword})
      ON CONFLICT (email) DO UPDATE
      SET password_hash = ${hashedPassword}, updated_at = NOW()
    `;
    console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`);

    // Get admin user ID
    const adminUser = await sql`
      SELECT id FROM users WHERE email = ${adminEmail}
    `;
    const adminId = adminUser[0].id;

    // Sample blog posts
    const samplePosts = [
      {
        slug: 'getting-started-with-gtm-engineering',
        title: 'Getting Started with GTM Engineering',
        excerpt: 'A comprehensive guide to building scalable go-to-market systems that actually work. Learn the fundamentals of GTM engineering and how to apply them to your startup.',
        content: `# Getting Started with GTM Engineering

GTM Engineering is the practice of building scalable, automated systems for go-to-market operations. Unlike traditional marketing, GTM engineering focuses on infrastructure, automation, and data-driven decision making.

## What is GTM Engineering?

GTM Engineering combines:
- **Systems thinking** - Building infrastructure, not just campaigns
- **Automation** - Reducing manual work through code and tools
- **Data** - Making decisions based on metrics, not opinions
- **Engineering mindset** - Version control, testing, and iteration

## Core Principles

1. **Infrastructure First**
   - Build systems that scale
   - Automate repetitive tasks
   - Document everything

2. **Data-Driven**
   - Measure everything
   - Test hypotheses
   - Iterate based on results

3. **Code Over Manual Work**
   - Write scripts, not spreadsheets
   - Use APIs, not manual exports
   - Build tools, not processes

## Getting Started

### 1. Map Your Current Process

Start by documenting your current GTM process:
- Lead generation
- Qualification
- Outreach
- Follow-up
- Conversion

### 2. Identify Automation Opportunities

Look for:
- Manual data entry
- Repetitive tasks
- Email sequences
- Data syncing

### 3. Build Your Stack

Essential tools:
- **CRM**: HubSpot, Salesforce, or custom
- **Automation**: n8n, Zapier, or custom scripts
- **Data**: PostgreSQL, BigQuery, or similar
- **Communication**: Slack, email APIs

## Next Steps

1. Start small with one process
2. Automate it completely
3. Measure the results
4. Scale what works

Ready to dive deeper? Check out our other posts on specific GTM systems.`,
        tags: ['GTM', 'Engineering', 'Getting Started'],
        featured: true,
      },
      {
        slug: 'building-a-cold-email-system',
        title: 'Building a Cold Email System That Actually Works',
        excerpt: 'Learn how to build a production-grade cold email system with deliverability monitoring, A/B testing, and automated follow-ups.',
        content: `# Building a Cold Email System That Actually Works

Cold email is still one of the most effective channels for B2B outreach, but most teams do it wrong. Here's how to build a system that actually converts.

## The Problem with Traditional Cold Email

Most cold email fails because:
- Poor deliverability setup
- No personalization
- Weak value propositions
- No follow-up system
- No measurement

## Building a System

### 1. Domain Setup

**Use a separate domain for cold email:**
- \`outbound.yourdomain.com\`
- Proper SPF, DKIM, DMARC records
- Dedicated IP (for scale)

**Warm up your domain:**
- Start with 5-10 emails per day
- Gradually increase over 2-4 weeks
- Monitor deliverability metrics

### 2. Email Infrastructure

**Tools you'll need:**
- SMTP service (SendGrid, Mailgun, or custom)
- Email tracking (open, click, reply detection)
- CRM integration
- Deliverability monitoring

### 3. Personalization Engine

**Build a research system:**
- Company data (LinkedIn, Clearbit, etc.)
- Recent news and triggers
- Tech stack detection
- Job postings

**Generate personalized openers:**
- Use AI for research synthesis
- Create templates with variables
- A/B test different approaches

### 4. Sequence Automation

**Build your sequence:**
1. Initial email (Day 0)
2. Follow-up 1 (Day 3)
3. Follow-up 2 (Day 7)
4. Final follow-up (Day 14)

**Automate with:**
- n8n or Zapier workflows
- Custom scripts
- CRM automation

### 5. Measurement

**Track everything:**
- Open rates
- Click rates
- Reply rates
- Meeting booked
- Revenue generated

**Build dashboards:**
- Sequence performance
- Sender performance
- Subject line performance
- Time of day performance

## Best Practices

1. **Keep it short** - 3-4 sentences max
2. **Lead with value** - What's in it for them?
3. **One clear CTA** - What do you want them to do?
4. **Test everything** - Subject lines, copy, timing
5. **Monitor deliverability** - Don't get blacklisted

## Tools We Use

- **n8n** - Workflow automation
- **Instantly** - Email sending and tracking
- **Clay** - Data enrichment
- **PostgreSQL** - Data storage
- **Metabase** - Analytics

## Next Steps

1. Set up your domain
2. Build your research system
3. Create your first sequence
4. Start small and scale

Want to see the actual code? Check out our GitHub for open-source GTM tools.`,
        tags: ['Cold Email', 'Outbound', 'Automation'],
        featured: false,
      },
    ];

    console.log('Creating sample blog posts...');
    for (const post of samplePosts) {
      // Calculate read time and excerpt
      const readTime = Math.ceil(post.content.split(/\s+/).length / 200);
      const excerpt = post.excerpt;
      
      // For now, html_content will be set later when posts are rendered
      // The API will handle markdown rendering
      const htmlContent = null;

      // Convert tags array to PostgreSQL TEXT[] format
      const tagsArray = post.tags;
      
      await sql`
        INSERT INTO posts (
          slug, title, excerpt, content, html_content, type, status,
          tags, featured, read_time, author_id, published_at, created_at, updated_at
        )
        VALUES (
          ${post.slug},
          ${post.title},
          ${excerpt},
          ${post.content},
          ${htmlContent},
          'post',
          'published',
          ${tagsArray}::text[],
          ${post.featured},
          ${readTime},
          ${adminId},
          NOW(),
          NOW(),
          NOW()
        )
        ON CONFLICT (slug) DO UPDATE
        SET 
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          excerpt = EXCLUDED.excerpt,
          tags = EXCLUDED.tags,
          featured = EXCLUDED.featured,
          read_time = EXCLUDED.read_time,
          updated_at = NOW()
      `;
      console.log(`✅ Created post: ${post.title}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📝 Admin credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the admin password after first login!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

