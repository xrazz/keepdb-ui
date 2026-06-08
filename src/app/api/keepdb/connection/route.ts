import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { KEEPDB_CONNECTION_COOKIE } from '@/lib/keepdb/client';

const DEFAULT_KEEPDB_API_BASE = 'https://keepdb-api-production.up.railway.app';

export async function POST(request: NextRequest) {
  await requireCurrentUser();

  const body = await request.json().catch(() => null);
  const apiKey = typeof body?.apiKey === 'string' ? body.apiKey.trim() : '';

  if (!apiKey.startsWith('keep_sk_')) {
    return NextResponse.json({ success: false, message: 'Enter a valid KeepDB key.' }, { status: 400 });
  }

  const apiBase = (process.env.KEEPDB_API_BASE || DEFAULT_KEEPDB_API_BASE).replace(/\/$/, '');
  const response = await fetch(`${apiBase}/memories?limit=1`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ success: false, message: 'KeepDB key could not be verified.' }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(KEEPDB_CONNECTION_COOKIE, apiKey, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await requireCurrentUser();

  const cookieStore = await cookies();
  cookieStore.delete(KEEPDB_CONNECTION_COOKIE);

  return NextResponse.json({ success: true });
}
