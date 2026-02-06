import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise With Us | FanverseDaily',
  description: 'Partner with FanverseDaily to reach engaged fans of gaming, movies, TV, anime, and pop culture.',
  alternates: {
    canonical: '/advertise',
  },
};

export default function AdvertisePage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          Advertise With Us
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-foreground mb-8">
            Connect your brand with passionate fans of gaming, movies, TV, anime,
            and pop culture. FanverseDaily offers advertising opportunities to reach
            an engaged and growing audience.
          </p>

          <h2>Our Audience</h2>
          <p>
            FanverseDaily readers are dedicated entertainment enthusiasts who actively
            seek out the latest news, reviews, and updates across:
          </p>
          <ul>
            <li><strong>Gaming & Esports</strong> — Console, PC, and mobile gaming fans</li>
            <li><strong>Movies & Film</strong> — Blockbusters, indie films, and streaming releases</li>
            <li><strong>TV & Streaming</strong> — Series premieres, reviews, and industry news</li>
            <li><strong>Anime & Manga</strong> — Japanese animation and comic enthusiasts</li>
            <li><strong>Pop Culture</strong> — Trending topics, conventions, and fan communities</li>
          </ul>

          <h2>Advertising Options</h2>
          <p>We offer various advertising formats to meet your marketing goals:</p>

          <div className="grid gap-6 not-prose my-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Display Advertising</h3>
              <p className="text-muted-foreground text-sm">
                Banner ads, sidebar placements, and in-article advertising across our site.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Sponsored Content</h3>
              <p className="text-muted-foreground text-sm">
                Native articles and branded content that resonates with our audience.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Newsletter Sponsorship</h3>
              <p className="text-muted-foreground text-sm">
                Reach subscribers directly through our email newsletter.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Custom Campaigns</h3>
              <p className="text-muted-foreground text-sm">
                Tailored advertising solutions designed for your specific needs.
              </p>
            </div>
          </div>

          <h2>Why FanverseDaily?</h2>
          <ul>
            <li>Highly engaged audience passionate about entertainment</li>
            <li>Growing readership across multiple content categories</li>
            <li>Flexible advertising options for various budgets</li>
            <li>Direct access to niche fan communities</li>
          </ul>

          <h2>Get Started</h2>
          <p>
            Interested in advertising with FanverseDaily? We'd love to discuss how
            we can help you reach your target audience.
          </p>
          <p>
            Contact our advertising team at{' '}
            <a href="mailto:ads@fanversedaily.com">ads@fanversedaily.com</a> to
            request our media kit and learn more about partnership opportunities.
          </p>
        </div>
      </div>
    </main>
  );
}
