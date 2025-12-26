'use client';

// Admin layout - client-side only
// Prevent static generation for all admin pages
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/admin-pages/admin/AdminLayout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [router]);

  if (checking && !authorized) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Verifying Credentials</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <AdminLayout>{children}</AdminLayout>;
}

