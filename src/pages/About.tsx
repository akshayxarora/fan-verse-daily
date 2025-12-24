import { motion } from "framer-motion";
import { User, Target, Zap, BookOpen, Mail, Linkedin, Twitter } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
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
              <User className="w-4 h-4" />
              About
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Engineering-first GTM for the AI era
            </h1>
            <p className="text-lg text-muted-foreground">
              MarketingWithVibes is where GTM systems get built, documented, and distributed.
              Not a blog. Not a course. A working infrastructure layer for growth.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-20"
          >
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">The Problem</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Most GTM content is useless. It's either too high-level to implement or too vendor-specific to trust.
                    Meanwhile, the teams actually winning are building custom systems—but keeping them internal.
                  </p>
                  <p>
                    The result: a massive gap between what's possible and what's accessible. 
                    Growth engineers rebuild the same infrastructure over and over. 
                    Founders waste months on playbooks that don't fit their context.
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">The Solution</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    MarketingWithVibes documents real GTM systems—the actual infrastructure, not the strategy decks.
                    Every playbook comes with implementation details. Every system includes the code.
                  </p>
                  <p>
                    It's the reference library for GTM engineering. Built by operators, for operators.
                    The goal isn't to teach—it's to accelerate.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Principles */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-8">Core Principles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Systems Over Content",
                  description: "We don't write thought leadership. We document working infrastructure that you can deploy today.",
                },
                {
                  icon: Zap,
                  title: "Engineering-First",
                  description: "GTM is a technical discipline. Our work is built for people who ship, not people who tweet.",
                },
                {
                  icon: BookOpen,
                  title: "Open Knowledge",
                  description: "The best GTM systems shouldn't be locked in internal wikis. We're building the public record.",
                },
              ].map((principle, index) => (
                <div
                  key={principle.title}
                  className="p-6 rounded-lg border border-border bg-card/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <principle.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* What We Offer */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-8">What You Get</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">GTM Playbooks</h3>
                  <p className="text-muted-foreground">
                    Complete, documented systems for specific GTM motions. From cold outbound to PLG activation.
                    Each includes implementation guides and real metrics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Automation Systems</h3>
                  <p className="text-muted-foreground">
                    Production-ready automation workflows with architecture diagrams, 
                    code snippets, and deployment guides. Built on n8n, Make, and custom infrastructure.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Tools Marketplace</h3>
                  <p className="text-muted-foreground">
                    Interactive tools for GTM tasks—ICP scoring, email generation, workflow building.
                    Use them directly in your browser or integrate via API.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Advisory & Consulting</h3>
                  <p className="text-muted-foreground">
                    For teams that need hands-on help building GTM infrastructure.
                    Strategy, implementation, and ongoing optimization.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center p-8 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-semibold text-foreground mb-2">Let's connect</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Have a GTM challenge? Building something interesting? Just want to chat systems?
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
                <Button variant="default" size="sm" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
