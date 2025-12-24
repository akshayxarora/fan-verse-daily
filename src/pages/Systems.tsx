import { motion } from "framer-motion";
import { Cpu, GitBranch, Zap, Database, Mail, BarChart3, ArrowRight, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const systems = [
  {
    icon: Mail,
    title: "Cold Email Infrastructure",
    description: "Complete cold outbound stack with domain warming, deliverability monitoring, and automated sequences. Built for scale.",
    features: ["Multi-domain rotation", "Deliverability tracking", "Reply detection", "CRM sync"],
    status: "Production",
    complexity: "Advanced",
  },
  {
    icon: Database,
    title: "Lead Enrichment Pipeline",
    description: "Automated lead enrichment using multiple data providers. Enriches, scores, and routes leads based on ICP fit.",
    features: ["Multi-source enrichment", "ICP scoring", "Auto-routing", "Data validation"],
    status: "Production",
    complexity: "Intermediate",
  },
  {
    icon: BarChart3,
    title: "Content Distribution Engine",
    description: "Automated content repurposing and distribution across LinkedIn, Twitter, and newsletters. One input, multiple outputs.",
    features: ["AI repurposing", "Scheduled posting", "Engagement tracking", "A/B testing"],
    status: "Production",
    complexity: "Intermediate",
  },
  {
    icon: GitBranch,
    title: "Product-Led Onboarding",
    description: "Event-driven onboarding system that adapts based on user behavior. Increases activation rates by 40%+.",
    features: ["Behavior triggers", "Dynamic emails", "In-app guides", "Analytics"],
    status: "Beta",
    complexity: "Advanced",
  },
  {
    icon: Zap,
    title: "Intent Signal Capture",
    description: "Track and score buyer intent signals across your website, docs, and product. Route hot leads to sales instantly.",
    features: ["Real-time scoring", "Slack alerts", "CRM enrichment", "Lead routing"],
    status: "Production",
    complexity: "Intermediate",
  },
  {
    icon: Cpu,
    title: "AI SDR Workflow",
    description: "AI-powered research and personalization for outbound. Generates contextual openers at scale.",
    features: ["Company research", "Persona mapping", "Custom openers", "Quality scoring"],
    status: "Beta",
    complexity: "Advanced",
  },
];

const Systems = () => {
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
              <Cpu className="w-4 h-4" />
              GTM Systems
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Production-grade GTM infrastructure
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete automation systems with architecture docs, implementation guides, and ready-to-deploy templates.
              Built for engineers who ship.
            </p>
          </motion.div>

          {/* Systems Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system, index) => (
              <motion.div
                key={system.title}
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
                      <system.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        system.status === 'Production' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {system.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {system.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {system.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {system.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="relative flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs font-mono text-muted-foreground">
                    {system.complexity}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center p-8 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-semibold text-foreground mb-2">Need a custom system?</h3>
              <p className="text-muted-foreground mb-4">
                Get a tailored GTM automation built for your specific use case.
              </p>
              <Button variant="default">
                Book a Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Systems;
