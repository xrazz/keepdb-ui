'use client';

import React, { useState } from 'react';

type WaitlistState = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistForm() {
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
        setMessage('You are on the waitlist.');
        setEmail('');
        return;
      }

      setState('error');
      setMessage(body?.message || 'Could not join the waitlist right now.');
    } catch (err) {
      setState('error');
      setMessage('Network error. Please try again later.');
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-12 w-full sm:flex-1 rounded-none border border-gray-400 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
          disabled={state === 'loading'}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="h-12 rounded-none bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shrink-0"
        >
          {state === 'loading' ? 'Joining...' : 'Join V1 beta'}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-left text-xs font-medium ${
            state === 'success' ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}