export function getSupabaseBrowserEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
}

export function hasSupabaseEnv() {
  const { url, anonKey } = getSupabaseBrowserEnv();
  return Boolean(url && anonKey);
}

export function getPublicAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
}
