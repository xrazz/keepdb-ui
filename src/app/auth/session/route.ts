import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
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
  const refreshToken = typeof body?.refresh_token === 'string' ? body.refresh_token : '';

  if (!accessToken || !refreshToken) {
    return jsonError('Missing auth session tokens.');
  }

  const { url, anonKey } = getSupabaseBrowserEnv();
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return jsonError(error.message);
  }

  return response;
}
