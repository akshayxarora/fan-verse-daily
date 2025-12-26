// Next.js API route for newsletter subscribers
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

    // Query subscribers from database
    const result = await query<any>(
      'SELECT id, email, status, subscribed_at, unsubscribed_at, source FROM newsletter_subscribers ORDER BY subscribed_at DESC'
    );

    // Ensure result is an array
    const subscribers = Array.isArray(result) ? result : [];
    
    const total = subscribers.length;
    const active = subscribers.filter((s: any) => s.status === 'active').length;

    return NextResponse.json({
      subscribers,
      total,
      active,
    });
  } catch (error: any) {
    console.error('Get subscribers error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await queryOne(
      'SELECT * FROM newsletter_subscribers WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO newsletter_subscribers (email, status, source, subscribed_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [email.toLowerCase(), 'active', 'admin']
    );

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Add subscriber error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Delete subscriber by email
    const result = await query(
      'DELETE FROM newsletter_subscribers WHERE email = $1 RETURNING *',
      [email.toLowerCase()]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Subscriber removed successfully' });
  } catch (error: any) {
    console.error('Delete subscriber error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

