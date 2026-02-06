import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | FanverseDaily',
  description: 'Get in touch with FanverseDaily. Send us tips, feedback, or inquiries about advertising and partnerships.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          Contact Us
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-foreground mb-8">
            We'd love to hear from you. Whether you have a news tip, feedback,
            or a business inquiry — reach out and we'll get back to you.
          </p>

          <div className="grid gap-8 md:grid-cols-2 not-prose mb-12">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">News Tips</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Got a scoop or breaking news? Send us your tips.
              </p>
              <a
                href="mailto:tips@fanversedaily.com"
                className="text-primary font-medium hover:underline"
              >
                tips@fanversedaily.com
              </a>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Questions, feedback, or just want to say hi?
              </p>
              <a
                href="mailto:hello@fanversedaily.com"
                className="text-primary font-medium hover:underline"
              >
                hello@fanversedaily.com
              </a>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Advertising</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Interested in advertising with us?
              </p>
              <a
                href="mailto:ads@fanversedaily.com"
                className="text-primary font-medium hover:underline"
              >
                ads@fanversedaily.com
              </a>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Press & Media</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Media inquiries and press requests.
              </p>
              <a
                href="mailto:press@fanversedaily.com"
                className="text-primary font-medium hover:underline"
              >
                press@fanversedaily.com
              </a>
            </div>
          </div>

          <p className="text-muted-foreground">
            We aim to respond to all inquiries within 48 hours. For urgent matters,
            please include "URGENT" in your email subject line.
          </p>
        </div>
      </div>
    </main>
  );
}
