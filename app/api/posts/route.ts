// Next.js API route for posts
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';
import { renderMarkdown } from '@/lib/markdown';
import sanitizeHtml from 'sanitize-html';
import { sendPostUpdateNotification } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Check if this is an admin request (has Authorization header)
    const authHeader = request.headers.get('authorization');
    const isAdmin = authHeader && authHeader.startsWith('Bearer ');
    
    let sql = 'SELECT * FROM posts WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    } else if (!isAdmin) {
      // Only show published posts for public API (non-admin requests)
      sql += ` AND status = $${paramIndex}`;
      params.push('published');
      paramIndex++;
    }
    
    sql += ' ORDER BY published_at DESC, created_at DESC';
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const posts = await query(sql, params);
    
    // Render markdown for each post and transform to camelCase
    const postsWithHtml = posts.map((post: any) => {
      let htmlContent = '';
      try {
        // If we have html_content and it's not empty, use it
        // Otherwise try to render from content
        if (post.html_content && post.html_content.trim()) {
          htmlContent = post.html_content;
        } else if (post.content) {
          const rendered = renderMarkdown(post.content);
          htmlContent = sanitizeHtml(rendered, {
            allowedTags: [
              'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'hr',
              'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'iframe',
            ],
            allowedAttributes: {
              'a': ['href', 'title', 'target', 'rel', 'class'],
              'img': ['src', 'alt', 'title', 'class', 'loading'],
              'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'style'],
              '*': ['class', 'id', 'style'],
            },
            allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'data'],
          });
        }
      } catch (error) {
        console.error('Markdown rendering error:', error);
        htmlContent = post.content || '';
      }

      return {
        ...post,
        htmlContent,
        readTime: post.read_time || (post.content ? Math.ceil(post.content.split(/\s+/).length / 200) : 0),
        subtitle: post.subtitle || '',
        excerpt: post.excerpt || '',
        publishedAt: post.published_at,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        seoTitle: post.seo_title,
        seoDescription: post.seo_description,
        featuredImage: post.featured_image,
        authorId: post.author_id,
      };
    });
    
    return NextResponse.json(postsWithHtml);
  } catch (error: any) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json();
    const { title, subtitle, slug, content, excerpt, type, status, tags, featured, hero, sendNewsletter, seoTitle, seoDescription, featuredImage } = body;
    
    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // If this is set as hero, deselect all other hero posts
    if (hero) {
      await query('UPDATE posts SET hero = FALSE WHERE hero = TRUE');
    }
    
    let htmlContent = '';
    try {
      // Check if content is already HTML
      const isHtml = (content || '').includes('<p>') || (content || '').includes('<div>') || (content || '').includes('<h1>') || (content || '').includes('<pre>');
      
      if (isHtml) {
        htmlContent = content || '';
      } else {
        // Only run renderMarkdown if it looks like raw markdown
        htmlContent = renderMarkdown(content || '');
      }
    } catch (markdownError: any) {
      console.error('Content processing error:', markdownError);
      htmlContent = content || '';
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://fanversedaily.com';
    const isPublishing = status === 'published';
    
    const sql = `
      INSERT INTO posts (title, subtitle, slug, content, html_content, excerpt, type, status, tags, featured, hero, send_newsletter, seo_title, seo_description, featured_image, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::text[], $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
      RETURNING *
    `;
    
    const params = [
      title,
      subtitle || null,
      slug,
      content || '',
      htmlContent,
      excerpt || null,
      type || 'post',
      status || 'draft',
      Array.isArray(tags) ? tags : [], // Ensure tags is an array
      featured || false,
      hero || false,
      sendNewsletter !== undefined ? sendNewsletter : true,
      seoTitle || null,
      seoDescription || null,
      featuredImage || null,
      isPublishing ? new Date() : null,
    ];
    
    let result;
    try {
      console.log('Inserting post with params:', {
        title,
        slug,
        status,
        type,
        tagsCount: tags?.length,
        hasHtml: !!htmlContent,
      });
      result = await query(sql, params);
    } catch (dbError: any) {
      console.error('Database error details:', {
        code: dbError.code,
        message: dbError.message,
        detail: dbError.detail,
        table: dbError.table,
        constraint: dbError.constraint,
      });
      throw dbError;
    }
    
    const newPost = result[0];
    
    // Transform to camelCase before returning
    const transformedPost = {
      ...newPost,
      publishedAt: newPost.published_at,
      createdAt: newPost.created_at,
      updatedAt: newPost.updated_at,
      featuredImage: newPost.featured_image,
      seoTitle: newPost.seo_title,
      seoDescription: newPost.seo_description,
      sendNewsletter: newPost.send_newsletter,
    };
    
    // Send newsletter notification if publishing and sendNewsletter is true
    if (isPublishing && sendNewsletter !== false) {
      try {
        const subscribers = await query(
          "SELECT email FROM newsletter_subscribers WHERE status = 'active'"
        );
        
        if (subscribers.length > 0) {
          const subscriberEmails = subscribers.map((s: any) => s.email);
          await sendPostUpdateNotification(subscriberEmails, {
            title: transformedPost.title,
            slug: transformedPost.slug,
            excerpt: transformedPost.excerpt || '',
            url: `${siteUrl}/post/${transformedPost.slug}`,
          });
        }
      } catch (newsletterError: any) {
        console.error('Failed to send newsletter notification:', newsletterError);
        // Don't fail the post creation if newsletter fails
      }
    }
    
    return NextResponse.json(transformedPost);
  } catch (error: any) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

