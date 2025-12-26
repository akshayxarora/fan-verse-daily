// Next.js API route for code injections
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
      // Also allow public access if looking for enabled injections
      const searchParams = request.nextUrl.searchParams;
      const location = searchParams.get('location');
      
      if (location) {
        const injections = await query(
          'SELECT location, code FROM code_injections WHERE location = $1 AND enabled = TRUE',
          [location]
        );
        return NextResponse.json(injections);
      }
      
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const injections = await query('SELECT * FROM code_injections ORDER BY created_at DESC');
    return NextResponse.json(injections);
  } catch (error: any) {
    console.error('Code injection API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { location, code, description, enabled } = body;

    if (!location || !code) {
      return NextResponse.json(
        { error: 'Location and code are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO code_injections (location, code, description, enabled, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [location, code, description || '', enabled !== undefined ? enabled : true]
    );

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Code injection API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

