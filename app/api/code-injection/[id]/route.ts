// Next.js API route for specific code injection
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';
import jwt from 'jsonwebtoken';

// Verify admin authentication
async function verifyAdmin(request: NextRequest): Promise<{ valid: boolean; userId?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return { valid: false };
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = await queryOne('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    if (!user || user.role !== 'admin') return { valid: false };
    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false };
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdmin(request);
    if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { location, code, description, enabled } = body;

    const result = await query(
      `UPDATE code_injections 
       SET location = COALESCE($1, location),
           code = COALESCE($2, code),
           description = COALESCE($3, description),
           enabled = COALESCE($4, enabled),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [location || null, code || null, description || null, enabled !== undefined ? enabled : null, id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdmin(request);
    if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await query('DELETE FROM code_injections WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

