import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | FanverseDaily',
  description: 'Read the terms and conditions for using FanverseDaily.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12">Last updated: February 2025</p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-foreground mb-8">
            Welcome to FanverseDaily. By accessing and using our website, you agree
            to be bound by these terms of service.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using FanverseDaily, you agree to comply with and be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use our website.
          </p>

          <h2>Use of Content</h2>
          <p>
            All content on FanverseDaily, including articles, images, graphics,
            and logos, is protected by copyright and other intellectual property
            laws. You may:
          </p>
          <ul>
            <li>Read and share our content for personal, non-commercial purposes</li>
            <li>Link to our articles with proper attribution</li>
            <li>Quote brief excerpts with attribution and a link back to the original</li>
          </ul>
          <p>You may not:</p>
          <ul>
            <li>Reproduce, distribute, or republish our content without permission</li>
            <li>Use our content for commercial purposes without authorization</li>
            <li>Remove or alter any copyright notices or attributions</li>
            <li>Scrape or automatically collect our content</li>
          </ul>

          <h2>User Conduct</h2>
          <p>When using our website, you agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt our website or servers</li>
            <li>Use automated tools to access our content without permission</li>
            <li>Impersonate any person or entity</li>
          </ul>

          <h2>Comments and User Submissions</h2>
          <p>
            If we allow user comments or submissions, you are responsible for any
            content you post. By submitting content, you grant us a non-exclusive,
            royalty-free license to use, reproduce, and display that content. We
            reserve the right to remove any content that violates these terms.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the content, privacy policies, or practices of these
            external sites. Visiting third-party links is at your own risk.
          </p>

          <h2>Disclaimer</h2>
          <p>
            FanverseDaily provides news and entertainment content for informational
            purposes. While we strive for accuracy, we make no warranties about the
            completeness, reliability, or accuracy of our content. Any reliance you
            place on our content is at your own risk.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, FanverseDaily shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of our website or content.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be
            effective immediately upon posting. Your continued use of the website
            after changes constitutes acceptance of the new terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with
            applicable laws, without regard to conflict of law principles.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these terms, please contact us at{' '}
            <a href="mailto:legal@fanversedaily.com">legal@fanversedaily.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
