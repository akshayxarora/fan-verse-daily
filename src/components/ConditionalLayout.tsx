'use client';

// Conditional layout wrapper that hides Navigation and Footer on admin pages
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// import SignupModal from '@/components/SignupModal'; // TODO: Re-enable newsletter popup modal - see Future Plans.md
import { ClientOnly } from '@/components/ClientOnly';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname === '/login';

  return (
    <>
      {!isAdminRoute && <Navigation />}
      {children}
      {!isAdminRoute && <Footer />}
      {/* Newsletter Signup Modal - temporarily disabled
      {!isAdminRoute && (
        <ClientOnly>
          <SignupModal />
        </ClientOnly>
      )}
      */}
    </>
  );
}

