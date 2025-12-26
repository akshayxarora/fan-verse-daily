-- Database setup script for NeonDB
-- Run this in your NeonDB SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'author',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  html_content TEXT,
  featured_image TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  type VARCHAR(20) NOT NULL DEFAULT 'post',
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  seo_title VARCHAR(500),
  seo_description TEXT,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  meta JSONB DEFAULT '{}'
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  source VARCHAR(100)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'string',
  group_name VARCHAR(50) NOT NULL DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}',
  custom_css TEXT,
  custom_js TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Code injections table
CREATE TABLE IF NOT EXISTS code_injections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location VARCHAR(20) NOT NULL,
  code TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tool_url TEXT NOT NULL,
  icon VARCHAR(255),
  access VARCHAR(20) NOT NULL DEFAULT 'free',
  uses INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_themes_slug ON themes(slug);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);

-- Insert default admin user (change password after first login)
-- Password: admin123 (change this!)
INSERT INTO users (email, name, role, password_hash)
VALUES (
  'admin@marketingwithvibes.com',
  'Admin User',
  'admin',
  '$2b$10$YourHashedPasswordHere' -- Replace with actual bcrypt hash
)
ON CONFLICT (email) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, type, group_name) VALUES
  ('site_title', 'Marketing With Vibes', 'string', 'general'),
  ('site_description', 'GTM Engineering Blog and Resources', 'string', 'general'),
  ('site_url', 'https://marketingwithvibes.com', 'string', 'general'),
  ('author_name', 'Marketing With Vibes', 'string', 'general')
ON CONFLICT (key) DO NOTHING;

-- Insert default theme
INSERT INTO themes (name, slug, description, is_active, config) VALUES
  (
    'Default',
    'default',
    'Default theme with clean design',
    TRUE,
    '{"cssVariables": {}}'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

