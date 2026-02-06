// Authentication helpers
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { queryOne } from '@/lib/db/client';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Verify JWT token from Authorization header
 * Returns the user if valid, null otherwise
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    const user = await queryOne('SELECT id, email, role FROM users WHERE id = $1', [decoded.userId]);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify API key from X-API-Key header
 * Used for external services submitting drafts
 */
export function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.DRAFT_API_KEY;

  if (!validApiKey) {
    console.warn('DRAFT_API_KEY not set in environment variables');
    return false;
  }

  return apiKey === validApiKey;
}

/**
 * Check if user has admin or editor role
 */
export function canModifyPosts(user: AuthUser | null): boolean {
  if (!user) return false;
  return ['admin', 'editor'].includes(user.role);
}
