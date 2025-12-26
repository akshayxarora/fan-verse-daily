'use client';

// Conditional layout wrapper that hides Navigation and Footer on admin pages
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SignupModal from '@/components/SignupModal';
import { ClientOnly } from '@/components/ClientOnly';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname === '/login';

  return (
    <>
      {!isAdminRoute && <Navigation />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <ClientOnly>
          <SignupModal />
        </ClientOnly>
      )}
    </>
  );
}

