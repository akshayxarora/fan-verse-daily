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
  const description = settings['site_meta_description'] || 'Your ultimate source for entertainment news - Gaming, Movies, TV, Anime & Pop Culture.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanversedaily.com';

  return {
    metadataBase: new URL(siteUrl),
    title: 'FanverseDaily | Entertainment News for Fans',
    description,
    keywords: 'gaming news, movie news, TV shows, anime, entertainment, pop culture, gaming, movies, wrestling',
    authors: [{ name: 'FanverseDaily' }],
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: '/icon.svg',
      apple: '/icon.svg',
    },
    openGraph: {
      type: 'website',
      title: 'FanverseDaily | Entertainment News for Fans',
      description,
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FanverseDaily | Entertainment News for Fans',
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

