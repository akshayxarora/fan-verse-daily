import { motion } from "framer-motion";
import { Wrench, Lock, Unlock, ArrowRight, Users, Zap, FileText, Target, MessageSquare, BarChart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: Target,
    name: "ICP Scorer",
    description: "Score leads against your Ideal Customer Profile. Input company data, get a weighted fit score with reasoning.",
    access: "free",
    uses: "2.4k",
    category: "Lead Qualification",
  },
  {
    icon: FileText,
    name: "Cold Email Generator",
    description: "Generate personalized cold email sequences based on prospect research. Multiple frameworks supported.",
    access: "free",
    uses: "5.1k",
    category: "Outbound",
  },
  {
    icon: MessageSquare,
    name: "LinkedIn Post Writer",
    description: "Transform ideas into engaging LinkedIn posts. Supports multiple content formats and hooks.",
    access: "free",
    uses: "3.8k",
    category: "Content",
  },
  {
    icon: BarChart,
    name: "Metrics Dashboard Builder",
    description: "Generate SQL queries and dashboard specs for common GTM metrics. Connects to your data warehouse.",
    access: "paid",
    uses: "890",
    category: "Analytics",
  },
  {
    icon: Zap,
    name: "n8n Workflow Generator",
    description: "Describe your automation in plain English, get a complete n8n workflow JSON ready to import.",
    access: "paid",
    uses: "1.2k",
    category: "Automation",
  },
  {
    icon: Users,
    name: "Persona Builder",
    description: "Build detailed buyer personas from your customer data. Includes interview questions and pain points.",
    access: "paid",
    uses: "670",
    category: "Research",
  },
];

const categories = ["All", "Outbound", "Content", "Analytics", "Automation", "Lead Qualification", "Research"];

const Tools = () => {
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
            className="max-w-3xl mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono mb-6">
              <Wrench className="w-4 h-4" />
              Tools Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              GTM tools that actually work
            </h1>
            <p className="text-lg text-muted-foreground">
              Interactive tools built from real GTM workflows. Use them directly in your browser—no setup required.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                
                <div className="relative flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <tool.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      {tool.access === 'paid' ? (
                        <span className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
                          <Lock className="w-3 h-3" />
                          Pro
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-green-500/10 text-green-400">
                          <Unlock className="w-3 h-3" />
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <span className="text-xs font-mono text-muted-foreground mb-2 block">{tool.category}</span>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="relative flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {tool.uses} uses
                  </span>
                  <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Launch
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 p-8 rounded-lg border border-dashed border-border text-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">More tools shipping weekly</h3>
            <p className="text-muted-foreground mb-4">
              Join the waitlist to get early access to new tools and updates.
            </p>
            <div className="flex items-center justify-center gap-3">
              <input
                type="email"
                placeholder="you@company.com"
                className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-64"
              />
              <Button variant="default">Notify Me</Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
