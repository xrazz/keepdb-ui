import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { hasSupabaseEnv, getSupabaseBrowserEnv } from './env';

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) return null;

  const { url, anonKey } = getSupabaseBrowserEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components cannot always write cookies. Middleware handles refreshes.
        }
      },
    },
  });
}
