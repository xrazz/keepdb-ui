import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import {
  APP_SESSION_COOKIE,
  createAppSessionToken,
  getAppSessionCookieOptions,
} from '@/lib/auth/app-session';
import { getSupabaseBrowserEnv, hasSupabaseEnv } from '@/lib/supabase/env';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return jsonError('Supabase auth is not configured.', 500);
  }

  const body = await request.json().catch(() => null);
  const accessToken = typeof body?.access_token === 'string' ? body.access_token : '';

  if (!accessToken) {
    return jsonError('Missing auth access token.');
  }

  const { url, anonKey } = getSupabaseBrowserEnv();
  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user?.email) {
    return jsonError(error?.message || 'Could not verify login session.');
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    APP_SESSION_COOKIE,
    createAppSessionToken({
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
    }),
    getAppSessionCookieOptions(),
  );

  return response;
}
