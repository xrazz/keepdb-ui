import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export async function requireCurrentUser() {
  if (!hasSupabaseEnv()) redirect('/login');

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();

  if (!data.user) redirect('/login');
  return data.user;
}

export async function requireCurrentSession() {
  if (!hasSupabaseEnv()) redirect('/login');

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getSession();

  if (!data.session?.user || !data.session.access_token) redirect('/login');
  return data.session;
}
