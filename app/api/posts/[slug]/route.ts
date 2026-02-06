// Next.js API route for individual post
import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/client';
import { renderMarkdown } from '@/lib/markdown';
import sanitizeHtml from 'sanitize-html';
import { sendPostUpdateNotification } from '@/lib/resend';
import { deleteFile, extractImageUrls } from '@/lib/storage';
import { verifyAuth, canModifyPosts } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug or ID is required' },
        { status: 400 }
      );
    }

    const sql = 'SELECT * FROM posts WHERE slug = $1 OR id::text = $1';
    const post = await queryOne(sql, [slug]);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment views only for published posts and not from admin headers
    const authHeader = request.headers.get('authorization');
    const isPublicRequest = !authHeader || !authHeader.startsWith('Bearer ');
    
    if (post.status === 'published' && isPublicRequest) {
      await query('UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = $1', [post.id]);
    }

    // Render markdown if not already rendered
    let htmlContent = '';
    try {
      // If we have html_content and it's not empty, use it
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
    
    const postWithHtml = {
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

    return NextResponse.json(postWithHtml);
  } catch (error: any) {
    console.error('Post API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!canModifyPosts(user)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or editor access required.' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const {
      title,
      subtitle,
      slug: newSlug, // Get the new slug from body
      content,
      status,
      tags,
      featured,
      hero,
      sendNewsletter,
      seoTitle,
      seoDescription,
      featuredImage,
    } = body;

    // If this is being set as hero, deselect all other hero posts
    if (hero === true) {
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
    
    // Check if post was previously published
    // Support finding by slug or ID
    const existingPost = await queryOne('SELECT id, published_at, send_newsletter FROM posts WHERE slug = $1 OR id::text = $1', [slug]);
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const wasPublished = !!existingPost?.published_at;
    const isPublishing = status === 'published' && !wasPublished;

    const sql = `
      UPDATE posts SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        html_content = COALESCE($3, html_content),
        status = COALESCE($4, status),
        tags = COALESCE($5::text[], tags),
        featured = COALESCE($6, featured),
        send_newsletter = COALESCE($7, send_newsletter),
        seo_title = COALESCE($8, seo_title),
        seo_description = COALESCE($9, seo_description),
        featured_image = COALESCE($10, featured_image),
        slug = COALESCE($12, slug),
        hero = COALESCE($13, hero),
        subtitle = COALESCE($14, subtitle),
        published_at = CASE WHEN $4 = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_at = NOW()
      WHERE slug = $11 OR id::text = $11
      RETURNING *
    `;

    const params_array = [
      title || null,
      content || null,
      htmlContent || null,
      status || null,
      Array.isArray(tags) ? tags : null,
      featured !== undefined ? featured : null,
      sendNewsletter !== undefined ? sendNewsletter : true, // Default to true if undefined
      seoTitle || null,
      seoDescription || null,
      featuredImage || null,
      slug,
      newSlug || null,
      hero !== undefined ? hero : null,
      subtitle || null,
    ];

    const result = await queryOne(sql, params_array);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }
    
    // Send newsletter notification if publishing for the first time and sendNewsletter is true
    if (isPublishing && (sendNewsletter !== false && (sendNewsletter || existingPost?.send_newsletter !== false))) {
      try {
        const subscribers = await query(
          "SELECT email FROM newsletter_subscribers WHERE status = 'active'"
        );
        
        if (subscribers.length > 0) {
          const subscriberEmails = subscribers.map((s: any) => s.email);
          await sendPostUpdateNotification(subscriberEmails, {
            title: result.title,
            slug: result.slug,
            excerpt: result.excerpt || '',
            url: `${siteUrl}/post/${result.slug}`,
          });
        }
      } catch (newsletterError: any) {
        console.error('Failed to send newsletter notification:', newsletterError);
        // Don't fail the post update if newsletter fails
      }
    }
    
    // Transform to camelCase before returning
    const transformedResult = {
      ...result,
      publishedAt: result.published_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      featuredImage: result.featured_image,
      seoTitle: result.seo_title,
      seoDescription: result.seo_description,
      sendNewsletter: result.send_newsletter,
    };
    
    return NextResponse.json(transformedResult);
  } catch (error: any) {
    console.error('Post API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!canModifyPosts(user)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or editor access required.' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    // 1. Fetch post before deleting to get asset URLs
    const getSql = 'SELECT content, html_content, featured_image FROM posts WHERE slug = $1 OR id::text = $1';
    const post = await queryOne(getSql, [slug]);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 2. Extract all image URLs
    const assetUrls: string[] = [];
    
    // Add featured image
    if (post.featured_image) {
      assetUrls.push(post.featured_image);
    }

    // Extract from content and html_content
    if (post.content) {
      assetUrls.push(...extractImageUrls(post.content));
    }
    if (post.html_content) {
      assetUrls.push(...extractImageUrls(post.html_content));
    }

    // De-duplicate URLs
    const uniqueUrls = Array.from(new Set(assetUrls));

    // 3. Delete files from Tigris
    if (uniqueUrls.length > 0) {
      console.log(`Found ${uniqueUrls.length} assets to delete for post ${slug}`);
      await Promise.all(uniqueUrls.map(url => deleteFile(url)));
    }

    // 4. Delete post from database
    const deleteSql = 'DELETE FROM posts WHERE slug = $1 OR id::text = $1 RETURNING id';
    const result = await queryOne(deleteSql, [slug]);
    
    return NextResponse.json({ success: true, deletedAssets: uniqueUrls.length });
  } catch (error: any) {
    console.error('Post API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

