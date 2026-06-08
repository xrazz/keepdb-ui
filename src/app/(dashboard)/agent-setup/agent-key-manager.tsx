'use client';

import { useState } from 'react';
import type { AgentApiKey } from '@/lib/keepdb/agent-keys';

type ApiResponse =
  | { success: true; results: AgentApiKey[] }
  | { success: true; key: AgentApiKey; rawKey: string }
  | { success: false; message: string };

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function AgentKeyManager({ initialKeys }: { initialKeys: AgentApiKey[] }) {
  const [keys, setKeys] = useState<AgentApiKey[]>(initialKeys);
  const [name, setName] = useState('Codex agent');
  const [rawKey, setRawKey] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  async function createKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setRawKey('');

    const response = await fetch('/api/keepdb/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const body = (await response.json()) as ApiResponse;

    if (body.success && 'rawKey' in body) {
      setRawKey(body.rawKey);
      setKeys((current) => [body.key, ...current]);
      setMessage('');
    } else if (!body.success) {
      setMessage(body.message);
    }

    setCreating(false);
  }

  async function revokeKey(id: string) {
    const response = await fetch(`/api/keepdb/api-keys/${id}`, { method: 'DELETE' });
    const body = (await response.json()) as { success: boolean; message?: string };

    if (body.success) {
      setKeys((current) => current.filter((key) => key.id !== id));
      return;
    }

    setMessage(body.message || 'Could not revoke API key.');
  }

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Create an agent key</h2>
        </div>
        <form onSubmit={createKey} className="flex flex-col gap-3 px-4 py-4 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 min-w-0 flex-1 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
            placeholder="Key name"
          />
          <button
            type="submit"
            disabled={creating}
            className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create key'}
          </button>
        </form>
      </section>

      {rawKey && (
        <section className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-sm font-semibold text-emerald-950">Copy this key now</p>
          <p className="mt-1 text-xs text-emerald-800">It will only be shown once.</p>
          <code className="mt-3 block overflow-x-auto rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs text-zinc-900">
            {rawKey}
          </code>
        </section>
      )}

      {message && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      )}

      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Agent keys</h2>
        </div>
        {keys.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-950">{key.name}</p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    {key.keyPrefix}... - last used {formatDate(key.lastUsedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void revokeKey(key.id)}
                  className="h-8 rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-5 text-sm text-zinc-500">No agent keys yet.</div>
        )}
      </section>
    </div>
  );
}
