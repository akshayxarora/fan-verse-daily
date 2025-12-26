// Next.js API route for specific setting
import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db/client';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const setting = await queryOne('SELECT * FROM settings WHERE key = $1', [key]);
    
    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      type: setting.type,
      group: setting.group_name,
      updatedAt: setting.updated_at,
    });
  } catch (error: any) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await params;
    const body = await request.json();
    const { value, type, group } = body;

    const sql = `
      UPDATE settings SET
        value = $1,
        type = COALESCE($2, type),
        group_name = COALESCE($3, group_name),
        updated_at = NOW()
      WHERE key = $4
      RETURNING *
    `;

    const result = await queryOne(sql, [value, type || null, group || null, key]);
    
    if (!result) {
      // If not exists, create it
      const insertSql = `
        INSERT INTO settings (key, value, type, group_name, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      const inserted = await queryOne(insertSql, [key, value, type || 'string', group || 'general']);
      return NextResponse.json({
        id: inserted.id,
        key: inserted.key,
        value: inserted.value,
        type: inserted.type,
        group: inserted.group_name,
        updatedAt: inserted.updated_at,
      });
    }
    
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

