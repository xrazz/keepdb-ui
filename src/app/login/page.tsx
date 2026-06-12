import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';
import { getAppSessionUser } from '@/lib/auth/app-session';

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const user = await getAppSessionUser();

  if (user) redirect('/dashboard');

  return <LoginForm initialStatus={params?.error || ''} />;
}
