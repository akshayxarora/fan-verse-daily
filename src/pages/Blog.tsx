import { motion } from "framer-motion";
import { Newspaper, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const posts = [
  {
    slug: "death-of-sdrs",
    title: "The Death of SDRs (And What Replaces Them)",
    excerpt: "AI isn't just changing sales—it's eliminating entire roles. Here's what the new GTM org looks like and why most companies aren't ready.",
    readTime: "8 min",
    date: "Dec 20, 2024",
    category: "POV",
    featured: true,
  },
  {
    slug: "cold-email-deliverability-2025",
    title: "Cold Email Deliverability in 2025: The Technical Playbook",
    excerpt: "Everything you need to know about domain setup, warming, and maintaining deliverability at scale. Includes infrastructure diagrams.",
    readTime: "15 min",
    date: "Dec 18, 2024",
    category: "Technical",
    featured: true,
  },
  {
    slug: "ai-first-gtm-stack",
    title: "Building an AI-First GTM Stack",
    excerpt: "A complete breakdown of the tools and workflows powering the next generation of GTM teams. From research to close.",
    readTime: "12 min",
    date: "Dec 15, 2024",
    category: "Systems",
    featured: false,
  },
  {
    slug: "product-led-sales-myth",
    title: "The Product-Led Sales Myth",
    excerpt: "Why PLG doesn't mean no sales team—and how to build the hybrid motion that actually works for technical products.",
    readTime: "10 min",
    date: "Dec 12, 2024",
    category: "POV",
    featured: false,
  },
  {
    slug: "n8n-vs-zapier-enterprise",
    title: "n8n vs Zapier for Enterprise GTM Automation",
    excerpt: "A technical comparison for teams building serious automation infrastructure. When to use what and why.",
    readTime: "11 min",
    date: "Dec 8, 2024",
    category: "Technical",
    featured: false,
  },
  {
    slug: "linkedin-algorithm-2024",
    title: "Reverse Engineering LinkedIn's 2024 Algorithm",
    excerpt: "Data from 500+ posts reveals what actually drives reach. Spoiler: it's not what the gurus tell you.",
    readTime: "9 min",
    date: "Dec 5, 2024",
    category: "Research",
    featured: false,
  },
];

const Blog = () => {
  const featuredPosts = posts.filter(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

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
          <div className="mb-16">
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary">
                        {post.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
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
                        {post.readTime}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* All Posts */}
          <div>
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">All Posts</h2>
            <div className="space-y-1">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group flex items-center gap-6 p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-primary">{post.category}</span>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </motion.article>
              ))}
            </div>
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
            <div className="flex items-center justify-center gap-3">
              <input
                type="email"
                placeholder="you@company.com"
                className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-64"
              />
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
