// Dynamic post page with SSR
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { postsApiServer } from '@/lib/api/server';
import { generatePostJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import ViewTracker from '@/components/ViewTracker';

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await postsApiServer.getBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.VITE_SITE_URL || 'https://marketingwithvibes.com';

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    alternates: {
      canonical: `/post/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      images: post.featuredImage ? [post.featuredImage] : [],
      url: `${siteUrl}/post/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await postsApiServer.getBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.VITE_SITE_URL || 'https://marketingwithvibes.com';
  const siteConfig = {
    title: 'Marketing With Vibes',
    description: 'GTM Engineering Blog and Resources',
    url: siteUrl,
    author: 'Marketing With Vibes',
  };

  const jsonLd = generatePostJsonLd(post, siteConfig);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: post.type === 'post' ? 'Blog' : post.type.charAt(0).toUpperCase() + post.type.slice(1), url: post.type === 'post' ? `${siteUrl}/blog` : `${siteUrl}/${post.type}` },
    { name: post.title, url: `${siteUrl}/post/${post.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="pt-24 pb-16">
        <ViewTracker postId={post.id} />
        <article className="container px-4 md:px-6 max-w-4xl">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-12">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Header Section - Notion Style */}
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {(post.subtitle || post.excerpt) && (
              <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">
                {post.subtitle || post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs uppercase tracking-wider">
                {post.type}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime || 5} min read
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-auto">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full rounded-xl border border-border"
              />
            </div>
          )}

          {/* Content */}
          {post.htmlContent ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            />
          ) : (
            <div className="p-12 bg-muted/50 rounded-xl text-center border border-dashed border-border">
              <p className="text-muted-foreground">No content available</p>
            </div>
          )}
        </article>
      </main>
    </>
  );
}

