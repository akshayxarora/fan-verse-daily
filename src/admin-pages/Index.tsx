// Blog-focused landing page
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { postsApi } from "@/lib/api/client";
import { Clock, Calendar, ArrowRight, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NewsletterForm from "@/components/NewsletterForm";

const Index = () => {
  // Type for post
  type Post = {
    id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    excerpt?: string;
    publishedAt?: string;
    createdAt?: string;
    readTime?: number;
    tags?: string[];
  };

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', 'featured'],
    queryFn: async () => {
      const result = await postsApi.getAll({ status: 'published', limit: 6 });
      return Array.isArray(result) ? result : [];
    },
  });

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-6xl">
          {/* Blog Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-foreground">GTM Engineering</span>
              <br />
              <span className="text-primary">Blog & Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Technical deep-dives, systems breakdowns, and real-world GTM engineering insights.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <article className="mb-16">
              <Link to={`/post/${featuredPost.slug}`}>
                <div className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all">
                  {featuredPost.featuredImage && (
                    <div className="aspect-video w-full overflow-hidden bg-secondary">
                      <img
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs">
                        Featured
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime || 5} min read
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-lg text-muted-foreground mb-6">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-primary font-medium">
                      Read more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Recent Posts Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Recent Posts</h2>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {recentPosts.map((post: any) => (
                  <Link key={post.slug} to={`/post/${post.slug}`}>
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
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
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
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs"
                              >
                                <Tag className="w-3 h-3" />
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
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No posts yet. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Newsletter CTA */}
          <div className="border-t border-border pt-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Get the latest GTM engineering insights delivered to your inbox.
              </p>
              <NewsletterForm source="homepage" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
