'use client';

import { useState } from 'react';
import type { AgentApiKey, AgentKeyAccess } from '@/lib/keepdb/agent-keys';
import type { KeepDbCollection } from '@/lib/keepdb/client';

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

function scopeLabel(scopes: string[]) {
  const canRead = scopes.includes('memory:read');
  const canWrite = scopes.includes('memory:write');

  if (canRead && canWrite) return 'Read + write';
  if (canRead) return 'Read only';
  if (canWrite) return 'Write only';
  return 'No memory access';
}

export function AgentKeyManager({
  initialKeys,
  collections,
}: {
  initialKeys: AgentApiKey[];
  collections: KeepDbCollection[];
}) {
  const [keys, setKeys] = useState<AgentApiKey[]>(initialKeys);
  const [folderOptions, setFolderOptions] = useState<KeepDbCollection[]>(collections);
  const [name, setName] = useState('API key');
  const [access, setAccess] = useState<AgentKeyAccess>('read_write');
  const [scopeMode, setScopeMode] = useState<'global' | 'folder'>('global');
  const [folderMode, setFolderMode] = useState<'existing' | 'new'>('existing');
  const [collectionId, setCollectionId] = useState(collections[0]?.id || '');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [rawKey, setRawKey] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function createKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setRawKey('');

    const response = await fetch('/api/keepdb/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        access,
        collectionId: scopeMode === 'folder' && folderMode === 'existing' ? collectionId : null,
        collectionName: scopeMode === 'folder' && folderMode === 'new' ? newCollectionName : null,
      }),
    });
    const body = (await response.json()) as ApiResponse;

    if (body.success && 'rawKey' in body) {
      const selectedCollection = folderOptions.find((collection) => collection.id === collectionId);
      setRawKey(body.rawKey);
      setCopied(false);
      setKeys((current) => [
        {
          ...body.key,
          collectionName:
            body.key.collectionName ||
            (scopeMode === 'folder'
              ? selectedCollection?.name || newCollectionName.trim() || null
              : null),
        },
        ...current,
      ]);
      if (body.key.collectionId && body.key.collectionName) {
        const createdCollectionId = body.key.collectionId;
        const createdCollectionName = body.key.collectionName;
        setFolderOptions((current) =>
          current.some((collection) => collection.id === createdCollectionId)
            ? current
            : [
                ...current,
                {
                  id: createdCollectionId,
                  name: createdCollectionName,
                  memories: 0,
                  contentBytes: 0,
                  createdAt: body.key.createdAt,
                  updatedAt: body.key.createdAt,
                },
              ],
        );
        setCollectionId(createdCollectionId);
        setFolderMode('existing');
        setNewCollectionName('');
      }
      setMessage('');
    } else if (!body.success) {
      setMessage(body.message);
    }

    setCreating(false);
  }

  async function copyRawKey() {
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-950">Create API or MCP key</h2>
        </div>
        <form onSubmit={createKey} className="space-y-3 px-4 py-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
            placeholder="Key name"
          />

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-500">Access</span>
              <select
                value={access}
                onChange={(event) => setAccess(event.target.value as AgentKeyAccess)}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
              >
                <option value="read_write">Read + write</option>
                <option value="read">Read only</option>
                <option value="write">Write only</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-500">Scope</span>
              <select
                value={scopeMode}
                onChange={(event) => {
                  setScopeMode(event.target.value as 'global' | 'folder');
                  setMessage('');
                }}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
              >
                <option value="global">All folders</option>
                <option value="folder">One folder</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-500">Folder</span>
              <select
                value={folderMode === 'new' ? '__new__' : collectionId}
                onChange={(event) => {
                  if (event.target.value === '__new__') {
                    setFolderMode('new');
                    return;
                  }
                  setFolderMode('existing');
                  setCollectionId(event.target.value);
                }}
                disabled={scopeMode !== 'folder'}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-400"
              >
                {folderOptions.length === 0 ? (
                  <option value="">No folders yet</option>
                ) : (
                  folderOptions.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))
                )}
                <option value="__new__">Create new folder...</option>
              </select>
            </label>
          </div>

          {scopeMode === 'folder' && folderMode === 'new' && (
            <input
              value={newCollectionName}
              onChange={(event) => setNewCollectionName(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
              placeholder="New folder name"
            />
          )}

          <button
            type="submit"
            disabled={
              creating ||
              (scopeMode === 'folder' &&
                ((folderMode === 'existing' && !collectionId) ||
                  (folderMode === 'new' && !newCollectionName.trim())))
            }
            className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create key'}
          </button>
        </form>
      </section>

      {rawKey && (
        <section className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-sm font-medium text-emerald-950">Copy this key now</p>
          <p className="mt-1 text-xs text-emerald-800">It will only be shown once.</p>
          <div className="mt-3 flex gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs text-zinc-900">
              {rawKey}
            </code>
            <button
              type="button"
              onClick={() => void copyRawKey()}
              className="h-9 rounded-md bg-emerald-950 px-3 text-xs font-medium text-white"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </section>
      )}

      {message && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      )}

      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-950">API and MCP keys</h2>
        </div>
        {keys.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-950">{key.name}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {scopeLabel(key.scopes)}
                    </span>
                    <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {key.collectionName ? key.collectionName : 'All folders'}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      {key.keyPrefix}... - last used {formatDate(key.lastUsedAt)}
                    </span>
                  </div>
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
          <div className="px-4 py-5 text-sm text-zinc-500">No API keys yet.</div>
        )}
      </section>
    </div>
  );
}
