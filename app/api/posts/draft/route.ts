// Next.js API route for draft-only post submissions
// This endpoint always creates posts as drafts, regardless of the status sent
// Requires X-API-Key header for authentication
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';
import { renderMarkdown } from '@/lib/markdown';
import { verifyApiKey } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    if (!verifyApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Valid X-API-Key header required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      slug,
      content,
      excerpt,
      type,
      tags,
      featured,
      seoTitle,
      seoDescription,
      featuredImage,
    } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingPost = await query('SELECT id FROM posts WHERE slug = $1', [slug]);
    if (existingPost.length > 0) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    let htmlContent = '';
    try {
      // Check if content is already HTML
      const isHtml =
        (content || '').includes('<p>') ||
        (content || '').includes('<div>') ||
        (content || '').includes('<h1>') ||
        (content || '').includes('<pre>');

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

    const sql = `
      INSERT INTO posts (
        title,
        subtitle,
        slug,
        content,
        html_content,
        excerpt,
        type,
        status,
        tags,
        featured,
        hero,
        send_newsletter,
        seo_title,
        seo_description,
        featured_image,
        published_at,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', $8::text[], $9, FALSE, TRUE, $10, $11, $12, NULL, NOW(), NOW())
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
      Array.isArray(tags) ? tags : [],
      featured || false,
      seoTitle || null,
      seoDescription || null,
      featuredImage || null,
    ];

    const result = await query(sql, params);
    const newPost = result[0];

    // Transform to camelCase before returning
    const transformedPost = {
      id: newPost.id,
      title: newPost.title,
      subtitle: newPost.subtitle,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      type: newPost.type,
      status: newPost.status,
      tags: newPost.tags,
      featured: newPost.featured,
      featuredImage: newPost.featured_image,
      seoTitle: newPost.seo_title,
      seoDescription: newPost.seo_description,
      createdAt: newPost.created_at,
      updatedAt: newPost.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: 'Draft created successfully. A writer will review and publish it.',
      post: transformedPost,
    });
  } catch (error: any) {
    console.error('Draft API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
