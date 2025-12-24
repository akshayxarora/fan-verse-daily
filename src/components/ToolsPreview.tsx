import { motion } from "framer-motion";
import { Wrench, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    name: "ICP Scorer",
    description: "Score leads against your ideal customer profile with AI.",
    access: "free",
    uses: "2.4k",
  },
  {
    name: "Email Sequence Builder",
    description: "Generate personalized outbound sequences in seconds.",
    access: "paid",
    uses: "1.8k",
  },
  {
    name: "Tech Stack Detector",
    description: "Identify technologies used by any company.",
    access: "free",
    uses: "5.2k",
  },
  {
    name: "Pipeline Calculator",
    description: "Model pipeline coverage and velocity scenarios.",
    access: "free",
    uses: "3.1k",
  },
];

const ToolsPreview = () => {
  return (
    <section className="py-24 relative bg-secondary/20">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-primary/30 bg-primary/5">
              <Wrench className="w-3 h-3 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider">
                Tools Marketplace
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              GTM tools that actually work
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Interactive tools and automations built from real GTM workflows.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            View All Tools
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        {/* Tools List */}
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-secondary/30 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-mono text-sm text-primary">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    {tool.access === "paid" && (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                  {tool.uses} uses
                </span>
                <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                  Launch
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsPreview;
