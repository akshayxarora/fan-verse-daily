// Dynamic post page with SSR - FanverseDaily Entertainment Style
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Share2, Bookmark, ChevronRight, Flame } from 'lucide-react';
import { postsApiServer } from '@/lib/api/server';
import { generatePostJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import ViewTracker from '@/components/ViewTracker';
import NewsletterForm from '@/components/NewsletterForm';
import { ClientOnly } from '@/components/ClientOnly';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanversedaily.com';

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

  // Fetch trending/most read posts for sidebar
  const trendingPosts = await postsApiServer.getAll({ status: 'published', limit: 3 });
  const filteredTrending = trendingPosts.filter(p => p.id !== post.id).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanversedaily.com';
  const siteConfig = {
    title: 'FanverseDaily',
    description: 'Your ultimate source for entertainment news',
    url: siteUrl,
    author: 'FanverseDaily',
  };

  // Get category from tags
  const category = post.tags?.[0] || 'News';
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  const jsonLd = generatePostJsonLd(post, siteConfig);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: category, url: `${siteUrl}/blog?category=${categorySlug}` },
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

      <main className="pt-24 pb-12">
        <ViewTracker postId={post.id} />
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/blog?category=${categorySlug}`} className="hover:text-primary transition-colors">{category}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Article</span>
          </nav>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="flex-1 max-w-3xl">
              {/* Hero Image */}
              {post.featuredImage && (
                <div className="relative w-full rounded-2xl overflow-hidden mb-8 aspect-video">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary px-3 py-1.5 rounded-md text-white text-xs font-black uppercase tracking-widest shadow-lg">
                      {category}
                    </span>
                  </div>
                </div>
              )}

              {/* Title Section */}
              <div className="mb-8">
                <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 uppercase">
                  {post.title}
                </h1>

                {/* Author & Meta Bar */}
                <div className="flex items-center gap-4 border-y border-border py-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    FD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">FanverseDaily Staff</span>
                    <span className="text-xs text-muted-foreground font-semibold uppercase">
                      Published {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })} • {post.readTime || 5} Min Read
                    </span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                prose-headings:text-foreground prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
                prose-img:rounded-xl
              ">
                {/* Lead Paragraph */}
                {post.excerpt && (
                  <p className="text-xl font-medium text-foreground mb-8 border-l-4 border-primary pl-6 not-prose">
                    {post.excerpt}
                  </p>
                )}

                {post.htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
                ) : (
                  <div className="p-12 bg-card rounded-xl text-center border border-border not-prose">
                    <p className="text-muted-foreground">No content available</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog?category=${tag.toLowerCase()}`}
                        className="px-4 py-2 rounded-lg bg-secondary text-sm font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Most Read */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" />
                    Most Read
                  </h3>
                  <div className="flex flex-col gap-6">
                    {filteredTrending.map((trendPost, index) => (
                      <Link key={trendPost.slug} href={`/post/${trendPost.slug}`}>
                        <div className="flex gap-4 group">
                          <span className="text-2xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-bold leading-tight group-hover:underline line-clamp-2">
                              {trendPost.title}
                            </p>
                            {trendPost.tags?.[0] && (
                              <span className="text-[10px] font-black text-accent uppercase">
                                {trendPost.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-primary rounded-xl p-6 text-white shadow-xl">
                  <h3 className="text-xl font-black uppercase mb-2">Join the Fanverse</h3>
                  <p className="text-sm mb-6 opacity-90 leading-snug">
                    Get daily updates on movies, games, and more right in your inbox.
                  </p>
                  <ClientOnly>
                    <NewsletterForm
                      source="post-sidebar"
                      variant="compact"
                    />
                  </ClientOnly>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

