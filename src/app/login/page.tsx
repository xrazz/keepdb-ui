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

  async function signInWithProvider(provider: 'google' | 'azure') {
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
    <div className="min-h-screen bg-white text-gray-900 font-medium font-[family-name:var(--font-dm-sans)]">
      <div
        style={{
          backgroundImage: "url('/sky.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
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

        <header className="max-w-2xl mx-auto px-6 pt-12 md:pt-16 pb-24">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-gray-900">
            Sign in to KeepDB
          </h1>
          <p className="text-sm text-gray-500 mt-2">Use email, Google, or Microsoft.</p>
        </header>
      </div>

      <main className="max-w-2xl mx-auto px-6 -mt-8 pb-24 relative z-10">
        <div className="text-sm text-gray-600 leading-relaxed space-y-8">
          {!configured && (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
              NEXT_PUBLIC_SUPABASE_ANON_KEY to the deployment environment.
            </section>
          )}

          <section>
            <h2 className="text-sm text-gray-900 font-bold mb-3">Email code</h2>
            <form onSubmit={signInWithEmail} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-500"
              />
              <button
                type="submit"
                disabled={!configured || loading === 'email'}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === 'email' ? 'Sending...' : 'Send login code'}
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-bold mb-3">OAuth</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={!configured || loading === 'google'}
                onClick={() => signInWithProvider('google')}
                className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === 'google' ? 'Opening...' : 'Continue with Google'}
              </button>
              <button
                type="button"
                disabled={!configured || loading === 'azure'}
                onClick={() => signInWithProvider('azure')}
                className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === 'azure' ? 'Opening...' : 'Continue with Microsoft'}
              </button>
            </div>
          </section>

          {status && (
            <section className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
              {status}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
