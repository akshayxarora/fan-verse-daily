// Home page with SSR - FanverseDaily Entertainment News
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { postsApiServer, settingsApiServer } from '@/lib/api/server';
import { generateWebsiteJsonLd } from '@/lib/seo';
import NewsletterForm from '@/components/NewsletterForm';
import { ClientOnly } from '@/components/ClientOnly';

export const revalidate = 60; // Revalidate every 60 seconds

// Category filter pills data - these scroll to sections
const categoryFilters = [
  { label: "Latest Stories", anchor: "latest-stories" },
  { label: "Gaming", anchor: "gaming" },
  { label: "Movies", anchor: "movies" },
  { label: "TV Shows", anchor: "tv" },
  { label: "Anime", anchor: "anime" },
  { label: "Wrestling", anchor: "wrestling" },
];

// Category sections to display on homepage
const categorySections = [
  { title: "Gaming Hub", category: "Gaming", slug: "gaming", id: "gaming" },
  { title: "Movies", category: "Movies", slug: "movies", id: "movies" },
  { title: "TV & Streaming", category: "TV Shows", slug: "tv", id: "tv" },
  { title: "Anime Spotlight", category: "Anime", slug: "anime", id: "anime" },
  { title: "Wrestling Universe", category: "Wrestling", slug: "wrestling", id: "wrestling" },
];

export default async function HomePage() {
  // Fetch settings
  const settings = await settingsApiServer.getAll();

  // Fetch hero post
  const heroPosts = await postsApiServer.getAll({ status: 'published', hero: true, limit: 1 });
  const heroPost = heroPosts[0];

  // Fetch all posts
  const allPosts = await postsApiServer.getAll({ status: 'published', limit: 50 });

  let featuredPost = heroPost;
  let otherPosts = allPosts;

  if (heroPost) {
    otherPosts = allPosts.filter(p => p.id !== heroPost.id);
  } else {
    featuredPost = allPosts[0];
    otherPosts = allPosts.slice(1);
  }

  // Group posts by category
  const postsByCategory: Record<string, typeof allPosts> = {};
  categorySections.forEach(section => {
    postsByCategory[section.category] = otherPosts.filter(
      post => post.tags && post.tags.some((tag: string) =>
        tag.toLowerCase() === section.category.toLowerCase() ||
        tag.toLowerCase() === section.slug.toLowerCase()
      )
    ).slice(0, 3);
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://fanversedaily.com';
  const siteConfig = {
    title: 'FanverseDaily',
    description: 'Your ultimate source for entertainment news - Gaming, Movies, TV, Anime & more',
    url: siteUrl,
    author: 'FanverseDaily',
  };

  const jsonLd = generateWebsiteJsonLd(siteConfig);

  // Default hero image if no featured post
  const heroImage = featuredPost?.featuredImage || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=800&fit=crop';

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-20 pb-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero Section */}
          <div className="px-4 py-6">
            <div className="relative overflow-hidden rounded-xl">
              <Link href={featuredPost ? `/post/${featuredPost.slug}` : '/blog'}>
                <div
                  className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-6 pb-12 md:px-12 transition-transform duration-700 hover:scale-[1.01]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15, 20, 25, 0.1) 0%, rgba(15, 20, 25, 0.9) 100%), url("${heroImage}")`
                  }}
                >
                  <div className="flex flex-col gap-3 text-left max-w-2xl">
                    <span className="bg-primary px-3 py-1 rounded text-white text-xs font-black uppercase w-fit tracking-wider">
                      Breaking News
                    </span>
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl uppercase">
                      {featuredPost?.title || 'Welcome to FanverseDaily'}
                    </h1>
                    <p className="text-gray-300 text-lg font-normal leading-relaxed">
                      {featuredPost?.excerpt || 'Your ultimate source for entertainment news - Gaming, Movies, TV, Anime & more.'}
                    </p>
                  </div>
                  <span className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold tracking-[0.015em] hover:scale-105 transition-transform">
                    Read Full Story
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Category Filter Pills - Scroll to sections */}
          <div className="px-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-3 py-2 flex-nowrap items-center">
              {categoryFilters.map((filter, index) => (
                <a
                  key={filter.anchor}
                  href={`#${filter.anchor}`}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-5 cursor-pointer transition-colors ${
                    index === 0
                      ? 'bg-primary text-white'
                      : 'bg-card text-foreground hover:bg-secondary border border-border'
                  }`}
                >
                  <p className={`text-sm uppercase tracking-wide ${index === 0 ? 'font-bold' : 'font-semibold'}`}>
                    {filter.label}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="px-4 py-12 flex flex-col gap-16">

            {/* Latest Stories Section with Sidebar - FIRST */}
            <section id="latest-stories" className="scroll-mt-24">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Latest Stories Grid */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Latest Stories</h2>
                    <Link href="/blog" className="text-primary text-sm font-bold hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherPosts.slice(0, 4).map((post) => (
                      <Link key={post.slug} href={`/post/${post.slug}`}>
                        <article className="flex flex-col gap-3 group">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-border">
                            {post.featuredImage ? (
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url("${post.featuredImage}")` }}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-secondary" />
                            )}
                            {post.tags && post.tags[0] && (
                              <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tight">
                                {post.tags[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-foreground text-lg font-bold leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{post.readTime || 5} min read</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-80 shrink-0">
                  {/* Trending Now */}
                  <div className="bg-card rounded-xl p-6 border border-border mb-8">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Trending Now
                    </h3>
                    <div className="flex flex-col gap-6">
                      {otherPosts.slice(0, 3).map((post, index) => (
                        <Link key={post.slug} href={`/post/${post.slug}`}>
                          <div className="flex gap-4 items-start group cursor-pointer">
                            <span className="text-3xl font-black text-primary/20 group-hover:text-primary transition-colors">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-bold leading-tight group-hover:underline line-clamp-2">
                                {post.title}
                              </p>
                              {post.tags && post.tags[0] && (
                                <span className="text-[10px] font-black text-accent uppercase">
                                  {post.tags[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="bg-primary rounded-xl p-6 text-white">
                    <h3 className="text-lg font-black uppercase mb-2">Join the Fanverse</h3>
                    <p className="text-sm mb-4 opacity-90 leading-snug">
                      Get daily updates on movies, games, and more right in your inbox.
                    </p>
                    <ClientOnly>
                      <NewsletterForm
                        source="homepage-sidebar"
                        variant="compact"
                      />
                    </ClientOnly>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Sections */}
            {categorySections.map((section) => {
              const sectionPosts = postsByCategory[section.category];
              if (!sectionPosts || sectionPosts.length === 0) return null;

              return (
                <section key={section.slug} id={section.id} className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{section.title}</h2>
                    <Link href={`/blog?category=${section.slug}`} className="text-primary text-sm font-bold hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sectionPosts.map((post) => (
                      <Link key={post.slug} href={`/post/${post.slug}`}>
                        <article className="bg-card rounded-lg overflow-hidden group border border-border hover:border-primary/50 transition-all">
                          <div className="relative aspect-video overflow-hidden">
                            {post.featuredImage ? (
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url("${post.featuredImage}")` }}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-secondary" />
                            )}
                          </div>
                          <div className="p-5 flex flex-col gap-2">
                            <h3 className="text-foreground text-lg font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

          </div>
        </div>
      </main>
    </>
  );
}
