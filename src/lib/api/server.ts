// Server-side API client for Next.js SSR
// This uses the database directly instead of HTTP calls

import { query, queryOne } from '@/lib/db/client';
import { renderMarkdown } from '@/lib/markdown';
import sanitizeHtml from 'sanitize-html';

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  htmlContent?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'scheduled';
  type: 'post' | 'playbook' | 'guide' | 'tool';
  authorId: string;
  publishedAt?: string | Date;
  scheduledAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  readTime?: number;
  featured: boolean;
  views: number;
  meta?: Record<string, any>;
}

export const postsApiServer = {
  getAll: async (params?: { 
    type?: string; 
    status?: string; 
    limit?: number; 
    offset?: number;
    isAdmin?: boolean;
    hero?: boolean;
  }): Promise<Post[]> => {
    let sql = 'SELECT * FROM posts WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params?.type) {
      sql += ` AND type = $${paramIndex}`;
      queryParams.push(params.type);
      paramIndex++;
    }

    if (params?.status) {
      sql += ` AND status = $${paramIndex}`;
      queryParams.push(params.status);
      paramIndex++;
    } else if (!params?.isAdmin) {
      // Only show published posts for public requests
      sql += ` AND status = $${paramIndex}`;
      queryParams.push('published');
      paramIndex++;
    }

    if (params?.hero !== undefined) {
      sql += ` AND hero = $${paramIndex}`;
      queryParams.push(params.hero);
      paramIndex++;
    }

    sql += ' ORDER BY hero DESC, published_at DESC, created_at DESC';
    
    if (params?.limit) {
      sql += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
      paramIndex++;
    }
    
    if (params?.offset) {
      sql += ` OFFSET $${paramIndex}`;
      queryParams.push(params.offset);
      paramIndex++;
    }

    const posts = await query(sql, queryParams);

    // Transform and render markdown
    return posts.map((post: any) => {
      let htmlContent = '';
      try {
        const isHtml = post.html_content && (post.html_content.includes('<p>') || post.html_content.includes('<h1>'));
        if (isHtml) {
          htmlContent = post.html_content;
        } else if (post.content) {
          const rendered = renderMarkdown(post.content);
          htmlContent = sanitizeHtml(rendered, {
            allowedTags: [
              'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'hr',
              'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span',
            ],
            allowedAttributes: {
              'a': ['href', 'title', 'target', 'rel', 'class'],
              'img': ['src', 'alt', 'title', 'class', 'loading'],
              '*': ['class', 'id'],
            },
          });
        }
      } catch (error) {
        console.error('Markdown rendering error:', error);
        htmlContent = post.content || '';
      }

      return {
        ...post,
        publishedAt: post.published_at,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        scheduledAt: post.scheduled_at,
        authorId: post.author_id,
        htmlContent,
        subtitle: post.subtitle || '',
        featuredImage: post.featured_image,
        seoTitle: post.seo_title,
        seoDescription: post.seo_description,
        readTime: post.read_time || (post.content ? Math.ceil(post.content.split(/\s+/).length / 200) : 0),
        content: post.content || '',
      };
    });
  },

  getBySlug: async (slug: string): Promise<Post | null> => {
    const sql = 'SELECT * FROM posts WHERE slug = $1';
    const post = await queryOne(sql, [slug]);

    if (!post) {
      return null;
    }

    // Render markdown
    let htmlContent = '';
    try {
      const isHtml = post.html_content && (post.html_content.includes('<p>') || post.html_content.includes('<h1>'));
      if (isHtml) {
        htmlContent = post.html_content;
      } else if (post.content) {
        const rendered = renderMarkdown(post.content);
        htmlContent = sanitizeHtml(rendered, {
          allowedTags: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'hr',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span',
          ],
          allowedAttributes: {
            'a': ['href', 'title', 'target', 'rel', 'class'],
            'img': ['src', 'alt', 'title', 'class', 'loading'],
            '*': ['class', 'id'],
          },
        });
      }
    } catch (error) {
      console.error('Markdown rendering error:', error);
      htmlContent = post.content || '';
    }

    return {
      ...post,
      publishedAt: post.published_at,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      scheduledAt: post.scheduled_at,
      authorId: post.author_id,
      htmlContent,
      featuredImage: post.featured_image,
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      readTime: post.read_time || (post.content ? Math.ceil(post.content.split(/\s+/).length / 200) : 0),
      content: post.content || '',
    };
  },
};

export const settingsApiServer = {
  getAll: async (): Promise<Record<string, string>> => {
    const settings = await query('SELECT key, value FROM settings');
    const result: Record<string, string> = {};
    settings.forEach((s: any) => {
      result[s.key] = s.value;
    });
    return result;
  },

  get: async (key: string): Promise<string | null> => {
    const setting = await queryOne('SELECT value FROM settings WHERE key = $1', [key]);
    return setting ? setting.value : null;
  },
};

