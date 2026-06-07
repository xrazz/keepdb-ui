import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseBrowserEnv } from './env';

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseBrowserEnv();
  if (!url || !anonKey) {
    throw new Error('Supabase env vars are missing');
  }
  return createBrowserClient(url, anonKey);
}
