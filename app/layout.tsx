import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import CodeInjection from '@/components/CodeInjection';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { settingsApiServer } from '@/lib/api/server';

const inter = Inter({ subsets: ['latin'] });

// Prevent static generation to avoid client component issues during build
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingsApiServer.getAll();
  const description = settings['site_meta_description'] || 'Building reliable GTM strategies powered by AI and Data-Driven Decisions.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketingwithvibes.com';
  
  return {
    metadataBase: new URL(siteUrl),
    title: 'MarketingWithVibes | Engineering-First GTM Platform',
    description,
    keywords: 'GTM, go-to-market, growth engineering, AI startups, automation, playbooks, marketing tools',
    authors: [{ name: 'MarketingWithVibes' }],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      title: 'MarketingWithVibes | Engineering-First GTM Platform',
      description,
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'MarketingWithVibes | Engineering-First GTM Platform',
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>
            <CodeInjection location="head" />
            {children}
          </ConditionalLayout>
        </Providers>
        <CodeInjection location="footer" />
      </body>
    </html>
  );
}

