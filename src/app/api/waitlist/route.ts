import { NextRequest, NextResponse } from 'next/server';
import { getKeepDbSql } from '@/lib/keepdb/database';

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

    const db = getKeepDbSql();

    await db`
      CREATE TABLE IF NOT EXISTS waitlist_signups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        source TEXT NOT NULL DEFAULT 'landing',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      INSERT INTO waitlist_signups (email, source)
      VALUES (${email}, 'landing')
      ON CONFLICT (email)
      DO UPDATE SET updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Could not join the waitlist right now.' },
      { status: 500 },
    );
  }
}
