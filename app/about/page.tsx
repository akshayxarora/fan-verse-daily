import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | MarketingWithVibes',
  description: 'GTM engineer and product-led growth practitioner focusing on building leverage through systems.',
  alternates: {
    canonical: '/about',
  },
};

// About page with SSR
export default function AboutPage() {
  return (
    <main className="pt-24 pb-16 overflow-hidden">
  <div className="container px-4 md:px-6 max-w-6xl">
    <h1 className="text-4xl md:text-5xl font-bold mb-12 text-left md:text-left">
      About
    </h1>

    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Text Content */}
      <div
        className="
          prose prose-lg dark:prose-invert max-w-none
          relative z-10
          text-center md:text-left
          mx-auto md:mx-0
        "
      >
        {/* <p className="text-xl font-medium mb-6">
          Engineering GTM systems for AI-native startups.
        </p> */}

        <p className="text-foreground mb-6">
          <strong>MarketingWithVibes</strong> is a personal headspace where I think, write, and
          document how modern go-to-market systems are actually built - with
          code, automation, data, and leverage.
        </p>

        <p className="text-muted-foreground mb-6">
          I am <strong>Kuldeep Paul</strong>, a GTM engineer and product-led
          growth practitioner. I work at the intersection of product,
          engineering, and marketing, where automation, data, and distribution
          come together to create repeatable growth.
        </p>

        <p className="text-muted-foreground mb-6">
          Over the years, I have built SEO automation pipelines, AI-driven
          content engines, evaluation-first growth loops, and internal tools
          that help teams move faster without sacrificing quality.
        </p>

        <p className="text-muted-foreground mb-6">
          This is not a playbook, an agency site, or a collection of generic
          advice. Think of it as a working notebook - real systems, real
          experiments, and real learnings shared openly as they evolve.
        </p>

        <p className="text-muted-foreground mb-8">
          If you care about fundamentals, sustainable growth, and building
          leverage through systems, you will likely feel at home here.
        </p>

        <p className="text-muted-foreground">
          I share ideas, experiments, and unfinished thoughts on{" "}
          <a
            href="https://www.linkedin.com/in/kuldeep-paul/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            LinkedIn
          </a>.
        </p>
      </div>

      {/* Image Section */}
      <div
        className="
          relative
          w-full
          h-[260px] sm:h-[320px]
          md:h-[420px] lg:h-[520px]
          flex
          justify-center md:justify-end
        "
      >
        {/* Subtle fade - desktop only */}
        <div className="hidden md:block absolute inset-0 z-10 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />

        {/* Image */}
        <img
          src="https://mwv-bucket.t3.storage.dev/Kuldeep-Image.jpg"
          alt="Kuldeep Paul"
          className="
            md:absolute
            md:right-[-6%] lg:right-[-10%]
            top-0
            h-full
            w-auto
            max-w-full
            object-cover
            rounded-3xl
            shadow-2xl
          "
        />
      </div>
    </div>
  </div>
</main>



  );
}

