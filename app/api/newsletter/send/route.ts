// Next.js API route for sending newsletters
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';
import { Resend } from 'resend';
import { getNewsletterTemplate } from '@/lib/newsletter-template';
import jwt from 'jsonwebtoken';

// Verify admin authentication
async function verifyAdmin(request: NextRequest): Promise<{ valid: boolean; userId?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await queryOne('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!user || user.role !== 'admin') {
      return { valid: false };
    }

    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false };
  }
}

// Helper function to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

async function sendNewsletterEmail({ to, subject, html, from }: any) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  
  let actualFrom = from || process.env.RESEND_FROM_EMAIL || 'MarketingWithVibes <newsletter@marketingwithvibes.com>';
  
  // Ensure from has the proper format "Name <email@domain.com>"
  if (!actualFrom.includes('<')) {
    actualFrom = `MarketingWithVibes <${actualFrom}>`;
  }
  
  let usedTestDomain = false;

  // Fallback to Resend's test domain for unverified domains
  // Extract email from "Name <email@domain.com>" format
  const emailMatch = actualFrom.match(/<(.+)>|(\S+@\S+)/);
  const emailOnly = emailMatch ? (emailMatch[1] || emailMatch[2]) : actualFrom;

  if (emailOnly && !emailOnly.endsWith('@marketingwithvibes.com')) {
    if (Array.isArray(to) && to.length === 1 && isValidEmail(to[0])) { 
      actualFrom = 'MarketingWithVibes <onboarding@resend.dev>';
      usedTestDomain = true;
    }
  }

  const { data, error } = await resend.emails.send({
    from: actualFrom,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend API Error:', error);
    let errorMessage = (error as any).message || 'Failed to send email';
    const errorName = (error as any).name || '';
    if (errorName === 'MissingApiKeyError' || errorMessage.includes('API key')) {
      errorMessage = 'Resend API Key is missing or invalid. Please check your RESEND_API_KEY environment variable.';
    } else if (errorName === 'ValidationError' || errorMessage.includes('from_email')) {
      errorMessage = `Sender domain for '${actualFrom}' is not verified with Resend. Please verify your domain or use a verified sender.`;
      if (usedTestDomain) {
        errorMessage += " (Using Resend's test domain for this test email as a fallback.)";
      }
    }
    throw new Error(errorMessage);
  }

  return { data, usedTestDomain };
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, html, testEmail } = body;

    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Subject and HTML content are required' },
        { status: 400 }
      );
    }

    // Get active subscribers
    const subscribers = await query(
      "SELECT email FROM newsletter_subscribers WHERE status = 'active'"
    );

    if (subscribers.length === 0 && !testEmail) {
      return NextResponse.json(
        { error: 'No active subscribers found to send to.' },
        { status: 400 }
      );
    }

    // If test email provided, send only to that email
    if (testEmail) {
      if (!isValidEmail(testEmail)) {
        return NextResponse.json(
          { error: 'Invalid test email format.' },
          { status: 400 }
        );
      }
      const newsletterHtml = getNewsletterTemplate({
        body: html,
      });
      const { data, usedTestDomain } = await sendNewsletterEmail({
        to: [testEmail],
        subject,
        html: newsletterHtml,
      });
      let message = 'Test email sent successfully.';
      if (usedTestDomain) {
        message += " Your domain is not verified, so Resend's test domain (onboarding@resend.dev) was used.";
      }
      return NextResponse.json({ message, sentTo: testEmail, resendData: data });
    }

    // Send to all subscribers (in batches to avoid rate limits)
    const emails = subscribers.map((s: any) => s.email);
    const batchSize = 50; // Resend allows up to 50 recipients per email
    
    // Use newsletter template for HTML content
    const newsletterHtml = getNewsletterTemplate({
      body: html,
    });
    
    let sent = 0;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const { data } = await sendNewsletterEmail({
        to: batch,
        subject,
        html: newsletterHtml,
      });
      sent += batch.length;
    }

    return NextResponse.json({ 
      message: 'Newsletter sent successfully',
      sentTo: sent,
      totalSubscribers: emails.length,
    });
  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

