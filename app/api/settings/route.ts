// Next.js API route for all settings
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
    const settings = await query('SELECT * FROM settings ORDER BY group_name, key');
    
    // Transform to camelCase and group by group_name
    const transformedSettings = settings.map((s: any) => ({
      id: s.id,
      key: s.key,
      value: s.value,
      type: s.type,
      group: s.group_name,
      updatedAt: s.updated_at,
    }));
    
    return NextResponse.json(transformedSettings);
  } catch (error: any) {
    console.error('Settings API error:', error);
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
    const { key, value, type, group } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    const sql = `
      INSERT INTO settings (key, value, type, group_name, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        type = COALESCE(EXCLUDED.type, settings.type),
        group_name = COALESCE(EXCLUDED.group_name, settings.group_name),
        updated_at = NOW()
      RETURNING *
    `;

    const result = await queryOne(sql, [key, value, type || 'string', group || 'general']);
    
    return NextResponse.json({
      id: result.id,
      key: result.key,
      value: result.value,
      type: result.type,
      group: result.group_name,
      updatedAt: result.updated_at,
    });
  } catch (error: any) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

