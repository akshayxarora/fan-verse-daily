// Blog listing page with SSR
import Link from 'next/link';
import { Newspaper, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { postsApiServer, settingsApiServer } from '@/lib/api/server';
import type { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';
import { ClientOnly } from '@/components/ClientOnly';

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingsApiServer.getAll();
  const title = settings['blog_seo_title'] || 'Blog | MarketingWithVibes';
  const description = settings['blog_meta_description'] || 'Technical deep-dives and research on GTM engineering.';
  
  return {
    title,
    description,
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function BlogPage() {
  // Fetch settings
  const settings = await settingsApiServer.getAll();
  
  // Fetch posts server-side
  const posts = await postsApiServer.getAll({ type: 'post', status: 'published' });

  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono mb-6">
            <Newspaper className="w-4 h-4" />
            Blogs
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {settings['blog_title'] ? (
              <>
                <span className="text-foreground">{settings['blog_title'].split('\n')[0]}</span>
                {settings['blog_title'].split('\n')[1] && (
                  <>
                    <br />
                    <span className="text-primary">{settings['blog_title'].split('\n')[1]}</span>
                  </>
                )}
              </>
            ) : (
              'Opinions backed by systems'
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            {settings['blog_description'] || 'Hot takes, technical deep-dives, and research on GTM engineering. Everything is informed by real execution, not theory.'}
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.slug} href={`/post/${post.slug}`}>
                  <article className="group h-full border border-border rounded-lg bg-card hover:border-primary/50 transition-all overflow-hidden">
                    {post.featuredImage && (
                      <div className="aspect-video w-full overflow-hidden bg-secondary">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono">
                          Featured
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime || 5} min
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-primary text-sm font-medium">
                        Read more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">All Posts</h2>
          {regularPosts.length > 0 ? (
            <div className="space-y-1">
              {regularPosts.map((post) => (
                <Link key={post.slug} href={`/post/${post.slug}`}>
                  <article className="group flex items-center gap-6 p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-xs font-mono text-primary">{post.tags[0]}</span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime || 5} min
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {post.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 border-t border-border pt-16">
          <div className="max-w-2xl mx-auto text-center">
            <ClientOnly>
              <NewsletterForm 
                source="blog" 
                title={settings['newsletter_cta_title'] || 'Stay Updated'}
                description={settings['newsletter_cta_description'] || 'Get the latest GTM engineering insights delivered to your inbox.'}
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </main>
  );
}

