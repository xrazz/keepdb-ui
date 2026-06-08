'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ConnectForm({ connected }: { connected: boolean }) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function connect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const response = await fetch('/api/keepdb/connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    const body = await response.json().catch(() => null);

    setLoading(false);
    if (!response.ok || !body?.success) {
      setMessage(body?.message || 'Could not connect KeepDB.');
      return;
    }

    setApiKey('');
    setMessage('Connected.');
    router.refresh();
  }

  async function disconnect() {
    setLoading(true);
    setMessage('');
    await fetch('/api/keepdb/connection', { method: 'DELETE' });
    setLoading(false);
    setMessage('Disconnected.');
    router.refresh();
  }

  return (
    <div className="px-4 py-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-950">
            {connected ? 'Connected' : 'Not connected'}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {connected
              ? 'This browser session can load your KeepDB dashboard.'
              : 'Paste your KeepDB key to connect this dashboard.'}
          </p>
        </div>
        {connected && (
          <button
            type="button"
            onClick={disconnect}
            disabled={loading}
            className="h-8 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50"
          >
            Disconnect
          </button>
        )}
      </div>

      <form onSubmit={connect} className="space-y-3">
        <input
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="keep_sk_..."
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 font-mono text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
        />
        <button
          type="submit"
          disabled={loading || !apiKey.trim()}
          className="h-9 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {connected ? 'Update connection' : 'Connect'}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-zinc-500">{message}</p>}
    </div>
  );
}
