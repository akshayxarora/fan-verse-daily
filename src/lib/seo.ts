// SEO utilities for generating sitemaps, robots.txt, and JSON-LD

import type { Post as SchemaPost, Tool } from './db/schema.js';

// Flexible Post type that accepts both Date and string for date fields
type Post = Omit<SchemaPost, 'publishedAt' | 'createdAt' | 'updatedAt' | 'scheduledAt'> & {
  publishedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  scheduledAt?: Date | string;
};

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: string;
  twitterHandle?: string;
  image?: string;
}

/**
 * Helper to convert date to ISO string (handles both Date objects and strings)
 */
function toISOString(date: Date | string | undefined | null): string {
  if (!date) return new Date().toISOString();
  if (typeof date === 'string') {
    // If it's already an ISO string, return it; otherwise parse it
    return date.includes('T') ? date : new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generatePostJsonLd(post: Post, siteConfig: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    image: post.featuredImage || siteConfig.image || '',
    datePublished: toISOString(post.publishedAt) || toISOString(post.createdAt),
    dateModified: toISOString(post.updatedAt),
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.title,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${post.type}/${post.slug}`,
    },
  };
}

/**
 * Generate JSON-LD structured data for the website
 */
export function generateWebsiteJsonLd(siteConfig: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate sitemap XML
 */
export function generateSitemap(
  posts: Post[],
  tools: Tool[],
  siteConfig: SiteConfig,
  additionalPaths: string[] = []
): string {
  const baseUrl = siteConfig.url;
  const now = new Date().toISOString();

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
    { loc: baseUrl, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/blog`, lastmod: now, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/playbooks`, lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/tools`, lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/about`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
  ];

  // Add posts
  posts
    .filter((post) => post.status === 'published' && post.publishedAt)
    .forEach((post) => {
      urls.push({
        loc: `${baseUrl}/${post.type}/${post.slug}`,
        lastmod: toISOString(post.updatedAt),
        changefreq: 'monthly',
        priority: post.featured ? '0.8' : '0.7',
      });
    });

  // Add tools
  tools.forEach((tool) => {
    urls.push({
      loc: `${baseUrl}/tools/${tool.slug}`,
      lastmod: toISOString(tool.updatedAt),
      changefreq: 'monthly',
      priority: '0.7',
    });
  });

  // Add additional paths
  additionalPaths.forEach((path) => {
    urls.push({
      loc: `${baseUrl}${path}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.6',
    });
  });

  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(siteConfig: SiteConfig, disallowPaths: string[] = []): string {
  const disallowEntries = disallowPaths.map((path) => `Disallow: ${path}`).join('\n');
  const sitemapUrl = `${siteConfig.url}/sitemap.xml`;

  return `User-agent: *
${disallowEntries ? disallowEntries + '\n' : ''}
Sitemap: ${sitemapUrl}
`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

