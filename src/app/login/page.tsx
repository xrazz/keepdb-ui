'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { hasSupabaseEnv } from '@/lib/supabase/env';

function getRedirectTo() {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/auth/callback`;
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M16.37 1.43c0 1.02-.42 2.01-1.15 2.76-.78.8-1.88 1.42-2.94 1.34-.14-.98.39-2.04 1.08-2.76.75-.78 2.05-1.38 3.01-1.34ZM20.2 17.37c-.53 1.2-.79 1.74-1.47 2.81-.96 1.47-2.31 3.31-3.98 3.33-1.49.01-1.87-.96-3.89-.95-2.02.01-2.44.97-3.93.96-1.67-.02-2.95-1.67-3.91-3.14-2.68-4.11-2.96-8.93-1.31-11.49 1.18-1.82 3.03-2.89 4.78-2.89 1.78 0 2.9.98 4.37.98 1.43 0 2.3-.98 4.36-.98 1.56 0 3.21.85 4.38 2.31-3.85 2.11-3.22 7.61.6 9.06Z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const configured = hasSupabaseEnv();

  async function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setLoading('email');

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getRedirectTo(),
        },
      });
      if (error) throw error;
      setStatus('Check your email for the sign-in code or link.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not send login email.');
    } finally {
      setLoading(null);
    }
  }

  async function signInWithProvider(provider: 'google' | 'apple') {
    setStatus('');
    setLoading(provider);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getRedirectTo(),
        },
      });
      if (error) throw error;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not start OAuth login.');
      setLoading(null);
    }
  }

  return (
    <div
      className="min-h-screen bg-white text-gray-900 font-medium font-[family-name:var(--font-dm-sans)]"
      style={{
        backgroundImage: "url('/sky.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
          <Image
            src="/keepdb-logo.png"
            alt="KeepDB logo"
            width={56}
            height={56}
            className="rounded-md"
          />
        </Link>
        <div className="flex gap-5 text-sm font-semibold tracking-tight">
          <Link href="/docs" className="text-gray-600 hover:text-black transition-colors">
            Docs
          </Link>
          <Link href="/agents" className="text-gray-600 hover:text-black transition-colors">
            Agents
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex min-h-[calc(100vh-104px)] max-w-2xl items-center justify-center px-6 pb-20 pt-8">
        <section className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-8 text-center">
            <Image
              src="/keepdb-logo.png"
              alt="KeepDB logo"
              width={64}
              height={64}
              className="mx-auto mb-5 rounded-md"
              priority
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">
              Sign in to KeepDB
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Use Google, Apple, or your email.
            </p>
          </div>

          {!configured && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              Supabase is not configured yet. Add the public Supabase env vars to this deployment.
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              disabled={!configured || loading === 'google'}
              onClick={() => signInWithProvider('google')}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleIcon />
              {loading === 'google' ? 'Opening Google...' : 'Continue with Google'}
            </button>
            <button
              type="button"
              disabled={!configured || loading === 'apple'}
              onClick={() => signInWithProvider('apple')}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AppleIcon />
              {loading === 'apple' ? 'Opening Apple...' : 'Continue with Apple'}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-semibold text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <form onSubmit={signInWithEmail} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-500"
            />
            <button
              type="submit"
              disabled={!configured || loading === 'email'}
              className="inline-flex w-full justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading === 'email' ? 'Sending code...' : 'Continue with email'}
            </button>
          </form>

          {status && (
            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
              {status}
            </div>
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
            By continuing, you agree to use KeepDB for your own authorized memory.
          </p>
        </section>
      </main>
    </div>
  );
}
