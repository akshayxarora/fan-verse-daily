import { motion } from "framer-motion";
import { ArrowUpRight, Workflow, GitBranch, Boxes } from "lucide-react";

const systems = [
  {
    icon: Workflow,
    title: "Lead Scoring Engine",
    description: "Multi-signal scoring system using intent data, firmographics, and engagement patterns.",
    tags: ["n8n", "Clay", "Slack"],
    status: "Production",
  },
  {
    icon: GitBranch,
    title: "Outbound Sequencer",
    description: "AI-powered sequence builder with dynamic personalization and A/B testing.",
    tags: ["OpenAI", "Instantly", "Postgres"],
    status: "Production",
  },
  {
    icon: Boxes,
    title: "Pipeline Attribution",
    description: "Full-funnel attribution model tracking touchpoints from first touch to close.",
    tags: ["Segment", "BigQuery", "dbt"],
    status: "Beta",
  },
];

const FeaturedSystems = () => {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      <div className="container relative z-10 px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary uppercase tracking-wider">
              Featured Systems
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Battle-tested GTM infrastructure
          </h2>
          <p className="text-muted-foreground text-lg">
            Production-grade systems built from real experiments. No theory, just working code.
          </p>
        </motion.div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative gradient-border p-6 hover:bg-secondary/30 transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <system.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {system.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {system.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {system.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 text-xs font-mono text-muted-foreground bg-muted rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  system.status === "Production" ? "bg-terminal-green" : "bg-yellow-500"
                }`} />
                <span className="text-xs text-muted-foreground">{system.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSystems;
