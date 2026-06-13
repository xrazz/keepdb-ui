'use client';

import React, { useState } from 'react';

type WaitlistState = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistForm({ align = 'center' }: { align?: 'left' | 'center' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<WaitlistState>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('loading');
    setMessage('');

    try {
      // Hits your local Next.js route handler (Same origin, no CORS needed)
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const body = await response.json().catch(() => null);

      if (response.ok && body?.success) {
        setState('success');
        setMessage('🎉 You are on the list. We will contact you within 24 hours with your free access.');
        setEmail('');
        return;
      }

      setState('error');
      setMessage(body?.message || 'Could not join the waitlist right now.');
    } catch {
      setState('error');
      setMessage('Network error. Please try again later.');
    }
  }

  return (
    <form onSubmit={submit} className={align === 'left' ? 'w-full max-w-xl' : 'mx-auto w-full max-w-xl'}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-4 text-sm font-medium outline-none transition-colors placeholder:text-gray-500  focus:border-gray-300 sm:flex-1"
          disabled={state === 'loading'}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="h-12 shrink-0 rounded-full border border-black bg-black px-6 text-base font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'loading' ? 'Getting...' : 'Get free access'}
        </button>
      </div>
      {message && (
        <p
          className={`mt-4 text-left text-base font-medium leading-relaxed ${
            state === 'success' ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
