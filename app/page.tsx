// Home page with SSR
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import { postsApiServer, settingsApiServer } from '@/lib/api/server';
import { Skeleton } from '@/components/ui/skeleton';
import { generateWebsiteJsonLd } from '@/lib/seo';
import NewsletterForm from '@/components/NewsletterForm';
import { ClientOnly } from '@/components/ClientOnly';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch settings
  const settings = await settingsApiServer.getAll();
  
  // Fetch hero post
  const heroPosts = await postsApiServer.getAll({ status: 'published', hero: true, limit: 1 });
  const heroPost = heroPosts[0];
  
  // Fetch other posts (excluding the one that might be hero)
  const allPosts = await postsApiServer.getAll({ status: 'published', limit: 10 });
  
  // If we have a hero post, filter it out from the recent posts list
  // Otherwise, the latest post becomes the "featured" (hero) post
  let featuredPost = heroPost;
  let recentPosts = allPosts;

  if (heroPost) {
    recentPosts = allPosts.filter(p => p.id !== heroPost.id).slice(0, 6);
  } else {
    featuredPost = allPosts[0];
    recentPosts = allPosts.slice(1, 7);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://marketingwithvibes.com';
  const siteConfig = {
    title: 'Marketing With Vibes',
    description: 'GTM Engineering Blog and Resources',
    url: siteUrl,
    author: 'Marketing With Vibes',
  };

  const jsonLd = generateWebsiteJsonLd(siteConfig);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-6xl">
        {/* Blog Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            {settings['home_hero_title'] ? (
              <>
                <span className="text-foreground">{settings['home_hero_title'].split('\n')[0]}</span>
                {settings['home_hero_title'].split('\n')[1] && (
                  <>
                    <br />
                    <span className="text-primary">{settings['home_hero_title'].split('\n')[1]}</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span className="text-foreground">GTM Engineering</span>
                <br />
                <span className="text-primary">Blog & Resources</span>
              </>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {settings['home_hero_description'] || 'Technical deep-dives, systems breakdowns, and real-world GTM engineering insights.'}
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <article className="mb-20">
            <Link href={`/post/${featuredPost.slug}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition-all">
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredPost.featuredImage && (
                    <div className="aspect-video md:aspect-auto h-full overflow-hidden bg-secondary">
                      <img
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[300px]"
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-semibold uppercase tracking-wider">
                        Featured Post
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 group-hover:text-primary transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-lg text-muted-foreground mb-8 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-primary font-bold group-hover:translate-x-2 transition-transform">
                      Read full story
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* Recent Posts Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              {settings['home_latest_posts_title'] || 'Latest from the blog'}
            </h2>
            {recentPosts.length > 0 && (
              <Link href="/blog" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all posts <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/post/${post.slug}`}>
                  <article className="group flex flex-col h-full border border-border rounded-xl bg-card hover:border-primary/50 transition-all overflow-hidden">
                    {post.featuredImage && (
                      <div className="aspect-video w-full overflow-hidden bg-secondary">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime || 5} min
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {post.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-secondary/10">
              <p className="text-muted-foreground text-lg">More deep-dives coming soon. Stay tuned!</p>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="border-t border-border pt-16">
          <div className="max-w-2xl mx-auto text-center">
            <ClientOnly>
              <NewsletterForm 
                source="homepage" 
                title={settings['newsletter_cta_title'] || 'Stay Updated'}
                description={settings['newsletter_cta_description'] || 'Get the latest GTM engineering insights delivered to your inbox.'}
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

