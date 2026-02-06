import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Settings | FanverseDaily',
  description: 'Manage your cookie preferences on FanverseDaily.',
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookiesPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          Cookie Settings
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-foreground mb-8">
            FanverseDaily uses cookies to improve your browsing experience and
            provide personalized content. Here you can learn about the cookies we
            use and manage your preferences.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help websites remember your preferences and understand
            how you interact with the site.
          </p>

          <h2>Types of Cookies We Use</h2>

          <div className="grid gap-6 not-prose my-8">
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Essential Cookies</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Always Active</span>
              </div>
              <p className="text-muted-foreground text-sm">
                These cookies are necessary for the website to function properly.
                They enable core features like page navigation and access to secure
                areas. The website cannot function properly without these cookies.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Analytics Cookies</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Optional</span>
              </div>
              <p className="text-muted-foreground text-sm">
                These cookies help us understand how visitors interact with our
                website by collecting and reporting information anonymously. This
                helps us improve our content and user experience.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Advertising Cookies</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Optional</span>
              </div>
              <p className="text-muted-foreground text-sm">
                These cookies are used to deliver advertisements more relevant to
                you and your interests. They may also be used to limit the number
                of times you see an ad and measure the effectiveness of advertising
                campaigns.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Functional Cookies</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Optional</span>
              </div>
              <p className="text-muted-foreground text-sm">
                These cookies enable enhanced functionality and personalization,
                such as remembering your preferences and settings. They may be set
                by us or by third-party providers whose services we use.
              </p>
            </div>
          </div>

          <h2>Managing Your Preferences</h2>
          <p>
            You can manage cookie preferences through your browser settings. Most
            browsers allow you to:
          </p>
          <ul>
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p>
            Note that blocking certain cookies may impact your experience on our
            website and limit the functionality of some features.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our
            pages. We do not control these cookies. Third parties that may set
            cookies include:
          </p>
          <ul>
            <li>Google (Analytics and Advertising)</li>
            <li>Social media platforms (for sharing features)</li>
            <li>Video hosting services (for embedded content)</li>
          </ul>

          <h2>Updates to This Policy</h2>
          <p>
            We may update our cookie practices from time to time. Any changes will
            be reflected on this page.
          </p>

          <h2>Questions?</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@fanversedaily.com">privacy@fanversedaily.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
