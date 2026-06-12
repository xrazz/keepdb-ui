import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase!.auth.getUser();

    if (data.user) redirect('/dashboard');
  }

  return <LoginForm initialStatus={params?.error || ''} />;
}
