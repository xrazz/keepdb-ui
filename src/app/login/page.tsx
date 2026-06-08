import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export default async function LoginPage() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase!.auth.getUser();

    if (data.user) redirect('/dashboard');
  }

  return <LoginForm />;
}
