// SEO component for meta tags and structured data
import { Helmet } from 'react-helmet-async';
import type { Post } from '@/lib/db/schema';
import { generatePostJsonLd, generateWebsiteJsonLd } from '@/lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  post?: Post;
  siteConfig?: {
    title: string;
    description: string;
    url: string;
    author: string;
    twitterHandle?: string;
    image?: string;
  };
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  post,
  siteConfig,
}: SEOProps) {
  const defaultSiteConfig = {
    title: 'FanverseDaily',
    description: 'GTM Engineering Blog and Resources',
    url: import.meta.env.NEXT_PUBLIC_SITE_URL || 'https://fanversedaily.com',
    author: 'FanverseDaily',
    ...siteConfig,
  };

  const pageTitle = title
    ? `${title} | ${defaultSiteConfig.title}`
    : defaultSiteConfig.title;
  const pageDescription = description || defaultSiteConfig.description;
  const pageImage = image || post?.featuredImage || defaultSiteConfig.image || `${defaultSiteConfig.url}/og-image.png`;
  const pageUrl = url || (post ? `${defaultSiteConfig.url}/${post.type}/${post.slug}` : defaultSiteConfig.url);

  const jsonLd = post
    ? generatePostJsonLd(post, defaultSiteConfig)
    : generateWebsiteJsonLd(defaultSiteConfig);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content={defaultSiteConfig.author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />

      {/* Twitter */}
      {defaultSiteConfig.twitterHandle && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={pageUrl} />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={pageImage} />
          <meta name="twitter:creator" content={`@${defaultSiteConfig.twitterHandle}`} />
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

