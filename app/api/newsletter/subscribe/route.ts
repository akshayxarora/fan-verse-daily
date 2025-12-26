// Next.js API route for newsletter subscription
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { email, source } = body || {};

    // Validate email format
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await queryOne(
      'SELECT * FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate
        await query(
          'UPDATE newsletter_subscribers SET status = $1, subscribed_at = NOW() WHERE email = $2',
          ['active', email]
        );
        return NextResponse.json({ message: 'Successfully resubscribed' });
      }
    }

    // Create new subscriber
    const result = await query(
      'INSERT INTO newsletter_subscribers (email, status, source, subscribed_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [email, 'active', source || 'website']
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ message: 'Successfully subscribed', subscriber: result[0] });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

