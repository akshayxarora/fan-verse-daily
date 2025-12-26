// Next.js API route for analytics
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';
import jwt from 'jsonwebtoken';

// Verify admin authentication
async function verifyAdmin(request: NextRequest): Promise<{ valid: boolean; userId?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await queryOne('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!user || user.role !== 'admin') {
      return { valid: false };
    }

    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false };
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const postId = searchParams.get('postId');

    if (type === 'global') {
      // Global analytics
      const totalPosts = await queryOne('SELECT COUNT(*) as count FROM posts');
      const publishedPosts = await queryOne("SELECT COUNT(*) as count FROM posts WHERE status = 'published'");
      const totalViews = await queryOne('SELECT COALESCE(SUM(views), 0) as total FROM posts');
      const totalSubscribers = await queryOne('SELECT COUNT(*) as count FROM newsletter_subscribers');
      const activeSubscribers = await queryOne("SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'");

      // Top performing posts
      const topPosts = await query(
        "SELECT id, title, slug, views, published_at FROM posts WHERE status = 'published' ORDER BY views DESC LIMIT 5"
      );

      return NextResponse.json({
        global: {
          totalPosts: parseInt(totalPosts?.count || '0'),
          publishedPosts: parseInt(publishedPosts?.count || '0'),
          totalViews: parseInt(totalViews?.total || '0'),
          totalSubscribers: parseInt(totalSubscribers?.count || '0'),
          activeSubscribers: parseInt(activeSubscribers?.count || '0'),
        },
        topPosts: topPosts.map((p: any) => ({
          ...p,
          publishedAt: p.published_at,
        })),
      });
    } else if (type === 'post' && postId) {
      // Post-level analytics
      const post = await queryOne('SELECT * FROM posts WHERE id = $1', [postId]);
      
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        post: {
          id: post.id,
          title: post.title,
          views: post.views || 0,
          status: post.status,
          publishedAt: post.published_at,
          createdAt: post.created_at,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type or missing postId' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Increment views safely
    await query(
      'UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = $1',
      [postId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('View increment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

