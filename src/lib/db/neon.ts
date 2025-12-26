// NeonDB integration using neonctl
// This file provides utilities for working with NeonDB

import { neon } from '@neondatabase/serverless';
import type { Post, User, Tag, NewsletterSubscriber, Setting, Theme, CodeInjection } from './schema';

// Note: fetchConnectionCache is now always enabled by default (deprecated option removed)

// Get database URL from environment
const getDatabaseUrl = () => {
  // In serverless/Vercel, only process.env is available
  // In Vite client-side, import.meta.env is available
  const url = process.env.DATABASE_URL || 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DATABASE_URL) || 
    null;
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set. Please set it in your .env file.');
  }
  return url;
};

// Create a connection pool
let sql: ReturnType<typeof neon> | null = null;

export const getDb = () => {
  if (!sql) {
    sql = neon(getDatabaseUrl());
  }
  return sql;
};

// Helper function to execute queries
// Neon serverless now requires using sql.query() for parameterized queries
export const query = async <T = any>(queryString: string, params?: any[]): Promise<T[]> => {
  const db = getDb();
  // Use sql.query() for parameterized queries with $1, $2, etc.
  return await db.query(queryString, params) as T[];
};

// Helper function to execute a single query
export const queryOne = async <T = any>(queryString: string, params?: any[]): Promise<T | null> => {
  const results = await query<T>(queryString, params);
  return results[0] || null;
};

// Helper function to execute a transaction
export const transaction = async <T>(
  callback: (tx: ReturnType<typeof neon>) => Promise<T>
): Promise<T> => {
  const db = getDb();
  // Note: Neon serverless doesn't support traditional transactions
  // For transactions, you'd need to use Neon's HTTP API or connection pooling
  return callback(db);
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

