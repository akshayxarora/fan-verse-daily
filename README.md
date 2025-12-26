# Marketing With Vibes - GTM Engineering Blog & CMS

A modern, Ghost-inspired blog and CMS platform built for GTM engineers. Built with Next.js, TypeScript, and deployed on Vercel with NeonDB and Tigris.

## Features

- 📝 **Markdown Blog Posts** - Write posts in Markdown with Ghost-style editor
- 🔐 **Secure Admin Panel** - Password-protected admin with JWT authentication
- 🎨 **Theme System** - Multiple theme options with custom CSS/JS support
- 📧 **Newsletter** - Built-in newsletter subscription system with Resend integration
- 🔍 **SEO Optimized** - Server-side rendered pages, sitemaps, robots.txt, and JSON-LD structured data
- 💾 **Tigris Storage** - Images and JSON content storage in Tigris
- 💻 **Code Injection** - Inject custom HTML, CSS, and JavaScript
- 🎯 **Dynamic Routing** - SEO-friendly URLs for blog posts
- 🗄️ **NeonDB Integration** - PostgreSQL database with neonctl support
- ⚡ **Server-Side Rendering** - Public pages are SSR for better SEO and performance

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: NeonDB (PostgreSQL) - use `npx neonctl@latest init`
- **Storage**: Tigris (S3-compatible) - for images and JSON content
- **Email**: Resend - for newsletter and notifications
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- NeonDB account and database
- Tigris account (for image storage)
- Resend account (for email)
- Vercel account (for deployment)

### Installation

1. **Clone and install:**
```bash
git clone <your-repo-url>
cd gtm-systems-hub
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://marketingwithvibes.com
NEXT_PUBLIC_API_URL=/api

# Database (NeonDB)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Tigris Storage
TIGRIS_ENDPOINT=https://t3.storage.dev
TIGRIS_REGION=auto
TIGRIS_ACCESS_KEY_ID=your_access_key
TIGRIS_SECRET_ACCESS_KEY=your_secret_key
TIGRIS_IMAGES_BUCKET=images
TIGRIS_CONTENT_BUCKET=content
TIGRIS_CDN_URL=

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=newsletter@marketingwithvibes.com

# Authentication
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
```

3. **Set up the database:**
```bash
# Option 1: Using neonctl
npx neonctl@latest init

# Option 2: Manual setup
# Go to https://console.neon.tech, create a project, and copy the connection string
```

Run the database schema:
```bash
# Connect to your Neon database and run:
psql <your-connection-string> -f scripts/setup-db.sql
```

Or use the Neon dashboard SQL editor to run the schema from `scripts/setup-db.sql`.

4. **Seed initial data:**
```bash
npm run seed
```

This creates:
- Admin user: `admin@marketingwithvibes.com` / `admin123`
- 2 sample blog posts

⚠️ **Important**: Change the admin password after first login via `/admin/settings`

5. **Run development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Database Setup

### Using neonctl (Recommended)

```bash
npx neonctl@latest init
```

This will:
- Prompt you to log in or create a Neon account
- Create a new project (or select existing)
- Generate a connection string
- Save it to your `.env` as `DATABASE_URL`

### Manual Setup

1. Go to https://console.neon.tech
2. Create a new project
3. Copy your connection string
4. Add it to `.env` as `DATABASE_URL`
5. Run the schema from `scripts/setup-db.sql` in the Neon SQL editor

### Database Schema

The schema includes:
- `users` - Admin users
- `posts` - Blog posts, playbooks, guides
- `tags` - Content tags
- `newsletter_subscribers` - Newsletter subscribers
- `settings` - Site settings
- `themes` - Theme configurations
- `code_injections` - Custom code injections
- `tools` - GTM tools directory

## Tigris Storage Setup

1. Create a Tigris account at https://www.tigris.dev
2. Create two buckets:
   - `images` - For uploaded images
   - `content` - For blog post JSON content
3. Get your access credentials and add them to `.env`

You can create buckets using the script:
```bash
node scripts/create-tigris-buckets.js
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── posts/         # Post API endpoints
│   │   ├── auth/          # Authentication
│   │   ├── newsletter/    # Newsletter API
│   │   └── ...
│   ├── admin/             # Admin panel (client-side)
│   ├── blog/              # Blog listing (SSR)
│   ├── post/              # Post detail pages (SSR)
│   └── layout.tsx         # Root layout
├── src/
│   ├── components/        # React components
│   │   ├── admin/         # Admin panel components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utilities and helpers
│   │   ├── api/           # API client (client & server)
│   │   ├── db/            # Database schema and client
│   │   ├── markdown.ts    # Markdown rendering
│   │   └── seo.ts         # SEO utilities
│   └── pages/             # Page components (used by admin)
│       └── admin/          # Admin panel pages
├── scripts/
│   ├── seed.ts            # Database seeding script
│   └── setup-db.sql       # Database schema
└── next.config.js         # Next.js configuration
```

## Admin Panel

Access the admin panel at `/admin` (requires login at `/login`).

### Features

- **Dashboard** (`/admin`) - Overview of content and stats
- **Posts** (`/admin/posts`) - Create, edit, and manage blog posts with Ghost-style editor
- **Newsletter** (`/admin/newsletter`) - View and manage subscribers, send newsletters
- **Themes** (`/admin/themes`) - Switch between themes
- **Code Injection** (`/admin/code-injection`) - Add custom code to your site
- **Settings** (`/admin/settings`) - Configure site settings, change password

### Login

1. Use the seeded admin credentials: `admin@marketingwithvibes.com` / `admin123`
2. Or create a new admin user in the database
3. Access `/login` to sign in
4. JWT tokens are stored in localStorage

## Content Management

### Posts

- Blog posts with Markdown support
- Ghost-style editor with preview mode
- Featured images (stored in Tigris)
- SEO metadata (title, description)
- Tags and categories
- Auto-generated excerpts and reading time
- Draft/Published status

### Newsletter

- Subscriber management
- Welcome emails for new subscribers
- Send newsletters to all subscribers
- Test email functionality
- HTML email templates

## SEO Features

- **Server-Side Rendering**: All public pages are SSR for better SEO
- **Sitemap**: Automatically generated at `/sitemap.xml`
- **Robots.txt**: Generated at `/robots.txt`
- **JSON-LD**: Structured data for posts and website
- **Meta Tags**: Open Graph and Twitter Card support
- **Canonical URLs**: Proper URL canonicalization

## API Endpoints

### Posts
- `GET /api/posts` - List all posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (admin)
- `PUT /api/posts/:slug` - Update post (admin)
- `DELETE /api/posts/:slug` - Delete post (admin)

### Auth
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (admin)
- `POST /api/auth/verify-password` - Verify password (admin)
- `POST /api/auth/update-password` - Update password (admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/subscribers` - Get subscribers (admin)
- `POST /api/newsletter/subscribers` - Add subscriber (admin)
- `DELETE /api/newsletter/subscribers/:id` - Remove subscriber (admin)
- `POST /api/newsletter/send` - Send newsletter (admin)

### SEO
- `GET /sitemap.xml` - Sitemap
- `GET /robots.txt` - Robots.txt

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` file configures:
- Sitemap and robots.txt rewrites
- Proper headers

### Environment Variables for Vercel

Set these in your Vercel project settings:
- `DATABASE_URL`
- `TIGRIS_ENDPOINT`
- `TIGRIS_ACCESS_KEY_ID`
- `TIGRIS_SECRET_ACCESS_KEY`
- `TIGRIS_IMAGES_BUCKET`
- `TIGRIS_CONTENT_BUCKET`
- `TIGRIS_CDN_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Customization

### Themes

Create custom themes in the admin panel:
1. Go to `/admin/themes`
2. Create a new theme
3. Add custom CSS/JS
4. Configure CSS variables
5. Activate the theme

### Code Injection

Inject custom code at three locations:
- **Head**: Before `</head>`
- **Body**: After `<body>`
- **Footer**: Before `</body>`

Useful for:
- Analytics scripts
- Custom tracking
- Third-party integrations
- Custom styling

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your NeonDB database is active
- Ensure SSL mode is set correctly

### Image Upload Issues
- Verify Tigris credentials are correct
- Check bucket permissions
- Ensure CDN URL is correct if using CDN

### API Routes Not Working
- Check that Next.js is running correctly
- Verify API routes are in the `/app/api` directory
- Check server logs

### Build Errors
- Make sure all dependencies are installed
- Check TypeScript errors
- Verify environment variables are set

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Seed database
npm run seed
```

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
