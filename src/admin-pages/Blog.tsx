import { motion } from "framer-motion";
import { Newspaper, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { postsApi } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import NewsletterForm from "@/components/NewsletterForm";

const Blog = () => {
  // Type for post
  type Post = {
    id: string;
    title: string;
    slug: string;
    featured?: boolean;
  };

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', 'post'],
    queryFn: async () => {
      const result = await postsApi.getAll({ type: 'post', status: 'published' });
      return Array.isArray(result) ? result : [];
    },
  });

  const featuredPosts = posts?.filter((p) => p.featured) || [];
  const regularPosts = posts?.filter((p) => !p.featured) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono mb-6">
              <Newspaper className="w-4 h-4" />
              Blog & POV
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Opinions backed by systems
            </h1>
            <p className="text-lg text-muted-foreground">
              Hot takes, technical deep-dives, and research on GTM engineering. 
              Everything is informed by real execution, not theory.
            </p>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Featured
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                  </>
                ) : (
                  featuredPosts.map((post: any, index: number) => (
                    <Link key={post.slug} to={`/post/${post.slug}`}>
                      <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6">
                          <div className="flex items-center gap-3 mb-4">
                            {post.tags && post.tags.length > 0 && (
                              <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary">
                                {post.tags[0]}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {post.readTime || 5} min
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">All Posts</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : regularPosts.length > 0 ? (
              <div className="space-y-1">
                {regularPosts.map((post: any, index: number) => (
                  <Link key={post.slug} to={`/post/${post.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group flex items-center gap-6 p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer"
                    >
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
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </motion.article>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No posts yet. Check back soon!</p>
            )}
          </div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 p-8 rounded-lg border border-border bg-card/50 text-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">GTM Engineering Weekly</h3>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              One email per week with systems breakdowns, tool releases, and unfiltered GTM takes.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
