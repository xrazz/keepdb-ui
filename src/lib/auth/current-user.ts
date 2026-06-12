import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export const requireCurrentUser = cache(async function requireCurrentUser() {
  if (!hasSupabaseEnv()) redirect('/login');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase!.auth.getUser();

  if (error || !data.user) {
    redirect('/login?error=Your session expired. Please sign in again.');
  }

  return data.user;
});
