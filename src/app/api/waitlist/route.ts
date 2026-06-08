import { NextRequest, NextResponse } from 'next/server';
import { getKeepDbApiBase, getKeepDbWaitlistApiKey } from '@/lib/keepdb/config';

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Enter a valid email address.' },
        { status: 400 },
      );
    }

    const signedUpAt = new Date().toISOString();
    const response = await fetch(`${getKeepDbApiBase()}/memory`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getKeepDbWaitlistApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: 'keepdb-waitlist',
        type: 'waitlist-signup',
        content: [
          'KeepDB waitlist signup',
          `email: ${email}`,
          'source: landing',
          `timestamp: ${signedUpAt}`,
        ].join('\n'),
        metadata: {
          email,
          source: 'landing',
          tags: ['waitlist', 'keepdb-beta'],
          signedUpAt,
        },
      }),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      throw new Error(result?.message || 'KeepDB waitlist save failed');
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Could not join the waitlist right now.' },
      { status: 500 },
    );
  }
}
