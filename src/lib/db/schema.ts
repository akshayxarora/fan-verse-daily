// Database schema types for NeonDB
// This will be used with a PostgreSQL database

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'author' | 'editor';
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string; // Subtitle field
  excerpt?: string;
  content: string; // Markdown content
  htmlContent?: string; // Rendered HTML
  featuredImage?: string; // Tigris URL
  status: 'draft' | 'published' | 'scheduled';
  type: 'post' | 'playbook' | 'guide' | 'tool';
  authorId: string;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  readTime?: number; // in minutes
  featured: boolean;
  views: number;
  sendNewsletter?: boolean; // Whether to send newsletter when published
  meta?: Record<string, any>; // JSON for custom fields
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  source?: string; // Where they subscribed from
}

export interface Setting {
  id: string;
  key: string;
  value: string; // JSON string for complex values
  type: 'string' | 'number' | 'boolean' | 'json' | 'html' | 'code';
  group: 'general' | 'seo' | 'theme' | 'newsletter' | 'social' | 'custom';
  updatedAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  config: Record<string, any>; // Theme configuration
  customCss?: string;
  customJs?: string;
  createdAt: Date;
}

export interface CodeInjection {
  id: string;
  location: 'head' | 'body' | 'footer';
  code: string; // HTML/JS/CSS code
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  toolUrl: string; // External tool URL
  icon?: string;
  access: 'free' | 'paid';
  uses: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

