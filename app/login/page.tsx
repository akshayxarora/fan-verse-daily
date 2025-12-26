import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login | MarketingWithVibes',
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: false,
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16 pb-16">
      <LoginForm />
    </main>
  );
}
