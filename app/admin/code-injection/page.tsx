'use client';

// Admin code injection page - client-side only
// Prevent static generation
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import CodeInjectionClient from '@/admin-pages/admin/CodeInjection';

export default function CodeInjectionPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering on client
  if (!mounted) {
    return null;
  }

  return <CodeInjectionClient />;
}

