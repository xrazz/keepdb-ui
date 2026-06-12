import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function getSafeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  return value;
}

function redirectToLogin(origin: string, message: string) {
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('error', message);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = getSafeNext(url.searchParams.get('next'));
  const providerError =
    url.searchParams.get('error_description') || url.searchParams.get('error');

  if (providerError) {
    return redirectToLogin(url.origin, providerError);
  }

  if (!code) {
    return redirectToLogin(url.origin, 'Missing login code. Request a fresh sign-in email.');
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return redirectToLogin(url.origin, 'Supabase auth is not configured.');
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const staleLinkMessage =
      'This sign-in link is stale or was opened from a different domain. Request a fresh code from this page, then use the 6-digit code.';
    return redirectToLogin(
      url.origin,
      error.message.toLowerCase().includes('unsupported state')
        ? staleLinkMessage
        : error.message,
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
