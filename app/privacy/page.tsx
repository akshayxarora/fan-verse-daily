import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | FanverseDaily',
  description: 'Learn how FanverseDaily collects, uses, and protects your personal information.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">Last updated: February 2025</p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-foreground mb-8">
            At FanverseDaily, we take your privacy seriously. This policy explains how we
            collect, use, and protect your information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Usage Data:</strong> Information about how you interact with our
              website, including pages visited, time spent, and referral sources.
            </li>
            <li>
              <strong>Device Information:</strong> Browser type, operating system,
              and device type used to access our site.
            </li>
            <li>
              <strong>Cookies:</strong> Small files stored on your device to improve
              your browsing experience and provide analytics.
            </li>
            <li>
              <strong>Newsletter Subscriptions:</strong> If you subscribe to our
              newsletter, we collect your email address.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our content and services</li>
            <li>Analyze website traffic and user behavior</li>
            <li>Send newsletters and updates (if subscribed)</li>
            <li>Serve relevant advertisements</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services for analytics, advertising, and other
            purposes. These services may collect information about your visits to
            our site and other websites. Third-party services we use may include:
          </p>
          <ul>
            <li>Google Analytics for website analytics</li>
            <li>Advertising networks for serving ads</li>
            <li>Social media platforms for sharing features</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use cookies to enhance your experience on our site. You can control
            cookie preferences through your browser settings or our cookie settings
            page. Types of cookies we use:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Object to certain processing of your data</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information.
            However, no method of transmission over the internet is 100% secure, and
            we cannot guarantee absolute security.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly
            collect personal information from children under 13.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you
            of any changes by posting the new policy on this page and updating the
            "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{' '}
            <a href="mailto:privacy@fanversedaily.com">privacy@fanversedaily.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
