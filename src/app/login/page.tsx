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
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseEnv();

  async function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setLoading(true);

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
      setLoading(false);
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
              Enter your email and we&apos;ll send a sign-in code.
            </p>
          </div>

          {!configured && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              Supabase is not configured yet. Add the public Supabase env vars to this deployment.
            </div>
          )}

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
              disabled={!configured || loading}
              className="inline-flex w-full justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Sending code...' : 'Send login code'}
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
