import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const playbooks = [
  {
    slug: "cold-outbound-that-converts",
    title: "Cold Outbound That Actually Converts",
    description: "A complete system for building cold email campaigns that generate replies. Includes deliverability setup, copy frameworks, and automation sequences.",
    readTime: "18 min read",
    tags: ["Outbound", "Email", "Automation"],
    featured: true,
  },
  {
    slug: "product-led-growth-foundations",
    title: "PLG Foundations for Technical Products",
    description: "How to build self-serve growth loops into technical products. Covers activation metrics, onboarding flows, and expansion triggers.",
    readTime: "24 min read",
    tags: ["PLG", "Product", "Growth"],
    featured: true,
  },
  {
    slug: "linkedin-content-engine",
    title: "The LinkedIn Content Engine",
    description: "Turn LinkedIn into a predictable lead generation channel. Content frameworks, posting cadence, and engagement automation.",
    readTime: "15 min read",
    tags: ["LinkedIn", "Content", "Social"],
    featured: false,
  },
  {
    slug: "developer-marketing-playbook",
    title: "Developer Marketing from Zero",
    description: "Reach developers where they are. Documentation-led growth, open source strategy, and community building tactics.",
    readTime: "22 min read",
    tags: ["DevRel", "Documentation", "Community"],
    featured: false,
  },
  {
    slug: "ai-startup-launch",
    title: "AI Startup Launch Sequence",
    description: "The 30-day launch playbook for AI products. Waitlist mechanics, demo strategies, and early adopter acquisition.",
    readTime: "20 min read",
    tags: ["Launch", "AI", "Waitlist"],
    featured: false,
  },
  {
    slug: "seo-for-saas",
    title: "Programmatic SEO for SaaS",
    description: "Build SEO traffic engines with templated pages. Technical implementation, content automation, and scaling strategies.",
    readTime: "28 min read",
    tags: ["SEO", "Content", "Technical"],
    featured: false,
  },
];

const Playbooks = () => {
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
              <BookOpen className="w-4 h-4" />
              GTM Playbooks
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Battle-tested GTM systems you can deploy today
            </h1>
            <p className="text-lg text-muted-foreground">
              Each playbook is a complete, documented system built from real-world execution. 
              No theory—just infrastructure you can copy, adapt, and run.
            </p>
          </motion.div>

          {/* Featured Playbooks */}
          <div className="mb-16">
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {playbooks.filter(p => p.featured).map((playbook, index) => (
                <motion.article
                  key={playbook.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <div className="relative">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      {playbook.readTime}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {playbook.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {playbook.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {playbook.tags.map(tag => (
                          <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* All Playbooks */}
          <div>
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">All Playbooks</h2>
            <div className="space-y-4">
              {playbooks.filter(p => !p.featured).map((playbook, index) => (
                <motion.article
                  key={playbook.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group flex items-start gap-6 p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {playbook.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">{playbook.readTime}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {playbook.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {playbook.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-secondary/50 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Playbooks;
