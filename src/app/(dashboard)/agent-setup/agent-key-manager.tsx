'use client';

import { ChevronDown, KeyRound, Search } from 'lucide-react';
import { useState } from 'react';
import type { AgentApiKey, AgentKeyAccess } from '@/lib/keepdb/agent-keys';
import { buildCodexMcpCommand, buildMcpCommand, buildRestSaveExample } from '@/lib/keepdb/agent-instructions';
import type { KeepDbCollection } from '@/lib/keepdb/client';

type ApiResponse =
  | { success: true; results: AgentApiKey[] }
  | { success: true; key: AgentApiKey; rawKey: string }
  | { success: false; message: string };

function formatDate(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function scopeLabel(scopes: string[]) {
  const canRead = scopes.includes('memory:read');
  const canWrite = scopes.includes('memory:write');
  const canDelete = scopes.includes('memory:delete');

  if (canRead && canWrite && canDelete) return 'Read + write + delete';
  if (canRead && canWrite) return 'Read + write';
  if (canRead) return 'Read only';
  if (canWrite) return 'Write only';
  return 'No memory access';
}

function keyDisplay(keyPrefix: string) {
  return `${keyPrefix}••••••••••••`;
}

function CopyAction({
  label,
  text,
  copied,
  onCopy,
}: {
  label: string;
  text: string;
  copied: string;
  onCopy: (label: string, text: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(label, text)}
      className="h-8 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
    >
      {copied === label ? 'Copied' : label}
    </button>
  );
}

function SelectControl({
  children,
  className = '',
  wrapperClassName = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`${className} appearance-none border border-zinc-200/70 pr-10`}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        strokeWidth={1.8}
      />
    </div>
  );
}

const softControlClass =
  'rounded-full bg-zinc-50 font-medium outline-none shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] transition-colors placeholder:text-zinc-400 focus:border-zinc-300';

export function AgentKeyManager({
  initialKeys,
  collections,
}: {
  initialKeys: AgentApiKey[];
  collections: KeepDbCollection[];
}) {
  const [keys, setKeys] = useState<AgentApiKey[]>(initialKeys);
  const [folderOptions, setFolderOptions] = useState<KeepDbCollection[]>(collections);
  const [name, setName] = useState('');
  const [access, setAccess] = useState<AgentKeyAccess>('read_write');
  const [scopeMode, setScopeMode] = useState<'global' | 'folder'>('global');
  const [folderMode, setFolderMode] = useState<'existing' | 'new'>('existing');
  const [collectionId, setCollectionId] = useState(collections[0]?.id || '');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [rawKey, setRawKey] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | AgentKeyAccess>('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const filteredKeys = keys.filter((key) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      key.name.toLowerCase().includes(query) ||
      key.keyPrefix.toLowerCase().includes(query) ||
      (key.collectionName || 'all folders').toLowerCase().includes(query);

    if (!matchesQuery) return false;
    if (folderFilter === 'global' && key.collectionName) return false;
    if (folderFilter !== 'all' && folderFilter !== 'global' && key.collectionName !== folderFilter) return false;
    if (filterMode === 'all') return true;
    if (filterMode === 'read') return key.scopes.includes('memory:read') && !key.scopes.includes('memory:write');
    if (filterMode === 'write') return key.scopes.includes('memory:write') && !key.scopes.includes('memory:read');
    if (filterMode === 'read_write_delete') return key.scopes.includes('memory:delete');
    return key.scopes.includes('memory:read') && key.scopes.includes('memory:write') && !key.scopes.includes('memory:delete');
  });

  async function createKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage('API key name is required.');
      return;
    }
    setCreating(true);
    setRawKey('');

    const response = await fetch('/api/keepdb/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmedName,
        access,
        collectionId: scopeMode === 'folder' && folderMode === 'existing' ? collectionId : null,
        collectionName: scopeMode === 'folder' && folderMode === 'new' ? newCollectionName : null,
      }),
    });
    const body = (await response.json()) as ApiResponse;

    if (body.success && 'rawKey' in body) {
      const selectedCollection = folderOptions.find((collection) => collection.id === collectionId);
      setRawKey(body.rawKey);
      setCopied('');
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
      setShowCreateModal(false);
    } else if (!body.success) {
      setMessage(body.message);
    }

    setCreating(false);
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1600);
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

  function scopeValue() {
    if (scopeMode === 'global') return '__all__';
    if (folderMode === 'new') return '__new__';
    return collectionId;
  }

  function updateScope(value: string) {
    setMessage('');
    if (value === '__all__') {
      setScopeMode('global');
      setFolderMode('existing');
      return;
    }
    setScopeMode('folder');
    if (value === '__new__') {
      setFolderMode('new');
      return;
    }
    setFolderMode('existing');
    setCollectionId(value);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <label className={`flex h-8 w-full max-w-[180px] items-center border border-zinc-200/70 px-3 ${softControlClass}`}>
            <Search className="mr-2 size-3.5 shrink-0 text-zinc-600" strokeWidth={1.9} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search keys"
              className="min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
            />
          </label>
          <SelectControl
            value={filterMode}
            onChange={(event) => setFilterMode(event.target.value as 'all' | AgentKeyAccess)}
            wrapperClassName="w-[132px]"
            className={`h-8 w-full pl-3 text-xs text-zinc-600 ${softControlClass}`}
          >
            <option value="all">All access</option>
            <option value="read_write">Read + write</option>
            <option value="read_write_delete">Can delete</option>
            <option value="read">Read only</option>
            <option value="write">Write only</option>
          </SelectControl>
          <SelectControl
            value={folderFilter}
            onChange={(event) => setFolderFilter(event.target.value)}
            wrapperClassName="w-[148px]"
            className={`h-8 w-full pl-3 text-xs text-zinc-600 ${softControlClass}`}
          >
            <option value="all">All folders</option>
            <option value="global">Global keys</option>
            {folderOptions.map((collection) => (
              <option key={collection.id} value={collection.name}>
                {collection.name}
              </option>
            ))}
          </SelectControl>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="h-8 rounded-full bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Create API key
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/80 px-4 pt-24">
          <form onSubmit={createKey} className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(24,24,27,0.04)]">
            <div>
              <h2 className="text-sm font-medium text-zinc-950">Create API key</h2>
              <p className="mt-1 text-xs font-medium text-zinc-500">Choose what this key can access.</p>
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={`h-8 w-full border border-zinc-200/70 px-3 text-xs text-zinc-700 ${softControlClass}`}
                placeholder="Key name"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-500">Access</span>
                  <SelectControl
                    value={access}
                    onChange={(event) => setAccess(event.target.value as AgentKeyAccess)}
                    wrapperClassName="w-full"
                    className={`h-8 w-full pl-3 text-xs text-zinc-600 ${softControlClass}`}
                  >
                    <option value="read_write">Read + write</option>
                    <option value="read_write_delete">Read + write + delete</option>
                    <option value="read">Read only</option>
                    <option value="write">Write only</option>
                  </SelectControl>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-500">Folders</span>
                  <SelectControl
                    value={scopeValue()}
                    onChange={(event) => updateScope(event.target.value)}
                    wrapperClassName="w-full"
                    className={`h-8 w-full pl-3 text-xs text-zinc-600 ${softControlClass}`}
                  >
                    <option value="__all__">All folders</option>
                    <option value="__new__">+ Create new folder...</option>
                    {folderOptions.length === 0 ? (
                      <option value="">No folders yet</option>
                    ) : (
                      folderOptions.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))
                  )}
                  </SelectControl>
                </label>
              </div>

              {scopeMode === 'folder' && folderMode === 'new' && (
                <input
                  value={newCollectionName}
                  onChange={(event) => setNewCollectionName(event.target.value)}
                  className={`h-8 w-full border border-zinc-200/70 px-3 text-xs text-zinc-700 ${softControlClass}`}
                  placeholder="New folder name"
                />
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-8 rounded-full bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    creating ||
                    !name.trim() ||
                    (scopeMode === 'folder' &&
                      ((folderMode === 'existing' && !collectionId) ||
                        (folderMode === 'new' && !newCollectionName.trim())))
                  }
                  className="h-8 rounded-full bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create key'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {rawKey && (
        <section className="rounded-md border border-emerald-200 bg-white px-4 py-4">
          <p className="text-base font-medium text-emerald-950">Copy this key now</p>
          <p className="mt-1 text-sm font-medium text-emerald-800">It will only be shown once. Use it for MCP, REST, or your agent setup.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900">
              {rawKey}
            </code>
            <button
              type="button"
              onClick={() => void copyText('Copy key', rawKey)}
              className="h-9 rounded-md bg-emerald-950 px-3 text-xs font-medium text-white"
            >
              {copied === 'Copy key' ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['Claude MCP', buildMcpCommand(rawKey)],
              ['Codex MCP', buildCodexMcpCommand(rawKey)],
              ['REST save', buildRestSaveExample(rawKey)],
            ].map(([label, text]) => (
              <div key={label} className="rounded-md border border-zinc-200 px-3 py-3">
                <p className="text-sm font-medium text-zinc-950">{label}</p>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-zinc-500">{text}</p>
                <div className="mt-3">
                  <CopyAction label={`Copy ${label}`} text={text} copied={copied} onCopy={(copyLabel, value) => void copyText(copyLabel, value)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {message && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      )}

      <section>
        {filteredKeys.length > 0 ? (
          <div className="space-y-2">
            {filteredKeys.map((key) => (
              <div key={key.id} className="flex min-w-0 items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                    <p className="min-w-0 max-w-[260px] truncate text-sm font-medium text-zinc-950">{key.name}</p>
                    <span className="min-w-0 max-w-[320px] truncate text-xs font-medium text-zinc-500">{keyDisplay(key.keyPrefix)}</span>
                    <span className="hidden shrink-0 text-xs font-medium text-zinc-400 sm:inline">·</span>
                    <span className="hidden shrink-0 text-xs font-medium text-zinc-500 sm:inline">
                      {scopeLabel(key.scopes)}
                    </span>
                    <span className="hidden shrink-0 text-xs font-medium text-zinc-400 lg:inline">·</span>
                    <span className="hidden shrink-0 text-xs font-medium text-zinc-500 lg:inline">
                      {formatDate(key.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="max-w-[150px] truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {key.collectionName ? key.collectionName : 'All folders'}
                  </span>
                  <button
                    type="button"
                    onClick={() => void revokeKey(key.id)}
                    className="h-8 w-fit rounded-full bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-md bg-zinc-50 px-4 py-8 text-center">
            {keys.length > 0 ? (
              <>
                <Search className="mb-3 size-5 text-zinc-400" strokeWidth={1.8} />
                <p className="text-sm font-medium text-zinc-700">No API keys match this view.</p>
                <p className="mt-1 text-xs font-medium text-zinc-400">Try another search or clear the filters.</p>
              </>
            ) : (
              <>
                <KeyRound className="mb-3 size-5 text-zinc-400" strokeWidth={1.8} />
                <p className="text-sm font-medium text-zinc-700">No API keys yet.</p>
                <p className="mt-1 text-xs font-medium text-zinc-400">Create a scoped key for agents, MCP, or API access.</p>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
