import { MetadataRoute } from 'next';
import { postsApiServer } from '@/lib/api/server';

export const revalidate = 60; // Revalidate sitemap every 60 seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://marketingwithvibes.com';

  // Fetch all published posts
  const posts = await postsApiServer.getAll({ status: 'published' });

  // Map posts to sitemap entries
  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [...staticPages, ...postEntries];
}

