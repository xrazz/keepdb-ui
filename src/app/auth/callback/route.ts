import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function getSafeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  return value;
}

function redirectToPath(path: string) {
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: path,
    },
  });
}

function redirectToLogin(message: string) {
  const params = new URLSearchParams({ error: message });
  return redirectToPath(`/login?${params.toString()}`);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = getSafeNext(url.searchParams.get('next'));
  const providerError =
    url.searchParams.get('error_description') || url.searchParams.get('error');

  if (providerError) {
    return redirectToLogin(providerError);
  }

  if (!code) {
    return redirectToLogin('Missing login code. Request a fresh sign-in email.');
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return redirectToLogin('Supabase auth is not configured.');
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const staleLinkMessage =
      'This sign-in link is stale or was opened from a different domain. Request a fresh code from this page, then use the 6-digit code.';
    return redirectToLogin(
      error.message.toLowerCase().includes('unsupported state')
        ? staleLinkMessage
        : error.message,
    );
  }

  return redirectToPath(next);
}
