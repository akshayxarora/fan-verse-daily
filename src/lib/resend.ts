// Resend integration for newsletters and updates
import { Resend } from 'resend';
import { getEmailLogoHTML } from './email-logo';
import { getNewsletterTemplate } from './newsletter-template';

// Resend API key - use environment variable or fallback to provided key
const RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env?.VITE_RESEND_API_KEY || 're_Wg3NzE4g_LycHjNB85zm1T7rynNk2LPRY';
const resend = new Resend(RESEND_API_KEY);

export interface NewsletterEmail {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send newsletter email to subscribers
 */
export async function sendNewsletterEmail({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'MarketingWithVibes <newsletter@marketingwithvibes.com>',
}: NewsletterEmail) {
  try {
    // Ensure from has the proper format "Name <email@domain.com>"
    const formattedFrom = from.includes('<') ? from : `MarketingWithVibes <${from}>`;

    const { data, error } = await resend.emails.send({
      from: formattedFrom,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Resend error:', error);
    throw error;
  }
}

/**
 * Send post update notification to subscribers
 */
export async function sendPostUpdateNotification(
  subscribers: string[],
  post: {
    title: string;
    slug: string;
    excerpt?: string;
    url: string;
  }
) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || import.meta.env?.VITE_SITE_URL || 'https://marketingwithvibes.com';
  
  const body = `
    <p>We've just published a new post on the GTM Engineering blog: <strong>${post.title}</strong></p>
    ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
  `;

  const html = getNewsletterTemplate({
    title: 'New Post Published',
    body,
    ctaText: 'Read Full Post',
    ctaUrl: post.url,
    unsubscribeUrl: `${siteUrl}/unsubscribe?email={{email}}`
  });

  return sendNewsletterEmail({
    to: subscribers,
    subject: `New Post: ${post.title}`,
    html,
  });
}

/**
 * Send welcome email to new subscriber
 */
export async function sendWelcomeEmail(email: string) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || import.meta.env?.VITE_SITE_URL || 'https://marketingwithvibes.com';
  
  const body = `
    <p>Thanks for subscribing to the Marketing With Vibes newsletter!</p>
    <p>You'll receive updates about new posts, GTM engineering insights, systems breakdowns, and technical deep-dives.</p>
    <p>Stay tuned for our next deep-dive!</p>
  `;

  const html = getNewsletterTemplate({
    title: 'Welcome!',
    body,
    ctaText: 'Browse Blog',
    ctaUrl: `${siteUrl}/blog`
  });

  return sendNewsletterEmail({
    to: [email],
    subject: 'Welcome to Marketing With Vibes',
    html,
  });
}

